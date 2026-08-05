// Mi Huerto — app estática para pequeños agricultores. Estado en localStorage.
// Clima y altitud: Open-Meteo. Nombre del lugar: BigDataCloud (ambas gratuitas, sin key).
"use strict";

const STORE_KEY = "mihuerto.v2";

const state = {
  lat: null, lon: null,
  altitud: null,
  lugar: null,          // "Poblado, Provincia"
  espacio: null,
  siembras: [],         // [{id, cropId, fecha, cantidad, nota}]
  precios: [],          // [{id, prod, precio, lugar, fecha}] — libreta de precios de feria
  plantaActual: null,
  backTo: "screen-home",
  forecast: null        // cache del pronóstico diario
};

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    lat: state.lat, lon: state.lon, altitud: state.altitud,
    lugar: state.lugar, espacio: state.espacio, siembras: state.siembras,
    precios: state.precios
  }));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (s.altitud == null || !s.espacio) return false;
    Object.assign(state, s);
    state.siembras = state.siembras || [];
    state.precios = state.precios || [];
    return true;
  } catch { return false; }
}

// ---------- Navegación ----------
const tabbar = document.getElementById("tabbar");

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const scr = document.getElementById(id);
  scr.classList.add("active");
  tabbar.hidden = !scr.classList.contains("with-tabs");
  tabbar.querySelectorAll(".tab").forEach(t => t.classList.toggle("on", t.dataset.tab === id));
  window.scrollTo(0, 0);
}

tabbar.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => {
    const id = t.dataset.tab;
    show(id);
    if (id === "screen-home") renderHome();
    if (id === "screen-almanac") renderAlmanac();
    if (id === "screen-market") renderMercado();
    if (id === "screen-garden") renderGarden();
    if (id === "screen-explore") renderExplore();
  });
});

document.querySelectorAll(".btn-back").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.back === "__last" ? state.backTo : btn.dataset.back;
    show(target);
  });
});

document.querySelectorAll("[data-goto]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.goto;
    if (id === "screen-explore") renderExplore();
    show(id);
  });
});

// ---------- Onboarding: ubicación ----------
const ZONAS_MANUALES = [
  { emoji: "🌴", nombre: "Costa / Amazonía baja", desc: "Clima cálido (0 – 1.000 m)", alt: 300 },
  { emoji: "🌤️", nombre: "Valle subtropical", desc: "Clima templado (1.000 – 2.000 m)", alt: 1500 },
  { emoji: "⛰️", nombre: "Sierra andina", desc: "Clima frío moderado (2.000 – 3.200 m)", alt: 2600 },
  { emoji: "🏔️", nombre: "Sierra alta / páramo", desc: "Clima frío (más de 3.200 m)", alt: 3400 }
];

function renderManualZones() {
  const cont = document.getElementById("manual-zones");
  cont.innerHTML = ZONAS_MANUALES.map((z, i) => `
    <button class="option-card" data-zone="${i}">
      <span class="option-emoji">${z.emoji}</span>
      <span class="option-text"><strong>${z.nombre}</strong><small>${z.desc}</small></span>
    </button>`).join("");
  cont.querySelectorAll("[data-zone]").forEach(btn => {
    btn.addEventListener("click", () => {
      const z = ZONAS_MANUALES[+btn.dataset.zone];
      state.altitud = z.alt; state.lugar = z.nombre;
      state.lat = null; state.lon = null; state.forecast = null;
      show("screen-space");
    });
  });
}

document.getElementById("btn-geolocate").addEventListener("click", () => {
  const status = document.getElementById("location-status");
  if (!navigator.geolocation) {
    status.textContent = "Tu dispositivo no permite geolocalización. Elige tu zona abajo.";
    return;
  }
  status.textContent = "Buscando tu ubicación…";
  navigator.geolocation.getCurrentPosition(async pos => {
    state.lat = pos.coords.latitude;
    state.lon = pos.coords.longitude;
    state.forecast = null;
    status.textContent = "Consultando tu zona…";
    try {
      const [alt, lugar] = await Promise.all([
        fetchAltitud(state.lat, state.lon),
        fetchLugar(state.lat, state.lon)
      ]);
      state.altitud = Math.round(alt);
      state.lugar = lugar;
      show("screen-space");
    } catch {
      status.textContent = "No pudimos consultar tu zona. Elige tu zona abajo.";
    }
  }, () => {
    status.textContent = "No diste permiso de ubicación. Elige tu zona abajo.";
  }, { timeout: 10000 });
});

async function fetchAltitud(lat, lon) {
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`);
  const j = await r.json();
  if (typeof j.elevation !== "number") throw new Error("sin elevación");
  return j.elevation;
}

async function fetchLugar(lat, lon) {
  try {
    const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`);
    const j = await r.json();
    const partes = [j.locality || j.city, j.principalSubdivision].filter(Boolean);
    return partes.length ? partes.join(", ") : null;
  } catch { return null; }
}

// ---------- Onboarding: espacio ----------
function renderSpaceOptions() {
  const cont = document.getElementById("space-options");
  cont.innerHTML = ESPACIOS.map(e => `
    <button class="option-card" data-space="${e.id}">
      <span class="option-emoji">${e.emoji}</span>
      <span class="option-text"><strong>${e.nombre}</strong><small>${e.desc}</small></span>
    </button>`).join("");
  cont.querySelectorAll("[data-space]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.espacio = btn.dataset.space;
      saveState();
      renderHome();
      show("screen-home");
    });
  });
}

// ---------- Utilidades de catálogo ----------
function aptoZona(c) {
  return state.altitud >= c.altMin && state.altitud <= c.altMax && c.espacios.includes(state.espacio);
}
function catalogoZona() { return CULTIVOS.filter(aptoZona); }
function getItem(id) { return CULTIVOS.find(c => c.id === id); }
function catInfo(id) { return CATEGORIAS.find(c => c.id === id); }

function formatDias(d) {
  if (d >= 330) return Math.round(d / 365 * 10) / 10 + (d >= 660 ? " años" : " año");
  if (d >= 55) return Math.round(d / 30) + " meses";
  return d + " días";
}

function fmt(n) {
  const r = n >= 100 ? Math.round(n) : Math.round(n * 100) / 100;
  return r.toLocaleString("es-EC");
}

const SINGULAR = {
  unidades: "unidad", atados: "atado", choclos: "choclo", cuyes: "cuy",
  pollos: "pollo", cerdos: "cerdo", conejos: "conejo", ovejas: "oveja",
  litros: "litro", huevos: "huevo", "kg de miel": "kg"
};
function unidadPrecio(rendUnidad) { return SINGULAR[rendUnidad] || rendUnidad; }

function proximaSiembra(c) {
  const mes = new Date().getMonth() + 1;
  for (let i = 1; i <= 12; i++) {
    const m = ((mes - 1 + i) % 12) + 1;
    if (c.mesesSiembra.includes(m)) return "Desde " + MESES[m - 1].slice(0, 3).toLowerCase();
  }
  return "";
}

