// La pantalla Hoy: lo primero que se ve al abrir la app.
//
// Está pensada para quien está en la finca con el celular en la mano, y para
// alguien que no se maneja con aplicaciones. Responde, en este orden, las
// preguntas de cada mañana:
//
//   1. ¿Hay algo urgente?            → avisos, sólo si los hay
//   2. ¿Cómo está el día y el agua?  → el tiempo y una frase sobre el agua
//   3. ¿Qué tengo que hacer?         → las tareas de hoy y atrasadas
//   4. Anotar lo que pasó            → seis botones grandes, con palabras
//   5. El huerto                     → luna, siembras y mercado
//
// Cada bloque es una tarjeta que lleva a su sección. Nada de cifras técnicas
// aquí: los milímetros, los Kc y los bares están en sus pantallas, para quien
// los busque.
"use strict";

import { state } from '../estado.js';
import { faseLunar, CONSEJO_LUNA, tiempo } from '../huerto/luna.js';
import { resumenHuerto } from '../huerto/huerto.js';
import { $, escapeHtml, nf, num, dinero, fechaLarga, fechaCorta, formatDias, haceTexto, today } from '../ui.js';
import { enDias } from '../fechas.js';
import { MESES } from '../huerto/catalogo.js';

/**
 * Pinta la pantalla. `agua` es el resumen del modelo de agua, `sensores` el
 * de los aparatos, y `acciones` las funciones que abren cada formulario.
 */
