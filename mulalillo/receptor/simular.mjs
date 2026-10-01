// Sensores de mentira que mandan lo mismo que mandarán los de verdad.
//
//   node mulalillo/receptor/simular.mjs [url] [token-escritura] [días]
//
// Por defecto apunta al receptor local. Genera una semana de:
//   · reservorio — un ultrasónico tipo Dragino LDDS75 por TTN, cada hora,
//     con el agua bajando de día (riego) y subiendo el día del turno
//   · suelo      — una sonda tipo Dragino LSE01 por TTN, cada 2 h
//   · lluvia     — un pluviómetro por Home Assistant, un aguacero el día 3
//
// Los mensajes tienen la forma exacta de cada plataforma, así que lo que
// funcione aquí funcionará con el aparato real: lo único que cambia es quién
// lo envía.
"use strict";

const URL_BASE = process.argv[2] || 'http://localhost:8787';
const TOKEN = process.argv[3] || 'escritura-local';
const DIAS = Number(process.argv[4] || 7);

// El reservorio: 2 m de altura útil, sensor montado 2,30 m sobre el fondo.
const MONTAJE_M = 2.30;

async function enviar(cuerpo) {
  const r = await fetch(URL_BASE + '/ingesta', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(cuerpo)
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}

function ttn(device_id, fcnt, fecha, decoded_payload) {
  return {
    end_device_ids: { device_id, application_ids: { application_id: 'finca-mulalillo' } },
    received_at: fecha.toISOString(),
    uplink_message: { f_cnt: fcnt, decoded_payload, received_at: fecha.toISOString() }
  };
}

function ha(entity_id, state, device_class, unit, fecha) {
  return { entity_id, state: String(state),
    attributes: { device_class, unit_of_measurement: unit },
    last_updated: fecha.toISOString() };
}

const ahora = Date.now();
const inicio = ahora - DIAS * 86400000;
let nivel = 1.35;               // m de agua al empezar
let humedad = 31;               // % VWC
let fcntR = 100, fcntS = 500;
let enviados = 0;

for (let t = inicio; t <= ahora; t += 3600000) {
  const f = new Date(t);
  const hora = f.getUTCHours() - 5;          // Ecuador, UTC−5
  const dia = Math.floor((t - inicio) / 86400000);

  // Riego de 6 a 8 de la mañana: baja el reservorio y sube el suelo.
  if (hora === 6 || hora === 7) { nivel -= 0.045; humedad += 1.6; }
  // El turno de la junta, el día 4: 5 horas llenando.
  if (dia === 4 && hora >= 8 && hora < 13) nivel = Math.min(2.0, nivel + 0.14);
  // El suelo se seca con el sol.
  if (hora >= 10 && hora <= 16) humedad -= 0.35;
  // Aguacero el día 3 por la tarde.
  const lluvia = dia === 3 && hora >= 15 && hora < 18 ? 6.5 : 0;
  if (lluvia) humedad += 2.2;
  humedad = Math.max(12, Math.min(44, humedad));

  // Ruido del ultrasónico: ±4 mm, como uno real con viento en la superficie.
  const ruido = (Math.random() - 0.5) * 0.008;
  const distanciaMm = Math.round((MONTAJE_M - nivel + ruido) * 1000);
  await enviar(ttn('reservorio-ultrasonico', fcntR++, f,
    { distance: distanciaMm, BatV: +(3.62 - dia * 0.002).toFixed(3) }));
  enviados++;

  if (hora % 2 === 0) {
    await enviar(ttn('suelo-arandanos', fcntS++, f,
      { water_SOIL: +humedad.toFixed(1), temp_SOIL: +(13 + Math.sin((hora - 8) / 24 * 2 * Math.PI) * 4).toFixed(1),
        BatV: 3.55 }));
    enviados++;
  }
  // El pluviómetro reporta cada hora AUNQUE no llueva: un cero dice "no
  // llovió"; el silencio no dice nada. Sin este latido la app no puede
  // distinguir un día seco de un pluviómetro caído, y lo marcaría callado.
  await enviar(ha('sensor.pluviometro_finca', lluvia, 'precipitation', 'mm', f));
  enviados++;
}

console.log(`${enviados} mensajes enviados a ${URL_BASE} (${DIAS} días).`);
console.log(`Nivel final simulado: ${nivel.toFixed(2)} m · suelo ${humedad.toFixed(1)} %`);
