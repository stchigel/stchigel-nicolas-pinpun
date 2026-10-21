import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/*
 * Base de datos SQLite: un solo archivo, sin servidor aparte (usa el módulo que ya trae Node).
 * - Por defecto vive en Backend/data/pinpun.db; `DB_PATH` cambia el archivo.
 * - `DB_PATH=:memory:` la deja solo en memoria, vacía en cada arranque (así se hacen las pruebas).
 */
export const RUTA_BASE = process.env.DB_PATH ?? resolve(import.meta.dirname, '../../data/pinpun.db');

if (RUTA_BASE !== ':memory:') mkdirSync(dirname(RUTA_BASE), { recursive: true });

export const db = new DatabaseSync(RUTA_BASE);

/* WAL deja leer mientras se escribe; las claves foráneas hay que pedirlas en cada conexión */
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

/*
 * Agrupa varias escrituras: o se guardan todas o no se guarda ninguna.
 * Si ya hay una transacción abierta, el trabajo se suma a ella (así una operación grande puede usar
 * funciones que también abren la suya, y todo se confirma o se deshace junto).
 */
let abierta = false;

export const transaccion = (trabajo) => {
    if (abierta) return trabajo();

    db.exec('BEGIN IMMEDIATE');
    abierta = true;
    try {
        const resultado = trabajo();
        db.exec('COMMIT');
        return resultado;
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    } finally {
        abierta = false;
    }
};
