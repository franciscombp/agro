// Catálogo de cultivos para agricultura de subsistencia y huertos urbanos (Ecuador).
// Altitudes en msnm. Meses de siembra: 1-12. Costos referenciales en USD por m².
const CULTIVOS = [
  {
    id: "lechuga", nombre: "Lechuga", emoji: "🥬",
    altMin: 0, altMax: 3200,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    diasCosecha: 60,
    tipo: "Siembra directa o trasplante",
    distancia: "25 × 25 cm",
    riego: "Frecuente, suelo húmedo",
    costoM2: 0.80, rendimientoKgM2: 2.5, precioKg: 1.20,
    luna: "menguante",
    tip: "Ideal para empezar: crece rápido y ocupa poco espacio."
  },
  {
    id: "tomate", nombre: "Tomate riñón", emoji: "🍅",
    altMin: 0, altMax: 2600,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [9, 10, 11, 12, 1, 2],
    diasCosecha: 100,
    tipo: "Semillero y trasplante",
    distancia: "50 × 100 cm, con tutor",
    riego: "Regular, sin mojar hojas",
    costoM2: 1.50, rendimientoKgM2: 6, precioKg: 0.90,
    luna: "creciente",
    tip: "Necesita tutor (caña o palo) y sol directo."
  },
  {
    id: "papa", nombre: "Papa", emoji: "🥔",
    altMin: 2400, altMax: 3800,
    espacios: ["huerto", "parcela"],
    mesesSiembra: [10, 11, 12, 1, 4, 5, 6],
    diasCosecha: 150,
    tipo: "Siembra directa (tubérculo)",
    distancia: "30 cm entre plantas, surcos a 1 m",
    riego: "Moderado, evitar encharcar",
    costoM2: 0.90, rendimientoKgM2: 3, precioKg: 0.60,
    luna: "menguante",
    tip: "Aporcar (arrimar tierra al tallo) cada 3 semanas."
  },
  {
    id: "maiz", nombre: "Maíz suave", emoji: "🌽",
    altMin: 2200, altMax: 3000,
    espacios: ["huerto", "parcela"],
    mesesSiembra: [9, 10, 11],
    diasCosecha: 210,
    tipo: "Siembra directa",
    distancia: "80 × 30 cm, 2-3 semillas por golpe",
    riego: "Aprovecha lluvias de octubre",
    costoM2: 0.50, rendimientoKgM2: 1.2, precioKg: 1.00,
    luna: "creciente",
    tip: "Siembra tradicional con fréjol: el maíz le sirve de tutor."
  },
  {
    id: "frejol", nombre: "Fréjol", emoji: "🫘",
    altMin: 0, altMax: 2800,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [9, 10, 11, 2, 3],
    diasCosecha: 110,
    tipo: "Siembra directa",
    distancia: "40 × 20 cm",
    riego: "Ligero y constante",
    costoM2: 0.60, rendimientoKgM2: 1.5, precioKg: 1.80,
    luna: "creciente",
    tip: "Fija nitrógeno: mejora el suelo para el siguiente cultivo."
  },
  {
    id: "zanahoria", nombre: "Zanahoria", emoji: "🥕",
    altMin: 1800, altMax: 3400,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    diasCosecha: 110,
    tipo: "Siembra directa (no trasplantar)",
    distancia: "Hileras a 20 cm, ralear a 5 cm",
    riego: "Constante al inicio",
    costoM2: 0.70, rendimientoKgM2: 3, precioKg: 0.70,
    luna: "menguante",
    tip: "Suelo suelto y profundo, sin piedras, para raíces rectas."
  },
  {
    id: "cebolla", nombre: "Cebolla larga", emoji: "🧅",
    altMin: 1500, altMax: 3200,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    diasCosecha: 90,
    tipo: "Trasplante de matas",
    distancia: "15 × 15 cm",
    riego: "Moderado",
    costoM2: 0.80, rendimientoKgM2: 2, precioKg: 1.00,
    luna: "menguante",
    tip: "Se corta y vuelve a brotar: cosecha continua por meses."
  },
  {
    id: "brocoli", nombre: "Brócoli", emoji: "🥦",
    altMin: 2200, altMax: 3200,
    espacios: ["huerto", "parcela"],
    mesesSiembra: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    diasCosecha: 90,
    tipo: "Semillero y trasplante",
    distancia: "50 × 50 cm",
    riego: "Regular",
    costoM2: 1.00, rendimientoKgM2: 2.5, precioKg: 1.10,
    luna: "creciente",
    tip: "Tras cortar la cabeza principal salen brotes laterales comestibles."
  },
  {
    id: "quinua", nombre: "Quinua", emoji: "🌾",
    altMin: 2500, altMax: 3800,
    espacios: ["parcela"],
    mesesSiembra: [10, 11, 12],
    diasCosecha: 180,
    tipo: "Siembra directa",
    distancia: "Surcos a 60 cm",
    riego: "Resiste sequía",
    costoM2: 0.40, rendimientoKgM2: 0.3, precioKg: 3.50,
    luna: "creciente",
    tip: "Muy resistente a heladas y sequía. Grano de alto valor."
  },
  {
    id: "acelga", nombre: "Acelga", emoji: "🥬",
    altMin: 0, altMax: 3200,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    diasCosecha: 70,
    tipo: "Siembra directa o trasplante",
    distancia: "30 × 30 cm",
    riego: "Frecuente",
    costoM2: 0.70, rendimientoKgM2: 3, precioKg: 1.00,
    luna: "menguante",
    tip: "Cosecha hoja por hoja y la planta sigue produciendo meses."
  },
  {
    id: "cilantro", nombre: "Cilantro", emoji: "🌿",
    altMin: 0, altMax: 3000,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    diasCosecha: 45,
    tipo: "Siembra directa",
    distancia: "Al voleo o hileras a 15 cm",
    riego: "Ligero, diario en maceta",
    costoM2: 0.50, rendimientoKgM2: 1.5, precioKg: 2.00,
    luna: "menguante",
    tip: "El cultivo más rápido de la lista: listo en un mes y medio."
  },
  {
    id: "yuca", nombre: "Yuca", emoji: "🍠",
    altMin: 0, altMax: 1500,
    espacios: ["parcela"],
    mesesSiembra: [3, 4, 5, 10, 11, 12],
    diasCosecha: 300,
    tipo: "Estacas de 20 cm",
    distancia: "1 × 1 m",
    riego: "Resiste sequía",
    costoM2: 0.30, rendimientoKgM2: 2.5, precioKg: 0.50,
    luna: "menguante",
    tip: "Casi no necesita cuidados una vez establecida."
  },
  {
    id: "platano", nombre: "Plátano", emoji: "🍌",
    altMin: 0, altMax: 1200,
    espacios: ["parcela"],
    mesesSiembra: [1, 2, 3, 4, 10, 11, 12],
    diasCosecha: 365,
    tipo: "Hijuelos (colinos)",
    distancia: "3 × 3 m",
    riego: "Abundante en verano",
    costoM2: 0.25, rendimientoKgM2: 3, precioKg: 0.40,
    luna: "creciente",
    tip: "Cada mata da un racimo y deja hijos para la siguiente cosecha."
  },
  {
    id: "pimiento", nombre: "Pimiento", emoji: "🫑",
    altMin: 0, altMax: 2200,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [9, 10, 11, 12, 1],
    diasCosecha: 120,
    tipo: "Semillero y trasplante",
    distancia: "40 × 60 cm",
    riego: "Regular",
    costoM2: 1.20, rendimientoKgM2: 4, precioKg: 1.30,
    luna: "creciente",
    tip: "En maceta grande (20 L) produce muy bien en balcones."
  },
  {
    id: "haba", nombre: "Haba", emoji: "🫛",
    altMin: 2600, altMax: 3600,
    espacios: ["huerto", "parcela"],
    mesesSiembra: [9, 10, 11, 12, 1],
    diasCosecha: 150,
    tipo: "Siembra directa",
    distancia: "60 × 30 cm",
    riego: "Aprovecha lluvias",
    costoM2: 0.50, rendimientoKgM2: 1.8, precioKg: 1.20,
    luna: "creciente",
    tip: "Aguanta bien el frío de la sierra alta."
  },
  {
    id: "fresa", nombre: "Fresa", emoji: "🍓",
    altMin: 1800, altMax: 3000,
    espacios: ["maceta", "huerto", "parcela"],
    mesesSiembra: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    diasCosecha: 120,
    tipo: "Plántulas o estolones",
    distancia: "30 × 30 cm",
    riego: "Frecuente, por goteo ideal",
    costoM2: 2.50, rendimientoKgM2: 3, precioKg: 2.50,
    luna: "creciente",
    tip: "Buen precio de venta: rentable incluso en espacios pequeños."
  }
];

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const ESPACIOS = [
  { id: "maceta", nombre: "Macetas y balcón", emoji: "🪴", desc: "Huerto urbano en casa, hasta ~20 m²", areaDefault: 5 },
  { id: "huerto", nombre: "Huerto familiar", emoji: "🏡", desc: "Patio o terreno pequeño, hasta ~500 m²", areaDefault: 100 },
  { id: "parcela", nombre: "Parcela", emoji: "🌄", desc: "Terreno de cultivo, hasta 2 hectáreas", areaDefault: 5000 }
];

function zonaPorAltitud(alt) {
  if (alt < 1000) return { nombre: "Zona cálida (costa / amazonía baja)", emoji: "🌴" };
  if (alt < 2000) return { nombre: "Valle subtropical", emoji: "🌤️" };
  if (alt < 3200) return { nombre: "Sierra andina", emoji: "⛰️" };
  return { nombre: "Sierra alta / páramo", emoji: "🏔️" };
}
