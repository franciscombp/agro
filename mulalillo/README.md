# PoC — App de gestión, Finca Mulalillo

Prueba de concepto **independiente** de la app principal (*Mi Huerto*). Vive en este
subdirectorio y se publica en `/agro/mulalillo/`. No comparte código, estado ni
service worker con la app de la raíz: se puede borrar esta carpeta y la app principal
sigue funcionando igual.

Gestión de una finca de ~9.000 m² en Mulalillo, Salcedo, Cotopaxi. Móvil primero
(uso parado en el terreno) y usable en escritorio para planificar.

## Cómo correrla

```bash
npm install
npm run dev     # http://localhost:5173/agro/mulalillo/
npm run build   # emite dist/mulalillo/
```

`npm run dev` y `npm run build` ejecutan antes `scripts/vendor-mulalillo.mjs`, que copia
MapLibre y Three.js desde `node_modules` a `mulalillo/lib/`. **Esos archivos están
versionados en el repositorio a propósito**: GitHub Pages sirve la rama `main` tal cual, así
que una librería que no esté commiteada devuelve 404 en el sitio publicado aunque el build
la genere. Si actualizas las versiones en `package.json`, vuelve a correr el script y
commitea el resultado.

## Qué hay implementado

| Prioridad del brief | Estado |
|---|---|
| 1. Mapa + polígono + sectores con área calculada | ✅ |
| 2. Plantas con ficha y GPS | ✅ |
| 3. Tareas e historial | ✅ |
| 4. Módulo de agua | ✅ |
| 5. Vista 3D | ✅ |
| 6. Offline/PWA | ✅ caché y cola local; sincronización con servidor pendiente (ver *Límites*) |

**Mapa (vista principal).** Imagen satelital de Esri World Imagery, zoom hasta nivel de
árbol. Límite del terreno con vértices arrastrables; sectores dibujables toque a toque
con área geodésica en m² recalculada en vivo; plantas, infraestructura y puntos de
elevación como puntos arrastrables (botón ✥); botón GPS para colocar un punto donde
estás parado; filtros por especie, estado y sector; coloreado por especie o por estado
sanitario.

**Ficha de planta.** Especie, variedad, fecha de siembra con edad calculada, estado,
elevación interpolada, fotos (reescaladas a 1024 px antes de guardarse) e historial de
tareas — incluidas las del sector al que pertenece.

**Sectores.** Área y perímetro geodésicos, conteo de plantas por especie, rango de
elevación, riego estimado y tareas a nivel de sector.

**Plan de trabajo compartible.** Desde Tareas, «Compartir plan» arma un texto con las
tareas atrasadas y próximas, el estado del agua y las plantas a revisar, listo para
mandar por WhatsApp a quien está en la finca. El manejo es remoto: la app tiene que
servir para dar instrucciones, no sólo para registrar.

**Marco de siembra.** Genera las posiciones de un bloque entero: especie, distancia
entre hileras y entre plantas, margen al borde, giro de las hileras y disposición
rectangular o a tresbolillo. Antes de guardar muestra cuántas plantas caben, la
densidad por hectárea y cuánto riego suma al total, con las posiciones dibujadas en el
mapa. Al confirmar las crea en una sola transacción. Sembrar los 380 arándanos deja de
ser 380 toques de pantalla.

**Riego por gravedad.** Desde cualquier sector calcula el desnivel hasta el reservorio,
la presión estática, el caudal de diseño según demanda y horas de riego, la pérdida por
fricción (Hazen-Williams, C=150) y la presión neta que queda. Dice si cae dentro del
rango de trabajo del goteo autocompensado (1,0–3,5 bar) y sugiere el diámetro comercial
mínimo. No incluye pérdidas en filtros, válvulas ni codos.

**Agua.** Volumen estimado del reservorio simulando día por día desde el primer dato
duro: las mediciones de nivel reinician el saldo, llenados y tanqueros suman, y cada día
descuenta el riego registrado o, si no lo hay, la demanda estimada; demanda por sector y
por especie; calendario del ciclo de 15 días de la junta de agua.

