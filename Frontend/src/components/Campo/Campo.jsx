import Icono from '../Icono/Icono.jsx';
import './Campo.css';

/*
 * Campo de formulario con su etiqueta y, si hace falta, su error.
 * `children` recibe las props de accesibilidad (id, name, aria-invalid, aria-describedby)
 * para que cada pantalla ponga el input, select o textarea que corresponda.
 */
function Campo({ nombre, etiqueta, error, children }) {
    const idError = `${nombre}-error`;

    return (
        <div className="campo" data-error={error ? true : undefined}>
            <label className="campo__etiqueta" htmlFor={`campo-${nombre}`}>
                {etiqueta}
            </label>
            {children({
                id: `campo-${nombre}`,
                name: nombre,
                'aria-invalid': error ? true : undefined,
                'aria-describedby': error ? idError : undefined
            })}
            {error && (
                <p id={idError} className="campo__error">
                    <Icono nombre="error" tamano={18} />
                    {error}
                </p>
            )}
        </div>
    );
}

export default Campo;
