import { useCallback, useMemo, useRef, useState } from 'react';
import ToastContext from './ToastContext.js';
import Toast from './Toast.jsx';
import './Toast.css';

const DURACION_SALIDA_MS = 200;
const MAXIMO_VISIBLES = 4;

/*
 * Sistema único de notificaciones laterales del sitio.
 * Envuelve la aplicación y expone `exito`, `error` e `info` a través de useToast().
 */
function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const siguienteId = useRef(0);

    const cerrar = useCallback((id) => {
        setToasts((lista) => lista.map((toast) => (toast.id === id ? { ...toast, saliendo: true } : toast)));
        setTimeout(() => {
            setToasts((lista) => lista.filter((toast) => toast.id !== id));
        }, DURACION_SALIDA_MS);
    }, []);

    /* `accion` es opcional: { etiqueta, onClick }, por ejemplo "Deshacer" */
    const mostrar = useCallback((tipo, mensaje, accion) => {
        const id = siguienteId.current++;
        setToasts((lista) => [...lista, { id, tipo, mensaje, accion, saliendo: false }].slice(-MAXIMO_VISIBLES));
        return id;
    }, []);

    const notificar = useMemo(
        () => ({
            exito: (mensaje, accion) => mostrar('exito', mensaje, accion),
            error: (mensaje, accion) => mostrar('error', mensaje, accion),
            info: (mensaje, accion) => mostrar('info', mensaje, accion),
            cerrar
        }),
        [mostrar, cerrar]
    );

    return (
        <ToastContext.Provider value={notificar}>
            {children}
            <section className="toasts" aria-label="Notificaciones">
                <ol className="toasts__lista">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onCerrar={() => cerrar(toast.id)} />
                    ))}
                </ol>
            </section>
        </ToastContext.Provider>
    );
}

export default ToastProvider;
