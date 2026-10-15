import { useEffect, useState } from 'react';
import { obtenerFotos } from '../../utils/fotos.js';
import Ilustracion from './Ilustracion.jsx';
import './Foto.css';

const TIEMPO_POR_FOTO_MS = 5600;

/*
 * Muestra una foto de src/assets/fotos con una proporción fija.
 * - `nombres` acepta una o varias fotos: si hay más de una, se alternan con un fundido lento.
 * - Si todavía no hay ninguna foto real, dibuja una Ilustracion en su lugar.
 * - `relacion={null}` deja la proporción en manos del CSS (por ejemplo, para cambiarla según el ancho).
 */
function Foto({ nombres, alt, relacion = '3 / 2', ilustracion = 'sello', prioridad = false, className = '' }) {
    const lista = Array.isArray(nombres) ? nombres : [nombres];
    const urls = obtenerFotos(lista);
    const [actual, setActual] = useState(0);

    useEffect(() => {
        if (urls.length < 2) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const intervalo = setInterval(() => {
            if (document.hidden) return;
            setActual((indice) => (indice + 1) % urls.length);
        }, TIEMPO_POR_FOTO_MS);

        return () => clearInterval(intervalo);
    }, [urls.length]);

    return (
        <div className={`foto ${className}`} style={relacion ? { aspectRatio: relacion } : undefined}>
            {urls.length === 0 ? (
                <Ilustracion tipo={ilustracion} alt={alt} />
            ) : (
                urls.map((url, indice) => (
                    <img
                        key={url}
                        src={url}
                        alt={indice === 0 ? alt : ''}
                        aria-hidden={indice === 0 ? undefined : true}
                        className={`foto__imagen ${indice === actual ? 'foto__imagen--visible' : ''}`}
                        loading={prioridad ? 'eager' : 'lazy'}
                        decoding="async"
                    />
                ))
            )}
        </div>
    );
}

export default Foto;
