/*
 * Última posición conocida del repartidor de cada pedido que va en camino, con el último recorrido calculado hasta el destino.
 * Solo se guarda la más reciente (no hay historial de recorridos) y se borra apenas el pedido termina
 * o cambia de repartidor: la ubicación se comparte únicamente mientras sirve para esperar el pedido.
 */
const ubicaciones = new Map();

/* Una posición nueva reemplaza a la anterior pero conserva el último recorrido hasta que se recalcule */
const guardar = (pedidoId, { latitud, longitud, precision }) => {
    const anterior = ubicaciones.get(pedidoId);
    const ubicacion = {
        latitud,
        longitud,
        precision,
        fecha: new Date().toISOString(),
        ruta: anterior?.ruta ?? null,
        rutaIntentadaEn: anterior?.rutaIntentadaEn ?? null
    };

    ubicaciones.set(pedidoId, ubicacion);
    return ubicacion;
};

const buscar = (pedidoId) => ubicaciones.get(pedidoId) ?? null;

const marcarRutaIntentada = (pedidoId) => {
    const ubicacion = ubicaciones.get(pedidoId);
    if (ubicacion) ubicacion.rutaIntentadaEn = Date.now();
};

const guardarRuta = (pedidoId, ruta) => {
    const ubicacion = ubicaciones.get(pedidoId);
    if (ubicacion) ubicacion.ruta = ruta;
};

const borrar = (pedidoId) => {
    ubicaciones.delete(pedidoId);
};

export default { guardar, buscar, marcarRutaIntentada, guardarRuta, borrar };
