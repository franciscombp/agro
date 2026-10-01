// El receptor corriendo en tu máquina, sin Cloudflare.
//
//   node mulalillo/receptor/local.mjs           → http://localhost:8787
//
// Usa EXACTAMENTE el mismo worker.js que se despliega; sólo cambia dónde se
// guardan las lecturas (en memoria en vez de KV). Sirve para probar la app y
// el simulador antes de tener cuenta, hardware o señal.
"use strict";

import http from 'node:http';
import worker from './worker.js';

/* KV de mentira con la misma interfaz que usa el worker: get, put con
   metadatos, list por prefijo con cursor. Las claves salen ordenadas, que
   es lo que KV garantiza y de lo que depende /lecturas. */
export function kvEnMemoria() {
  const datos = new Map();
  return {
    async get(k) { return datos.get(k)?.valor ?? null; },
    async put(k, valor, opts = {}) { datos.set(k, { valor, metadata: opts.metadata }); },
    async list({ prefix = '', cursor, limit = 1000 } = {}) {
      const todas = [...datos.keys()].filter(k => k.startsWith(prefix)).sort();
      const ini = cursor ? Number(cursor) : 0;
      const trozo = todas.slice(ini, ini + limit);
      const fin = ini + trozo.length >= todas.length;
      return {
        keys: trozo.map(name => ({ name, metadata: datos.get(name).metadata })),
        list_complete: fin,
        cursor: fin ? undefined : String(ini + trozo.length)
      };
    },
    _tamano: () => datos.size
  };
}

export function servidor({ puerto = 8787, env } = {}) {
  const entorno = env || {
    LECTURAS: kvEnMemoria(),
    TOKEN_ESCRITURA: process.env.TOKEN_ESCRITURA || 'escritura-local',
    TOKEN_LECTURA: process.env.TOKEN_LECTURA || 'lectura-local'
  };

  const srv = http.createServer(async (req, res) => {
    const trozos = [];
    for await (const t of req) trozos.push(t);
    const cuerpo = trozos.length ? Buffer.concat(trozos) : undefined;
    const request = new Request(`http://localhost:${puerto}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ? undefined : cuerpo
    });
    const r = await worker.fetch(request, entorno);
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(Buffer.from(await r.arrayBuffer()));
  });

  return new Promise(resolve => srv.listen(puerto, () => resolve({ srv, entorno })));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { entorno } = await servidor();
  console.log('Receptor local en http://localhost:8787');
  console.log(`  token de escritura: ${entorno.TOKEN_ESCRITURA}`);
  console.log(`  token de lectura:   ${entorno.TOKEN_LECTURA}`);
  console.log('Prueba: node mulalillo/receptor/simular.mjs');
}
