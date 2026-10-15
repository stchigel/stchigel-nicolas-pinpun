import { useEffect, useState } from 'react';
import Boton from '../../Boton/Boton.jsx';
import Icono from '../../Icono/Icono.jsx';
import EstadoMensaje from '../../EstadoMensaje/EstadoMensaje.jsx';
import MapaLocal from '../../MapaLocal/MapaLocal.jsx';
import TarjetaLocal from '../../TarjetaLocal/TarjetaLocal.jsx';
import { useApi } from '../../../hooks/useApi.js';
import { useRevelar } from '../../../hooks/useRevelar.js';
import { useToast } from '../../../hooks/useToast.js';
import { getLocales } from '../../../services/localService.js';
import { obtenerUbicacion, ordenarPorDistancia } from '../../../utils/distancia.js';
import { formatearDistancia } from '../../../utils/formato.js';
import { estaAbierto, tieneHorario } from '../../../utils/horario.js';
import './Locales.css';

function textoEstado(local, abierto) {
    if (!tieneHorario(local)) return 'Horario a confirmar';
    return abierto ? 'Abierto ahora' : 'Cerrado ahora';
}

function FilaLocal({ local, seleccionado, distanciaKm, esMasCercano, indice, onSeleccionar }) {
    const abierto = estaAbierto(local);

    return (
        <li data-revelar="fila" style={{ '--i': indice }}>
            <button
                type="button"
                className="fila-local"
                aria-pressed={seleccionado}
                onClick={() => onSeleccionar(local.id)}
            >
                <span className="fila-local__nombre">{local.nombre}</span>
                <span className="fila-local__direccion">{local.direccion}</span>
                <span className="fila-local__estado">
                    {tieneHorario(local) && (
                        <span className="fila-local__punto" data-abierto={abierto || undefined} aria-hidden="true" />
                    )}
                    {textoEstado(local, abierto)}
                    {distanciaKm !== undefined && <span> · {formatearDistancia(distanciaKm)}</span>}
                    {esMasCercano && <strong className="fila-local__cercano"> · El más cercano</strong>}
                </span>
            </button>
        </li>
    );
}

/*
 * "Dónde encontrarnos": la lista de locales que trae la API, el mapa del elegido
 * con su tarjeta, y el botón para encontrar el más cercano con la ubicación del visitante.
 */
function Locales() {
    const { datos: locales, cargando, error, reintentar } = useApi(getLocales);
    const notificar = useToast();
    const ref = useRevelar();
    const [seleccionadoId, setSeleccionadoId] = useState(null);
    const [distancias, setDistancias] = useState(null);
    const [buscando, setBuscando] = useState(false);

    useEffect(() => {
        if (error) notificar.error(error.message);
    }, [error, notificar]);

    const local = locales?.find((item) => item.id === seleccionadoId) ?? locales?.[0];
    const masCercanoId = distancias?.[0]?.local.id;

    const buscarMasCercano = async () => {
        setBuscando(true);
        try {
            const ubicacion = await obtenerUbicacion();
            const ordenados = ordenarPorDistancia(ubicacion, locales);
            const [masCercano] = ordenados;

            setDistancias(ordenados);
            setSeleccionadoId(masCercano.local.id);
            notificar.exito(
                `Tu Pin Pun más cercano es ${masCercano.local.nombre}, ${formatearDistancia(masCercano.distanciaKm)}.`
            );
        } catch (errorUbicacion) {
            notificar.error(errorUbicacion.message);
        } finally {
            setBuscando(false);
        }
    };

    const distanciaDe = (id) => distancias?.find((item) => item.local.id === id)?.distanciaKm;

    return (
        <section id="locales" className="locales contenedor" ref={ref} aria-labelledby="locales-titulo">
            <div className="locales__encabezado">
                <h2 id="locales-titulo" className="locales__titulo" data-revelar="subir">
                    Dónde encontrarnos
                </h2>
                {locales?.length > 0 && (
                    <Boton
                        variante="rojo"
                        onClick={buscarMasCercano}
                        cargando={buscando}
                        data-revelar="subir"
                        style={{ '--i': 1 }}
                    >
                        <Icono nombre="brujula" />
                        {buscando ? 'Buscando tu ubicación…' : '¿Cuál me queda más cerca?'}
                    </Boton>
                )}
            </div>

            {cargando && (
                <div className="locales__cargando" role="status">
                    <span className="visualmente-oculto">Cargando los locales…</span>
                    <div className="locales__hueco" />
                    <div className="locales__hueco locales__hueco--mapa" />
                </div>
            )}

            {error && (
                <EstadoMensaje
                    className="locales__error"
                    titulo="No pudimos traer los locales."
                    descripcion={error.message}
                    accion="Reintentar"
                    onAccion={reintentar}
                />
            )}

            {local && (
                <div className="locales__cuerpo">
                    <ul className="locales__lista" aria-label="Locales de Pin Pun">
                        {locales.map((item, indice) => (
                            <FilaLocal
                                key={item.id}
                                local={item}
                                indice={indice}
                                seleccionado={item.id === local.id}
                                distanciaKm={distanciaDe(item.id)}
                                esMasCercano={item.id === masCercanoId}
                                onSeleccionar={setSeleccionadoId}
                            />
                        ))}
                    </ul>

                    <div className="locales__mapa" data-revelar="persiana" style={{ '--i': 2 }}>
                        <MapaLocal key={local.id} local={local} className="locales__iframe" />
                    </div>

                    <TarjetaLocal key={local.id} local={local} className="locales__tarjeta" />
                </div>
            )}
        </section>
    );
}

export default Locales;
