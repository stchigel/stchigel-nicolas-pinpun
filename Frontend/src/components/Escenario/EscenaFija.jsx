import { useState } from 'react';
import { obtenerFoto } from '../../utils/fotos.js';
import './EscenaFija.css';

/*
 * La mitad fija de la pantalla: lo que se ve desde el mostrador según la parte de la carta que se lee.
 * Cada foto distinta es una capa; entre fotos hay un fundido lento y, dentro de la misma foto,
 * el encuadre se desplaza. Cada capa guarda su último encuadre para no saltar mientras se desvanece.
 * Es decorativa (la carta está toda en la otra mitad), así que queda fuera del árbol de accesibilidad.
 */
function EscenaFija({ escena, fotos }) {
    const [encuadres, setEncuadres] = useState({});
    if (encuadres[escena.foto] !== escena.encuadre) {
        setEncuadres({ ...encuadres, [escena.foto]: escena.encuadre });
    }

    return (
        <div className="escena" aria-hidden="true">
            {fotos.map((nombre) => {
                const url = obtenerFoto(nombre);
                if (!url) return null;
                const encuadre = encuadres[nombre] ?? { origen: '50% 50%', escala: 1 };

                return (
                    <img
                        key={nombre}
                        src={url}
                        alt=""
                        className="escena__foto"
                        data-visible={nombre === escena.foto || undefined}
                        style={{ '--origen': encuadre.origen, '--escala': encuadre.escala }}
                        loading={nombre === 'salon' ? 'eager' : 'lazy'}
                        decoding="async"
                    />
                );
            })}

            <div key={escena.id} className="escena__rotulo">
                <p className="escena__titulo">{escena.titulo}</p>
                {escena.resumen && <p className="escena__dato">{escena.resumen}</p>}
            </div>
        </div>
    );
}

export default EscenaFija;
