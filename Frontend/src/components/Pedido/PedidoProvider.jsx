import { useCallback, useEffect, useMemo, useState } from 'react';
import PedidoContext from './PedidoContext.js';
import { leerPedidoGuardado, guardarPedido } from '../../utils/almacenamientoPedido.js';

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
                return lista.map((item) => (item.clave === clave ? { ...item, cantidad: item.cantidad + 1 } : item));
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

    const valor = useMemo(
        () => ({
            items,
            cantidadTotal: items.reduce((total, item) => total + item.cantidad, 0),
            agregar
        }),
        [items, agregar]
    );

    return <PedidoContext.Provider value={valor}>{children}</PedidoContext.Provider>;
}

export default PedidoProvider;
