// Mi Huerto — estado hídrico y fase de El Niño.
//
// El almanaque recomendaba por fecha y altitud nada más: en un año seco decía
// "siembra maíz en octubre" igual que en un año normal. Este archivo aporta lo
// que faltaba, y lo hace con MEDICIONES antes que con supuestos:
//
//   1. Cuánto ha llovido de verdad en los últimos 90 días en ESE punto.
//   2. Cuánto llueve normalmente en esas mismas fechas (mediana de 10 años).
//   3. El balance entre la lluvia y lo que la atmósfera evapora (ET0).
//
// La fase de El Niño no se adivina ni se inventa una fuente: la declara quien
// usa la app, y sirve para anticipar los meses que vienen. Lo medido manda
// sobre el pronóstico climático.
"use strict";

/* ── Demanda de agua de cada cultivo ────────────────────────────────────────
   El catálogo trae `riego` en texto libre ("Frecuente, suelo húmedo",
   "Resiste sequía"). En vez de añadir un campo nuevo a 52 cultivos y que las
   dos fuentes se desvíen, se clasifica el texto que ya existe. */
const NIVELES_AGUA = [
  { nivel: 0, etiqueta: 'resiste sequía', patrones: [/resiste sequ/i, /prefiere seco/i, /^poco/i] },
  { nivel: 1, etiqueta: 'poca agua', patrones: [/ligero/i, /aprovecha lluvias/i, /moderado/i] },
  { nivel: 2, etiqueta: 'agua regular', patrones: [/regular/i, /constante/i] },
  { nivel: 3, etiqueta: 'mucha agua', patrones: [/frecuente/i, /abundante/i, /h[úu]meda/i, /goteo/i] }
];

/* En qué orden se prueban, que no es el orden de los niveles. Las frases del
   catálogo mezclan pistas ("Frecuente y ligero", "Aprovecha lluvias; necesita
   humedad constante") y la que manda es la exigente: un rábano de riego
   frecuente no aguanta un año seco porque el riego sea ligero. Después va la
   resistencia declarada ("Poco: resiste sequía"), y sólo al final los
   matices. */
const PRECEDENCIA = [3, 0, 1, 2];

/** Nivel de 0 (aguanta seco) a 3 (no perdona un día sin agua). */
function demandaAgua(cultivo) {
  const t = String(cultivo.riego || '');
  // Los animales no entran en este análisis: su "riego" describe la comida.
  if (cultivo.cat === 'animal') return null;
  for (const nivel of PRECEDENCIA) {
    const n = NIVELES_AGUA[nivel];
    if (n.patrones.some(p => p.test(t))) return n;
  }
  return NIVELES_AGUA[2];   // sin pista clara, se asume agua regular
}

/* ── Región climática ───────────────────────────────────────────────────────
   El mismo fenómeno hace cosas opuestas según dónde estés, y esto es lo que la
   app no puede simplificar: en la costa El Niño trae lluvias e inundaciones;
   en la sierra tiende a lo contrario, temporada de lluvias irregular y más
   calor. Recomendar igual en Guayaquil y en Salcedo sería el mismo error que
   recomendar sólo por fecha. */
function region(altitud) {
  if (altitud == null) return 'desconocida';
  if (altitud >= 1800) return 'sierra';
  if (altitud >= 800) return 'subtropical';
  return 'costa';
}

/** Qué suele traer cada fase en cada región. Patrón general, no pronóstico. */
const FASES = {
  neutral: {
    nombre: 'Neutral',
    sierra: null, costa: null, subtropical: null, desconocida: null
  },
  nino: {
    nombre: 'El Niño',
    sierra: {
      señal: 'seco',
      dice: 'En la sierra El Niño suele traer una temporada de lluvias tardía e irregular y temperaturas más altas. Llueve menos y más concentrado: chubascos fuertes entre semanas secas.',
      ojo: 'Menos heladas por las noches más cubiertas, pero más granizadas y más estrés de calor al mediodía.'
    },
    costa: {
      señal: 'húmedo',
      dice: 'En la costa El Niño trae lo contrario: lluvias muy por encima de lo normal, con riesgo de inundación y de anegamiento de raíces.',
      ojo: 'El problema no será el agua sino el drenaje y los hongos.'
    },
    subtropical: {
      señal: 'mixto',
      dice: 'En el subtrópico El Niño se siente de forma intermedia y desigual según la vertiente.',
      ojo: 'Conviene fiarse más de lo que midan tus últimos 90 días que del patrón general.'
    }
  },
  nina: {
    nombre: 'La Niña',
    sierra: {
      señal: 'húmedo',
      dice: 'En la sierra La Niña suele adelantar y reforzar las lluvias, con más días nublados y noches más frías.',
      ojo: 'Sube el riesgo de heladas en las madrugadas despejadas y de hongos por humedad sostenida.'
    },
    costa: {
      señal: 'seco',
      dice: 'En la costa La Niña tiende a dejar la temporada de lluvias corta y débil.',
      ojo: 'El agua de riego será el cuello de botella.'
    },
    subtropical: {
      señal: 'mixto',
      dice: 'En el subtrópico el efecto es intermedio y poco previsible.',
      ojo: 'Manda lo medido.'
    }
  }
};

/* ── Estado hídrico medido ──────────────────────────────────────────────────
   Dos números distintos, y los dos importan:

   · El déficit frente a lo normal dice si este año viene seco PARA AQUÍ. Sin
     esa comparación, "llovió 40 mm" no significa nada: es abundante en un
     páramo seco y una catástrofe en el subtrópico.

   · El balance lluvia − ET0 dice si el suelo está perdiendo agua ahora mismo,
     que es lo que decide si una siembra prende. Un sitio puede estar en su
     lluvia normal y aun así en balance negativo porque hace mucho calor. */
