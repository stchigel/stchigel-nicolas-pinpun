import { Link } from 'react-router-dom';
import Mantel from '../Mantel/Mantel.jsx';
import TextoAjustado from '../TextoAjustado/TextoAjustado.jsx';
import {
    ANIO_FUNDACION,
    ENLACES_DERECHA,
    ENLACES_IZQUIERDA,
    INSTAGRAM_PRINCIPAL,
    urlInstagram
} from '../../utils/sitio.js';
import './Footer.css';

/* Cierre de todas las páginas: el nombre vuelve a todo el ancho, en hueso sobre rojo. */
function Footer() {
    const anioActual = new Date().getFullYear();

    return (
        <footer id="contacto" className="footer">
            <Mantel />
            <div className="footer__cuerpo contenedor">
                <div className="footer__columnas">
                    <div className="footer__columna">
                        <h2 className="footer__titulo">Pin Pun</h2>
                        <p>Bodegón porteño desde {ANIO_FUNDACION}.</p>
                        <p className="footer__suave">La pizzería más antigua de Buenos Aires.</p>
                    </div>

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
                                <Link to="/menu" className="footer__enlace">
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
                    </div>
                </div>

                <TextoAjustado className="footer__marca" aria-hidden="true">
                    PIN PUN
                </TextoAjustado>

                <p className="footer__legal">
                    Pin Pun © {anioActual}. Av. Corrientes 3954, Almagro, desde {ANIO_FUNDACION}.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