export function renderHoy({ agua, sensores, tareas, acciones, irA, altitud }) {
  const cont = $('#hoy-body');
  if (!cont) return;
  const huerto = resumenHuerto();
  const c = agua.clima;
  const avisos = juntarAvisos({ agua, sensores, tareas, huerto });

  cont.innerHTML = `
    <div class="hoy-cab">
      <button class="chip-lugar" data-ir="view-finca">📍 ${escapeHtml(state.parcel.name)} · ${num(altitud)} m</button>
      <button class="btn btn--icono btn--fantasma" data-act="ajustes" aria-label="Ajustes">
        <svg class="icono" aria-hidden="true"><use href="#i-ajustes"/></svg></button>
    </div>
    <h1>Hoy</h1>
    <p class="sub">${cap(fechaLarga(today()))}</p>

    ${avisos.length ? `<div class="avisos">${avisos.map(a => `
      <button class="aviso-chip aviso-chip--${a.tono}" ${a.ir ? `data-ir="${a.ir}"` : ''} ${a.pane ? `data-pane="${a.pane}"` : ''}>
        <span class="aviso-chip__emoji">${a.emoji}</span>
        <span><strong>${a.titulo}</strong>${a.texto ? ` ${a.texto}` : ''}</span>
      </button>`).join('')}</div>` : ''}

    <div class="hoy-columnas">
    <div class="hoy-col">
    ${tarjetaTiempo(c)}
    ${tarjetaAgua(agua)}

    <div class="seccion-cab">
      <h3>Para hacer</h3>
      <button class="enlace" data-ir="view-tasks">Ver todas${tareas.pendientes ? ` (${tareas.pendientes})` : ''}</button>
    </div>
    ${tareas.lista.length ? `<div class="lista-tareas">${tareas.lista.map(t => `
      <label class="fila-tarea ${t.cuando.tono === 'atrasada' ? 'fila-tarea--atrasada' : ''}">
        <input type="checkbox" class="chk" data-hecha="${t.id}" />
        <span class="fila-tarea__txt"><strong>${escapeHtml(t.titulo)}</strong>
          <small><b class="cuando cuando--${t.cuando.tono}">${t.cuando.txt}</b>${t.notas ? ' · ' + escapeHtml(t.notas) : ''}</small></span>
      </label>`).join('')}</div>`
      : `<p class="vacio-linea">✓ Nada pendiente para estos días.</p>`}
    </div>

    <div class="hoy-col">
    <h3>Anotar</h3>
    <div class="acciones-rapidas">
      <button data-accion="regue"><span class="tile tile--agua">💧</span>Regué</button>
      <button data-accion="medi"><span class="tile tile--agua">📏</span>Medí el reservorio</button>
      <button data-accion="tarea"><span class="tile t-hortaliza">✅</span>Una tarea</button>
      <button data-accion="siembra"><span class="tile t-hortaliza">🌱</span>Sembré algo</button>
      <button data-accion="problema"><span class="tile t-fruta">🩺</span>Planta con problema</button>
      <button data-accion="precio"><span class="tile t-grano">💰</span>Un precio de feria</button>
    </div>

    <h3>Huerto</h3>
    ${tiraLuna()}
    ${tiraSiembras(huerto)}
    ${tiraMercado(huerto)}
    </div>
    </div>
  `;

  cont.querySelectorAll('[data-ir]').forEach(b => b.addEventListener('click', () => irA(b.dataset.ir, b.dataset.pane)));
  cont.querySelectorAll('[data-accion]').forEach(b => b.addEventListener('click', () => acciones[b.dataset.accion]?.()));
  cont.querySelector('[data-act="ajustes"]').addEventListener('click', () => acciones.ajustes());
  cont.querySelectorAll('[data-hecha]').forEach(el => el.addEventListener('change', () => acciones.hecha(el.dataset.hecha, el)));
  // Sin pronóstico todavía la lista está incompleta: se espera al clima.
  if (c?.pronostico?.length) notificarAvisos(avisos);
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ── Avisos: sólo lo que pide hacer algo ───────────────────────────────── */

/* ── Avisos en el teléfono ─────────────────────────────────────────────
   Lo importante de la lista de arriba también como notificación, una vez al
   día y sólo si la persona lo activó en Ajustes. Es lo que hacía el Mi Huerto
   viejo al abrirse; ahora sale de la misma lista que pinta Hoy, así que no
   puede decir algo distinto. Llega al abrir la app: los avisos con la app
   cerrada son los de Telegram, que manda el receptor de sensores. */
export const NOTIF_DIA = 'mihuerto.notificado';

export function notificacionesDisponibles() {
  return typeof Notification !== 'undefined';
}

async function notificarAvisos(avisos) {
  if (!notificacionesDisponibles() || Notification.permission !== 'granted') return;
  const dia = today();
  try { if (localStorage.getItem(NOTIF_DIA) === dia) return; localStorage.setItem(NOTIF_DIA, dia); }
  catch { return; }
  const importantes = avisos.filter(a => a.tono !== 'info').slice(0, 3);
  for (const a of importantes) {
    const titulo = `${a.emoji} ${a.titulo}`;
    const opciones = { body: a.texto || '', tag: 'mh-' + a.titulo.slice(0, 24), icon: './icons/icon-192.png' };
    try {
      // En Android `new Notification` no existe: hay que pasar por el service worker.
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg) await reg.showNotification(titulo, opciones);
      else new Notification(titulo, opciones);
    } catch { /* el navegador no quiso: Hoy ya lo muestra igual */ }
  }
}

