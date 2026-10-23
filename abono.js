// Qué abonar en cada etapa del cultivo. Sin dosis.
//
// La etapa de cada sector ya se declara para el riego (water.js). La misma
// etapa dice qué necesita la planta: nitrógeno cuando mueve hoja, fósforo y
// boro en la flor, potasio cuando llena fruta, y reponer después de cosechar.
// Eso es agronomía general y vale para cualquier frutal.
//
// Lo que no vale para cualquiera es la cantidad: depende del suelo, de la
// edad de la planta y del producto. La app no la inventa: la tarea dice de
// dónde sacarla (el análisis de suelo, la etiqueta, el técnico) y deja
// anotarla. Lógica pura, sin pantalla.
"use strict";

export const ABONO_ETAPA = {
  reposo: {
    que: 'Abono orgánico',
    detalle: 'Compost o gallinaza bien descompuesta alrededor de la planta, sin tocar el tronco. Es el momento de corregir el pH si el análisis lo pide. Nada de abono químico: la planta no lo usa y se lava.'
  },
  brotacion: {
    que: 'Abono de crecimiento (nitrógeno)',
    detalle: 'La planta mueve hoja y pide nitrógeno. Mejor en dos o tres aplicaciones pequeñas que en una grande, con el suelo húmedo.'
  },
  floracion: {
    que: 'Fósforo, calcio y boro',
    detalle: 'Ayudan a cuajar la flor. Baja el nitrógeno: demasiado ahora da hoja en vez de fruta. El boro va en dosis muy pequeñas; de más, quema.'
  },
  llenado: {
    que: 'Potasio',
    detalle: 'Da tamaño, peso y dulzor a la fruta. Sigue con poco nitrógeno. Riega bien después: sin agua el abono no entra.'
  },
  cosecha: null,     // se cosecha: no se abona, y lo que se eche ahora no llega a la fruta
  poscosecha: {
    que: 'Reponer (orgánico y algo de nitrógeno)',
    detalle: 'La planta repone lo que gastó en la fruta y prepara la cosecha del próximo año. Abono orgánico y una dosis moderada de nitrógeno.'
  }
};

/* Lo que cambia por especie, cuando cambia algo importante. */
export const NOTA_ESPECIE = {
  arandano: 'Arándano: el nitrógeno en forma de amonio (sulfato de amonio), nunca nitrato ni cal, que suben el pH y lo amarillan.',
  aguacate: 'Aguacate: sus raíces se queman con la sal; poco abono y repartido, nunca pegado al tronco. Suele pedir zinc y boro.',
  mora: 'Mora: abona los tallos nuevos, que son los que darán fruta; los que ya produjeron se podan.'
};

/**
 * La tarea de abonar que corresponde a un sector en su etapa, o nada.
 * `especies` son las de las plantas vivas del sector.
 */
export function tareaAbono(sector, especies = []) {
  const a = sector?.etapa && ABONO_ETAPA[sector.etapa];
  if (!a) return null;
  const notas = [...new Set(especies)].map(sp => NOTA_ESPECIE[sp]).filter(Boolean);
  return {
    type: 'fertilización', targetType: 'sector', targetId: sector.id, etapa: sector.etapa,
    // Corta, porque sale en Hoy y en el plan por WhatsApp; el porqué está en
    // la ficha del sector.
    notes: [`${a.que}.`, ...notas, 'Cantidad: la del análisis de suelo o la etiqueta.'].join(' ')
  };
}

/** ¿Ya hay una tarea de abono pendiente para esa etapa del sector? Para no repetirla. */
export function yaHayAbono(tasks, sectorId, etapa) {
  return tasks.some(t => !t.doneAt && t.type === 'fertilización' &&
    t.targetType === 'sector' && t.targetId === sectorId && t.etapa === etapa);
}
