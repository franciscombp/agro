// Alertas del receptor: lo que tiene que llegar aunque nadie abra la app.
//
// La app ya avisa de todo esto, pero sólo con la app abierta, y quien maneja la
// finca desde lejos no la abre a las tres de la mañana. El receptor sí está
// despierto: cada 30 minutos revisa las lecturas y, si algo está mal, manda un
// mensaje por Telegram.
//
// Por qué Telegram y no WhatsApp: la API de bots de Telegram es gratuita y se
// configura en cinco minutos con @BotFather. La de WhatsApp Business exige
// verificar una empresa con Meta, plantillas de mensaje aprobadas y pago por
// conversación — demasiado para avisar de que una pila se agotó.
//
// Qué se vigila. Sólo lo que los sensores saben por sí solos: el receptor no
// tiene las plantas, los sectores ni el clima, que viven en el teléfono, así
// que "no llegas al turno" sigue siendo cosa de la app.
//
//   · callado       — un aparato lleva más de 6 h sin mandar nada
//   · batería baja  — por debajo de 3,3 V (o del 20 % si informa en %)
//   · nivel bajo    — el reservorio por debajo de un porcentaje
//   · pérdida       — el reservorio baja más de lo que explica el riego.
//                     Con caudalímetro, es lo que bajó MENOS lo que pasó por
//                     la tubería: si sobra, se está yendo agua por otro lado
//                     —una fuga, una llave abierta o alguien sacándola—. Sin
//                     caudalímetro no hay forma de separar riego de pérdida,
//                     así que dentro del horario de riego no se avisa.
//
// Cada alerta se manda UNA vez al empezar y otra al resolverse. Un aviso que se
// repite cada media hora deja de leerse a la tercera, y entonces el que importa
// tampoco se lee.
//
// Configuración (wrangler.toml [vars] y secretos):
//   TELEGRAM_TOKEN            secreto — el que da @BotFather
//   TELEGRAM_CHAT             el chat o grupo que recibe los avisos
//   RESERVORIO_DISPOSITIVO    id del ultrasónico, tal como llega de TTN
//   RESERVORIO_MONTAJE_M      altura del sensor sobre el fondo
//   RESERVORIO_ALTURA_UTIL_M  altura útil (por defecto 2)
//   RESERVORIO_CAPACIDAD_M3   capacidad (por defecto 80)
//   CAUDAL_DISPOSITIVO        id del caudalímetro, si hay (total acumulado, L)
//   ALERTA_NIVEL_PCT          por defecto 25
//   ALERTA_PERDIDA_M3         pérdida sin explicar en 3 h; por defecto 1,5
//   HORARIO_RIEGO             "06-09", horas de Ecuador; sólo cuenta sin caudalímetro
"use strict";

const CALLADO_H = 6;
const VENTANA_H = 3;

/* Los mensajes van a una persona en Ecuador: coma decimal. */
function fmt(v, d = 1) {
  return Number(v).toLocaleString('es-EC', { minimumFractionDigits: d, maximumFractionDigits: d });
}

function num(v, def) {
  const n = Number(v);
  return v != null && v !== '' && Number.isFinite(n) ? n : def;
}

