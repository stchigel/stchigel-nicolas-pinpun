import { useState } from 'react';
import { urlMapaEmbebido } from '../../utils/sitio.js';
import './MapaLocal.css';

/* Mapa embebido centrado en un local. Aparece con un fundido cuando termina de cargar. */
function MapaLocal({ local, className = '' }) {
    const [cargado, setCargado] = useState(false);

    return (
        <div className={`mapa-local ${className}`} data-cargado={cargado || undefined}>
            <iframe
                key={local.id}
                className="mapa-local__iframe"
                src={urlMapaEmbebido(local)}
                title={`Mapa de Pin Pun ${local.nombre}, ${local.direccion}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setCargado(true)}
            />
        </div>
    );
}

export default MapaLocal;
