import BotonPrecio from './BotonPrecio.jsx';
import './BarraEscena.css';

function TablaTramo({ tramo, escena }) {
    return (
        <table className="tramo__tabla">
            <caption className={tramo.titulo ? 'tramo__titulo' : 'visualmente-oculto'}>
                {tramo.titulo || `${escena.titulo}, precio por tamaño`}
            </caption>
            <thead>
                <tr>
                    <th scope="col">
                        <span className="visualmente-oculto">Plato</span>
                    </th>
                    {tramo.tamanos.map((tamano) => (
                        <th key={tamano} scope="col">
                            {tamano}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tramo.items.map((producto) => (
                    <tr key={producto.id}>
                        <th scope="row">
                            <span className="renglon__nombre">{producto.nombre}</span>
                            {producto.descripcion && <span className="renglon__descripcion">{producto.descripcion}</span>}
                        </th>
                        {tramo.tamanos.map((tamano) => {
                            const variante = producto.variantes.find((v) => v.nombre === tamano);
                            return (
                                <td key={tamano} data-vacio={!variante || undefined}>
                                    {variante ? (
                                        <BotonPrecio producto={producto} variante={variante} />
                                    ) : (
                                        <span className="visualmente-oculto">No viene en {tamano.toLowerCase()}</span>
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ListaTramo({ tramo }) {
    return (
        <div className="tramo__bloque">
            {tramo.titulo && <h4 className="tramo__titulo">{tramo.titulo}</h4>}
            <ul className="tramo__lista">
                {tramo.items.map((producto) => (
                    <li key={producto.id} className="renglon" data-tamanos={producto.variantes?.length > 1 || undefined}>
                        <p className="renglon__texto">
                            <span className="renglon__nombre">{producto.nombre}</span>
                            {producto.descripcion && <span className="renglon__descripcion">{producto.descripcion}</span>}
                        </p>
                        <div className="renglon__precios">
                            {producto.variantes?.length > 0 ? (
                                producto.variantes.map((variante) => (
                                    <BotonPrecio key={variante.nombre} producto={producto} variante={variante} mostrarTamano />
                                ))
                            ) : (
                                <BotonPrecio producto={producto} />
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/*
 * Una barra llena por escena: cerrada muestra el nombre, cuántas opciones hay y desde cuánto;
 * abierta despliega los platos con sus precios (que son los botones para sumar al pedido).
 */
function BarraEscena({ escena, abierta, onCambiar, orden = 0, ref }) {
    return (
        <details
            ref={ref}
            id={`escena-${escena.id}`}
            className="barra"
            data-escena={escena.id}
            data-revelar="fila"
            style={{ '--i': orden }}
            open={abierta}
            onToggle={(evento) => onCambiar(escena.id, evento.currentTarget.open)}
        >
            <summary className="barra__resumen">
                <h3 className="barra__titulo">{escena.titulo}</h3>
                <span className="barra__dato">{escena.resumen}</span>
            </summary>

            <div className="barra__contenido">
                {escena.tramos.map((tramo) =>
                    tramo.tamanos.length > 0 ? (
                        <TablaTramo key={tramo.id} tramo={tramo} escena={escena} />
                    ) : (
                        <ListaTramo key={tramo.id} tramo={tramo} />
                    )
                )}
            </div>
        </details>
    );
}

export default BarraEscena;
