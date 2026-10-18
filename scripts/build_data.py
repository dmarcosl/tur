#!/usr/bin/env python3
"""Build the public, normalized TUR price history from local source CSVs."""

from __future__ import annotations

import csv
import json
from decimal import Decimal
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CNMC_FILE = ROOT / "ds_1607_1.csv"
HISTORY_FILE = ROOT / "tur_prices.csv"
OUTPUT_FILE = ROOT / "data" / "tur-prices.json"
TARIFF_ORDER = {"TUR.1": 1, "TUR.2": 2, "TUR.3": 3}
CNMC_ID = "CNMC_DS_1607_1"


def decimal_value(value: str) -> Decimal:
    return Decimal(value.strip().replace(",", "."))


def read_cnmc() -> dict[tuple[str, str], tuple[Decimal, Decimal]]:
    """Reconstruct the source's separate fixed and variable component rows."""
    if not CNMC_FILE.exists():
        raise FileNotFoundError(f"Falta el fichero de entrada local: {CNMC_FILE.name}")

    by_key: dict[tuple[str, str], dict[str, Decimal]] = {}
    with CNMC_FILE.open(encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source, delimiter=";")
        for row in reader:
            label = row["Tipo de Tarifa de último recurso (TUR)"]
            tariff = next((name for name in TARIFF_ORDER if label.startswith(name)), None)
            if tariff is None:
                continue

            period = f"{row['Periodo']}-01"
            key = (period, tariff)
            values = by_key.setdefault(key, {})
            is_fixed = label.endswith("T.fijo")
            component = "fixed" if is_fixed else "variable" if label.endswith("T.var") else None
            if component is None:
                raise ValueError(f"Componente CNMC desconocido: {label}")

            prefix = "TUR.1 (Con. menor 5.000  kWh/año)" if tariff == "TUR.1" else "TUR.2 (Con. menor 50.000  kWh/año)"
            suffix = "T.fijo (€/cliente/mes)" if is_fixed else "T.var (cent/KWh)"
            raw_value = row[f"{prefix}{suffix}"].strip()
            if not raw_value:
                raise ValueError(f"Valor CNMC vacío en {period} {tariff} {component}")
            if component in values:
                raise ValueError(f"Componente CNMC duplicado en {period} {tariff} {component}")
            values[component] = decimal_value(raw_value)

    result: dict[tuple[str, str], tuple[Decimal, Decimal]] = {}
    for key, values in by_key.items():
        if set(values) != {"fixed", "variable"}:
            raise ValueError(f"Falta un componente CNMC en {key}: {sorted(values)}")
        result[key] = (values["fixed"], values["variable"])
    return result


def read_history() -> list[dict[str, str]]:
    if not HISTORY_FILE.exists():
        raise FileNotFoundError(f"Falta el fichero de entrada local: {HISTORY_FILE.name}")
    with HISTORY_FILE.open(encoding="utf-8-sig", newline="") as source:
        records = list(csv.DictReader(source))
    if not records:
        raise ValueError("El fichero de precios normalizado está vacío")
    return records


def validate_cnmc_match(records: list[dict[str, str]], cnmc: dict[tuple[str, str], tuple[Decimal, Decimal]]) -> None:
    prepared = {
        (row["valid_from"], row["tariff"]): row
        for row in records
        if row["source_id"] == CNMC_ID
    }
    if len(prepared) != sum(row["source_id"] == CNMC_ID for row in records):
        raise ValueError("Hay claves de fecha/tarifa duplicadas en las filas CNMC")
    if set(prepared) != set(cnmc):
        missing = len(set(cnmc) - set(prepared))
        extra = len(set(prepared) - set(cnmc))
        raise ValueError(f"La serie preparada no coincide con CNMC (faltan {missing}, sobran {extra})")

    for key, (fixed, variable) in cnmc.items():
        row = prepared[key]
        if decimal_value(row["fixed_eur_month"]) != fixed:
            raise ValueError(f"Término fijo distinto de CNMC en {key}")
        if decimal_value(row["variable_cent_kwh"]) != variable:
            raise ValueError(f"Término variable distinto de CNMC en {key}")


def normalized_record(row: dict[str, str]) -> dict[str, object]:
    tariff = row["tariff"]
    from_cnmc = row["source_id"] == CNMC_ID
    period = row["valid_from"][:7] if from_cnmc else row["valid_from"]

    if from_cnmc:
        lower = 0 if tariff == "TUR.1" else 5000
        notes = ""
        if period == "2012-05":
            notes = (
                "El dato se publica como periodo mensual. La resolución del BOE "
                "que introdujo estos precios surtió efectos el 28 de abril de 2012 "
                "(BOE-A-2012-5669)."
            )
    else:
        lower = int(row["consumption_min_exclusive_kwh_year"])
        notes = row["notes"].strip()
        notice_code = None
        if row["valid_from"] == "2026-10-01":
            notes = (
                "Cálculo con medidas del Real Decreto-ley 7/2026 y el límite "
                "temporal del Real Decreto-ley 25/2026."
            )
            notice_code = "temporary-calculation"

    if from_cnmc:
        notice_code = None

    return {
        "period": period,
        "precision": "month" if from_cnmc else "day",
        "tariff": tariff,
        "fixedEurMonth": row["fixed_eur_month"],
        "variableCentKwh": row["variable_cent_kwh"],
        "consumptionMinExclusiveKwhYear": lower,
        "consumptionMaxInclusiveKwhYear": int(row["consumption_max_inclusive_kwh_year"]),
        "sourceId": row["source_id"],
        "sourceUrl": row["source_url"],
        "verification": row["verification"],
        "sourceType": "cnmc_monthly" if from_cnmc else "boe_resolution",
        "notes": notes,
        "noticeCode": notice_code,
    }


def main() -> None:
    cnmc = read_cnmc()
    records = read_history()
    validate_cnmc_match(records, cnmc)

    observations = [normalized_record(row) for row in records]
    observations.sort(key=lambda item: (item["period"], TARIFF_ORDER[item["tariff"]]))
    duplicate_keys = [(item["period"], item["tariff"]) for item in observations]
    if len(duplicate_keys) != len(set(duplicate_keys)):
        raise ValueError("Hay claves periodo/tarifa duplicadas en el conjunto final")

    payload = {
        "schemaVersion": 1,
        "attribution": {
            "publisher": "Comisión Nacional de los Mercados y la Competencia (CNMC)",
            "dataset": "Componentes de la Tarifa de Último Recurso",
            "license": "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
            "historicalSourceUrl": "https://catalogodatos.cnmc.es/dataset/ds_1607_1",
        },
        "coverage": {
            "cnmcMonthlyThrough": "2021-09",
            "boeResolutionsFrom": "2021-10-01",
        },
        "observations": observations,
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generadas {len(observations)} observaciones en {OUTPUT_FILE.relative_to(ROOT)}")
    print(f"Verificadas {len(cnmc)} observaciones de precios frente al CSV original de la CNMC")


if __name__ == "__main__":
    main()
