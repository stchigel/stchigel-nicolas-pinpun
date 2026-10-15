import { Link } from 'react-router-dom';
import './Boton.css';

/*
 * Botón único del sitio. Según las props se renderiza como:
 * - <Link> si recibe `a` (ruta interna),
 * - <a> si recibe `href` (enlace externo),
 * - <button> en cualquier otro caso.
 * Variantes: "verde" (acción principal), "hueso" y "rojo".
 */
function Boton({ a, href, variante = 'verde', cargando = false, className = '', children, ...props }) {
    const clases = `boton boton--${variante} ${cargando ? 'boton--cargando' : ''} ${className}`.trim();

    if (a) {
        return (
            <Link to={a} className={clases} {...props}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={clases} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button
            type="button"
            className={clases}
            disabled={cargando || props.disabled}
            aria-busy={cargando || undefined}
            {...props}
        >
            <span className="boton__contenido">{children}</span>
        </button>
    );
}

export default Boton;