function plantCardHTML(c, badge, badgeOff) {
  const b = badge ? `<span class="plant-badge ${badgeOff ? "off" : ""}">${badge}</span>` : "";
  const sub = c.cat === "animal"
    ? `${c.modelo === "mensual" ? "Producción mensual" : c.modelo === "anual" ? "Producción anual" : "Listo en " + formatDias(c.diasProduccion)} · ${c.tipo}`
    : `Cosecha en ${formatDias(c.diasProduccion)} · ${c.tipo}`;
  return `
    <button class="plant-card" data-plant="${c.id}">
      <span class="plant-thumb t-${c.cat}">${c.emoji}</span>
      <span class="plant-info"><strong>${c.nombre}</strong><small>${sub}</small></span>
      ${b}
    </button>`;
}

function bindPlantCards(container, backTo) {
  container.querySelectorAll(".plant-card").forEach(card => {
    card.addEventListener("click", () => {
      state.plantaActual = card.dataset.plant;
      state.backTo = backTo;
      renderPlantDetail();
      show("screen-plant");
    });
  });
}

// ---------- Pronóstico (cacheado) ----------
async function getForecast() {
  if (state.forecast) return state.forecast;
  if (state.lat == null) return null;
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${state.lat}&longitude=${state.lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,et0_fao_evapotranspiration&forecast_days=14&timezone=auto`);
  state.forecast = await r.json();
  return state.forecast;
}

const WMO = {
  0: ["☀️","Despejado"], 1: ["🌤️","Mayormente despejado"], 2: ["⛅","Parcialmente nublado"],
  3: ["☁️","Nublado"], 45: ["🌫️","Neblina"], 48: ["🌫️","Neblina"],
  51: ["🌦️","Llovizna"], 53: ["🌦️","Llovizna"], 55: ["🌧️","Llovizna fuerte"],
  61: ["🌧️","Lluvia ligera"], 63: ["🌧️","Lluvia"], 65: ["🌧️","Lluvia fuerte"],
  80: ["🌧️","Chubascos"], 81: ["🌧️","Chubascos"], 82: ["⛈️","Chubascos fuertes"],
  95: ["⛈️","Tormenta"], 96: ["⛈️","Tormenta"], 99: ["⛈️","Tormenta"]
};

// ---------- Home ----------
function renderHome() {
  const zona = zonaPorAltitud(state.altitud);
  document.getElementById("home-place").textContent =
    `📍 ${state.lugar || zona.nombre} · ${state.altitud} m`;

  const mes = new Date().getMonth() + 1;
  const plantas = catalogoZona().filter(c => c.cat !== "animal");
  const ahora = plantas.filter(c => c.mesesSiembra.includes(mes)).slice(0, 8);

  const list = document.getElementById("plant-list");
  list.innerHTML = ahora.length
    ? ahora.map(c => plantCardHTML(c, "Sembrar ya")).join("")
    : `<p class="sub">Este mes no hay siembras ideales en tu zona. Revisa el almanaque para planificar.</p>`;
  bindPlantCards(list, "screen-home");

  renderGardenSummary();
  renderWeatherHome();
  renderMoonStrip();
  renderMarketStrip();
  renderInstallBanner();
  checkAndSendNotifications();
}

function renderGardenSummary() {
  const cont = document.getElementById("garden-summary");
  if (!state.siembras.length) { cont.innerHTML = ""; return; }
  const n = state.siembras.length;
  const prox = state.siembras
    .map(s => ({ s, rest: diasRestantes(s) }))
    .filter(x => x.rest != null && x.rest >= 0)
    .sort((a, b) => a.rest - b.rest)[0];
  const detalle = prox
    ? (prox.rest === 0 ? `${getItem(prox.s.cropId).nombre}: ¡listo para cosechar!`
       : `Próxima cosecha: ${getItem(prox.s.cropId).nombre} en ${formatDias(prox.rest)}`)
    : "Toca para ver el seguimiento";
  cont.innerHTML = `
    <div class="garden-summary" id="garden-summary-card">
      <span class="g-emoji">🌱</span>
      <span class="g-text"><strong>Mi huerto: ${n} ${n === 1 ? "cultivo" : "cultivos"}</strong>
      <small>${detalle}</small></span>
      <span class="chev">›</span>
    </div>`;
  document.getElementById("garden-summary-card").addEventListener("click", () => {
    renderGarden(); show("screen-garden");
  });
}

async function renderWeatherHome() {
  const card = document.getElementById("weather-card");
  const alerts = document.getElementById("alert-box");
  if (state.lat == null) {
    card.innerHTML = `<div class="weather-emoji">📍</div>
      <div class="weather-info"><strong>Sin ubicación exacta</strong>
      <small>Activa tu ubicación para ver clima, lluvia y alertas de tu zona.</small></div>`;
    alerts.innerHTML = "";
    return;
  }
  try {
    const j = await getForecast();
    const [emoji, desc] = WMO[j.current.weather_code] || ["🌡️", "Clima"];
    const lluvia7 = j.daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + (b || 0), 0);
    // Balance de agua: lluvia menos lo que evapora el sol (ET0, dato agronómico de Open-Meteo)
    const et07 = (j.daily.et0_fao_evapotranspiration || []).slice(0, 7).reduce((a, b) => a + (b || 0), 0);
    const balance = Math.round(lluvia7 - et07);
    let lluviaTxt;
    if (et07 > 0) {
      lluviaTxt = balance >= 5
        ? `Semana húmeda: la lluvia (${Math.round(lluvia7)} mm) cubre lo que evapora el sol. Aprovecha para sembrar.`
        : balance >= -10
        ? `Lluvia y sol parejos esta semana: riega solo lo más delicado.`
        : `Al suelo le faltarán ~${Math.abs(balance)} mm esta semana: toca regar seguido.`;
    } else {
      lluviaTxt = lluvia7 >= 15
        ? `Lluvia esta semana: ${Math.round(lluvia7)} mm. Aprovecha para sembrar.`
        : `Poca lluvia esta semana (${Math.round(lluvia7)} mm): riega tus plantas.`;
    }
    card.innerHTML = `<div class="weather-emoji">${emoji}</div>
      <div class="weather-info"><strong>${Math.round(j.current.temperature_2m)}°C</strong>
      <small>${desc} · humedad ${j.current.relative_humidity_2m}%</small>
      <small>${lluviaTxt}</small></div>
      <div class="weather-minmax">↑ ${Math.round(j.daily.temperature_2m_max[0])}°<br>↓ ${Math.round(j.daily.temperature_2m_min[0])}°</div>`;

    // Alertas de los próximos 7 días
    const out = [];
    const heladaIdx = j.daily.temperature_2m_min.slice(0, 7).findIndex(t => t <= 2);
    if (heladaIdx >= 0) {
      const d = new Date(j.daily.time[heladaIdx] + "T12:00:00");
      out.push(`<div class="alert-chip frost">❄️ <span><strong>Riesgo de helada</strong> el ${DIAS_SEM[d.getDay()].toLowerCase()} ${d.getDate()}: cubre tus cultivos tiernos en la noche.</span></div>`);
    }
    const aguaceroIdx = j.daily.precipitation_sum.slice(0, 7).findIndex(p => p >= 25);
    if (aguaceroIdx >= 0) {
      const d = new Date(j.daily.time[aguaceroIdx] + "T12:00:00");
      out.push(`<div class="alert-chip rain">🌧️ <span><strong>Lluvia fuerte</strong> el ${DIAS_SEM[d.getDay()].toLowerCase()} ${d.getDate()}: revisa drenajes y no abones ese día.</span></div>`);
    }
    alerts.innerHTML = out.join("");
  } catch {
    card.innerHTML = `<div class="weather-loading">No se pudo cargar el clima (revisa tu conexión).</div>`;
  }
}

// ---------- Luna ----------
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

const CONSEJO_LUNA = {
  nueva: "Descanso: prepara la tierra, abona y haz compost. Evita sembrar.",
  creciente: "Siembra lo que da fruto sobre la tierra: tomate, maíz, fréjol, pimiento.",
  llena: "Trasplanta y cosecha frutos. Evita podar.",
  menguante: "Siembra raíces y hojas: papa, zanahoria, cebolla, lechuga. Buen momento para podar."
};

function renderMoonStrip() {
  const f = faseLunar();
  const strip = document.getElementById("moon-strip");
  strip.innerHTML = `
    <span class="m-emoji">${f.emoji}</span>
    <span class="m-text"><strong>${f.nombre}</strong>
    <small>${CONSEJO_LUNA[f.ciclo]}</small></span>
    <span class="chev">›</span>`;
  strip.onclick = () => { show("screen-almanac"); renderAlmanac(); };
}

// ---------- Almanaque ----------
let almanacMes = new Date().getMonth() + 1;

async function renderAlmanac() {
  renderBestDays();
  renderMonthChips();
  renderAlmanacList();
}

async function renderBestDays() {
  const cont = document.getElementById("best-days");
  let forecast = null;
  try { forecast = await getForecast(); } catch { /* sin conexión */ }

  const dias = [];
  for (let i = 0; i < 10; i++) {
    const fecha = new Date(Date.now() + i * 86400000);
    const f = faseLunar(fecha);
    let score = { nueva: 0, creciente: 2, llena: 1, menguante: 2 }[f.ciclo];
    let notas = [CONSEJO_LUNA[f.ciclo]];
    let iconos = f.emoji;

    if (forecast && forecast.daily && forecast.daily.time[i]) {
      const lluvia = forecast.daily.precipitation_sum[i] || 0;
      const tmin = forecast.daily.temperature_2m_min[i];
      const code = forecast.daily.weather_code[i];
      iconos += " " + ((WMO[code] || ["🌡️"])[0]);
      if (tmin <= 2) { score -= 3; notas = ["❄️ Riesgo de helada: no siembres, cubre lo sembrado."]; }
      else if (lluvia >= 25) { score -= 2; notas.push("Lluvia fuerte: mejor no sembrar."); }
      else if (lluvia >= 3) { score += 2; notas.push("Suelo húmedo: buen día para sembrar."); }
      else if (lluvia >= 0.5) { score += 1; notas.push("Lluvia ligera."); }
      else { notas.push("Sin lluvia: riega después de sembrar."); }
    }
    dias.push({ fecha, f, score, notas, iconos });
  }

  const corte = [...dias].sort((a, b) => b.score - a.score)[2]?.score ?? 3;
  cont.innerHTML = dias.map(d => {
    const best = d.score >= Math.max(corte, 3);
    const hoy = d.fecha.toDateString() === new Date().toDateString();
    return `
    <div class="day-card ${best ? "best" : ""}">
      <div class="day-date"><small>${hoy ? "Hoy" : DIAS_SEM[d.fecha.getDay()]}</small><strong>${d.fecha.getDate()}</strong></div>
      <div class="day-icons">${d.iconos}</div>
      <div class="day-text">${best ? '<span class="best-tag">Buen día para sembrar</span>' : ""}
        <strong>${d.f.nombre}</strong>${d.notas.join(" ")}</div>
    </div>`;
  }).join("");
}

function renderMonthChips() {
  const cont = document.getElementById("month-chips");
  cont.innerHTML = MESES.map((m, i) =>
    `<button class="${i + 1 === almanacMes ? "on" : ""}" data-mes="${i + 1}">${m}</button>`).join("");
  cont.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => { almanacMes = +b.dataset.mes; renderMonthChips(); renderAlmanacList(); });
  });
  const on = cont.querySelector(".on");
  if (on) on.scrollIntoView({ inline: "center", block: "nearest" });
}

function renderAlmanacList() {
  const cont = document.getElementById("almanac-list");
  const lista = catalogoZona().filter(c => c.cat !== "animal" && c.mesesSiembra.includes(almanacMes));
  cont.innerHTML = lista.length
    ? lista.map(c => plantCardHTML(c, catInfo(c.cat).nombre, true)).join("")
    : `<p class="sub">No hay siembras recomendadas en ${MESES[almanacMes - 1].toLowerCase()} para tu zona.</p>`;
  bindPlantCards(cont, "screen-almanac");
}

// ---------- Mi huerto (seguimiento) ----------
function diasTranscurridos(s) {
  return Math.max(0, Math.floor((Date.now() - new Date(s.fecha + "T12:00:00").getTime()) / 86400000));
}
function diasRestantes(s) {
  const c = getItem(s.cropId);
  if (!c) return null;
  return Math.max(0, c.diasProduccion - diasTranscurridos(s));
}

function renderGarden() {
  const cont = document.getElementById("garden-list");
  if (!state.siembras.length) {
    cont.innerHTML = `
      <div class="empty-state">
        <div class="e-emoji">🌱</div>
        <strong>Aún no sigues ningún cultivo</strong>
        Agrega lo que ya tienes sembrado o lo que vas a sembrar, y te avisamos cuándo cosechar.
      </div>`;
    return;
  }
  cont.innerHTML = state.siembras.map(s => {
    const c = getItem(s.cropId);
    if (!c) return "";
    const trans = diasTranscurridos(s);
    const total = c.diasProduccion;
    const pct = Math.min(100, Math.round(trans / total * 100));
    const rest = Math.max(0, total - trans);
    const enProduccion = trans >= total && c.modelo !== "ciclo";
    const listo = trans >= total && c.modelo === "ciclo";
    const status = enProduccion ? `<span class="track-status st-cont">En producción</span>`
      : listo ? `<span class="track-status st-ready">¡Listo para cosechar!</span>`
      : `<span class="track-status st-grow">Creciendo</span>`;
    const fechaCosecha = new Date(new Date(s.fecha + "T12:00:00").getTime() + total * 86400000);
    const meta = listo || enProduccion
      ? (enProduccion ? `Produce desde ${fechaCosecha.getDate()} de ${MESES[fechaCosecha.getMonth()].toLowerCase()}` : `Cumplió su ciclo de ${formatDias(total)}`)
      : `Faltan ${formatDias(rest)} · ${c.modelo === "ciclo" && c.cat !== "animal" ? "cosecha" : c.cat === "animal" ? "produce desde" : "primera cosecha"} ~${fechaCosecha.getDate()} de ${MESES[fechaCosecha.getMonth()].toLowerCase()}`;
    const unidad = UNIDAD_INFO[c.unidad];
    return `
    <div class="track-card" data-sid="${s.id}">
      <div class="track-head">
        <span class="plant-thumb t-${c.cat}">${c.emoji}</span>
        <span class="track-title">
          <strong>${c.nombre}</strong>
          <small>${s.cantidad} ${s.cantidad === 1 ? unidad.singular : unidad.plural} · ${c.cat === "animal" ? "desde" : "sembrado"} hace ${formatDias(Math.max(trans, 0))}</small>
        </span>
        ${status}
      </div>
      <div class="track-bar"><span style="width:${pct}%"></span></div>
      <div class="track-meta"><span>${meta}</span><span>${pct}%</span></div>
      ${s.nota ? `<div class="track-note">📝 ${s.nota}</div>` : ""}
      <div class="track-actions">
        <button class="see" data-see="${c.id}">Ver guía</button>
        ${listo ? `<button class="harvest" data-harvest="${s.id}">✓ Cosechado</button>` : `<button data-del="${s.id}">Quitar</button>`}
      </div>
    </div>`;
  }).join("");

  cont.querySelectorAll("[data-see]").forEach(b => b.addEventListener("click", () => {
    state.plantaActual = b.dataset.see; state.backTo = "screen-garden";
    renderPlantDetail(); show("screen-plant");
  }));
  cont.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => {
    if (confirm("¿Quitar este cultivo del seguimiento?")) {
      state.siembras = state.siembras.filter(s => s.id !== b.dataset.del);
      saveState(); renderGarden();
    }
  }));
  cont.querySelectorAll("[data-harvest]").forEach(b => b.addEventListener("click", () => {
    state.siembras = state.siembras.filter(s => s.id !== b.dataset.harvest);
    saveState(); renderGarden();
  }));
}

// ---------- Agregar siembra ----------
let addCropId = null;

document.getElementById("btn-add-open").addEventListener("click", () => openAdd(null));
document.getElementById("btn-track").addEventListener("click", () => openAdd(state.plantaActual));

function openAdd(cropId) {
  addCropId = cropId;
  const pick = document.getElementById("add-step-pick");
  const form = document.getElementById("add-step-form");
  if (cropId) {
    pick.hidden = true; form.hidden = false;
    fillAddForm();
  } else {
    pick.hidden = false; form.hidden = true;
    document.getElementById("add-search").value = "";
    renderAddList("");
  }
  document.getElementById("add-date").value = new Date().toISOString().slice(0, 10);
  show("screen-add");
}

function renderAddList(q) {
  const cont = document.getElementById("add-list");
  const lista = catalogoZona().filter(c => c.nombre.toLowerCase().includes(q.toLowerCase()));
  cont.innerHTML = lista.map(c => plantCardHTML(c, catInfo(c.cat).nombre, true)).join("");
  cont.querySelectorAll(".plant-card").forEach(card => {
    card.addEventListener("click", () => {
      addCropId = card.dataset.plant;
      document.getElementById("add-step-pick").hidden = true;
      document.getElementById("add-step-form").hidden = false;
      fillAddForm();
    });
  });
}

document.getElementById("add-search").addEventListener("input", e => renderAddList(e.target.value));

function fillAddForm() {
  const c = getItem(addCropId);
  const u = UNIDAD_INFO[c.unidad];
  document.getElementById("add-selected").innerHTML =
    `<span class="a-emoji">${c.emoji}</span> ${c.nombre}`;
  document.getElementById("add-qty-label").textContent =
    c.unidad === "m2" ? "¿Cuántos m² sembraste?" : `¿Cuántos ${u.plural}?`;
  document.getElementById("add-qty").value = c.unidad === "m2" ? 10 : (c.unidad === "animal" ? 5 : 5);
}

document.getElementById("btn-add-save").addEventListener("click", () => {
  const fecha = document.getElementById("add-date").value;
  const cantidad = Math.max(1, +document.getElementById("add-qty").value || 1);
  const nota = document.getElementById("add-note").value.trim();
  if (!fecha || !addCropId) return;
  state.siembras.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    cropId: addCropId, fecha, cantidad, nota
  });
  saveState();
  document.getElementById("add-note").value = "";
  renderGarden();
  show("screen-garden");
});

// ---------- Explorar ----------
let exploreCat = "todos";

function renderExplore() {
  const chips = document.getElementById("cat-chips");
  chips.innerHTML = [`<button class="${exploreCat === "todos" ? "on" : ""}" data-cat="todos">Todos</button>`]
    .concat(CATEGORIAS.map(c =>
      `<button class="${exploreCat === c.id ? "on" : ""}" data-cat="${c.id}">${c.emoji} ${c.nombre}</button>`)).join("");
  chips.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => { exploreCat = b.dataset.cat; renderExplore(); });
  });
  renderExploreList();
}

function renderExploreList() {
  const q = document.getElementById("search-input").value.toLowerCase();
  const soloZona = document.getElementById("zone-only").checked;
  const cont = document.getElementById("explore-list");
  const mes = new Date().getMonth() + 1;

  let lista = CULTIVOS.filter(c =>
    (exploreCat === "todos" || c.cat === exploreCat) &&
    c.nombre.toLowerCase().includes(q) &&
    (!soloZona || aptoZona(c))
  );

  cont.innerHTML = lista.length
    ? lista.map(c => {
        if (!aptoZona(c)) return plantCardHTML(c, "No apto en tu zona", true);
        if (c.cat === "animal") return plantCardHTML(c, "Todo el año");
        return c.mesesSiembra.includes(mes)
          ? plantCardHTML(c, "Sembrar ya")
          : plantCardHTML(c, proximaSiembra(c), true);
      }).join("")
    : `<p class="sub">No encontramos nada con esa búsqueda.</p>`;
  bindPlantCards(cont, "screen-explore");
}

document.getElementById("search-input").addEventListener("input", renderExploreList);
document.getElementById("zone-only").addEventListener("change", renderExploreList);

// ---------- Mercado ----------
// Libreta de precios de feria (localStorage) + referencia internacional (Banco Mundial, datos abiertos).
const INTL_CACHE_KEY = "mihuerto.intl.v1";

function prodNombre(prod) {
  if (prod.startsWith("otro:")) {
    const n = prod.slice(5);
    return n.charAt(0).toUpperCase() + n.slice(1);
  }
  const c = getItem(prod);
  return c ? c.nombre : prod;
}
function prodEmoji(prod) {
  const c = getItem(prod);
  return c ? c.emoji : "🏷️";
}
function prodUnidad(prod) {
  const c = getItem(prod);
  return c ? unidadPrecio(c.rendUnidad) : null;
}

function renderMercado() {
  renderPriceList();
  renderSellWindow();
  renderIntlPrices();
  renderSellTip();
}

// --- Formulario de la libreta ---
function fillPriceProductSelect() {
  const sel = document.getElementById("pf-prod");
  const sigo = [...new Set(state.siembras.map(s => s.cropId))];
  const anotados = [...new Set(state.precios.map(p => p.prod))]
    .filter(p => !p.startsWith("otro:") && !sigo.includes(p) && getItem(p));
  const zona = catalogoZona().map(c => c.id).filter(id => !sigo.includes(id) && !anotados.includes(id));
  const grupo = (ids, label) => ids.length
    ? `<optgroup label="${label}">` + ids.map(id => {
        const c = getItem(id);
        return c ? `<option value="${id}">${c.emoji} ${c.nombre}</option>` : "";
      }).join("") + `</optgroup>`
    : "";
  sel.innerHTML = grupo(sigo, "Mi huerto") + grupo(anotados, "Ya anotados") + grupo(zona, "De mi zona") +
    `<option value="__otro">✏️ Otro producto…</option>`;
  syncPriceUnit();
}

function syncPriceUnit() {
  const v = document.getElementById("pf-prod").value;
  document.getElementById("pf-prod-otro").hidden = v !== "__otro";
  const u = v && v !== "__otro" ? prodUnidad(v) : null;
  document.getElementById("pf-precio-label").textContent = u ? `Precio por ${u} ($)` : "Precio que viste ($)";
}

document.getElementById("btn-price-add").addEventListener("click", () => {
  const form = document.getElementById("price-form");
  form.hidden = !form.hidden;
  if (!form.hidden) {
    fillPriceProductSelect();
    document.getElementById("pf-precio").value = "";
    document.getElementById("pf-precio").focus();
  }
});
document.getElementById("pf-cancel").addEventListener("click", () => {
  document.getElementById("price-form").hidden = true;
});
document.getElementById("pf-prod").addEventListener("change", syncPriceUnit);

document.getElementById("pf-save").addEventListener("click", () => {
  let prod = document.getElementById("pf-prod").value;
  if (prod === "__otro") {
    const n = document.getElementById("pf-prod-otro").value.trim().toLowerCase();
    if (!n) { document.getElementById("pf-prod-otro").focus(); return; }
    prod = "otro:" + n;
  }
  const precio = +document.getElementById("pf-precio").value;
  if (!prod || !precio || precio <= 0) { document.getElementById("pf-precio").focus(); return; }
  state.precios.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    prod, precio,
    lugar: document.getElementById("pf-lugar").value.trim(),
    fecha: new Date().toISOString().slice(0, 10)
  });
  saveState();
  document.getElementById("price-form").hidden = true;
  document.getElementById("pf-prod-otro").value = "";
  document.getElementById("pf-lugar").value = "";
  renderPriceList();
});

// --- Mini-gráfica de tendencia ---
function sparklineSVG(vals) {
  if (vals.length < 2) {
    return `<svg class="spark s-flat" viewBox="0 0 72 24"><line x1="4" y1="12" x2="68" y2="12" stroke-dasharray="2 4"/></svg>`;
  }
  const serie = vals.slice(-8);
  const min = Math.min(...serie), max = Math.max(...serie);
  const span = max - min || 1;
  const pts = serie.map((v, i) => [
    (4 + i / (serie.length - 1) * 64).toFixed(1),
    (20 - (v - min) / span * 16).toFixed(1)
  ]);
  const dir = serie[serie.length - 1] > serie[0] ? "s-up" : serie[serie.length - 1] < serie[0] ? "s-down" : "s-flat";
  const fin = pts[pts.length - 1];
  return `<svg class="spark ${dir}" viewBox="0 0 72 24">
    <polyline points="${pts.map(p => p.join(",")).join(" ")}"/>
    <circle cx="${fin[0]}" cy="${fin[1]}" r="2.4"/></svg>`;
}

function renderPriceList() {
  const cont = document.getElementById("price-list");
  if (!state.precios.length) {
    cont.innerHTML = `<div class="price-empty">📒 Tu libreta está vacía. Cada vez que vayas a la feria anota aquí a cuánto se vende lo tuyo: con el tiempo verás si sube o baja y cuándo conviene vender.</div>`;
    return;
  }
  const grupos = {};
  for (const p of state.precios) (grupos[p.prod] = grupos[p.prod] || []).push(p);

  cont.innerHTML = Object.entries(grupos).map(([prod, regs]) => {
    const serie = [...regs].reverse().map(r => r.precio); // cronológico
    const ult = regs[0], prev = regs[1];
    let trend = `<span class="trend flat">primer registro</span>`;
    if (prev) {
      const dif = ult.precio - prev.precio;
      const pct = Math.abs(Math.round(dif / prev.precio * 100));
      trend = dif > 0.001 ? `<span class="trend up">▲ subió ${pct}%</span>`
        : dif < -0.001 ? `<span class="trend down">▼ bajó ${pct}%</span>`
        : `<span class="trend flat">= sin cambio</span>`;
    }
    const c = getItem(prod);
    const u = prodUnidad(prod);
    const f = new Date(ult.fecha + "T12:00:00");
    return `
    <div class="price-card">
      <div class="price-head">
        <span class="plant-thumb t-${c ? c.cat : "hierba"}">${prodEmoji(prod)}</span>
        <span class="price-info">
          <strong>${prodNombre(prod)}</strong>
          <small>${f.getDate()} de ${MESES[f.getMonth()].toLowerCase()}${ult.lugar ? " · " + ult.lugar : ""} · ${regs.length} ${regs.length === 1 ? "registro" : "registros"}</small>
        </span>
        <span class="price-now">$${fmt(ult.precio)}${u ? `<small>/${u}</small>` : ""}</span>
      </div>
      <div class="price-foot">
        ${sparklineSVG(serie)}
        <span class="price-meta">${trend}${c ? `<small>Referencia: $${fmt(c.precio)}/${unidadPrecio(c.rendUnidad)}</small>` : ""}</span>
        <button class="price-del" data-delprice="${prod}" aria-label="Borrar historial">🗑</button>
      </div>
    </div>`;
  }).join("");

  cont.querySelectorAll("[data-delprice]").forEach(b => b.addEventListener("click", () => {
    if (confirm(`¿Borrar el historial de precios de ${prodNombre(b.dataset.delprice).toLowerCase()}?`)) {
      state.precios = state.precios.filter(p => p.prod !== b.dataset.delprice);
      saveState();
      renderPriceList();
    }
  }));
}

// --- ¿Cuándo vender mejor? ---
function renderSellWindow() {
  const cont = document.getElementById("sell-window");
  const mes = new Date().getMonth() + 1;
  const sigo = [...new Set(state.siembras.map(s => s.cropId))].map(getItem).filter(Boolean);
  const conDato = sigo.filter(c => c.mesesPrecioAlto);
  const otros = catalogoZona().filter(c => c.mesesPrecioAlto && !conDato.includes(c));
  const lista = conDato.concat(otros).slice(0, 6);
  if (!lista.length) {
    cont.innerHTML = `<p class="sub">Los productos de tu zona mantienen un precio parecido todo el año.</p>`;
    return;
  }
  cont.innerHTML = lista.map(c => {
    const ahora = c.mesesPrecioAlto.includes(mes);
    return `
    <div class="sell-row ${ahora ? "now" : ""}" data-plant-link="${c.id}">
      <span class="sell-emoji">${c.emoji}</span>
      <span class="sell-info">
        <strong>${c.nombre}${ahora ? ' <span class="sell-now-tag">¡buen precio ahora!</span>' : ""}</strong>
        <span class="sell-months">${MESES.map((m, i) =>
          `<i class="${c.mesesPrecioAlto.includes(i + 1) ? "hi" : ""}${i + 1 === mes ? " cur" : ""}" title="${m}">${m[0]}</i>`).join("")}</span>
      </span>
    </div>`;
  }).join("");
  cont.querySelectorAll("[data-plant-link]").forEach(r => r.addEventListener("click", () => {
    state.plantaActual = r.dataset.plantLink;
    state.backTo = "screen-market";
    renderPlantDetail();
    show("screen-plant");
  }));
}

// --- Referencia internacional (Banco Mundial, sin key; caché 24 h y respaldo sin conexión) ---
async function fetchIntlPrices() {
  try {
    const cached = JSON.parse(localStorage.getItem(INTL_CACHE_KEY) || "null");
    if (cached && cached.series && Date.now() - cached.ts < 86400000) return cached.series;
  } catch { /* caché corrupta: se ignora */ }

  const inds = MERCADO_INTL.map(m => m.ind).join(";");
  const r = await fetch(`https://api.worldbank.org/v2/country/wld/indicator/${inds}?source=15&format=json&per_page=300&mrv=8`);
  const j = await r.json();
  if (!Array.isArray(j) || !Array.isArray(j[1])) throw new Error("formato inesperado");
  const series = {};
  for (const row of j[1]) {
    if (row.value == null || !row.indicator) continue;
    (series[row.indicator.id] = series[row.indicator.id] || []).push({ fecha: row.date, valor: row.value });
  }
  for (const id in series) series[id].sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (!Object.keys(series).length) throw new Error("sin datos");
  localStorage.setItem(INTL_CACHE_KEY, JSON.stringify({ ts: Date.now(), series }));
  return series;
}

function fechaWB(s) {
  const m = /^(\d{4})M(\d{2})$/.exec(s);
  return m ? MESES[+m[2] - 1].slice(0, 3).toLowerCase() + " " + m[1] : s;
}

async function renderIntlPrices() {
  const cont = document.getElementById("intl-prices");
  const nota = document.getElementById("intl-note");
  let series = null;
  try { series = await fetchIntlPrices(); } catch { /* usamos valores de respaldo */ }

  cont.innerHTML = MERCADO_INTL.map(m => {
    const s = series && series[m.ind];
    let valor = m.fallback, fechaTxt = m.fallbackFecha, trend = "";
    if (s && s.length) {
      valor = s[s.length - 1].valor;
      fechaTxt = fechaWB(s[s.length - 1].fecha);
      const base = s.length >= 4 ? s[s.length - 4].valor : (s.length >= 2 ? s[0].valor : null);
      if (base) {
        const pct = Math.round((valor - base) / base * 100);
        trend = pct > 1 ? `<span class="trend up">▲ ${pct}%</span>`
          : pct < -1 ? `<span class="trend down">▼ ${Math.abs(pct)}%</span>`
          : `<span class="trend flat">estable</span>`;
      }
    }
    // Traducción a la unidad de feria: quintal (45,4 kg) o saco de 50 kg
    const mostrado = m.mostrar === "qq" ? `$${fmt(valor * 0.04536)}<small>/quintal</small>`
      : m.mostrar === "saco" ? `$${fmt(valor * 0.05)}<small>/saco 50 kg</small>`
      : `$${fmt(valor)}<small>/kg</small>`;
    return `
    <div class="intl-row">
      <span class="sell-emoji">${m.emoji}</span>
      <span class="intl-info"><strong>${m.nombre}</strong><small>${fechaTxt}</small></span>
      ${trend}
      <span class="intl-price">${mostrado}</span>
    </div>`;
  }).join("");

  nota.textContent = series
    ? "Referencia mundial (Banco Mundial). Tu precio local depende de la feria, pero sigue la misma corriente. Cambio: últimos 3 meses."
    : "Sin conexión ahora: valores de referencia guardados. Se actualizan solos cuando haya internet.";
}

function renderSellTip() {
  const dia = Math.floor(Date.now() / 86400000);
  document.getElementById("sell-tip").innerHTML =
    `<div class="tip-box">💡 <strong>Para vender mejor:</strong> ${CONSEJOS_VENTA[dia % CONSEJOS_VENTA.length]}</div>`;
}

// --- Resumen de mercado en la pantalla Hoy ---
function renderMarketStrip() {
  const cont = document.getElementById("market-strip");
  if (!cont) return;
  const mes = new Date().getMonth() + 1;
  const sigo = [...new Set(state.siembras.map(s => s.cropId))].map(getItem).filter(Boolean);
  const oportunos = sigo.filter(c => c.mesesPrecioAlto && c.mesesPrecioAlto.includes(mes));
  const ult = state.precios[0];
  let texto;
  if (oportunos.length) {
    texto = `<strong>${oportunos[0].emoji} ${oportunos[0].nombre}: buena época para vender</strong><small>En ${MESES[mes - 1].toLowerCase()} suele pagarse mejor. Mira el mercado.</small>`;
  } else if (ult) {
    const prev = state.precios.find(p => p.prod === ult.prod && p.id !== ult.id);
    const dir = prev ? (ult.precio > prev.precio ? " ▲" : ult.precio < prev.precio ? " ▼" : "") : "";
    texto = `<strong>Última anotación: ${prodNombre(ult.prod)} $${fmt(ult.precio)}${dir}</strong><small>Toca para ver tu libreta y las tendencias.</small>`;
  } else {
    texto = `<strong>Mercado y precios</strong><small>Anota los precios de tu feria y sabrás cuándo vender.</small>`;
  }
  cont.innerHTML = `
    <div class="market-strip" id="market-strip-card">
      <span class="m-emoji">💰</span>
      <span class="m-text">${texto}</span>
      <span class="chev">›</span>
    </div>`;
  document.getElementById("market-strip-card").addEventListener("click", () => {
    renderMercado();
    show("screen-market");
  });
}

// ---------- Detalle ----------
function renderPlantDetail() {
  const c = getItem(state.plantaActual);
  const esAnimal = c.cat === "animal";
  const mes = new Date().getMonth() + 1;
  const info = catInfo(c.cat);

  let cuando;
  if (esAnimal) {
    cuando = c.modelo === "ciclo"
      ? `Listo para la venta en ${formatDias(c.diasProduccion)}.`
      : `Empieza a producir en ${formatDias(c.diasProduccion)}.${c.vida ? " " + c.vida + "." : ""}`;
  } else if (c.modelo !== "ciclo") {
    cuando = `Primera cosecha en ${formatDias(c.diasProduccion)}, luego produce cada ${c.modelo === "anual" ? "año" : "mes"}.${c.vida ? " " + c.vida + "." : ""}`;
  } else {
    const fechaCosecha = new Date(Date.now() + c.diasProduccion * 86400000);
    cuando = c.mesesSiembra.includes(mes)
      ? `Si siembras hoy, cosechas hacia ${MESES[fechaCosecha.getMonth()].toLowerCase()} (${formatDias(c.diasProduccion)}).`
      : `Mejor espera: ${proximaSiembra(c).toLowerCase()} es su época de siembra.`;
  }

  const cal = esAnimal ? "" : `
    <h3 class="list-title">Meses de siembra</h3>
    <div class="calendar-row">${MESES.map((m, i) =>
      `<div class="cal-month ${c.mesesSiembra.includes(i + 1) ? "on" : ""}">${m[0]}</div>`).join("")}</div>`;

  const venta = c.mesesPrecioAlto ? `
    <h3 class="list-title">Mejor época para vender</h3>
    <div class="calendar-row">${MESES.map((m, i) =>
      `<div class="cal-month sell ${c.mesesPrecioAlto.includes(i + 1) ? "on" : ""}">${m[0]}</div>`).join("")}</div>
    <p class="sub">${c.mesesPrecioAlto.includes(mes) ? "¡Este mes suele pagarse mejor: buen momento para vender!" : "En esos meses escasea y suele pagarse mejor."}</p>` : "";

  const pasos = c.pasos && c.pasos.length ? `
    <h3 class="list-title">🚶 Cómo empezar</h3>
    <ol class="step-list">${c.pasos.map(p => `<li>${p}</li>`).join("")}</ol>` : "";

  const rendTxt = c.modelo === "mensual" ? `${c.rendimiento} ${c.rendUnidad}/mes`
    : c.modelo === "anual" ? `${c.rendimiento} ${c.rendUnidad}/año`
    : `${c.rendimiento} ${c.rendUnidad}`;
  const unidadBase = UNIDAD_INFO[c.unidad].singular;

  document.getElementById("plant-detail").innerHTML = `
    <div class="detail-hero">
      <div class="d-emoji t-${c.cat}">${c.emoji}</div>
      <div class="detail-cat">${info.nombre}</div>
      <h2>${c.nombre}</h2>
      <p class="sub">${cuando}</p>
    </div>
    <div class="tip-box">💡 ${c.tip}</div>
    <div class="econ-strip">
      <div><small>Inversión por ${unidadBase}</small><strong>$${fmt(c.inversion)}</strong></div>
      <div><small>Produce por ${unidadBase}</small><strong>${rendTxt}</strong></div>
      <div><small>Precio local</small><strong>$${fmt(c.precio)}/${unidadPrecio(c.rendUnidad)}</strong></div>
    </div>
    ${cal}
    ${venta}
    <div class="detail-grid">
      <div class="detail-item"><small>${esAnimal ? "Manejo" : "Tipo de plantación"}</small><strong>${c.tipo}</strong></div>
      <div class="detail-item"><small>${esAnimal ? "Espacio" : "Distancia"}</small><strong>${c.distancia}</strong></div>
      <div class="detail-item"><small>${esAnimal ? "Alimentación" : "Riego"}</small><strong>${c.riego}</strong></div>
      <div class="detail-item"><small>${esAnimal ? "Tiempo a producción" : "Tiempo a cosecha"}</small><strong>${formatDias(c.diasProduccion)}</strong></div>
      ${c.luna ? `<div class="detail-item"><small>Luna ideal</small><strong>${c.luna === "creciente" ? "🌒 Creciente" : "🌘 Menguante"}</strong></div>` : ""}
      <div class="detail-item"><small>Altitud</small><strong>${c.altMin} – ${c.altMax} m</strong></div>
    </div>
    ${pasos}`;
}

document.getElementById("btn-calc").addEventListener("click", () => { setupCalc(); show("screen-calc"); });

// ---------- Calculadora ----------
const slider = document.getElementById("area-slider");

function setupCalc() {
  const c = getItem(state.plantaActual);
  const u = UNIDAD_INFO[c.unidad];
  document.getElementById("calc-title").textContent = `${c.emoji} ${c.nombre}`;
  document.getElementById("calc-question").textContent = u.pregunta;

  let max, presets, def;
  if (c.unidad === "m2") {
    max = { maceta: 20, huerto: 500, parcela: 20000 }[state.espacio];
    presets = { maceta: [2, 5, 10, 20], huerto: [25, 50, 100, 250, 500], parcela: [500, 1000, 5000, 10000, 20000] }[state.espacio];
    def = Math.min(ESPACIOS.find(e => e.id === state.espacio).areaDefault, max);
  } else if (c.unidad === "animal") {
    max = 100; presets = [1, 3, 5, 10, 25, 50]; def = 5;
  } else if (c.unidad === "arbol") {
    max = 100; presets = [1, 3, 5, 10, 25, 50]; def = 5;
  } else {
    max = 300; presets = [5, 10, 25, 50, 100]; def = 10;
  }
  slider.min = 1; slider.max = max; slider.value = def;

  const pc = document.getElementById("area-presets");
  pc.innerHTML = presets.map(p =>
    `<button data-area="${p}">${c.unidad === "m2" && p >= 10000 ? (p / 10000) + " ha" : p}</button>`).join("");
  pc.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => { slider.value = b.dataset.area; renderCalc(); });
  });

  renderCalc();
}

