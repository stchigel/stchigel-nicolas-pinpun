import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo/Logo.jsx';
import Icono from '../Icono/Icono.jsx';
import CarritoEmergente from '../Carrito/CarritoEmergente.jsx';
import { usePedido } from '../../hooks/usePedido.js';
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
 * El carrito abre un resumen del pedido que cuelga de la barra; en la página del carrito
 * ese resumen sobra, así que ahí es un enlace común.
 */
function Navbar() {
    const [abierto, setAbierto] = useState(false);
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const botonCarritoRef = useRef(null);
    const emergenteRef = useRef(null);
    const { pathname, hash } = useLocation();
    const enCarrito = pathname === '/carrito';

    useEffect(() => {
        setAbierto(false);
        setCarritoAbierto(false);
    }, [pathname, hash]);

    useEffect(() => {
        if (!abierto && !carritoAbierto) return;

        const alPresionar = (evento) => {
            if (evento.key !== 'Escape') return;
            /* Si el foco quedó dentro del resumen, vuelve al carrito para no perderse */
            if (carritoAbierto && emergenteRef.current?.contains(document.activeElement)) botonCarritoRef.current?.focus();
            setAbierto(false);
            setCarritoAbierto(false);
        };
        document.addEventListener('keydown', alPresionar);
        return () => document.removeEventListener('keydown', alPresionar);
    }, [abierto, carritoAbierto]);

    /* Tocar afuera del resumen lo cierra; tocar el carrito lo alterna por su cuenta */
    useEffect(() => {
        if (!carritoAbierto) return;

        const alTocar = (evento) => {
            if (emergenteRef.current?.contains(evento.target) || botonCarritoRef.current?.contains(evento.target)) return;
            setCarritoAbierto(false);
        };
        document.addEventListener('pointerdown', alTocar);
        return () => document.removeEventListener('pointerdown', alTocar);
    }, [carritoAbierto]);

    const cerrar = () => setAbierto(false);
    const cerrarCarrito = () => setCarritoAbierto(false);

    const alternarMenu = () => {
        setCarritoAbierto(false);
        setAbierto((valor) => !valor);
    };

    const alternarCarrito = () => {
        setAbierto(false);
        setCarritoAbierto((valor) => !valor);
    };

    const { cantidadTotal } = usePedido();
    const etiquetaCarrito =
        cantidadTotal > 0
            ? `Ver carrito (${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'})`
            : 'Ver carrito';

    const contenidoCarrito = (
        <>
            <Icono nombre="carrito" tamano={26} />
            {cantidadTotal > 0 && (
                <span key={cantidadTotal} className="navbar__cantidad" aria-hidden="true">
                    {cantidadTotal > 99 ? '99+' : cantidadTotal}
                </span>
            )}
        </>
    );

    return (
        <header className="navbar">
            <nav className="navbar__barra contenedor" aria-label="Principal">
                <ListaEnlaces enlaces={ENLACES_IZQUIERDA} className="navbar__grupo" />

                <Link to="/" className="navbar__logo" aria-label="Pin Pun, ir al inicio">
                    <Logo />
                </Link>

                <div className="navbar__derecha">
                    <ListaEnlaces enlaces={ENLACES_DERECHA} className="navbar__grupo" />
                    {enCarrito ? (
                        <Link to="/carrito" className="navbar__carrito" aria-label={etiquetaCarrito} aria-current="page">
                            {contenidoCarrito}
                        </Link>
                    ) : (
                        <>
                            <button
                                ref={botonCarritoRef}
                                type="button"
                                className="navbar__carrito"
                                aria-label={etiquetaCarrito}
                                aria-expanded={carritoAbierto}
                                aria-controls="carrito-emergente"
                                data-abierto={carritoAbierto || undefined}
                                onClick={alternarCarrito}
                            >
                                {contenidoCarrito}
                            </button>
                            <div ref={emergenteRef} className="navbar__emergente">
                                <CarritoEmergente id="carrito-emergente" abierto={carritoAbierto} onCerrar={cerrarCarrito} />
                            </div>
                        </>
                    )}
                    <button
                        type="button"
                        className="navbar__alternar"
                        aria-expanded={abierto}
                        aria-controls="navegacion-movil"
                        onClick={alternarMenu}
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
