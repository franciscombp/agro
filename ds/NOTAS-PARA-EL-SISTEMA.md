# Notas para mal-ds, desde una app que lo consume

Versión vendorizada cuando se escribió esto: **1.0.17** (`ds/version.json`).
`npm run verifica:ds` confirma que la copia no se ha desviado del origen.

Este archivo vive en el repo que **consume** el sistema, no en el que lo publica,
y es a propósito: son las cosas que una app real tuvo que resolver por su cuenta.
Cada una es una decisión que alguien volverá a tomar, distinta, en la siguiente app
— que es exactamente lo que un sistema de diseño existe para evitar.

No es una lista de quejas ni una petición de cambios: es lo que se aprendió usándolo.
Quien mantenga el sistema decide qué merece subir y qué es propio de esta app.

## 1. Lo que hubo que inventar porque no existe

| Lo que hizo falta | Cómo se resolvió aquí | Por qué podría ser del sistema |
|---|---|---|
| Medida del rail de navegación | `--rail`, definida en la app | Cualquier app con navegación lateral la necesita, y si cada una elige la suya dejan de parecer la misma familia. El sistema ya trae `.navbar`; le falta el ancho. |
| Escalera de tamaños de pantalla | Tres cortes en la app: 700 y 1100 px | Sin cortes acordados, una app pone el rail en 900 y otra en 768. El sistema no tiene que imponer el diseño, pero sí los puntos donde se cambia. |
| Rail compacto (icono + rótulo debajo) | Variante local de `.nav-item` | Es el modo tablet de la navegación que el sistema ya define para móvil y escritorio: falta el escalón del medio. |
| Alto máximo de un gráfico SVG | `max-height` en la app | Un SVG con `width:100%` escala también el texto: a 700 px de ancho, un rótulo de 9 px sale en cuerpo de titular. Le pasará a cualquiera que dibuje algo. |
| Fila con acción al final (`.pie-accion`) | Utilidad local | Un botón dentro de un párrafo parte la frase por donde caiga el ajuste de línea. Es un patrón, no un caso. |
| Estados de puntero en listas | `@media (hover: hover)` en la app | El sistema estiliza sus componentes, pero `.list-row` es de la app. Sin hover, en escritorio una fila no parece pulsable. |

## 2. Lo que el sistema resolvió bien y conviene no perder

- **El modo oscuro es gratis.** La app no escribió una sola regla de tema: basta hablar
  roles (`--app-ink`, `--app-surface`, `--app-info`, `--app-warn`) y el sistema lo resuelve
  en los dos temas. El único sitio donde hubo que intervenir fue el cielo de la vista 3D,
  y sólo porque era un hexadecimal suelto que se nos había quedado. **Esa es la prueba
  de que el sistema funciona: lo que habla en roles se adapta, lo que no, no.**
- **Los dos ejes separados** (`data-marca` para la marca, `data-tema` para claro/oscuro)
  evitan la combinatoria que arruina la mayoría de los sistemas.
- **El sprite de 81 iconos** cubrió las seis vistas sin pedir ni uno nuevo.

## 3. Dos asperezas concretas

- **El sprite no se resuelve solo.** `<use href="archivo.svg#id">` a un archivo externo no
  funciona en ningún navegador que importe, así que cada app tiene que copiar las mismas
  seis líneas que lo inyectan en el documento. Publicarlo como un fragmento listo —o
  documentarlo junto al sprite— ahorra que la séptima app lo descubra sola.
- **`mal.js` es todo o nada.** Esta app ya trae su mecánica de pestañas, hoja y toast,
  así que cargarlo duplicaría los manejadores; lo único que necesitaba de él era el
  inyector del sprite. Partirlo en piezas que se puedan tomar sueltas lo haría usable
  en apps que no parten de cero.

## 4. Una sugerencia que no es del sistema sino del reparto

Las `@font-face` están dentro de `mal.css`. Mi Huerto (la app madre de este repo)
todavía no migra al sistema entero —le cambiaría la paleta y el ritmo, y eso es una
decisión de producto—, pero sí quería su tipografía. Para conseguirlo hubo que
reescribir las declaraciones en `styles/fonts.css`, apuntando a los mismos archivos.

Publicar el bloque de fuentes aparte (`mal/fuentes.css`) permitiría adoptar la
tipografía sin adoptar la paleta, que es justo el paso intermedio que una migración
real necesita.
