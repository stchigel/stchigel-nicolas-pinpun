import { db, transaccion } from './conexion.js';
import carta from '../data/carta.js';
import locales from '../data/locales.js';
import { administradores, repartidores } from '../data/usuarios.js';
import Producto from '../models/Producto.js';
import { hashContrasena } from '../utils/contrasenas.js';

export const NOMBRE_CARTA_INICIAL = 'Carta general';
const CANALES = ['salon', 'retiro', 'delivery'];

const estaVacia = (tabla) => db.prepare(`SELECT COUNT(*) AS cantidad FROM ${tabla}`).get().cantidad === 0;

/*
 * Carga lo mínimo para que el sistema funcione en una base recién creada: los locales, una carta con todos los platos
 * (que usan todos los locales en los tres canales hasta que se creen otras) y las cuentas de prueba.
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
    });
}
