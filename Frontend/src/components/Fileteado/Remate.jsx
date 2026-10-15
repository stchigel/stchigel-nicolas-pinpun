import { REMATE } from './ornamentos.js';
import { Flor, Volutas } from './Trazos.jsx';
import './Fileteado.css';

/* Remate simétrico (dos volutas y una flor) que corona los títulos. Es decorativo. */
function Remate({ className = '' }) {
    return (
        <svg className={`remate ${className}`} viewBox={REMATE.viewBox} aria-hidden="true">
            <g className="remate__ala remate__ala--derecha">
                <Volutas volutas={REMATE.volutas} />
            </g>
            <g className="remate__ala remate__ala--izquierda" transform="scale(-1 1)">
                <Volutas volutas={REMATE.volutas} />
            </g>
            <Flor {...REMATE.flor} />
        </svg>
    );
}

export default Remate;