slider.addEventListener("input", renderCalc);

function renderCalc() {
  const c = getItem(state.plantaActual);
  const u = UNIDAD_INFO[c.unidad];
  const n = +slider.value;

  document.getElementById("area-unit").textContent = n === 1 ? u.singular : u.plural;
  document.getElementById("area-num").textContent =
    c.unidad === "m2" && n >= 10000 ? (n / 10000).toFixed(1).replace(".0", "") + " ha —" : n;
  document.querySelectorAll("#area-presets button").forEach(b =>
    b.classList.toggle("on", +b.dataset.area === n));

  const inversion = c.inversion * n;
  const gasto = c.gastoCiclo * n;
  const prod = c.rendimiento * n;
  const venta = prod * c.precio;
  const rU = c.rendUnidad;
  let rows, nota;

  if (c.modelo === "ciclo") {
    const ganancia = venta - inversion - gasto;
    rows = `
      <div class="calc-row"><span class="label">Inversión inicial</span><span>$${fmt(inversion)}</span></div>
      <div class="calc-row"><span class="label">Gastos del ciclo (${c.cat === "animal" ? "alimento" : "insumos"})</span><span>$${fmt(gasto)}</span></div>
      <div class="calc-row"><span class="label">${c.cat === "animal" ? "Producción" : "Cosecha"} en ${formatDias(c.diasProduccion)}</span><span>${fmt(prod)} ${rU}</span></div>
      <div class="calc-row"><span class="label">Venta estimada</span><span>$${fmt(venta)}</span></div>
      <div class="calc-row total"><span class="label">Ganancia del ciclo</span><span>$${fmt(ganancia)}</span></div>`;
    nota = `Ciclo de ${formatDias(c.diasProduccion)}.`;
  } else if (c.modelo === "anual") {
    const gananciaAnual = venta - gasto;
    const payback = gananciaAnual > 0 ? Math.ceil(inversion / gananciaAnual) : null;
    rows = `
      <div class="calc-row"><span class="label">Inversión inicial</span><span>$${fmt(inversion)}</span></div>
      <div class="calc-row"><span class="label">Primera ${c.cat === "animal" ? "producción" : "cosecha"}</span><span>en ${formatDias(c.diasProduccion)}</span></div>
      <div class="calc-row"><span class="label">Producción por año</span><span>${fmt(prod)} ${rU}</span></div>
      <div class="calc-row"><span class="label">Gastos por año</span><span>$${fmt(gasto)}</span></div>
      <div class="calc-row"><span class="label">Ingreso por año</span><span>$${fmt(venta)}</span></div>
      <div class="calc-row total"><span class="label">Ganancia por año</span><span>$${fmt(gananciaAnual)}</span></div>`;
    nota = payback ? `Recuperas la inversión en ~${payback} ${payback === 1 ? "año" : "años"} de producción.` : "";
  } else {
    const gananciaMes = venta - gasto;
    const payback = gananciaMes > 0 ? Math.ceil(inversion / gananciaMes) : null;
    rows = `
      <div class="calc-row"><span class="label">Inversión inicial</span><span>$${fmt(inversion)}</span></div>
      <div class="calc-row"><span class="label">Producción por mes</span><span>${fmt(prod)} ${rU}</span></div>
      <div class="calc-row"><span class="label">Gastos por mes (alimento)</span><span>$${fmt(gasto)}</span></div>
      <div class="calc-row"><span class="label">Ingreso por mes</span><span>$${fmt(venta)}</span></div>
      <div class="calc-row total"><span class="label">Ganancia por mes</span><span>$${fmt(gananciaMes)}</span></div>`;
    nota = payback ? `Recuperas la inversión en ~${payback} ${payback === 1 ? "mes" : "meses"}.` : "";
  }

  document.getElementById("calc-results").innerHTML = `
    <div class="calc-card">${rows}</div>
    <p class="calc-note">${nota} Precios referenciales: ${PRECIOS_META.fuente.toLowerCase()} de ${PRECIOS_META.pais} (${PRECIOS_META.actualizado}). No incluye tu mano de obra ni transporte.</p>`;
}