function juntarAvisos({ agua, sensores, tareas, huerto }) {
  const out = [];
  const t = agua.turns?.[0];
  if (!agua.llegaAlTurno && t) {
    out.push({ tono: 'mal', emoji: '🚱', ir: 'view-water',
      titulo: `El agua no alcanza hasta el turno del ${fechaCorta(t.date)}.`,
      texto: `Faltarían unos ${nf(agua.deficitM3, 0)} m³: conviene pedir un tanquero o regar menos.` });
  } else if (agua.alert) {
    out.push({ tono: 'atencion', emoji: '💧', ir: 'view-water', titulo: `Queda agua para menos de ${agua.alertDays} días.` });
  }

  const pron = agua.clima?.pronostico || [];
  const helada = pron.slice(0, 4).find(d => d.tmin != null && d.tmin <= 2);
  if (helada) {
    out.push({ tono: 'frio', emoji: '❄️', titulo: `Puede helar ${helada.date === today() ? 'esta noche' : 'el ' + fechaCorta(helada.date)}.`,
      texto: 'Cubre lo tierno al atardecer y riega antes: la tierra húmeda guarda calor.' });
  }
  const aguacero = pron.slice(0, 3).find(d => d.lluvia >= 25);
  if (aguacero) {
    out.push({ tono: 'atencion', emoji: '🌧️', titulo: `Lluvia fuerte ${aguacero.date === today() ? 'hoy' : 'el ' + fechaCorta(aguacero.date)}.`,
      texto: 'Revisa los drenajes y no abones ese día.' });
  }

  for (const a of (sensores?.aparatos || []).filter(x => x.uso && x.uso !== 'ignorar')) {
    if (a.callado) out.push({ tono: 'atencion', emoji: '🔕', ir: 'view-water',
      titulo: `${a.nombre} no manda datos desde ${haceTexto(a.horas)}.`, texto: 'Revisa la pila o la antena.' });
    else if (a.bateriaBaja) out.push({ tono: 'atencion', emoji: '🪫', ir: 'view-water', titulo: `${a.nombre}: batería baja.` });
  }
  const nuevos = (sensores?.aparatos || []).filter(x => !x.uso).length;
  if (nuevos) out.push({ tono: 'info', emoji: '📡', ir: 'view-water',
    titulo: nuevos === 1 ? 'Hay un sensor nuevo mandando datos.' : `Hay ${nuevos} sensores nuevos mandando datos.`, texto: 'Dile para qué está.' });

  if (huerto.listas.length) {
    out.push({ tono: 'bien', emoji: '🧺', ir: 'view-huerto', pane: 'siembras',
      titulo: huerto.listas.length === 1 ? `${huerto.listas[0].c.nombre}: lista para cosechar.` : `${huerto.listas.length} siembras listas para cosechar.` });
  }
  return out;
}

/* ── El tiempo ─────────────────────────────────────────────────────────── */

function tarjetaTiempo(c) {
  if (!c?.conocido) {
    return `<div class="tarjeta-tiempo tarjeta-tiempo--vacia">
      <span class="tarjeta-tiempo__emoji">🌤️</span>
      <span><strong>Sin pronóstico todavía</strong><small>Se baja solo cuando haya señal. Mientras, el agua se calcula con el clima normal de la zona.</small></span>
    </div>`;
  }
  const hoyD = c.hoyD || {};
  const code = c.actual?.code ?? hoyD.code;
  const [emoji, desc] = tiempo(code);
  const temp = c.actual?.temp ?? hoyD.tmax;
  const lluvia7 = c.lluviaFutura;
  const frase = c.lluviaHoy >= 3
    ? 'Hoy llueve: no hace falta regar.'
    : c.reservaMm >= c.reservaMaxMm * 0.8
      ? 'La tierra todavía está húmeda: hoy se puede esperar para regar.'
      : lluvia7 >= 15
        ? `Viene lluvia esta semana (${nf(lluvia7, 0)} mm): aprovecha para sembrar.`
        : 'Hoy no llueve y la tierra está seca: toca regar.';
  return `<div class="tarjeta-tiempo">
    <span class="tarjeta-tiempo__emoji">${emoji}</span>
    <span class="tarjeta-tiempo__txt">
      <strong>${temp != null ? Math.round(temp) + '°C' : desc}</strong>
      <small>${desc}${c.actual?.humedad != null ? ` · humedad ${Math.round(c.actual.humedad)} %` : ''}</small>
      <small class="tarjeta-tiempo__frase">${frase}</small>
    </span>
    ${hoyD.tmax != null ? `<span class="tarjeta-tiempo__mm">↑ ${Math.round(hoyD.tmax)}°<br>↓ ${Math.round(hoyD.tmin)}°</span>` : ''}
  </div>`;
}

/* ── El agua, en una frase ─────────────────────────────────────────────── */

