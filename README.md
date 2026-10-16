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
| DELETE | `/api/productos/:id` | Borra un producto. |
| GET | `/api/locales` | Lista todos los locales. |
| GET | `/api/locales/:id` | Devuelve un local. |

Cuerpo para `POST` y `PUT` de productos (`nombre` y `precio` son obligatorios):

```json
{
  "nombre": "Muzzarella al molde",
  "precio": 14500,
  "imagen": "muzzarella.jpg",
  "descripcion": "Masa alta, salsa de tomate, muzzarella y aceitunas verdes."
}
```

Los datos se guardan en memoria: los cambios hechos con `POST`, `PUT` o `DELETE` se pierden al reiniciar el servidor.

## Fotos y logo

Las imágenes se agregan copiándolas a `Frontend/src/assets/`, sin tocar código. Los nombres de archivo esperados están en [Frontend/src/assets/fotos/LEEME.md](Frontend/src/assets/fotos/LEEME.md) y [Frontend/src/assets/logo/LEEME.md](Frontend/src/assets/logo/LEEME.md). Mientras falten, el sitio muestra dibujos de reemplazo.

## Problemas comunes

- **El sitio dice "No pudimos conectarnos con Pin Pun"**: el backend no está corriendo, o `VITE_API_URL` apunta a otro puerto.
- **`EADDRINUSE: address already in use :::3000`**: ya hay algo usando el puerto. Cerrar la otra terminal o cambiar `PORT` (y `VITE_API_URL`).
- **Error al levantar Vite sobre la versión de Node**: actualizar Node a 20.19 o superior.
- **Cambié el `.env` y no pasa nada**: Vite solo lee el `.env` al arrancar; cortar con `Ctrl + C` y volver a correr `npm run dev`.
