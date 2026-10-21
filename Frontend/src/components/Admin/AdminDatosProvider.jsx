import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminDatosContext from './AdminDatosContext.js';
import { useToast } from '../../hooks/useToast.js';
import { getLocales } from '../../services/localService.js';
import { asignarRepartidor, cambiarEstadoPedido, getPedidos } from '../../services/pedidoService.js';
import { getRepartidores } from '../../services/repartidorService.js';
import { cambiarEstadoReserva, getReservas } from '../../services/reservaService.js';
import { ETIQUETA_TIPO } from '../../utils/estados.js';

const REFRESCO_MS = 20 * 1000;
const RELOJ_MS = 30 * 1000;

const reemplazar = (lista, nuevo) => lista.map((item) => (item.id === nuevo.id ? nuevo : item));

/*
 * Pedidos, reservas y locales del panel, cargados una sola vez para todas sus pantallas.
 * Se vuelven a pedir cada 20 segundos mientras la pestaña está a la vista, y avisan cuando llega algo nuevo.
 * `ahora` se actualiza cada 30 segundos para que los "hace 4 min" no se queden viejos.
 */
function AdminDatosProvider({ children }) {
    const notificar = useToast();
    const [datos, setDatos] = useState({
        pedidos: [],
        reservas: [],
        locales: [],
        repartidores: [],
        cargando: true,
        error: null,
        actualizado: null
    });
    const [ahora, setAhora] = useState(() => Date.now());
    const vistos = useRef(null);

    const avisarNovedades = useCallback(
        (pedidos, reservas) => {
            if (!vistos.current) {
                vistos.current = { pedidos: new Set(pedidos.map((p) => p.id)), reservas: new Set(reservas.map((r) => r.id)) };
                return;
            }

            const nuevosPedidos = pedidos.filter((pedido) => !vistos.current.pedidos.has(pedido.id));
            const nuevasReservas = reservas.filter((reserva) => !vistos.current.reservas.has(reserva.id));
            vistos.current = { pedidos: new Set(pedidos.map((p) => p.id)), reservas: new Set(reservas.map((r) => r.id)) };

            if (nuevosPedidos.length === 1) {
                const [pedido] = nuevosPedidos;
                notificar.info(`Llegó el pedido #${pedido.id}: ${ETIQUETA_TIPO[pedido.tipo].toLowerCase()} de ${pedido.cliente.nombre}.`);
            } else if (nuevosPedidos.length > 1) {
                notificar.info(`Llegaron ${nuevosPedidos.length} pedidos nuevos.`);
            }

            if (nuevasReservas.length === 1) {
                const [reserva] = nuevasReservas;
                notificar.info(`Nueva reserva de ${reserva.cliente.nombre} para ${reserva.cantPersonas}.`);
            } else if (nuevasReservas.length > 1) {
                notificar.info(`Llegaron ${nuevasReservas.length} reservas nuevas.`);
            }
        },
        [notificar]
    );

    /* En un refresco automático, un fallo no borra lo que ya se estaba viendo: solo se avisa si es el primero */
    const cargar = useCallback(
        async ({ automatico = false } = {}) => {
            try {
                const [pedidos, reservas, locales, repartidores] = await Promise.all([
                    getPedidos(),
                    getReservas(),
                    getLocales(),
                    getRepartidores()
                ]);
                if (automatico) avisarNovedades(pedidos, reservas);
                else vistos.current = { pedidos: new Set(pedidos.map((p) => p.id)), reservas: new Set(reservas.map((r) => r.id)) };

                setDatos({ pedidos, reservas, locales, repartidores, cargando: false, error: null, actualizado: Date.now() });
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

    const cambiarPedido = useCallback(async (id, estado) => {
        const actualizado = await cambiarEstadoPedido(id, estado);
        setDatos((anterior) => ({ ...anterior, pedidos: reemplazar(anterior.pedidos, actualizado) }));
        return actualizado;
    }, []);

    /* `asignacion`: { repartidorId }, { automatico: true } o { repartidorId: null } para quitarlo */
    const asignarPedido = useCallback(async (id, asignacion) => {
        const actualizado = await asignarRepartidor(id, asignacion);
        setDatos((anterior) => ({ ...anterior, pedidos: reemplazar(anterior.pedidos, actualizado) }));
        return actualizado;
    }, []);

    const reemplazarRepartidor = useCallback((repartidor) => {
        setDatos((anterior) => ({
            ...anterior,
            repartidores: anterior.repartidores.some((item) => item.id === repartidor.id)
                ? reemplazar(anterior.repartidores, repartidor)
                : [...anterior.repartidores, repartidor]
        }));
    }, []);

    const cambiarReserva = useCallback(async (id, estado) => {
        const actualizada = await cambiarEstadoReserva(id, estado);
        setDatos((anterior) => ({ ...anterior, reservas: reemplazar(anterior.reservas, actualizada) }));
        return actualizada;
    }, []);

    const reemplazarLocal = useCallback((local) => {
        setDatos((anterior) => ({ ...anterior, locales: reemplazar(anterior.locales, local) }));
    }, []);

    const valor = useMemo(
        () => ({
            ...datos,
            ahora,
            recargar,
            cambiarEstadoPedido: cambiarPedido,
            cambiarEstadoReserva: cambiarReserva,
            asignarPedido,
            reemplazarRepartidor,
            reemplazarLocal
        }),
        [datos, ahora, recargar, cambiarPedido, cambiarReserva, asignarPedido, reemplazarRepartidor, reemplazarLocal]
    );

    return <AdminDatosContext.Provider value={valor}>{children}</AdminDatosContext.Provider>;
}

export default AdminDatosProvider;
