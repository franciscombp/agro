// Piezas de interfaz que usan todas las vistas: buscar en el DOM, avisos,
// la hoja inferior y el formato de números y fechas en español de Ecuador.
"use strict";

import { hoy } from './fechas.js';

export const $ = sel => document.querySelector(sel);
export const $$ = sel => [...document.querySelectorAll(sel)];

export function toast(msg, ms = 2600) {
  const el = $('#toast');
  el.innerHTML = '<svg class="icono" aria-hidden="true"><use href="#i-info"/></svg>';
  el.append(msg);
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.hidden = true), ms);
}

/* La hoja inferior es un <dialog>: el navegador pone el foco y cierra con
   Escape. Una sola a la vez: abrir otra reemplaza el contenido. */
export function openSheet(title, bodyHtml, onMount) {
  const dlg = $('#sheet');
  $('#sheet-title').textContent = title;
  const body = $('#sheet-body');
  body.innerHTML = bodyHtml;
  body.scrollTop = 0;
  if (!dlg.open) dlg.showModal();
  onMount?.(body);
}

export function closeSheet() {
  const dlg = $('#sheet');
  if (dlg.open) dlg.close();
  $('#sheet-body').innerHTML = '';
}

export function today() { return hoy(); }
export function byDateDesc(a, b) {
  return (b.date || b.dueAt || b.doneAt || b.fecha || '').localeCompare(a.date || a.dueAt || a.doneAt || a.fecha || '');
}
export function round(n, d) { return n == null ? n : Math.round(n * 10 ** d) / 10 ** d; }

/** Número con coma decimal, como se escribe en Ecuador. */
export function nf(n, d = 1) {
  return Number(n).toLocaleString('es-EC', { minimumFractionDigits: d, maximumFractionDigits: d });
}
/** Dinero o cantidades: sin decimales de más. */
export function num(n) {
  const r = n >= 100 ? Math.round(n) : Math.round(n * 100) / 100;
  return r.toLocaleString('es-EC');
}
/** Dinero: con centavos bajo 100 dólares ($0,50 y no $0,5; $3,00 y no $3), sin ellos de ahí para arriba. */
export function dinero(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return Math.abs(x) >= 100
    ? Math.round(x).toLocaleString('es-EC')
    : x.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function cap(s) { return String(s).charAt(0).toUpperCase() + String(s).slice(1); }
export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
export function attr(v) { return v == null ? '' : escapeHtml(String(v)); }

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
  return d.toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' });
}
/** "jueves 23 de octubre": como se dice una fecha en voz alta. */
export function fechaLarga(iso) {
  const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
  return d.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' });
}
/** "jue 23": para listas cortas. */
export function fechaCorta(iso) {
  const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
  return d.toLocaleDateString('es-EC', { weekday: 'short', day: 'numeric' }).replace('.', '');
}

export function haceTexto(h) {
  if (h < 1 / 60) return 'ahora';
  if (h < 1) return `hace ${Math.round(h * 60)} min`;
  if (h < 48) return `hace ${Math.round(h)} h`;
  return `hace ${Math.round(h / 24)} días`;
}

/** Días, meses o años, según lo largo que sea. */
export function formatDias(d) {
  if (d >= 330) {
    const anios = d / 365;
    if (anios < 1.25) return '1 año';
    const medio = Math.round(anios * 2) / 2;
    if (Number.isInteger(medio)) return medio + ' años';
    const enteros = medio - 0.5;
    return enteros === 1 ? '1 año y medio' : enteros + ' años y medio';
  }
  if (d >= 55) return Math.round(d / 30) + ' meses';
  return d === 1 ? '1 día' : d + ' días';
}

export function icono(id, extra = '') {
  return `<svg class="icono ${extra}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
}
