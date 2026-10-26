import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icono from '../Icono/Icono.jsx';
import { useSucursal } from '../../hooks/useSucursal.js';
import { estaAbierto, textoEstado, tieneHorario } from '../../utils/horario.js';
import './SelectorSucursal.css';

/*
 * La sucursal elegida, en la barra: un botón con su nombre que abre la lista de locales.
 * Como el resumen del carrito no es un modal: se cierra con Escape, tocando afuera o al elegir.
 * Cerrada queda fuera del árbol de accesibilidad y del orden de tabulación.
 */
function SelectorSucursal() {
    const { locales, local, cargando, elegir } = useSucursal();
    const [abierto, setAbierto] = useState(false);
    const botonRef = useRef(null);
    const panelRef = useRef(null);
    const idPanel = useId();
    const { pathname, hash } = useLocation();

    useEffect(() => {
        setAbierto(false);
    }, [pathname, hash]);

    useEffect(() => {
        if (!abierto) return;

        const alPresionar = (evento) => {
            if (evento.key !== 'Escape') return;
            if (panelRef.current?.contains(document.activeElement)) botonRef.current?.focus();
            setAbierto(false);
        };
        const alTocar = (evento) => {
            if (panelRef.current?.contains(evento.target) || botonRef.current?.contains(evento.target)) return;
            setAbierto(false);
        };

        document.addEventListener('keydown', alPresionar);
        document.addEventListener('pointerdown', alTocar);
        return () => {
            document.removeEventListener('keydown', alPresionar);
            document.removeEventListener('pointerdown', alTocar);
        };
    }, [abierto]);

    /* Mientras llegan los locales se reserva el lugar para que la barra no se mueva */
    if (!local) return cargando ? <span className="sucursal__chip sucursal__chip--hueco" aria-hidden="true" /> : null;

    const elegirLocal = (id) => {
        elegir({ localId: id });
        setAbierto(false);
        botonRef.current?.focus();
    };

    return (
        <div className="sucursal">
            <button
                ref={botonRef}
                type="button"
                className="sucursal__chip"
                aria-expanded={abierto}
                aria-controls={idPanel}
                aria-label={`Tu sucursal: ${local.nombre}. Cambiar`}
                data-abierto={abierto || undefined}
                onClick={() => setAbierto((valor) => !valor)}
            >
                <Icono nombre="ubicacion" tamano={20} />
                <span className="sucursal__nombre">{local.nombre}</span>
                <Icono nombre="flechaAbajo" tamano={18} className="sucursal__flecha" />
            </button>

            <section
                ref={panelRef}
                id={idPanel}
                className="sucursal__panel"
                data-abierto={abierto || undefined}
                inert={!abierto}
                aria-label="Elegir sucursal"
            >
                <div className="sucursal__rayas" aria-hidden="true" />
                <header className="sucursal__cabecera">
                    <h2 className="sucursal__titulo">Tu sucursal</h2>
                    <p className="sucursal__bajada">La carta y los horarios son los de la que elijas.</p>
                </header>

                <ul className="sucursal__lista">
                    {locales.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                className="sucursal__opcion"
                                aria-pressed={item.id === local.id}
                                onClick={() => elegirLocal(item.id)}
                            >
                                <span className="sucursal__opcion-nombre">{item.nombre}</span>
                                <span className="sucursal__opcion-direccion">{item.direccion}</span>
                                <span className="sucursal__opcion-estado">
                                    {tieneHorario(item) && (
                                        <span className="sucursal__punto" data-abierto={estaAbierto(item) || undefined} aria-hidden="true" />
                                    )}
                                    {textoEstado(item)}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default SelectorSucursal;
