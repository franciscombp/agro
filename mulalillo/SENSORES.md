# Sensores — de la caja al dato en la app

La app ya está lista para recibir sensores. Esta guía es para el día que llegue el
hardware: qué comprar, cómo montarlo y cómo conectarlo, en el orden en que se hace.

**Antes de comprar nada** se puede ver el circuito entero funcionando: en la app,
*Agua → Conectar sensores → Cargar datos de prueba* genera una semana de lecturas como
las de los aparatos reales, y se borra con un toque sin tocar nada anotado a mano.

## Cómo viaja un dato

```
sensor ──radio LoRa──▶ gateway ──internet──▶ The Things Network ──webhook──▶ receptor ──▶ app
(en el reservorio)    (en la casa)            (gratis)                       (Cloudflare)
```

- **Los sensores no hablan con la app.** La app es un sitio público y cualquier clave
  que se meta en ella queda a la vista. Hablan con el **receptor**, un servidor pequeño
  que está en `receptor/`, y la app sólo lee de ahí.
- **Dos tokens.** El de *escritura* va en The Things Network o Home Assistant, que son
  servidores. El de *lectura* va en el teléfono. Si se pierde un teléfono, quien lo
  tenga puede ver el nivel del reservorio, pero no inventar lecturas.

## 1. Qué comprar, por orden de lo que aporta

Los modelos son ejemplos de aparatos que el receptor ya sabe leer. Hay equivalentes de
otras marcas, y el receptor acepta cualquiera que mande los mismos campos.

> **Banda de radio.** En Ecuador se usa **AU915** (915–928 MHz). Confírmalo con el
> proveedor antes de comprar: un aparato de otra banda no se puede cambiar después.

| Prioridad | Qué | Ejemplo | Qué cambia en la app |
|---|---|---|---|
| 1 | **Gateway LoRaWAN** | Dragino LPS8, Milesight UG65 (con 4G si en la casa no hay Wi-Fi fiable) | Sin él no llega nada. Uno basta para toda la finca. |
| 2 | **Ultrasónico de nivel** en el reservorio | Dragino LDDS75, Milesight EM500-UDL | El volumen deja de ser una estimación: la curva, la autonomía y «¿llega al turno?» parten de un dato de hoy. |
| 3 | **Sonda de humedad** en el bloque de arándanos | Dragino LSE01 | La reserva del suelo pasa de *estimada* a *medida*. |
| 4 | **Pluviómetro** de balancín con nodo de pulsos | Un balancín conectado a un Dragino SN50v3 o similar | La lluvia de tu loma sustituye a la del modelo de Open-Meteo. |
| 5 | **Caudalímetro** en la línea de riego, a la salida del reservorio | Un medidor con salida de pulsos y un nodo como el anterior | El reservorio deja de restar lo que el modelo *cree* que se regó y resta lo que pasó por la tubería. Y la app compara lo regado con lo que pedían las plantas. Con él, el receptor detecta fugas. |

## 2. Montaje

### Ultrasónico del reservorio

- **Sobre agua quieta**, lejos de la entrada del agua: la turbulencia del llenado da
  lecturas que saltan.
- **Respeta la zona ciega**: estos sensores no ven lo que está a menos de 25–30 cm.
  Móntalo de forma que, con el reservorio lleno, el agua quede más lejos que eso.
- **Mide la altura de montaje**, del sensor al fondo, con cinta o con una vara. Es el
  dato que convierte «distancia al agua» en «agua que hay», y se pone en la app. Un error
  de 5 cm ahí se arrastra a todas las lecturas.
- Que no gotee condensación sobre el transductor: una visera pequeña basta.

### Sonda de suelo

- **En la zona de raíces**, a 15–25 cm para arándano, y **en el bulbo del gotero**, no
  entre hileras: ahí es donde la planta bebe.
- Suelo bien apretado alrededor, sin bolsas de aire: el aire lee como suelo seco.
- Si hay más de una sonda, la app usa **la más seca**. Para decidir si regar,
  equivocarse por el lado húmedo es dejar una planta sin agua.

### Pluviómetro

- En campo abierto, lejos de árboles y techos, nivelado.
- **Tiene que reportar periódicamente aunque no llueva** (un cero cada hora, por
  ejemplo). Un día sin ningún mensaje no se puede distinguir de un pluviómetro caído, y
  la app no lo cuenta como seco: lo ignora y usa la lluvia del modelo. Esto es a
  propósito, para no inventar una sequía.

### Caudalímetro

- **A la salida del reservorio**, antes de que la línea se reparta: así mide todo lo
  que sale para riego y nada más.
- En la app dile **qué manda**: casi todos los contadores de pulsos mandan un *total
  que sólo crece*, y lo regado es la diferencia entre lecturas. Si no lo sabes, mira
  dos lecturas seguidas con el riego cerrado: si repiten el número, es un total.
  Confundirlo cuenta mil veces el mismo litro.
