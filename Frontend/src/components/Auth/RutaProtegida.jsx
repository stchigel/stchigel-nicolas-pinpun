import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import EstadoMensaje from '../EstadoMensaje/EstadoMensaje.jsx';

/*
 * Deja pasar solo a quien inició sesión (y, si se indica, a ciertos roles).
 * Mientras se verifica una sesión guardada muestra un aviso en vez de mandar al login por un instante.
 */
function RutaProtegida({ roles, children }) {
    const { usuario, cargando } = useAuth();
    const ubicacion = useLocation();

    if (cargando) {
        return (
            <div className="admin-verificando" role="status">
                <p>Verificando tu sesión…</p>
            </div>
        );
    }

    if (!usuario) return <Navigate to="/admin/ingresar" replace state={{ desde: ubicacion.pathname }} />;

    if (roles && !roles.includes(usuario.rol)) {
        return (
            <EstadoMensaje
                className="admin-sin-permiso"
                titulo="No tenés permiso para ver esta sección."
                descripcion="Si necesitás acceso, pedíselo a quien administra todas las sucursales."
            />
        );
    }

    return children;
}

export default RutaProtegida;
