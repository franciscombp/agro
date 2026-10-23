// Días de espera después de fumigar, antes de poder cosechar.
//
// Cada producto trae en la etiqueta su «período de carencia» (o «intervalo de
// seguridad»): los días que tienen que pasar entre la última aplicación y la
// cosecha para que lo que se come no lleve veneno. Se anota con la fumigación
// y desde aquí se responde una sola pregunta: ¿se puede cosechar aquí hoy?
//
// Lógica pura, sin pantalla: la usan Hoy, la ficha de cada planta, el
// formulario de cosecha y el plan por WhatsApp, y se prueba con node.
"use strict";

/** AAAA-MM-DD más `n` días, sin pasar por la hora local. */
export function sumarDias(iso, n) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/**
 * Fumigaciones hechas cuya espera todavía corre. `desde` es el primer día en
 * que ya se puede cosechar: con 7 días de carencia y una fumigación el lunes,
 * se cosecha desde el lunes siguiente. Las pendientes no cuentan: hasta que
 * se fumiga, no hay nada que esperar.
 */
export function carenciasActivas(tasks, hoy) {
  return tasks
    .filter(t => t.type === 'fumigación' && t.doneAt && Number(t.carenciaDias) > 0)
    .map(t => ({ task: t, desde: sumarDias(t.doneAt, Number(t.carenciaDias)) }))
    .filter(c => c.desde > hoy)
    .sort((a, b) => b.desde.localeCompare(a.desde));
}

/**
 * Las esperas que tocan a un sitio: `{ sectorId }`, `{ plantId }` o nada (toda
 * la finca). Una fumigación de toda la finca toca a todo; la de un sector, a
 * sus plantas. Al revés —una planta fumigada cuando se pregunta por su
 * sector— la espera vale para una parte: sale marcada `parcial`, porque el
 * resto del sector sí se puede cosechar.
 *
 * Primero las que tocan entero, y entre ellas la que termina más tarde: es la
 * que manda.
 */
export function carenciasPara({ sectorId, plantId } = {}, activas, plants = []) {
  const sectorDe = id => plants.find(p => p.id === id)?.sectorId;
  const sector = sectorId || (plantId ? sectorDe(plantId) : undefined);
  const out = [];
  for (const c of activas) {
    const { targetType, targetId } = c.task;
    let toca = false, parcial = false;
    if (targetType === 'parcel') toca = true;
    else if (targetType === 'sector') {
      if (!sector && !plantId) { toca = true; parcial = true; }
      else toca = targetId === sector;
    } else if (targetType === 'plant') {
      if (plantId) toca = targetId === plantId;
      else if (sector) { toca = sectorDe(targetId) === sector; parcial = true; }
      else { toca = true; parcial = true; }
    }
    if (toca) out.push({ ...c, parcial });
  }
  return out.sort((a, b) => (a.parcial - b.parcial) || b.desde.localeCompare(a.desde));
}
