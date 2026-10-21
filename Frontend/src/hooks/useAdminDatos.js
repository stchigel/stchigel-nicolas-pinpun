import { useContext } from 'react';
import AdminDatosContext from '../components/Admin/AdminDatosContext.js';

/*
 * Los datos que comparten las pantallas del panel de administración:
 *   const { pedidos, reservas, locales, cargando, error, ahora, recargar,
 *           cambiarEstadoPedido, cambiarEstadoReserva, reemplazarLocal } = useAdminDatos();
 */
export function useAdminDatos() {
    const datos = useContext(AdminDatosContext);
    if (!datos) throw new Error('useAdminDatos debe usarse dentro de <AdminDatosProvider>.');

    return datos;
}
