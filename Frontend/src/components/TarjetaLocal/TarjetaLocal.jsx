import Boton from '../Boton/Boton.jsx';
import Icono from '../Icono/Icono.jsx';
import { describirHorario } from '../../utils/horario.js';
import { urlComoLlegar, urlInstagram, urlTelefono } from '../../utils/sitio.js';
import './TarjetaLocal.css';

/* Datos de contacto de un local: la tarjeta que flota sobre el mapa en el boceto. */
function TarjetaLocal({ local, className = '' }) {
    const { nombre, direccion, instagram, numero } = local;

    return (
        <article className={`tarjeta-local ${className}`} aria-live="polite">
            <h3 className="tarjeta-local__nombre">
                <span className="visualmente-oculto">Pin Pun </span>
                {nombre}
            </h3>

            <ul className="tarjeta-local__datos">
                <li>
                    <Icono nombre="ubicacion" />
                    <span>{direccion}</span>
                </li>
                <li>
                    <Icono nombre="reloj" />
                    <span>{describirHorario(local)}</span>
                </li>
                {instagram && (
                    <li>
                        <Icono nombre="instagram" />
                        <a href={urlInstagram(instagram)} target="_blank" rel="noreferrer">
                            @{instagram}
                            <span className="visualmente-oculto"> (se abre en otra pestaña)</span>
                        </a>
                    </li>
                )}
                {numero && (
                    <li>
                        <Icono nombre="telefono" />
                        <a href={urlTelefono(numero)}>{numero}</a>
                    </li>
                )}
            </ul>

            <Boton href={urlComoLlegar(local)} target="_blank" rel="noreferrer" className="tarjeta-local__accion">
                Cómo llegar
                <Icono nombre="flechaDiagonal" tamano={20} />
                <span className="visualmente-oculto"> (se abre en otra pestaña)</span>
            </Boton>
        </article>
    );
}

export default TarjetaLocal;
