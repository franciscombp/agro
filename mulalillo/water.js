// Módulo de agua: demanda, autonomía y turnos de la junta.
// Contexto: la junta comunitaria entrega agua 5 h cada 15 días. En sequía no alcanza.
"use strict";

import { SPECIES } from './db.js';
import { areaM2 } from './geo.js';
import { ET0_REF, RESERVA_SUELO_MM, lluviaEfectiva, contexto } from './clima.js';

/* ── Cuánta agua pide cada planta ───────────────────────────────────────────
   Antes era un número fijo por especie. El problema no era que fuera burdo
   sino que era CIEGO: daba lo mismo el día de aguacero que la semana de sol,
   y con un turno de 5 horas cada 15 días eso es justo lo que hay que decidir.

   El cálculo es el de siempre en riego (FAO-56), en tres pasos:

     1. La atmósfera pide ET0 milímetros al día. Ese dato se mide.
     2. Cada planta pide ET0 × Kc, donde Kc es lo suyo propio: un aguacate
        adulto evapora casi como una superficie de agua, la lavanda mucho menos.
     3. De eso se descuenta la lluvia aprovechable, y lo que queda hay que
        reponerlo a mano.

   Los milímetros se vuelven litros multiplicando por los m² que cubre la
   planta (1 mm sobre 1 m² es 1 litro), y esa área sale del `lppd` calibrado
   del catálogo. Por eso, con clima de referencia y planta adulta, el resultado
   es EXACTAMENTE el de antes: el modelo no reescribe la finca, le añade los
   días que se salen de lo normal. */

/** m² de suelo que cubre una planta adulta, deducidos del catálogo. */
export function areaPlantaM2(sp) {
  const kc = sp.kc || 0.8;
  return (sp.lppd || 0) / (ET0_REF * kc);
}

/**
 * Cuánto de su copa adulta tiene hoy, de 0,25 a 1.
 *
 * Sin fecha de siembra se asume adulta: es lo que la app suponía antes de
 * existir este cálculo, y conviene que un dato que falta no baje la demanda
 * por su cuenta — equivocarse por abajo aquí es quedarse sin agua.
 */
export function fraccionEdad(plant, sp, hoy = new Date()) {
  if (!plant.plantedAt) return 1;
  const madura = sp.maduraAnios || 5;
  const anios = (hoy - new Date(plant.plantedAt + 'T00:00:00Z')) / (365.25 * 86400000);
  if (!(anios >= 0)) return 1;
  return Math.max(0.25, Math.min(1, 0.25 + 0.75 * (anios / madura)));
}

/**
 * Milímetros que hay que reponer a una planta en un día dado, después de la
 * lluvia y de lo que el suelo tenga guardado.
 */
export function mmPlantaDia(plant, { et0 = ET0_REF, lluvia = 0, reservaMm = 0 } = {}) {
  const sp = SPECIES[plant.species] || SPECIES.otro;
  const etcMm = et0 * (sp.kc || 0.8) * fraccionEdad(plant, sp);
  const cubierto = lluviaEfectiva(lluvia) + Math.max(0, reservaMm);
  return Math.max(0, etcMm - cubierto);
}

/** Litros que pide una planta en un día de ET0, lluvia y reserva dados. */
export function litrosPlantaDia(plant, dia = {}) {
  const sp = SPECIES[plant.species] || SPECIES.otro;
  const area = areaPlantaM2(sp);
  if (!area) return 0;
  return mmPlantaDia(plant, dia) * area;
}

/**
 * Demanda diaria en litros, desglosada por sector y especie.
 *
 * `clima` es el contexto de clima.js. Sin él se usa el de referencia, y los
 * números son los que daba la app antes.
 */
