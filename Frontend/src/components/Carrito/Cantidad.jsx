import Icono from '../Icono/Icono.jsx';
import { usePedido } from '../../hooks/usePedido.js';
import { useQuitarItem } from '../../hooks/useQuitarItem.js';
import { nombreItem } from '../../utils/carta.js';
import { CANTIDAD_MAXIMA } from '../../utils/pedido.js';
import './Cantidad.css';

/*
 * Control de cantidad de un renglón. Con una sola unidad, el "menos" pasa a ser "quitar":
 * así bajar de uno nunca deja un renglón en cero.
 */
function Cantidad({ item }) {
    const { cambiarCantidad } = usePedido();
    const quitarItem = useQuitarItem();
    const nombre = nombreItem(item);
    const ultima = item.cantidad <= 1;

    return (
        <div className="cantidad" role="group" aria-label={`Cantidad de ${nombre}`}>
            <button
                type="button"
                className="cantidad__boton"
                data-quitar={ultima || undefined}
                aria-label={ultima ? `Quitar ${nombre} del pedido` : `Una menos de ${nombre}`}
                onClick={() => (ultima ? quitarItem(item) : cambiarCantidad(item.clave, item.cantidad - 1))}
            >
                <Icono nombre={ultima ? 'basura' : 'restar'} tamano={18} />
            </button>
            <output className="cantidad__valor" aria-live="polite">
                {item.cantidad}
            </output>
            <button
                type="button"
                className="cantidad__boton"
                aria-label={`Una más de ${nombre}`}
                disabled={item.cantidad >= CANTIDAD_MAXIMA}
                onClick={() => cambiarCantidad(item.clave, item.cantidad + 1)}
            >
                <Icono nombre="sumar" tamano={18} />
            </button>
        </div>
    );
}

export default Cantidad;
