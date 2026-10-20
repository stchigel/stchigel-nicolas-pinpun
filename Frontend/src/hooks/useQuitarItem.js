import { useCallback } from 'react';
import { usePedido } from './usePedido.js';
import { useToast } from './useToast.js';
import { nombreItem } from '../utils/carta.js';

/*
 * Saca un renglón del pedido y avisa con "Deshacer": volver atrás cuesta menos
 * que pedir confirmación cada vez, y no frena a quien se equivocó de renglón.
 */
export function useQuitarItem() {
    const { items, quitar, restaurar } = usePedido();
    const notificar = useToast();

    return useCallback(
        (item) => {
            const indice = items.findIndex((actual) => actual.clave === item.clave);
            quitar(item.clave);
            notificar.info(`Quitaste ${nombreItem(item)} del pedido.`, {
                etiqueta: 'Deshacer',
                onClick: () => restaurar(item, indice)
            });
        },
        [items, quitar, restaurar, notificar]
    );
}
