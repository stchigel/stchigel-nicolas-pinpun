import { useId, useRef, useState } from 'react';
import Icono from '../Icono/Icono.jsx';
import { usePedido } from '../../hooks/usePedido.js';
import { useSucursal } from '../../hooks/useSucursal.js';
import { useToast } from '../../hooks/useToast.js';
import { formatearPrecio } from '../../utils/formato.js';
import { nombreEnPedido } from '../../utils/carta.js';

/*
 * Renglón de la carta, como en el boceto: "+", nombre, línea ondulada y precio,
 * con la descripción debajo. Si el plato viene en tamaños, el "+" despliega
 * los tamaños para elegir cuál sumar al pedido.
 * `columnas` son los tamaños del grupo cuando se muestran como columnas alineadas.
 */
function ItemCarta({ producto, columnas = [] }) {
    const { agregar } = usePedido();
    const { puedePedir } = useSucursal();
    const notificar = useToast();
    const [eligiendo, setEligiendo] = useState(false);
    const botonRef = useRef(null);
    const idEleccion = useId();

    const { nombre, descripcion, precio, variantes = [] } = producto;
    const tieneVariantes = variantes.length > 0;
    const modo = columnas.length > 0 ? 'columnas' : tieneVariantes ? 'linea' : 'simple';

    const sumar = (variante = null) => {
        agregar(producto, variante);
        notificar.exito(`Sumaste ${nombreEnPedido(producto, variante)} al pedido.`);
        setEligiendo(false);
        botonRef.current?.focus();
    };

    const alTocarMas = () => (tieneVariantes ? setEligiendo((valor) => !valor) : sumar());

    const alPresionarTecla = (evento) => {
        if (evento.key !== 'Escape' || !eligiendo) return;
        setEligiendo(false);
        botonRef.current?.focus();
    };

    return (
        <li
            className="item-carta"
            data-modo={modo}
            style={modo === 'columnas' ? { '--precios': columnas.length } : undefined}
            onKeyDown={alPresionarTecla}
        >
            {puedePedir ? (
                <button
                    ref={botonRef}
                    type="button"
                    className="item-carta__agregar"
                    onClick={alTocarMas}
                    aria-label={tieneVariantes ? `Elegir tamaño de ${nombre}` : `Sumar ${nombre} al pedido`}
                    aria-expanded={tieneVariantes ? eligiendo : undefined}
                    aria-controls={tieneVariantes ? idEleccion : undefined}
                >
                    <Icono nombre="mas" tamano={24} />
                </button>
            ) : (
                <span className="item-carta__agregar" aria-hidden="true" />
            )}

            <p className="item-carta__nombre">
                <span>{nombre}</span>
            </p>

            {modo === 'simple' && <p className="item-carta__precio">{formatearPrecio(precio)}</p>}

            {modo === 'columnas' && (
                <div className="item-carta__precios">
                    {columnas.map((columna) => {
                        const variante = variantes.find((v) => v.nombre === columna);
                        return (
                            <p key={columna} className="item-carta__precio" data-vacio={!variante || undefined}>
                                {variante && (
                                    <>
                                        <span className="item-carta__variante">{columna} </span>
                                        {formatearPrecio(variante.precio)}
                                    </>
                                )}
                            </p>
                        );
                    })}
                </div>
            )}

            {modo === 'linea' && (
                <ul className="item-carta__precios">
                    {variantes.map((variante) => (
                        <li key={variante.nombre} className="item-carta__precio">
                            <span className="item-carta__variante">{variante.nombre} </span>
                            {formatearPrecio(variante.precio)}
                        </li>
                    ))}
                </ul>
            )}

            {descripcion && <p className="item-carta__descripcion">{descripcion}</p>}

            {tieneVariantes && eligiendo && (
                <div className="item-carta__eleccion" id={idEleccion} role="group" aria-label={`Tamaños de ${nombre}`}>
                    {variantes.map((variante) => (
                        <button
                            key={variante.nombre}
                            type="button"
                            className="item-carta__opcion"
                            onClick={() => sumar(variante)}
                        >
                            {variante.nombre}
                            <span className="item-carta__opcion-precio">{formatearPrecio(variante.precio)}</span>
                        </button>
                    ))}
                </div>
            )}
        </li>
    );
}

export default ItemCarta;
