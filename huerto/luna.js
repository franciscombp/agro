// La luna y el tiempo del día, en el idioma del campo.
//
// La siembra por fases lunares es costumbre en la sierra y la app la respeta:
// no la presenta como ciencia, la presenta como el calendario que la gente ya
// usa, cruzado con lo que sí se mide (lluvia y helada). Si va a helar, ninguna
// luna hace bueno el día.
"use strict";

const SINODICO = 29.53058867;

/**
 * Fase por la edad media de la luna. Cada una de las ocho fases dura un
 * octavo del ciclo y está CENTRADA en su momento: la luna nueva cubre el día
 * antes y el día después, no sólo el después (antes, la víspera de luna
 * nueva salía como "menguante" y la de luna llena como "gibosa").
 */
export function faseLunar(fecha = new Date()) {
  const ref = Date.UTC(2000, 0, 6, 18, 14);   // una luna nueva conocida
  const dias = (fecha.getTime() - ref) / 86400000;
  const edad = ((dias % SINODICO) + SINODICO) % SINODICO;
  const octavo = Math.floor((edad / SINODICO) * 8 + 0.5) % 8;
  return { ...FASES_LUNA[octavo], edad };
}

const FASES_LUNA = [
  { emoji: '🌑', nombre: 'Luna nueva', ciclo: 'nueva' },
  { emoji: '🌒', nombre: 'Luna creciente', ciclo: 'creciente' },
  { emoji: '🌓', nombre: 'Cuarto creciente', ciclo: 'creciente' },
  { emoji: '🌔', nombre: 'Creciente gibosa', ciclo: 'creciente' },
  { emoji: '🌕', nombre: 'Luna llena', ciclo: 'llena' },
  { emoji: '🌖', nombre: 'Menguante gibosa', ciclo: 'menguante' },
  { emoji: '🌗', nombre: 'Cuarto menguante', ciclo: 'menguante' },
  { emoji: '🌘', nombre: 'Luna menguante', ciclo: 'menguante' }
];

export const CONSEJO_LUNA = {
  nueva: 'Descanso: prepara la tierra, abona y haz compost. Evita sembrar.',
  creciente: 'Siembra lo que da fruto sobre la tierra: tomate, maíz, fréjol, pimiento.',
  llena: 'Trasplanta y cosecha frutos. Evita podar.',
  menguante: 'Siembra raíces y hojas: papa, zanahoria, cebolla, lechuga. Buen momento para podar.'
};

/* Códigos de tiempo de la OMM que usa Open-Meteo, en palabras de todos los días. */
export const TIEMPO = {
  0: ['☀️', 'Despejado'], 1: ['🌤️', 'Casi despejado'], 2: ['⛅', 'Algo nublado'],
  3: ['☁️', 'Nublado'], 45: ['🌫️', 'Neblina'], 48: ['🌫️', 'Neblina'],
  51: ['🌦️', 'Llovizna'], 53: ['🌦️', 'Llovizna'], 55: ['🌧️', 'Llovizna fuerte'],
  61: ['🌧️', 'Lluvia ligera'], 63: ['🌧️', 'Lluvia'], 65: ['🌧️', 'Lluvia fuerte'],
  80: ['🌧️', 'Chubascos'], 81: ['🌧️', 'Chubascos'], 82: ['⛈️', 'Chubascos fuertes'],
  95: ['⛈️', 'Tormenta'], 96: ['⛈️', 'Tormenta'], 99: ['⛈️', 'Tormenta']
};

export function tiempo(code) {
  return TIEMPO[code] || ['🌡️', 'Tiempo'];
}

/**
 * Qué tan bueno es un día para sembrar, de la luna y el pronóstico.
 * La helada manda sobre todo; un aguacero, casi.
 */
export function valorarDia({ fecha, lluvia = null, tmin = null }) {
  const f = faseLunar(fecha);
  let puntos = { nueva: 0, creciente: 2, llena: 1, menguante: 2 }[f.ciclo];
  let nota = CONSEJO_LUNA[f.ciclo];
  let aviso = null;
  if (tmin != null && tmin <= 2) {
    puntos -= 3; aviso = 'helada'; nota = 'Riesgo de helada: no siembres y cubre lo tierno en la noche.';
  } else if (lluvia != null) {
    if (lluvia >= 25) { puntos -= 2; aviso = 'aguacero'; nota += ' Lluvia fuerte: mejor no sembrar.'; }
    else if (lluvia >= 3) { puntos += 2; nota += ' Suelo húmedo: buen día para sembrar.'; }
    else if (lluvia >= 0.5) { puntos += 1; }
    else { nota += ' Sin lluvia: riega después de sembrar.'; }
  }
  return { fecha, fase: f, puntos, nota, aviso };
}
