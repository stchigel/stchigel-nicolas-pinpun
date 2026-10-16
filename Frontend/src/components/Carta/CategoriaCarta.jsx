import ItemCarta from './ItemCarta.jsx';
import './Carta.css';

/*
 * Una categoría de la carta: la banda con el título, las aclaraciones
 * y los platos, separados por subcategoría si la carta los agrupa ("Al horno", "Fritas").
 */
function CategoriaCarta({ categoria }) {
    const { id, nombre, notas, grupos } = categoria;

    return (
        <section className="categoria-carta" id={id} aria-labelledby={`${id}-titulo`}>
            <h2 id={`${id}-titulo`} className="categoria-carta__titulo">
                {nombre}
            </h2>

            {notas.length > 0 && (
                <div className="categoria-carta__notas">
                    {notas.map((nota) => (
                        <p key={nota}>{nota}</p>
                    ))}
                </div>
            )}

            {grupos.map((grupo) => (
                <div key={grupo.nombre || 'general'} className="grupo-carta">
                    {grupo.nombre && <h3 className="grupo-carta__titulo">{grupo.nombre}</h3>}

                    {grupo.columnas.length > 0 && (
                        <div
                            className="grupo-carta__columnas"
                            style={{ '--precios': grupo.columnas.length }}
                            aria-hidden="true"
                        >
                            {grupo.columnas.map((columna) => (
                                <span key={columna}>{columna}</span>
                            ))}
                        </div>
                    )}

                    <ul className="grupo-carta__lista">
                        {grupo.items.map((producto) => (
                            <ItemCarta key={producto.id} producto={producto} columnas={grupo.columnas} />
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}

export default CategoriaCarta;
