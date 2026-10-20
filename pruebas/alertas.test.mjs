// Alertas del receptor, contra un Telegram falso que guarda los mensajes.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { kvEnMemoria } from '../receptor/local.mjs';
import worker from '../receptor/worker.js';
import { evaluar, revisar } from '../receptor/alertas.js';

const mensajes = [];
let tg, TG;
before(async () => {
  tg = http.createServer(async (req, res) => {
    let b = ''; for await (const t of req) b += t;
    mensajes.push({ url: req.url, ...JSON.parse(b) });
    res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"ok":true}');
  });
  await new Promise(r => tg.listen(0, r));
  TG = `http://127.0.0.1:${tg.address().port}`;
});
after(() => tg.close());

const nuevoEnv = () => ({
  LECTURAS: kvEnMemoria(), TOKEN_ESCRITURA: 'w', TOKEN_LECTURA: 'r',
  TELEGRAM_TOKEN: 'abc', TELEGRAM_CHAT: '42', TELEGRAM_API: TG,
  RESERVORIO_DISPOSITIVO: 'res', RESERVORIO_MONTAJE_M: '2.3', RESERVORIO_ALTURA_UTIL_M: '2',
  RESERVORIO_CAPACIDAD_M3: '80', CAUDAL_DISPOSITIVO: 'linea', ALERTA_NIVEL_PCT: '25',
  ALERTA_PERDIDA_M3: '1.5', HORARIO_RIEGO: '06-09'
});
const post = (env, path, body, token = 'w') => worker.fetch(new Request('http://x' + path, {
  method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  body: body ? JSON.stringify(body) : undefined }), env).then(r => r.json());
const ttn = (id, fcnt, fecha, p) => ({ end_device_ids: { device_id: id }, received_at: fecha.toISOString(), uplink_message: { f_cnt: fcnt, decoded_payload: p } });
const leer = async (env, d) => (await (await worker.fetch(new Request('http://x/lecturas?desde=' + d, { headers: { authorization: 'Bearer r' } }), env)).json()).lecturas;
/* Una hora UTC de hoy (o de ayer, si aún no llegó). 07:00 UTC = 02:00 en Ecuador. */
const horaUTC = h => { const d = new Date(); d.setUTCHours(h, 0, 0, 0); if (d > new Date()) d.setUTCDate(d.getUTCDate() - 1); return d.getTime(); };
const bajando = i => Math.round((2.3 - (1.5 - i * 0.01875)) * 1000);   // 3 m³ en 2 h

test('el mensaje de prueba llega al chat; con el token de lectura, no', async () => {
  const env = nuevoEnv();
  assert.ok((await post(env, '/alertas/probar')).ok);
  assert.equal(mensajes.at(-1).chat_id, '42');
  assert.ok((await post(env, '/alertas/probar', null, 'r')).error);
});

test('fuga de madrugada: avisa una vez, no repite, y avisa al resolverse', async () => {
  const env = nuevoEnv();
  const base = horaUTC(7);
  for (let i = 0; i <= 4; i++) {
    const f = new Date(base + i * 1800000);
    await post(env, '/ingesta', ttn('res', i, f, { distance: bajando(i), BatV: 3.6 }));
    await post(env, '/ingesta', ttn('linea', 100 + i, f, { water_liters: 52000 }));
  }
  mensajes.length = 0;
  let r = await revisar(env, { leerDesde: leer, ahora: base + 2 * 3600000 });
  assert.ok(r.nuevas.includes('perdida'));
  assert.match(mensajes[0].text, /3,0 m³.*sin explicar/s);
  mensajes.length = 0;
  r = await revisar(env, { leerDesde: leer, ahora: base + 2 * 3600000 + 60000 });
  assert.equal(mensajes.length, 0);
  for (let i = 5; i <= 12; i++) {
    const f = new Date(base + i * 1800000);
    await post(env, '/ingesta', ttn('res', i, f, { distance: bajando(4), BatV: 3.6 }));
    await post(env, '/ingesta', ttn('linea', 100 + i, f, { water_liters: 52000 }));
  }
  r = await revisar(env, { leerDesde: leer, ahora: base + 12 * 1800000 + 60000 });
  assert.ok(r.resueltas.includes('perdida'));
  assert.equal(mensajes.length, 1);
  assert.match(mensajes[0].text, /^✅ Resuelto/);
});

test('riego explicado por el caudalímetro: no es pérdida', async () => {
  const env = nuevoEnv();
  const b = horaUTC(12);
  for (let i = 0; i <= 4; i++) {
    const f = new Date(b + i * 1800000);
    await post(env, '/ingesta', ttn('res', i, f, { distance: bajando(i) }));
    await post(env, '/ingesta', ttn('linea', i, f, { water_liters: 52000 + i * 750 }));
  }
  const r = await revisar(env, { leerDesde: leer, ahora: b + 2 * 3600000 });
  assert.ok(!r.activas.includes('perdida'));
});

test('sin caudalímetro: dentro del horario de riego no avisa, de madrugada sí', () => {
  const env = { ...nuevoEnv(), CAUDAL_DISPOSITIVO: '' };
  const serie = base => [0, 1, 2, 3, 4].map(i => ({ dispositivo: 'res', tipo: 'distancia', valor: bajando(i) / 1000, fecha: new Date(base + i * 1800000).toISOString() }));
  const manana = serie(horaUTC(12));
  assert.ok(!('perdida' in evaluar({ ultimas: manana.slice(-1), recientes: manana, env, ahora: horaUTC(12) + 7200000 })));
  const noche = serie(horaUTC(7));
  const a = evaluar({ ultimas: noche.slice(-1), recientes: noche, env, ahora: horaUTC(7) + 7200000 });
  assert.match(a.perdida, /fuera del horario/);
});

test('callado, batería baja y nivel bajo', () => {
  const ahora = Date.now();
  const a = evaluar({ env: nuevoEnv(), ahora,
    ultimas: [{ dispositivo: 'suelo', tipo: 'humedad_suelo', valor: 30, fecha: new Date(ahora - 8 * 3600000).toISOString() },
              { dispositivo: 'res', tipo: 'bateria', valor: 3.2, fecha: new Date(ahora - 600000).toISOString() }],
    recientes: [{ dispositivo: 'res', tipo: 'distancia', valor: 2.0, fecha: new Date(ahora - 600000).toISOString() }] });
  assert.ok('callado:suelo' in a);
  assert.ok('bateria:res' in a);
  assert.match(a['nivel-bajo'], /15 %/);
});

test('sin Telegram configurado la revisión corre y dice por qué no avisó', async () => {
  const env = { ...nuevoEnv(), TELEGRAM_TOKEN: '' };
  const base = horaUTC(7);
  for (let i = 0; i <= 4; i++) await post(env, '/ingesta', ttn('res', i, new Date(base + i * 1800000), { distance: bajando(i) }));
  const r = await revisar(env, { leerDesde: leer, ahora: base + 2 * 3600000 });
  assert.ok(r.activas.includes('perdida'));
  assert.ok(r.enviados.every(e => !e.ok && e.motivo === 'Telegram sin configurar'));
});