- Si manda **pulsos**, hacen falta los **litros por pulso** (en la placa: 1, 10 o 100
  son lo habitual). Sin ese dato la app no convierte nada, en vez de inventar.
- Marca qué sectores alimenta la línea. El volumen **no** se reparte entre ellos: el
  medidor mide el total, y cualquier reparto sería un supuesto.

### Gateway

- En la casa, en alto, con la antena por fuera si se puede y **con vista al
  reservorio**. A esta distancia sobra alcance, pero una loma de por medio lo complica.
- Necesita corriente y salida a internet: Wi-Fi, cable o un modelo con 4G.

## 3. El receptor

Es `receptor/worker.js`, un Cloudflare Worker. El plan gratuito alcanza de sobra para
unos pocos sensores. Desde la raíz del repositorio:

```bash
cd mulalillo/receptor
npx wrangler login
npx wrangler kv namespace create LECTURAS      # copia el id en wrangler.toml
npx wrangler secret put TOKEN_ESCRITURA         # inventa uno largo; va en TTN
npx wrangler secret put TOKEN_LECTURA           # otro distinto; va en la app
npx wrangler deploy                             # te da la dirección *.workers.dev
```

Los tokens **nunca** se escriben en `wrangler.toml` ni en ningún archivo del repositorio:
el repositorio es público.

### Probarlo en tu máquina, sin cuenta

```bash
node mulalillo/receptor/local.mjs        # receptor en http://localhost:8787
node mulalillo/receptor/simular.mjs      # una semana de mensajes TTN y HA
```

Usa el mismo `worker.js` que se despliega; sólo cambia dónde guarda las lecturas. En la
app: *Sensores*, dirección `http://localhost:8787` y token `lectura-local`.

### Qué entiende

`POST /ingesta` reconoce el formato por su forma:

- **The Things Network v3**, el mensaje de subida (uplink) con `decoded_payload`.
- **Home Assistant**, el estado de una entidad con su `device_class`.
- **JSON propio**, para un ESP32 casero o un script:
  `{ "dispositivo": "tanque-casa", "tipo": "nivel", "valor": 1.2 }`.

Los nombres de campo de cada fabricante y sus unidades están en `normaliza.js`. Si un
aparato manda un campo que no está, se añade ahí una línea, y el receptor y la app lo
leen igual.

## 4. The Things Network

1. Crea una cuenta en The Things Network (consola de la región **nam1** o **au1**; la
   que esté más cerca y acepte AU915).
2. **Registra el gateway** con su EUI (viene en la etiqueta).
3. Crea una **aplicación**, por ejemplo `finca-mulalillo`, y registra cada sensor
   eligiéndolo del **repositorio de dispositivos**. Así viene con su formateador de
   carga útil, que es el que produce `decoded_payload`.
4. En la aplicación: *Integraciones → Webhooks → Añadir → Personalizado*:
   - URL base: la del receptor, `https://mulalillo-receptor.….workers.dev`
   - *Uplink message*: activado, ruta `/ingesta`
   - Cabecera adicional: `Authorization` = `Bearer TU_TOKEN_ESCRITURA`
5. Cuando el sensor mande su primer mensaje, la respuesta del webhook dice cuántas
   lecturas guardó (`{"guardadas": 2, …}`). Si dice 0, el formateador no está
   activo o el aparato usa nombres de campo que todavía no están en `normaliza.js`.

## 5. Home Assistant (opcional)

Si en la casa hay Home Assistant, puede mandar al receptor cualquier entidad: un
pluviómetro Zigbee, un sensor Matter o lo que sea.

```yaml
# configuration.yaml
rest_command:
  finca_lectura:
    url: https://mulalillo-receptor.….workers.dev/ingesta
    method: POST
    headers:
      authorization: !secret finca_token_escritura
      content-type: application/json
    payload: >
      {"entity_id": "{{ entity_id }}", "state": "{{ states(entity_id) }}",
       "attributes": {"device_class": "{{ state_attr(entity_id, 'device_class') }}",
                      "unit_of_measurement": "{{ state_attr(entity_id, 'unit_of_measurement') }}"}}

# automations.yaml — cada hora, aunque no haya cambiado (el latido)
- alias: Finca → receptor
  trigger: [{ platform: time_pattern, minutes: 0 }]
  action:
    - service: rest_command.finca_lectura
      data: { entity_id: sensor.pluviometro_finca }
```

Para un pluviómetro en Home Assistant hace falta que la entidad sea **la lluvia del
intervalo**, no el acumulado del día: si manda el acumulado cada hora, la app lo suma
veinticuatro veces. Una plantilla que reste la lectura anterior lo resuelve.

## 6. Avisos por Telegram

