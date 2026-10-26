import { useContext } from 'react';
import SucursalContext from '../components/Sucursal/SucursalContext.js';

/*
 * Devuelve la sucursal con la que se está navegando y para qué:
 *   const { local, locales, modo, puedePedir, canal, elegir, ... } = useSucursal();
 *   elegir({ localId: 3 }); elegir({ modo: 'ver' }); elegir({ localId: 3, modo: 'pedir' });
 */
export function useSucursal() {
    const sucursal = useContext(SucursalContext);
    if (!sucursal) throw new Error('useSucursal debe usarse dentro de <SucursalProvider>.');

    return sucursal;
}
