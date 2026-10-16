import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Carta.css';

/*
 * Atajos fijos debajo de la barra para saltar entre secciones de la carta.
 * Marca la sección que se está leyendo.
 */
function IndiceCarta({ categorias }) {
    const [actual, setActual] = useState(categorias[0]?.id);

    useEffect(() => {
        if (!('IntersectionObserver' in window)) return;

        const observador = new IntersectionObserver(
            (entradas) => {
                const visible = entradas.find((entrada) => entrada.isIntersecting);
                if (visible) setActual(visible.target.id);
            },
            { rootMargin: '-25% 0px -65% 0px' }
        );

        categorias.forEach(({ id }) => {
            const elemento = document.getElementById(id);
            if (elemento) observador.observe(elemento);
        });

        return () => observador.disconnect();
    }, [categorias]);

    return (
        <nav className="indice-carta" aria-label="Secciones de la carta">
            <ul className="indice-carta__lista contenedor">
                {categorias.map(({ id, nombre }) => (
                    <li key={id}>
                        <Link
                            to={`#${id}`}
                            className="indice-carta__enlace"
                            aria-current={actual === id ? 'true' : undefined}
                        >
                            {nombre}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default IndiceCarta;
