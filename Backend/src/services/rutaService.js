import ubicacionRepository from '../repositories/ubicacionRepository.js';
import { calcularRuta } from './geografiaService.js';

/* Cada cuánto se recalcula el recorrido de un pedido: lo bastante seguido para que el tiempo restante sea fiel */
const ACTUALIZAR_CADA_MS = Number(process.env.RUTA_ACTUALIZAR_CADA_MS ?? 20 * 1000);
const enCalculo = new Set();

/*
 * Recalcula, en segundo plano, el recorrido que le falta al repartidor desde donde está hasta el destino.
 * Se llama cada vez que llega una posición nueva o que el cliente mira su pedido; el límite de tiempo
 * hace que sean pocas consultas aunque haya muchos clientes mirando. Si falla, el mapa sigue sin recorrido.
 */
export const refrescarRuta = (pedido) => {
    const ubicacion = ubicacionRepository.buscar(pedido.id);
    if (!ubicacion || !pedido.destino || enCalculo.has(pedido.id)) return;
    if (ubicacion.rutaIntentadaEn && Date.now() - ubicacion.rutaIntentadaEn < ACTUALIZAR_CADA_MS) return;

    enCalculo.add(pedido.id);
    ubicacionRepository.marcarRutaIntentada(pedido.id);

    calcularRuta({ latitud: ubicacion.latitud, longitud: ubicacion.longitud }, pedido.destino)
        .then((ruta) => {
            if (ruta) ubicacionRepository.guardarRuta(pedido.id, { ...ruta, calculadaEn: new Date().toISOString() });
        })
        .catch(() => {})
        .finally(() => enCalculo.delete(pedido.id));
};
