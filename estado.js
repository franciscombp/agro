// El estado de la app, en un solo sitio.
//
// Vivía como constante dentro de app.js. Con el huerto integrado hay varios
// módulos que leen lo mismo —sectores, siembras, el clima, la configuración—,
// y el estado tiene que ser uno para que todos vean el mismo dato.
"use strict";

import { BOUNDARY } from './db.js';

export const state = {
  parcel: { id: 'parcel-mulalillo', name: 'Finca Mulalillo', boundary: BOUNDARY },
  sectors: [], plants: [], infra: [], tasks: [], water: [], elevations: [], config: {},
  siembras: [],          // lo sembrado en el huerto, con fecha y cantidad
  precios: [],           // la libreta de precios de feria
  clima: null,           // serie de clima de la finca; null = todavía sin bajar
  hidrico: null,         // lluvia de 90 días frente a lo normal
  lecturas: []           // lo que han mandado los sensores
};

/* Quien cambie datos avisa, y la app repinta. Así un módulo del huerto puede
   guardar una siembra sin conocer las vistas de la finca, ni al revés. */
const oyentes = new Set();
export function alCambiar(fn) { oyentes.add(fn); }
export function avisarCambio() { for (const fn of oyentes) fn(); }
