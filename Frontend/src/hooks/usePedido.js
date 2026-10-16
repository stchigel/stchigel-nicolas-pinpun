import { useContext } from 'react';
import PedidoContext from '../components/Pedido/PedidoContext.js';

/*
 * Devuelve el pedido en curso:
 *   const { items, cantidadTotal, agregar } = usePedido();
 *   agregar(producto, variante);
 */
export function usePedido() {
    const pedido = useContext(PedidoContext);
    if (!pedido) throw new Error('usePedido debe usarse dentro de <PedidoProvider>.');

    return pedido;
}
