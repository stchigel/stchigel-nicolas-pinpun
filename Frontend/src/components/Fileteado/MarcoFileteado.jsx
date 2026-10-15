import Esquina from './Esquina.jsx';
import './Fileteado.css';

const POSICIONES = ['arriba-izquierda', 'arriba-derecha', 'abajo-izquierda', 'abajo-derecha'];

/*
 * Marco de cartel fileteado: doble filete (dorado y rojo) con firuletes en las cuatro esquinas.
 * `as` permite usarlo como section, article, div, etc.
 */
function MarcoFileteado({ as: Etiqueta = 'div', className = '', children, ...props }) {
    return (
        <Etiqueta className={`marco-fileteado ${className}`} {...props}>
            {POSICIONES.map((posicion) => (
                <Esquina key={posicion} posicion={posicion} className="marco-fileteado__esquina" />
            ))}
            <div className="marco-fileteado__contenido">{children}</div>
        </Etiqueta>
    );
}

export default MarcoFileteado;
