import Boton from '../Boton/Boton.jsx';
import Cantidad from './Cantidad.jsx';
import { usePedido } from '../../hooks/usePedido.js';
import { detalleItem } from '../../utils/carta.js';
import { formatearPrecio } from '../../utils/formato.js';
import './CarritoEmergente.css';

const plural = (cantidad) => `${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`;

/*
 * Resumen del pedido que cuelga del carrito de la barra. No es un modal: no tapa la página,
 * se cierra con Escape o tocando afuera, y permite ajustar cantidades sin salir de la carta.
 * Cerrado queda fuera del árbol de accesibilidad y del orden de tabulación.
 */
function CarritoEmergente({ id, abierto, onCerrar }) {
    const { items, cantidadTotal, total } = usePedido();
    const vacio = items.length === 0;

    return (
        <section id={id} className="emergente" data-abierto={abierto || undefined} inert={!abierto} aria-label="Tu pedido">
            <div className="emergente__rayas" aria-hidden="true" />

            <header className="emergente__cabecera">
                <h2 className="emergente__titulo">Tu pedido</h2>
                {!vacio && <p className="emergente__dato">{plural(cantidadTotal)}</p>}
            </header>

            {vacio ? (
                <div className="emergente__vacio">
                    <p className="emergente__vacio-texto">Todavía no sumaste nada. Tocá cualquier precio de la carta.</p>
                    <Boton a="/carta" variante="rojo" onClick={onCerrar}>
                        Ir a la carta
                    </Boton>
                </div>
            ) : (
                <>
                    <ul className="emergente__lista">
                        {items.map((item) => (
                            <li key={item.clave} className="emergente__renglon">
                                <p className="emergente__texto">
                                    <span className="emergente__nombre">{item.nombre}</span>
                                    {detalleItem(item) && <span className="emergente__detalle">{detalleItem(item)}</span>}
                                </p>
                                <Cantidad item={item} />
                                <p className="emergente__precio">{formatearPrecio(item.precio * item.cantidad)}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="emergente__pie">
                        <p className="emergente__total">
                            <span>Total</span>
                            <strong key={total} className="emergente__monto">
                                {formatearPrecio(total)}
                            </strong>
                        </p>
                        <Boton a="/carrito" variante="rojo" onClick={onCerrar}>
                            Ver mi pedido
                        </Boton>
                    </div>
                </>
            )}
        </section>
    );
}

export default CarritoEmergente;
