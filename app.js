const messages = {
  es: {
    skipLink: "Saltar al contenido",
    languageLabel: "Idioma",
    systemTheme: "Tema del sistema",
    eyebrow: "Gas natural · tarifa regulada",
    title: 'El precio de la TUR,<br /><span>claro y al día.</span>',
    description: "Los términos fijo y variable de TUR.1, TUR.2 y TUR.3, con su fuente oficial y toda su evolución.",
    unitNoteLabel: "Precios publicados",
    unitNoteValue: "Antes de impuestos",
    unitNoteDetail: "No incluye el cálculo de una factura individual.",
    currentKicker: "EN VIGOR",
    currentTitle: "Precios actuales",
    currentAside: "Una tarjeta por tramo de consumo",
    historyKicker: "2009 — ACTUALIDAD",
    historyTitle: "Cómo ha cambiado la TUR",
    historyAside: "Tres tarifas, dos componentes",
    chartFirstLabel: "ENERGÍA",
    chartSecondLabel: "CUOTA",
    variableTitle: "Término variable",
    fixedTitle: "Término fijo",
    fixedUnit: "€/mes",
    variableFootnote: "El término variable se expresa por kilovatio hora.",
    fixedFootnote: "El término fijo se expresa por cliente y mes.",
    chartInteractionHint: "Mueve el cursor por el gráfico o enfoca un punto para comparar las tres tarifas.",
    historyNote: "La serie de la CNMC es mensual hasta septiembre de 2021. TUR.3 aparece desde octubre de 2021. Las líneas muestran los precios por periodos, no una variación diaria.",
    footerDescriptor: "Datos abiertos, precios regulados",
    attribution: "Serie histórica: CNMC, enero de 2009–septiembre de 2021 (CC BY-SA 4.0). Desde octubre de 2021: resoluciones del BOE.",
    footerDisclaimer: "TUR.1–3 · Importes antes de impuestos · No es una estimación de factura",
    legendLabel: "Mostrar u ocultar tarifas en los gráficos",
    fixedMetric: "Fijo",
    variableMetric: "Variable",
    effectiveFrom: "Vigente desde",
    officialSource: "Ver fuente oficial",
    changeVsPrevious: "vs. anterior",
    firstRevision: "Primera revisión",
    noData: "Sin dato",
    temporaryMeasure: "Cálculo sujeto a medidas extraordinarias vigentes para este periodo.",
    bandTUR1: "Hasta 5.000 kWh/año",
    bandTUR2: "Más de 5.000 y hasta 15.000 kWh/año",
    bandTUR3: "Más de 15.000 y hasta 50.000 kWh/año",
    chartVariableDescription: "Evolución histórica del precio variable de TUR.1, TUR.2 y TUR.3. La serie de TUR.3 comienza en octubre de 2021.",
    chartFixedDescription: "Evolución histórica del precio fijo de TUR.1, TUR.2 y TUR.3. La serie de TUR.3 comienza en octubre de 2021.",
    chartNoSeries: "Activa una tarifa en la leyenda para mostrarla.",
    dataError: "No se han podido cargar los precios. Vuelve a intentarlo más tarde.",
    chartPointLabel: (tariff, date) => `${tariff}, ${date}`,
  },
  en: {
    skipLink: "Skip to content",
    languageLabel: "Language",
    systemTheme: "System theme",
    eyebrow: "Natural gas · regulated tariff",
    title: 'The TUR price,<br /><span>clear and up to date.</span>',
    description: "Fixed and variable charges for TUR.1, TUR.2 and TUR.3, with the official source and full history.",
    unitNoteLabel: "Published prices",
    unitNoteValue: "Before tax",
    unitNoteDetail: "Does not calculate an individual bill.",
    currentKicker: "IN EFFECT",
    currentTitle: "Current prices",
    currentAside: "One card for each consumption band",
    historyKicker: "2009 — TODAY",
    historyTitle: "How the TUR has changed",
    historyAside: "Three tariffs, two charges",
    chartFirstLabel: "ENERGY",
    chartSecondLabel: "STANDING CHARGE",
    variableTitle: "Variable charge",
    fixedTitle: "Fixed charge",
    fixedUnit: "€/month",
    variableFootnote: "The variable charge is shown per kilowatt hour.",
    fixedFootnote: "The fixed charge is shown per customer and month.",
    chartInteractionHint: "Move across the chart or focus a point to compare all three tariffs.",
    historyNote: "The CNMC series is monthly through September 2021. TUR.3 starts in October 2021. The step lines show prices by effective period, not daily changes.",
    footerDescriptor: "Open data, regulated prices",
    attribution: "Historical series: CNMC, January 2009–September 2021 (CC BY-SA 4.0). From October 2021: BOE resolutions.",
    footerDisclaimer: "TUR.1–3 · Prices before tax · Not an individual bill estimate",
    legendLabel: "Show or hide tariffs in the charts",
    fixedMetric: "Fixed",
    variableMetric: "Variable",
    effectiveFrom: "In effect from",
    officialSource: "View official source",
    changeVsPrevious: "vs. prev.",
    firstRevision: "First revision",
    noData: "No data",
    temporaryMeasure: "Calculation is subject to temporary measures in effect for this period.",
    bandTUR1: "Up to 5,000 kWh/year",
    bandTUR2: "More than 5,000 and up to 15,000 kWh/year",
    bandTUR3: "More than 15,000 and up to 50,000 kWh/year",
    chartVariableDescription: "Historical variable price for TUR.1, TUR.2 and TUR.3. The TUR.3 series starts in October 2021.",
    chartFixedDescription: "Historical fixed price for TUR.1, TUR.2 and TUR.3. The TUR.3 series starts in October 2021.",
    chartNoSeries: "Turn on a tariff in the legend to show it.",
    dataError: "Prices could not be loaded. Please try again later.",
    chartPointLabel: (tariff, date) => `${tariff}, ${date}`,
  },
};

