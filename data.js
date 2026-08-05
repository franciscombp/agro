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
    inversion: 0.80, gastoCiclo: 0.20, rendimiento: 10, rendUnidad: "unidades", precio: 0.35, luna: "menguante",
    tip: "Ideal para empezar: crece rápido y ocupa poco espacio. Siembra cada 2 semanas para cosechar todo el año.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 25 × 25 cm.",
      "Riego: Frecuente, suelo húmedo. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 2 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "tomate", nombre: "Tomate riñón", emoji: "🍅", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2600, espacios: ["maceta","huerto","parcela"], mesesSiembra: [9,10,11,12,1,2],
    diasProduccion: 100, tipo: "Semillero y trasplante", distancia: "50 × 100 cm, con tutor", riego: "Regular, sin mojar hojas",
    inversion: 1.50, gastoCiclo: 0.50, rendimiento: 6, rendUnidad: "kg", precio: 1.00, luna: "creciente", mesesPrecioAlto: [6,7,8,9,10],
    tip: "Necesita tutor (caña o palo) y sol directo. En maceta usa recipientes de al menos 20 litros.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 50 × 100 cm, con tutor.",
      "Riego: Regular, sin mojar hojas. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "papa", nombre: "Papa", emoji: "🥔", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 2400, altMax: 3800, espacios: ["huerto","parcela"], mesesSiembra: [10,11,12,1,4,5,6],
    diasProduccion: 150, tipo: "Siembra directa (tubérculo)", distancia: "30 cm entre plantas, surcos a 1 m", riego: "Moderado, evitar encharcar",
    inversion: 0.90, gastoCiclo: 0.30, rendimiento: 2.5, rendUnidad: "kg", precio: 0.50, luna: "menguante", mesesPrecioAlto: [12,1,2,7,8],
    tip: "Aporca (arrima tierra al tallo) cada 3 semanas. Guarda las papas más sanas como semilla.",
    pasos: [
      "Consigue semilla certificada o tubérculos sanos del tamaño de un huevo, con brotes cortos, guardados de tu mejor cosecha.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 30 cm entre plantas, surcos a 1 m.",
      "Riego: Moderado, evitar encharcar. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 5 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "zanahoria", nombre: "Zanahoria", emoji: "🥕", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1800, altMax: 3400, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 110, tipo: "Siembra directa (no trasplantar)", distancia: "Hileras a 20 cm, ralear a 5 cm", riego: "Constante al inicio",
    inversion: 0.70, gastoCiclo: 0.20, rendimiento: 3, rendUnidad: "kg", precio: 0.60, luna: "menguante",
    tip: "Suelo suelto y profundo, sin piedras, para raíces rectas.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Hileras a 20 cm, ralear a 5 cm.",
      "Riego: Constante al inicio. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "cebolla-larga", nombre: "Cebolla larga", emoji: "🧅", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1500, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Trasplante de matas", distancia: "15 × 15 cm", riego: "Moderado",
    inversion: 0.80, gastoCiclo: 0.20, rendimiento: 2.5, rendUnidad: "kg", precio: 1.00, luna: "menguante",
    tip: "Se corta y vuelve a brotar: cosecha continua por meses.",
    pasos: [
      "Consigue matas ya enraizadas, de un vivero o separadas de tu propia planta, y trasplántalas directo a su sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 15 × 15 cm.",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "brocoli", nombre: "Brócoli", emoji: "🥦", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 2200, altMax: 3200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Semillero y trasplante", distancia: "50 × 50 cm", riego: "Regular",
    inversion: 1.00, gastoCiclo: 0.30, rendimiento: 3, rendUnidad: "unidades", precio: 0.70, luna: "creciente",
    tip: "Tras cortar la cabeza principal salen brotes laterales comestibles.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 50 × 50 cm.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "col", nombre: "Col (repollo)", emoji: "🥬", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1800, altMax: 3400, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 100, tipo: "Semillero y trasplante", distancia: "50 × 50 cm", riego: "Regular",
    inversion: 0.80, gastoCiclo: 0.25, rendimiento: 3, rendUnidad: "unidades", precio: 0.60, luna: "creciente",
    tip: "Muy resistente al frío. Revisa las hojas por gusanos cada semana.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 50 × 50 cm.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "acelga", nombre: "Acelga", emoji: "🥬", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 70, tipo: "Siembra directa o trasplante", distancia: "30 × 30 cm", riego: "Frecuente",
    inversion: 0.70, gastoCiclo: 0.20, rendimiento: 3, rendUnidad: "kg", precio: 1.00, luna: "menguante",
    tip: "Cosecha hoja por hoja y la planta sigue produciendo meses.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 30 × 30 cm.",
      "Riego: Frecuente. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 2 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "espinaca", nombre: "Espinaca", emoji: "🥬", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1500, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 55, tipo: "Siembra directa", distancia: "Hileras a 25 cm", riego: "Frecuente",
    inversion: 0.80, gastoCiclo: 0.20, rendimiento: 2, rendUnidad: "kg", precio: 1.50, luna: "menguante",
    tip: "Rápida y de buen precio. Con sombra parcial aguanta más antes de florecer.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Hileras a 25 cm.",
      "Riego: Frecuente. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 2 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "rabano", nombre: "Rábano", emoji: "🔴", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 30, tipo: "Siembra directa", distancia: "Hileras a 15 cm, ralear a 5 cm", riego: "Frecuente y ligero",
    inversion: 0.50, gastoCiclo: 0.10, rendimiento: 2, rendUnidad: "kg", precio: 1.00, luna: "menguante",
    tip: "El cultivo más rápido: listo en solo 30 días. Perfecto entre otros cultivos.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Hileras a 15 cm, ralear a 5 cm.",
      "Riego: Frecuente y ligero. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 30 días. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "remolacha", nombre: "Remolacha", emoji: "🟣", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 1500, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Siembra directa", distancia: "Hileras a 25 cm, ralear a 10 cm", riego: "Regular",
    inversion: 0.70, gastoCiclo: 0.20, rendimiento: 3, rendUnidad: "kg", precio: 0.80, luna: "menguante",
    tip: "Las hojas tiernas también se comen, como acelga.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Hileras a 25 cm, ralear a 10 cm.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 3 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "pepino", nombre: "Pepino", emoji: "🥒", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2200, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11,12,1,2,3],
    diasProduccion: 70, tipo: "Siembra directa", distancia: "1 m entre matas, con tutor o rastrero", riego: "Abundante",
    inversion: 1.00, gastoCiclo: 0.30, rendimiento: 5, rendUnidad: "kg", precio: 0.70, luna: "creciente", mesesPrecioAlto: [6,7,8,9],
    tip: "Cosecha cada 2 días cuando empieza a producir: mientras más cosechas, más produce.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 1 m entre matas, con tutor o rastrero.",
      "Riego: Abundante. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 2 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "zapallo", nombre: "Zapallo / sambo", emoji: "🎃", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3000, espacios: ["parcela"], mesesSiembra: [9,10,11,12,1],
    diasProduccion: 150, tipo: "Siembra directa", distancia: "3 × 3 m (ocupa mucho espacio)", riego: "Moderado",
    inversion: 0.40, gastoCiclo: 0.10, rendimiento: 4, rendUnidad: "kg", precio: 0.50, luna: "creciente", mesesPrecioAlto: [9,10,11,12],
    tip: "Casi no necesita cuidados. Se guarda meses después de cosechado.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 3 × 3 m (ocupa mucho espacio).",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 5 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "pimiento", nombre: "Pimiento", emoji: "🫑", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [9,10,11,12,1],
    diasProduccion: 120, tipo: "Semillero y trasplante", distancia: "40 × 60 cm", riego: "Regular",
    inversion: 1.20, gastoCiclo: 0.40, rendimiento: 4, rendUnidad: "kg", precio: 1.20, luna: "creciente", mesesPrecioAlto: [7,8,9,10],
    tip: "En maceta grande (20 L) produce muy bien en balcones.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 40 × 60 cm.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "aji", nombre: "Ají", emoji: "🌶️", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2400, espacios: ["maceta","huerto","parcela"], mesesSiembra: [9,10,11,12,1,2],
    diasProduccion: 110, tipo: "Semillero y trasplante", distancia: "40 × 50 cm", riego: "Moderado",
    inversion: 1.00, gastoCiclo: 0.30, rendimiento: 2.5, rendUnidad: "kg", precio: 1.50, luna: "creciente", mesesPrecioAlto: [7,8,9,10],
    tip: "Buen precio y demanda constante. Una mata en maceta da ají para toda la familia.",
    pasos: [
      "Haz un semillero en bandejas, cajas o un cantero aparte con tierra suelta y cernida; trasplanta cuando las plántulas tengan 3-4 hojas verdaderas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 40 × 50 cm.",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "arveja", nombre: "Arveja", emoji: "🫛", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 2000, altMax: 3200, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11,12,1,2],
    diasProduccion: 110, tipo: "Siembra directa", distancia: "Hileras a 60 cm, con tutor", riego: "Aprovecha lluvias",
    inversion: 0.70, gastoCiclo: 0.20, rendimiento: 1.2, rendUnidad: "kg", precio: 1.50, luna: "creciente", mesesPrecioAlto: [6,7,8],
    tip: "En vaina verde se vende mejor que seca. Mejora el suelo como todas las leguminosas.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Hileras a 60 cm, con tutor.",
      "Riego: Aprovecha lluvias. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "frejol", nombre: "Fréjol", emoji: "🫘", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2800, espacios: ["maceta","huerto","parcela"], mesesSiembra: [9,10,11,2,3],
    diasProduccion: 110, tipo: "Siembra directa", distancia: "40 × 20 cm", riego: "Ligero y constante",
    inversion: 0.60, gastoCiclo: 0.15, rendimiento: 1.5, rendUnidad: "kg", precio: 1.60, luna: "creciente", mesesPrecioAlto: [8,9,10],
    tip: "Fija nitrógeno: mejora el suelo para el siguiente cultivo. Siémbralo junto al maíz.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 40 × 20 cm.",
      "Riego: Ligero y constante. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 4 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "haba", nombre: "Haba", emoji: "🫛", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 2600, altMax: 3600, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11,12,1],
    diasProduccion: 150, tipo: "Siembra directa", distancia: "60 × 30 cm", riego: "Aprovecha lluvias",
    inversion: 0.50, gastoCiclo: 0.15, rendimiento: 1.8, rendUnidad: "kg", precio: 1.00, luna: "creciente", mesesPrecioAlto: [8,9,10,11,12],
    tip: "Aguanta bien el frío de la sierra alta, incluso heladas ligeras.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 60 × 30 cm.",
      "Riego: Aprovecha lluvias. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 5 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "camote", nombre: "Camote", emoji: "🍠", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 2500, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 150, tipo: "Esquejes (guías)", distancia: "30 cm entre guías, surcos a 90 cm", riego: "Resiste sequía",
    inversion: 0.50, gastoCiclo: 0.10, rendimiento: 2.5, rendUnidad: "kg", precio: 0.60, luna: "menguante", mesesPrecioAlto: [10,11,12],
    tip: "Las guías se consiguen gratis de otra planta. Las hojas sirven de forraje para cuyes.",
    pasos: [
      "Consigue esquejes (guías) sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 30 cm entre guías, surcos a 90 cm.",
      "Riego: Resiste sequía. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 5 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "yuca", nombre: "Yuca", emoji: "🍠", cat: "hortaliza", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 1500, espacios: ["parcela"], mesesSiembra: [3,4,5,10,11,12],
    diasProduccion: 300, tipo: "Estacas de 20 cm", distancia: "1 × 1 m", riego: "Resiste sequía",
    inversion: 0.30, gastoCiclo: 0.10, rendimiento: 2.5, rendUnidad: "kg", precio: 0.50, luna: "menguante",
    tip: "Casi no necesita cuidados una vez establecida.",
    pasos: [
      "Corta estacas sanas de una planta madre productiva y déjalas orear un día a la sombra antes de sembrarlas.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 1 × 1 m.",
      "Riego: Resiste sequía. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 10 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },

  // ------------------------- GRANOS -------------------------
  { id: "maiz", nombre: "Maíz suave (choclo)", emoji: "🌽", cat: "grano", unidad: "m2", modelo: "ciclo",
    altMin: 2200, altMax: 3000, espacios: ["huerto","parcela"], mesesSiembra: [9,10,11],
    diasProduccion: 170, tipo: "Siembra directa", distancia: "80 × 30 cm, 2-3 semillas por golpe", riego: "Aprovecha lluvias de octubre",
    inversion: 0.50, gastoCiclo: 0.15, rendimiento: 5, rendUnidad: "choclos", precio: 0.30, luna: "creciente", mesesPrecioAlto: [8,9,10,11],
    tip: "Siembra tradicional con fréjol: el maíz le sirve de tutor. En choclo se vende al doble que seco.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 80 × 30 cm, 2-3 semillas por golpe.",
      "Riego: Aprovecha lluvias de octubre. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 6 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "quinua", nombre: "Quinua", emoji: "🌾", cat: "grano", unidad: "m2", modelo: "ciclo",
    altMin: 2500, altMax: 4000, espacios: ["parcela"], mesesSiembra: [9,10,11,12],
    diasProduccion: 180, tipo: "Siembra directa", distancia: "Surcos a 60 cm", riego: "Resiste sequía",
    inversion: 0.40, gastoCiclo: 0.10, rendimiento: 0.25, rendUnidad: "kg", precio: 3.00, luna: "creciente", mesesPrecioAlto: [11,12,1,2],
    tip: "Muy resistente a heladas y sequía. Grano de alto valor y buena demanda.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Surcos a 60 cm.",
      "Riego: Resiste sequía. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 6 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "chocho", nombre: "Chocho", emoji: "🫘", cat: "grano", unidad: "m2", modelo: "ciclo",
    altMin: 2500, altMax: 3600, espacios: ["parcela"], mesesSiembra: [12,1,2,3],
    diasProduccion: 240, tipo: "Siembra directa", distancia: "Surcos a 60 cm", riego: "Resiste sequía",
    inversion: 0.40, gastoCiclo: 0.10, rendimiento: 0.2, rendUnidad: "kg", precio: 2.50, luna: "creciente", mesesPrecioAlto: [3,4,5,6],
    tip: "Precio alto y estable. Mejora el suelo: ideal para rotar después de papa.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Surcos a 60 cm.",
      "Riego: Resiste sequía. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 8 meses. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },

  // ------------------------- HIERBAS -------------------------
  { id: "cilantro", nombre: "Cilantro", emoji: "🌿", cat: "hierba", unidad: "m2", modelo: "ciclo",
    altMin: 0, altMax: 3000, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 45, tipo: "Siembra directa", distancia: "Al voleo o hileras a 15 cm", riego: "Ligero, diario en maceta",
    inversion: 0.50, gastoCiclo: 0.10, rendimiento: 12, rendUnidad: "atados", precio: 0.25, luna: "menguante",
    tip: "Listo en un mes y medio. Se vende fácil en atados en cualquier feria.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Al voleo o hileras a 15 cm.",
      "Riego: Ligero, diario en maceta. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Cosecha lista en 45 días. Guarda semilla o esquejes de tus mejores plantas para la próxima siembra."
    ] },
  { id: "hierbabuena", nombre: "Hierbabuena / menta", emoji: "🌿", cat: "hierba", unidad: "m2", modelo: "anual",
    altMin: 0, altMax: 3200, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 60, tipo: "Esquejes o matas", distancia: "20 × 20 cm", riego: "Frecuente",
    inversion: 0.60, gastoCiclo: 0.20, rendimiento: 20, rendUnidad: "atados", precio: 0.25, luna: "menguante", vida: "Produce por años, se corta y rebrota",
    tip: "Se siembra una vez y produce por años. Cuidado: se expande sola por todo el huerto.",
    pasos: [
      "Consigue esquejes o matas sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 20 × 20 cm.",
      "Riego: Frecuente. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 2 meses; luego sigue produciendo cada año. Produce por años, se corta y rebrota."
    ] },
  { id: "manzanilla", nombre: "Manzanilla", emoji: "🌼", cat: "hierba", unidad: "m2", modelo: "anual",
    altMin: 2000, altMax: 3400, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Siembra directa", distancia: "Al voleo", riego: "Moderado",
    inversion: 0.50, gastoCiclo: 0.15, rendimiento: 15, rendUnidad: "atados", precio: 0.30, luna: "menguante", vida: "Rebrota tras cada corte",
    tip: "Demanda constante para agua aromática. Atrae abejas y otros polinizadores.",
    pasos: [
      "Consigue semilla de buena calidad (certificada o guardada de tu mejor cosecha) y siembra directo en el sitio definitivo.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: Al voleo.",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 meses; luego sigue produciendo cada año. Rebrota tras cada corte."
    ] },
  { id: "oregano", nombre: "Orégano", emoji: "🌿", cat: "hierba", unidad: "m2", modelo: "anual",
    altMin: 1000, altMax: 3000, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Esquejes o matas", distancia: "25 × 25 cm", riego: "Poco: prefiere seco",
    inversion: 0.80, gastoCiclo: 0.15, rendimiento: 10, rendUnidad: "atados", precio: 0.50, luna: "menguante", vida: "Produce por 3-4 años",
    tip: "Seco vale aún más. Una jardinera en el balcón abastece a la familia todo el año.",
    pasos: [
      "Consigue esquejes o matas sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Afloja la tierra unos 20-30 cm de profundidad, saca piedras y raíces, y mezcla abono orgánico (compost o humus) antes de sembrar.",
      "Siembra respetando la distancia: 25 × 25 cm.",
      "Riego: Poco: prefiere seco. Para mejor resultado según la tradición andina, hazlo en menguante. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 meses; luego sigue produciendo cada año. Produce por 3-4 años."
    ] },

  // ------------------------- FRUTALES -------------------------
  { id: "fresa", nombre: "Fresa", emoji: "🍓", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 1800, altMax: 3000, espacios: ["maceta","huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 90, tipo: "Plántulas o estolones", distancia: "30 × 30 cm", riego: "Frecuente, goteo ideal",
    inversion: 0.35, gastoCiclo: 0.15, rendimiento: 0.8, rendUnidad: "kg", precio: 2.50, luna: "creciente", vida: "Produce bien por 2-3 años",
    tip: "Buen precio todo el año. Los hijos (estolones) te dan plantas gratis para ampliar.",
    pasos: [
      "Consigue plántulas o estolones sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Prepara un hueco pequeño (unos 20 × 20 cm) con tierra suelta mezclada con abono orgánico; al ser una planta chica no necesita un hoyo grande.",
      "Siembra respetando la distancia: 30 × 30 cm.",
      "Riego: Frecuente, goteo ideal. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 meses; luego sigue produciendo cada año. Produce bien por 2-3 años."
    ] },
  { id: "mora", nombre: "Mora de castilla", emoji: "🫐", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 1800, altMax: 3200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 240, tipo: "Plantas o acodos", distancia: "2 × 2 m, con espaldera", riego: "Regular",
    inversion: 1.50, gastoCiclo: 0.50, rendimiento: 4, rendUnidad: "kg", precio: 1.80, luna: "creciente", vida: "Produce por 8-10 años",
    tip: "Cosecha semanal una vez establecida: ingreso constante para la sierra.",
    pasos: [
      "Consigue plantas o acodos sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 2 × 2 m, con espaldera.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 8 meses; luego sigue produciendo cada año. Produce por 8-10 años."
    ] },
  { id: "uvilla", nombre: "Uvilla", emoji: "🟡", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 2200, altMax: 3200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 240, tipo: "Plántulas", distancia: "1,5 × 1,5 m", riego: "Moderado",
    inversion: 0.80, gastoCiclo: 0.30, rendimiento: 2.5, rendUnidad: "kg", precio: 2.00, luna: "creciente", vida: "Produce por 2-3 años",
    tip: "Fruta andina con demanda creciente y buen precio de exportación.",
    pasos: [
      "Compra plántulas sanas en un vivero cercano, o siembra la semilla en semillero y trasplanta cuando tengan 15-20 cm.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 1,5 × 1,5 m.",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 8 meses; luego sigue produciendo cada año. Produce por 2-3 años."
    ] },
  { id: "tomate-arbol", nombre: "Tomate de árbol", emoji: "🍅", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 1500, altMax: 2800, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 540, tipo: "Plántulas injertas", distancia: "2 × 2 m", riego: "Regular",
    inversion: 2.00, gastoCiclo: 0.60, rendimiento: 15, rendUnidad: "kg", precio: 0.90, luna: "creciente", vida: "Produce por 4-5 años",
    tip: "A los 18 meses empieza a producir cada semana. Muy rentable en poco espacio.",
    pasos: [
      "Compra plantas injertas en un vivero de confianza: garantizan que produzcan antes y de mejor calidad que sembrar de semilla.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 2 × 2 m.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 1 años y medio; luego sigue produciendo cada año. Produce por 4-5 años."
    ] },
  { id: "aguacate", nombre: "Aguacate", emoji: "🥑", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 1400, altMax: 2500, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 1100, tipo: "Planta injerta (fuerte o hass)", distancia: "6 × 6 m", riego: "Moderado, buen drenaje",
    inversion: 6.00, gastoCiclo: 1.50, rendimiento: 60, rendUnidad: "kg", precio: 1.20, luna: "creciente", vida: "Produce por 30+ años",
    tip: "Inversión a futuro: tarda 3 años pero luego un solo árbol da ingresos por décadas.",
    pasos: [
      "Compra plantas injertas en un vivero de confianza: garantizan que produzcan antes y de mejor calidad que sembrar de semilla.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 6 × 6 m.",
      "Riego: Moderado, buen drenaje. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 años; luego sigue produciendo cada año. Produce por 30+ años."
    ] },
  { id: "limon", nombre: "Limón", emoji: "🍋", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 0, altMax: 2200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 1100, tipo: "Planta injerta", distancia: "5 × 5 m", riego: "Regular",
    inversion: 5.00, gastoCiclo: 1.20, rendimiento: 50, rendUnidad: "kg", precio: 0.80, luna: "creciente", mesesPrecioAlto: [7,8,9,10], vida: "Produce por 20+ años",
    tip: "Demanda todo el año. En época de escasez el precio se triplica.",
    pasos: [
      "Compra plantas injertas en un vivero de confianza: garantizan que produzcan antes y de mejor calidad que sembrar de semilla.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 5 × 5 m.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 años; luego sigue produciendo cada año. Produce por 20+ años."
    ] },
  { id: "naranja", nombre: "Naranja", emoji: "🍊", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 0, altMax: 1800, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 1300, tipo: "Planta injerta", distancia: "6 × 6 m", riego: "Moderado",
    inversion: 5.00, gastoCiclo: 1.20, rendimiento: 70, rendUnidad: "kg", precio: 0.35, luna: "creciente", vida: "Produce por 25+ años",
    tip: "Combínala con cultivos de ciclo corto entre los árboles mientras crecen.",
    pasos: [
      "Compra plantas injertas en un vivero de confianza: garantizan que produzcan antes y de mejor calidad que sembrar de semilla.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 6 × 6 m.",
      "Riego: Moderado. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 3 años y medio; luego sigue produciendo cada año. Produce por 25+ años."
    ] },
  { id: "papaya", nombre: "Papaya", emoji: "🧡", cat: "fruta", unidad: "arbol", modelo: "anual",
    altMin: 0, altMax: 1200, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 300, tipo: "Plántulas", distancia: "2,5 × 2,5 m", riego: "Regular",
    inversion: 2.00, gastoCiclo: 0.80, rendimiento: 35, rendUnidad: "kg", precio: 0.50, luna: "creciente", vida: "Produce por 2-3 años",
    tip: "Produce al año de sembrada, y cada semana. De lo más rentable en clima cálido.",
    pasos: [
      "Compra plántulas sanas en un vivero cercano, o siembra la semilla en semillero y trasplanta cuando tengan 15-20 cm.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 2,5 × 2,5 m.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 10 meses; luego sigue produciendo cada año. Produce por 2-3 años."
    ] },
  { id: "maracuya", nombre: "Maracuyá", emoji: "🟠", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 0, altMax: 1500, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,9,10,11,12],
    diasProduccion: 270, tipo: "Plántulas, con espaldera o cerca", riego: "Regular", distancia: "3 m entre plantas",
    inversion: 1.50, gastoCiclo: 0.50, rendimiento: 12, rendUnidad: "kg", precio: 0.90, luna: "creciente", vida: "Produce por 3-4 años",
    tip: "Puede crecer sobre una cerca existente: producción sin ocupar terreno.",
    pasos: [
      "Compra plántulas sanas en un vivero cercano, o siembra la semilla en semillero y trasplanta cuando tengan 15-20 cm.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 3 m entre plantas.",
      "Riego: Regular. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 9 meses; luego sigue produciendo cada año. Produce por 3-4 años."
    ] },
  { id: "platano", nombre: "Plátano / guineo", emoji: "🍌", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 0, altMax: 1200, espacios: ["parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 365, tipo: "Hijuelos (colinos)", distancia: "3 × 3 m", riego: "Abundante en verano",
    inversion: 3.00, gastoCiclo: 0.80, rendimiento: 30, rendUnidad: "kg", precio: 0.40, luna: "creciente", vida: "La mata se renueva sola con hijos",
    tip: "Cada mata da un racimo al año y deja hijos para seguir produciendo.",
    pasos: [
      "Consigue hijuelos (colinos) sanos de una planta madre productiva: es la forma más barata y rápida de empezar.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 3 × 3 m.",
      "Riego: Abundante en verano. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 1 año; luego sigue produciendo cada año. La mata se renueva sola con hijos."
    ] },
  { id: "cafe", nombre: "Café", emoji: "☕", cat: "fruta", unidad: "planta", modelo: "anual",
    altMin: 600, altMax: 2000, espacios: ["parcela"], mesesSiembra: [1,2,3,4,10,11,12],
    diasProduccion: 900, tipo: "Plántulas, con sombra parcial", distancia: "2 × 2 m", riego: "Aprovecha lluvias",
    inversion: 1.20, gastoCiclo: 0.40, rendimiento: 0.5, rendUnidad: "kg", precio: 4.00, luna: "creciente", mesesPrecioAlto: [12,1,2,3], vida: "Produce por 15-20 años",
    tip: "El café de altura bien secado se paga mucho mejor. Asóciate para vender en volumen.",
    pasos: [
      "Compra plántulas sanas en un vivero cercano, o siembra la semilla en semillero y trasplanta cuando tengan 15-20 cm.",
      "Haz un hoyo de al menos 40 × 40 × 40 cm, mezcla la tierra sacada con abono orgánico y déjala asentar unos días antes de sembrar o trasplantar.",
      "Siembra respetando la distancia: 2 × 2 m.",
      "Riego: Aprovecha lluvias. Para mejor resultado según la tradición andina, hazlo en creciente. Revisa la planta cada semana: hojas amarillas, manchas o insectos son señal de actuar rápido.",
      "Primera cosecha en 2 años y medio; luego sigue produciendo cada año. Produce por 15-20 años."
    ] },

  // ------------------------- ANIMALES -------------------------
  { id: "cuy", nombre: "Cuy (engorde)", emoji: "🐹", cat: "animal", unidad: "animal", modelo: "ciclo",
    altMin: 0, altMax: 3800, espacios: ["huerto","parcela"], mesesSiembra: [1,2,3,4,5,6,7,8,9,10,11,12],
    diasProduccion: 120, tipo: "Pozas o jaulas, 5-10 por poza", distancia: "0,2 m² por cuy", riego: "Alfalfa, hierba y balanceado",
    inversion: 6.00, gastoCiclo: 6.00, rendimiento: 1, rendUnidad: "cuyes", precio: 12.00, luna: null,
    tip: "Una hembra reproductora da 12-16 crías al año: empieza con 3 hembras y 1 macho.",
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
    inversion: 70.00, gastoCiclo: 90.00, rendimiento: 1, rendUnidad: "cerdos", precio: 220.00, luna: null,
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
    inversion: 70.00, gastoCiclo: 20.00, rendimiento: 1, rendUnidad: "ovejas", precio: 130.00, luna: null,
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
    inversion: 120.00, gastoCiclo: 12.00, rendimiento: 45, rendUnidad: "litros", precio: 1.00, luna: null, vida: "Produce leche 8-10 meses al año",
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
    inversion: 750.00, gastoCiclo: 60.00, rendimiento: 240, rendUnidad: "litros", precio: 0.48, luna: null, vida: "Produce 8-10 meses por parto",
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
    inversion: 140.00, gastoCiclo: 15.00, rendimiento: 18, rendUnidad: "kg de miel", precio: 8.00, luna: null, vida: "La colmena dura años bien manejada",
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
