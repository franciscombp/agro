// Mi Huerto — app estática. Estado en localStorage, datos de Open-Meteo (sin API key).
"use strict";

const STORE_KEY = "mihuerto.v1";

const state = {
  lat: null, lon: null,
  altitud: null,
  espacio: null,       // id de ESPACIOS
  plantaActual: null,  // id de cultivo en detalle
  clima: null
};

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    lat: state.lat, lon: state.lon, altitud: state.altitud, espacio: state.espacio
  }));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (s.altitud == null || !s.espacio) return false;
    Object.assign(state, s);
    return true;
  } catch { return false; }
}

// ---------- Navegación (una pantalla a la vez) ----------
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

document.querySelectorAll(".btn-back").forEach(btn => {
  btn.addEventListener("click", () => show(btn.dataset.back));
});

// ---------- Pantalla 2: Ubicación ----------
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
      state.altitud = ZONAS_MANUALES[+btn.dataset.zone].alt;
      state.lat = null; state.lon = null;
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
    status.textContent = "Consultando altitud de tu zona…";
    try {
      const alt = await fetchAltitud(state.lat, state.lon);
      state.altitud = Math.round(alt);
      show("screen-space");
    } catch {
      status.textContent = "No pudimos obtener la altitud. Elige tu zona abajo.";
    }
  }, () => {
    status.textContent = "No diste permiso de ubicación. Elige tu zona abajo.";
  }, { timeout: 10000 });
});

async function fetchAltitud(lat, lon) {
  // Open-Meteo devuelve la elevación del punto junto con el pronóstico.
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`);
  const j = await r.json();
  if (typeof j.elevation !== "number") throw new Error("sin elevación");
  return j.elevation;
}

// ---------- Pantalla 3: Espacio ----------
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

// ---------- Pantalla 4: Home ----------
function cultivosDeZona() {
  return CULTIVOS.filter(c =>
    state.altitud >= c.altMin && state.altitud <= c.altMax &&
    c.espacios.includes(state.espacio)
  );
}

function renderHome() {
  const zona = zonaPorAltitud(state.altitud);
  document.getElementById("home-zone").textContent =
    `${zona.emoji} ${zona.nombre} · ${state.altitud} msnm`;

  const mes = new Date().getMonth() + 1;
  const deZona = cultivosDeZona();
  const ahora = deZona.filter(c => c.mesesSiembra.includes(mes));
  const otros = deZona.filter(c => !c.mesesSiembra.includes(mes));

  document.getElementById("plant-list").innerHTML =
    ahora.length ? ahora.map(c => plantCardHTML(c)).join("")
    : `<p class="sub">Este mes no hay siembras ideales en tu zona. Mira los próximos cultivos abajo.</p>`;
  document.getElementById("plant-list-other").innerHTML =
    otros.length ? otros.map(c => plantCardHTML(c, proximaSiembra(c))).join("")
    : `<p class="sub">Todos los cultivos de tu zona se pueden sembrar ahora. 🎉</p>`;

  document.querySelectorAll(".plant-card").forEach(card => {
    card.addEventListener("click", () => {
      state.plantaActual = card.dataset.plant;
      renderPlantDetail();
      show("screen-plant");
    });
  });

  renderWeather();
  renderMoonStrip();
}

function plantCardHTML(c, badge) {
  const b = badge ? `<span class="plant-badge">${badge}</span>`
                  : `<span class="plant-badge">Sembrar ya</span>`;
  return `
    <button class="plant-card" data-plant="${c.id}">
      <span class="plant-thumb">${c.emoji}</span>
      <span class="plant-info">
        <strong>${c.nombre}</strong>
        <small>Cosecha en ${formatDias(c.diasCosecha)} · ${c.tipo}</small>
      </span>
      ${b}
    </button>`;
}

function proximaSiembra(c) {
  const mes = new Date().getMonth() + 1;
  for (let i = 1; i <= 12; i++) {
    const m = ((mes - 1 + i) % 12) + 1;
    if (c.mesesSiembra.includes(m)) return "Desde " + MESES[m - 1].slice(0, 3);
  }
  return "";
}

function formatDias(d) {
  if (d >= 330) return "1 año";
  if (d >= 55) return Math.round(d / 30) + " meses";
  return d + " días";
}

// ---------- Clima ----------
const WMO = {
  0: ["☀️","Despejado"], 1: ["🌤️","Mayormente despejado"], 2: ["⛅","Parcialmente nublado"],
  3: ["☁️","Nublado"], 45: ["🌫️","Neblina"], 48: ["🌫️","Neblina"],
  51: ["🌦️","Llovizna"], 53: ["🌦️","Llovizna"], 55: ["🌧️","Llovizna fuerte"],
  61: ["🌧️","Lluvia ligera"], 63: ["🌧️","Lluvia"], 65: ["🌧️","Lluvia fuerte"],
  80: ["🌧️","Chubascos"], 81: ["🌧️","Chubascos"], 82: ["⛈️","Chubascos fuertes"],
  95: ["⛈️","Tormenta"], 96: ["⛈️","Tormenta"], 99: ["⛈️","Tormenta"]
};

async function renderWeather() {
  const card = document.getElementById("weather-card");
  if (state.lat == null) {
    card.innerHTML = `<div class="weather-emoji">📍</div>
      <div class="weather-info"><strong>Sin ubicación exacta</strong>
      <small>Activa tu ubicación para ver el clima y lluvia de tu zona.</small></div>`;
    return;
  }
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${state.lat}&longitude=${state.lon}&current=temperature_2m,weather_code&daily=precipitation_sum&forecast_days=7&timezone=auto`);
    const j = await r.json();
    const [emoji, desc] = WMO[j.current.weather_code] || ["🌡️", "Clima"];
    const lluvia7 = j.daily.precipitation_sum.reduce((a, b) => a + (b || 0), 0);
    const lluviaTxt = lluvia7 >= 15
      ? `Buena lluvia esta semana (${Math.round(lluvia7)} mm): aprovecha para sembrar.`
      : `Poca lluvia esta semana (${Math.round(lluvia7)} mm): riega tus plantas.`;
    card.innerHTML = `<div class="weather-emoji">${emoji}</div>
      <div class="weather-info"><strong>${Math.round(j.current.temperature_2m)}°C</strong>
      <small>${desc} · ${lluviaTxt}</small></div>`;
  } catch {
    card.innerHTML = `<div class="weather-loading">No se pudo cargar el clima (revisa tu conexión).</div>`;
  }
}

