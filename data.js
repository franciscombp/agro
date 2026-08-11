// Mi Huerto — catálogo para agricultura de subsistencia y huertos urbanos (Ecuador).
// Precios referenciales de mercados mayoristas y ferias locales de Ecuador.
// unidad: base de cálculo → "m2" | "planta" | "arbol" | "animal"
// modelo: "ciclo" (una cosecha) | "anual" (produce cada año) | "mensual" (produce cada mes)
// inversion y gastoCiclo en USD por unidad. rendimiento por unidad y ciclo/año/mes según modelo.

const PRECIOS_META = {
  pais: "Ecuador",
  fuente: "Mercados mayoristas y ferias locales",
  actualizado: "julio 2026"
};

// Precios internacionales de referencia (Banco Mundial, serie mensual "Pink Sheet").
// ind: código de indicador GEM Commodities. fallback: último valor conocido si no hay conexión.
const MERCADO_INTL = [
  { id: "maiz-intl", nombre: "Maíz", emoji: "🌽", ind: "PMAIZMTUSD", unidadBase: "t", mostrar: "qq", fallback: 195, fallbackFecha: "jun 2026", rel: "maiz" },
  { id: "arroz-intl", nombre: "Arroz", emoji: "🍚", ind: "PRICENPQUSD", unidadBase: "t", mostrar: "qq", fallback: 400, fallbackFecha: "jun 2026", rel: null },
  { id: "cafe-intl", nombre: "Café arábica", emoji: "☕", ind: "PCOFFOTMUSD", unidadBase: "kg", mostrar: "kg", fallback: 4.30, fallbackFecha: "jun 2026", rel: "cafe" },
  { id: "cacao-intl", nombre: "Cacao", emoji: "🍫", ind: "PCOCOUSD", unidadBase: "kg", mostrar: "kg", fallback: 6.80, fallbackFecha: "jun 2026", rel: null },
  { id: "banano-intl", nombre: "Banano", emoji: "🍌", ind: "PBANSOPUSD", unidadBase: "kg", mostrar: "kg", fallback: 0.55, fallbackFecha: "jun 2026", rel: "platano" },
  { id: "azucar-intl", nombre: "Azúcar", emoji: "🍬", ind: "PSUGAISAUSD", unidadBase: "kg", mostrar: "kg", fallback: 0.42, fallbackFecha: "jun 2026", rel: null },
  { id: "urea-intl", nombre: "Urea (abono)", emoji: "🧪", ind: "PUREAUSD", unidadBase: "t", mostrar: "saco", fallback: 380, fallbackFecha: "jun 2026", rel: null }
];

// Consejos para vender mejor (rotan a diario).
const CONSEJOS_VENTA = [
  "Véndele directo al consumidor cuando puedas: en la feria ganas 30-50% más que entregando al intermediario.",
  "Únete con tus vecinos para vender en volumen: juntos consiguen mejor precio y comparten el flete.",
  "No vendas toda la cosecha el mismo día: si el precio está bajo y el producto aguanta, espera unas semanas.",
  "Producto limpio, clasificado y bien presentado se paga mejor. Separa lo grande de lo pequeño.",
  "Los granos secos (maíz, fréjol, haba) se guardan meses: véndelos cuando escasean y el precio sube.",
  "Pregunta el precio en 2-3 puestos antes de vender. El primer precio que te ofrecen casi nunca es el mejor.",
  "Dale valor agregado: queso en vez de leche, café secado en vez de cereza, mermelada en vez de fruta madura.",
  "Anota en esta app los precios cada semana: en unos meses sabrás en qué época conviene vender cada cosa.",
  "Siembra a contraestación cuando puedas: cosechar cuando pocos tienen es la mejor forma de ganar más.",
  "Llega temprano a la feria: los primeros puestos y las primeras horas concentran a los compradores."
];

// Sistemas de cultivo. rend/gasto multiplican el rendimiento y los gastos del suelo;
// infra es el costo de la instalación en USD por m², que dura vidaInfra años.
// Cifras referenciales de instalaciones artesanales en Ecuador.
const SISTEMAS = {
  suelo: { id: "suelo", nombre: "En el suelo", emoji: "🌱",
    desc: "Surcos (guachos) o camas a campo abierto",
    rend: 1, gasto: 1, infra: 0, vidaInfra: 0 },
  maceta: { id: "maceta", nombre: "En macetas", emoji: "🪴",
    desc: "Recipientes de 20 litros o más, en patio o balcón",
    rend: 0.7, gasto: 1.1, infra: 4, vidaInfra: 5 },
  invernadero: { id: "invernadero", nombre: "Invernadero", emoji: "🏠",
    desc: "Techo plástico: más cosecha y protege de helada y lluvia fuerte",
    rend: 2.2, gasto: 1.3, infra: 12, vidaInfra: 7 },
  hidroponia: { id: "hidroponia", nombre: "Hidroponía", emoji: "💧",
    desc: "Sin tierra: raíces en agua con nutrientes",
    rend: 2.5, gasto: 1.9, infra: 30, vidaInfra: 6 }
};

const METODO_SIEMBRA = {
  directa:   "Semilla directo al sitio definitivo",
  semillero: "Semillero y luego trasplante",
  tuberculo: "Tubérculo-semilla",
  mata:      "Trasplante de matas",
  esqueje:   "Esquejes de planta madre",
  estaca:    "Estacas de tallo",
  hijuelo:   "Hijuelos (colinos)",
  plantula:  "Plántulas de vivero",
  planta:    "Plantas o acodos",
  vivero:    "Planta injerta de vivero"
};

const CATEGORIAS = [
  { id: "hortaliza", nombre: "Hortalizas", emoji: "🥬" },
  { id: "grano", nombre: "Granos", emoji: "🌾" },
  { id: "fruta", nombre: "Frutales", emoji: "🍓" },
  { id: "hierba", nombre: "Hierbas", emoji: "🌿" },
  { id: "animal", nombre: "Animales", emoji: "🐄" }
];

