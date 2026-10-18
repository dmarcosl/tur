# Precios de la TUR de gas

Dashboard estático en español e inglés para consultar los términos fijo y variable de TUR.1, TUR.2 y TUR.3, y su evolución histórica. Incluye gráficos interactivos, enlaces a las fuentes oficiales para los precios vigentes y modo claro/oscuro según la preferencia del sistema.

La aplicación se publica en [dmarcosl.github.io/tur](https://dmarcosl.github.io/tur/). El JSON histórico forma parte del sitio y será descargable públicamente; los CSV de origen no se incluyen.

## Datos

`data/tur-prices.json` contiene 369 observaciones: la serie mensual de la CNMC hasta septiembre de 2021 y resoluciones del BOE desde octubre de 2021. Cada registro conserva su fecha de vigencia, precisión, fuente y estado de verificación. Los importes son antes de impuestos y el histórico presentado está limitado a TUR.1–TUR.3.

La resolución vigente desde el 1 de octubre de 2026 aplica medidas temporales aprobadas en el Real Decreto-ley 25/2026. Los valores están cotejados con la resolución publicada en el BOE, no son una estimación propia.

La serie histórica de la CNMC se atribuye a [Componentes de la Tarifa de Último Recurso](https://catalogodatos.cnmc.es/dataset/ds_1607_1), bajo licencia [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Los datos CNMC se han adaptado al esquema JSON del proyecto y se han combinado con registros construidos a partir de resoluciones del BOE. Consulta el [texto de la licencia](https://creativecommons.org/licenses/by-sa/4.0/legalcode.es) para las condiciones de atribución, indicación de cambios y compartir igual. Las resoluciones del BOE están enlazadas desde cada registro y desde las tarjetas de precios vigentes.

## Licencias y fuentes

La licencia CC BY-SA 4.0 indicada en los metadatos se refiere a la reutilización de la serie de la CNMC; no concede por sí sola una licencia sobre el código de esta aplicación ni se presenta aquí como licencia única para el conjunto de datos compilado. Las disposiciones oficiales publicadas en el BOE están enlazadas individualmente como fuente. La página enlaza y atribuye ambas fuentes.

El código de la aplicación se distribuye bajo la licencia MIT (consulta [`LICENSE`](LICENSE)). Esta licencia cubre el código y su documentación, no los datos de `data/tur-prices.json`, que conservan las condiciones de sus fuentes: la serie de la CNMC bajo CC BY-SA 4.0 y las resoluciones del BOE enlazadas individualmente.

La página declara su URL canónica, metadatos Open Graph y JSON-LD de tipo `Dataset`. `robots.txt` permite el rastreo y señala `sitemap.xml`. Estos archivos facilitan que los buscadores descubran la página, pero no garantizan su inclusión en resultados. Para pedir indexación a Google se puede verificar el dominio o la propiedad URL-prefix en Search Console y enviar el sitemap.

El script `scripts/build_data.py` puede regenerar el JSON si se aportan los CSV de trabajo `ds_1607_1.csv` y `tur_prices.csv` en la raíz. No forman parte del repositorio. La key de GitHub se mantiene únicamente en `.env` local.

## Publicación

Cada push a `main` ejecuta `.github/workflows/pages.yml`. El workflow despliega solo `index.html`, `app.js`, `styles.css` y `data/tur-prices.json` mediante GitHub Actions y GitHub Pages.
