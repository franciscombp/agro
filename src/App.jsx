import { useEffect, useMemo, useState } from 'react'
import { fetchMarketPrices, fetchWeatherForecast } from './api'
import { useNotifications, requestNotificationPermission } from './hooks/useNotifications'
import { useSwipeNavigation } from './hooks/useSwipeNavigation'

const productData = {
  maiz: {
    label: 'Maíz',
    type: 'Cultivo',
    price: 0.4,
    yieldPerHa: 2500,
    altitude: '1500‑2800 m',
    risk: 'Lluvias irregulares, plagas de roedor',
    unit: 'kg'
  },
  papas: {
    label: 'Papas',
    type: 'Cultivo',
    price: 0.5,
    yieldPerHa: 18000,
    altitude: '2500‑3200 m',
    risk: 'Heladas, hongos en hojas',
    unit: 'kg'
  },
  frijol: {
    label: 'Frijol',
    type: 'Cultivo',
    price: 1.2,
    yieldPerHa: 1200,
    altitude: '2400‑3000 m',
    risk: 'Sequía, roya',
    unit: 'kg'
  },
  cebada: {
    label: 'Cebada',
    type: 'Cultivo',
    price: 0.35,
    yieldPerHa: 3000,
    altitude: '2200‑2800 m',
    risk: 'Vientos fuertes, plagas',
    unit: 'kg'
  },
  leche: {
    label: 'Leche',
    type: 'Ganadería / Lácteos',
    price: 0.35,
    yieldPerHa: 18000,
    altitude: '2200‑3000 m',
    risk: 'Enfermedades, variación de precio',
    unit: 'litros'
  },
  manzana: {
    label: 'Manzana',
    type: 'Frutas / Árboles',
    price: 0.8,
    yieldPerHa: 6000,
    altitude: '2500‑3200 m',
    risk: 'Grandes cambios de temperatura, plagas',
    unit: 'kg'
  }
}

const productOptions = Object.entries(productData).map(([value, product]) => ({
  value,
  label: product.label,
  type: product.type
}))

const initialUser = {
  name: 'Juan',
  location: 'Sierra Centro, Ecuador',
  area: 0.5,
  altitude: 2800,
  currentCrop: 'papas',
  budget: 200,
  soilQuality: 'Medio',
  siembras: [],
  espacio: 'huerto'
}

function buildAdvice(crop, user) {
  const product = productData[crop]
  const base = product.type === 'Ganadería / Lácteos' ? 'Para ganadería y lácteos' : `Para ${product.label}`
  return `${base}, revise el riesgo: ${product.risk}. Altitud sugerida ${product.altitude}. Aproveche su parcela de ${user.area} ha y ajuste el manejo según presupuesto.`
}

function buildFutureSuggestions(user) {
  const suggestions = []
  if (user.altitude >= 2500) {
    suggestions.push('Papas', 'Manzana', 'Frijol')
  }
  if (user.altitude >= 2200 && user.altitude < 2500) {
    suggestions.push('Cebada', 'Leche')
  }
  if (user.area <= 0.5) {
    suggestions.push('Frutales de clima frío', 'Lácteos en pequeña escala')
  }
  if (user.soilQuality === 'Regular') {
    suggestions.push('Mejorar suelo con abonos orgánicos')
  }
  return [...new Set(suggestions)].slice(0, 3)
}

