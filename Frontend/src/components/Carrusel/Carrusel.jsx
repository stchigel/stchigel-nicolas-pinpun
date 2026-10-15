import { useRef, useState } from 'react';
import Icono from '../Icono/Icono.jsx';
import './Carrusel.css';

const UMBRAL_DESLIZAR_PX = 48;
const UMBRAL_VELOCIDAD = 0.11;

/*
 * Carrusel con la pieza activa al centro y las vecinas más chicas a los costados,
 * como en el boceto. Se maneja con los botones, con las flechas del teclado,
 * deslizando el dedo o haciendo clic en una pieza vecina.
 */
function Carrusel({ items, renderItem, obtenerClave, etiqueta, indiceInicial = 0 }) {
    const [indice, setIndice] = useState(Math.min(indiceInicial, items.length - 1));
    const inicioArrastre = useRef(null);
    const total = items.length;

    const irA = (nuevo) => setIndice(Math.max(0, Math.min(total - 1, nuevo)));

    const alPresionarTecla = (evento) => {
        if (evento.key === 'ArrowLeft') {
            evento.preventDefault();
            irA(indice - 1);
        }
        if (evento.key === 'ArrowRight') {
            evento.preventDefault();
            irA(indice + 1);
        }
    };

    const alBajarPuntero = (evento) => {
        if (inicioArrastre.current) return;
        inicioArrastre.current = { x: evento.clientX, tiempo: Date.now() };
    };

    const alSubirPuntero = (evento) => {
        if (!inicioArrastre.current) return;
        const distancia = evento.clientX - inicioArrastre.current.x;
        const velocidad = Math.abs(distancia) / (Date.now() - inicioArrastre.current.tiempo);
        inicioArrastre.current = null;

        if (Math.abs(distancia) >= UMBRAL_DESLIZAR_PX || (Math.abs(distancia) > 12 && velocidad > UMBRAL_VELOCIDAD)) {
            irA(distancia < 0 ? indice + 1 : indice - 1);
        }
    };

    const posicion = (i) => (i === indice ? 'activa' : i < indice ? 'antes' : 'despues');

    return (
        <div
            className="carrusel"
            role="region"
            aria-roledescription="carrusel"
            aria-label={etiqueta}
            tabIndex={0}
            onKeyDown={alPresionarTecla}
        >
            <div
                className="carrusel__ventana"
                onPointerDown={alBajarPuntero}
                onPointerUp={alSubirPuntero}
                onPointerCancel={() => (inicioArrastre.current = null)}
            >
                <ul className="carrusel__pista" style={{ '--indice': indice }}>
                    {items.map((item, i) => (
                        <li
                            key={obtenerClave(item)}
                            className="carrusel__pieza"
                            data-posicion={posicion(i)}
                            role="group"
                            aria-roledescription="diapositiva"
                            aria-label={`${i + 1} de ${total}`}
                            aria-hidden={i !== indice}
                            onClick={() => i !== indice && irA(i)}
                        >
                            {renderItem(item, i === indice)}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="carrusel__controles contenedor">
                <button
                    type="button"
                    className="carrusel__boton"
                    onClick={() => irA(indice - 1)}
                    disabled={indice === 0}
                    aria-label="Anterior"
                >
                    <Icono nombre="flechaIzquierda" tamano={26} />
                </button>
                <p className="carrusel__posicion" aria-live="polite">
                    <span className="visualmente-oculto">Mostrando </span>
                    {indice + 1} de {total}
                </p>
                <button
                    type="button"
                    className="carrusel__boton"
                    onClick={() => irA(indice + 1)}
                    disabled={indice === total - 1}
                    aria-label="Siguiente"
                >
                    <Icono nombre="flechaDerecha" tamano={26} />
                </button>
            </div>
        </div>
    );
}

export default Carrusel;
