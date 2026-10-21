import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

/*
 * Borra la base de datos para volver a empezar: al arrancar, la API crea una nueva con los locales, la carta,
 * las cuentas de prueba y los pedidos y reservas de ejemplo. Se pierde todo lo que se cargó.
 * Se corre con el servidor apagado: `npm run db:reset`.
 */
const archivo = process.env.DB_PATH ?? resolve(import.meta.dirname, '../data/pinpun.db');

if (archivo === ':memory:') {
    console.log('DB_PATH es :memory:, no hay archivo que borrar.');
} else {
    for (const sufijo of ['', '-wal', '-shm']) rmSync(archivo + sufijo, { force: true });
    console.log(`Base de datos borrada: ${archivo}`);
}