const tariffOrder = ["TUR.1", "TUR.2", "TUR.3"];
const paletteKeys = { "TUR.1": "--series-1", "TUR.2": "--series-2", "TUR.3": "--series-3" };
const root = document.documentElement;
const numberFormatters = new Map();
let language = getInitialLanguage();
let dataset;
let visibleTariffs = new Set(tariffOrder);

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem("tur-gas-language");
    if (saved === "es" || saved === "en") return saved;
  } catch {
    // Storage can be unavailable in private browsing; use the browser locale.
  }
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "es";
}

function currentMessages() {
  return messages[language];
}

function setLanguage(nextLanguage) {
  if (!(nextLanguage in messages)) return;
  language = nextLanguage;
  try {
    localStorage.setItem("tur-gas-language", language);
  } catch {
    // The language still changes for this visit when storage is unavailable.
  }
  applyLanguage();
  if (dataset) renderPage();
}

function applyLanguage() {
  const copy = currentMessages();
  root.lang = language;
  document.title = language === "es" ? "dmarcosl.github.io/tur · Precios oficiales TUR" : "dmarcosl.github.io/tur · Official TUR prices";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = copy[element.dataset.i18n];
    if (typeof value === "string") element.innerHTML = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = copy[element.dataset.i18nAria];
    if (typeof value === "string") element.setAttribute("aria-label", value);
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    const selected = button.dataset.language === language;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function applySystemTheme() {
  const supportsColorScheme = typeof window.matchMedia === "function";
  root.dataset.theme = !supportsColorScheme || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function locale() {
  return language === "es" ? "es-ES" : "en-GB";
}

function numberFormatter(minimumFractionDigits, maximumFractionDigits = minimumFractionDigits) {
  const key = `${language}:${minimumFractionDigits}:${maximumFractionDigits}`;
  if (!numberFormatters.has(key)) {
    numberFormatters.set(key, new Intl.NumberFormat(locale(), { minimumFractionDigits, maximumFractionDigits }));
  }
  return numberFormatters.get(key);
}

function formatVariable(valueCent) {
  const valueEur = Number(valueCent) / 100;
  return `${numberFormatter(5, 8).format(valueEur)} €/kWh`;
}

function formatFixed(value) {
  return language === "es"
    ? `${numberFormatter(2).format(Number(value))} €/mes`
    : `€${numberFormatter(2).format(Number(value))}/month`;
}

function periodTime(period, precision) {
  const parts = period.split("-").map(Number);
  const year = parts[0];
  const month = parts[1] - 1;
  const day = precision === "day" ? parts[2] : 1;
  return Date.UTC(year, month, day);
}

function formatPeriod(period, precision, includeDay = precision === "day") {
  const [year, month, day] = period.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day || 1));
  const options = includeDay
    ? { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
    : { month: "long", year: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat(locale(), options).format(date);
}

function getTariffLabel(tariff) {
  return currentMessages()[`band${tariff.replace(".", "")}`];
}

function observationsByTariff() {
  const grouped = new Map(tariffOrder.map((tariff) => [tariff, []]));
  for (const item of dataset.observations) grouped.get(item.tariff)?.push(item);
  for (const items of grouped.values()) {
    items.sort((a, b) => periodTime(a.period, a.precision) - periodTime(b.period, b.precision));
  }
  return grouped;
}

function percentageChange(current, previous) {
  const before = Number(previous);
  if (!Number.isFinite(before) || before === 0) return null;
  return ((Number(current) - before) / before) * 100;
}

function formatChange(change) {
  const copy = currentMessages();
  if (change === null || !Number.isFinite(change)) return { direction: "first", text: copy.firstRevision };
  const direction = change > 0 ? "up" : change < 0 ? "down" : "unchanged";
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "→";
  return { direction, text: `${arrow} ${numberFormatter(2).format(Math.abs(change))} % ${copy.changeVsPrevious}` };
}

function renderCards() {
  const cards = document.getElementById("price-cards");
  const histories = observationsByTariff();
  const copy = currentMessages();
  cards.replaceChildren();

  for (const tariff of tariffOrder) {
    const history = histories.get(tariff) || [];
    const item = history.at(-1);
    if (!item) continue;
    const previous = history.at(-2);
    const variableChange = formatChange(previous ? percentageChange(item.variableCentKwh, previous.variableCentKwh) : null);
    const fixedChange = formatChange(previous ? percentageChange(item.fixedEurMonth, previous.fixedEurMonth) : null);

    const card = document.createElement("article");
    card.className = "price-card";
    card.dataset.tariff = tariff;
    card.innerHTML = `
      <div class="card-topline">
        <div class="card-heading">
          <span class="tariff-index" aria-hidden="true">${tariff.replace("TUR.", "T")}</span>
          <h3>${tariff}</h3>
        </div>
        <div class="effective-date">${copy.effectiveFrom}<strong>${formatPeriod(item.period, item.precision, true)}</strong></div>
      </div>
      <p class="consumption-band">${getTariffLabel(tariff)}</p>
      <div class="metric-block">
        <div class="metric-content"><span class="metric-label">${copy.variableMetric}</span><strong class="metric-value">${formatVariable(item.variableCentKwh)}</strong><span class="metric-change" data-direction="${variableChange.direction}">${variableChange.text}</span></div>
      </div>
      <div class="metric-block">
        <div class="metric-content"><span class="metric-label">${copy.fixedMetric}</span><strong class="metric-value">${formatFixed(item.fixedEurMonth)}</strong><span class="metric-change" data-direction="${fixedChange.direction}">${fixedChange.text}</span></div>
      </div>
      <a class="card-source" href="${escapeAttribute(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">
        <span>${copy.officialSource}</span><span class="external-arrow" aria-hidden="true">↗</span>
      </a>
      ${item.noticeCode === "temporary-calculation" ? `<p class="card-note">${copy.temporaryMeasure}</p>` : ""}
    `;
    cards.append(card);
  }
  cards.setAttribute("aria-busy", "false");
}

function escapeAttribute(value) {
  return String(value).replace(/[&"<>']/g, (character) => ({
    "&": "&amp;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
  })[character]);
}

function createSvgElement(name, attributes = {}, content = null) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (content !== null) element.textContent = content;
  return element;
}

