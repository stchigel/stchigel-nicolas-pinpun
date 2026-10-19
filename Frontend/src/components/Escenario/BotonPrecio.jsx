import { useEffect, useRef, useState } from 'react';
import { usePedido } from '../../hooks/usePedido.js';
import { useToast } from '../../hooks/useToast.js';
import { formatearPrecio } from '../../utils/formato.js';
import { nombreEnPedido } from '../../utils/carta.js';

const DURACION_SUMADO_MS = 900;

/*
 * El precio es el botón: tocarlo suma ese plato (en ese tamaño) al pedido.
 * `tamano` se muestra al lado del precio solo cuando no hay un título de columna que lo diga.
 */
function BotonPrecio({ producto, variante = null, mostrarTamano = false }) {
    const { agregar } = usePedido();
    const notificar = useToast();
    const [sumado, setSumado] = useState(false);
    const temporizador = useRef(null);

    useEffect(() => () => clearTimeout(temporizador.current), []);

    const precio = variante?.precio ?? producto.precio;
    const nombre = nombreEnPedido(producto, variante);

    const sumar = () => {
        agregar(producto, variante);
        notificar.exito(`Sumaste ${nombre} al pedido.`);
        setSumado(true);
        clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => setSumado(false), DURACION_SUMADO_MS);
    };

    return (
        <button
            type="button"
            className="precio"
            data-sumado={sumado || undefined}
            onClick={sumar}
            aria-label={`Sumar ${nombre} al pedido, ${formatearPrecio(precio)}`}
        >
            <svg className="precio__mas" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M6 1v10M1 6h10" />
            </svg>
            {variante && (
                <span className="precio__tamano" data-visible={mostrarTamano || undefined}>
                    {variante.nombre}
                </span>
            )}
            <span className="precio__monto">{formatearPrecio(precio)}</span>
        </button>
    );
}

export default BotonPrecio;
