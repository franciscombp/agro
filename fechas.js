// Fechas en la hora de quien usa la app, no en UTC.
//
// `new Date().toISOString().slice(0, 10)` da la fecha de Greenwich: en Ecuador
// (UTC−5), desde las siete de la noche ya es "mañana". Así las tareas de hoy
// salían atrasadas por la noche, el formulario proponía la fecha de mañana y el
// modelo de agua tomaba el pronóstico de mañana como el de hoy. Open-Meteo, con
// `timezone=auto`, ya devuelve días locales: con esto todo habla el mismo día.
"use strict";

/** Día local (AAAA-MM-DD) de una fecha, un instante ISO o ahora. */
export function diaLocal(x = new Date()) {
  const d = x instanceof Date ? x : new Date(x);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function hoy() {
  return diaLocal();
}

/** El día local que cae `n` días después (o antes, si es negativo) de hoy. */
export function enDias(n, desde = new Date()) {
  const d = new Date(desde);
  d.setDate(d.getDate() + n);
  return diaLocal(d);
}
