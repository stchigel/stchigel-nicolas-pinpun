import Foto from '../Foto/Foto.jsx';
import { formatearPrecio } from '../../utils/formato.js';
import './TarjetaProducto.css';

/* Plato con su foto, nombre y precio, como la tarjeta central del boceto. */
function TarjetaProducto({ producto, prioridad = false }) {
    const { nombre, categoria, subcategoria, imagen, precio, variantes = [], descripcion } = producto;
    const seccion = [categoria, subcategoria].filter(Boolean).join(' · ');

    return (
        <article className="tarjeta-producto">
            <Foto nombres={imagen} alt={nombre} relacion="4 / 3" prioridad={prioridad} />
            <div className="tarjeta-producto__pie">
                <h3 className="tarjeta-producto__nombre">{nombre}</h3>
                <p className="tarjeta-producto__precio">
                    {variantes.length > 0 && <span className="tarjeta-producto__variante">{variantes[0].nombre} </span>}
                    {formatearPrecio(precio)}
                </p>
                {seccion && <p className="tarjeta-producto__seccion">{seccion}</p>}
                {descripcion && <p className="tarjeta-producto__descripcion">{descripcion}</p>}
            </div>
        </article>
    );
}

export default TarjetaProducto;
