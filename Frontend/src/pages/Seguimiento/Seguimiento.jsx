import { Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import Boton from '../../components/Boton/Boton.jsx';
import EstadoMensaje from '../../components/EstadoMensaje/EstadoMensaje.jsx';
import Icono from '../../components/Icono/Icono.jsx';
import { useSeguimiento } from '../../hooks/useSeguimiento.js';
import { ESTADOS_PEDIDO } from '../../utils/estados.js';
import { formatearPrecio } from '../../utils/formato.js';
import { urlTelefono } from '../../utils/sitio.js';
import { haceCuanto } from '../../utils/tiempo.js';
import { formatearDuracion, formatearMetros, horaEstimada, inicioDelViaje, segundosRestantes } from '../../utils/viaje.js';
import './Seguimiento.css';

/* La librería de mapas pesa: solo se baja cuando el pedido está en camino y hay una posición para mostrar */
const MapaSeguimiento = lazy(() => import('../../components/Seguimiento/MapaSeguimiento.jsx'));

const POSICION_VIEJA_MS = 90 * 1000;

function mensajeDe(pedido) {
    const { estado, tipo, local, repartidor } = pedido;
    const quien = repartidor?.nombre;

    switch (estado) {
        case 'Recibido':
            return `Recibimos tu pedido. Pin Pun ${local.nombre} ya lo está viendo.`;
        case 'En preparación':
            return `Se está preparando en Pin Pun ${local.nombre}.`;
        case 'Listo':
            if (tipo === 'retiro') return `Ya está listo: podés pasar a buscarlo por ${local.direccion}.`;
            return quien ? `Ya está listo. ${quien} sale enseguida con tu pedido.` : 'Ya está listo y estamos esperando que salga el repartidor.';
        case 'En camino':
            return quien ? `${quien} va en camino con tu pedido.` : 'Tu pedido va en camino.';
        case 'Entregado':
            return 'Tu pedido fue entregado. ¡Que lo disfrutes!';
        case 'Retirado':
            return 'Retiraste tu pedido. ¡Que lo disfrutes!';
        default:
            return 'Tu pedido se canceló.';
    }
}

function Pasos({ pedido }) {
    const circuito = ESTADOS_PEDIDO[pedido.tipo];
    const actual = circuito.indexOf(pedido.estado);

    return (
        <ol className="pasos" aria-label="Estado de tu pedido">
            {circuito.map((estado, indice) => (
                <li
                    key={estado}
                    className="pasos__paso"
                    data-momento={indice < actual ? 'hecho' : indice === actual ? 'actual' : 'pendiente'}
                    aria-current={indice === actual ? 'step' : undefined}
                >
                    {estado}
                </li>
            ))}
        </ol>
    );
}

/*
 * El viaje en números: hace cuánto salió, cuánto le falta y a qué hora llegaría. El tiempo que falta viene del último
 * recorrido calculado y se va descontando solo; si la posición es vieja se avisa en vez de mostrar un número engañoso.
 */
function Viaje({ pedido, ahora }) {
    const { ubicacion, ruta, destino, historial } = pedido;
    const salida = inicioDelViaje(historial);
    const vieja = ubicacion ? ahora - new Date(ubicacion.fecha).getTime() > POSICION_VIEJA_MS : false;
    const faltan = ruta && !vieja ? segundosRestantes(ruta, ahora) : null;
    const viajando = salida ? (ahora - new Date(salida).getTime()) / 1000 : 0;

    let restante = null;
    if (faltan !== null) restante = faltan < 60 ? { valor: 'Ya casi', detalle: 'Está llegando a tu dirección' } : { valor: formatearDuracion(faltan), detalle: `Faltan unos ${formatearMetros(ruta.distanciaM)}` };

    return (
        <section className="viaje" aria-label="Tiempos del viaje">
            <dl className="viaje__datos">
                {salida && (
                    <div className="viaje__dato">
                        <dt>Lleva de viaje</dt>
                        <dd>{viajando < 60 ? 'Recién salió' : formatearDuracion(viajando)}</dd>
                    </div>
                )}
                {restante && (
                    <div className="viaje__dato" data-destacado>
                        <dt>{restante.detalle}</dt>
                        <dd aria-live="polite">{restante.valor}</dd>
                    </div>
                )}
                {faltan !== null && faltan >= 60 && (
                    <div className="viaje__dato">
                        <dt>Llegada estimada</dt>
                        <dd>{horaEstimada(faltan, ahora)}</dd>
                    </div>
                )}
            </dl>
            {!ruta && destino && ubicacion && <p className="viaje__nota">Calculando el recorrido hasta tu dirección…</p>}
            {!destino && ubicacion && <p className="viaje__nota">No pudimos ubicar tu dirección en el mapa, así que no podemos estimar el tiempo. Seguimos mostrando dónde está el repartidor.</p>}
            {vieja && ruta && <p className="viaje__nota">El tiempo que falta se actualiza cuando vuelva la ubicación del repartidor.</p>}
        </section>
    );
}

/* Qué pasa con la ubicación según el momento: se ve, todavía no hay, o hace rato que no llega */
function TextoDePosicion({ pedido, ahora }) {
    const { ubicacion, repartidor } = pedido;
    const quien = repartidor?.nombre ?? 'El repartidor';

    if (!ubicacion) {
        return <p className="seguimiento__nota">Todavía no tenemos la ubicación de {quien}. Aparece acá apenas salga con tu pedido.</p>;
    }

    const vieja = ahora - new Date(ubicacion.fecha).getTime() > POSICION_VIEJA_MS;

    return (
        <p className="seguimiento__nota" data-vieja={vieja || undefined} role="status">
            {vieja
                ? `Hace un rato que no recibimos la ubicación de ${quien} (${haceCuanto(ubicacion.fecha, ahora)}). Puede estar sin señal.`
                : `Posición de ${quien} actualizada ${haceCuanto(ubicacion.fecha, ahora)}.`}
        </p>
    );
}

/*
 * Seguimiento del pedido por el código de su enlace: qué paso del circuito va, lo que pidió
 * y, mientras un delivery está en camino, el mapa con el repartidor. No pide ni muestra datos personales.
 */
function Seguimiento() {
    const { codigo } = useParams();
    const { datos: pedido, cargando, error, ahora, reintentar } = useSeguimiento(codigo);

    if (cargando) {
        return (
            <section className="seguimiento contenedor" role="status">
                <span className="visualmente-oculto">Buscando tu pedido…</span>
                <div className="seguimiento__esqueleto" aria-hidden="true" />
            </section>
        );
    }

    if (error || !pedido) {
        return (
            <section className="seguimiento contenedor">
                <EstadoMensaje
                    titulo="No encontramos ese pedido."
                    descripcion={error?.message ?? 'Revisá que el enlace esté completo.'}
                    accion="Reintentar"
                    onAccion={reintentar}
                />
            </section>
        );
    }

    const cancelado = pedido.estado === 'Cancelado';
    const enCamino = pedido.tipo === 'delivery' && pedido.estado === 'En camino';
    const unidades = pedido.items.reduce((suma, item) => suma + item.cantidad, 0);

    return (
        <section className="seguimiento contenedor" aria-labelledby="seguimiento-titulo">
            <div className="seguimiento__cuerpo" data-con-mapa={enCamino || undefined}>
                <div className="seguimiento__info">
                    <h1 id="seguimiento-titulo" className="seguimiento__titulo">
                        Tu pedido <span>#{pedido.id}</span>
                    </h1>
                    <p className="seguimiento__mensaje" role="status" aria-live="polite">
                        {mensajeDe(pedido)}
                    </p>

                    {enCamino && <Viaje pedido={pedido} ahora={ahora} />}

                    {cancelado ? (
                        <div className="seguimiento__cancelado">
                            <p>Si tenés dudas, llamá al local.</p>
                            {pedido.local.numero && (
                                <Boton href={urlTelefono(pedido.local.numero)} variante="rojo">
                                    <Icono nombre="telefono" tamano={20} />
                                    Llamar al {pedido.local.numero}
                                </Boton>
                            )}
                        </div>
                    ) : (
                        <Pasos pedido={pedido} />
                    )}

                    <section className="seguimiento__detalle" aria-label="Lo que pediste">
                        <h2>Lo que pediste</h2>
                        <ul>
                            {pedido.items.map((item, indice) => (
                                <li key={`${item.nombre}-${item.variante}-${indice}`}>
                                    <span className="seguimiento__cantidad">{item.cantidad} ×</span>
                                    <span>
                                        {item.nombre}
                                        {item.variante && ` (${item.variante})`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="seguimiento__total">
                            <span>{unidades === 1 ? '1 producto' : `${unidades} productos`}</span>
                            <strong>{formatearPrecio(pedido.total)}</strong>
                        </p>
                        {pedido.tipo === 'delivery' && <p className="seguimiento__dato">Lo llevamos a {pedido.direccion}.</p>}
                        {pedido.tipo === 'retiro' && <p className="seguimiento__dato">Lo retirás en {pedido.local.direccion}.</p>}
                    </section>

                    <p className="seguimiento__volver">
                        <Link to="/carta">Volver a la carta</Link>
                    </p>
                </div>

                {enCamino && (
                    <div className="seguimiento__mapa">
                        {pedido.ubicacion ? (
                            <Suspense fallback={<div className="seguimiento__cargando-mapa" role="status">Cargando el mapa…</div>}>
                                <MapaSeguimiento local={pedido.local} repartidor={pedido.ubicacion} destino={pedido.destino} ruta={pedido.ruta} nombreRepartidor={pedido.repartidor?.nombre} />
                            </Suspense>
                        ) : (
                            <div className="seguimiento__sin-mapa">
                                <Icono nombre="ubicacion" tamano={32} />
                            </div>
                        )}
                        <TextoDePosicion pedido={pedido} ahora={ahora} />
                    </div>
                )}
            </div>
        </section>
    );
}

export default Seguimiento;
