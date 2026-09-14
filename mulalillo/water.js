// Módulo de agua: demanda, autonomía y turnos de la junta.
// Contexto: la junta comunitaria entrega agua 5 h cada 15 días. En sequía no alcanza.
"use strict";

import { SPECIES } from './db.js';
import { areaM2 } from './geo.js';

/** Demanda diaria en litros, desglosada por sector y especie. */
export function demand(plants, sectors) {
  const bySpecies = new Map();
  const bySector = new Map();
  let totalL = 0;

  for (const p of plants) {
    if (p.status === 'muerto') continue;
    const lppd = SPECIES[p.species]?.lppd ?? SPECIES.otro.lppd;
    totalL += lppd;
    bySpecies.set(p.species, (bySpecies.get(p.species) || 0) + lppd);
    const key = p.sectorId || 'sin-sector';
    bySector.set(key, (bySector.get(key) || 0) + lppd);
  }

  return {
    totalL,
    totalM3: totalL / 1000,
    bySpecies: [...bySpecies].map(([species, litres]) => ({
      species, label: SPECIES[species]?.label || species, litres
    })).sort((a, b) => b.litres - a.litres),
    bySector: [...bySector].map(([sectorId, litres]) => ({
      sectorId,
      name: sectors.find(s => s.id === sectorId)?.name || 'Sin sector',
      litres
    })).sort((a, b) => b.litres - a.litres)
  };
}

/**
 * Volumen estimado hoy en el reservorio.
 * Parte del último dato duro (nivel medido o llenado) y descuenta la demanda diaria.
 */
export function currentVolumeM3(events, config, dailyM3) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const capacity = config.reservorioVolumenM3 || 0;
  const alturaUtil = config.reservorioAlturaUtilM || 1;

  let anchor = null;
  for (const e of sorted) {
    if (e.type === 'medición_nivel' && typeof e.levelM === 'number') {
      anchor = { date: e.date, volume: Math.min(capacity, (e.levelM / alturaUtil) * capacity), source: 'nivel medido' };
    } else if ((e.type === 'llenado_acequia' || e.type === 'tanquero') && typeof e.volumeM3 === 'number') {
      const base = anchor ? decay(anchor, e.date, dailyM3) : 0;
      anchor = { date: e.date, volume: Math.min(capacity, base + e.volumeM3), source: e.type.replace('_', ' ') };
    } else if (e.type === 'riego' && typeof e.volumeM3 === 'number' && anchor) {
      anchor = { date: e.date, volume: Math.max(0, decay(anchor, e.date, dailyM3) - e.volumeM3), source: 'riego' };
    }
  }
  if (!anchor) return { volumeM3: 0, source: 'sin datos', sinceDays: 0 };

  const today = new Date().toISOString().slice(0, 10);
  return {
    volumeM3: Math.max(0, decay(anchor, today, dailyM3)),
    source: anchor.source,
    anchorDate: anchor.date,
    sinceDays: daysBetween(anchor.date, today)
  };
}

function decay(anchor, toDate, dailyM3) {
  const days = daysBetween(anchor.date, toDate);
  return Math.max(0, anchor.volume - days * dailyM3);
}

export function daysBetween(a, b) {
  const ms = new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z');
  return Math.max(0, Math.round(ms / 86400000));
}

/** Autonomía en días con el volumen estimado y la demanda diaria. */
export function autonomy(volumeM3, dailyM3) {
  if (dailyM3 <= 0) return Infinity;
  return volumeM3 / dailyM3;
}

/** Próximas fechas de turno de la junta, ciclo de N días. */
export function upcomingTurns(config, count = 4) {
  const cycle = config.cicloTurnoDias || 15;
  const out = [];
  if (!config.proximoTurno) return out;
  let d = new Date(config.proximoTurno + 'T00:00:00Z');
  const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
  while (d < today) d = new Date(d.getTime() + cycle * 86400000);
  for (let i = 0; i < count; i++) {
    out.push({
      date: d.toISOString().slice(0, 10),
      inDays: Math.round((d - today) / 86400000)
    });
    d = new Date(d.getTime() + cycle * 86400000);
  }
  return out;
}

/** Resumen completo para la pantalla de agua. */
export function summary({ plants, sectors, water, config }) {
  const d = demand(plants, sectors);
  const dailyM3 = config.demandaDiariaM3 != null ? config.demandaDiariaM3 : d.totalM3;
  const vol = currentVolumeM3(water, config, dailyM3);
  const days = autonomy(vol.volumeM3, dailyM3);
  const turns = upcomingTurns(config);
  const alertDays = config.alertaAutonomiaDias ?? 7;

  // ¿Alcanza el agua hasta el próximo turno?
  const nextTurn = turns[0];
  const gapDays = nextTurn ? nextTurn.inDays : null;
  const deficitM3 = gapDays != null && Number.isFinite(days) && gapDays > days
    ? (gapDays - days) * dailyM3
    : 0;

  return {
    demand: d,
    dailyM3,
    dailyManual: config.demandaDiariaM3 != null,
    volume: vol,
    autonomyDays: days,
    alert: Number.isFinite(days) && days < alertDays,
    alertDays,
    turns,
    deficitM3,
    pastureAreaM2: sectors.filter(s => /pasto/i.test(s.name)).reduce((sum, s) => sum + areaM2(s.polygon), 0)
  };
}