function positionChartTooltip(clientX, clientY) {
  const tooltip = document.getElementById("chart-tooltip");
  if (!tooltip || tooltip.hidden) return;
  const bounds = tooltip.getBoundingClientRect();
  const margin = 8;
  const offset = 14;
  const left = Math.min(Math.max(margin, clientX + offset), window.innerWidth - bounds.width - margin);
  const top = Math.min(Math.max(margin, clientY + offset), window.innerHeight - bounds.height - margin);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function showChartTooltip(chartId, date, rows, clientX, clientY) {
  const tooltip = document.getElementById("chart-tooltip");
  const pointKey = `${chartId}:${date}:${rows.map((row) => `${row.tariff}:${row.value}:${row.changeText}`).join("|")}`;
  if (tooltip.hidden || tooltip.dataset.pointKey !== pointKey) {
    const heading = document.createElement("span");
    heading.className = "chart-tooltip-heading";
    heading.textContent = date;
    const list = document.createElement("div");
    list.className = "chart-tooltip-list";
    for (const rowData of rows) {
      const row = document.createElement("div");
      row.className = "chart-tooltip-row";
      row.style.setProperty("--series-color", getComputedStyle(root).getPropertyValue(paletteKeys[rowData.tariff]).trim());
      const top = document.createElement("div");
      top.className = "chart-tooltip-row-top";
      const tariff = document.createElement("span");
      tariff.className = "chart-tooltip-tariff";
      tariff.textContent = rowData.tariff;
      const amount = document.createElement("strong");
      amount.className = "chart-tooltip-value";
      amount.textContent = rowData.value;
      top.append(tariff, amount);
      const change = document.createElement("span");
      change.className = "chart-tooltip-change";
      change.dataset.direction = rowData.changeDirection || "first";
      change.textContent = rowData.changeText;
      row.append(top, change);
      list.append(row);
    }
    tooltip.replaceChildren(heading, list);
    tooltip.dataset.pointKey = pointKey;
  }
  tooltip.hidden = false;
  positionChartTooltip(clientX, clientY);
}

function hideChartTooltip() {
  const tooltip = document.getElementById("chart-tooltip");
  if (tooltip) tooltip.hidden = true;
  if (activeChartCursor) activeChartCursor.setAttribute("visibility", "hidden");
}

let activeChartCursor = null;

function chartData(field, convert = (value) => Number(value)) {
  const series = new Map(tariffOrder.map((tariff) => [tariff, []]));
  for (const item of dataset.observations) {
    series.get(item.tariff)?.push({
      period: item.period,
      precision: item.precision,
      value: convert(item[field]),
    });
  }
  for (const points of series.values()) points.sort((a, b) => periodTime(a.period, a.precision) - periodTime(b.period, b.precision));
  return series;
}

function nearestPeriod(periods, targetTime) {
  let nearest = periods[0];
  let distance = Infinity;
  for (const period of periods) {
    const currentDistance = Math.abs(period.time - targetTime);
    if (currentDistance < distance) {
      nearest = period;
      distance = currentDistance;
    }
  }
  return nearest;
}

function pointAtOrBefore(points, targetTime) {
  let low = 0;
  let high = points.length - 1;
  let result = -1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const time = periodTime(points[middle].period, points[middle].precision);
    if (time <= targetTime) {
      result = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return result;
}

function previousDistinctValue(points, index) {
  const current = points[index];
  for (let previousIndex = index - 1; previousIndex >= 0; previousIndex -= 1) {
    if (points[previousIndex].value !== current.value) return points[previousIndex];
  }
  return null;
}

function updateChartHover({ svg, svgId, series, valueFormatter, xScale, yScale, plotBottom, periods, targetTime, clientX, clientY }) {
  const nearest = nearestPeriod(periods, targetTime);
  if (!nearest) return;
  const date = formatPeriod(nearest.period, nearest.precision, nearest.precision === "day");
  const rows = tariffOrder.map((tariff) => {
    const points = series.get(tariff) || [];
    const index = pointAtOrBefore(points, nearest.time);
    if (index < 0) return { tariff, value: currentMessages().noData, changeText: currentMessages().noData };
    const point = points[index];
    const previous = previousDistinctValue(points, index);
    const changePercent = previous ? percentageChange(point.value, previous.value) : null;
    const change = formatChange(changePercent);
    return {
      tariff,
      value: valueFormatter(point.value),
      changeText: change.text,
      changeDirection: change.direction,
    };
  });
  const markerX = xScale(nearest.time);
  const cursor = svg.querySelector(".chart-crosshair");
  cursor.replaceChildren(createSvgElement("line", {
    class: "chart-crosshair-line",
    x1: markerX,
    x2: markerX,
    y1: 24,
    y2: plotBottom,
  }));
  for (const tariff of tariffOrder) {
    if (!visibleTariffs.has(tariff)) continue;
    const points = series.get(tariff) || [];
    const index = pointAtOrBefore(points, nearest.time);
    if (index < 0) continue;
    cursor.append(createSvgElement("circle", {
      class: "chart-crosshair-point",
      cx: markerX,
      cy: yScale(points[index].value),
      r: 4.2,
      style: `--series-color: ${getComputedStyle(root).getPropertyValue(paletteKeys[tariff]).trim()}`,
    }));
  }
  cursor.setAttribute("visibility", "visible");
  activeChartCursor = cursor;
  showChartTooltip(svgId, date, rows, clientX, clientY);
}

function changedPoints(points) {
  const changes = points.filter((point, index) => index === 0 || point.value !== points[index - 1].value);
  const lastPoint = points.at(-1);
  if (lastPoint && changes.at(-1) !== lastPoint) changes.push(lastPoint);
  return changes;
}

function niceScale(maxValue) {
  const rawStep = maxValue / 5;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  const step = factor * magnitude;
  const top = Math.ceil(maxValue / step) * step;
  const count = Math.round(top / step);
  return { top, ticks: Array.from({ length: count + 1 }, (_, index) => index * step) };
}

function getChartDates(series) {
  const times = [...series.values()].flat().map((point) => periodTime(point.period, point.precision));
  return { min: Math.min(...times), max: Math.max(...times) };
}

function yearTicks(minTime, maxTime) {
  const first = new Date(minTime).getUTCFullYear();
  const last = new Date(maxTime).getUTCFullYear();
  const years = [first];
  for (let year = first + 3; year < last; year += 3) years.push(year);
  if (last !== first) years.push(last);
  return years;
}

function renderLegend(targetId) {
  const target = document.getElementById(targetId);
  target.replaceChildren();
  for (const tariff of tariffOrder) {
    const colorName = paletteKeys[tariff];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "legend-button";
    button.dataset.tariff = tariff;
    button.setAttribute("aria-pressed", String(visibleTariffs.has(tariff)));
    button.setAttribute("aria-label", `${visibleTariffs.has(tariff) ? (language === "es" ? "Ocultar" : "Hide") : (language === "es" ? "Mostrar" : "Show")} ${tariff}`);
    button.innerHTML = `<span class="legend-swatch" style="--series-color: var(${colorName})"></span><span>${tariff}</span>`;
    button.addEventListener("click", () => {
      if (visibleTariffs.has(tariff)) {
        if (visibleTariffs.size === 1) return;
        visibleTariffs.delete(tariff);
      } else {
        visibleTariffs.add(tariff);
      }
      renderCharts();
    });
    target.append(button);
  }
}

function axisVariableLabel(value) {
  return numberFormatter(3, 3).format(value);
}

function renderChart(svgId, legendId, series, unit, descriptionKey, valueFormatter) {
  const svg = document.getElementById(svgId);
  const copy = currentMessages();
  const { min, max } = getChartDates(series);
  const allValues = [...series.entries()]
    .filter(([tariff]) => visibleTariffs.has(tariff))
    .flatMap(([, points]) => points.map((point) => point.value));
  const chartTitle = language === "es"
    ? (unit === "€/kWh" ? "Evolución del término variable" : "Evolución del término fijo")
    : (unit === "€/kWh" ? "Variable charge over time" : "Fixed charge over time");
  svg.setAttribute("aria-label", chartTitle);
  svg.setAttribute("aria-describedby", `${svgId}-description`);
  svg.replaceChildren(createSvgElement("desc", { id: `${svgId}-description` }, copy[descriptionKey]));

  const width = 1000;
  const height = 380;
  const margin = { top: 24, right: 20, bottom: 49, left: 76 };
  const plotLeft = margin.left;
  const plotRight = width - margin.right;
  const plotTop = margin.top;
  const plotBottom = height - margin.bottom;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const scale = niceScale(Math.max(...allValues, 0.00001));
  const x = (time) => plotLeft + ((time - min) / Math.max(max - min, 1)) * plotWidth;
  const y = (value) => plotBottom - (value / scale.top) * plotHeight;
  const periods = [...new Map([...series.values()].flat().map((point) => {
    const time = periodTime(point.period, point.precision);
    return [time, { period: point.period, precision: point.precision, time }];
  })).values()].sort((a, b) => a.time - b.time);

  const gridGroup = createSvgElement("g", { "aria-hidden": "true" });
  for (const tick of scale.ticks) {
    const tickY = y(tick);
    gridGroup.append(
      createSvgElement("line", { class: "grid-line", x1: plotLeft, x2: plotRight, y1: tickY, y2: tickY }),
      createSvgElement("text", { class: "axis-label", x: plotLeft - 12, y: tickY + 4, "text-anchor": "end" },
        unit === "€/kWh" ? axisVariableLabel(tick) : numberFormatter(0, 0).format(tick)),
    );
  }
  gridGroup.append(
    createSvgElement("line", { class: "axis-line", x1: plotLeft, x2: plotLeft, y1: plotTop, y2: plotBottom }),
    createSvgElement("line", { class: "axis-line", x1: plotLeft, x2: plotRight, y1: plotBottom, y2: plotBottom }),
    createSvgElement("text", { class: "axis-title", x: plotLeft, y: 13 }, unit),
  );

  for (const year of yearTicks(min, max)) {
    const tickX = x(Date.UTC(year, 0, 1));
    gridGroup.append(
      createSvgElement("line", { class: "grid-line", x1: tickX, x2: tickX, y1: plotBottom, y2: plotBottom + 5 }),
      createSvgElement("text", { class: "axis-label", x: tickX, y: plotBottom + 25, "text-anchor": "middle" }, String(year)),
    );
  }
  svg.append(gridGroup);

  for (const tariff of tariffOrder) {
    if (!visibleTariffs.has(tariff)) continue;
    const points = changedPoints(series.get(tariff) || []);
    if (!points.length) continue;
    const colorName = paletteKeys[tariff];
    const color = getComputedStyle(root).getPropertyValue(colorName).trim();
    const pathParts = [`M ${x(periodTime(points[0].period, points[0].precision))} ${y(points[0].value)}`];
    for (let index = 1; index < points.length; index += 1) {
      const point = points[index];
      const pointX = x(periodTime(point.period, point.precision));
      pathParts.push(`H ${pointX}`, `V ${y(point.value)}`);
    }
    const path = createSvgElement("path", {
      class: "series-line",
      d: pathParts.join(" "),
      style: `--series-color: ${color}`,
    });
    path.setAttribute("aria-hidden", "true");
    svg.append(path);

    const pointGroup = createSvgElement("g");
    for (const point of points) {
      const pointDate = formatPeriod(point.period, point.precision, point.precision === "day");
      const valueText = valueFormatter(point.value);
      const ariaLabel = copy.chartPointLabel(tariff, pointDate);
      const cx = x(periodTime(point.period, point.precision));
      const cy = y(point.value);
      const hitTarget = createSvgElement("circle", {
        class: "series-hit-target",
        cx,
        cy,
        r: 10,
        tabindex: "0",
        role: "img",
        "aria-label": `${ariaLabel}, ${valueText}`,
        "aria-describedby": "chart-tooltip",
        style: `--series-color: ${color}`,
      });
      const pointTime = periodTime(point.period, point.precision);
      const showOnFocus = () => {
        const bounds = hitTarget.getBoundingClientRect();
        updateChartHover({
          svg,
          svgId,
          series,
          valueFormatter,
          xScale: x,
          yScale: y,
          plotBottom,
          periods,
          targetTime: pointTime,
          clientX: bounds.left + bounds.width / 2,
          clientY: bounds.top + bounds.height / 2,
        });
      };
      hitTarget.addEventListener("focus", showOnFocus);
      hitTarget.addEventListener("blur", hideChartTooltip);

      const circle = createSvgElement("circle", {
        class: "series-point",
        cx,
        cy,
        r: 3.2,
        "aria-hidden": "true",
        style: `--series-color: ${color}`,
      });
      pointGroup.append(hitTarget, circle);
    }
    svg.append(pointGroup);
  }

  if (!visibleTariffs.size) {
    svg.append(createSvgElement("text", {
      class: "axis-label",
      x: (plotLeft + plotRight) / 2,
      y: plotTop + plotHeight / 2,
      "text-anchor": "middle",
    }, copy.chartNoSeries));
  }
  svg.append(createSvgElement("g", { class: "chart-crosshair", visibility: "hidden", "aria-hidden": "true" }));
  svg.onpointermove = (event) => {
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    if (local.x < plotLeft || local.x > plotRight || local.y < plotTop || local.y > plotBottom) {
      hideChartTooltip();
      return;
    }
    const targetTime = min + ((local.x - plotLeft) / plotWidth) * (max - min);
    updateChartHover({
      svg,
      svgId,
      series,
      valueFormatter,
      xScale: x,
      yScale: y,
      plotBottom,
      periods,
      targetTime,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  };
  svg.onpointerleave = hideChartTooltip;
  renderLegend(legendId);
}

function renderCharts() {
  hideChartTooltip();
  const variable = chartData("variableCentKwh", (value) => Number(value) / 100);
  const fixed = chartData("fixedEurMonth");
  renderChart("variable-chart", "variable-legend", variable, "€/kWh", "chartVariableDescription", (value) => `${numberFormatter(5, 8).format(value)} €/kWh`);
  renderChart("fixed-chart", "fixed-legend", fixed, language === "es" ? "€/mes" : "€/month", "chartFixedDescription", formatFixed);
}

window.addEventListener("scroll", hideChartTooltip, { passive: true });
window.addEventListener("resize", hideChartTooltip);

function renderPage() {
  renderCards();
  renderCharts();
}

async function loadData() {
  const response = await fetch(new URL("./data/tur-prices.json", window.location.href));
  if (!response.ok) throw new Error(`No se pudo cargar data/tur-prices.json (${response.status})`);
  dataset = await response.json();
  if (dataset.schemaVersion !== 1 || !Array.isArray(dataset.observations)) {
    throw new Error("Formato de precios no reconocido");
  }
  renderPage();
}

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

applyLanguage();
applySystemTheme();
if (typeof window.matchMedia === "function") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applySystemTheme);
}

loadData().catch((error) => {
  console.error(error);
  const cards = document.getElementById("price-cards");
  cards.replaceChildren();
  cards.setAttribute("aria-busy", "false");
  const message = document.createElement("p");
  message.className = "data-error";
  message.textContent = currentMessages().dataError;
  cards.append(message);
});
