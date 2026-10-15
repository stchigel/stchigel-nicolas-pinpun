import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo/Logo.jsx';
import Icono from '../Icono/Icono.jsx';
import { ENLACES_DERECHA, ENLACES_IZQUIERDA } from '../../utils/sitio.js';
import './Navbar.css';

function ListaEnlaces({ enlaces, className, onNavegar }) {
    return (
        <ul className={className}>
            {enlaces.map(({ etiqueta, destino }) => (
                <li key={destino}>
                    <Link to={destino} className="navbar__enlace" onClick={onNavegar}>
                        {etiqueta}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

/*
 * Barra principal, como en el boceto: dos enlaces a cada lado del logo
 * y el carrito a la derecha. En pantallas chicas los enlaces pasan a un panel desplegable.
 * `variante` "rojo" se usa sobre la portada; "hueso" en el resto de las páginas.
 */
function Navbar({ variante = 'hueso' }) {
    const [abierto, setAbierto] = useState(false);
    const { pathname, hash } = useLocation();

    useEffect(() => {
        setAbierto(false);
    }, [pathname, hash]);

    useEffect(() => {
        if (!abierto) return;
        const alPresionar = (evento) => evento.key === 'Escape' && setAbierto(false);
        document.addEventListener('keydown', alPresionar);
        return () => document.removeEventListener('keydown', alPresionar);
    }, [abierto]);

    const cerrar = () => setAbierto(false);

    return (
        <header className={`navbar navbar--${variante}`}>
            <nav className="navbar__barra contenedor" aria-label="Principal">
                <ListaEnlaces enlaces={ENLACES_IZQUIERDA} className="navbar__grupo" />

                <Link to="/" className="navbar__logo" aria-label="Pin Pun, ir al inicio">
                    <Logo />
                </Link>

                <div className="navbar__derecha">
                    <ListaEnlaces enlaces={ENLACES_DERECHA} className="navbar__grupo" />
                    <Link to="/carrito" className="navbar__carrito" aria-label="Ver carrito">
                        <Icono nombre="carrito" tamano={26} />
                    </Link>
                    <button
                        type="button"
                        className="navbar__alternar"
                        aria-expanded={abierto}
                        aria-controls="navegacion-movil"
                        onClick={() => setAbierto((valor) => !valor)}
                    >
                        <Icono nombre={abierto ? 'cerrar' : 'menu'} tamano={26} />
                        <span className="visualmente-oculto">{abierto ? 'Cerrar navegación' : 'Abrir navegación'}</span>
                    </button>
                </div>
            </nav>

            <div id="navegacion-movil" className="navbar__panel" data-abierto={abierto || undefined} hidden={!abierto}>
                <ListaEnlaces
                    enlaces={[...ENLACES_IZQUIERDA, ...ENLACES_DERECHA]}
                    className="navbar__panel-lista contenedor"
                    onNavegar={cerrar}
                />
            </div>
        </header>
    );
}

export default Navbar;
