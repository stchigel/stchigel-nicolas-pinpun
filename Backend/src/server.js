import app from './app.js';
import { escribirMeta, leerMeta, transaccion } from './db/iniciar.js';
import { cargarEjemplos } from './data/ejemplos.js';

const PORT = process.env.PORT ?? 3000;

/*
 * Los pedidos y reservas de ejemplo se cargan una sola vez, en la primera corrida de una base nueva.
 * La carga y su marca van en la misma transacción: si el servidor se corta (o se reinicia solo en modo --watch)
 * a la mitad, no queda nada cargado y se vuelve a intentar entero, sin duplicados.
 */
if (!process.env.SIN_DATOS_DE_EJEMPLO && leerMeta('ejemplos_cargados') === null) {
    transaccion(() => {
        cargarEjemplos();
        escribirMeta('ejemplos_cargados', new Date().toISOString());
    });
}

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
