import { useEffect, useRef, useState } from 'react';
import Icono from '../Icono/Icono.jsx';

const DURACION_MS = { exito: 4500, info: 4500, error: 7000 };
const ICONO = { exito: 'exito', info: 'brujula', error: 'error' };

/*
 * Una notificación. Se cierra sola; el tiempo se pausa mientras
 * el puntero o el foco están encima, o mientras la pestaña está oculta.
 */
function Toast({ tipo, mensaje, accion, saliendo, onCerrar }) {
    const [pausado, setPausado] = useState(false);
    const restante = useRef(DURACION_MS[tipo]);
    const onCerrarRef = useRef(onCerrar);

    useEffect(() => {
        onCerrarRef.current = onCerrar;
    }, [onCerrar]);

    useEffect(() => {
        if (pausado || saliendo) return;

        const inicio = Date.now();
        const temporizador = setTimeout(() => onCerrarRef.current(), restante.current);

        return () => {
            clearTimeout(temporizador);
            restante.current -= Date.now() - inicio;
        };
    }, [pausado, saliendo]);

    useEffect(() => {
        const alCambiarVisibilidad = () => setPausado(document.hidden);
        document.addEventListener('visibilitychange', alCambiarVisibilidad);
        return () => document.removeEventListener('visibilitychange', alCambiarVisibilidad);
    }, []);

    return (
        <li
            className={`toast toast--${tipo}`}
            data-saliendo={saliendo || undefined}
            role={tipo === 'error' ? 'alert' : 'status'}
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onFocus={() => setPausado(true)}
            onBlur={() => setPausado(false)}
        >
            <Icono nombre={ICONO[tipo]} className="toast__icono" />
            <div className="toast__texto">
                <p className="toast__mensaje">{mensaje}</p>
                {accion && (
                    <button
                        type="button"
                        className="toast__accion"
                        onClick={() => {
                            accion.onClick();
                            onCerrar();
                        }}
                    >
                        {accion.etiqueta}
                    </button>
                )}
            </div>
            <button type="button" className="toast__cerrar" onClick={onCerrar} aria-label="Cerrar notificación">
                <Icono nombre="cerrar" tamano={18} />
            </button>
        </li>
    );
}

export default Toast;
