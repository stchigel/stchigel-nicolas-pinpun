import { useEffect, useRef, useState } from 'react';
import Boton from '../Boton/Boton.jsx';
import Foto from '../Foto/Foto.jsx';
import Icono from '../Icono/Icono.jsx';
import { usePedido } from '../../hooks/usePedido.js';
import { useSucursal } from '../../hooks/useSucursal.js';
import { useToast } from '../../hooks/useToast.js';
import { nombreEnPedido } from '../../utils/carta.js';
import { formatearPrecio } from '../../utils/formato.js';
import './TarjetaProducto.css';

const DURACION_AGREGADO_MS = 1400;

/*
 * Plato con su foto, nombre y precio, como la tarjeta central del boceto.
 * El botón, sobre la esquina de la foto para no alargar la tarjeta, suma al pedido el plato en la variante
 * que muestra el precio.
 * En un carrusel, `activa` es false para las vecinas: ahí el botón no se alcanza con el teclado
 * y tocarlo cuenta como tocar la tarjeta (el carrusel la trae al centro) en vez de sumar sin querer.
 * Si se está mirando la carta antes de ir al local, el botón no está: no hay pedido que armar.
 */
function TarjetaProducto({ producto, prioridad = false, activa = true }) {
    const { nombre, categoria, subcategoria, imagen, precio, variantes = [], descripcion } = producto;
    const seccion = [categoria, subcategoria].filter(Boolean).join(' · ');
    const variante = variantes[0] ?? null;

    const { agregar } = usePedido();
    const { puedePedir } = useSucursal();
    const notificar = useToast();
    const [agregado, setAgregado] = useState(false);
    const temporizador = useRef(null);

    useEffect(() => () => clearTimeout(temporizador.current), []);

    const sumar = () => {
        agregar(producto, variante);
        notificar.exito(`Sumaste ${nombreEnPedido(producto, variante)} al pedido.`);
        setAgregado(true);
        clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => setAgregado(false), DURACION_AGREGADO_MS);
    };

    return (
        <article className="tarjeta-producto">
            <div className="tarjeta-producto__foto">
                <Foto nombres={imagen} alt={nombre} relacion="4 / 3" prioridad={prioridad} />
                {puedePedir && (
                    <Boton
                        variante="rojo"
                        className="tarjeta-producto__agregar"
                        data-agregado={agregado || undefined}
                        tabIndex={activa ? undefined : -1}
                        onClick={activa ? sumar : undefined}
                        aria-label={`Agregar ${nombreEnPedido(producto, variante)} al carrito, ${formatearPrecio(precio)}`}
                    >
                        <span className="tarjeta-producto__etiqueta" aria-hidden={agregado || undefined}>
                            <Icono nombre="carrito" tamano={18} />
                            Agregar
                        </span>
                        <span className="tarjeta-producto__etiqueta tarjeta-producto__etiqueta--listo" aria-hidden="true">
                            <Icono nombre="exito" tamano={18} />
                            Agregado
                        </span>
                    </Boton>
                )}
            </div>
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