function tarjetaAgua(s) {
  const cap = state.config.reservorioVolumenM3 || 0;
  const pct = cap ? Math.min(100, (s.volume.volumeM3 / cap) * 100) : 0;
  const dias = s.proyeccion.diasHastaVacio;
  const t = s.turns?.[0];
  const titulo = dias != null ? `Agua para ${dias} ${dias === 1 ? 'día' : 'días'}` : `Agua para más de ${s.proyeccion.alMenosDias} días`;
  const tono = !s.llegaAlTurno ? 'mal' : s.alert ? 'atencion' : 'bien';
  return `<button class="tarjeta-agua tarjeta-agua--${tono}" data-ir="view-water">
    <span class="tile tile--agua">💧</span>
    <span class="tarjeta-agua__txt">
      <strong>${titulo}</strong>
      <span class="barra barra--agua"><span style="width:${pct.toFixed(0)}%"></span></span>
      <small>${Math.round(pct)} % del reservorio${t ? ` · turno ${t.inDays === 0 ? 'hoy' : t.inDays === 1 ? 'mañana' : 'el ' + fechaCorta(t.date)}` : ''}</small>
      ${t ? `<small class="${s.llegaAlTurno ? 'si' : 'no'}">${s.llegaAlTurno ? '✓ Llega al turno con agua' : '✗ No llega al turno'}</small>` : ''}
    </span>
    <span class="chev">›</span>
  </button>`;
}

/* ── Huerto ────────────────────────────────────────────────────────────── */

function tiraLuna() {
  const f = faseLunar();
  return `<button class="tira" data-ir="view-huerto" data-pane="sembrar">
    <span class="tira__emoji">${f.emoji}</span>
    <span class="tira__txt"><strong>${f.nombre}</strong><small>${CONSEJO_LUNA[f.ciclo]}</small></span>
    <span class="chev">›</span></button>`;
}

function tiraSiembras(h) {
  let titulo, texto;
  if (!h.siembras.length) {
    titulo = 'Para sembrar este mes';
    texto = h.paraSembrar.slice(0, 4).map(c => c.nombre.toLowerCase()).join(', ') + (h.paraSembrar.length > 4 ? '…' : '');
    texto = texto ? cap(texto) : 'Mira el calendario de siembra';
  } else {
    titulo = `Mis siembras: ${h.siembras.length}`;
    texto = h.listas.length ? `${h.listas[0].c.nombre}: ¡lista para cosechar!`
      : h.proxima ? `Próxima cosecha: ${h.proxima.c.nombre.toLowerCase()} en ${formatDias(h.proxima.rest)}` : 'Toca para ver cómo van';
  }
  return `<button class="tira tira--verde" data-ir="view-huerto" data-pane="${h.siembras.length ? 'siembras' : 'sembrar'}">
    <span class="tira__emoji">🌱</span>
    <span class="tira__txt"><strong>${titulo}</strong><small>${texto}</small></span>
    <span class="chev">›</span></button>`;
}

function tiraMercado(h) {
  const mes = new Date().getMonth() + 1;
  let titulo, texto;
  if (h.oportunos.length) {
    titulo = `${h.oportunos[0].nombre}: buena época para vender`;
    texto = `En ${MESES[mes - 1].toLowerCase()} suele pagarse mejor.`;
  } else if (h.ultimoPrecio) {
    titulo = `Última anotación: ${h.prodNombre(h.ultimoPrecio.prod)} $${dinero(h.ultimoPrecio.precio)}`;
    texto = 'Toca para ver tu libreta y las tendencias.';
  } else {
    titulo = 'Mercado y precios';
    texto = 'Anota los precios de tu feria y sabrás cuándo vender.';
  }
  return `<button class="tira tira--ambar" data-ir="view-huerto" data-pane="mercado">
    <span class="tira__emoji">💰</span>
    <span class="tira__txt"><strong>${escapeHtml(titulo)}</strong><small>${texto}</small></span>
    <span class="chev">›</span></button>`;
}

/** Tareas para Hoy: atrasadas, de hoy y de los próximos tres días. */
export function tareasDeHoy(tasks, titulo, cuando) {
  const limite = enDias(3);
  const pend = tasks.filter(t => !t.doneAt);
  const lista = pend.filter(t => t.dueAt && t.dueAt <= limite)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt)).slice(0, 6)
    .map(t => ({ id: t.id, titulo: titulo(t), cuando: cuando(t.dueAt), notas: t.notes }));
  return { lista, pendientes: pend.length };
}
