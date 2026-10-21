import EstadoMensaje from '../EstadoMensaje/EstadoMensaje.jsx';

/*
 * Los tres estados que toda pantalla del panel necesita antes de mostrar su contenido:
 * cargando (esqueleto), error (con reintento) o listo (los hijos).
 */
function CargaAdmin({ cargando, error, onReintentar, etiqueta = 'Cargando…', children }) {
    if (cargando) {
        return (
            <div className="carga-admin" role="status">
                <span className="visualmente-oculto">{etiqueta}</span>
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="carga-admin__hueco" aria-hidden="true" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <EstadoMensaje
                titulo="No pudimos traer los datos."
                descripcion={error.message}
                accion="Reintentar"
                onAccion={onReintentar}
            />
        );
    }

    return children;
}

export default CargaAdmin;
