import './Logo.css';

/*
 * Logo de Pin Pun. Usa la imagen que haya en src/assets/logo/ (logo.png, logo.svg, logo.webp…).
 * Mientras no exista, dibuja el óvalo rojo con filete y "PIN PUN" en blanco.
 */
const archivos = import.meta.glob('../../assets/logo/*.{png,svg,webp,jpg,jpeg,avif}', {
    eager: true,
    import: 'default'
});

const urlLogo = Object.values(archivos)[0] ?? null;

function LogoDibujado({ className }) {
    return (
        <svg className={className} viewBox="0 0 220 140" role="img" aria-label="Pin Pun">
            <ellipse cx="110" cy="70" rx="108" ry="68" fill="var(--hueso)" />
            <ellipse cx="110" cy="70" rx="102" ry="62" fill="var(--rojo)" />
            <ellipse cx="110" cy="70" rx="92" ry="53" fill="none" stroke="var(--hueso)" strokeWidth="3" />
            <text
                x="110"
                y="89"
                textAnchor="middle"
                fill="var(--hueso)"
                fontFamily="Anton, sans-serif"
                fontSize="54"
                letterSpacing="1"
            >
                PIN PUN
            </text>
        </svg>
    );
}

function Logo({ className = '' }) {
    const clases = `logo ${className}`.trim();

    if (urlLogo) return <img className={clases} src={urlLogo} alt="Pin Pun" />;

    return <LogoDibujado className={clases} />;
}

export default Logo;
