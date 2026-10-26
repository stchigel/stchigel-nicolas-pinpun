import { useCallback, useMemo, useState } from 'react';
import SucursalContext from './SucursalContext.js';
import { useApi } from '../../hooks/useApi.js';
import { usePedido } from '../../hooks/usePedido.js';
import { getLocales } from '../../services/localService.js';
import { guardarLocal, guardarModo, leerLocalGuardado, leerModoGuardado } from '../../utils/almacenamientoSucursal.js';
import { INSTAGRAM_PRINCIPAL } from '../../utils/sitio.js';

/* Qué carta se ve en cada caso: la del salón para mirar antes de ir, la de delivery para pedir (el retiro usa la misma) */
const canalDe = (modo) => (modo === 'ver' ? 'salon' : 'delivery');

/*
 * La sucursal con la que navega el visitante y para qué viene: a pedir (delivery o retiro) o a mirar la carta
 * antes de ir al local. De eso depende qué carta se muestra, porque cada sucursal puede tener la suya y una
 * distinta para el salón. Mientras no haya elegido nada rige la de Corrientes, la de siempre, y se puede pedir.
 *
 * El pedido en curso es de una carta: si se cambia a una sucursal con otra, lo que ya se sumó no existiría ahí.
 * En ese caso el cambio queda `pendiente` hasta que el visitante confirme que se vacía el pedido.
 */
function SucursalProvider({ children }) {
    const { datos: locales, cargando, error, reintentar } = useApi(getLocales);
    const { items, vaciar } = usePedido();
    const [localId, setLocalId] = useState(leerLocalGuardado);
    const [modoElegido, setModoElegido] = useState(leerModoGuardado);
    const [eligiendo, setEligiendo] = useState(false);
    const [pendiente, setPendiente] = useState(null);

    const local = useMemo(
        () =>
            locales?.find((item) => item.id === localId) ??
            locales?.find((item) => item.instagram === INSTAGRAM_PRINCIPAL) ??
            locales?.[0] ??
            null,
        [locales, localId]
    );

    const modo = modoElegido ?? 'pedir';
    const canal = canalDe(modo);

    /* Los renglones viejos, de antes de que se guardara la carta, no cuentan: no se los puede ubicar */
    const cartaDelPedido = items.find((item) => item.cartaId != null)?.cartaId ?? null;

    const aplicar = useCallback((cambio) => {
        if (cambio.localId !== undefined) {
            setLocalId(cambio.localId);
            guardarLocal(cambio.localId);
        }
        if (cambio.modo !== undefined) {
            setModoElegido(cambio.modo);
            guardarModo(cambio.modo);
        }
        setEligiendo(false);
    }, []);

    /* Cambia la sucursal y/o el modo; si el pedido en curso no entra en la carta nueva, pide confirmación antes */
    const elegir = useCallback(
        (cambio) => {
            const destino = cambio.localId === undefined ? local : locales?.find((item) => item.id === cambio.localId);
            const destinoModo = cambio.modo ?? modo;
            const cartaDestino = destino?.cartas?.[canalDe(destinoModo)];
            const choca = destinoModo === 'pedir' && cartaDelPedido !== null && cartaDestino !== cartaDelPedido;

            if (choca) setPendiente({ ...cambio, nombreLocal: destino?.nombre ?? '' });
            else aplicar(cambio);
        },
        [aplicar, cartaDelPedido, local, locales, modo]
    );

    const confirmarPendiente = useCallback(() => {
        if (!pendiente) return;
        vaciar();
        aplicar(pendiente);
        setPendiente(null);
    }, [aplicar, pendiente, vaciar]);

    const cancelarPendiente = useCallback(() => setPendiente(null), []);
    const abrirElegir = useCallback(() => setEligiendo(true), []);
    const cerrarElegir = useCallback(() => setEligiendo(false), []);

    /* Los locales a los que se les puede pedir lo que ya hay en el pedido (todos, si todavía no hay nada) */
    const aptosParaElPedido = useCallback(
        (lista) => (cartaDelPedido === null ? lista : lista.filter((item) => item.cartas?.delivery === cartaDelPedido)),
        [cartaDelPedido]
    );

    const valor = useMemo(
        () => ({
            locales,
            cargando,
            error,
            reintentar,
            local,
            modo,
            canal,
            yaEligio: modoElegido !== null,
            puedePedir: modo === 'pedir',
            mostrarSelector: modoElegido === null || eligiendo,
            pendiente,
            elegir,
            confirmarPendiente,
            cancelarPendiente,
            abrirElegir,
            cerrarElegir,
            aptosParaElPedido
        }),
        [
            locales,
            cargando,
            error,
            reintentar,
            local,
            modo,
            canal,
            modoElegido,
            eligiendo,
            pendiente,
            elegir,
            confirmarPendiente,
            cancelarPendiente,
            abrirElegir,
            cerrarElegir,
            aptosParaElPedido
        ]
    );

    return <SucursalContext.Provider value={valor}>{children}</SucursalContext.Provider>;
}

export default SucursalProvider;
