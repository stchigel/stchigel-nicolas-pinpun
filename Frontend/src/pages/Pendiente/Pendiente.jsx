import Boton from '../../components/Boton/Boton.jsx';
import './Pendiente.css';

/* Pantalla para las rutas que todavía no existen o se están construyendo. */
function Pendiente({ titulo = 'Esta página no existe', descripcion }) {
    return (
        <section className="pendiente contenedor" aria-labelledby="pendiente-titulo">
            <h1 id="pendiente-titulo" className="pendiente__titulo">
                {titulo}
            </h1>
            <p className="pendiente__descripcion">
                {descripcion ?? 'Puede que el enlace esté mal escrito o que la página se haya movido.'}
            </p>
            <Boton a="/">Volver al inicio</Boton>
        </section>
    );
}

export default Pendiente;
