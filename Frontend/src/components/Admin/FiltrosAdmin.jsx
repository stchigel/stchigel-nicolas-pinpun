/* Filtro por botones (uno elegido a la vez), con la cantidad de cada grupo. Es un grupo de botones, no pestañas */
function FiltrosAdmin({ etiqueta, opciones, valor, onCambiar }) {
    return (
        <div className="filtros-admin" role="group" aria-label={etiqueta}>
            {opciones.map(({ id, etiqueta: texto, cantidad }) => (
                <button
                    key={id}
                    type="button"
                    className="filtros-admin__boton"
                    aria-pressed={valor === id}
                    onClick={() => onCambiar(id)}
                >
                    {texto}
                    <span className="filtros-admin__cantidad">{cantidad}</span>
                </button>
            ))}
        </div>
    );
}

export default FiltrosAdmin;
