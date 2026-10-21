import { Link } from 'react-router-dom';
import Mantel from '../Mantel/Mantel.jsx';
import LogoTexto from '../LogoTexto/LogoTexto.jsx';
import Logo from '../Logo/Logo.jsx';
import { useRevelar } from '../../hooks/useRevelar.js';
import {
    ANIO_FUNDACION,
    ENLACES_DERECHA,
    ENLACES_IZQUIERDA,
    INSTAGRAM_PRINCIPAL,
    urlInstagram
} from '../../utils/sitio.js';
import './Footer.css';

/* Cierre de todas las páginas: el cartel de Pin Pun otra vez, sobre los azulejos del salón. */
function Footer() {
    const ref = useRevelar();
    const anioActual = new Date().getFullYear();

    return (
        <footer id="contacto" className="footer" ref={ref}>
            <Mantel />
            <div className="footer__cuerpo contenedor">
               
                <div className="footer__columnas">
                    <nav className="footer__columna" aria-label="Secundaria">
                        <h2 className="footer__titulo">Navegá</h2>
                        <ul>
                            {[...ENLACES_IZQUIERDA, ...ENLACES_DERECHA].map(({ etiqueta, destino }) => (
                                <li key={destino}>
                                    <Link to={destino} className="footer__enlace">
                                        {etiqueta}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="footer__columna">
                        <h2 className="footer__titulo">Pedí o reservá</h2>
                        <ul>
                            <li>
                                <Link to="/carta" className="footer__enlace">
                                    Pedí delivery o retiro
                                </Link>
                            </li>
                            <li>
                                <Link to="/reservas" className="footer__enlace">
                                    Reservá una mesa
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__columna">
                        <h2 className="footer__titulo">Seguinos</h2>
                        <a
                            href={urlInstagram(INSTAGRAM_PRINCIPAL)}
                            className="footer__enlace"
                            target="_blank"
                            rel="noreferrer"
                        >
                            @{INSTAGRAM_PRINCIPAL}
                            <span className="visualmente-oculto"> (se abre en otra pestaña)</span>
                        </a>
                        <p className="footer__suave">Cada local tiene su cuenta: la vas a encontrar en Locales.</p>
                    </div>
                </div>

                <p className="footer__legal">
                    Pin Pun © {anioActual}. La pizzería más antigua de Buenos Aires, en Av. Corrientes 3954 desde{' '}
                    {ANIO_FUNDACION}.
                </p>
                <Link to="/admin/ingresar" className="footer__enlace footer__acceso">
                    Acceso del personal
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
