export const CULTIVOS = [
  {
    id: 'maiz',
    emoji: '🌽',
    nombre: 'Maíz',
    cat: 'cultivo',
    altMin: 1500,
    altMax: 2800,
    mesesSiembra: [3, 4, 5, 6],
    diasProduccion: 120,
    riego: 'frecuente',
    espacios: ['huerto', 'chacra']
  },
  {
    id: 'papa',
    emoji: '🥔',
    nombre: 'Papa',
    cat: 'cultivo',
    altMin: 2500,
    altMax: 3200,
    mesesSiembra: [3, 4, 8, 9],
    diasProduccion: 90,
    riego: 'moderado',
    espacios: ['huerto', 'chacra']
  },
  {
    id: 'frijol',
    emoji: '🫘',
    nombre: 'Frijol',
    cat: 'cultivo',
    altMin: 2400,
    altMax: 3000,
    mesesSiembra: [3, 4, 5, 6],
    diasProduccion: 110,
    riego: 'moderado',
    espacios: ['huerto', 'chacra']
  },
  {
    id: 'cebada',
    emoji: '🌾',
    nombre: 'Cebada',
    cat: 'cultivo',
    altMin: 2200,
    altMax: 2800,
    mesesSiembra: [3, 4, 8, 9],
    diasProduccion: 140,
    riego: 'bajo',
    espacios: ['chacra']
  },
  {
    id: 'tomate',
    emoji: '🍅',
    nombre: 'Tomate',
    cat: 'cultivo',
    altMin: 1800,
    altMax: 2400,
    mesesSiembra: [2, 3, 4, 5],
    diasProduccion: 75,
    riego: 'frecuente',
    espacios: ['huerto']
  },
  {
    id: 'lechuga',
    emoji: '🥬',
    nombre: 'Lechuga',
    cat: 'cultivo',
    altMin: 1200,
    altMax: 3000,
    mesesSiembra: [2, 3, 4, 5, 8, 9],
    diasProduccion: 45,
    riego: 'frecuente',
    espacios: ['huerto']
  },
  {
    id: 'zanahoria',
    emoji: '🥕',
    nombre: 'Zanahoria',
    cat: 'cultivo',
    altMin: 2000,
    altMax: 3000,
    mesesSiembra: [2, 3, 4, 8, 9],
    diasProduccion: 70,
    riego: 'moderado',
    espacios: ['huerto']
  },
  {
    id: 'cebolla',
    emoji: '🧅',
    nombre: 'Cebolla',
    cat: 'cultivo',
    altMin: 2200,
    altMax: 3000,
    mesesSiembra: [2, 3, 8, 9],
    diasProduccion: 120,
    riego: 'bajo',
    espacios: ['huerto']
  },
  {
    id: 'manzana',
    emoji: '🍎',
    nombre: 'Manzana',
    cat: 'cultivo',
    altMin: 2500,
    altMax: 3200,
    mesesSiembra: [1, 2, 11, 12],
    diasProduccion: 180,
    riego: 'moderado',
    espacios: ['chacra']
  },
  {
    id: 'mora',
    emoji: '🫐',
    nombre: 'Mora',
    cat: 'cultivo',
    altMin: 1800,
    altMax: 2800,
    mesesSiembra: [2, 3, 4, 5],
    diasProduccion: 150,
    riego: 'frecuente',
    espacios: ['huerto']
  },
  {
    id: 'leche',
    emoji: '🥛',
    nombre: 'Leche',
    cat: 'animal',
    altMin: 2200,
    altMax: 3000,
    mesesSiembra: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    diasProduccion: 365,
    riego: null,
    espacios: ['chacra']
  }
];

export const ESPACIOS = ['huerto', 'chacra'];

export const CATEGORIAS = {
  cultivo: 'Cultivos',
  animal: 'Ganadería'
};

export const CONSEJO_LUNA = {
  nueva: 'Descanso: prepara la tierra, abona y haz compost. Evita sembrar.',
  creciente: 'Siembra lo que da fruto sobre la tierra: tomate, maíz, fréjol, pimiento.',
  llena: 'Trasplanta y cosecha frutos. Evita podar.',
  menguante: 'Siembra raíces y hojas: papa, zanahoria, cebolla, lechuga. Buen momento para podar.'
};
