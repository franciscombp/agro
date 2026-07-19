// Lógica de luna y notificaciones para Mi Huerto
// Compartida entre app.js y service worker (importScripts)
"use strict";

const SINODICO = 29.53058867;

function faseLunar(fecha = new Date()) {
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const dias = (fecha.getTime() - ref) / 86400000;
  const edad = ((dias % SINODICO) + SINODICO) % SINODICO;
  if (edad < 1.85) return { emoji: "🌑", nombre: "Luna nueva", ciclo: "nueva", edad };
  if (edad < 7.38) return { emoji: "🌒", nombre: "Luna creciente", ciclo: "creciente", edad };
  if (edad < 9.23) return { emoji: "🌓", nombre: "Cuarto creciente", ciclo: "creciente", edad };
  if (edad < 14.77) return { emoji: "🌔", nombre: "Creciente gibosa", ciclo: "creciente", edad };
  if (edad < 16.61) return { emoji: "🌕", nombre: "Luna llena", ciclo: "llena", edad };
  if (edad < 22.15) return { emoji: "🌖", nombre: "Menguante gibosa", ciclo: "menguante", edad };
  if (edad < 24.00) return { emoji: "🌗", nombre: "Cuarto menguante", ciclo: "menguante", edad };
  return { emoji: "🌘", nombre: "Luna menguante", ciclo: "menguante", edad };
}

function scoreDiaSiembra(fase, lluvia, tmin) {
  if (tmin != null && tmin <= 2) return -3;
  let score = { nueva: 0, creciente: 2, llena: 1, menguante: 2 }[fase.ciclo];
  if (lluvia != null) {
    if (lluvia >= 25) score -= 2;
    else if (lluvia >= 3) score += 2;
    else if (lluvia >= 0.5) score += 1;
  }
  return score;
}

function riegoFrecuente(c) {
  return /frecuente|constante|diario|abundante/i.test(c.riego || "");
}

function computeNotifications(cultivos, data, daily, now = new Date()) {
  const out = [];
  const dayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const siembras = data.siembras || [];

  // 1) Seguimiento: cosecha lista o por llegar
  for (const s of siembras) {
    const c = cultivos.find(x => x.id === s.cropId);
    if (!c) continue;
    const trans = Math.max(0, Math.floor((now.getTime() - new Date(s.fecha + "T12:00:00").getTime()) / 86400000));
    const rest = c.diasProduccion - trans;
    if (rest <= 0 && rest > -30) {
      out.push({
        key: `cosecha-${s.id}`,
        title: `${c.emoji} ¡Tu ${c.nombre.toLowerCase()} está a punto!`,
        body: c.modelo === "ciclo"
          ? `Cumplió su ciclo de ${c.diasProduccion} días: revisa y cosecha.`
          : `Ya debería estar empezando a producir. ¡Revísalo!`
      });
    } else if (rest > 0 && rest <= 3) {
      out.push({
        key: `pre-${s.id}`,
        title: `${c.emoji} ${c.nombre}: falta${rest === 1 ? "" : "n"} ${rest} día${rest === 1 ? "" : "s"}`,
        body: "Tu cosecha está cerca. Prepara canastos y revisa el estado de las plantas."
      });
    }
  }

  // 2) Buen día de siembra (si hay cultivos sembrables este mes en la zona)
  const mes = now.getMonth() + 1;
  const sembrables = cultivos.filter(c =>
    c.cat !== "animal" &&
    data.altitud >= c.altMin && data.altitud <= c.altMax &&
    (c.espacios || []).includes(data.espacio) &&
    c.mesesSiembra.includes(mes)
  );
  const fase = faseLunar(now);
  const lluviaHoy = daily ? (daily.precipitation_sum[0] ?? null) : null;
  const tminHoy = daily ? (daily.temperature_2m_min[0] ?? null) : null;
  if (sembrables.length && scoreDiaSiembra(fase, lluviaHoy, tminHoy) >= 3) {
    const ej = sembrables.slice(0, 3).map(c => c.nombre.toLowerCase()).join(", ");
    out.push({
      key: `siembra-${dayKey}`,
      title: "🌱 Hoy es buen día para sembrar",
      body: `${fase.emoji} ${fase.nombre}${lluviaHoy >= 3 ? " y suelo húmedo" : ""}. En tu zona: ${ej}…`
    });
  }

  // 3) Riego: día seco y sigues cultivos que piden agua frecuente
  const conRiego = siembras
    .map(s => cultivos.find(c => c.id === s.cropId))
    .filter(c => c && c.cat !== "animal" && riegoFrecuente(c));
  if (conRiego.length && daily && (daily.precipitation_sum[0] ?? 0) < 2) {
    const nombres = [...new Set(conRiego.map(c => c.nombre.toLowerCase()))].slice(0, 3).join(", ");
    out.push({
      key: `riego-${dayKey}`,
      title: "💧 Día seco: toca regar",
      body: `Hoy no se espera lluvia. Riega: ${nombres}${conRiego.length > 3 ? "…" : "."}`
    });
  }

  return out;
}
