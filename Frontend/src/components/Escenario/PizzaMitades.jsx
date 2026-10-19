import { useId } from 'react';
import { obtenerFoto } from '../../utils/fotos.js';
import { ingredientesDe, slugPizza } from '../../utils/pizzaDibujo.js';

/*
 * La pizza al molde vista desde arriba, partida al medio: cada mitad muestra la pizza elegida.
 * Si hay una foto real en src/assets/fotos/mitades (por ejemplo "mitad-napolitana.jpg", una pizza
 * entera vista desde arriba y centrada), se recorta esa foto a la mitad; si no, se dibuja
 * con los ingredientes que figuran en la descripción de la carta.
 */
const C = 200;
const R_MOLDE = 190;
const R_BORDE = 180;
const R_MASA = 166;

/* Generador pseudoaleatorio con semilla: la misma pizza siempre queda igual */
function azar(semilla) {
    let h = 2166136261;
    for (const letra of semilla) h = Math.imul(h ^ letra.charCodeAt(0), 16777619);
    return () => {
        h += 0x6d2b79f5;
        let t = h;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* Puntos repartidos dentro de una mitad, sin pisarse entre sí */
function puntos(cantidad, lado, semilla, { margen = 16, separacion = 30 } = {}) {
    const aleatorio = azar(`${semilla}-${lado}`);
    const lista = [];
    for (let intento = 0; lista.length < cantidad && intento < cantidad * 40; intento++) {
        const angulo = (aleatorio() - 0.5) * Math.PI + (lado === 'izquierda' ? Math.PI : 0);
        const radio = Math.sqrt(aleatorio()) * (R_MASA - margen);
        const x = C + Math.cos(angulo) * radio;
        const y = C + Math.sin(angulo) * radio;
        if (Math.abs(x - C) < margen * 0.6) continue;
        if (lista.some((p) => Math.hypot(p.x - x, p.y - y) < separacion)) continue;
        lista.push({ x, y, giro: aleatorio() * 360, escala: 0.85 + aleatorio() * 0.3 });
    }
    return lista;
}

const en = ({ x, y, giro, escala }) => `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${giro.toFixed(0)}) scale(${escala.toFixed(2)})`;

/* Cada ingrediente: cuántos van por mitad y cómo se dibuja uno */
const DIBUJOS = {
    tomate: {
        cantidad: 5,
        separacion: 44,
        dibujo: () => (
            <>
                <circle r="19" fill="#c8281f" />
                <circle r="15" fill="#e2503a" />
                {[0, 72, 144, 216, 288].map((a) => (
                    <ellipse key={a} cx="8" rx="3.4" ry="1.8" fill="#f6c58a" transform={`rotate(${a})`} />
                ))}
            </>
        )
    },
    provolone: {
        cantidad: 3,
        separacion: 60,
        dibujo: () => (
            <>
                <ellipse rx="30" ry="22" fill="#d99a42" />
                <ellipse rx="26" ry="18" fill="#f8e4a4" />
            </>
        )
    },
    acelga: {
        cantidad: 9,
        separacion: 30,
        dibujo: () => <path d="M-16 -6 Q-4 -18 14 -8 Q20 2 6 10 Q-10 14 -16 -6Z" fill="#3c6a2c" />
    },
    jamon: {
        cantidad: 5,
        separacion: 40,
        dibujo: () => <path d="M-15 -10 L13 -12 Q17 0 14 11 L-13 12 Q-17 0 -15 -10Z" fill="#e59a98" stroke="#cf7a79" strokeWidth="1.5" />
    },
    longaniza: {
        cantidad: 6,
        separacion: 34,
        dibujo: () => (
            <>
                <circle r="12" fill="#8f2a1f" />
                <circle cx="-4" cy="-3" r="2.2" fill="#e8b48e" />
                <circle cx="4" cy="3" r="1.8" fill="#e8b48e" />
                <circle cx="3" cy="-5" r="1.4" fill="#e8b48e" />
            </>
        )
    },
    palmitos: {
        cantidad: 5,
        separacion: 32,
        dibujo: () => (
            <>
                <circle r="11" fill="#f4eed6" stroke="#d8cda2" strokeWidth="2" />
                <circle r="4.5" fill="#e4d8ae" />
            </>
        )
    },
    anana: {
        cantidad: 5,
        separacion: 32,
        dibujo: () => <path d="M0 -14 L12 10 L-12 10Z" fill="#f2c64a" stroke="#d9a62a" strokeWidth="1.5" strokeLinejoin="round" />
    },
    roquefort: {
        cantidad: 8,
        separacion: 24,
        dibujo: () => (
            <>
                <path d="M-8 -5 Q-2 -10 7 -6 Q10 2 4 7 Q-6 9 -8 -5Z" fill="#e7ebe2" />
                <circle cx="-2" cy="-1" r="1.4" fill="#4f7287" />
                <circle cx="3" cy="2" r="1.1" fill="#4f7287" />
            </>
        )
    },
    morron: {
        cantidad: 6,
        separacion: 30,
        dibujo: () => <rect x="-17" y="-3.5" width="34" height="7" rx="3.5" fill="#b3141c" />
    },
    huevo: {
        cantidad: 4,
        separacion: 38,
        dibujo: () => (
            <>
                <circle r="11" fill="#faf6ea" />
                <circle r="5" fill="#f1b532" />
            </>
        )
    },
    anchoas: {
        cantidad: 6,
        separacion: 30,
        dibujo: () => <path d="M-17 0 Q0 -5 17 0 Q0 5 -17 0Z" fill="#5f4335" />
    },
    cebolla: {
        cantidad: 14,
        separacion: 20,
        dibujo: () => <path d="M-10 4 Q0 -10 10 4" fill="none" stroke="#fbf5e6" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
    },
    salsaGolf: {
        cantidad: 3,
        separacion: 50,
        dibujo: () => <path d="M-20 0 q5 -6 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#f2a48a" strokeWidth="3" strokeLinecap="round" />
    },
    ajo: {
        cantidad: 8,
        separacion: 18,
        dibujo: () => <rect x="-2.5" y="-2" width="5" height="4" rx="1" fill="#f6eed6" />
    },
    aceitunas: {
        cantidad: 6,
        separacion: 30,
        dibujo: () => (
            <>
                <ellipse rx="7.5" ry="6.5" fill="#5d6b2c" />
                <circle r="2.6" fill="#c1121f" />
            </>
        )
    },
    oregano: {
        cantidad: 34,
        separacion: 9,
        dibujo: () => <rect x="-1.4" y="-1" width="2.8" height="2" fill="#4b6a2a" />
    }
};

/* La base de cada mitad: salsa, muzzarella, masa de fugazza o salsa blanca */
function Base({ base, salsa, semilla, lado }) {
    const manchas = puntos(7, lado, `${semilla}-manchas`, { margen: 30, separacion: 40 });

    if (base === 'fugazza') {
        return (
            <>
                <circle cx={C} cy={C} r={R_MASA} fill="#e9c27a" />
                {manchas.map((p, i) => (
                    <ellipse key={i} rx="16" ry="11" fill="#d39a48" opacity="0.55" transform={en(p)} />
                ))}
            </>
        );
    }

    if (base === 'verde') {
        return <circle cx={C} cy={C} r={R_MASA} fill="#f1ead4" />;
    }

    if (base === 'salsa') {
        return <circle cx={C} cy={C} r={R_MASA} fill="#b5261c" />;
    }

    return (
        <>
            <circle cx={C} cy={C} r={R_MASA} fill={salsa ? '#b5261c' : '#e9c27a'} />
            <circle cx={C} cy={C} r={R_MASA - 7} fill="#f1cd6c" />
            {manchas.map((p, i) => (
                <ellipse key={i} rx="20" ry="13" fill={i % 2 ? '#f8df8e' : '#dea04a'} opacity={i % 2 ? 0.8 : 0.45} transform={en(p)} />
            ))}
        </>
    );
}

function MitadDibujada({ pizza, lado }) {
    const { base, salsa, ingredientes } = ingredientesDe(pizza);
    const semilla = slugPizza(pizza);

    return (
        <>
            <Base base={base} salsa={salsa} semilla={semilla} lado={lado} />
            {ingredientes.map((nombre) => {
                const { cantidad, separacion, dibujo } = DIBUJOS[nombre];
                return puntos(cantidad, lado, `${semilla}-${nombre}`, { separacion }).map((p, i) => (
                    <g key={`${nombre}-${i}`} transform={en(p)}>
                        {dibujo()}
                    </g>
                ));
            })}
        </>
    );
}

function PizzaMitades({ primera, segunda, className = '' }) {
    const id = useId().replace(/[^a-zA-Z0-9]/g, '');
    const recorte = (lado) => `pizza-${id}-${lado}`;

    return (
        <svg
            className={`pizza-mitades ${className}`.trim()}
            viewBox="0 0 400 400"
            role="img"
            aria-label={
                primera.id === segunda.id ? `Una ${primera.nombre} entera` : `Mitad ${primera.nombre} y mitad ${segunda.nombre}`
            }
        >
            <defs>
                <clipPath id={recorte('izquierda')}>
                    <rect x="0" y="0" width={C} height="400" />
                </clipPath>
                <clipPath id={recorte('derecha')}>
                    <rect x={C} y="0" width={C} height="400" />
                </clipPath>
                <clipPath id={`pizza-${id}-masa`}>
                    <circle cx={C} cy={C} r={R_BORDE} />
                </clipPath>
                <radialGradient id={`pizza-${id}-borde`}>
                    <stop offset="88%" stopColor="#d9963f" />
                    <stop offset="96%" stopColor="#b06a24" />
                    <stop offset="100%" stopColor="#8a4f1a" />
                </radialGradient>
            </defs>

            <circle cx={C} cy={C + 6} r={R_MOLDE} fill="#000" opacity="0.28" />
            <circle cx={C} cy={C} r={R_MOLDE} fill="#3a3430" />
            <circle cx={C} cy={C} r={R_MOLDE - 3} fill="none" stroke="#6b625b" strokeWidth="2" />
            <circle cx={C} cy={C} r={R_BORDE} fill={`url(#pizza-${id}-borde)`} />

            {[
                ['izquierda', primera],
                ['derecha', segunda]
            ].map(([lado, pizza]) => {
                const foto = obtenerFoto(`mitad-${slugPizza(pizza)}`);
                return (
                    <g key={`${lado}-${pizza.id}`} className="pizza-mitades__mitad" clipPath={`url(#${recorte(lado)})`}>
                        {foto ? (
                            <image
                                href={foto}
                                x={C - R_BORDE}
                                y={C - R_BORDE}
                                width={R_BORDE * 2}
                                height={R_BORDE * 2}
                                preserveAspectRatio="xMidYMid slice"
                                clipPath={`url(#pizza-${id}-masa)`}
                            />
                        ) : (
                            <MitadDibujada pizza={pizza} lado={lado} />
                        )}
                    </g>
                );
            })}

            {primera.id !== segunda.id && (
                <line x1={C} y1={C - R_BORDE} x2={C} y2={C + R_BORDE} stroke="#3a3430" strokeWidth="2.5" opacity="0.7" />
            )}
        </svg>
    );
}

export default PizzaMitades;