// ---------- Luna ----------
const SINODICO = 29.53058867;
function faseLunar(fecha = new Date()) {
  // Luna nueva de referencia: 6 enero 2000, 18:14 UTC
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
  nueva: "Días de descanso: prepara la tierra, abona y haz compost. Evita sembrar.",
  creciente: "Buen momento para sembrar plantas que dan fruto sobre la tierra: tomate, maíz, fréjol, pimiento.",
  llena: "Trasplanta y cosecha frutos. La savia está arriba: evita podar.",
  menguante: "Ideal para raíces y hojas: papa, zanahoria, cebolla, lechuga. También para podar y desyerbar."
};

function renderMoonStrip() {
  const f = faseLunar();
  const strip = document.getElementById("moon-strip");
  strip.innerHTML = `
    <span class="m-emoji">${f.emoji}</span>
    <span class="m-text"><strong>${f.nombre}</strong>
    <small>${CONSEJO_LUNA[f.ciclo]}</small></span>
    <span class="chev">›</span>`;
  strip.onclick = () => { renderMoonScreen(); show("screen-moon"); };
}

function renderMoonScreen() {
  const f = faseLunar();
  document.getElementById("moon-detail").innerHTML = `
    <div class="moon-big">
      <div class="m-emoji">${f.emoji}</div>
      <h3>${f.nombre}</h3>
      <p>Día ${Math.floor(f.edad) + 1} del ciclo lunar</p>
    </div>
    <div class="moon-advice"><strong>Hoy:</strong> ${CONSEJO_LUNA[f.ciclo]}</div>
    <h3 class="list-title">Próximos 30 días</h3>`;

  const items = [];
  let prev = f.nombre;
  for (let i = 1; i <= 30; i++) {
    const d = new Date(Date.now() + i * 86400000);
    const fd = faseLunar(d);
    if (fd.nombre !== prev && ["Luna nueva","Cuarto creciente","Luna llena","Cuarto menguante"].includes(fd.nombre)) {
      items.push(`<div class="moon-list-item">
        <span class="m-emoji">${fd.emoji}</span>
        <span><strong>${fd.nombre}</strong>
        <small>${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()} · ${CONSEJO_LUNA[fd.ciclo]}</small></span>
      </div>`);
      prev = fd.nombre;
    }
  }
  document.getElementById("moon-upcoming").innerHTML = items.join("");
}

// ---------- Pantalla 5: Detalle ----------
function getPlanta() { return CULTIVOS.find(c => c.id === state.plantaActual); }

