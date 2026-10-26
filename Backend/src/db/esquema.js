import { db, transaccion } from './conexion.js';

/*
 * Esquema de la base, versionado con `PRAGMA user_version`: cada migración corre una sola vez, en orden.
 * Para cambiar la estructura de una base que ya tiene datos hay que AGREGAR una migración al final de la lista
 * (nunca editar una anterior): al arrancar, la API aplica las que falten.
 *
 * Las cartas (menús) son entidades con nombre y cada local tiene asignada una por canal (salón y delivery; el retiro usa la del delivery).
 * Así sirve tanto una carta única para todos como una por sucursal, o una de salón y otra de delivery:
 * es crear cartas y asignarlas, sin cambiar la estructura.
 */
const MIGRACIONES = [
    /* 1: estructura inicial */
    `
    CREATE TABLE locales (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        direccion TEXT NOT NULL,
        numero TEXT,
        instagram TEXT,
        latitud REAL NOT NULL,
        longitud REAL NOT NULL,
        horario_apertura TEXT,
        horario_cierre TEXT,
        reserva_max_personas INTEGER NOT NULL DEFAULT 12,
        juntar_mesas INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE local_mesas (
        local_id INTEGER NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
        capacidad INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        PRIMARY KEY (local_id, capacidad)
    );

    CREATE TABLE cartas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
    );

    CREATE TABLE productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carta_id INTEGER NOT NULL REFERENCES cartas(id) ON DELETE CASCADE,
        nombre TEXT NOT NULL,
        categoria TEXT NOT NULL,
        subcategoria TEXT NOT NULL DEFAULT '',
        imagen TEXT NOT NULL DEFAULT '',
        precio REAL NOT NULL,
        descripcion TEXT NOT NULL DEFAULT '',
        destacado INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX idx_productos_carta ON productos (carta_id);

    CREATE TABLE producto_variantes (
        producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
        orden INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        PRIMARY KEY (producto_id, orden)
    );

    -- Qué carta usa cada local en cada canal. Una carta asignada no se puede borrar (sin ON DELETE en carta_id).
    CREATE TABLE local_cartas (
        local_id INTEGER NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
        canal TEXT NOT NULL CHECK (canal IN ('salon', 'retiro', 'delivery')),
        carta_id INTEGER NOT NULL REFERENCES cartas(id),
        PRIMARY KEY (local_id, canal)
    );

    CREATE TABLE administradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dni TEXT NOT NULL DEFAULT '',
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        mail TEXT NOT NULL UNIQUE,
        numero TEXT NOT NULL DEFAULT '',
        direccion TEXT NOT NULL DEFAULT '',
        contrasena TEXT NOT NULL,
        local_id INTEGER REFERENCES locales(id)
    );

    CREATE TABLE repartidores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dni TEXT NOT NULL DEFAULT '',
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        mail TEXT NOT NULL UNIQUE,
        numero TEXT NOT NULL DEFAULT '',
        direccion TEXT NOT NULL DEFAULT '',
        contrasena TEXT NOT NULL,
        local_id INTEGER NOT NULL REFERENCES locales(id),
        activo INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        total REAL NOT NULL,
        tipo TEXT NOT NULL,
        estado TEXT NOT NULL,
        local_id INTEGER NOT NULL REFERENCES locales(id),
        cliente_nombre TEXT NOT NULL,
        cliente_telefono TEXT NOT NULL,
        direccion TEXT NOT NULL DEFAULT '',
        repartidor_id INTEGER REFERENCES repartidores(id),
        asignado_en TEXT,
        codigo_seguimiento TEXT NOT NULL UNIQUE,
        destino_latitud REAL,
        destino_longitud REAL
    );
    CREATE INDEX idx_pedidos_local_estado ON pedidos (local_id, estado);
    CREATE INDEX idx_pedidos_repartidor ON pedidos (repartidor_id);

    -- producto_id sin tipo a propósito: guarda el número de un plato (12) o el texto de una mitad y mitad ("mitad:3-7") tal cual.
    -- Cada renglón es una copia de lo que costaba al pedir: no depende de que el plato siga en la carta.
    CREATE TABLE pedido_items (
        pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
        orden INTEGER NOT NULL,
        producto_id NOT NULL,
        nombre TEXT NOT NULL,
        categoria TEXT NOT NULL,
        subcategoria TEXT NOT NULL DEFAULT '',
        variante TEXT NOT NULL DEFAULT '',
        precio REAL NOT NULL,
        cantidad INTEGER NOT NULL,
        PRIMARY KEY (pedido_id, orden)
    );

    CREATE TABLE pedido_historial (
        pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
        orden INTEGER NOT NULL,
        estado TEXT NOT NULL,
        fecha TEXT NOT NULL,
        motivo TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (pedido_id, orden)
    );

    CREATE TABLE reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha_hora TEXT NOT NULL,
        cant_personas INTEGER NOT NULL,
        estado TEXT NOT NULL,
        local_id INTEGER NOT NULL REFERENCES locales(id),
        cliente_nombre TEXT NOT NULL,
        cliente_telefono TEXT NOT NULL,
        aclaraciones TEXT NOT NULL DEFAULT '',
        creada TEXT NOT NULL
    );
    CREATE INDEX idx_reservas_local_fecha ON reservas (local_id, fecha_hora);

    -- Datos sueltos de la propia base (por ejemplo, si ya se cargaron los pedidos de ejemplo)
    CREATE TABLE meta (
        clave TEXT PRIMARY KEY,
        valor TEXT NOT NULL
    );
    `,

    /* 2: el retiro usa la carta del delivery, así que ya no se guarda una carta aparte para ese canal */
    `
    DELETE FROM local_cartas WHERE canal = 'retiro';
    `,

    /* 3: la carta original es la del salón de Av. Corrientes 3954, no una "general" */
    `
    UPDATE cartas SET nombre = 'Carta de Corrientes'
    WHERE nombre = 'Carta general' AND NOT EXISTS (SELECT 1 FROM cartas WHERE nombre = 'Carta de Corrientes');
    `,

    /* 4: combos. Un combo es un plato más de la carta (con su precio) que además sabe de qué platos y en qué cantidad se compone */
    `
    ALTER TABLE productos ADD COLUMN tipo TEXT NOT NULL DEFAULT 'simple' CHECK (tipo IN ('simple', 'combo'));

    -- variante vacía = el plato sin tamaños. Los dos lados borran en cascada porque se borra la carta entera;
    -- que no se borre un plato que forma parte de un combo lo cuida el servicio.
    CREATE TABLE combo_componentes (
        combo_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
        componente_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
        variante TEXT NOT NULL DEFAULT '',
        cantidad INTEGER NOT NULL CHECK (cantidad >= 1),
        PRIMARY KEY (combo_id, componente_id, variante)
    );
    CREATE INDEX idx_combo_componentes_componente ON combo_componentes (componente_id);
    `
];

export function migrar() {
    const { user_version: aplicadas } = db.prepare('PRAGMA user_version').get();

    for (let version = aplicadas; version < MIGRACIONES.length; version++) {
        transaccion(() => {
            db.exec(MIGRACIONES[version]);
            db.exec(`PRAGMA user_version = ${version + 1}`);
        });
    }
}
