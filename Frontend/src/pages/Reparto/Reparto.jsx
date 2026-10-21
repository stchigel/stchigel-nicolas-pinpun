import { useId, useState } from 'react';
import CargaAdmin from '../../components/Admin/CargaAdmin.jsx';
import FiltrosAdmin from '../../components/Admin/FiltrosAdmin.jsx';
import InsigniaEstado from '../../components/Admin/InsigniaEstado.jsx';
import Boton from '../../components/Boton/Boton.jsx';
import EstadoMensaje from '../../components/EstadoMensaje/EstadoMensaje.jsx';
import Icono from '../../components/Icono/Icono.jsx';
import { useRepartoDatos } from '../../hooks/useRepartoDatos.js';
import { useToast } from '../../hooks/useToast.js';
import { MOTIVOS_NO_ENTREGA, pedidoActivo } from '../../utils/estados.js';
import { formatearPrecio } from '../../utils/formato.js';
import { urlTelefono } from '../../utils/sitio.js';
import { haceCuanto } from '../../utils/tiempo.js';

const urlMapa = (direccion) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;

const EN_COCINA = ['Recibido', 'En preparación'];

const unidades = (cantidad) => `${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`;

/* "No pude entregarlo": se elige por qué y se confirma; el pedido queda cancelado con ese motivo */
function NoEntregado({ pedido, onVolver }) {
    const { cambiarEstado } = useRepartoDatos();
    const notificar = useToast();
    const id = useId();
    const [motivo, setMotivo] = useState(MOTIVOS_NO_ENTREGA[0]);
    const [trabajando, setTrabajando] = useState(false);

    const confirmar = async () => {
        setTrabajando(true);
        try {
            await cambiarEstado(pedido.id, 'Cancelado', motivo);
            notificar.info(`Marcaste el pedido #${pedido.id} como no entregado.`);
        } catch (falla) {
            notificar.error(falla.message);
            setTrabajando(false);
        }
    };

    return (
        <div className="entrega__formulario" role="group" aria-label={`No pude entregar el pedido ${pedido.id}`}>
            <label htmlFor={id}>¿Qué pasó?</label>
            <select id={id} value={motivo} onChange={(evento) => setMotivo(evento.target.value)} disabled={trabajando}>
                {MOTIVOS_NO_ENTREGA.map((opcion) => (
                    <option key={opcion} value={opcion}>
                        {opcion}
                    </option>
                ))}
            </select>
            <div className="entrega__botones">
                <Boton variante="rojo" onClick={confirmar} cargando={trabajando} disabled={trabajando}>
                    Confirmar: no se entregó
                </Boton>
                <Boton variante="hueso" onClick={onVolver} disabled={trabajando} autoFocus>
                    Volver
                </Boton>
            </div>
        </div>
    );
}

/* Entregar se confirma con un segundo toque: el pedido no vuelve atrás */
function ConfirmarEntrega({ pedido, onVolver }) {
    const { cambiarEstado } = useRepartoDatos();
    const notificar = useToast();
    const [trabajando, setTrabajando] = useState(false);

    const confirmar = async () => {
        setTrabajando(true);
        try {
            await cambiarEstado(pedido.id, 'Entregado');
            notificar.exito(`Entregaste el pedido #${pedido.id}.`);
        } catch (falla) {
            notificar.error(falla.message);
            setTrabajando(false);
        }
    };

    return (
        <div className="entrega__formulario" role="group" aria-label={`Confirmar la entrega del pedido ${pedido.id}`}>
            <p className="entrega__pregunta">¿Le entregaste el pedido a {pedido.cliente.nombre}?</p>
            <div className="entrega__botones">
                <Boton variante="rojo" onClick={confirmar} cargando={trabajando} disabled={trabajando}>
                    Sí, entregado
                </Boton>
                <Boton variante="hueso" onClick={onVolver} disabled={trabajando} autoFocus>
                    Todavía no
                </Boton>
            </div>
        </div>
    );
}

