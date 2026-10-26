import { useMemo } from 'react';
import { useApi } from './useApi.js';
import { useSucursal } from './useSucursal.js';
import { getProductos, getProductosDestacados } from '../services/productoService.js';

/*
 * Los platos de la carta que corresponde a la sucursal elegida y a lo que viene a hacer (pedir o mirar):
 *   const { datos: productos, cargando, error, reintentar } = useProductosDeSucursal({ destacados: true });
 * Espera a saber la sucursal para no pedir dos veces. Si no se pudieron traer los locales,
 * muestra la carta original en vez de dejar el sitio sin platos.
 */
export function useProductosDeSucursal({ destacados = false } = {}) {
    const { local, canal, cargando: cargandoLocales } = useSucursal();
    const localId = local?.id;

    const servicio = useMemo(() => {
        if (cargandoLocales) return null;

        const traer = destacados ? getProductosDestacados : getProductos;
        return (opciones) => traer({ ...opciones, localId, canal: localId ? canal : undefined });
    }, [cargandoLocales, destacados, localId, canal]);

    return useApi(servicio);
}