const CULTIVOS = [
  // ------------------------- HORTALIZAS (por m²) -------------------------
  { id: "lechuga", nombre: "Lechuga", emoji: "🥬", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 60, tipo: "Siembra directa o trasplante", distancia: "25 × 25 cm", riego: "Frecuente, suelo húmedo",
    marco: [25,25], densidad: 16.0, metodo: "semillero", sistemas: ["suelo", "maceta", "invernadero", "hidroponia"],
    inversion: 0.80, gastoCiclo: 0.20, rendimiento: 10, rendUnidad: "unidades", precio: 0.35, luna: "menguante",
    tip: "Ideal para empezar: crece rápido y ocupa poco espacio. Siembra cada 2 semanas para cosechar todo el año.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 25 cm, dejando 25 cm entre plantas: caben unas 16 plantas por m².",
      "Riego: Frecuente, suelo húmedo. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 2 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "tomate", nombre: "Tomate riñón", emoji: "🍅", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2600, espacios: ["maceta","huerto","parcela"], mesesSiembra: [9,10,11,12,1,2],
    diasProduccion: 100, tipo: "Semillero y trasplante", distancia: "50 × 100 cm, con tutor", riego: "Regular, sin mojar hojas",
    marco: [50,100], densidad: 2.0, metodo: "semillero", sistemas: ["suelo", "maceta", "invernadero", "hidroponia"],
    inversion: 1.50, gastoCiclo: 0.50, rendimiento: 6, rendUnidad: "kg", precio: 1.00, luna: "creciente", mesesPrecioAlto: [6,7,8,9,10],
    tip: "Necesita tutor (caña o palo) y sol directo. En maceta usa recipientes de al menos 20 litros.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 1 m, dejando 50 cm entre plantas: caben unas 2 plantas por m².",
      "Riego: Regular, sin mojar hojas. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "papa", nombre: "Papa", emoji: "🥔", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 2400, altMax: 3800, espacios: ["huerto","parcela"], mesesSiembra: [10,11,12,1,4,5,6],
    diasProduccion: 150, tipo: "Siembra directa (tubérculo)", distancia: "30 cm entre plantas, surcos a 1 m", riego: "Moderado, evitar encharcar",
    marco: [30,100], densidad: 3.333, metodo: "tuberculo", sistemas: ["suelo"],
    inversion: 0.18, gastoCiclo: 0.25, rendimiento: 2.5, rendUnidad: "kg", precio: 0.50, luna: "menguante", mesesPrecioAlto: [12,1,2,7,8],
    tip: "Aporca (arrima tierra al tallo) cada 3 semanas. Guarda las papas más sanas como semilla.",
    pasos: [
      "Consigue semilla certificada o tubérculos sanos del tamaño de un huevo, con brotes cortos, guardados de tu mejor cosecha.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 1 m, dejando 30 cm entre plantas: caben unas 3.33 plantas por m².",
      "Riego: Moderado, evitar encharcar. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 5 meses. Aparta los tubérculos más sanos y parejos como semilla para la próxima siembra."
    ] },
  { id: "zanahoria", nombre: "Zanahoria", emoji: "🥕", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1800, altMax: 3400, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 110, tipo: "Siembra directa (no trasplantar)", distancia: "Hileras a 20 cm, ralear a 5 cm", riego: "Constante al inicio",
    marco: [5,20], densidad: 100.0, metodo: "directa", sistemas: ["suelo", "maceta"],
    inversion: 0.70, gastoCiclo: 0.20, rendimiento: 3, rendUnidad: "kg", precio: 0.60, luna: "menguante",
    tip: "Suelo suelto y profundo, sin piedras, para raíces rectas.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 20 cm, dejando 5 cm entre plantas: caben unas 100 plantas por m².",
      "Riego: Constante al inicio. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "cebolla-larga", nombre: "Cebolla larga", emoji: "🧅", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1500, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Trasplante de matas", distancia: "15 × 15 cm", riego: "Moderado",
    marco: [15,15], densidad: 44.444, metodo: "mata", sistemas: ["suelo", "maceta", "hidroponia"],
    inversion: 0.80, gastoCiclo: 0.20, rendimiento: 2.5, rendUnidad: "kg", precio: 1.00, luna: "menguante",
    tip: "Se corta y vuelve a brotar: cosecha continua por meses.",
    pasos: [
      "Consigue matas ya enraizadas, de un vivero o separadas de tu propia planta, y trasplántalas directo a su sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 15 cm, dejando 15 cm entre plantas: caben unas 44.44 plantas por m².",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Separa matas de las plantas más vigorosas para volver a sembrar."
    ] },
  { id: "brocoli", nombre: "Brócoli", emoji: "🥦", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 2200, altMax: 3200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Semillero y trasplante", distancia: "50 × 50 cm", riego: "Regular",
    marco: [50,50], densidad: 4.0, metodo: "semillero", sistemas: ["suelo", "invernadero"],
    inversion: 1.00, gastoCiclo: 0.30, rendimiento: 3, rendUnidad: "unidades", precio: 0.70, luna: "creciente",
    tip: "Tras cortar la cabeza principal salen brotes laterales comestibles.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 50 cm, dejando 50 cm entre plantas: caben unas 4 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "col", nombre: "Col (repollo)", emoji: "🥬", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1800, altMax: 3400, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 100, tipo: "Semillero y trasplante", distancia: "50 × 50 cm", riego: "Regular",
    marco: [50,50], densidad: 4.0, metodo: "semillero", sistemas: ["suelo", "invernadero"],
    inversion: 0.80, gastoCiclo: 0.25, rendimiento: 3, rendUnidad: "unidades", precio: 0.60, luna: "creciente",
    tip: "Muy resistente al frío. Revisa las hojas por gusanos cada semana.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 50 cm, dejando 50 cm entre plantas: caben unas 4 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "acelga", nombre: "Acelga", emoji: "🥬", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 70, tipo: "Siembra directa o trasplante", distancia: "30 × 30 cm", riego: "Frecuente",
    marco: [30,30], densidad: 11.111, metodo: "directa", sistemas: ["suelo", "maceta", "invernadero", "hidroponia"],
    inversion: 0.70, gastoCiclo: 0.20, rendimiento: 3, rendUnidad: "kg", precio: 1.00, luna: "menguante",
    tip: "Cosecha hoja por hoja y la planta sigue produciendo meses.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 30 cm, dejando 30 cm entre plantas: caben unas 11.11 plantas por m².",
      "Riego: Frecuente. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 2 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "espinaca", nombre: "Espinaca", emoji: "🥬", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1500, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 55, tipo: "Siembra directa", distancia: "Hileras a 25 cm", riego: "Frecuente",
    marco: [10,25], densidad: 40.0, metodo: "directa", sistemas: ["suelo", "maceta", "invernadero", "hidroponia"],
    inversion: 0.80, gastoCiclo: 0.20, rendimiento: 2, rendUnidad: "kg", precio: 1.50, luna: "menguante",
    tip: "Rápida y de buen precio. Con sombra parcial aguanta más antes de florecer.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 25 cm, dejando 10 cm entre plantas: caben unas 40 plantas por m².",
      "Riego: Frecuente. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 2 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "rabano", nombre: "Rábano", emoji: "🔴", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 30, tipo: "Siembra directa", distancia: "Hileras a 15 cm, ralear a 5 cm", riego: "Frecuente y ligero",
    marco: [5,15], densidad: 133.333, metodo: "directa", sistemas: ["suelo", "maceta"],
    inversion: 0.50, gastoCiclo: 0.10, rendimiento: 2, rendUnidad: "kg", precio: 1.00, luna: "menguante",
    tip: "El cultivo más rápido: listo en solo 30 días. Perfecto entre otros cultivos.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 15 cm, dejando 5 cm entre plantas: caben unas 133.33 plantas por m².",
      "Riego: Frecuente y ligero. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 30 días. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "remolacha", nombre: "Remolacha", emoji: "🟣", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1500, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Siembra directa", distancia: "Hileras a 25 cm, ralear a 10 cm", riego: "Regular",
    marco: [10,25], densidad: 40.0, metodo: "directa", sistemas: ["suelo", "maceta"],
    inversion: 0.70, gastoCiclo: 0.20, rendimiento: 3, rendUnidad: "kg", precio: 0.80, luna: "menguante",
    tip: "Las hojas tiernas también se comen, como acelga.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 25 cm, dejando 10 cm entre plantas: caben unas 40 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "pepino", nombre: "Pepino", emoji: "🥒", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2200, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11,12,1,2,3],
    diasProduccion: 70, tipo: "Siembra directa", distancia: "1 m entre matas, con tutor o rastrero", riego: "Abundante",
    marco: [100,100], densidad: 1.0, metodo: "directa", sistemas: ["suelo", "invernadero"],
    inversion: 1.00, gastoCiclo: 0.30, rendimiento: 5, rendUnidad: "kg", precio: 0.70, luna: "creciente", mesesPrecioAlto: [6,7,8,9],
    tip: "Cosecha cada 2 días cuando empieza a producir: mientras más cosechas, más produce.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 1 m, dejando 1 m entre plantas: caben unas 1 planta por m².",
      "Riego: Abundante. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 2 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "zapallo", nombre: "Zapallo / sambo", emoji: "🎃", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3000, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11,12,1],
    diasProduccion: 150, tipo: "Siembra directa", distancia: "3 × 3 m (ocupa mucho espacio)", riego: "Moderado",
    marco: [300,300], densidad: 0.111, metodo: "directa", sistemas: ["suelo"],
    inversion: 0.40, gastoCiclo: 0.10, rendimiento: 4, rendUnidad: "kg", precio: 0.50, luna: "creciente", mesesPrecioAlto: [9,10,11,12],
    tip: "Casi no necesita cuidados. Se guarda meses después de cosechado.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 3 m, dejando 3 m entre plantas: caben unas 0.11 plantas por m².",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 5 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "pimiento", nombre: "Pimiento", emoji: "🫑", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [9,10,11,12,1],
    diasProduccion: 120, tipo: "Semillero y trasplante", distancia: "40 × 60 cm", riego: "Regular",
    marco: [40,60], densidad: 4.167, metodo: "semillero", sistemas: ["suelo", "maceta", "invernadero"],
    inversion: 1.20, gastoCiclo: 0.40, rendimiento: 4, rendUnidad: "kg", precio: 1.20, luna: "creciente", mesesPrecioAlto: [7,8,9,10],
    tip: "En maceta grande (20 L) produce muy bien en balcones.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 60 cm, dejando 40 cm entre plantas: caben unas 4.17 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "aji", nombre: "Ají", emoji: "🌶️", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2400, espacios: ["maceta","huerto","parcela"], mesesSiembra: [9,10,11,12,1,2],
    diasProduccion: 110, tipo: "Semillero y trasplante", distancia: "40 × 50 cm", riego: "Moderado",
    marco: [40,50], densidad: 5.0, metodo: "semillero", sistemas: ["suelo", "maceta", "invernadero"],
    inversion: 1.00, gastoCiclo: 0.30, rendimiento: 2.5, rendUnidad: "kg", precio: 1.50, luna: "creciente", mesesPrecioAlto: [7,8,9,10],
    tip: "Buen precio y demanda constante. Una mata en maceta da ají para toda la familia.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 50 cm, dejando 40 cm entre plantas: caben unas 5 plantas por m².",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "arveja", nombre: "Arveja", emoji: "🫛", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 2000, altMax: 3200, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11,12,1,2],
    diasProduccion: 110, tipo: "Siembra directa", distancia: "Hileras a 60 cm, con tutor", riego: "Aprovecha lluvias",
    marco: [10,60], densidad: 16.667, metodo: "directa", sistemas: ["suelo"],
    inversion: 0.70, gastoCiclo: 0.20, rendimiento: 1.2, rendUnidad: "kg", precio: 1.50, luna: "creciente", mesesPrecioAlto: [6,7,8],
    tip: "En vaina verde se vende mejor que seca. Mejora el suelo como todas las leguminosas.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 60 cm, dejando 10 cm entre plantas: caben unas 16.67 plantas por m².",
      "Riego: Aprovecha lluvias. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "frejol", nombre: "Fréjol", emoji: "🫘", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2800, espacios: ["maceta","huerto","parcela"], mesesSiembra: [9,10,11,2,3],
    diasProduccion: 110, tipo: "Siembra directa", distancia: "40 × 20 cm", riego: "Ligero y constante",
    marco: [20,40], densidad: 12.5, metodo: "directa", sistemas: ["suelo", "maceta"],
    inversion: 0.60, gastoCiclo: 0.15, rendimiento: 1.5, rendUnidad: "kg", precio: 1.60, luna: "creciente", mesesPrecioAlto: [8,9,10],
    tip: "Fija nitrógeno: mejora el suelo para el siguiente cultivo. Siémbralo junto al maíz.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 40 cm, dejando 20 cm entre plantas: caben unas 12.5 plantas por m².",
      "Riego: Ligero y constante. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "haba", nombre: "Haba", emoji: "🫛", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 2400, altMax: 3600, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11,12,1],
    diasProduccion: 150, tipo: "Siembra directa", distancia: "60 × 30 cm", riego: "Aprovecha lluvias",
    marco: [30,60], densidad: 5.556, metodo: "directa", sistemas: ["suelo"],
    inversion: 0.50, gastoCiclo: 0.15, rendimiento: 1.8, rendUnidad: "kg", precio: 1.00, luna: "creciente", mesesPrecioAlto: [8,9,10,11,12],
    tip: "Aguanta bien el frío de la sierra alta, incluso heladas ligeras.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 60 cm, dejando 30 cm entre plantas: caben unas 5.56 plantas por m².",
      "Riego: Aprovecha lluvias. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 5 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "camote", nombre: "Camote", emoji: "🍠", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2500, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 150, tipo: "Esquejes (guías)", distancia: "30 cm entre guías, surcos a 90 cm", riego: "Resiste sequía",
    marco: [30,90], densidad: 3.704, metodo: "esqueje", sistemas: ["suelo"],
    inversion: 0.50, gastoCiclo: 0.10, rendimiento: 2.5, rendUnidad: "kg", precio: 0.60, luna: "menguante", mesesPrecioAlto: [10,11,12],
    tip: "Las guías se consiguen gratis de otra planta. Las hojas sirven de forraje para cuyes.",
    pasos: [
      "Consigue esquejes (guías) sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 90 cm, dejando 30 cm entre plantas: caben unas 3.7 plantas por m².",
      "Riego: Resiste sequía. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 5 meses. Saca esquejes de tus mejores plantas para volver a sembrar."
    ] },
  { id: "yuca", nombre: "Yuca", emoji: "🍠", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 1500, espacios: ["huerto","parcela"], mesesSiembra: [3,4,5,10,11,12],
    diasProduccion: 300, tipo: "Estacas de 20 cm", distancia: "1 × 1 m", riego: "Resiste sequía",
    marco: [100,100], densidad: 1.0, metodo: "estaca", sistemas: ["suelo"],
    inversion: 0.30, gastoCiclo: 0.10, rendimiento: 2.5, rendUnidad: "kg", precio: 0.50, luna: "menguante",
    tip: "Casi no necesita cuidados una vez establecida.",
    pasos: [
      "Corta estacas sanas de una planta madre productiva y déjalas orear un día a la sombra antes de sembrarlas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 1 m, dejando 1 m entre plantas: caben unas 1 planta por m².",
      "Riego: Resiste sequía. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 10 meses. Guarda estacas de los tallos más sanos para la próxima siembra."
    ] },

  // ------------------------- GRANOS -------------------------
  { id: "maiz", nombre: "Maíz suave (choclo)", emoji: "🌽", cat: "grano", unidad: "m2", modelo: "ciclo",
    altMin: 2200, altMax: 3000, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11],
    diasProduccion: 170, tipo: "Siembra directa", distancia: "80 × 30 cm, 2-3 semillas por golpe", riego: "Aprovecha lluvias de octubre",
    marco: [30,80], densidad: 4.167, metodo: "directa", sistemas: ["suelo"],
    inversion: 0.50, gastoCiclo: 0.15, rendimiento: 5, rendUnidad: "choclos", precio: 0.30, luna: "creciente", mesesPrecioAlto: [8,9,10,11],
    tip: "Siembra tradicional con fréjol: el maíz le sirve de tutor. En choclo se vende al doble que seco.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 80 cm, dejando 30 cm entre plantas: caben unas 4.17 plantas por m².",
      "Riego: Aprovecha lluvias de octubre. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 6 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "quinua", nombre: "Quinua", emoji: "🌾", cat: "grano", unidad: "m2", modelo: "ciclo",
    altMin: 2400, altMax: 4000, espacios: ["parcela"], mesesSiembra: [9,10,11,12],
    diasProduccion: 180, tipo: "Siembra directa", distancia: "Surcos a 60 cm", riego: "Resiste sequía",
    marco: [10,60], densidad: 16.667, metodo: "directa", sistemas: ["suelo"],
    inversion: 0.08, gastoCiclo: 0.06, rendimiento: 0.14, rendUnidad: "kg", precio: 3.00, luna: "creciente", mesesPrecioAlto: [11,12,1,2],
    tip: "Muy resistente a heladas y sequía. Grano de alto valor y buena demanda.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 60 cm, dejando 10 cm entre plantas: caben unas 16.67 plantas por m².",
      "Riego: Resiste sequía. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 6 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "chocho", nombre: "Chocho", emoji: "🫘", cat: "grano", unidad: "m2", modelo: "ciclo",
    altMin: 2500, altMax: 3600, espacios: ["parcela"], mesesSiembra: [12,1,2,3],
    diasProduccion: 240, tipo: "Siembra directa", distancia: "Surcos a 60 cm", riego: "Resiste sequía",
    marco: [20,60], densidad: 8.333, metodo: "directa", sistemas: ["suelo"],
    inversion: 0.05, gastoCiclo: 0.04, rendimiento: 0.08, rendUnidad: "kg", precio: 2.50, luna: "creciente", mesesPrecioAlto: [3,4,5,6],
    tip: "Precio alto y estable. Mejora el suelo: ideal para rotar después de papa.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 60 cm, dejando 20 cm entre plantas: caben unas 8.33 plantas por m².",
      "Riego: Resiste sequía. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 8 meses. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },

  // ------------------------- HIERBAS -------------------------
  { id: "cilantro", nombre: "Cilantro", emoji: "🌿", cat: "hierba", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3000, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 45, tipo: "Siembra directa", distancia: "Al voleo o hileras a 15 cm", riego: "Ligero, diario en maceta",
    marco: [5,15], densidad: 133.333, metodo: "directa", sistemas: ["suelo", "maceta", "hidroponia"],
    inversion: 0.50, gastoCiclo: 0.10, rendimiento: 12, rendUnidad: "atados", precio: 0.25, luna: "menguante",
    tip: "Listo en un mes y medio. Se vende fácil en atados en cualquier feria.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 15 cm, dejando 5 cm entre plantas: caben unas 133.33 plantas por m².",
      "Riego: Ligero, diario en maceta. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 45 días. Guarda semilla de tus mejores plantas para la próxima siembra."
    ] },
  { id: "hierbabuena", nombre: "Hierbabuena / menta", emoji: "🌿", cat: "hierba", unidad: "m2", modelo: "anual",
    altMin: 0, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 60, tipo: "Esquejes o matas", distancia: "20 × 20 cm", riego: "Frecuente",
    marco: [20,20], densidad: 25.0, metodo: "esqueje", sistemas: ["suelo", "maceta"],
    inversion: 0.60, gastoCiclo: 0.45, rendimiento: 20, rendUnidad: "atados", precio: 0.25, luna: "menguante", vida: "Produce por años, se corta y rebrota",
    tip: "Se siembra una vez y produce por años. Cuidado: se expande sola por todo el huerto.",
    pasos: [
      "Consigue esquejes o matas sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 20 cm, dejando 20 cm entre plantas: caben unas 25 plantas por m².",
      "Riego: Frecuente. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 2 meses; luego sigue produciendo cada año. Produce por años, se corta y rebrota."
    ] },
  { id: "manzanilla", nombre: "Manzanilla", emoji: "🌼", cat: "hierba", unidad: "m2", modelo: "anual",
    altMin: 2000, altMax: 3400, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Siembra directa", distancia: "Al voleo", riego: "Moderado",
    marco: [20,20], densidad: 25.0, metodo: "directa", sistemas: ["suelo", "maceta"],
    inversion: 0.50, gastoCiclo: 0.40, rendimiento: 15, rendUnidad: "atados", precio: 0.30, luna: "menguante", vida: "Rebrota tras cada corte",
    tip: "Demanda constante para agua aromática. Atrae abejas y otros polinizadores.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 20 cm, dejando 20 cm entre plantas: caben unas 25 plantas por m².",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 meses; luego sigue produciendo cada año. Rebrota tras cada corte."
    ] },
  { id: "oregano", nombre: "Orégano", emoji: "🌿", cat: "hierba", unidad: "m2", modelo: "anual",
    altMin: 1000, altMax: 3000, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Esquejes o matas", distancia: "25 × 25 cm", riego: "Poco: prefiere seco",
    marco: [25,25], densidad: 16.0, metodo: "esqueje", sistemas: ["suelo", "maceta"],
    inversion: 0.80, gastoCiclo: 0.40, rendimiento: 10, rendUnidad: "atados", precio: 0.50, luna: "menguante", vida: "Produce por 3-4 años",
    tip: "Seco vale aún más. Una jardinera en el balcón abastece a la familia todo el año.",
    pasos: [
      "Consigue esquejes o matas sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra en hileras separadas 25 cm, dejando 25 cm entre plantas: caben unas 16 plantas por m².",
      "Riego: Poco: prefiere seco. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 meses; luego sigue produciendo cada año. Produce por 3-4 años."
    ] },

  // ------------------------- FRUTALES -------------------------
  { id: "fresa", nombre: "Fresa", emoji: "🍓", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 1800, altMax: 3000, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Plántulas o estolones", distancia: "30 × 30 cm", riego: "Frecuente, goteo ideal",
    marco: [30,30], densidad: 11.111, metodo: "plantula", sistemas: ["suelo", "maceta", "invernadero", "hidroponia"],
    inversion: 0.35, gastoCiclo: 0.35, rendimiento: 0.8, rendUnidad: "kg", precio: 2.50, luna: "creciente", vida: "Produce bien por 2-3 años",
    tip: "Buen precio todo el año. Los hijos (estolones) te dan plantas gratis para ampliar.",
    pasos: [
      "Consigue plántulas o estolones sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Prepara un hueco pequeño (unos 20 × 20 cm) con tierra suelta mezclada con abono orgánico; al ser una planta chica no necesita un hoyo grande.",
      "Siembra en hileras separadas 30 cm, dejando 30 cm entre plantas: caben unas 11.11 plantas por m².",
      "Riego: Frecuente, goteo ideal. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 meses; luego sigue produciendo cada año. Produce bien por 2-3 años."
    ] },
  { id: "mora", nombre: "Mora de castilla", emoji: "🫐", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 1800, altMax: 3200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 240, tipo: "Plantas o acodos", distancia: "2 × 2 m, con espaldera", riego: "Regular",
    marco: [200,200], densidad: 0.25, metodo: "planta", sistemas: ["suelo"],
    inversion: 1.50, gastoCiclo: 1.50, rendimiento: 4, rendUnidad: "kg", precio: 1.80, luna: "creciente", vida: "Produce por 8-10 años",
    tip: "Cosecha semanal una vez establecida: ingreso constante para la sierra.",
    pasos: [
      "Consigue plantas o acodos sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 2 m, dejando 2 m entre plantas: caben unas 0.25 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 8 meses; luego sigue produciendo cada año. Produce por 8-10 años."
    ] },
  { id: "uvilla", nombre: "Uvilla", emoji: "🟡", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 2200, altMax: 3200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 240, tipo: "Plántulas", distancia: "1,5 × 1,5 m", riego: "Moderado",
    marco: [150,150], densidad: 0.444, metodo: "plantula", sistemas: ["suelo"],
    inversion: 0.80, gastoCiclo: 0.80, rendimiento: 2.5, rendUnidad: "kg", precio: 2.00, luna: "creciente", vida: "Produce por 2-3 años",
    tip: "Fruta andina con demanda creciente y buen precio de exportación.",
    pasos: [
      "Compra plántulas sanas en un vivero cercano, o siembra la semilla en semillero y trasplanta cuando tengan 15-20 cm.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 1,5 m, dejando 1,5 m entre plantas: caben unas 0.44 plantas por m².",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 8 meses; luego sigue produciendo cada año. Produce por 2-3 años."
    ] },
  { id: "tomate-arbol", nombre: "Tomate de árbol", emoji: "🍅", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 1500, altMax: 2800, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 540, tipo: "Plántulas injertas", distancia: "2 × 2 m", riego: "Regular",
    marco: [200,200], densidad: 0.25, metodo: "vivero", sistemas: ["suelo"],
    inversion: 2.00, gastoCiclo: 2.50, rendimiento: 15, rendUnidad: "kg", precio: 0.90, luna: "creciente", vida: "Produce por 4-5 años",
    tip: "A los 18 meses empieza a producir cada semana. Muy rentable en poco espacio.",
    pasos: [
      "Compra plantas injertas en un vivero de confianza: garantizan que produzcan antes y de mejor calidad que sembrar de semilla.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 2 m, dejando 2 m entre plantas: caben unas 0.25 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 1 años y medio; luego sigue produciendo cada año. Produce por 4-5 años."
    ] },
  { id: "aguacate", nombre: "Aguacate", emoji: "🥑", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 1400, altMax: 2500, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 1100, tipo: "Planta injerta (fuerte o hass)", distancia: "6 × 6 m", riego: "Moderado, buen drenaje",
    marco: [600,600], densidad: 0.028, metodo: "vivero", sistemas: ["suelo"],
    inversion: 6.00, gastoCiclo: 7.00, rendimiento: 60, rendUnidad: "kg", precio: 1.20, luna: "creciente", vida: "Produce por 30+ años",
    tip: "Inversión a futuro: tarda 3 años pero luego un solo árbol da ingresos por décadas.",
    pasos: [
      "Compra plantas injertas en un vivero de confianza: garantizan que produzcan antes y de mejor calidad que sembrar de semilla.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 6 m, dejando 6 m entre plantas: caben unas 0.03 plantas por m².",
      "Riego: Moderado, buen drenaje. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 años; luego sigue produciendo cada año. Produce por 30+ años."
    ] },
  { id: "limon", nombre: "Limón", emoji: "🍋", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 0, altMax: 2200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 1100, tipo: "Planta injerta", distancia: "5 × 5 m", riego: "Regular",
    marco: [500,500], densidad: 0.04, metodo: "vivero", sistemas: ["suelo"],
    inversion: 5.00, gastoCiclo: 5.00, rendimiento: 50, rendUnidad: "kg", precio: 0.80, luna: "creciente", mesesPrecioAlto: [7,8,9,10], vida: "Produce por 20+ años",
    tip: "Demanda todo el año. En época de escasez el precio se triplica.",
    pasos: [
      "Compra plantas injertas en un vivero de confianza: garantizan que produzcan antes y de mejor calidad que sembrar de semilla.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 5 m, dejando 5 m entre plantas: caben unas 0.04 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 años; luego sigue produciendo cada año. Produce por 20+ años."
    ] },
  { id: "naranja", nombre: "Naranja", emoji: "🍊", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 0, altMax: 1800, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 1300, tipo: "Planta injerta", distancia: "6 × 6 m", riego: "Moderado",
    marco: [600,600], densidad: 0.028, metodo: "vivero", sistemas: ["suelo"],
    inversion: 5.00, gastoCiclo: 5.00, rendimiento: 70, rendUnidad: "kg", precio: 0.35, luna: "creciente", vida: "Produce por 25+ años",
    tip: "Combínala con cultivos de ciclo corto entre los árboles mientras crecen.",
    pasos: [
      "Compra plantas injertas en un vivero de confianza: garantizan que produzcan antes y de mejor calidad que sembrar de semilla.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 6 m, dejando 6 m entre plantas: caben unas 0.03 plantas por m².",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 años y medio; luego sigue produciendo cada año. Produce por 25+ años."
    ] },
  { id: "papaya", nombre: "Papaya", emoji: "🧡", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 0, altMax: 1200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 300, tipo: "Plántulas", distancia: "2,5 × 2,5 m", riego: "Regular",
    marco: [250,250], densidad: 0.16, metodo: "plantula", sistemas: ["suelo", "invernadero"],
    inversion: 2.00, gastoCiclo: 4.00, rendimiento: 35, rendUnidad: "kg", precio: 0.50, luna: "creciente", vida: "Produce por 2-3 años",
    tip: "Produce al año de sembrada, y cada semana. De lo más rentable en clima cálido.",
    pasos: [
      "Compra plántulas sanas en un vivero cercano, o siembra la semilla en semillero y trasplanta cuando tengan 15-20 cm.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 2,5 m, dejando 2,5 m entre plantas: caben unas 0.16 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 10 meses; luego sigue produciendo cada año. Produce por 2-3 años."
    ] },
  { id: "maracuya", nombre: "Maracuyá", emoji: "🟠", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 0, altMax: 1500, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 270, tipo: "Plántulas, con espaldera o cerca", riego: "Regular", distancia: "3 m entre plantas",
    marco: [300,300], densidad: 0.111, metodo: "plantula", sistemas: ["suelo"],
    inversion: 1.50, gastoCiclo: 2.00, rendimiento: 12, rendUnidad: "kg", precio: 0.90, luna: "creciente", vida: "Produce por 3-4 años",
    tip: "Puede crecer sobre una cerca existente: producción sin ocupar terreno.",
    pasos: [
      "Compra plántulas sanas en un vivero cercano, o siembra la semilla en semillero y trasplanta cuando tengan 15-20 cm.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 3 m, dejando 3 m entre plantas: caben unas 0.11 plantas por m².",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 9 meses; luego sigue produciendo cada año. Produce por 3-4 años."
    ] },
  { id: "platano", nombre: "Plátano / guineo", emoji: "🍌", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 0, altMax: 1200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 365, tipo: "Hijuelos (colinos)", distancia: "3 × 3 m", riego: "Abundante en verano",
    marco: [300,300], densidad: 0.111, metodo: "hijuelo", sistemas: ["suelo"],
    inversion: 3.00, gastoCiclo: 2.50, rendimiento: 30, rendUnidad: "kg", precio: 0.40, luna: "creciente", vida: "La mata se renueva sola con hijos",
    tip: "Cada mata da un racimo al año y deja hijos para seguir produciendo.",
    pasos: [
      "Consigue hijuelos (colinos) sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 3 m, dejando 3 m entre plantas: caben unas 0.11 plantas por m².",
      "Riego: Abundante en verano. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 1 año; luego sigue produciendo cada año. La mata se renueva sola con hijos."
    ] },
  { id: "cafe", nombre: "Café", emoji: "☕", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 600, altMax: 2000, espacios: ["parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 900, tipo: "Plántulas, con sombra parcial", distancia: "2 × 2 m", riego: "Aprovecha lluvias",
    marco: [200,200], densidad: 0.25, metodo: "plantula", sistemas: ["suelo"],
    inversion: 1.20, gastoCiclo: 0.60, rendimiento: 0.5, rendUnidad: "kg", precio: 4.00, luna: "creciente", mesesPrecioAlto: [12,1,2,3], vida: "Produce por 15-20 años",
    tip: "El café de altura bien secado se paga mucho mejor. Asóciate para vender en volumen.",
    pasos: [
      "Compra plántulas sanas en un vivero cercano, o siembra la semilla en semillero y trasplanta cuando tengan 15-20 cm.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra en hileras separadas 2 m, dejando 2 m entre plantas: caben unas 0.25 plantas por m².",
      "Riego: Aprovecha lluvias. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 2 años y medio; luego sigue produciendo cada año. Produce por 15-20 años."
    ] },

  { id: "arandano", nombre: "Arándano", emoji: "🔵", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 2200, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 540, tipo: "Planta de vivero en sustrato ácido", distancia: "1 m entre plantas, hileras a 2,5 m", riego: "Frecuente por goteo, con agua sin cal",
    marco: [100,250], densidad: 0.4, metodo: "vivero", sistemas: ["suelo", "maceta", "invernadero"],
    inversion: 5.00, gastoCiclo: 3.00, rendimiento: 3, rendUnidad: "kg", precio: 6.00, luna: "creciente", vida: "Produce por 12-15 años",
    tip: "Solo prospera en suelo ácido (pH 4,5-5,5). Si tu tierra no lo es, siémbralo en maceta grande con sustrato de corteza de pino: es lo más común y funciona muy bien.",
    pasos: [
      "Compra plantas de vivero de 1-2 años ya establecidas: de semilla tarda demasiado y no siempre sale igual a la madre.",
      "Prepara el sustrato ácido antes de plantar: mezcla corteza de pino, turba y tierra. Mide el pH — si pasa de 5,5 el arándano se amarilla y no produce.",
      "Siembra en hileras separadas 2,5 m, dejando 1 m entre plantas: caben unas 0,4 plantas por m².",
      "Riega por goteo y con agua sin cal (la de lluvia es ideal). Cubre el suelo con acícula de pino o aserrín para mantener la acidez y la humedad.",
      "Primera cosecha en año y medio; a los 3 años llega a producción plena y sigue por 12-15 años. Cosecha cada semana en época de fruta."
    ] },
  { id: "cacao", nombre: "Cacao", emoji: "🍫", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 0, altMax: 1200, espacios: ["parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 1095, tipo: "Planta injerta de vivero, con sombra", distancia: "3 × 3 m", riego: "Aprovecha lluvias; necesita humedad constante",
    marco: [300,300], densidad: 0.111, metodo: "vivero", sistemas: ["suelo"],
    inversion: 1.50, gastoCiclo: 1.20, rendimiento: 1.2, rendUnidad: "kg", precio: 4.50, luna: "creciente", vida: "Produce por 25-30 años",
    tip: "El cacao fino de aroma ecuatoriano se paga mejor, pero solo si fermentas bien: 5-6 días en cajón de madera. Sin fermentar te lo compran como cacao corriente.",
    pasos: [
      "Compra plantas injertas de vivero certificado (clones como CCN-51 o Nacional fino de aroma): de semilla tardan más y rinden menos.",
      "Siembra primero la sombra (plátano o guaba) unos meses antes: el cacao joven se quema con sol directo.",
      "Siembra en hileras separadas 3 m, dejando 3 m entre plantas: caben unas 0,11 plantas por m².",
      "Poda cada año para dar forma y quitar chupones. Recoge y entierra las mazorcas enfermas: es la mejor defensa contra la monilla.",
      "Primera cosecha a los 3 años y producción plena al quinto; el árbol sigue dando por 25-30 años. Fermenta y seca bien el grano antes de vender."
    ] },
  { id: "granadilla", nombre: "Granadilla", emoji: "🟠", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 1600, altMax: 2600, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 300, tipo: "Plántulas, sobre emparrado", distancia: "4 × 4 m, con emparrado", riego: "Regular, sin encharcar",
    marco: [400,400], densidad: 0.062, metodo: "plantula", sistemas: ["suelo"],
    inversion: 2.50, gastoCiclo: 3.00, rendimiento: 20, rendUnidad: "kg", precio: 1.20, luna: "creciente", vida: "Produce por 4-5 años",
    tip: "Necesita emparrado: un techo de alambre a 2 m de alto. Sin él la fruta se pudre contra el suelo y la planta produce mucho menos.",
    pasos: [
      "Consigue plántulas de vivero o siembra semilla de una fruta bien madura y sana en semillero; trasplanta cuando midan 30 cm.",
      "Arma el emparrado antes de sembrar: postes de 2,2 m y alambre cruzado. Es la inversión más importante del cultivo.",
      "Siembra en hileras separadas 4 m, dejando 4 m entre plantas: caben unas 0,06 plantas por m².",
      "Guía la planta con una cuerda hasta el emparrado y deja que se extienda arriba. Riega regular pero cuida el drenaje: no tolera encharcamiento.",
      "Primera cosecha a los 10 meses y luego produce todo el año por 4-5 años. Corta la fruta con tijera dejando un pedacito de tallo."
    ] },
  { id: "babaco", nombre: "Babaco", emoji: "🍈", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 1600, altMax: 2800, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 365, tipo: "Esquejes; ideal bajo invernadero", distancia: "2 × 2 m", riego: "Regular, buen drenaje",
    marco: [200,200], densidad: 0.25, metodo: "esqueje", sistemas: ["suelo", "invernadero"],
    inversion: 2.00, gastoCiclo: 2.50, rendimiento: 25, rendUnidad: "kg", precio: 0.80, luna: "creciente", vida: "Produce por 5-8 años",
    tip: "Fruta ecuatoriana sin semillas. Bajo invernadero produce mucho más y se libra de la antracnosis, que es su peor enfermedad.",
    pasos: [
      "Consigue esquejes de tallo de una planta sana y productiva; déjalos orear 3-4 días a la sombra antes de sembrarlos para que cicatricen.",
      "Prepara suelo suelto y con muy buen drenaje: el babaco se pudre del cuello si el agua se estanca. Camas altas ayudan mucho.",
      "Siembra en hileras separadas 2 m, dejando 2 m entre plantas: caben unas 0,25 plantas por m².",
      "Ponle un tutor cuando cargue fruta, porque el tallo es hueco y se quiebra con el peso. Quita las hojas bajas para que circule el aire.",
      "Primera cosecha al año y sigue produciendo por 5-8 años. La fruta se cosecha pintona y termina de madurar en casa."
    ] },
  { id: "pitahaya", nombre: "Pitahaya amarilla", emoji: "🌵", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 0, altMax: 1700, espacios: ["parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 730, tipo: "Esquejes sobre tutor", distancia: "3 × 3 m, con tutor", riego: "Poco: resiste sequía",
    marco: [300,300], densidad: 0.111, metodo: "esqueje", sistemas: ["suelo"],
    inversion: 4.00, gastoCiclo: 2.50, rendimiento: 12, rendUnidad: "kg", precio: 2.50, luna: "creciente", vida: "Produce por 15-20 años",
    tip: "Cultivo de exportación en auge. Es un cactus trepador: necesita tutor firme de madera o cemento porque llega a pesar mucho.",
    pasos: [
      "Consigue esquejes de 30-40 cm de plantas que ya estén produciendo bien; déjalos orear una semana a la sombra antes de sembrar.",
      "Planta los tutores primero (postes de 2 m con una llanta o marco arriba): la planta trepa por ellos y desde ahí cuelga la fruta.",
      "Siembra en hileras separadas 3 m, dejando 3 m entre plantas: caben unas 0,11 plantas por m². Pon 3-4 esquejes alrededor de cada tutor.",
      "Riega poco: es cactus y se pudre con exceso de agua. Poda los brotes de abajo para que la planta suba rápido al tutor.",
      "Primera cosecha a los 2 años y producción plena al cuarto; sigue por 15-20 años. La polinización a mano de noche sube bastante el rendimiento."
    ] },

  // ------------------------- ANIMALES -------------------------
  { id: "cuy", nombre: "Cuy (engorde)", emoji: "🐹", cat: "animal", unidad: "animal", modelo: "ciclo",
    altMin: 0, altMax: 3800, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 120, tipo: "Pozas o jaulas, 5-10 por poza", distancia: "0,2 m² por cuy", riego: "Alfalfa, hierba y balanceado",
    inversion: 3.50, gastoCiclo: 4.00, rendimiento: 1, rendUnidad: "cuyes", precio: 12.00, luna: null,
    tip: "El cálculo es de engorde: compras el cuy destetado y lo vendes en 4 meses. Si además crías, una hembra da 12-16 crías al año y dejas de comprar animales.",
    pasos: [
      "Prepara pozas o jaulas limpias y secas, calculando 0,2 m² por cuy, en un lugar sin corrientes de aire directas.",
      "Compra reproductores sanos a un criadero o vecino de confianza: empieza con 3-4 hembras y 1 macho, y sepáralos 1-2 semanas en cuarentena antes de juntarlos con otros cuyes que ya tengas.",
      "Aliméntalos con alfalfa o hierba fresca todos los días, más un poco de balanceado; dales agua limpia si no comen suficiente forraje verde.",
      "Limpia la poza cada semana, separa a los cuyes por tamaño y edad para evitar peleas, y revisa a diario que estén activos y comiendo.",
      "Los cuyes de engorde están listos en unos 4 meses; una hembra reproductora puede darte 12-16 crías al año."
    ] },
  { id: "gallina", nombre: "Gallina ponedora", emoji: "🐔", cat: "animal", unidad: "animal", modelo: "mensual",
    altMin: 0, altMax: 3600, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 30, tipo: "Gallinero con corral al aire libre", distancia: "0,5 m² por gallina + corral", riego: "Balanceado, maíz y restos de cocina",
    inversion: 14.00, gastoCiclo: 3.00, rendimiento: 22, rendUnidad: "huevos", precio: 0.20, luna: null, vida: "Pone bien por 12-14 meses",
    tip: "El huevo de campo se vende hasta a $0,25. Con 10 gallinas cubres el gasto de la casa y sobra para vender.",
    pasos: [
      "Arma un gallinero techado y seco con corral al aire libre, calculando 0,5 m² por gallina más el espacio del corral.",
      "Compra gallinas ponedoras ya cerca de la edad de postura (18-20 semanas) para empezar a recibir huevos pronto, en vez de pollitas recién nacidas.",
      "Aliméntalas con balanceado, maíz molido y restos de cocina; el agua limpia y fresca debe estar siempre disponible.",
      "Limpia el gallinero cada semana, revisa que no haya piojos ni parásitos, y recoge los huevos a diario para que no se ensucien o se rompan.",
      "Una gallina bien alimentada pone bien por 12-14 meses, alrededor de 22 huevos al mes."
    ] },
  { id: "pollo", nombre: "Pollo de engorde", emoji: "🐓", cat: "animal", unidad: "animal", modelo: "ciclo",
    altMin: 0, altMax: 3000, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 49, tipo: "Galpón abrigado y limpio", distancia: "10 pollos por m²", riego: "Balanceado de engorde",
    inversion: 2.00, gastoCiclo: 5.50, rendimiento: 1, rendUnidad: "pollos", precio: 9.00, luna: null,
    tip: "Ciclo corto: 7 semanas. El pollo criollo tarda más pero se paga mejor.",
    pasos: [
      "Prepara un galpón abrigado, limpio y con buena ventilación, calculando hasta 10 pollos por m².",
      "Compra pollitos bebé (BB) sanos de una incubadora o distribuidor de confianza, y mantenlos con una fuente de calor las primeras 2 semanas.",
      "Dales balanceado de engorde según su edad (iniciador, luego crecimiento) y agua limpia siempre disponible.",
      "Limpia la cama del galpón seguido para evitar enfermedades, y sepáralos si ves alguno enfermo o más débil que el resto.",
      "Listos para la venta en unas 7 semanas (49 días)."
    ] },
  { id: "cerdo", nombre: "Cerdo (engorde)", emoji: "🐖", cat: "animal", unidad: "animal", modelo: "ciclo",
    altMin: 0, altMax: 3200, espacios: ["parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 150, tipo: "Chanchera techada con piso firme", distancia: "2 m² por cerdo", riego: "Balanceado + restos de cocina y banano",
    inversion: 70.00, gastoCiclo: 90.00, rendimiento: 1, rendUnidad: "cerdos", precio: 220.00, luna: null, maxCalc: 20,
    tip: "Baja el costo de alimento con restos de cocina, banano y suero. Véndelo en pie o faenado en fiestas.",
    pasos: [
      "Construye una chanchera techada con piso firme y buen desagüe, calculando 2 m² por cerdo.",
      "Compra lechones destetados (2-3 meses) sanos, de buen tamaño y activos, de preferencia de una piara de confianza.",
      "Aliméntalos con balanceado más restos de cocina, banano y suero de leche para bajar el costo del alimento sin descuidar su crecimiento.",
      "Limpia la chanchera a diario (el cerdo es limpio si tiene dónde estar limpio), desparasítalo al inicio y vigila su apetito.",
      "Listo para vender en pie o faenado en unos 5 meses (150 días)."
    ] },
  { id: "conejo", nombre: "Conejo", emoji: "🐇", cat: "animal", unidad: "animal", modelo: "ciclo",
    altMin: 0, altMax: 3600, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 120, tipo: "Jaulas elevadas y secas", distancia: "0,3 m² por conejo", riego: "Hierba, alfalfa y balanceado",
    inversion: 9.00, gastoCiclo: 6.00, rendimiento: 1, rendUnidad: "conejos", precio: 18.00, luna: null,
    tip: "Se reproduce rapidísimo: una coneja da 25-30 crías al año. Su abono es de los mejores para el huerto.",
    pasos: [
      "Instala jaulas elevadas, secas y ventiladas, calculando 0,3 m² por conejo, separadas por sexo y edad.",
      "Compra reproductores sanos: 1 macho por cada 5-8 hembras es una buena proporción para empezar.",
      "Aliméntalos con hierba, alfalfa y un poco de balanceado; evita hierba mojada por rocío o lluvia, les hace daño al estómago.",
      "Limpia las jaulas cada semana, revisa que no tengan sarna en las orejas y separa a las crías de la madre al mes y medio.",
      "Listos para la venta en unos 4 meses; una coneja puede darte 25-30 crías al año."
    ] },
  { id: "oveja", nombre: "Oveja", emoji: "🐑", cat: "animal", unidad: "animal", modelo: "ciclo",
    altMin: 2000, altMax: 4000, espacios: ["parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 365, tipo: "Pastoreo con corral nocturno", distancia: "5-8 ovejas por hectárea de pasto", riego: "Pasto + sales minerales",
    inversion: 70.00, gastoCiclo: 20.00, rendimiento: 1, rendUnidad: "ovejas", precio: 130.00, luna: null, maxCalc: 20,
    tip: "Además de la venta: lana cada año y abono para el huerto. Resistente al frío del páramo.",
    pasos: [
      "Prepara un corral nocturno seguro (contra perros y robo) y asegura pasto suficiente: calcula 5-8 ovejas por hectárea.",
      "Compra ovejas jóvenes y sanas, revisando que caminen bien y tengan los ojos y la nariz limpios.",
      "Llévalas a pastorear de día y dales sales minerales; en época seca complementa con forraje cortado.",
      "Esquílalas una vez al año, desparasítalas cada 3-4 meses y revisa sus pezuñas para que no se enfermen por humedad.",
      "Da lana cada año y está lista para la venta al año de crianza; su abono también mejora tu huerto."
    ] },
  { id: "cabra", nombre: "Cabra lechera", emoji: "🐐", cat: "animal", unidad: "animal", modelo: "mensual",
    altMin: 0, altMax: 3600, espacios: ["parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 30, tipo: "Pastoreo o estabulada", distancia: "10 m² de corral + pasto", riego: "Pasto, ramas y balanceado ligero",
    inversion: 120.00, gastoCiclo: 12.00, rendimiento: 45, rendUnidad: "litros", precio: 1.00, luna: null, maxCalc: 20, vida: "Produce leche 8-10 meses al año",
    tip: "La leche de cabra se vende al doble que la de vaca. Come ramas y maleza que otros no aprovechan.",
    pasos: [
      "Prepara un corral de al menos 10 m² más acceso a pasto o maleza; puede ser estabulada o de pastoreo.",
      "Compra cabras que ya estén paridas o cerca del parto si buscas leche pronto, de un criador de confianza.",
      "Aliméntalas con pasto, ramas y un balanceado ligero; la cabra aprovecha maleza que otros animales no comen.",
      "Desparasítalas cada 3 meses, revisa la ubre antes de ordeñar y mantén el corral seco para evitar enfermedades de pezuña.",
      "Produce leche 8-10 meses al año, unos 45 litros al mes por cabra en ordeño."
    ] },
  { id: "vaca", nombre: "Vaca lechera", emoji: "🐄", cat: "animal", unidad: "animal", modelo: "mensual",
    altMin: 0, altMax: 3600, espacios: ["parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 30, tipo: "Pastoreo con sogueo o cerca", distancia: "Necesita ~1 hectárea de pasto", riego: "Pasto + sales + balanceado en ordeño",
    inversion: 750.00, gastoCiclo: 60.00, rendimiento: 240, rendUnidad: "litros", precio: 0.48, luna: null, maxCalc: 3, vida: "Produce 8-10 meses por parto",
    tip: "La mayor inversión, pero da ingreso diario. Haz queso fresco para ganar más por litro.",
    pasos: [
      "Asegura pasto suficiente (cerca de 1 hectárea) y agua cercana; puedes usar sogueo rotativo o cerca eléctrica.",
      "Compra una vaca ya parida o próxima a parir si buscas producción de leche pronto; revisa que esté sana y bien alimentada.",
      "Complementa el pastoreo con sales minerales y un poco de balanceado durante el ordeño para sostener la producción.",
      "Ordeña a la misma hora todos los días, mantén limpios los pezones y desparasítala según calendario veterinario.",
      "Produce leche 8-10 meses por parto, alrededor de 240 litros al mes; hacer queso fresco te da más ganancia por litro."
    ] },
  { id: "abejas", nombre: "Abejas (colmena)", emoji: "🐝", cat: "animal", unidad: "animal", modelo: "anual",
    altMin: 0, altMax: 3000, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 240, tipo: "Colmena tipo Langstroth", distancia: "Lejos de casas y animales, cerca de flores", riego: "Se alimentan solas de flores",
    inversion: 140.00, gastoCiclo: 25.00, rendimiento: 18, rendUnidad: "kg de miel", precio: 8.00, luna: null, maxCalc: 20, vida: "La colmena dura años bien manejada",
    tip: "Además de miel, polinizan tu huerto y suben las cosechas. Empieza con curso básico: hay que saber manejarlas.",
    pasos: [
      "Elige un sitio alejado de casas y animales, cerca de flores y con una fuente de agua cercana; orienta la piquera hacia donde salga el sol de la mañana.",
      "Consigue un núcleo o enjambre con una reina fecundada, de preferencia con ayuda de un apicultor con experiencia la primera vez.",
      "Toma un curso básico de apicultura antes de empezar: manejar abejas sin saber es peligroso para ti y para ellas.",
      "Revisa la colmena cada 15-20 días (sin abrirla de más) para ver que la reina esté poniendo y no falte espacio ni alimento.",
      "La primera cosecha de miel suele darse a los 8 meses de instalada la colmena, con la colmena ya bien poblada."
    ] }
];

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_SEM = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const ESPACIOS = [
  { id: "maceta", nombre: "Macetas y balcón", emoji: "🪴", desc: "Huerto urbano en casa, hasta ~20 m²", areaDefault: 5 },
  { id: "huerto", nombre: "Huerto familiar", emoji: "🏡", desc: "Patio o terreno pequeño, hasta ~500 m²", areaDefault: 100 },
  { id: "parcela", nombre: "Parcela", emoji: "🌄", desc: "Terreno de cultivo, hasta 2 hectáreas", areaDefault: 5000 }
];

const UNIDAD_INFO = {
  m2:     { singular: "m²",     plural: "m²",       pregunta: "¿Cuántos metros cuadrados vas a sembrar?", min: 1 },
  planta: { singular: "planta", plural: "plantas",  pregunta: "¿Cuántas plantas vas a poner?", min: 1 },
  arbol:  { singular: "árbol",  plural: "árboles",  pregunta: "¿Cuántos árboles vas a plantar?", min: 1 },
  animal: { singular: "animal", plural: "animales", pregunta: "¿Con cuántos animales vas a empezar?", min: 1 }
};

function zonaPorAltitud(alt) {
  if (alt < 1000) return { nombre: "Zona cálida", emoji: "🌴" };
  if (alt < 2000) return { nombre: "Valle subtropical", emoji: "🌤️" };
  if (alt < 3200) return { nombre: "Sierra andina", emoji: "⛰️" };
  return { nombre: "Sierra alta", emoji: "🏔️" };
}
