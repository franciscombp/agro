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
| 5 | Caudalímetro de pulsos en la línea de riego | Cualquier medidor con salida de pulsos y un nodo como el anterior | Preparado en el receptor; la app todavía no lo usa para registrar riegos. |

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

## 6. En la app

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

- **El caudalímetro** llega al receptor y se ve en la app, pero no se convierte en
  eventos de riego. Hace falta decidir cómo se reparte un caudal entre sectores cuando
  una sola línea alimenta varios.
- **Sin alertas fuera de la app.** El aviso de «callado» o de «no llegas al turno» sólo
  se ve con la app abierta. Mandarlo por WhatsApp o Telegram es un paso natural del
  receptor, que ya tiene los datos.
- **Calibración de la sonda.** Las sondas capacitivas baratas leen distinto según el
  suelo. Los valores de capacidad de campo y marchitez se pueden cambiar en la app, pero
  lo bueno es calibrarlos una vez contra una muestra de suelo pesada en seco y en húmedo.
