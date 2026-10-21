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
    mas: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v8M8 12h8" />
        </>
    ),
    cerrar: <path d="m6 6 12 12M18 6 6 18" />,
    pedidos: (
        <>
            <path d="M6 3.5h12v17l-2.4-1.6-2.4 1.6L12 18.9l-1.2 1.6-2.4-1.6L6 20.5v-17Z" />
            <path d="M9.5 8.5h5M9.5 12h5" />
        </>
    ),
    calendario: (
        <>
            <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
        </>
    ),
    carta: (
        <>
            <path d="M12 6.5C10.4 5.2 8 4.7 4.5 4.7v13.6c3.5 0 5.9.5 7.5 1.8 1.6-1.3 4-1.8 7.5-1.8V4.7C16 4.7 13.6 5.2 12 6.5Z" />
            <path d="M12 6.5v13.6" />
        </>
    ),
    salir: (
        <>
            <path d="M10 4.5H5.5v15H10" />
            <path d="M14 8l4 4-4 4M18 12H9.5" />
        </>
    ),
    editar: (
        <>
            <path d="M4.5 19.5l.9-4 10.2-10.2a1.8 1.8 0 0 1 2.5 0l.6.6a1.8 1.8 0 0 1 0 2.5L8.5 18.6l-4 .9Z" />
            <path d="M14 7l3 3" />
        </>
    ),
    refrescar: (
        <>
            <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
            <path d="M19.5 4.5v4h-4" />
        </>
    ),
    persona: (
        <>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
        </>
    ),
    sumar: <path d="M12 5v14M5 12h14" />,
    restar: <path d="M5 12h14" />,
    basura: <path d="M4.5 7h15M9.5 7V4.8h5V7M6.8 7l.8 12.2h8.8L17.2 7M10.2 11v5.2M13.8 11v5.2" />,
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
