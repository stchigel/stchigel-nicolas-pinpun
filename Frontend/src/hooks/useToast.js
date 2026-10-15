import { useContext } from 'react';
import ToastContext from '../components/Toast/ToastContext.js';

/*
 * Devuelve el notificador del sitio:
 *   const notificar = useToast();
 *   notificar.exito('Pedido enviado');
 *   notificar.error('No pudimos guardar el producto');
 */
export function useToast() {
    const notificar = useContext(ToastContext);
    if (!notificar) throw new Error('useToast debe usarse dentro de <ToastProvider>.');

    return notificar;
}
