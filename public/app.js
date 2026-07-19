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
  plantaActual: null,
  backTo: "screen-home",
  forecast: null        // cache del pronóstico diario
};

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    lat: state.lat, lon: state.lon, altitud: state.altitud,
    lugar: state.lugar, espacio: state.espacio, siembras: state.siembras
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
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&forecast_days=14&timezone=auto`);
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
    const lluviaTxt = lluvia7 >= 15
      ? `Lluvia esta semana: ${Math.round(lluvia7)} mm. Aprovecha para sembrar.`
      : `Poca lluvia esta semana (${Math.round(lluvia7)} mm): riega tus plantas.`;
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
    <div class="detail-grid">
      <div class="detail-item"><small>${esAnimal ? "Manejo" : "Tipo de plantación"}</small><strong>${c.tipo}</strong></div>
      <div class="detail-item"><small>${esAnimal ? "Espacio" : "Distancia"}</small><strong>${c.distancia}</strong></div>
      <div class="detail-item"><small>${esAnimal ? "Alimentación" : "Riego"}</small><strong>${c.riego}</strong></div>
      <div class="detail-item"><small>${esAnimal ? "Tiempo a producción" : "Tiempo a cosecha"}</small><strong>${formatDias(c.diasProduccion)}</strong></div>
      ${c.luna ? `<div class="detail-item"><small>Luna ideal</small><strong>${c.luna === "creciente" ? "🌒 Creciente" : "🌘 Menguante"}</strong></div>` : ""}
      <div class="detail-item"><small>Altitud</small><strong>${c.altMin} – ${c.altMax} m</strong></div>
    </div>`;
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
let touchStartX = 0, touchStartY = 0;
const minSwipeDistance = 50;
const maxVerticalDelta = 100;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, false);

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const dx = touchEndX - touchStartX;
  const dy = Math.abs(touchEndY - touchStartY);

  if (dy > maxVerticalDelta || !tabbar.hasChildNodes()) return;

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
