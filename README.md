# Pin Pun

Sitio y sistema de pedidos de la Pizzería Pin Pun. Tiene dos partes que se ejecutan por separado:

| Carpeta | Qué es | Puerto por defecto |
| --- | --- | --- |
| [Backend/](Backend/) | API REST con Express (patrón MVC) y base de datos SQLite | `3000` |
| [Frontend/](Frontend/) | Interfaz web con React + Vite | `5173` |

## Requisitos

- [Node.js](https://nodejs.org/) **22.13 o superior** (el backend usa el SQLite que trae Node, sin instalar nada más; Vite 8 pide 20.19 o superior). Se recomienda la última LTS.
- npm (viene con Node).

Para comprobar la versión instalada:

```bash
node -v
```

## Cómo iniciar el sistema

Hacen falta **dos terminales**: una para el backend y otra para el frontend. El backend tiene que estar levantado para que el sitio muestre locales y productos.

### 1. Backend

```bash
cd Backend
npm install
npm run dev
```

Debería aparecer `Servidor escuchando en http://localhost:3000`. Para probarlo, abrir <http://localhost:3000/api/productos> en el navegador.

### 2. Frontend

En otra terminal, desde la raíz del proyecto:

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

En Windows (PowerShell o CMD) el paso de copiar es `copy .env.example .env`.

Después abrir <http://localhost:5173>.

> `npm install` solo hace falta la primera vez (o cuando cambian las dependencias).

## Scripts

### Backend ([Backend/package.json](Backend/package.json))

| Comando | Qué hace |
| --- | --- |
| `npm start` | Levanta la API con `node src/server.js`. |
| `npm run dev` | Igual que `start`, pero reinicia el servidor solo cada vez que se guarda un archivo (`node --watch`). |
| `npm run db:reset` | Borra la base de datos para empezar de cero (con el servidor apagado). Al arrancar se crea una nueva con los datos iniciales. |

### Frontend ([Frontend/package.json](Frontend/package.json))

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Vite en <http://localhost:5173>, con recarga en caliente. |
| `npm run build` | Genera la versión de producción optimizada en `Frontend/dist/`. |
| `npm run preview` | Sirve el contenido de `dist/` para revisar el build antes de publicarlo (correr `build` antes). |

## Variables de entorno

### Backend

Son opcionales; si no se definen se usan los valores por defecto.

| Variable | Por defecto | Para qué sirve |
| --- | --- | --- |
| `PORT` | `3000` | Puerto donde escucha la API. |
| `DB_PATH` | `Backend/data/pinpun.db` | Archivo de la base de datos. Con `:memory:` queda solo en memoria y empieza vacía en cada arranque (así se hacen las pruebas). |
| `CORS_ORIGIN` | `*` | Origen permitido para pedidos desde el navegador (por ejemplo `http://localhost:5173`). |
| `AUTH_SECRET` | un valor de desarrollo | Clave con la que se firman las sesiones del panel de administración. Definir una propia fuera del desarrollo. |
| `SIN_DATOS_DE_EJEMPLO` | sin definir | Con `1`, la API arranca sin los pedidos y reservas de ejemplo con los que se prueba el panel. |
| `GEOGRAFIA_SIMULADA` | sin definir | Con `1`, el seguimiento no sale a internet: ubica las direcciones y calcula los recorridos con datos inventados pero estables (para pruebas o para trabajar sin conexión). |
| `GEOGRAFIA_GEOCODIFICADOR_URL` / `GEOGRAFIA_ENRUTADOR_URL` | Nominatim y OSRM públicos | Servicios que ubican direcciones y calculan recorridos. Para uso intenso, apuntarlos a un proveedor propio. |
| `GEOGRAFIA_AGENTE` | `PinPun/1.0 (proyecto academico)` | Cómo se identifica el servidor ante esos servicios (Nominatim lo exige). |
| `RUTA_ACTUALIZAR_CADA_MS` | `20000` | Cada cuánto se recalcula, como máximo, el recorrido de un pedido en camino. |

Ejemplo para cambiar el puerto:

```bash
# bash / Git Bash
PORT=4000 npm run dev
```

```powershell
# PowerShell
$env:PORT = 4000; npm run dev
```

### Frontend

Se definen en `Frontend/.env` (partiendo de [Frontend/.env.example](Frontend/.env.example)).

| Variable | Por defecto | Para qué sirve |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de la API. Si se cambia el puerto del backend, hay que actualizarla acá y reiniciar `npm run dev`. |

## Endpoints de la API

Todas las rutas cuelgan de `/api`. Las respuestas tienen siempre la forma `{ "success": true, "data": ... }` o `{ "success": false, "message": "..." }`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/productos` | Lista los platos de una carta: la original (la de Corrientes) por defecto, o la de un local y canal (`?localId=1&canal=delivery`; canal: `salon` o `delivery`, que también vale para el retiro), o una en particular (`?cartaId=2`). También `?categoria=` y `?destacado=`. |
| GET | `/api/productos/:id` | Devuelve un producto. |
| POST | `/api/productos` | Crea un producto en la carta indicada (`cartaId`) o, si no se dice, en la general. |
| PUT | `/api/productos/:id` | Reemplaza un producto. |
| DELETE | `/api/productos/:id` | Borra un producto. Solo el administrador general. |
| GET | `/api/locales` | Lista todos los locales, con su horario, mesas, comensales y qué carta usa cada uno en cada canal (`cartas`). |
| GET | `/api/cartas` | Lista las cartas con cuántos platos tienen y quién las usa. Solo la administración general. |
| POST | `/api/cartas` | Crea una carta vacía o, con `copiarDeId`, una copia de otra con todos sus platos. |
| PUT | `/api/cartas/:id` | Cambia el nombre de una carta. |
| DELETE | `/api/cartas/:id` | Borra una carta con sus platos, si ningún local la usa y no es la última. |
| PUT | `/api/locales/:id/cartas` | Elige qué carta usa un local: `{ "delivery": 2 }` (puede llevar `salon` y `delivery`). Solo la administración general. |
| GET | `/api/locales/:id` | Devuelve un local. |
| PUT | `/api/locales/:id` | Cambia teléfono, horario, mesas, si se pueden juntar y máximo de personas por reserva. Requiere sesión (la sucursal, solo el suyo). |
| POST | `/api/auth/login` | Inicia sesión: devuelve un token y los datos de quien entró. |
| GET | `/api/auth/me` | Devuelve quién es el dueño del token. |
| POST | `/api/pedidos` | Hace un pedido de retiro o delivery. Público; el servidor calcula el total con la carta. |
| GET | `/api/pedidos` | Lista pedidos (`?localId=` y `?estado=`). Requiere sesión. |
| PATCH | `/api/pedidos/:id/estado` | Lo lleva al paso siguiente de su circuito o lo cancela (con un `motivo` opcional). Requiere sesión; el repartidor solo puede marcar sus pedidos En camino, Entregado o Cancelado. |
| PUT | `/api/pedidos/:id/ubicacion` | El repartidor asignado informa dónde está (`{ latitud, longitud, precision }`). Solo mientras el pedido está En camino. |
| GET | `/api/seguimiento/:codigo` | Público: el estado de un pedido, su recorrido, el local y, si va en camino, la última posición del repartidor. El `codigo` es el que devuelve `POST /api/pedidos` como `codigoSeguimiento`. |
| PATCH | `/api/pedidos/:id/repartidor` | Asigna un delivery: `{ "repartidorId": 2 }`, `{ "automatico": true }` (al que menos pedidos lleve) o `{ "repartidorId": null }` para quitarlo. Solo la administración. |
| GET | `/api/repartidores` | Lista las cuentas de reparto con cuántos pedidos lleva cada una. Solo la administración. |
| POST | `/api/repartidores` | Crea una cuenta de reparto (la sucursal, para su local). |
| PUT | `/api/repartidores/:id` | Cambia nombre, teléfono, contraseña o activa o desactiva la cuenta. |
| POST | `/api/reservas` | Pide una mesa. Público; valida horario, máximo de personas y lugar disponible. |
| GET | `/api/reservas` | Lista reservas (`?localId=` y `?estado=`). Requiere sesión. |
| PATCH | `/api/reservas/:id/estado` | La acepta, rechaza o concluye. Requiere sesión. |

Cuerpo para `POST` y `PUT` de productos (`nombre` y `precio` son obligatorios):

```json
{
  "nombre": "Muzzarella al molde",
  "precio": 14500,
  "imagen": "muzzarella.jpg",
  "descripcion": "Masa alta, salsa de tomate, muzzarella y aceitunas verdes."
}
```

Las rutas que piden sesión esperan el encabezado `Authorization: Bearer <token>`. Los administradores de sucursal solo ven y cambian lo de su local.

Circuitos de estados:

- **Pedido de retiro:** Recibido → En preparación → Listo → Retirado.
- **Pedido de delivery:** Recibido → En preparación → Listo → En camino → Entregado.
- Un pedido se puede cancelar mientras no haya terminado.
- **Reserva:** Esperando confirmación → Aceptada → Concluida; se puede rechazar antes de concluirla.

## Base de datos

Todo se guarda en un archivo SQLite (`Backend/data/pinpun.db`, fuera de git): pedidos, reservas, la carta, los locales, las cuentas y las cartas asignadas. Sobrevive a reinicios del servidor.

- **Primer arranque:** la API crea el archivo y las tablas, y carga los 6 locales, la carta, las cuentas de prueba y, una sola vez, los pedidos y reservas de ejemplo (no se cargan si se arranca con `SIN_DATOS_DE_EJEMPLO=1`). Después, reiniciar o actualizar el código nunca pisa lo que ya hay.
- **Empezar de cero:** con el servidor apagado, `npm run db:reset` borra el archivo (se pierde todo lo cargado). Los pedidos y reservas de ejemplo llevan fechas relativas al primer arranque, así que con los días quedan viejos: es un buen motivo para reiniciar la base.
- **Copia de seguridad:** con el servidor apagado, alcanza con copiar `Backend/data/pinpun.db`.
- **Cambios de estructura:** el esquema está versionado en [Backend/src/db/esquema.js](Backend/src/db/esquema.js). Para cambiarlo sin perder datos hay que **agregar** una migración al final de la lista (nunca editar una anterior): al arrancar, la API aplica las que falten.
- **Qué no se guarda:** la posición en vivo del repartidor queda solo en memoria (ver "Seguimiento del pedido"), a propósito.
- **Cartas por local y canal:** la carta (menú) es una entidad con nombre y cada local tiene asignada una por canal: la del salón (lo que se ve antes de ir al local) y la de delivery (para pedir: el retiro usa la misma). Hoy arrancan tres: "Carta de Corrientes" (la del salón de Av. Corrientes 3954, que usan todos los demás locales), "Delivery Angelina" (el menú impreso que reparte Angelina, asignada solo a su delivery) y "Salón Angelina" (la del salón de ese local, solo comida); las dos de Angelina se cargan una sola vez, también en una base que ya existía. Angelina todavía no tiene horario cargado, así que no recibe pedidos hasta que se complete en el panel (Locales). Para que una sucursal tenga la suya, o una distinta para el delivery, se crea otra carta (`POST /api/cartas`, que puede copiar una existente) y se asigna al local (`PUT /api/locales/:id/cartas`). Un pedido solo acepta platos de la carta de delivery de ese local, y cobra con sus precios. Cómo lo usa el sitio está en "Sucursal y carta en el sitio". Todavía no hay pantallas en el panel para manejar varias cartas: por ahora se crean y asignan con la API.
- Por ahora la API devuelve todos los pedidos de un local: con el tiempo la lista va a crecer y va a hacer falta paginarla o filtrar por fecha.

## Sucursal y carta en el sitio

Cada sucursal puede tener su propia carta (y una distinta para el salón), así que el sitio siempre sabe con cuál sucursal navega el visitante y a qué viene.

- **Selector en la barra:** muestra la sucursal elegida y abre la lista de locales. Si nunca se eligió, es la de Corrientes (Almagro, la de @pinpuncorrientes). La elección se recuerda entre visitas en el navegador. También se puede elegir desde "Dónde encontrarnos".
- **Al entrar a la carta (`/carta`):** se pregunta de qué sucursal y para qué: **Quiero pedir** (delivery o retiro, con la carta de delivery de esa sucursal) o **Voy a ir al local** (la carta del salón, solo para mirar). La respuesta vale mientras dure la pestaña; en una visita nueva se vuelve a preguntar, con la sucursal de la última vez ya tildada. Arriba de la carta queda un "Cambiar".
- **Mirar antes de ir:** los precios se ven pero no se pueden sumar al pedido, no está el armador de mitad y mitad ni el botón "Agregar" de los más vendidos, y el cierre invita a reservar una mesa. Desde ahí se puede pasar a pedir con un toque.
- **El pedido es de una carta:** cada plato sumado recuerda de qué carta es. Si se cambia a una sucursal que usa otra carta de delivery, el sitio avisa y pide confirmación antes de vaciar el pedido; si usa la misma, cambia sin preguntar. En el carrito solo se ofrecen las sucursales que tienen los platos del pedido, y arranca en la elegida.
- **Reservas** arrancan en la sucursal elegida.
- **Hasta que se cree otra carta,** todas las sucursales muestran la misma. Las cartas se crean y asignan con la API (ver "Base de datos"); todavía no hay pantalla en el panel.

## Combos

Un combo es un plato más de la carta (con su nombre, su categoría y su **propio precio**) que por dentro sabe de qué platos y en qué cantidad se compone. En la carta se ve igual que cualquier otro plato; en la API lleva `tipo: "combo"` y `componentes`: `[{ productoId, nombre, variante, cantidad, precio }]`, con lo que cuesta cada parte por separado.

- **Se arman solos:** si el pedido junta las partes de un combo (un café con leche y tres medialunas sumados por separado), el carrito las reemplaza por el combo y avisa cuánto se ahorra, con un "Deshacer" (si se deshace, no se vuelve a armar en ese pedido). El orden en que se suman no importa y, si alcanza para dos combos, arma dos. El servidor aplica la misma regla al recibir el pedido, así que lo que ve el cliente es lo que se le cobra.
- **Reglas:** solo se arma un combo que cuesta lo mismo o menos que sus partes por separado (nunca se cobra de más). Si dos combos comparten un componente, gana el que más ahorra. Un combo no se arma con otros combos ni con platos de otra carta, y si un componente tiene tamaños, el combo dice cuál.
- **Desde el panel:** en Menú, "Tipo: Combo" muestra el editor de componentes (producto, tamaño y cantidad) y avisa cuánto sale por separado y cuánto se ahorra. No se puede borrar un plato que forma parte de un combo, ni volverlo combo, ni sacarle el tamaño que el combo usa.
- **Por API:** `POST /api/productos` y `PUT /api/productos/:id` aceptan `tipo` y `componentes` (`GET /api/productos?tipo=combo` los lista). Copiar una carta copia sus combos, armados con los platos de la copia.
- **Cuáles hay hoy:** "Café con leche con 3 medialunas" (Corrientes y las dos cartas de Angelina) y "Desayuno" (Angelina). Los que llevan algo que no es un plato de la carta (el pan y manteca, las facturas, la medialuna rellena del Good Morning) siguen siendo platos comunes. La lista está en [Backend/src/data/combos.js](Backend/src/data/combos.js).

## Combos

Un combo es un plato más de la carta (con su nombre, su categoría y su **propio precio**) que por dentro sabe de qué platos y en qué cantidad se compone. En la carta se ve igual que cualquier otro plato; en la API lleva `tipo: "combo"` y `componentes`: `[{ productoId, nombre, variante, cantidad, precio }]`, con lo que cuesta cada parte por separado.

- **Se arman solos:** si el pedido junta las partes de un combo (un café con leche y tres medialunas sumados por separado), el carrito las reemplaza por el combo y avisa cuánto se ahorra, con un "Deshacer" (si se deshace, no se vuelve a armar en ese pedido). El orden en que se suman no importa y, si alcanza para dos combos, arma dos. El servidor aplica la misma regla al recibir el pedido, así que lo que ve el cliente es lo que se le cobra.
- **Reglas:** solo se arma un combo que cuesta lo mismo o menos que sus partes por separado (nunca se cobra de más). Si dos combos comparten un componente, gana el que más ahorra. Un combo no se arma con otros combos ni con platos de otra carta, y si un componente tiene tamaños, el combo dice cuál.
- **Desde el panel:** en Menú, "Tipo: Combo" muestra el editor de componentes (producto, tamaño y cantidad) y avisa cuánto sale por separado y cuánto se ahorra. No se puede borrar un plato que forma parte de un combo, ni volverlo combo, ni sacarle el tamaño que el combo usa.
- **Por API:** `POST /api/productos` y `PUT /api/productos/:id` aceptan `tipo` y `componentes` (`GET /api/productos?tipo=combo` los lista). Copiar una carta copia sus combos, armados con los platos de la copia.
- **Cuáles hay hoy:** "Café con leche con 3 medialunas" (Corrientes y las dos cartas de Angelina) y "Desayuno" (Angelina). Los que llevan algo que no es un plato de la carta (el pan y manteca, las facturas, la medialuna rellena del Good Morning) siguen siendo platos comunes. La lista está en [Backend/src/data/combos.js](Backend/src/data/combos.js).

## Panel de administración

Se entra por <http://localhost:5173/admin/ingresar> (hay un enlace "Acceso del personal" al pie del sitio). Cuentas de prueba:

| Quién | Mail | Contraseña | Qué ve |
| --- | --- | --- | --- |
| Administración general | `admin@pinpun.com` | `pinpun2026` | Todas las sucursales y el menú |
| Sucursal Almagro | `almagro@pinpun.com` | `almagro2026` | Pedidos, reservas y datos de Almagro |
| Sucursal Villa Urquiza | `urquiza@pinpun.com` | `urquiza2026` | Pedidos, reservas y datos de Villa Urquiza |
| Repartidor de Almagro | `diego@pinpun.com` | `reparto2026` | Portal de reparto: solo sus entregas |
| Repartidor de Almagro | `nahuel@pinpun.com` | `reparto2026` | Portal de reparto: solo sus entregas |
| Repartidora de Villa Urquiza | `vero@pinpun.com` | `reparto2026` | Portal de reparto: solo sus entregas |

- **Pedidos y reservas:** se actualizan solos cada 20 segundos y avisan cuando llega algo nuevo. Cada botón lleva el pedido o la reserva al paso siguiente; cancelar o rechazar pide confirmación.
- **Menú** (solo administración general): crear, editar y eliminar productos de la carta, que es la misma para todos los locales.
- **Repartidores:** las cuentas de reparto de cada sucursal (la administración general ve todas). Se crean, se editan y se desactivan en vez de borrarse; no se puede desactivar a quien todavía lleva pedidos.
- **Asignación de deliveries:** en Pedidos, cada delivery en marcha tiene un selector con los repartidores de su sucursal y cuántos pedidos lleva cada uno, y un botón para asignar automáticamente al que menos tenga (si empatan, al que hace más que no recibe uno). El filtro "Sin repartidor" junta los que todavía no tienen.
- **Locales:** teléfono, horario, tipos de mesa (comensales por mesa y cantidad), si se pueden juntar mesas y máximo de personas por reserva. Con eso, el sitio solo acepta reservas dentro del horario y mientras haya lugar: si el local junta mesas, cuenta la suma de comensales; si no, cada grupo tiene que entrar en una sola mesa (un grupo de 5 no entra en un salón de mesas de 2 y 4).

## Seguimiento del pedido

Al hacer un pedido, la pantalla "Pedido enviado" ofrece **Seguir mi pedido**: un enlace `/seguimiento/<código>` que no pide cuenta. El código es largo e inadivinable (16 bytes al azar), y también queda guardado en el navegador para volver desde el carrito vacío. En el panel, el detalle de cada pedido tiene un enlace a lo que ve el cliente.

- **Qué ve el cliente:** en qué paso va el pedido, lo que pidió, el local y el nombre de pila de quien reparte. Nunca teléfonos, apellidos ni datos de otros pedidos.
- **Mapa en vivo:** cuando un delivery está En camino y el repartidor comparte su ubicación, aparece un mapa con el local y la posición del repartidor, que se actualiza cada pocos segundos. El mapa usa [Leaflet](https://leafletjs.com/) con los mosaicos de OpenStreetMap (se descarga solo cuando hace falta). El servidor de mosaicos público de OpenStreetMap está pensado para poco tráfico: para uso intensivo conviene contratar un proveedor de mapas.
- **Destino y recorrido:** la dirección del cliente se ubica en el mapa en segundo plano al hacer el pedido (OpenStreetMap/Nominatim, buscándola dentro del área de reparto del local, porque hay calles con el mismo nombre en todo el conurbano). Con cada posición nueva, el servidor calcula en OSRM el recorrido que le falta al repartidor hasta el destino. El cliente ve su dirección marcada en el mapa, ese recorrido dibujado y tres datos: cuánto lleva de viaje, cuánto le falta (con los kilómetros) y la hora estimada de llegada. El tiempo que falta se va descontando solo entre un cálculo y el siguiente.
- **Si algo falla:** si la dirección no se encuentra, o los servicios no responden, el pedido sigue igual: el cliente ve al repartidor en el mapa y un aviso de que no se puede estimar el tiempo. Nada de esto frena nunca un pedido. Los tiempos son los de un auto (OSRM público); para una moto en el tránsito son una referencia.
- **Privacidad:** la ubicación solo se comparte mientras el pedido va En camino, se guarda solo la última posición (sin historial de recorridos) y se borra al entregar, cancelar o cambiar de repartidor. El repartidor ve en todo momento un aviso de que se está compartiendo, puede dejar de compartir cuando quiera y le avisa antes de salir.
- **Límites:** la ubicación se manda desde el navegador, así que solo funciona con la pantalla del portal abierta y encendida (se pide al navegador que no la apague). El navegador solo da la ubicación en `localhost` o en sitios con HTTPS: para probar desde un celular hace falta HTTPS.

## Portal de reparto

Los repartidores entran por el mismo acceso y van directo a <http://localhost:5173/reparto>. Ven solo los pedidos que les asignaron, en una columna pensada para el teléfono:

- **Para llevar:** los pedidos listos y los que ya van en camino. Cada tarjeta trae el cliente, la dirección, un botón para abrirla en el mapa, otro para llamar y lo que lleva el pedido.
- **Salí con el pedido** lo pasa a En camino; **Entregué el pedido** lo marca Entregado (con una confirmación, porque no se puede deshacer); **No pude entregarlo** lo cancela con el motivo que elija (no atendieron, dirección incorrecta, etc.), que queda en el recorrido del pedido.
- **En cocina:** los que todavía se están preparando; no se pueden tocar hasta que estén listos.
- Al salir, el navegador le pide permiso para usar la ubicación y la comparte con el cliente de ese pedido (ver "Seguimiento del pedido"). Un aviso verde arriba le dice con quién la comparte y le deja cortarla.
- Se actualiza solo cada 15 segundos y avisa cuando le asignan un pedido nuevo o uno queda listo. Los pedidos asignados se ven en cuanto se asignan, sin importar su estado.

Un repartidor no puede ver reservas, locales, la carta ni los pedidos de otros, y el servidor se lo impide aunque cambie la URL.

Al arrancar, la API carga algunos pedidos y reservas ficticios para que el panel no esté vacío (se omiten arrancando con `SIN_DATOS_DE_EJEMPLO=1`), y cada local trae mesas de ejemplo hasta que su sucursal cargue las reales. Las cuentas de prueba están en [Backend/src/repositories/usuarioRepository.js](Backend/src/repositories/usuarioRepository.js).

## Fotos y logo

Las imágenes se agregan copiándolas a `Frontend/src/assets/`, sin tocar código. Los nombres de archivo esperados están en [Frontend/src/assets/fotos/LEEME.md](Frontend/src/assets/fotos/LEEME.md) y [Frontend/src/assets/logo/LEEME.md](Frontend/src/assets/logo/LEEME.md). Mientras falten, el sitio muestra dibujos de reemplazo.

## Problemas comunes

- **El sitio dice "No pudimos conectarnos con Pin Pun"**: el backend no está corriendo, o `VITE_API_URL` apunta a otro puerto.
- **`EADDRINUSE: address already in use :::3000`**: ya hay algo usando el puerto. Cerrar la otra terminal o cambiar `PORT` (y `VITE_API_URL`).
- **Error al levantar Vite sobre la versión de Node**: actualizar Node a 20.19 o superior.
- **`Cannot find module 'node:sqlite'` al levantar el backend**: el backend necesita Node 22.13 o superior.
- **Cambié el `.env` y no pasa nada**: Vite solo lee el `.env` al arrancar; cortar con `Ctrl + C` y volver a correr `npm run dev`.
