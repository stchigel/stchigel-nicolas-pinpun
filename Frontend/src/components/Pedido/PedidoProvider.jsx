import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PedidoContext from './PedidoContext.js';
import { useToast } from '../../hooks/useToast.js';
import { getProductos } from '../../services/productoService.js';
import { leerPedidoGuardado, guardarPedido } from '../../utils/almacenamientoPedido.js';
import { formarCombos } from '../../utils/combos.js';
import { formatearPrecio } from '../../utils/formato.js';
import { CANTIDAD_MAXIMA } from '../../utils/pedido.js';

/* Suma lo que se devuelve al pedido (los componentes de un combo deshecho) a los renglones que ya hay */
const sumarRenglones = (lista, aSumar) =>
    aSumar.reduce(
        (actual, renglon) =>
            actual.some((item) => item.clave === renglon.clave)
                ? actual.map((item) =>
                      item.clave === renglon.clave ? { ...item, cantidad: Math.min(item.cantidad + renglon.cantidad, CANTIDAD_MAXIMA) } : item
                  )
                : [...actual, renglon],
        lista
    );

/*
 * Pedido en curso: lo que el visitante va sumando desde la carta.
 * Cada renglón es un producto en una variante (Muzzarella grande ≠ Muzzarella porción) y recuerda de qué carta es:
 * cada sucursal puede tener la suya, y un pedido solo se hace con una.
 * Se guarda en el navegador para que no se pierda al recargar.
 *
 * Si lo que se va sumando junta las partes de un combo de la carta (un café con leche y tres medialunas), el pedido las
 * reemplaza solo por el combo y avisa, con la opción de deshacerlo. El servidor aplica la misma regla al recibir el pedido.
 */
function PedidoProvider({ children }) {
    const [items, setItems] = useState(leerPedidoGuardado);
    const [combos, setCombos] = useState({ cartaId: null, lista: [] });
    const rechazados = useRef(new Set());
    const notificar = useToast();

    useEffect(() => {
        guardarPedido(items);
    }, [items]);

    /* Los combos de la carta del pedido, para saber cuándo se arma uno */
    const cartaDelPedido = items.find((item) => item.cartaId != null)?.cartaId ?? null;

    useEffect(() => {
        if (cartaDelPedido === null) return;

        const controlador = new AbortController();
        getProductos({ cartaId: cartaDelPedido, tipo: 'combo', signal: controlador.signal })
            .then((lista) => setCombos({ cartaId: cartaDelPedido, lista }))
            .catch(() => {
                /* Sin la lista no se arman combos solos; el servidor igual cobra el precio correcto */
            });

        return () => controlador.abort();
    }, [cartaDelPedido]);

    const deshacerCombo = useCallback((combo, veces, partes) => {
        rechazados.current.add(combo.id);
        setItems((lista) => {
            const clave = String(combo.id);
            const sinCombo = lista.flatMap((item) =>
                item.clave !== clave ? [item] : item.cantidad > veces ? [{ ...item, cantidad: item.cantidad - veces }] : []
            );
            return sumarRenglones(sinCombo, partes);
        });
    }, []);

    useEffect(() => {
        if (cartaDelPedido === null || combos.cartaId !== cartaDelPedido || combos.lista.length === 0) return;

        const { items: nuevos, armados } = formarCombos(items, combos.lista, { excluidos: [...rechazados.current] });
        if (armados.length === 0) return;

        setItems(nuevos);
        armados.forEach(({ combo, veces, ahorro, partes }) => {
            const ahorrado = ahorro > 0 ? `: ahorrás ${formatearPrecio(ahorro)}` : '';
            notificar.exito(`Armamos el combo ${combo.nombre}${veces > 1 ? ` (x${veces})` : ''}${ahorrado}.`, {
                etiqueta: 'Deshacer',
                onClick: () => deshacerCombo(combo, veces, partes)
            });
        });
    }, [items, combos, cartaDelPedido, notificar, deshacerCombo]);

    const agregar = useCallback((producto, variante = null) => {
        const clave = variante ? `${producto.id}:${variante.nombre}` : String(producto.id);

        setItems((lista) => {
            const existente = lista.find((item) => item.clave === clave);
            if (existente) {
                return lista.map((item) =>
                    item.clave === clave ? { ...item, cantidad: Math.min(item.cantidad + 1, CANTIDAD_MAXIMA) } : item
                );
            }

            return [
                ...lista,
                {
                    clave,
                    productoId: producto.id,
                    cartaId: producto.cartaId,
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    subcategoria: producto.subcategoria,
                    variante: variante?.nombre ?? '',
                    precio: variante?.precio ?? producto.precio,
                    cantidad: 1,
                    ...(producto.tipo === 'combo'
                        ? { componentes: producto.componentes.map(({ nombre, cantidad }) => ({ nombre, cantidad })) }
                        : {})
                }
            ];
        });
    }, []);

    /* Fija la cantidad de un renglón; 0 o menos lo saca del pedido */
    const cambiarCantidad = useCallback((clave, cantidad) => {
        setItems((lista) =>
            cantidad <= 0
                ? lista.filter((item) => item.clave !== clave)
                : lista.map((item) =>
                      item.clave === clave ? { ...item, cantidad: Math.min(cantidad, CANTIDAD_MAXIMA) } : item
                  )
        );
    }, []);

    const quitar = useCallback((clave) => {
        setItems((lista) => lista.filter((item) => item.clave !== clave));
    }, []);

    /* Vuelve a poner un renglón que se quitó, en el lugar donde estaba */
    const restaurar = useCallback((item, indice) => {
        setItems((lista) => {
            if (lista.some((actual) => actual.clave === item.clave)) return lista;
            const nueva = [...lista];
            nueva.splice(Math.min(indice, nueva.length), 0, item);
            return nueva;
        });
    }, []);

    const vaciar = useCallback(() => {
        rechazados.current.clear();
        setItems([]);
    }, []);

    const valor = useMemo(
        () => ({
            items,
            cantidadTotal: items.reduce((total, item) => total + item.cantidad, 0),
            total: items.reduce((total, item) => total + item.precio * item.cantidad, 0),
            agregar,
            cambiarCantidad,
            quitar,
            restaurar,
            vaciar
        }),
        [items, agregar, cambiarCantidad, quitar, restaurar, vaciar]
    );

    return <PedidoContext.Provider value={valor}>{children}</PedidoContext.Provider>;
}

export default PedidoProvider;