export function demand(plants, sectors, clima = contexto(null)) {
  const bySpecies = new Map();
  const bySector = new Map();
  const dia = {
    et0: clima.et0Hoy ?? ET0_REF,
    lluvia: clima.lluviaHoy ?? 0,
    reservaMm: clima.reservaMm ?? 0
  };
  let totalL = 0;
  let totalRef = 0;     // las MISMAS plantas en clima de referencia
  let totalAdulto = 0;  // y además adultas, que es el techo del catálogo

  for (const p of plants) {
    if (p.status === 'muerto') continue;
    const litros = litrosPlantaDia(p, dia);
    totalL += litros;
    // El punto de comparación tiene que aislar una sola variable. Si la
    // referencia fueran las plantas adultas, un huerto joven parecería estar
    // ahorrando agua por el clima cuando lo que pasa es que aún no ha crecido,
    // y la pantalla acabaría dando una explicación falsa.
    totalRef += litrosPlantaDia(p, { et0: ET0_REF, lluvia: 0, reservaMm: 0 });
    totalAdulto += SPECIES[p.species]?.lppd ?? SPECIES.otro.lppd;
    bySpecies.set(p.species, (bySpecies.get(p.species) || 0) + litros);
    const key = p.sectorId || 'sin-sector';
    bySector.set(key, (bySector.get(key) || 0) + litros);
  }

  return {
    totalL,
    totalM3: totalL / 1000,
    totalRefL: totalRef,          // lo que pedirían estas mismas plantas un día normal
    totalAdultoL: totalAdulto,    // y lo que pedirán cuando estén todas adultas
    clima,
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

/**
 * Autonomía mirando el pronóstico, día por día, en vez de dividir por una
 * demanda plana.
 *
 * La división plana se equivoca en los dos sentidos y siempre en el peor
 * momento: si vienen tres días de lluvia, dice que falta agua cuando sobra; si
 * viene una semana de sol fuerte después de un día nublado, promete días que
 * no existen. Y el turno de la junta es una fecha fija: lo que importa no es
 * "cuántos días aguanto" sino "¿llego al día 15?".
 *
 * Pasado el pronóstico se sigue con el promedio de esos días, que es lo mejor
 * que se puede decir sin inventar.
 */
export function proyeccion({ volumeM3, plants, clima, dias = 21, manualM3 = null }) {
  const futuro = clima?.futuro || [];
  const vivas = plants.filter(p => p.status !== 'muerto');

  const consumoDia = (d, reservaMm) => {
    if (manualM3 != null) return manualM3;
    return vivas.reduce((sum, p) => sum + litrosPlantaDia(p, { ...d, reservaMm }), 0) / 1000;
  };

  // Después del pronóstico: el promedio de lo pronosticado, no el día de hoy,
  // que puede ser el atípico.
  const media = futuro.length
    ? { et0: futuro.reduce((s, d) => s + d.et0, 0) / futuro.length,
        lluvia: futuro.reduce((s, d) => s + d.lluvia, 0) / futuro.length }
    : { et0: clima?.et0Medio ?? ET0_REF, lluvia: 0 };

  let vol = volumeM3;
  let reserva = clima?.reservaMm ?? 0;
  let vacioEn = null;
  const curva = [];

  for (let i = 0; i < dias; i++) {
    const d = futuro[i] || media;
    // La lluvia del día entra primero al suelo; lo que el suelo no cubre es lo
    // que hay que sacar del reservorio.
    reserva = Math.min(RESERVA_SUELO_MM, reserva + lluviaEfectiva(d.lluvia ?? 0));
    const gasto = consumoDia({ ...d, lluvia: 0 }, reserva);
    // Y el suelo se vacía por lo que la planta bebió de él.
    reserva = Math.max(0, reserva - (d.et0 ?? ET0_REF) * 0.85);
    vol = Math.max(0, vol - gasto);
    curva.push({
      dia: i, volumeM3: vol, gastoM3: gasto, reservaMm: reserva,
      lluvia: d.lluvia ?? 0, pronosticado: i < futuro.length
    });
    if (vacioEn == null && vol <= 0) vacioEn = i + 1;
  }

  return {
    curva,
    diasHastaVacio: vacioEn,
    // Si no se vacía en la ventana, se informa el mínimo garantizado, no ∞:
    // decir "infinito" sobre 21 días de proyección sería mentir.
    alMenosDias: vacioEn == null ? dias : null,
    diasPronosticados: Math.min(futuro.length, dias)
  };
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
export function summary({ plants, sectors, water, config, clima }) {
  const ctx = contexto(clima);
  const d = demand(plants, sectors, ctx);
  const manualM3 = config.demandaDiariaM3 != null ? config.demandaDiariaM3 : null;
  const dailyM3 = manualM3 != null ? manualM3 : d.totalM3;

  // El saldo del reservorio se simula con la demanda de referencia, no con la
  // de hoy: es un histórico de meses y aplicarle el clima de esta semana a
  // todos los días pasados sería peor que no aplicarlo. Con el clima diario
  // guardado se podrá afinar; hoy sería una precisión falsa.
  const vol = currentVolumeM3(water, config, manualM3 != null ? manualM3 : d.totalRefL / 1000);

  const turns = upcomingTurns(config);
  const alertDays = config.alertaAutonomiaDias ?? 7;

  const proy = proyeccion({ volumeM3: vol.volumeM3, plants, clima: ctx, manualM3 });
  const days = proy.diasHastaVacio ?? autonomy(vol.volumeM3, dailyM3);

  // La pregunta que de verdad se hace quien maneja la finca no es "cuántos
  // días aguanto" sino "¿llego al turno?". Se responde con la proyección, que
  // ya tiene dentro la lluvia pronosticada.
  const nextTurn = turns[0];
  const gapDays = nextTurn ? nextTurn.inDays : null;
  let deficitM3 = 0;
  let llegaAlTurno = true;
  if (gapDays != null) {
    const hasta = proyeccion({ volumeM3: vol.volumeM3, plants, clima: ctx, dias: Math.max(1, gapDays), manualM3 });
    const ultimo = hasta.curva[hasta.curva.length - 1];
    llegaAlTurno = hasta.diasHastaVacio == null && ultimo.volumeM3 > 0;
    if (!llegaAlTurno) {
      // Lo que falta es la suma de los días que quedarían sin cubrir.
      const desde = hasta.diasHastaVacio ?? gapDays;
      deficitM3 = hasta.curva.slice(desde - 1).reduce((sum, c) => sum + c.gastoM3, 0);
    }
  }

  return {
    demand: d,
    clima: ctx,
    dailyM3,
    dailyManual: manualM3 != null,
    volume: vol,
    proyeccion: proy,
    autonomyDays: days,
    alert: Number.isFinite(days) && days < alertDays,
    alertDays,
    turns,
    llegaAlTurno,
    deficitM3,
    pastureAreaM2: sectors.filter(s => /pasto/i.test(s.name)).reduce((sum, s) => sum + areaM2(s.polygon), 0)
  };
}
