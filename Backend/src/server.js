import app from './app.js';
import { cargarEjemplos } from './data/ejemplos.js';

const PORT = process.env.PORT ?? 3000;

if (!process.env.SIN_DATOS_DE_EJEMPLO) cargarEjemplos();

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