**La demanda no es un número fijo.** Antes eran litros/planta/día por especie, iguales el
día de aguacero y la semana de sol de páramo. En una finca que vive de 5 horas de agua
cada 15 días, esa diferencia *es* la decisión. Ahora el cálculo es el de riego de toda la
vida (FAO-56), en tres pasos:

1. La atmósfera pide **ET0** milímetros al día, y ese dato se mide (Open-Meteo, sin clave).
2. Cada planta pide `ET0 × Kc`, con el Kc de su especie, **corregido por edad** —un
   arándano recién sembrado no bebe como uno de cuatro años— y por la **etapa del
   cultivo** declarada en su sector: reposo ×0,35, llenado de fruta ×1,15. Esa etapa no
   se deduce de la fecha de siembra (en la sierra no hay una estación que la fije, y un
   bloque puede ir adelantado respecto al vecino): la declara quien está en la finca, y
   la app avisa cuando lleva más de 90 días sin tocarse, porque una etapa vieja miente.
3. De ahí se descuenta la **lluvia aprovechable** —los primeros 2 mm se evaporan y del
   resto entra el 75 %— y lo que el **suelo tiene guardado**, hasta 25 mm de reserva en
   la zona de raíces. Sin esa reserva el modelo olvidaría la lluvia al día siguiente de
   caer y pediría regar justo cuando no hace falta.

Los milímetros se vuelven litros multiplicando por los m² que cubre la planta, y esa área
se deduce del `lppd` que ya estaba en el catálogo (`área = lppd / (ET0_ref × Kc)`). Por
eso **en clima de referencia y con plantas adultas el resultado es exactamente el de
antes**: el modelo no reescribe la finca, le añade los días que se salen de lo normal.

**La proyección se ve.** La curva de 21 días que decide todo esto está dibujada en la
pantalla de agua: una sola serie —el volumen del reservorio—, los 7 días pronosticados en
línea llena y el resto punteado, porque lo que se sabe y lo que se supone tienen que
distinguirse. El eje llega hasta la capacidad del reservorio y no hasta el volumen de hoy,
que dibujaría igual de lleno uno al 20 % que uno al 90 %. La lluvia **no** lleva un segundo
eje —dos escalas en un gráfico inventan una relación que los datos no tienen—: los días con
lluvia pronosticada se marcan con un punto sobre el eje. Si la línea toca el fondo antes del
turno, la franja entre ambos es el déficit dibujado.

**La autonomía mira el pronóstico.** Dividir el volumen por una demanda plana se equivoca
en los dos sentidos y siempre en el peor momento. La proyección va día por día con los 7
días pronosticados (después, con su promedio) y responde la pregunta que de verdad se
hace quien maneja la finca: **¿llega el agua al próximo turno?** El aviso y el déficit en
m³ salen de ahí, y el plan compartible por WhatsApp lleva el motivo —cuánto evapora,
cuánta lluvia viene— y no sólo el veredicto.

Sin señal se calcula con lo último que bajó; sin nada bajado, con el clima de referencia
de la zona, y la pantalla lo dice en vez de disfrazar un supuesto de medición.

Tres sitios usan a propósito el **pico adulto** y no la demanda de hoy, porque
dimensionan en vez de operar: el marco de siembra («riego que suma, adultas»), la
calculadora de riego por gravedad («demanda a pico») y el techo que muestra la pantalla
de agua cuando la finca todavía es joven.

**3D.** Terreno interpolado por distancia inversa ponderada (IDW) desde los puntos de
elevación medidos, con exageración vertical configurable (1×–12×). Sectores, plantas e
infraestructura se proyectan **desde los mismos registros del mapa 2D** — no hay un
segundo modelo. Las flechas azules marcan la dirección de máxima pendiente descendente:
hacia dónde corre el agua por gravedad.