// ---------- PWA: offline e instalación ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

let installPrompt = null;
const INSTALL_DISMISSED = "mihuerto.installDismissed";

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  installPrompt = e;
  renderInstallBanner();
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  renderInstallBanner();
});

function renderInstallBanner() {
  const cont = document.getElementById("install-banner");
  if (!cont) return;
  if (!installPrompt || localStorage.getItem(INSTALL_DISMISSED)) { cont.innerHTML = ""; return; }
  cont.innerHTML = `
    <div class="install-banner">
      <span class="i-emoji">📲</span>
      <span class="i-text"><strong>Instala Mi Huerto</strong><small>Úsala como app, incluso sin internet.</small></span>
      <button class="i-btn" id="btn-install">Instalar</button>
      <button class="i-close" id="btn-install-close" aria-label="Cerrar">✕</button>
    </div>`;
  document.getElementById("btn-install").addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    renderInstallBanner();
  });
  document.getElementById("btn-install-close").addEventListener("click", () => {
    localStorage.setItem(INSTALL_DISMISSED, "1");
    renderInstallBanner();
  });
}

// ---------- Notificaciones nativas ----------
function checkAndSendNotifications() {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (!state.altitud || !state.espacio) return;

  const lastNotifDate = localStorage.getItem('lastNotificationDate');
  const today = new Date().toISOString().split('T')[0];
  if (lastNotifDate === today) return;

  const data = {
    siembras: state.siembras,
    altitud: state.altitud,
    espacio: state.espacio
  };

  const notifs = computeNotifications(CULTIVOS, data, state.forecast);
  notifs.forEach(notif => {
    new Notification(notif.title, {
      body: notif.body,
      tag: notif.key,
      requireInteraction: false
    });
  });

  localStorage.setItem('lastNotificationDate', today);
}

