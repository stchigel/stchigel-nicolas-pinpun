import { useEffect, useMemo } from 'react';
import CategoriaCarta from '../../components/Carta/CategoriaCarta.jsx';
import IndiceCarta from '../../components/Carta/IndiceCarta.jsx';
import EstadoMensaje from '../../components/EstadoMensaje/EstadoMensaje.jsx';
import Remate from '../../components/Fileteado/Remate.jsx';
import { useProductosDeSucursal } from '../../hooks/useProductosDeSucursal.js';
import { useToast } from '../../hooks/useToast.js';
import { agruparCarta, INDICE_CARTA } from '../../utils/carta.js';
import { ANIO_FUNDACION } from '../../utils/sitio.js';
import './Menu.css';

function Esqueleto() {
    return (
        <div className="menu__esqueleto" aria-hidden="true">
            {[0, 1].map((columna) => (
                <div key={columna} className="menu__esqueleto-columna">
                    <div className="menu__esqueleto-banda" />
                    {Array.from({ length: columna === 0 ? 7 : 4 }, (_, i) => (
                        <div key={i} className="menu__esqueleto-renglon" />
                    ))}
                </div>
            ))}
        </div>
    );
}

/*
 * La carta completa, como en el boceto: secciones de a dos columnas con banda de título,
 * renglones con "+" para sumar al pedido y un índice fijo para saltar entre secciones.
 */
function Menu() {
    const { datos: productos, cargando, error, reintentar } = useProductosDeSucursal();
    const notificar = useToast();

    useEffect(() => {
        if (error) notificar.error(error.message);
    }, [error, notificar]);

    const secciones = useMemo(() => (productos ? agruparCarta(productos) : []), [productos]);

    const atajos = useMemo(() => {
        const presentes = secciones.flatMap((seccion) => seccion.columnas.flat());
        return INDICE_CARTA.map((nombre) => presentes.find((categoria) => categoria.nombre === nombre)).filter(Boolean);
    }, [secciones]);

    let contenido;

    if (cargando) {
        contenido = (
            <div className="menu__hoja" role="status">
                <span className="visualmente-oculto">Cargando la carta…</span>
                <Esqueleto />
            </div>
        );
    } else if (error) {
        contenido = (
            <EstadoMensaje
                className="menu__estado"
                titulo="No pudimos traer la carta."
                descripcion={error.message}
                accion="Reintentar"
                onAccion={reintentar}
            />
        );
    } else if (secciones.length === 0) {
        contenido = (
            <EstadoMensaje
                className="menu__estado"
                titulo="Todavía no hay platos cargados."
                descripcion="Volvé a pasar en un rato: el horno ya está prendido."
            />
        );
    } else {
        contenido = (
            <div className="menu__hoja">
                {secciones.map((seccion) => (
                    <div key={seccion.columnas.flat()[0].id} className="menu__seccion" data-ancho={seccion.ancho}>
                        {seccion.columnas.map((columna, i) =>
                            columna.length > 0 ? (
                                <div key={i} className="menu__columna">
                                    {columna.map((categoria) => (
                                        <CategoriaCarta key={categoria.id} categoria={categoria} />
                                    ))}
                                </div>
                            ) : null
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="menu">
            <header className="menu__encabezado contenedor">
                <Remate />
                <h1 className="menu__titulo">La carta</h1>
                <p className="menu__bajada">
                    Pizza al molde con muzzarella de Lácteos Vidal, desde {ANIO_FUNDACION}. Tocá el + para sumar
                    lo que quieras al pedido.
                </p>
            </header>

            {atajos.length > 0 && <IndiceCarta categorias={atajos} />}

            <div className="menu__cuerpo contenedor">{contenido}</div>
        </div>
    );
}

export default Menu;
