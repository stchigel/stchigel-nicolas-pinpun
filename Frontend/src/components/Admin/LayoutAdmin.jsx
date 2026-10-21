import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import AdminDatosProvider from './AdminDatosProvider.jsx';
import Icono from '../Icono/Icono.jsx';
import Logo from '../Logo/Logo.jsx';
import { useAdminDatos } from '../../hooks/useAdminDatos.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { ESPERANDO, pedidoActivo } from '../../utils/estados.js';
import './Admin.css';

function Cantidad({ valor, etiqueta }) {
    if (!valor) return null;

    return (
        <span className="admin__cuenta">
            <span aria-hidden="true">{valor > 99 ? '99+' : valor}</span>
            <span className="visualmente-oculto"> {etiqueta}</span>
        </span>
    );
}

/* Barra lateral en pantallas grandes; en el teléfono, barra de arriba y pestañas abajo, al alcance del pulgar */
function Estructura() {
    const { usuario, salir } = useAuth();
    const { pedidos, reservas, locales } = useAdminDatos();
    const notificar = useToast();
    const navegar = useNavigate();

    const general = usuario.rol === 'general';
    const localPropio = locales.find((local) => local.id === usuario.localId);
    const activos = pedidos.filter(pedidoActivo).length;
    const pendientes = reservas.filter((reserva) => reserva.estado === ESPERANDO).length;

    const secciones = [
        { destino: 'pedidos', etiqueta: 'Pedidos', icono: 'pedidos', cuenta: activos, detalle: 'activos' },
        { destino: 'reservas', etiqueta: 'Reservas', icono: 'calendario', cuenta: pendientes, detalle: 'por confirmar' },
        ...(general ? [{ destino: 'menu', etiqueta: 'Menú', icono: 'carta' }] : []),
        { destino: 'repartidores', etiqueta: 'Repartidores', icono: 'persona' },
        { destino: 'locales', etiqueta: general ? 'Locales' : 'Mi local', icono: 'ubicacion' }
    ];

    const cerrarSesion = () => {
        salir();
        navegar('/admin/ingresar', { replace: true });
        notificar.info('Cerraste la sesión.');
    };

    return (
        <div className="admin">
            <a href="#contenido-admin" className="saltar-al-contenido">
                Saltar al contenido
            </a>

            <aside className="admin__lateral">
                <Link to="/admin" className="admin__marca" aria-label="Pin Pun, panel de administración">
                    <Logo />
                </Link>

                <nav className="admin__nav" aria-label="Secciones del panel">
                    <ul>
                        {secciones.map(({ destino, etiqueta, icono, cuenta, detalle }) => (
                            <li key={destino}>
                                <NavLink to={destino} className="admin__enlace">
                                    <Icono nombre={icono} tamano={22} />
                                    <span className="admin__etiqueta">{etiqueta}</span>
                                    <Cantidad valor={cuenta} etiqueta={detalle} />
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="admin__usuario">
                    <p className="admin__nombre">
                        {usuario.nombre} {usuario.apellido}
                    </p>
                    <p className="admin__rol">{general ? 'Todas las sucursales' : `Sucursal ${localPropio?.nombre ?? ''}`}</p>
                    <div className="admin__acciones">
                        <Link to="/" className="admin__texto-boton">
                            Ver el sitio
                        </Link>
                        <button type="button" className="admin__texto-boton" onClick={cerrarSesion}>
                            <Icono nombre="salir" tamano={18} />
                            Salir
                        </button>
                    </div>
                </div>
            </aside>

            <main id="contenido-admin" className="admin__contenido">
                <Outlet />
            </main>
        </div>
    );
}

function LayoutAdmin() {
    return (
        <AdminDatosProvider>
            <Estructura />
        </AdminDatosProvider>
    );
}

export default LayoutAdmin;
