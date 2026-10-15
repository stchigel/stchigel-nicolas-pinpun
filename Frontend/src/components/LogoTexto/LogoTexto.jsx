import TextoAjustado from '../TextoAjustado/TextoAjustado.jsx';
import { obtenerImagenMarca } from '../../utils/imagenesMarca.js';
import './LogoTexto.css';

const urlTexto = obtenerImagenMarca('texto');

/*
 * Las letras del logo (sin el óvalo) a todo el ancho de su contenedor.
 * Usa src/assets/logo/texto.png; mientras no exista, escribe "PIN PUN"
 * en la tipografía de titulares como reemplazo provisorio.
 */
function LogoTexto({ as = 'p', etiqueta = 'Pin Pun', className = '', ...props }) {
    if (urlTexto) {
        const Etiqueta = as;
        return (
            <Etiqueta className={`logo-texto ${className}`} {...props}>
                <img className="logo-texto__imagen" src={urlTexto} alt={etiqueta} />
            </Etiqueta>
        );
    }

    return (
        <TextoAjustado as={as} className={`logo-texto logo-texto--provisorio ${className}`} aria-label={etiqueta} {...props}>
            PIN PUN
        </TextoAjustado>
    );
}

export default LogoTexto;
