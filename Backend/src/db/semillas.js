import { db, transaccion } from './conexion.js';
import carta from '../data/carta.js';
import cartaAngelina from '../data/cartaAngelina.js';
import cartaAngelinaSalon from '../data/cartaAngelinaSalon.js';
import { COMBOS } from '../data/combos.js';
import locales from '../data/locales.js';
import { administradores, repartidores } from '../data/usuarios.js';
import Producto from '../models/Producto.js';
import { hashContrasena } from '../utils/contrasenas.js';

export const NOMBRE_CARTA_INICIAL = 'Carta de Corrientes';
const CANALES = ['salon', 'delivery'];

const TELEFONO_ANGELINA = '011 5222-7663';

const estaVacia = (tabla) => db.prepare(`SELECT COUNT(*) AS cantidad FROM ${tabla}`).get().cantidad === 0;

/*
 * Carga lo mínimo para que el sistema funcione en una base recién creada: los locales, una carta con todos los platos
 * (que usan todos los locales en los dos canales hasta que se creen otras) y las cuentas de prueba.
 * Cada tabla se llena solo si está vacía, así que reiniciar la API (o actualizarla) nunca pisa lo que ya hay.
 */
export function sembrar() {
    transaccion(() => {
        if (estaVacia('locales')) {
            const insertarLocal = db.prepare(
                `INSERT INTO locales (id, nombre, direccion, numero, instagram, latitud, longitud, horario_apertura, horario_cierre)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            );
            const insertarMesa = db.prepare('INSERT INTO local_mesas (local_id, capacidad, cantidad) VALUES (?, ?, ?)');

            for (const local of locales) {
                insertarLocal.run(local.id, local.nombre, local.direccion, local.numero, local.instagram, local.latitud, local.longitud, local.horarioApertura, local.horarioCierre);
                for (const mesa of local.mesas) insertarMesa.run(local.id, mesa.capacidad, mesa.cantidad);
            }
        }

        if (estaVacia('cartas')) {
            const cartaId = Number(db.prepare('INSERT INTO cartas (nombre) VALUES (?)').run(NOMBRE_CARTA_INICIAL).lastInsertRowid);
            const insertarProducto = db.prepare(
                `INSERT INTO productos (id, carta_id, nombre, categoria, subcategoria, imagen, precio, descripcion, destacado)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            );
            const insertarVariante = db.prepare('INSERT INTO producto_variantes (producto_id, orden, nombre, precio) VALUES (?, ?, ?, ?)');

            carta.forEach((datos, indice) => {
                const producto = new Producto({ id: indice + 1, cartaId, ...datos });
                insertarProducto.run(producto.id, cartaId, producto.nombre, producto.categoria, producto.subcategoria, producto.imagen, producto.precio, producto.descripcion, producto.destacado ? 1 : 0);
                producto.variantes.forEach((variante, orden) => insertarVariante.run(producto.id, orden, variante.nombre, variante.precio));
            });

            const asignar = db.prepare('INSERT INTO local_cartas (local_id, canal, carta_id) VALUES (?, ?, ?)');
            for (const local of locales) for (const canal of CANALES) asignar.run(local.id, canal, cartaId);
        }

        if (estaVacia('administradores')) {
            const insertar = db.prepare(
                `INSERT INTO administradores (dni, nombre, apellido, mail, numero, direccion, contrasena, local_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            );
            for (const admin of administradores) {
                insertar.run(admin.dni, admin.nombre, admin.apellido, admin.mail, admin.numero, admin.direccion, hashContrasena(admin.contrasena), admin.localId);
            }
        }

        if (estaVacia('repartidores')) {
            const insertar = db.prepare(
                `INSERT INTO repartidores (dni, nombre, apellido, mail, numero, direccion, contrasena, local_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            );
            for (const repartidor of repartidores) {
                insertar.run(repartidor.dni, repartidor.nombre, repartidor.apellido, repartidor.mail, repartidor.numero, repartidor.direccion, hashContrasena(repartidor.contrasena), repartidor.localId);
            }
        }

        sembrarCartasDeAngelina();
        definirCombos();
    });
}

/*
 * Las cartas de Angelina (la de delivery y la del salón, transcriptas de sus menús impresos) se cargan una sola vez cada una,
 * tanto en una base nueva como en una que ya existía: se crean como una carta más y se asignan al canal de ese local.
 * Si después se renombran, se cambian o se borran desde el panel o la API, no se vuelven a crear.
 * Si el local tiene el teléfono vacío, se completa con el del menú.
 */
const CARTAS_DE_ANGELINA = [
    { clave: 'carta_angelina_cargada', nombre: 'Delivery Angelina', canal: 'delivery', platos: cartaAngelina },
    { clave: 'carta_angelina_salon_cargada', nombre: 'Salón Angelina', canal: 'salon', platos: cartaAngelinaSalon }
];

function sembrarCartasDeAngelina() {
    for (const carta of CARTAS_DE_ANGELINA) sembrarCartaDeAngelina(carta);
}

function sembrarCartaDeAngelina({ clave, nombre, canal, platos }) {
    if (db.prepare('SELECT 1 FROM meta WHERE clave = ?').get(clave)) return;

    const local = db.prepare("SELECT id, numero FROM locales WHERE instagram = 'pinpunangelina'").get();
    const existe = db.prepare('SELECT 1 FROM cartas WHERE nombre = ?').get(nombre);

    if (local && !existe) {
        const cartaId = Number(db.prepare('INSERT INTO cartas (nombre) VALUES (?)').run(nombre).lastInsertRowid);
        const insertarProducto = db.prepare(
            `INSERT INTO productos (carta_id, nombre, categoria, subcategoria, imagen, precio, descripcion, destacado)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );
        const insertarVariante = db.prepare('INSERT INTO producto_variantes (producto_id, orden, nombre, precio) VALUES (?, ?, ?, ?)');

        for (const datos of platos) {
            const producto = new Producto({ cartaId, ...datos });
            const id = Number(
                insertarProducto.run(cartaId, producto.nombre, producto.categoria, producto.subcategoria, producto.imagen, producto.precio, producto.descripcion, producto.destacado ? 1 : 0).lastInsertRowid
            );
            producto.variantes.forEach((variante, orden) => insertarVariante.run(id, orden, variante.nombre, variante.precio));
        }

        db.prepare('INSERT INTO local_cartas (local_id, canal, carta_id) VALUES (?, ?, ?) ON CONFLICT (local_id, canal) DO UPDATE SET carta_id = excluded.carta_id').run(local.id, canal, cartaId);
        if (!local.numero) db.prepare('UPDATE locales SET numero = ? WHERE id = ?').run(TELEFONO_ANGELINA, local.id);
    }

    db.prepare('INSERT INTO meta (clave, valor) VALUES (?, ?)').run(clave, new Date().toISOString());
}

/*
 * Convierte en combos los platos de la lista de data/combos.js, en las cartas que ya los tienen cargados como platos comunes.
 * Se hace una sola vez por base (también en una que ya existía), sin tocar su nombre ni su precio. Si después se editan
 * o se arman otros desde el panel o la API, no se vuelve a pisar nada.
 */
function definirCombos() {
    if (db.prepare('SELECT 1 FROM meta WHERE clave = ?').get('combos_definidos')) return;

    const cartaPorNombre = db.prepare('SELECT id FROM cartas WHERE nombre = ?');
    const buscar = db.prepare(
        "SELECT p.id, (SELECT COUNT(*) FROM producto_variantes v WHERE v.producto_id = p.id) AS tamanos FROM productos p WHERE p.carta_id = ? AND p.categoria = ? AND p.nombre = ? ORDER BY p.id LIMIT 1"
    );
    const volverCombo = db.prepare("UPDATE productos SET tipo = 'combo' WHERE id = ? AND tipo = 'simple'");
    const insertar = db.prepare("INSERT OR IGNORE INTO combo_componentes (combo_id, componente_id, variante, cantidad) VALUES (?, ?, '', ?)");

    for (const combo of COMBOS) {
        for (const nombreCarta of combo.cartas) {
            const carta = cartaPorNombre.get(nombreCarta);
            if (!carta) continue;

            const plato = buscar.get(carta.id, combo.categoria, combo.nombre);
            const partes = combo.componentes.map((parte) => ({ ...parte, fila: buscar.get(carta.id, parte.categoria, parte.nombre) }));

            /* Los platos con tamaños no se usan acá: el combo tendría que decir cuál */
            if (!plato || plato.tamanos > 0 || partes.some((parte) => !parte.fila || parte.fila.tamanos > 0)) continue;

            volverCombo.run(plato.id);
            for (const parte of partes) insertar.run(plato.id, parte.fila.id, parte.cantidad);
        }
    }

    db.prepare('INSERT INTO meta (clave, valor) VALUES (?, ?)').run('combos_definidos', new Date().toISOString());
}