El terreno es un bloque con faldón lateral, no una sábana flotando: se lee el volumen de
la loma. Los árboles llevan tronco y copa facetada con porte por especie (un aguacate no
es un arándano) y giro y tamaño variados por un hash del id, de modo que un bloque
sembrado no parece un sello repetido; van en malla instanciada, así cientos de plantas no
cuestan fotogramas. Las construcciones tienen techo a dos aguas y el reservorio muestra
lámina de agua. El sol proyecta sombras, que es lo que permite leer la pendiente. El
encuadre inicial se calcula con la esfera que envuelve el terreno contra el campo de
visión, para que entre completo también en pantalla angosta; «Recentrar vista» vuelve a
él. El panel de controles se pliega para dejar la vista entera.

**Offline.** Service worker con alcance `./`: shell y librerías precacheadas, tiles
satelitales en caché con tope de 1.200 entradas y precarga del área de la finca
(Ajustes → «Descargar mapa del terreno», zoom 15–19). Toda escritura entra además en una
cola local (`outbox`) para sincronizar después.

## Móvil, tablet y escritorio

Tres escalones, y cada uno responde a **cómo se sostiene el aparato**, no a un número
redondo:

| Ancho | Navegación | Contenido |
|---|---|---|
| hasta 699 px | Barra inferior, al alcance del pulgar | Una columna |
| 700–1099 px | Rail lateral compacto (88 px, icono con rótulo) | Dos columnas |
| 1100 px y más | Rail con rótulos al lado (232 px) | Dos columnas, ancho de lectura acotado |

Antes había un solo corte, en 900 px, así que una tablet en vertical —768 px, el ancho
de un iPad— se quedaba con la interfaz de teléfono: navegación de lado a lado y tarjetas
de 700 px de ancho, renglones que el ojo pierde al volver a la izquierda.

Dos vistas usan la anchura para decir algo, no para estirarse:

- **Agua** pasa a tablero. En una sola columna hay que desplazar tres pantallas para
  cruzar el estado del reservorio con la demanda por sector, que es justo la comparación
  que se hace. A partir de 1.400 px son tres columnas y la curva ocupa dos, porque una
  serie de tiempo necesita ancho y no alto.
- **Tareas** reparte sus tres grupos en tres columnas a partir de 1.100 px. Son los tres
  momentos en que se decide algo distinto, y lado a lado se ve de una vez cuánto hay
  atrasado frente a cuánto viene.

Las listas que no se agrupan se quedan en un ancho de lectura en vez de llegar al borde:
una fila de tarea estirada a mil píxeles es una casilla, cuatro palabras y novecientos
píxeles de nada.

Los estados de puntero (`hover`) se declaran por **capacidad del aparato**
(`@media (hover: hover) and (pointer: fine)`) y no por ancho, para que un portátil táctil
no herede el hover pegado.

## Claro y oscuro

La app **no escribe ni una regla de tema**: habla roles del sistema y mal-ds resuelve los
dos. El único sitio donde hizo falta intervenir fue el cielo de la vista 3D, que era un
hexadecimal suelto y por eso seguía deslumbrando con el resto ya oscurecido — que es la
prueba de que el sistema funciona: lo que habla en roles se adapta, lo que no, no.

## Interfaz: consume mal-ds