function estadoHidrico({ lluvia90, normal90, et090 }) {
  if (lluvia90 == null) return { conocido: false };

  const balance = et090 != null ? lluvia90 - et090 : null;
  const razon = normal90 > 0 ? lluvia90 / normal90 : null;

  let nivel, etiqueta, color;
  if (razon == null) {
    nivel = 'sin-referencia'; etiqueta = 'sin referencia histórica'; color = 'neutro';
  } else if (razon < 0.5) {
    nivel = 'sequia'; etiqueta = 'sequía'; color = 'rojo';
  } else if (razon < 0.75) {
    nivel = 'deficit'; etiqueta = 'déficit de lluvia'; color = 'ambar';
  } else if (razon > 1.4) {
    nivel = 'exceso'; etiqueta = 'exceso de lluvia'; color = 'azul';
  } else {
    nivel = 'normal'; etiqueta = 'lluvia dentro de lo normal'; color = 'verde';
  }

  return {
    conocido: true,
    lluvia90: Math.round(lluvia90),
    normal90: normal90 != null ? Math.round(normal90) : null,
    et090: et090 != null ? Math.round(et090) : null,
    balance: balance != null ? Math.round(balance) : null,
    razon,
    desvio: razon != null ? Math.round((razon - 1) * 100) : null,
    nivel, etiqueta, color
  };
}

/* ── El consejo, que es lo único que le sirve a quien siembra ──────────────
   Devuelve para un cultivo: si conviene sembrarlo ahora, y por qué.

   Estas frases se repiten una vez por tarjeta, así que dicen SÓLO lo propio
   del cultivo. Lo general —cuánto llovió, qué trae la fase en esta región— va
   una sola vez en la tarjeta de estado del agua; repetirlo en cada cultivo
   convertía la lista en catorce párrafos idénticos que nadie lee. */
function consejoCultivo(cultivo, { estado, fase, altitud, tieneRiego }) {
  const agua = demandaAgua(cultivo);
  if (!agua) return null;

  const seco = estado.conocido && (estado.nivel === 'sequia' || estado.nivel === 'deficit');
  const exceso = estado.conocido && estado.nivel === 'exceso';
  const patron = FASES[fase]?.[region(altitud)] || null;

  // Con riego, un déficit de lluvia deja de decidir la siembra: pasa a ser un
  // problema de cuánta agua vas a gastar, no de si la planta sobrevive.
  if (seco && tieneRiego && agua.nivel >= 2) {
    return {
      tono: 'atencion',
      titulo: 'Se puede, pero vas a regar más',
      texto: `Pide ${agua.etiqueta}: con riego sale, pero cuenta con gastar más de lo habitual ` +
             `durante los ${cultivo.diasProduccion} días del ciclo.`
    };
  }

  if (seco && !tieneRiego && agua.nivel >= 2) {
    return {
      tono: estado.nivel === 'sequia' ? 'malo' : 'atencion',
      titulo: estado.nivel === 'sequia' ? 'Riesgoso sin riego' : 'Arriesgado sin riego',
      texto: `Pide ${agua.etiqueta} y no tienes riego: con ${estado.lluvia90} mm en 90 días ` +
             `es probable perder la siembra. Espera las lluvias o siembra algo que aguante seco.`
    };
  }

  if (seco && agua.nivel <= 1) {
    return {
      tono: 'bueno',
      titulo: 'Buena opción para año seco',
      texto: `Aguanta con ${agua.etiqueta}: el déficit de estas fechas lo afecta poco.`
    };
  }

  if (exceso && agua.nivel <= 1) {
    return {
      tono: 'atencion',
      titulo: 'Ojo con el encharcamiento',
      texto: `Prefiere seco y viene lloviendo de más: siémbralo en camellón o en la parte ` +
             `con mejor drenaje.`
    };
  }

  if (patron && patron.señal === 'seco' && agua.nivel >= 2 && !seco) {
    return {
      tono: 'atencion',
      titulo: `Lo que viene con ${FASES[fase].nombre}`,
      texto: `Pide ${agua.etiqueta} y tarda ${cultivo.diasProduccion} días: el ciclo termina ` +
             `ya metido en lo que ${FASES[fase].nombre} suele traer aquí. Asegura el agua del ` +
             `final, no sólo la de la siembra.`
    };
  }

  return null;
}

/**
 * Ordena el almanaque por lo que conviene ahora: primero lo que va bien con el
 * estado del agua. Sin sequía ni exceso, no toca el orden.
 */
function ordenaPorAgua(lista, contexto) {
  const { estado } = contexto;
  if (!estado.conocido || estado.nivel === 'normal' || estado.nivel === 'sin-referencia') return lista;
  const seco = estado.nivel === 'sequia' || estado.nivel === 'deficit';

  return [...lista].sort((a, b) => {
    const na = demandaAgua(a)?.nivel ?? 2;
    const nb = demandaAgua(b)?.nivel ?? 2;
    return seco ? na - nb : nb - na;
  });
}

/** Mediana, que resiste el año excepcional mejor que el promedio. */
function mediana(xs) {
  const v = xs.filter(x => typeof x === 'number' && !Number.isNaN(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

/** Suma tolerante a huecos en la serie. */
function suma(xs) {
  return (xs || []).reduce((t, x) => t + (typeof x === 'number' ? x : 0), 0);
}

window.CLIMA = {
  FASES, demandaAgua, region, estadoHidrico, consejoCultivo, ordenaPorAgua, mediana, suma
};
