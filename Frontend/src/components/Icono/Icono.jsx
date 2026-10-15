/*
 * Íconos dibujados con un mismo trazo (1.75) para todo el sitio.
 * Son decorativos por defecto: el texto que los acompaña (o un aria-label
 * en el botón que los contiene) es el que describe la acción.
 */
const TRAZOS = {
    carrito: (
        <>
            <path d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h8.5a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.1" />
            <circle cx="9.5" cy="19.5" r="1.3" />
            <circle cx="17" cy="19.5" r="1.3" />
        </>
    ),
    ubicacion: (
        <>
            <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
            <circle cx="12" cy="10" r="2.4" />
        </>
    ),
    instagram: (
        <>
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
            <circle cx="12" cy="12" r="3.8" />
            <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </>
    ),
    telefono: (
        <path d="M6.6 3.8 9 3.5l1.6 4-2 1.4a10.6 10.6 0 0 0 6.5 6.5l1.4-2 4 1.6-.3 2.4a2 2 0 0 1-2.1 1.8A15.6 15.6 0 0 1 4.8 5.9a2 2 0 0 1 1.8-2.1Z" />
    ),
    reloj: (
        <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" />
        </>
    ),
    flechaIzquierda: <path d="M14.5 6 8.5 12l6 6" />,
    flechaDerecha: <path d="m9.5 6 6 6-6 6" />,
    flechaDiagonal: <path d="M7 17 17 7M9 7h8v8" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    cerrar: <path d="m6 6 12 12M18 6 6 18" />,
    exito: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12.5 2.7 2.7L16.5 9.5" />
        </>
    ),
    error: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5M12 16.3v.2" />
        </>
    ),
    brujula: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        </>
    )
};

function Icono({ nombre, tamano = 22, className, titulo }) {
    return (
        <svg
            className={className}
            width={tamano}
            height={tamano}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden={titulo ? undefined : true}
            role={titulo ? 'img' : undefined}
            aria-label={titulo}
            focusable="false"
        >
            {TRAZOS[nombre]}
        </svg>
    );
}

export default Icono;
