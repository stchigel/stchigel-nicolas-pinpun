import { db, transaccion } from './conexion.js';
import { migrar } from './esquema.js';
import { sembrar } from './semillas.js';

/*
 * Punto de entrada de la base: al importarlo, el esquema ya está al día y hay datos mínimos.
 * Los repositorios importan de acá (y no de conexion.js) para no usar nunca una base sin tablas.
 */
migrar();
sembrar();

export { db, transaccion };

export const leerMeta = (clave) => db.prepare('SELECT valor FROM meta WHERE clave = ?').get(clave)?.valor ?? null;

export const escribirMeta = (clave, valor) =>
    db.prepare('INSERT INTO meta (clave, valor) VALUES (?, ?) ON CONFLICT (clave) DO UPDATE SET valor = excluded.valor').run(clave, valor);