Esta app **no tiene sistema de diseño propio**. Usa
[mal-ds](https://github.com/franciscombp/mal/tree/main/ds), el sistema del proyecto, con
el tema de producto y el tinte de agro declarados en la raíz:

```html
<html lang="es" data-marca="apps" data-app="agro">
<link rel="stylesheet" href="../ds/mal/mal.css">
<link rel="stylesheet" href="./styles.css">
```

Del sistema salen los tokens, los botones, los campos, las tarjetas, las insignias, el
segmentado, la navegación inferior, la hoja modal, el toast y los 81 iconos del sprite.
`mulalillo/styles.css` sólo añade lo que el sistema no cubre —el cromo de pantalla
completa, el mapa, el medidor del reservorio y el relieve— y habla siempre sus roles
(`--app-*`, `--mal-*`), nunca colores sueltos.

### La copia vendorizada

`ds/` es una copia de mal-ds **fijada a una versión**, no un enlace al CDN. La razón es el
campo: la app tiene que abrir sin señal desde la primera visita, y GitHub Pages sirve la
rama `main` tal cual, así que lo que no esté commiteado devuelve 404. Es el tercer camino
que ofrece el propio README del sistema.

```bash
npm run vendor:ds    # actualiza ds/ desde un clon de franciscombp/mal
npm run verifica:ds  # falla si ds/ se desvió del clon — para CI
```

De `fonts/` se copian sólo las tres del tema `apps` (Inter, Inter cursiva y JetBrains
Mono): las otras ocho son de los temas del periódico y la marca, y meterían 180 kB sin uso.
`ds/PROCEDENCIA.json` deja anotada la versión y la fecha de la copia, y
[`ds/NOTAS-PARA-EL-SISTEMA.md`](../ds/NOTAS-PARA-EL-SISTEMA.md) recoge lo que esta app
tuvo que resolver por su cuenta porque el sistema no lo cubre todavía — que es la mitad
útil de consumir un sistema de diseño.

Dos detalles que resolvió la migración y conviene conocer:

- **No se carga `mal.js`.** Esta app ya trae su propia mecánica de pestañas, hoja y toast;
  cargarlo duplicaría los manejadores. Lo único que hacía falta de él era inyectar el
  sprite de iconos —`<use href>` a un archivo externo no lo resuelve ningún navegador— y
  eso son seis líneas en `app.js`.
- **La hoja modal pasó a `<dialog>`** (`.modal--hoja` del sistema): el navegador se encarga
  del foco y de cerrar con Escape, que a mano estaba sin resolver.

## Diagnóstico

`diagnostico.html` es una página deliberadamente tonta —sin módulos ES, sin imports, sin
depender de nada de la app— que comprueba en el dispositivo real: navegador, WebGL y
WebGL2, service worker que controla la página, cachés guardados, descarga de cada archivo
grande con su tipo y tamaño, ejecución de MapLibre, importación de un módulo mínimo, de
Three.js y de `view3d.js`, y la creación de un mapa. Sirve justamente cuando la app no
arranca, que es cuando no hay consola a mano.

Entre las pruebas está «Origen del sitio», que distingue si lo servido viene de `main` o de
un artefacto de build. Esa distinción fue la que destrabó un fallo de varios días: el
workflow publicaba en `gh-pages` mientras Pages servía `main`, así que las librerías
generadas por el build nunca llegaban al navegador.

`?sw=off` abre la app sin service worker y lo da de baja (`?sw=on` lo revierte). Safari en
iOS ha tenido fallos sirviendo módulos ES a través de un service worker: si la app
funciona así y no de la otra forma, el culpable es ese intermediario.

## Datos

Los datos medidos en campo se siembran una sola vez en IndexedDB (`db.js`): el polígono
de 11 vértices, las 5 elevaciones, los sectores existentes y planificados, los 4
aguacates y 3 perales, la infraestructura y eventos de agua de ejemplo.

Superficie calculada: **9.675 m²**, perímetro 439 m. Desnivel **16,1 m** entre 2.786,84 y
2.802,91 msnm → **1,58 bar** de presión estática en el punto bajo.

Ojo con ese 1,58 bar: es la presión en la **parte más baja** de la finca, junto a la casa.
El bloque de arándanos planificado está en la zona alta, a unos 6,5 m por debajo del
reservorio, así que ahí la presión estática es de **0,64 bar** y la neta ronda **0,55 bar**
— por debajo del mínimo de un gotero autocompensado. Engrosar la tubería no lo arregla:
el límite es el desnivel. La calculadora de cada sector lo muestra con sus números.

Las alturas del centro, el cuyero y las secciones bajas son reales, pero sus **coordenadas
son estimadas**: aparecen en gris en el mapa y con la nota «coordenada estimada». Parado
en el punto, «Fijar con mi GPS» las corrige y el modelo de terreno se recalcula solo.

## Decisiones que se apartan del brief

- **Sin Next.js.** El repositorio se publica como sitio estático en GitHub Pages con Vite.
  Meter Next.js habría cambiado el despliegue de la app principal, que debe seguir igual.
  La PoC son módulos ES servidos tal cual; la funcionalidad del brief no lo necesitaba.
- **IndexedDB en lugar de Turso/Supabase.** No hay backend en GitHub Pages. IndexedDB
  cumple el requisito real (nada de `localStorage`, los datos sobreviven), y el traspaso
  celular↔escritorio se hace hoy con exportar/importar JSON.
- **Sin CDN.** MapLibre y Three.js se sirven desde la propia app (`mulalillo/lib/`) para que
  la primera carga también funcione sin señal. Los archivos van commiteados porque el sitio
  publicado sale de la rama `main`, no del artefacto de build.
- **Dibujo propio en vez de mapbox-gl-draw.** Unas 120 líneas sobre fuentes GeoJSON, sin
  el desfase de versiones entre `mapbox-gl-draw` y MapLibre 4.

## Límites de la PoC

- **La sincronización real falta.** La cola local está lista y `db.flushOutbox(endpoint)`
  hace el POST por lote, pero no hay servidor al otro lado: en Ajustes se configura el
  endpoint y, sin él, los cambios quedan encolados. Para un manejo remoto de verdad
  (varias personas, celular y escritorio a la vez) hace falta ese servicio con
  autenticación y resolución de conflictos.
- Las fotos se guardan como data URL dentro de IndexedDB. Sirve para decenas de fotos,
  no para cientos: con sincronización deberían ir a almacenamiento de objetos.
- La etapa del cultivo hay que **declararla y mantenerla al día**. La app avisa a los 90
  días, pero una etapa mal puesta desvía el riego en un ±15 % sin que nada chille. Las
  etapas que trae sembradas son de ejemplo, como el resto de los datos de arranque.
- Los 25 mm de reserva del suelo son un valor razonable para el suelo volcánico de la
  zona, no una medición. Se ajustan en Ajustes; un análisis de suelo o un tensiómetro
  dirían el número de verdad.
- El saldo histórico del reservorio se simula con la demanda de referencia, no con el
  clima de cada día pasado: guardar la serie diaria permitiría afinarlo, y aplicar el
  clima de esta semana a meses anteriores sería peor que no aplicarlo.
- El modelo de terreno interpola desde 5 puntos, 4 con coordenada aproximada. Cada punto
  que se tome con GPS lo mejora.
- La calculadora de riego por gravedad no incluye pérdidas en filtros, válvulas ni
  codos, y estima el recorrido de tubería desde la distancia en línea recta más un
  porcentaje configurable. Para el diseño definitivo hay que medir el trazado real.
- Los polígonos de los sectores sembrados son estimaciones mías sobre la imagen
  satelital, no medidas en campo: conviene ajustarlos arrastrando los vértices antes de
  fiarse de las áreas y de los conteos de siembra.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Shell: barra, seis vistas, hoja modal |
| `app.js` | Estado, navegación, fichas, formularios, GPS, ajustes, respaldo |
| `db.js` | IndexedDB, cola de sincronización, datos medidos, catálogo de especies |
| `geo.js` | Área y perímetro geodésicos, IDW de elevación, presión estática |
| `map2d.js` | MapLibre: capas, dibujo, arrastre de vértices y puntos |
| `water.js` | Demanda por clima y edad, volumen estimado, proyección con pronóstico, turnos |
| `clima.js` | ET0 y lluvia del punto de la finca, reserva del suelo, caché offline |
| `planting.js` | Marco de siembra: rejilla girada, recorte al sector y margen |
| `hydraulics.js` | Pérdidas por fricción, presión neta y diámetro sugerido |
| `view3d.js` | Three.js: terreno, sectores, plantas, flechas de escurrimiento |
| `sw.js` | Caché offline y precarga de tiles |
