import { useId, useLayoutEffect, useRef, useState } from 'react';
import './Fileteado.css';

const PROFUNDIDAD = 9;
const MARGEN = 16;

/*
 * Letras de cartel pintado: relleno con degradé, contorno oscuro,
 * filete dorado y una sombra en bloque que les da relieve.
 * El viewBox se ajusta a lo que mide el texto cuando carga la tipografía.
 */
function LetraFileteada({ texto, className = '', etiqueta }) {
    const medidaRef = useRef(null);
    const [caja, setCaja] = useState('0 -170 760 220');
    const idDegrade = `letra-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

    useLayoutEffect(() => {
        const medir = () => {
            const medida = medidaRef.current?.getBBox();
            if (!medida?.width) return;
            setCaja(
                [
                    medida.x - MARGEN,
                    medida.y - MARGEN,
                    medida.width + MARGEN * 2 + PROFUNDIDAD,
                    medida.height + MARGEN * 2 + PROFUNDIDAD
                ].join(' ')
            );
        };

        medir();
        document.fonts?.ready.then(medir);
    }, [texto]);

    return (
        <svg className={`letra-fileteada ${className}`} viewBox={caja} role="img" aria-label={etiqueta ?? texto}>
            <defs>
                <linearGradient id={idDegrade} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--letra-arriba)" />
                    <stop offset="0.55" stopColor="var(--letra-medio)" />
                    <stop offset="1" stopColor="var(--letra-abajo)" />
                </linearGradient>
            </defs>
            <g className="letra-fileteada__texto">
                {Array.from({ length: PROFUNDIDAD }, (_, i) => (
                    <text key={i} x={i + 1} y={i + 1} className="letra-fileteada__relieve">
                        {texto}
                    </text>
                ))}
                <text className="letra-fileteada__contorno">{texto}</text>
                <text className="letra-fileteada__relleno" fill={`url(#${idDegrade})`}>
                    {texto}
                </text>
                <text ref={medidaRef} className="letra-fileteada__filete">
                    {texto}
                </text>
            </g>
        </svg>
    );
}

export default LetraFileteada;