function Entrega({ pedido, ahora }) {
    const { cambiarEstado } = useRepartoDatos();
    const notificar = useToast();
    const [paso, setPaso] = useState(null);
    const [saliendo, setSaliendo] = useState(false);
    const cantidad = pedido.items.reduce((suma, item) => suma + item.cantidad, 0);
    const enCocina = EN_COCINA.includes(pedido.estado);
    const terminado = !pedidoActivo(pedido);
    const motivo = pedido.historial.findLast((entrada) => entrada.motivo)?.motivo;

    const salir = async () => {
        setSaliendo(true);
        try {
            await cambiarEstado(pedido.id, 'En camino');
            notificar.exito(`Saliste con el pedido #${pedido.id}.`);
        } catch (falla) {
            notificar.error(falla.message);
        } finally {
            setSaliendo(false);
        }
    };

    return (
        <li className="entrega" data-estado={pedido.estado}>
            <header className="entrega__cabecera">
                <p className="entrega__numero">
                    #{pedido.id} <span>{terminado ? `terminó ${haceCuanto(pedido.historial.at(-1).fecha, ahora)}` : haceCuanto(pedido.fecha, ahora)}</span>
                </p>
                <InsigniaEstado estado={pedido.estado} />
            </header>

            <div className="entrega__cuerpo">
                <p className="entrega__cliente">{pedido.cliente.nombre}</p>
                <p className="entrega__direccion">{pedido.direccion}</p>

                {!terminado && (
                    <div className="entrega__contacto">
                        <a className="entrega__enlace" href={urlMapa(pedido.direccion)} target="_blank" rel="noreferrer">
                            <Icono nombre="ubicacion" tamano={22} />
                            Abrir en el mapa
                            <span className="visualmente-oculto"> (se abre en otra pestaña)</span>
                        </a>
                        <a className="entrega__enlace" href={urlTelefono(pedido.cliente.telefono)}>
                            <Icono nombre="telefono" tamano={22} />
                            Llamar
                            <span className="visualmente-oculto"> a {pedido.cliente.nombre}</span>
                        </a>
                    </div>
                )}

                <details className="entrega__items">
                    <summary>
                        Lleva {unidades(cantidad)} · {formatearPrecio(pedido.total)}
                    </summary>
                    <ul>
                        {pedido.items.map((item, indice) => (
                            <li key={`${item.productoId}-${item.variante}-${indice}`}>
                                <span className="entrega__cantidad">{item.cantidad} ×</span>
                                <span>
                                    {item.nombre}
                                    {item.variante && ` (${item.variante})`}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="entrega__telefono">
                        Teléfono: <a href={urlTelefono(pedido.cliente.telefono)}>{pedido.cliente.telefono}</a>
                    </p>
                </details>

                {motivo && <p className="entrega__motivo">No se entregó: {motivo.toLowerCase()}.</p>}
            </div>

            {!terminado && (
                <footer className="entrega__pie">
                    {enCocina && <p className="entrega__aviso">Todavía está en cocina. Cuando esté listo te avisamos y podés salir.</p>}

                    {paso === 'no-entregado' && <NoEntregado pedido={pedido} onVolver={() => setPaso(null)} />}
                    {paso === 'entregado' && <ConfirmarEntrega pedido={pedido} onVolver={() => setPaso(null)} />}

                    {paso === null && pedido.estado === 'Listo' && (
                        <Boton variante="rojo" onClick={salir} cargando={saliendo} disabled={saliendo}>
                            Salí con el pedido
                        </Boton>
                    )}
                    {paso === null && pedido.estado === 'En camino' && (
                        <Boton variante="rojo" onClick={() => setPaso('entregado')}>
                            Entregué el pedido
                        </Boton>
                    )}
                    {paso === null && !enCocina && (
                        <button type="button" className="entrega__no-pude" onClick={() => setPaso('no-entregado')}>
                            No pude entregarlo
                        </button>
                    )}
                </footer>
            )}
        </li>
    );
}

/*
 * Entregas del repartidor: lo que ya está listo para llevar arriba, lo que todavía se cocina después,
 * y lo terminado al final. Todo pensado para tocarse con una mano, con botones grandes.
 */
function Reparto() {
    const { pedidos, cargando, error, ahora, actualizado, recargar } = useRepartoDatos();
    const [filtro, setFiltro] = useState('llevar');
    const [actualizando, setActualizando] = useState(false);

    const paraLlevar = pedidos.filter((pedido) => pedido.estado === 'En camino' || pedido.estado === 'Listo').sort((a, b) => Number(b.estado === 'En camino') - Number(a.estado === 'En camino') || a.fecha.localeCompare(b.fecha));
    const cocina = pedidos.filter((pedido) => EN_COCINA.includes(pedido.estado)).sort((a, b) => a.fecha.localeCompare(b.fecha));
    const terminadas = pedidos.filter((pedido) => !pedidoActivo(pedido));
    const listas = { llevar: paraLlevar, cocina, terminadas };
    const visibles = listas[filtro];

    const actualizar = async () => {
        setActualizando(true);
        await recargar();
        setActualizando(false);
    };

    return (
        <>
            <div className="reparto__encabezado">
                <h1 className="reparto__titulo">Mis entregas</h1>
                <button type="button" className="admin__texto-boton" onClick={actualizar} disabled={actualizando} aria-busy={actualizando || undefined}>
                    <Icono nombre="refrescar" tamano={18} className={actualizando ? 'actualizar__giro' : undefined} />
                    Actualizar
                </button>
            </div>
            <p className="reparto__bajada">
                {paraLlevar.length > 0
                    ? `Tenés ${paraLlevar.length} ${paraLlevar.length === 1 ? 'pedido' : 'pedidos'} para llevar.`
                    : 'No tenés pedidos para llevar ahora.'}
                {actualizado && ' Se actualiza solo.'}
            </p>

            <CargaAdmin cargando={cargando} error={error} onReintentar={recargar} etiqueta="Cargando tus entregas…">
                <FiltrosAdmin
                    etiqueta="Qué entregas mostrar"
                    valor={filtro}
                    onCambiar={setFiltro}
                    opciones={[
                        { id: 'llevar', etiqueta: 'Para llevar', cantidad: paraLlevar.length },
                        { id: 'cocina', etiqueta: 'En cocina', cantidad: cocina.length },
                        { id: 'terminadas', etiqueta: 'Terminadas', cantidad: terminadas.length }
                    ]}
                />

                {visibles.length === 0 ? (
                    <EstadoMensaje
                        className="reparto__vacio"
                        titulo={filtro === 'terminadas' ? 'Todavía no terminaste ninguna entrega.' : filtro === 'cocina' ? 'No hay pedidos tuyos en cocina.' : 'No tenés entregas para hacer.'}
                        descripcion="Cuando la sucursal te asigne un pedido aparece acá y te avisamos con una notificación."
                    />
                ) : (
                    <ul className="reparto__lista" aria-label="Entregas">
                        {visibles.map((pedido) => (
                            <Entrega key={pedido.id} pedido={pedido} ahora={ahora} />
                        ))}
                    </ul>
                )}
            </CargaAdmin>
        </>
    );
}

export default Reparto;
