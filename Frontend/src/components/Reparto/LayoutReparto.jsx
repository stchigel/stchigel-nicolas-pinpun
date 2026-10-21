import { useCallback } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import RepartoDatosProvider from './RepartoDatosProvider.jsx';
import Icono from '../Icono/Icono.jsx';
import Logo from '../Logo/Logo.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { getLocal } from '../../services/localService.js';
import './Reparto.css';

/* Marco del portal de reparto: una barra verde con quién es y de qué sucursal, y las entregas debajo, en una sola columna */
function LayoutReparto() {
    const { usuario, salir } = useAuth();
    const notificar = useToast();
    const navegar = useNavigate();
    const traerLocal = useCallback((opciones) => getLocal(usuario.localId, opciones), [usuario.localId]);
    const { datos: local } = useApi(traerLocal);

    const cerrarSesion = () => {
        salir();
        navegar('/admin/ingresar', { replace: true });
        notificar.info('Cerraste la sesión.');
    };

    return (
        <div className="reparto">
            <a href="#entregas" className="saltar-al-contenido">
                Saltar a las entregas
            </a>

            <header className="reparto__barra">
                <Link to="/reparto" className="reparto__marca" aria-label="Pin Pun, portal de reparto">
                    <Logo />
                </Link>
                <div className="reparto__usuario">
                    <p className="reparto__nombre">{usuario.nombre}</p>
                    <p className="reparto__sucursal">{local ? `Sucursal ${local.nombre}` : 'Reparto'}</p>
                </div>
                <button type="button" className="reparto__salir" onClick={cerrarSesion}>
                    <Icono nombre="salir" tamano={20} />
                    Salir
                </button>
            </header>

            <main id="entregas" className="reparto__contenido">
                <RepartoDatosProvider>
                    <Outlet />
                </RepartoDatosProvider>
            </main>
        </div>
    );
}

export default LayoutReparto;
