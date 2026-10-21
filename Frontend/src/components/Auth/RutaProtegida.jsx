import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import EstadoMensaje from '../EstadoMensaje/EstadoMensaje.jsx';
import { rutaInicial } from '../../utils/sesion.js';

/*
 * Deja pasar solo a quien inició sesión (y, si se indica, a ciertos roles). A quien no le toca esa zona lo manda
 * a la suya (`alRechazar="inicio"`) o le explica que no tiene permiso (por defecto).
 * Mientras se verifica una sesión guardada muestra un aviso en vez de mandar al login por un instante.
 */
function RutaProtegida({ roles, alRechazar = 'mensaje', children }) {
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
        if (alRechazar === 'inicio') return <Navigate to={rutaInicial(usuario)} replace />;

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
