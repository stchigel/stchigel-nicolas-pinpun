import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carrusel from '../../Carrusel/Carrusel.jsx';
import TarjetaProducto from '../../TarjetaProducto/TarjetaProducto.jsx';
import EstadoMensaje from '../../EstadoMensaje/EstadoMensaje.jsx';
import Remate from '../../Fileteado/Remate.jsx';
import { useApi } from '../../../hooks/useApi.js';
import { useRevelar } from '../../../hooks/useRevelar.js';
import { useToast } from '../../../hooks/useToast.js';
import { getProductosDestacados } from '../../../services/productoService.js';
import './MasVendidos.css';

function Esqueleto() {
    return (
        <div className="mas-vendidos__esqueleto" aria-hidden="true">
            <div className="mas-vendidos__hueco" />
            <div className="mas-vendidos__hueco mas-vendidos__hueco--centro" />
            <div className="mas-vendidos__hueco" />
        </div>
    );
}

/* "Nuestros más vendidos": los platos vienen de la API y se muestran en el carrusel del boceto. */
function MasVendidos() {
    const { datos: productos, cargando, error, reintentar } = useApi(getProductosDestacados);
    const notificar = useToast();
    const ref = useRevelar();

    useEffect(() => {
        if (error) notificar.error(error.message);
    }, [error, notificar]);

    let contenido;

    if (cargando) {
        contenido = (
            <div role="status">
                <span className="visualmente-oculto">Cargando los platos…</span>
                <Esqueleto />
            </div>
        );
    } else if (error) {
        contenido = (
            <EstadoMensaje
                titulo="No pudimos traer los platos."
                descripcion={error.message}
                accion="Reintentar"
                onAccion={reintentar}
            />
        );
    } else if (productos.length === 0) {
        contenido = (
            <EstadoMensaje
                titulo="Todavía no hay platos cargados."
                descripcion="Volvé a pasar en un rato: el horno ya está prendido."
            />
        );
    } else {
        contenido = (
            <Carrusel
                etiqueta="Platos más vendidos"
                items={productos}
                obtenerClave={(producto) => producto.id}
                indiceInicial={productos.length > 2 ? 1 : 0}
                renderItem={(producto, activo) => <TarjetaProducto producto={producto} prioridad={activo} activa={activo} />}
            />
        );
    }

    return (
        <section className="mas-vendidos" ref={ref} aria-labelledby="mas-vendidos-titulo">
            <div className="mas-vendidos__encabezado contenedor">
                <Remate />
                <h2 id="mas-vendidos-titulo" className="mas-vendidos__titulo" data-revelar="subir">
                    Nuestros más vendidos
                </h2>
                <Link to="/carta" className="mas-vendidos__enlace" data-revelar="subir" style={{ '--i': 1 }}>
                    Ver el menú completo
                </Link>
            </div>

            <div className="mas-vendidos__contenido" data-revelar="subir" style={{ '--i': 2 }}>
                {cargando || productos?.length ? contenido : <div className="contenedor">{contenido}</div>}
            </div>
        </section>
    );
}

export default MasVendidos;
