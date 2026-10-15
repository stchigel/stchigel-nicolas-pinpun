import { useId } from 'react';
import './Fileteado.css';

/* Cinta de cartel con las puntas dobladas y el texto en letra cursiva. Variantes: "roja" y "verde". */
function Cinta({ children, variante = 'roja', className = '' }) {
    const idCurva = `cinta-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <svg className={`cinta cinta--${variante} ${className}`} viewBox="0 0 420 110" role="img" aria-label={children}>
            <path className="cinta__punta" d="M60 34 L6 34 L24 58 L6 82 L66 82 Z" />
            <path className="cinta__punta" d="M360 34 L414 34 L396 58 L414 82 L354 82 Z" />
            <path className="cinta__doblez" d="M60 34 L66 82 L80 70 Z" />
            <path className="cinta__doblez" d="M360 34 L354 82 L340 70 Z" />
            <path className="cinta__banda" d="M60 22 Q210 52 360 22 L354 70 Q210 100 66 70 Z" />
            <path className="cinta__filete" d="M64 30 Q210 60 356 30" />
            <path className="cinta__filete" d="M68 63 Q210 93 352 63" />
            <path id={idCurva} d="M62 50 Q210 80 358 50" fill="none" />
            <text className="cinta__texto">
                <textPath href={`#${idCurva}`} startOffset="50%" textAnchor="middle">
                    {children}
                </textPath>
            </text>
        </svg>
    );
}

export default Cinta;