/** Manda un mensaje. Nunca lanza: devuelve si salió o por qué no. */
export async function enviarTelegram(env, texto) {
  if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT) return { ok: false, motivo: 'Telegram sin configurar' };
  const base = env.TELEGRAM_API || 'https://api.telegram.org';
  try {
    const r = await fetch(`${base}/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT, text: texto, parse_mode: 'HTML' })
    });
    return r.ok ? { ok: true } : { ok: false, motivo: `Telegram respondió ${r.status}` };
  } catch (e) {
    return { ok: false, motivo: String(e?.message || e) };
  }
}

/** Volumen en m³ a partir de una distancia del ultrasónico. */
function volumenDesde(distanciaM, cfg) {
  const nivel = Math.max(0, Math.min(cfg.alturaUtil, cfg.montaje - distanciaM));
  return (nivel / cfg.alturaUtil) * cfg.capacidad;
}

function horaEcuador(fecha) {
  return (new Date(fecha).getUTCHours() + 19) % 24;
}

function enHorario(hora, rango) {
  const m = /^(\d{1,2})\s*-\s*(\d{1,2})$/.exec(rango || '');
  if (!m) return false;
  return hora >= Number(m[1]) && hora < Number(m[2]);
}

/**
 * Qué alertas están activas AHORA, con su texto. Función pura: recibe las
 * lecturas y la configuración, no toca KV ni red. Así se puede probar entera.
 */
export function evaluar({ ultimas, recientes, env, ahora = Date.now() }) {
  const activas = {};
  const cfg = {
    disp: env.RESERVORIO_DISPOSITIVO,
    montaje: num(env.RESERVORIO_MONTAJE_M, null),
    alturaUtil: num(env.RESERVORIO_ALTURA_UTIL_M, 2),
    capacidad: num(env.RESERVORIO_CAPACIDAD_M3, 80),
    caudal: env.CAUDAL_DISPOSITIVO,
    nivelPct: num(env.ALERTA_NIVEL_PCT, 25),
    perdida: num(env.ALERTA_PERDIDA_M3, 1.5)
  };

  // Callados y baterías: de la última lectura de cada aparato.
  const porAparato = new Map();
  for (const l of ultimas) {
    const a = porAparato.get(l.dispositivo) || { ultima: l.fecha };
    if (l.fecha > a.ultima) a.ultima = l.fecha;
    if (l.tipo === 'bateria') a.bateria = l.valor;
    porAparato.set(l.dispositivo, a);
  }
  for (const [disp, a] of porAparato) {
    const horas = (ahora - new Date(a.ultima).getTime()) / 3600000;
    if (horas > CALLADO_H) {
      activas[`callado:${disp}`] = `🔕 <b>${disp}</b> lleva ${Math.round(horas)} h sin mandar nada. ` +
        `Puede ser la pila, la antena o el gateway. Mientras tanto la app calcula con su última lectura.`;
    }
    const b = a.bateria;
    if (b != null && (b <= 5 ? b < 3.3 : b < 20)) {
      activas[`bateria:${disp}`] = `🪫 <b>${disp}</b>: batería baja (${b <= 5 ? fmt(b, 2) + ' V' : Math.round(b) + ' %'}). ` +
        `Conviene cambiarla en la próxima visita.`;
    }
  }

  // El reservorio necesita saber dónde está montado el sensor.
  if (cfg.disp && cfg.montaje) {
    const serie = recientes
      .filter(l => l.dispositivo === cfg.disp && l.tipo === 'distancia')
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    const ult = serie[serie.length - 1];

    if (ult && (ahora - new Date(ult.fecha).getTime()) / 3600000 <= CALLADO_H) {
      const vol = volumenDesde(ult.valor, cfg);
      const pct = (vol / cfg.capacidad) * 100;
      if (pct < cfg.nivelPct) {
        activas['nivel-bajo'] = `💧 Reservorio al <b>${Math.round(pct)} %</b> (${fmt(vol)} m³). ` +
          `Mira en la app si llega al próximo turno o hace falta un tanquero.`;
      }

      // Pérdida sin explicar en la ventana.
      const desde = ahora - VENTANA_H * 3600000;
      const enVentana = serie.filter(l => new Date(l.fecha).getTime() >= desde);
      if (enVentana.length >= 2) {
        const bajo = volumenDesde(enVentana[0].valor, cfg) - vol;
        let regadoM3 = 0;
        let hayCaudal = false;
        if (cfg.caudal) {
          const c = recientes
            .filter(l => l.dispositivo === cfg.caudal && l.tipo === 'caudal')
            .sort((a, b) => a.fecha.localeCompare(b.fecha));
          const antes = [...c].reverse().find(l => new Date(l.fecha).getTime() <= desde) || c[0];
          const ahoraC = c[c.length - 1];
          if (antes && ahoraC && ahoraC !== antes) {
            hayCaudal = true;
            const d = ahoraC.valor - antes.valor;
            regadoM3 = (d >= 0 ? d : ahoraC.valor) / 1000;
          }
        }
        const sinExplicar = bajo - regadoM3;
        // Sin medidor, basta con que la ventana TOQUE el horario de riego: si
        // se regó de 7 a 9, la lectura de las 9 ya cae fuera y sin embargo la
        // bajada es del riego.
        const regandoSinMedidor = !hayCaudal &&
          enVentana.some(l => enHorario(horaEcuador(l.fecha), env.HORARIO_RIEGO || '06-09'));
        const horas = Math.max(0.5, (new Date(ult.fecha) - new Date(enVentana[0].fecha)) / 3600000);
        if (!regandoSinMedidor && sinExplicar > cfg.perdida) {
          activas['perdida'] = `🚨 El reservorio bajó <b>${fmt(bajo)} m³</b> en ${fmt(horas, horas % 1 ? 1 : 0)} h` +
            (hayCaudal ? ` y por la línea de riego pasaron sólo ${fmt(regadoM3)} m³` : ' fuera del horario de riego') +
            `. Faltan ${fmt(sinExplicar)} m³ sin explicar: revisa fugas, llaves abiertas o tomas que no son tuyas.`;
        }
      }
    }
  }
  return activas;
}

/**
 * La revisión completa: evalúa, compara con lo que ya se avisó y manda sólo
 * lo nuevo y lo resuelto. Devuelve qué hizo, para poder probarla a mano.
 */
export async function revisar(env, { leerDesde, ahora = Date.now() }) {
  const lista = await env.LECTURAS.list({ prefix: 'u:' });
  const ultimas = [];
  for (const k of lista.keys) {
    const v = await env.LECTURAS.get(k.name);
    if (v) ultimas.push(JSON.parse(v));
  }
  const recientes = await leerDesde(env, new Date(ahora - (VENTANA_H + 1) * 3600000).toISOString());
  const activas = evaluar({ ultimas, recientes, env, ahora });

  const previas = JSON.parse((await env.LECTURAS.get('alertas:activas')) || '{}');
  const nuevas = Object.keys(activas).filter(k => !(k in previas));
  const resueltas = Object.keys(previas).filter(k => !(k in activas));

  const enviados = [];
  for (const k of nuevas) {
    const r = await enviarTelegram(env, activas[k]);
    enviados.push({ clave: k, tipo: 'nueva', ok: r.ok, motivo: r.motivo });
  }
  for (const k of resueltas) {
    const r = await enviarTelegram(env, `✅ Resuelto: ${textoResuelto(k)}`);
    enviados.push({ clave: k, tipo: 'resuelta', ok: r.ok, motivo: r.motivo });
  }

  // Se guarda lo activo aunque Telegram haya fallado: reintentar cada media
  // hora un mensaje que no sale sólo llenaría el registro. El estado queda
  // visible en la respuesta de /alertas/revisar.
  const estado = Object.fromEntries(Object.keys(activas).map(k => [k, previas[k] || new Date(ahora).toISOString()]));
  await env.LECTURAS.put('alertas:activas', JSON.stringify(estado));
  return { activas: Object.keys(activas), nuevas, resueltas, enviados };
}

function textoResuelto(clave) {
  const [tipo, disp] = clave.split(':');
  return {
    callado: `<b>${disp}</b> volvió a mandar datos.`,
    bateria: `<b>${disp}</b> ya no tiene la batería baja.`,
    'nivel-bajo': 'el reservorio volvió a subir.',
    perdida: 'el reservorio dejó de perder agua sin explicación.'
  }[tipo] || clave;
}
