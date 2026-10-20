import { useCallback, useEffect, useMemo, useState } from 'react';
import PedidoContext from './PedidoContext.js';
import { leerPedidoGuardado, guardarPedido } from '../../utils/almacenamientoPedido.js';
import { CANTIDAD_MAXIMA } from '../../utils/pedido.js';

/*
 * Pedido en curso: lo que el visitante va sumando desde la carta.
 * Cada renglón es un producto en una variante (Muzzarella grande ≠ Muzzarella porción).
 * Se guarda en el navegador para que no se pierda al recargar.
 */
function PedidoProvider({ children }) {
    const [items, setItems] = useState(leerPedidoGuardado);

    useEffect(() => {
        guardarPedido(items);
    }, [items]);

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
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    subcategoria: producto.subcategoria,
                    variante: variante?.nombre ?? '',
                    precio: variante?.precio ?? producto.precio,
                    cantidad: 1
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

    const vaciar = useCallback(() => setItems([]), []);

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