function renderPlantDetail() {
  const c = getPlanta();
  const mes = new Date().getMonth() + 1;
  const fechaCosecha = new Date(Date.now() + c.diasCosecha * 86400000);
  const cal = MESES.map((m, i) =>
    `<div class="cal-month ${c.mesesSiembra.includes(i + 1) ? "on" : ""}">${m.slice(0, 1)}</div>`).join("");

  document.getElementById("plant-detail").innerHTML = `
    <div class="detail-hero">
      <div class="d-emoji">${c.emoji}</div>
      <h2>${c.nombre}</h2>
      <p class="sub">${c.mesesSiembra.includes(mes)
        ? `Si siembras hoy, cosechas hacia ${MESES[fechaCosecha.getMonth()].toLowerCase()} (${formatDias(c.diasCosecha)}).`
        : `Mejor espera: ${proximaSiembra(c).toLowerCase()} es su época de siembra.`}</p>
    </div>
    <div class="tip-box">💡 ${c.tip}</div>
    <h3 class="list-title">Meses de siembra</h3>
    <div class="calendar-row">${cal}</div>
    <div class="detail-grid">
      <div class="detail-item"><small>Tipo de plantación</small><strong>${c.tipo}</strong></div>
      <div class="detail-item"><small>Distancia</small><strong>${c.distancia}</strong></div>
      <div class="detail-item"><small>Riego</small><strong>${c.riego}</strong></div>
      <div class="detail-item"><small>Tiempo a cosecha</small><strong>${formatDias(c.diasCosecha)}</strong></div>
      <div class="detail-item"><small>Luna ideal</small><strong>${c.luna === "creciente" ? "🌒 Creciente" : "🌘 Menguante"}</strong></div>
      <div class="detail-item"><small>Altitud</small><strong>${c.altMin} – ${c.altMax} m</strong></div>
    </div>`;
}

document.getElementById("btn-calc").addEventListener("click", () => {
  setupCalc();
  show("screen-calc");
});

// ---------- Pantalla 6: Calculadora ----------
const slider = document.getElementById("area-slider");

function setupCalc() {
  const c = getPlanta();
  const esp = ESPACIOS.find(e => e.id === state.espacio);
  document.getElementById("calc-title").textContent = `${c.emoji} ${c.nombre}`;

  const maxArea = { maceta: 20, huerto: 500, parcela: 20000 }[state.espacio];
  slider.max = maxArea;
  slider.value = Math.min(esp.areaDefault, maxArea);

  const presets = { maceta: [2, 5, 10, 20], huerto: [25, 50, 100, 250, 500], parcela: [500, 1000, 5000, 10000, 20000] }[state.espacio];
  const pc = document.getElementById("area-presets");
  pc.innerHTML = presets.map(p =>
    `<button data-area="${p}">${p >= 10000 ? (p / 10000) + " ha" : p + " m²"}</button>`).join("");
  pc.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => { slider.value = b.dataset.area; renderCalc(); });
  });

  renderCalc();
}

slider.addEventListener("input", renderCalc);

function renderCalc() {
  const c = getPlanta();
  const area = +slider.value;
  document.getElementById("area-num").textContent =
    area >= 10000 ? (area / 10000).toFixed(1).replace(".0", "") + " ha —" : area;
  document.querySelectorAll("#area-presets button").forEach(b =>
    b.classList.toggle("on", +b.dataset.area === area));

  const inversion = c.costoM2 * area;
  const cosechaKg = c.rendimientoKgM2 * area;
  const valorVenta = cosechaKg * c.precioKg;
  const ganancia = valorVenta - inversion;

  document.getElementById("calc-results").innerHTML = `
    <div class="calc-card">
      <div class="calc-row"><span class="label">Inversión (semilla, abono, insumos)</span><span>$${fmt(inversion)}</span></div>
      <div class="calc-row"><span class="label">Cosecha estimada</span><span>${fmt(cosechaKg)} kg</span></div>
      <div class="calc-row"><span class="label">Valor si vendes todo</span><span>$${fmt(valorVenta)}</span></div>
      <div class="calc-row total"><span class="label">Ganancia estimada</span><span>$${fmt(ganancia)}</span></div>
    </div>
    <p class="calc-note">Valores referenciales para cosecha en ${formatDias(c.diasCosecha)}. No incluye tu mano de obra ni transporte. Los precios de venta varían según el mercado local.</p>`;
}

function fmt(n) {
  return n >= 100 ? Math.round(n).toLocaleString("es-EC") : (Math.round(n * 100) / 100).toLocaleString("es-EC");
}

// ---------- Ajustes: volver a empezar ----------
document.getElementById("btn-settings").addEventListener("click", () => {
  show("screen-location");
});

// ---------- Inicio ----------
document.getElementById("btn-start").addEventListener("click", () => show("screen-location"));

renderManualZones();
renderSpaceOptions();

if (loadState()) {
  renderHome();
  show("screen-home");
}
