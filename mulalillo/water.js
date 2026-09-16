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
 * Volumen estimado hoy en el reservorio, simulando día por día desde el primer
 * dato duro: las mediciones de nivel reinician el saldo, los llenados y tanqueros
 * suman, y cada día descuenta lo consumido.
 *
 * El consumo de un día es el riego registrado si lo hay, y si no la demanda
 * estimada. Antes se restaban los dos, así que registrar un riego lo descontaba
 * dos veces.
 */
export function currentVolumeM3(events, config, dailyM3) {
  const capacity = config.reservorioVolumenM3 || 0;
  const alturaUtil = config.reservorioAlturaUtilM || 1;
  const sorted = [...events].filter(e => e.date).sort((a, b) => a.date.localeCompare(b.date));

  const isReading = e => e.type === 'medición_nivel' && typeof e.levelM === 'number';
  const isInflow = e => (e.type === 'llenado_acequia' || e.type === 'tanquero') && typeof e.volumeM3 === 'number';
  const first = sorted.find(e => isReading(e) || isInflow(e));
  if (!first) return { volumeM3: 0, source: 'sin datos', sinceDays: 0 };

  const byDay = new Map();
  for (const e of sorted) {
    if (!byDay.has(e.date)) byDay.set(e.date, []);
    byDay.get(e.date).push(e);
  }

  const today = new Date().toISOString().slice(0, 10);
  const totalDays = Math.min(daysBetween(first.date, today), 3650);

  let volume = 0;
  let source = 'sin datos';
  let anchorDate = first.date;
  let day = new Date(first.date + 'T00:00:00Z');

  for (let i = 0; i <= totalDays; i++) {
    const key = day.toISOString().slice(0, 10);
    const dayEvents = byDay.get(key) || [];

    const reading = dayEvents.find(isReading);
    if (reading) {
      volume = Math.min(capacity, (reading.levelM / alturaUtil) * capacity);
      source = 'nivel medido';
      anchorDate = key;
    }

    for (const e of dayEvents.filter(isInflow)) {
      volume = Math.min(capacity, volume + e.volumeM3);
      source = e.type.replace('_', ' ');
      anchorDate = key;
    }

    const riegos = dayEvents.filter(e => e.type === 'riego' && typeof e.volumeM3 === 'number');
    const consumo = riegos.length
      ? riegos.reduce((sum, e) => sum + e.volumeM3, 0)
      : dailyM3;
    volume = Math.max(0, volume - consumo);

    day = new Date(day.getTime() + 86400000);
  }

  return {
    volumeM3: volume,
    source,
    anchorDate,
    sinceDays: daysBetween(anchorDate, today)
  };
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
