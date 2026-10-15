import { useId } from 'react';

/*
 * Dibujos que ocupan el lugar de una foto mientras no exista la real:
 * - "pizza": una muzza al molde vista desde arriba, sobre el mantel.
 * - "sello": el mantel con el óvalo de la marca, para cualquier otro plato.
 */
function Mantel({ id }) {
    return (
        <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#f3f1eb" />
            <rect width="30" height="60" fill="#c1121f" fillOpacity="0.55" />
            <rect width="60" height="30" fill="#c1121f" fillOpacity="0.55" />
        </pattern>
    );
}

const ACEITUNAS = [
    [520, 210], [610, 260], [560, 330], [660, 360], [500, 400], [600, 430], [700, 280], [455, 300]
];

const SALSA = [
    [540, 260, 22], [640, 320, 18], [480, 350, 16], [585, 395, 20], [690, 400, 14], [520, 440, 12]
];

function Pizza() {
    return (
        <g>
            <circle cx="580" cy="320" r="232" fill="#fbfaf6" />
            <circle cx="580" cy="320" r="206" fill="none" stroke="#ddd6c6" strokeWidth="4" />
            <circle cx="580" cy="320" r="176" fill="#b8742e" />
            <circle cx="580" cy="320" r="158" fill="#f0c766" />
            {SALSA.map(([x, y, r]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#c1121f" fillOpacity="0.75" />
            ))}
            {ACEITUNAS.map(([x, y]) => (
                <g key={`${x}-${y}`}>
                    <circle cx={x} cy={y} r="11" fill="#1e4d3a" />
                    <circle cx={x} cy={y} r="4" fill="#f0c766" />
                </g>
            ))}
        </g>
    );
}

function Sello() {
    return (
        <g>
            <ellipse cx="580" cy="320" rx="200" ry="126" fill="#f3f1eb" />
            <ellipse cx="580" cy="320" rx="188" ry="114" fill="#c1121f" />
            <ellipse cx="580" cy="320" rx="168" ry="96" fill="none" stroke="#f3f1eb" strokeWidth="5" />
            <text
                x="580"
                y="356"
                textAnchor="middle"
                fill="#f3f1eb"
                fontFamily="Anton, sans-serif"
                fontSize="100"
            >
                PIN PUN
            </text>
        </g>
    );
}

function Ilustracion({ tipo = 'sello', alt }) {
    const idMantel = `mantel-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <svg
            className="foto__ilustracion"
            viewBox="0 0 1160 640"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label={alt}
        >
            <defs>
                <Mantel id={idMantel} />
            </defs>
            <rect width="1160" height="640" fill={`url(#${idMantel})`} />
            {tipo === 'pizza' ? <Pizza /> : <Sello />}
        </svg>
    );
}

export default Ilustracion;
