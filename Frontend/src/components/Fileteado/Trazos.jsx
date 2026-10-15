/*
 * Pinta volutas y flores calculadas en ornamentos.js.
 * Los colores salen de variables CSS (--filete-rojo, --filete-rojo-luz, etc.),
 * así cada ornamento se adapta al fondo sobre el que está.
 */
export function Volutas({ volutas }) {
    return volutas.map(({ color, ancho, cuerpo, luz, brillo, ojo }, indice) => (
        <g key={indice} className="trazo">
            <path d={cuerpo} fill={`var(--filete-${color})`} />
            <path d={luz} fill={`var(--filete-${color}-luz)`} />
            <path
                d={brillo}
                fill="none"
                stroke={`var(--filete-${color}-brillo)`}
                strokeWidth={ancho * 0.08}
                strokeLinecap="round"
            />
            <circle cx={ojo.cx} cy={ojo.cy} r={ojo.r} fill={`var(--filete-${color})`} />
        </g>
    ));
}

export function Flor({ cx, cy, r }) {
    return (
        <g className="flor">
            {[45, 135, 225, 315].map((angulo) => (
                <ellipse
                    key={angulo}
                    cx={cx}
                    cy={cy - r * 0.95}
                    rx={r * 0.45}
                    ry={r * 0.8}
                    fill="var(--filete-dorado)"
                    transform={`rotate(${angulo} ${cx} ${cy})`}
                />
            ))}
            <circle cx={cx} cy={cy} r={r * 0.6} fill="var(--filete-dorado-luz)" />
            <circle cx={cx - r * 0.15} cy={cy - r * 0.15} r={r * 0.2} fill="var(--filete-dorado-brillo)" />
        </g>
    );
}
