import { useContext } from 'react';
import AuthContext from '../components/Auth/AuthContext.js';

/*
 * Devuelve la sesión del panel de administración:
 *   const { usuario, cargando, ingresar, salir } = useAuth();
 * `usuario` es { mail, nombre, apellido, rol: 'general' | 'sucursal', localId } o null.
 */
export function useAuth() {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');

    return auth;
}
