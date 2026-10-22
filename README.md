# 🌱 Mi Huerto · Finca Mulalillo

Una sola app para el huerto y para la gestión de la Finca Mulalillo (Salcedo, Cotopaxi,
~9.700 m²): qué hacer hoy, cuánta agua queda hasta el turno de la junta, qué sembrar
este año y a cuánto se vende. Hecha para usarse en el celular, parado en el terreno, por
gente que no vive entre aplicaciones; en tablet y computadora sirve para planificar.

**En vivo:** https://franciscombp.github.io/agro/

Antes eran dos apps con dos estéticas: *Mi Huerto* (guía de siembra, almanaque y
mercado) en la raíz, y la gestión de la finca como prueba de concepto en `/mulalillo/`.
Desde la v17 son una. La dirección vieja de la finca redirige, y los datos de las dos se
conservan (ver [Datos](#datos)).

## Cómo está ordenada

Cinco secciones, cada una con una pregunta:

| Sección | Pregunta | Qué hay |
|---|---|---|
| **Hoy** | ¿Qué hago hoy? | Avisos (helada, agua que no alcanza, sensor callado, cosecha lista), el tiempo en una frase, el agua en una frase, las tareas de estos días con casilla para marcarlas, y seis botones para anotar lo del día |
| **Finca** | ¿Qué hay y dónde? | Mapa satelital, sectores y plantas (segmentado arriba). Desde el mapa se entra al relieve 3D |
| **Tareas** | ¿Qué falta? | Por hacer / hechas, agrupadas por cuándo, y «Mandar el plan» por WhatsApp |
| **Agua** | ¿Llega el agua al turno? | El veredicto primero, la curva del reservorio, cómo viene el año (El Niño) y lo anotado |
| **Huerto** | ¿Qué siembro y cuánto gano? | Qué sembrar (ordenado por el agua de este año), mis siembras y el mercado |

Lo que guió el orden:

- **Hoy es la entrada, no el mapa.** El mapa pesa 800 kB y teselas satelitales; con mala
  señal, abrir la app para anotar un riego no tiene por qué esperarlo. Se carga la primera
  vez que se abre Finca.
- **Anotar está a un toque.** Regué · Medí el reservorio · Una tarea · Sembré algo ·
  Planta con problema · Un precio de feria. Cada uno es una hoja corta con preguntas
  («¿Cuándo?», «¿Qué regaste?») y lo opcional dicho como opcional. «Medí el reservorio»
  pide centímetros de una vara, no metros cúbicos, y muestra el volumen mientras se
  escribe. «Planta con problema» cambia el estado de la planta y crea la tarea de
  revisarla.
- **Palabras del campo, no del modelo.** En pantalla no aparecen ET0, Kc, bar ni
  `medición_nivel`: «Agua para 12 días», «Llega al turno con agua», «Revisar», «Mover
  puntos». Los números técnicos siguen ahí, plegados bajo «Datos técnicos» u «Opciones
  avanzadas».
- **Las herramientas del mapa llevan su nombre** («Toda la finca», «Dónde estoy»,
  «Colores», «Relieve 3D», «Mover puntos»): un círculo con un icono no se descifra si
  uno no vive entre aplicaciones.
- **Lo que está bien no grita.** Una planta sana lleva una pastilla verde suave; una para
  revisar, ámbar. Los avisos de Hoy sólo aparecen cuando hay algo que hacer.

## Diseño

El diseño que manda es el de *Mi Huerto*, que era el más pulido: fondo cálido liso,
tarjetas blancas de sombra suave, esquinas de 12 y 16 px, recuadros con emoji teñidos por
tipo de cultivo, títulos firmes y pastillas de estado. Va como una **piel sobre
[mal-ds](https://github.com/franciscombp/mal/tree/main/ds)**, el sistema de diseño del
proyecto: del sistema salen la tipografía (Inter), los iconos, la hoja inferior, el
segmentado, el modo oscuro y los roles de color; `styles.css` pone los valores del huerto
en esos roles y los componentes propios. Lo aprendido de esa convivencia —incluidos los
choques de nombres de clase con el sistema— está en
[`ds/NOTAS-PARA-EL-SISTEMA.md`](ds/NOTAS-PARA-EL-SISTEMA.md).

Reglas que se cumplen en toda la app (y que una auditoría automática verificó en cada
pantalla y hoja, en claro y oscuro):

- **Una escala de letra de diez pasos** (`--fs-micro` 12 px … `--fs-h1` 32 px) y ningún
  tamaño suelto; abajo de 13 px sólo van rótulos cortos. Pesos 400, 600, 700 y 800.
- **Radios de tres clases:** 16 px tarjetas, 12 px controles y recuadros, píldora para
  chips, botones redondos y barras.
- **Contraste de 4,5:1 o más** en todo texto, también el gris secundario sobre fondos
  teñidos (por eso `--app-ink-3` y `--app-warn` son algo más oscuros que en el huerto viejo).
- **Objetivos táctiles de 44 px** como mínimo, incluidas las casillas (por su etiqueta).
- **Un dato se muestra igual en todas partes:** fichas y calculadora usan la misma tarjeta
  de renglones; el dinero lleva siempre centavos bajo 100 dólares ($0,50, $3,00); las
  cantidades usan coma decimal; lo técnico va plegado en «Datos técnicos».
- **Borrar se dice en rojo, pero no es un bloque rojo**, y va al final de la hoja.

Tres escalones de pantalla: barra inferior en el teléfono, rail compacto en tablet
(desde 700 px) y rail con rótulos en computadora (desde 1100 px), donde Hoy se reparte en
dos columnas que se leen cada una entera.

## Qué hace por dentro

- **Agua (FAO-56).** Cada planta pide `ET0 × Kc`, corregido por edad y por la etapa del
  cultivo de su sector; se descuenta la lluvia aprovechable y lo que guarda el suelo. La
  proyección va día por día con 7 días de pronóstico y responde si el agua llega al
  próximo turno de la junta (5 h cada 15 días). Detalle en
  [`docs/finca.md`](docs/finca.md).
- **El Niño.** Mide cuánto llovió de verdad en los últimos 90 días en el punto de la
  finca, lo compara con la mediana de 10 años de las mismas fechas, y con eso reordena qué
  sembrar (en año seco, arriba lo que aguanta con menos) y da un consejo por cultivo. La
  fase de El Niño / La Niña se declara a mano y se lee por región: en la sierra trae
  sequía, en la costa lo contrario.
- **Clima.** Una sola consulta a [Open-Meteo](https://open-meteo.com/) (92 días atrás y
  10 adelante, sin clave) alimenta el agua, el tiempo de Hoy, las heladas, el almanaque y
  el estado hídrico. Sin señal se usa lo último que bajó.
- **Luna y días buenos.** El calendario lunar de siembra, como costumbre y no como
  ciencia, cruzado con lo que sí se mide: si va a helar, ninguna luna hace bueno el día.
- **Mercado.** Libreta de precios de feria con tendencia, meses de mejor precio por
  producto y referencias internacionales del Banco Mundial.
- **Sensores.** Nivel del reservorio, pluviómetro, humedad de suelo y caudalímetro por
  LoRaWAN → The Things Network → un receptor en Cloudflare Workers, con avisos por
  Telegram aunque la app esté cerrada. Qué comprar y cómo montarlo:
  [`SENSORES.md`](SENSORES.md).
- **Avisos en el teléfono.** Si se activan en Ajustes, al abrir la app (una vez al día)
  llegan como notificación los avisos importantes de Hoy.
- **Sin señal.** Service worker con la app, las librerías y las teselas de la finca en
  caché; todo lo anotado se guarda en el teléfono y entra en una cola para sincronizar.
- **Liviana al abrir.** MapLibre (800 kB) baja recién al abrir Finca y los módulos se piden
  en paralelo: en 3G y comprimido como lo sirve Pages, Hoy aparece en unos 2 s y la primera
  visita baja unos 250 kB (antes 3,1 s y 450 kB).

## Datos

Todo vive en IndexedDB, en la base `mulalillo` (el nombre se conservó para no perder lo
anotado en la app de la finca). La primera vez que se abre la versión integrada, copia
las siembras y los precios del *Mi Huerto* viejo (`localStorage` `mihuerto.v2`) al
sector Huerto, junto con la fase de El Niño declarada; **el original no se borra**.

Las fechas se calculan en hora local: antes, después de las 19:00 en Ecuador la app ya
creía que era el día siguiente (tomaba el día de Greenwich).

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:5173/agro/
npm test             # pruebas del modelo de agua, sensores, alertas y huerto
npm run build        # comprueba que todo se copia a dist/
npm run verifica:ds  # comprueba ds/ contra un clon de franciscombp/mal
```

## Deploy

GitHub Pages sirve la rama `main` directamente desde la raíz: lo publicado es lo que
está commiteado (incluidas `ds/` y `lib/`), no el resultado de `npm run build`. Por eso
las librerías del mapa y del 3D van en el repositorio.

Si la app no arranca en un teléfono, `diagnostico.html` dice por qué (WebGL, service
worker, descarga de cada archivo), y `?sw=off` la abre sin service worker.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Las cinco secciones, el relieve, la hoja inferior |
| `styles.css` | La piel del huerto sobre mal-ds y los componentes de la app |
| `app.js` | Arranque, navegación, finca, tareas, agua, formularios y ajustes |
| `estado.js` | El estado compartido y el aviso de «algo cambió» |
| `ui.js` | Hoja, toast, formato de números y fechas |
| `fechas.js` | El día local (no el de Greenwich) |
| `vistas/hoy.js` | La pantalla Hoy, sus avisos y las notificaciones |
| `huerto/huerto.js` | Qué sembrar, ficha y calculadora, mis siembras, mercado, migración desde Mi Huerto |
| `huerto/catalogo.js` | ~45 cultivos y animales con altitud, meses, riego, costos y precios |
| `huerto/nino.js` | Estado hídrico, El Niño / La Niña por región, consejo por cultivo |
| `huerto/luna.js` | Fases lunares, tiempo en palabras, valor de cada día para sembrar |
| `db.js` | IndexedDB, cola de sincronización, datos medidos de la finca, especies |
| `clima.js` | Open-Meteo: ET0, lluvia, temperaturas, pronóstico, reserva del suelo |
| `water.js` | Demanda, volumen del reservorio, proyección hasta el turno |
| `sensores.js`, `normaliza.js` | Lecturas del receptor traducidas a lo que el modelo entiende |
| `geo.js`, `map2d.js`, `planting.js`, `hydraulics.js`, `view3d.js` | Geometría, mapa, marco de siembra, riego por gravedad, relieve 3D |
| `receptor/` | Receptor de sensores (Cloudflare Worker), alertas por Telegram, simulador |
| `sw.js` | Caché sin señal, teselas y notificaciones |
| `mulalillo/` | Redirección de la dirección vieja y retiro de su service worker |
| `ds/` | mal-ds vendorizado y fijado a una versión |
| `lib/` | MapLibre y Three.js, servidos por la propia app |
| `pruebas/` | Pruebas con `node --test` |
| `docs/finca.md` | La finca por dentro: modelo de agua, relieve, sensores, decisiones y límites |
