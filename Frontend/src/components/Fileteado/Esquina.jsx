import { ESQUINA } from './ornamentos.js';
import { Flor, Volutas } from './Trazos.jsx';

const ESPEJO = {
    'arriba-izquierda': undefined,
    'arriba-derecha': 'translate(170 0) scale(-1 1)',
    'abajo-izquierda': 'translate(0 170) scale(1 -1)',
    'abajo-derecha': 'translate(170 170) scale(-1 -1)'
};

/* Firulete de esquina para los marcos fileteados. Es decorativo. */
function Esquina({ posicion = 'arriba-izquierda', className = '' }) {
    return (
        <svg className={`esquina esquina--${posicion} ${className}`} viewBox={ESQUINA.viewBox} aria-hidden="true">
            <g transform={ESPEJO[posicion]}>
                <Volutas volutas={ESQUINA.volutas} />
                <Flor {...ESQUINA.flor} />
            </g>
        </svg>
    );
}

export default Esquina;
