const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast'

export async function fetchWeatherForecast({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: 'temperature_2m,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'America/Guayaquil'
  })

  const response = await fetch(`${OPEN_METEO_BASE}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('No se pudo obtener el pronóstico de clima')
  }

  return response.json()
}

export async function fetchMarketPrices(crop) {
  // Placeholder: reemplazar con una API real de precios agrícolas si está disponible
  const samplePrices = {
    maiz: 0.42,
    papas: 0.55,
    frijol: 1.15,
    cebada: 0.37,
    leche: 0.34,
    manzana: 0.82
  }

  return { crop, price: samplePrices[crop] ?? null }
}
