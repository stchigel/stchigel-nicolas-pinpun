# Pin Pun

Sitio y sistema de pedidos de la Pizzería Pin Pun. Tiene dos partes que se ejecutan por separado:

| Carpeta | Qué es | Puerto por defecto |
| --- | --- | --- |
| [Backend/](Backend/) | API REST con Express (patrón MVC, datos en memoria) | `3000` |
| [Frontend/](Frontend/) | Interfaz web con React + Vite | `5173` |

## Requisitos

- [Node.js](https://nodejs.org/) **20.19 o superior** (Vite 8 no funciona con versiones anteriores). Se recomienda la última LTS.
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
| `CORS_ORIGIN` | `*` | Origen permitido para pedidos desde el navegador (por ejemplo `http://localhost:5173`). |
| `AUTH_SECRET` | un valor de desarrollo | Clave con la que se firman las sesiones del panel de administración. Definir una propia fuera del desarrollo. |
| `SIN_DATOS_DE_EJEMPLO` | sin definir | Con `1`, la API arranca sin los pedidos y reservas de ejemplo con los que se prueba el panel. |

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
| GET | `/api/productos` | Lista todos los productos. |
| GET | `/api/productos/:id` | Devuelve un producto. |
| POST | `/api/productos` | Crea un producto. |
| PUT | `/api/productos/:id` | Reemplaza un producto. |
| DELETE | `/api/productos/:id` | Borra un producto. Solo el administrador general. |
| GET | `/api/locales` | Lista todos los locales, con su horario, mesas y comensales. |
| GET | `/api/locales/:id` | Devuelve un local. |
| PUT | `/api/locales/:id` | Cambia teléfono, horario, mesas, si se pueden juntar y máximo de personas por reserva. Requiere sesión (la sucursal, solo el suyo). |
| POST | `/api/auth/login` | Inicia sesión: devuelve un token y los datos de quien entró. |
| GET | `/api/auth/me` | Devuelve quién es el dueño del token. |
| POST | `/api/pedidos` | Hace un pedido de retiro o delivery. Público; el servidor calcula el total con la carta. |
| GET | `/api/pedidos` | Lista pedidos (`?localId=` y `?estado=`). Requiere sesión. |
| PATCH | `/api/pedidos/:id/estado` | Lo lleva al paso siguiente de su circuito o lo cancela. Requiere sesión. |
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

Los datos se guardan en memoria: los cambios hechos con `POST`, `PUT` o `DELETE` se pierden al reiniciar el servidor.

## Panel de administración

Se entra por <http://localhost:5173/admin/ingresar> (hay un enlace "Acceso del personal" al pie del sitio). Cuentas de prueba:

| Quién | Mail | Contraseña | Qué ve |
| --- | --- | --- | --- |
| Administración general | `admin@pinpun.com` | `pinpun2026` | Todas las sucursales y el menú |
| Sucursal Almagro | `almagro@pinpun.com` | `almagro2026` | Pedidos, reservas y datos de Almagro |
| Sucursal Villa Urquiza | `urquiza@pinpun.com` | `urquiza2026` | Pedidos, reservas y datos de Villa Urquiza |

- **Pedidos y reservas:** se actualizan solos cada 20 segundos y avisan cuando llega algo nuevo. Cada botón lleva el pedido o la reserva al paso siguiente; cancelar o rechazar pide confirmación.
- **Menú** (solo administración general): crear, editar y eliminar productos de la carta, que es la misma para todos los locales.
- **Locales:** teléfono, horario, tipos de mesa (comensales por mesa y cantidad), si se pueden juntar mesas y máximo de personas por reserva. Con eso, el sitio solo acepta reservas dentro del horario y mientras haya lugar: si el local junta mesas, cuenta la suma de comensales; si no, cada grupo tiene que entrar en una sola mesa (un grupo de 5 no entra en un salón de mesas de 2 y 4).

Al arrancar, la API carga algunos pedidos y reservas ficticios para que el panel no esté vacío (se omiten arrancando con `SIN_DATOS_DE_EJEMPLO=1`), y cada local trae mesas de ejemplo hasta que su sucursal cargue las reales. Las cuentas de prueba están en [Backend/src/repositories/usuarioRepository.js](Backend/src/repositories/usuarioRepository.js).

## Fotos y logo

Las imágenes se agregan copiándolas a `Frontend/src/assets/`, sin tocar código. Los nombres de archivo esperados están en [Frontend/src/assets/fotos/LEEME.md](Frontend/src/assets/fotos/LEEME.md) y [Frontend/src/assets/logo/LEEME.md](Frontend/src/assets/logo/LEEME.md). Mientras falten, el sitio muestra dibujos de reemplazo.

## Problemas comunes

- **El sitio dice "No pudimos conectarnos con Pin Pun"**: el backend no está corriendo, o `VITE_API_URL` apunta a otro puerto.
- **`EADDRINUSE: address already in use :::3000`**: ya hay algo usando el puerto. Cerrar la otra terminal o cambiar `PORT` (y `VITE_API_URL`).
- **Error al levantar Vite sobre la versión de Node**: actualizar Node a 20.19 o superior.
- **Cambié el `.env` y no pasa nada**: Vite solo lee el `.env` al arrancar; cortar con `Ctrl + C` y volver a correr `npm run dev`.
