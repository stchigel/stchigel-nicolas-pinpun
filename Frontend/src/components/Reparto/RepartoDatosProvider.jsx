import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RepartoDatosContext from './RepartoDatosContext.js';
import { useToast } from '../../hooks/useToast.js';
import { cambiarEstadoPedido, getPedidos } from '../../services/pedidoService.js';

const REFRESCO_MS = 15 * 1000;
const RELOJ_MS = 30 * 1000;

/*
 * Los pedidos que le asignaron al repartidor (el servidor solo le devuelve esos).
 * Se vuelven a pedir cada 15 segundos mientras la pestaña está a la vista y avisan cuando
 * le asignan uno nuevo o cuando uno que esperaba en cocina ya está listo para salir.
 */
function RepartoDatosProvider({ children }) {
    const notificar = useToast();
    const [datos, setDatos] = useState({ pedidos: [], cargando: true, error: null, actualizado: null });
    const [ahora, setAhora] = useState(() => Date.now());
    const vistos = useRef(null);

    const avisarNovedades = useCallback(
        (pedidos) => {
            const anteriores = vistos.current;
            vistos.current = new Map(pedidos.map((pedido) => [pedido.id, pedido.estado]));
            if (!anteriores) return;

            const nuevos = pedidos.filter((pedido) => !anteriores.has(pedido.id));
            const listos = pedidos.filter((pedido) => anteriores.has(pedido.id) && anteriores.get(pedido.id) !== 'Listo' && pedido.estado === 'Listo');

            if (nuevos.length === 1) notificar.info(`Te asignaron el pedido #${nuevos[0].id}: ${nuevos[0].cliente.nombre}.`);
            else if (nuevos.length > 1) notificar.info(`Te asignaron ${nuevos.length} pedidos nuevos.`);

            listos.forEach((pedido) => notificar.info(`El pedido #${pedido.id} ya está listo para salir.`));
        },
        [notificar]
    );

    const cargar = useCallback(
        async ({ automatico = false } = {}) => {
            try {
                const pedidos = await getPedidos();
                if (automatico) avisarNovedades(pedidos);
                else vistos.current = new Map(pedidos.map((pedido) => [pedido.id, pedido.estado]));

                setDatos({ pedidos, cargando: false, error: null, actualizado: Date.now() });
            } catch (error) {
                if (automatico) return;
                setDatos((anterior) => ({ ...anterior, cargando: false, error }));
            }
        },
        [avisarNovedades]
    );

    const recargar = useCallback(() => {
        setDatos((anterior) => ({ ...anterior, cargando: anterior.actualizado === null, error: null }));
        return cargar();
    }, [cargar]);

    useEffect(() => {
        cargar();

        const refresco = setInterval(() => {
            if (!document.hidden) cargar({ automatico: true });
        }, REFRESCO_MS);
        const reloj = setInterval(() => setAhora(Date.now()), RELOJ_MS);

        return () => {
            clearInterval(refresco);
            clearInterval(reloj);
        };
    }, [cargar]);

    const cambiarEstado = useCallback(async (id, estado, motivo) => {
        const actualizado = await cambiarEstadoPedido(id, estado, motivo);
        vistos.current?.set(id, actualizado.estado);
        setDatos((anterior) => ({ ...anterior, pedidos: anterior.pedidos.map((pedido) => (pedido.id === id ? actualizado : pedido)) }));
        return actualizado;
    }, []);

    const valor = useMemo(() => ({ ...datos, ahora, recargar, cambiarEstado }), [datos, ahora, recargar, cambiarEstado]);

    return <RepartoDatosContext.Provider value={valor}>{children}</RepartoDatosContext.Provider>;
}

export default RepartoDatosProvider;
