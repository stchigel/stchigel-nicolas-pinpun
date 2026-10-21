import { useCallback, useEffect, useState } from 'react';
import { getSeguimiento } from '../services/seguimientoService.js';

const REFRESCO_MS = 6000;
const RELOJ_MS = 5000;
const TERMINADOS = ['Entregado', 'Retirado', 'Cancelado'];

/*
 * El pedido de un cliente, al día mientras no termine: se vuelve a pedir cada 6 segundos con la pestaña a la vista
 * y deja de pedirse cuando el pedido se entregó, se retiró o se canceló.
 * Si falla un refresco, se sigue mostrando lo último que se supo; el error solo aparece si nunca se pudo cargar.
 */
export function useSeguimiento(codigo) {
    const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
    const [ahora, setAhora] = useState(() => Date.now());
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        const controlador = new AbortController();
        let temporizador;
        let vigente = true;

        const traer = async () => {
            if (document.hidden) {
                temporizador = setTimeout(traer, REFRESCO_MS);
                return;
            }

            try {
                const datos = await getSeguimiento(codigo, { signal: controlador.signal });
                if (!vigente) return;

                setEstado({ datos, cargando: false, error: null });
                if (!TERMINADOS.includes(datos.estado)) temporizador = setTimeout(traer, REFRESCO_MS);
            } catch (error) {
                if (!vigente || error.name === 'AbortError') return;

                setEstado((anterior) => (anterior.datos ? anterior : { datos: null, cargando: false, error }));
                temporizador = setTimeout(traer, REFRESCO_MS * 2);
            }
        };

        setEstado((anterior) => ({ ...anterior, cargando: anterior.datos === null, error: null }));
        traer();

        return () => {
            vigente = false;
            controlador.abort();
            clearTimeout(temporizador);
        };
    }, [codigo, intento]);

    useEffect(() => {
        const reloj = setInterval(() => setAhora(Date.now()), RELOJ_MS);
        return () => clearInterval(reloj);
    }, []);

    const reintentar = useCallback(() => setIntento((n) => n + 1), []);

    return { ...estado, ahora, reintentar };
}
