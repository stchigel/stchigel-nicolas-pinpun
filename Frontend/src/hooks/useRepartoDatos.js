import { useContext } from 'react';
import RepartoDatosContext from '../components/Reparto/RepartoDatosContext.js';

/*
 * Los pedidos del repartidor que entró:
 *   const { pedidos, cargando, error, ahora, actualizado, recargar, cambiarEstado } = useRepartoDatos();
 *   cambiarEstado(id, 'Entregado')  o  cambiarEstado(id, 'Cancelado', 'No atendieron')
 */
export function useRepartoDatos() {
    const datos = useContext(RepartoDatosContext);
    if (!datos) throw new Error('useRepartoDatos debe usarse dentro de <RepartoDatosProvider>.');

    return datos;
}
