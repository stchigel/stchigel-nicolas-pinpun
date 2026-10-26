import { useSucursal } from '../../hooks/useSucursal.js';
import './ServicioActual.css';

/* Qué se está viendo (sucursal y para qué), con la salida para cambiarlo: va arriba de la carta */
function ServicioActual() {
    const { local, puedePedir, abrirElegir } = useSucursal();
    if (!local) return null;

    return (
        <p className="servicio-actual">
            <span className="servicio-actual__motivo">{puedePedir ? 'Para pedir' : 'Para ver antes de ir'}</span>
            <strong className="servicio-actual__local">{local.nombre}</strong>
            <button type="button" className="servicio-actual__cambiar" onClick={abrirElegir}>
                Cambiar
                <span className="visualmente-oculto"> sucursal o motivo</span>
            </button>
        </p>
    );
}

export default ServicioActual;