function requestNotificationPermission() {
  if (!('Notification' in window) || Notification.permission === 'granted') return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// Solicitar permiso al cargar
requestNotificationPermission();

// ---------- Swipe navigation ----------
let touchStartX = 0, touchStartY = 0, touchStartBlocked = false;
const minSwipeDistance = 50;
const maxVerticalDelta = 100;
// Elementos con su propio scroll horizontal: el swipe de página no debe robárselo.
const SWIPE_EXCLUDE = '.cat-chips, .month-chips, .sell-months, input[type="range"]';

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartBlocked = !!e.target.closest(SWIPE_EXCLUDE);
}, false);

document.addEventListener('touchend', (e) => {
  if (touchStartBlocked) return;
  // Solo cambia de pestaña si la pantalla activa es una de las 5 con tabbar visible.
  if (tabbar.hidden) return;

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const dx = touchEndX - touchStartX;
  const dy = Math.abs(touchEndY - touchStartY);

  if (dy > maxVerticalDelta) return;

  const tabs = Array.from(tabbar.querySelectorAll('.tab'));
  const currentIdx = tabs.findIndex(t => t.classList.contains('on'));

  if (dx > minSwipeDistance && currentIdx > 0) {
    tabs[currentIdx - 1].click();
  } else if (dx < -minSwipeDistance && currentIdx < tabs.length - 1) {
    tabs[currentIdx + 1].click();
  }
}, false);

// ---------- Ajustes / inicio ----------
document.getElementById("btn-settings").addEventListener("click", () => show("screen-location"));
document.getElementById("btn-start").addEventListener("click", () => show("screen-location"));

renderManualZones();
renderSpaceOptions();

if (loadState()) {
  renderHome();
  show("screen-home");
}