function App() {
  const [currentTab, setCurrentTab] = useState(0)
  const [user, setUser] = useState(initialUser)
  const [crop, setCrop] = useState(initialUser.currentCrop)
  const [marketPrice, setMarketPrice] = useState(productData[initialUser.currentCrop].price)
  const [forecastText, setForecastText] = useState('Datos climáticos aún no cargados para esta ubicación.')
  const [forecastData, setForecastData] = useState(null)
  const [advice, setAdvice] = useState(buildAdvice(initialUser.currentCrop, initialUser))
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(false)

  const tabs = ['Perfil', 'Cultivos', 'Pronóstico', 'Mis semillas']
  const tabCount = tabs.length

  useSwipeNavigation(
    () => setCurrentTab((prev) => (prev + 1) % tabCount),
    () => setCurrentTab((prev) => (prev - 1 + tabCount) % tabCount)
  )

  const investment = useMemo(() => {
    const basePerHa = crop === 'leche' ? 3200 : 2500
    return Math.round(user.area * basePerHa * 100) / 100
  }, [user.area, crop])

  const potentialIncome = useMemo(() => {
    const product = productData[crop]
    const price = marketPrice || product.price
    const volume = user.area * product.yieldPerHa
    return Math.round(volume * price)
  }, [crop, marketPrice, user.area])

  const futureRecommendations = useMemo(() => buildFutureSuggestions(user), [user])

  const handleUserChange = (field) => (event) => {
    const value = field === 'area' || field === 'altitude' || field === 'budget' ? Number(event.target.value) : event.target.value
    setUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleCropChange = async (event) => {
    const selected = event.target.value
    setCrop(selected)
    setAdvice(buildAdvice(selected, user))

    setLoadingPrice(true)
    try {
      const result = await fetchMarketPrices(selected)
      setMarketPrice(result.price ?? productData[selected].price)
    } catch (error) {
      setMarketPrice(productData[selected].price)
      setAdvice('No se pudieron cargar los precios de mercado. Use valores aproximados locales.')
    } finally {
      setLoadingPrice(false)
    }
  }

  const loadWeather = async () => {
    setLoadingWeather(true)
    try {
      const data = await fetchWeatherForecast({ latitude: -1.4500, longitude: -78.6167 })
      setForecastData(data)
      const tempMax = data.daily.temperature_2m_max[0]
      const rain = data.daily.precipitation_sum[0]
      setForecastText(`Pronóstico: máxima ${tempMax}°C, lluvia ${rain}mm. Ajuste siembra y riego según estas condiciones.`)
    } catch (error) {
      setForecastText('No se pudo obtener el pronóstico de clima. Verifique su conexión o use datos locales.')
    } finally {
      setLoadingWeather(false)
    }
  }

  useEffect(() => {
    loadWeather()
    requestNotificationPermission()
  }, [])

  useNotifications(user, forecastData)

  const product = productData[crop]

  return (
    <main>
      <header>
        <h1>AgroGuía</h1>
        <p>Una app simple para campesinos de la Sierra Centro de Ecuador: inversión, producción, clima y recomendaciones de cultivos y ganadería.</p>
      </header>

      <nav className="tabs">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`tab-btn ${currentTab === idx ? 'active' : ''}`}
            onClick={() => setCurrentTab(idx)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {currentTab === 0 && (
          <>
            <section className="card">
              <h2 className="section-title">Perfil del productor</h2>
              <div className="grid-2">
                <div className="input-group">
                  <label>Nombre</label>
                  <input value={user.name} onChange={handleUserChange('name')} placeholder="Tu nombre" />
                </div>
                <div className="input-group">
                  <label>Ubicación</label>
                  <input value={user.location} onChange={handleUserChange('location')} placeholder="Provincia, parroquia" />
                </div>
                <div className="input-group">
                  <label>Área cultivable (ha)</label>
                  <input type="number" step="0.1" value={user.area} onChange={handleUserChange('area')} />
                </div>
                <div className="input-group">
                  <label>Altitud (m)</label>
                  <input type="number" value={user.altitude} onChange={handleUserChange('altitude')} />
                </div>
                <div className="input-group">
                  <label>Presupuesto aproximado (USD)</label>
                  <input type="number" value={user.budget} onChange={handleUserChange('budget')} />
                </div>
                <div className="input-group">
                  <label>Calidad de suelo</label>
                  <select value={user.soilQuality} onChange={handleUserChange('soilQuality')}>
                    <option>Medio</option>
                    <option>Bueno</option>
                    <option>Regular</option>
                  </select>
                </div>
              </div>
            </section>
            <section className="card">
              <h2 className="section-title">Sugerencias futuras</h2>
              <p>Basado en tu superficie y altitud, estas opciones pueden funcionar bien en tu finca:</p>
              <div>
                {futureRecommendations.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </section>
          </>
        )}

        {currentTab === 1 && (
          <>
            <section className="card">
              <h2 className="section-title">Producto actual</h2>
              <div className="input-group">
                <label>Selecciona cultivo, ganadería o fruta</label>
                <select value={crop} onChange={handleCropChange}>
                  {productOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} — {option.type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-2">
                <div>
                  <strong>{product.label}</strong>
                  <p>{product.type}</p>
                </div>
                <div>
                  <strong>Altitud ideal</strong>
                  <p>{product.altitude}</p>
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <strong>Riesgo principal</strong>
                  <p>{product.risk}</p>
                </div>
                <div>
                  <strong>Precio referencia</strong>
                  <p>{loadingPrice ? 'Cargando…' : `USD ${marketPrice?.toFixed(2) || product.price}`}</p>
                </div>
              </div>
            </section>
            <section className="card">
              <h2 className="section-title">Resultados</h2>
              <div className="grid-2">
                <div>
                  <strong>Inversión estimada</strong>
                  <p>USD {investment.toLocaleString()}</p>
                </div>
                <div>
                  <strong>Ingreso potencial</strong>
                  <p>USD {potentialIncome.toLocaleString()}</p>
                </div>
              </div>
              <div className="input-group">
                <label>Precio de mercado estimado (USD / unidad)</label>
                <input type="number" step="0.01" value={marketPrice} onChange={(event) => setMarketPrice(Number(event.target.value))} />
              </div>
            </section>
            <section className="card">
              <h2 className="section-title">Riesgos y recomendaciones</h2>
              <p>{advice}</p>
              <div className="button-group">
                <button className="primary-btn" onClick={loadWeather} disabled={loadingWeather}>
                  {loadingWeather ? 'Actualizando clima…' : 'Actualizar pronóstico'}
                </button>
                <button className="secondary" onClick={() => setAdvice('Considere diversificar entre papas y frijol para reducir el riesgo climático. Revise los precios del mercado local antes de vender.')}>Diversificar</button>
              </div>
            </section>
          </>
        )}

        {currentTab === 2 && (
          <>
            <section className="card">
              <h2 className="section-title">Pronóstico y condiciones</h2>
              <p>{forecastText}</p>
              <div className="tag">Altitud: {user.altitude} m</div>
              <div className="tag">Suelo: {user.soilQuality}</div>
              <div className="tag status-good">Condición: estable</div>
            </section>
          </>
        )}

        {currentTab === 3 && (
          <>
            <section className="card">
              <h2 className="section-title">Mis semillas</h2>
              <p>Aquí puedes realizar seguimiento de tus cultivos plantados y recibir notificaciones sobre el riego, cosecha y mejores fechas para sembrar.</p>
              <p className="tag">Aún no has agregado cultivos para seguimiento</p>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default App
