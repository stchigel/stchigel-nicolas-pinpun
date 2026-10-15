import Boton from '../Boton/Boton.jsx';
import './EstadoMensaje.css';

/*
 * Mensaje para cuando una sección no puede mostrar su contenido:
 * un error con opción de reintentar, o una lista vacía.
 */
function EstadoMensaje({ titulo, descripcion, accion, onAccion, className = '' }) {
    return (
        <div className={`estado-mensaje ${className}`}>
            <p className="estado-mensaje__titulo">{titulo}</p>
            {descripcion && <p className="estado-mensaje__descripcion">{descripcion}</p>}
            {accion && (
                <Boton variante="hueso" onClick={onAccion}>
                    {accion}
                </Boton>
            )}
        </div>
    );
}

export default EstadoMensaje;