La app avisa de todo, pero sólo con la app abierta. El receptor revisa las lecturas
cada 30 minutos y, si algo está mal, manda un mensaje. Telegram y no WhatsApp porque su
API de bots es gratis y se configura en cinco minutos; la de WhatsApp Business exige
verificar una empresa con Meta, plantillas aprobadas y pago por conversación.

1. En Telegram, habla con **@BotFather**, `/newbot`, y guarda el token que te da.
2. Escríbele cualquier cosa a tu bot (o mételo en un grupo con quien esté en la finca).
3. Para saber el id del chat, abre `https://api.telegram.org/bot<TOKEN>/getUpdates`:
   es el número en `"chat":{"id": …}`.
4. Configura el receptor:
   ```bash
   npx wrangler secret put TELEGRAM_TOKEN
   ```
   y en `wrangler.toml`, en `[vars]`: `TELEGRAM_CHAT`, `RESERVORIO_DISPOSITIVO` y
   `RESERVORIO_MONTAJE_M` (los mismos que pusiste en la app) y, si hay caudalímetro,
   `CAUDAL_DISPOSITIVO`. Luego `npx wrangler deploy`.
5. Prueba que llega:
   ```bash
   curl -X POST -H "Authorization: Bearer TU_TOKEN_ESCRITURA" https://…workers.dev/alertas/probar
   ```

Qué avisa:

| Aviso | Cuándo |
|---|---|
| 🔕 Callado | Un aparato lleva más de 6 h sin mandar nada |
| 🪫 Batería baja | Menos de 3,3 V, o del 20 % |
| 💧 Nivel bajo | El reservorio por debajo del 25 % (`ALERTA_NIVEL_PCT`) |
| 🚨 Pérdida sin explicar | El reservorio baja más de 1,5 m³ en unas horas (`ALERTA_PERDIDA_M3`) y no es riego |

La **pérdida sin explicar** es la que más vale. Con caudalímetro, es lo que bajó el
reservorio *menos* lo que pasó por la línea de riego: si sobra, se va agua por otro
lado —una fuga, una llave abierta o alguien sacándola—. Sin caudalímetro no hay forma de
separar riego de pérdida, así que no se avisa si la bajada toca el horario de riego
(`HORARIO_RIEGO`, por defecto de 6 a 9).

Cada aviso se manda **una vez** al empezar y otra al resolverse. Uno que se repitiera
cada media hora dejaría de leerse a la tercera, y entonces el importante tampoco.

Lo que el receptor **no** puede avisar es «no llegas al turno»: eso depende de las
plantas, los sectores y el clima, que viven en el teléfono. Para eso sigue la app y el
plan que se comparte por WhatsApp.

## 7. En la app

*Agua → Conectar sensores* (o *Ajustes → Sensores*):

1. Pega la **dirección del receptor** y el **token de lectura**, y pulsa **Probar**.
2. **Guardar**. La app lee lo que haya y vuelve a leer cada 15 minutos mientras esté
   abierta.
3. Cada aparato aparece solo en cuanto manda su primer mensaje, aunque nadie lo haya
   configurado, marcado **sin asignar**. Tócalo y di para qué está: reservorio, suelo o
   pluviómetro. Al ultrasónico ponle la **altura de montaje**.

A partir de ahí:

- El reservorio se ancla en el sensor: *«medido por el sensor hace 20 min»*. Si el mismo
  día hay también una medición a mano, **gana la de mano**, porque quien va con la regla
  teniendo un sensor suele ir porque no se fía de él.
- La reserva del suelo dice *«medida por la sonda»* mientras la lectura tenga menos de
  36 horas, y vuelve a *«estimada»* si la sonda se calla.
- Un aparato que lleva **más de 6 horas sin mandar nada** sale arriba de la lista,
  marcado **callado**: una pila, una antena o el gateway. Conviene saberlo antes de que
  el modelo pase días calculando con un nivel viejo creyendo que es fresco.
- Por debajo de 3,3 V (o del 20 % si el aparato informa en porcentaje), **batería baja**.

## Qué no está hecho todavía

- **«No llegas al turno» por Telegram.** Necesitaría que el teléfono mande su cálculo
  al receptor, y eso exige darle el token de *escritura*, que es justo lo que el diseño
  evita. Una salida es un tercer token sólo para estados calculados.
- **Calibración de la sonda.** Las sondas capacitivas baratas leen distinto según el
  suelo. Los valores de capacidad de campo y marchitez se cambian en la app, pero lo
  bueno es calibrarlos una vez contra una muestra de suelo pesada en seco y en húmedo.
- **Riego por sector con varios caudalímetros.** Hoy un caudalímetro mide una línea
  entera. Con uno por sector se podría comparar regado y pedido sector a sector; el
  modelo ya calcula lo pedido por sector, falta atarlo.
