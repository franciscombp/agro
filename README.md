# Agro

Aplicación móvil simple para apoyar a campesinos con pequeños cultivos en Ecuador.

## Objetivo
Crear una interfaz fácil de usar para personas con poca experiencia digital, enfocada en calcular inversiones, ingresos potenciales y riesgos agrícolas.

## Estructura
- `src/App.jsx`: lógica de entrada de datos, cálculo de inversión, riesgo y recomendaciones.
- `src/styles.css`: diseño minimalista y adaptado a móvil.
- `src/api.js`: ejemplo de conexión a APIs de clima y precio.
- `package.json`: dependencias de React y Vite.

## Características iniciales
- Perfil del productor: nombre, ubicación, área, altitud, presupuesto y calidad de suelo.
- Selección de cultivos y productos comunes en la sierra central.
- Estimación de inversión y de ingreso potencial según área y precio de mercado.
- Mensajes de riesgo climático y sugerencias de diversificación.
- Interfaz clara, botones grandes y etiquetas sencillas.

## Extensión y APIs públicas
- Clima: Open-Meteo, Meteomatics, WeatherAPI o la API pública de Ecuador si está disponible.
- Precios de mercado: buscar datos de canal de comercialización local o usar servicios de precios agrícolas.
- Futuro: análisis de productos lecheros, frutales y bosques según altitud y superficie.

## Cómo ejecutar
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Siguientes pasos
- Conectar clima real con geolocalización y pronóstico.
- Implementar cálculo de cultivos actuales y sugeridos según espacio disponible.
- Añadir opciones para ganado, lácteos, frutas y árboles.
- Mejorar accesibilidad para uso desde móviles básicos y de baja conectividad.
- Agregar sugerencias de cultivo específicas para Sierra Centro y decisiones de diversificación.
