// Receptor de lecturas de la finca — Cloudflare Worker.
//
// Hace falta porque la app es un sitio estático y público: cualquier clave que
// se meta en ella queda a la vista de todos. Los sensores no hablan con la app,
// hablan con esto; y la app sólo LEE de aquí, con un token aparte.
//
//   POST /ingesta        lo que mande The Things Network, Home Assistant o un
//                        JSON propio (se reconoce por la forma del mensaje)
//   GET  /lecturas?desde=2026-10-01T00:00:00Z
//                        lo que llegó desde esa fecha, para la app
//   GET  /estado         última lectura de cada aparato, para saber si alguno
//                        se calló
//
// Dos tokens, no uno: el de escritura va en TTN y en Home Assistant, que son
// servidores; el de lectura va en el teléfono, que se pierde, se presta y se
// roba. Si alguien saca el de lectura de un teléfono, puede VER el nivel del
// reservorio, pero no inventar lecturas que hagan creer que hay agua.
//
// Almacenamiento: Cloudflare KV, una clave por lectura, ordenada por fecha.
// Cada lectura va también en los metadatos de su clave, así listar un día
// entero es una sola llamada en vez de una por lectura.
"use strict";

import { normaliza } from '../normaliza.js';

const DIAS_RETENCION = 120;
const MAX_DIAS_CONSULTA = 45;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));

    try {
      if (url.pathname === '/ingesta' && request.method === 'POST') {
        if (!autorizado(request, env.TOKEN_ESCRITURA)) return error(401, 'token de escritura inválido');
        return await ingesta(request, env);
      }
      if (url.pathname === '/lecturas' && request.method === 'GET') {
        if (!autorizado(request, env.TOKEN_LECTURA)) return cors(error(401, 'token de lectura inválido'));
        return cors(await lecturas(url, env));
      }
      if (url.pathname === '/estado' && request.method === 'GET') {
        if (!autorizado(request, env.TOKEN_LECTURA)) return cors(error(401, 'token de lectura inválido'));
        return cors(json(await estado(env)));
      }
      return error(404, 'ruta desconocida');
    } catch (e) {
      return cors(error(500, String(e?.message || e)));
    }
  }
};

/* ── Escribir ─────────────────────────────────────────────────────────── */

async function ingesta(request, env) {
  let msg;
  try { msg = await request.json(); } catch { return error(400, 'el cuerpo no es JSON'); }

  const lista = normaliza(msg);
  // Se responde 200 aunque no se haya entendido nada: TTN reintenta lo que
  // recibe con error, y un mensaje que no sabemos leer no va a mejorar por
  // reintentarlo. Lo que sí se devuelve es cuántas lecturas se guardaron, que
  // es lo que se mira al configurar el webhook.
  for (const l of lista) {
    const clave = `l:${l.fecha}:${l.id}`;
    await env.LECTURAS.put(clave, '1', {
      metadata: l,
      expirationTtl: DIAS_RETENCION * 86400
    });
    // Última lectura por aparato y tipo: es lo que permite avisar de un
    // sensor callado sin recorrer todo el histórico.
    await env.LECTURAS.put(`u:${l.dispositivo}:${l.tipo}`, JSON.stringify(l));
  }
  return json({ guardadas: lista.length, tipos: lista.map(l => l.tipo) });
}

/* ── Leer ─────────────────────────────────────────────────────────────── */

async function lecturas(url, env) {
  const ahora = new Date();
  let desde = new Date(url.searchParams.get('desde') || ahora.getTime() - 7 * 86400000);
  if (Number.isNaN(desde.getTime())) return error(400, 'desde no es una fecha');
  const tope = new Date(ahora.getTime() - MAX_DIAS_CONSULTA * 86400000);
  if (desde < tope) desde = tope;
  const desdeIso = desde.toISOString();

  const out = [];
  // Un prefijo por día: KV lista por prefijo, no por rango.
  for (let d = new Date(desdeIso.slice(0, 10) + 'T00:00:00Z'); d <= ahora; d = new Date(d.getTime() + 86400000)) {
    let cursor;
    do {
      const r = await env.LECTURAS.list({ prefix: `l:${d.toISOString().slice(0, 10)}`, cursor });
      for (const k of r.keys) if (k.metadata && k.metadata.fecha > desdeIso) out.push(k.metadata);
      cursor = r.list_complete ? null : r.cursor;
    } while (cursor);
  }
  out.sort((a, b) => a.fecha.localeCompare(b.fecha));
  return json({ lecturas: out, hasta: ahora.toISOString() });
}

async function estado(env) {
  const r = await env.LECTURAS.list({ prefix: 'u:' });
  const out = [];
  for (const k of r.keys) {
    const v = await env.LECTURAS.get(k.name);
    if (v) out.push(JSON.parse(v));
  }
  return { aparatos: out };
}

/* ── Utilidades ───────────────────────────────────────────────────────── */

function autorizado(request, token) {
  if (!token) return false;          // sin token configurado no se abre nada
  const h = request.headers.get('authorization') || '';
  return h === `Bearer ${token}`;
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}

function error(status, mensaje) {
  return json({ error: mensaje }, status);
}

/* La app se sirve desde GitHub Pages y pide a otro dominio, así que el
   navegador exige estas cabeceras. Sólo se abre la lectura: la ingesta la
   llaman servidores, que no pasan por CORS. */
function cors(res) {
  const h = new Headers(res.headers);
  h.set('access-control-allow-origin', '*');
  h.set('access-control-allow-headers', 'authorization, content-type');
  h.set('access-control-allow-methods', 'GET, OPTIONS');
  return new Response(res.body, { status: res.status, headers: h });
}
