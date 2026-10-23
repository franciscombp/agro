// Riesgo de hongos: cuando el tiempo se pone húmedo y templado varios días.
//
// La botrytis (moho gris) del arándano, la mora y la fresa, y la lancha
// (tizón tardío) de la papa y el tomate no aparecen de la nada: necesitan
// hoja mojada muchas horas y una temperatura que no sea ni de helada ni de
// calor. Varios días así seguidos son el aviso para revisar y ventilar
// antes de que se vea la mancha.
//
// Es una regla de campo, no un modelo de enfermedad: no sabe del inóculo ni
// de la variedad. Por eso sólo avisa cuando el tiempo lo pone fácil de
// verdad, y sólo de lo que hay sembrado. Lógica pura, sin pantalla.
"use strict";

import { sumarDias } from './carencia.js';

export const ENFERMEDADES = [
  { id: 'botrytis', nombre: 'botrytis', cultivos: ['arandano', 'mora', 'fresa', 'tomate'],
    que: 'quita la fruta dañada y la que toca el suelo, y que corra el aire entre plantas' },
  { id: 'lancha', nombre: 'lancha', cultivos: ['papa', 'tomate'],
    que: 'mira el envés de las hojas de abajo, donde la mancha de borde claro sale primero' }
];

/* Lo que hace a un día bueno para el hongo. Humedad media alta y algo de agua
   en la hoja —lluvia o varias horas de llovizna—, con una temperatura media
   en la que el hongo crece (por debajo de 10 °C va lento; por encima de 25,
   se seca la hoja). */
const HR_MIN = 85;
const T_MIN = 10, T_MAX = 25;

export function diaFavorable(d) {
  if (d.hr == null || d.tmax == null || d.tmin == null) return null;   // sin dato no se adivina
  const tmedia = (d.tmax + d.tmin) / 2;
  const mojado = (d.lluvia || 0) >= 2 || (d.horasLluvia || 0) >= 3;
  return d.hr >= HR_MIN && mojado && tmedia >= T_MIN && tmedia <= T_MAX;
}

/**
 * ¿Hay riesgo ahora? Mira los dos últimos días y los cuatro que vienen: el
 * hongo que entra hoy viene de la humedad de anteayer, y lo que se puede
 * hacer sirve para la de pasado mañana. Hace falta que tres de esos seis días
 * lo pongan fácil y que al menos uno esté por venir: avisar de una semana
 * húmeda que ya pasó no deja nada que hacer.
 *
 * `cultivos` son los ids del catálogo que hay en la finca. Sin cultivo
 * sensible no hay aviso.
 */
export function riesgoHongos(dias, hoy, cultivos) {
  const ventana = dias.filter(d => d.date >= sumarDias(hoy, -2) && d.date <= sumarDias(hoy, 3));
  const favorables = ventana.filter(d => diaFavorable(d) === true);
  if (favorables.length < 3 || !favorables.some(d => d.date >= hoy)) return null;
  const hay = new Set(cultivos);
  const enfermedades = ENFERMEDADES
    .map(e => ({ ...e, cultivos: e.cultivos.filter(c => hay.has(c)) }))
    .filter(e => e.cultivos.length);
  if (!enfermedades.length) return null;
  return { favorables: favorables.map(d => d.date), enfermedades };
}

