import { useId } from 'react';

/* Para que el administrador general mire una sucursal o todas a la vez */
function SelectorLocal({ locales, valor, onCambiar }) {
    const id = useId();

    return (
        <div className="selector-admin">
            <label htmlFor={id}>Local</label>
            <select id={id} value={valor} onChange={(evento) => onCambiar(evento.target.value)}>
                <option value="">Todos los locales</option>
                {locales.map((local) => (
                    <option key={local.id} value={local.id}>
                        {local.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectorLocal;
