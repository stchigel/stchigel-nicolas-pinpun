import { useId, useState } from 'react';
import AccionConfirmada from '../../components/Admin/AccionConfirmada.jsx';
import BotonActualizar from '../../components/Admin/BotonActualizar.jsx';
import CargaAdmin from '../../components/Admin/CargaAdmin.jsx';
import EncabezadoAdmin from '../../components/Admin/EncabezadoAdmin.jsx';
import FiltrosAdmin from '../../components/Admin/FiltrosAdmin.jsx';
import InsigniaEstado from '../../components/Admin/InsigniaEstado.jsx';
import SelectorLocal from '../../components/Admin/SelectorLocal.jsx';
import Boton from '../../components/Boton/Boton.jsx';
import EstadoMensaje from '../../components/EstadoMensaje/EstadoMensaje.jsx';
import { useAdminDatos } from '../../hooks/useAdminDatos.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { CANCELADO, ETIQUETA_TIPO, VERBO_PEDIDO, pedidoActivo, siguienteEstadoPedido } from '../../utils/estados.js';
import { formatearPrecio } from '../../utils/formato.js';
import { urlTelefono } from '../../utils/sitio.js';
import { haceCuanto, horaDe } from '../../utils/tiempo.js';
import './AdminPedidos.css';

const unidades = (cantidad) => `${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`;

function Detalle({ id, pedido, local }) {
    return (
        <div id={id} className="pedido__detalle">
            <ul className="pedido__items" aria-label="Productos del pedido">
                {pedido.items.map((item, indice) => (
                    <li key={`${item.productoId}-${item.variante}-${indice}`}>
                        <span className="pedido__cantidad">{item.cantidad} ×</span>
                        <span>
                            {item.nombre}
                            {item.variante && <span className="pedido__variante"> ({item.variante})</span>}
                        </span>
                        <span className="pedido__importe">{formatearPrecio(item.precio * item.cantidad)}</span>
                    </li>
                ))}
            </ul>

            <dl className="pedido__datos">
                <div>
                    <dt>Teléfono</dt>
                    <dd>
                        <a href={urlTelefono(pedido.cliente.telefono)}>{pedido.cliente.telefono}</a>
                    </dd>
                </div>
                {pedido.tipo === 'delivery' && (
                    <div>
                        <dt>Entrega en</dt>
                        <dd>{pedido.direccion}</dd>
                    </div>
                )}
                {local && (
                    <div>
                        <dt>Local</dt>
                        <dd>{local.nombre}</dd>
                    </div>
                )}
                <div>
                    <dt>Recorrido</dt>
                    <dd>
                        {pedido.historial.map((paso) => `${paso.estado} ${horaDe(paso.fecha)}`).join(' · ')}
                    </dd>
                </div>
            </dl>
        </div>
    );
}

function FilaPedido({ pedido, local, ahora }) {
    const { cambiarEstadoPedido } = useAdminDatos();
    const notificar = useToast();
    const idDetalle = useId();
    const [abierto, setAbierto] = useState(false);
    const [trabajando, setTrabajando] = useState(false);
    const siguiente = siguienteEstadoPedido(pedido);

    const cambiar = async (estado, mensaje) => {
        try {
            await cambiarEstadoPedido(pedido.id, estado);
            notificar.exito(mensaje);
        } catch (falla) {
            notificar.error(falla.message);
        }
    };

    const avanzar = async () => {
        setTrabajando(true);
        await cambiar(siguiente, `Pedido #${pedido.id}: ${siguiente.toLowerCase()}.`);
        setTrabajando(false);
    };

    return (
        <li className="pedido" data-abierto={abierto || undefined}>
            <div className="pedido__resumen">
                <p className="pedido__numero">
                    <strong>#{pedido.id}</strong>
                    <span>{haceCuanto(pedido.fecha, ahora)}</span>
                </p>

                <p className="pedido__cliente">
                    <span className="pedido__nombre">{pedido.cliente.nombre}</span>
                    <span className="pedido__sub">
                        {ETIQUETA_TIPO[pedido.tipo]}
                        {local && ` · ${local.nombre}`} · {unidades(pedido.items.reduce((suma, item) => suma + item.cantidad, 0))}
                    </span>
                </p>

                <p className="pedido__total">{formatearPrecio(pedido.total)}</p>

                <div className="pedido__estado">
                    <InsigniaEstado estado={pedido.estado} />
                </div>

                <div className="pedido__acciones">
                    {siguiente && (
                        <Boton variante="rojo" onClick={avanzar} cargando={trabajando} disabled={trabajando}>
                            {VERBO_PEDIDO[siguiente]}
                        </Boton>
                    )}
                    <button
                        type="button"
                        className="admin__texto-boton"
                        aria-expanded={abierto}
                        aria-controls={idDetalle}
                        onClick={() => setAbierto((valor) => !valor)}
                    >
                        {abierto ? 'Ocultar detalle' : 'Ver detalle'}
                    </button>
                    {siguiente && (
                        <AccionConfirmada
                            etiqueta="Cancelar"
                            pregunta={`¿Cancelar el pedido #${pedido.id} de ${pedido.cliente.nombre}?`}
                            confirmar="Sí, cancelar"
                            rechazar="No, seguir"
                            onConfirmar={() => cambiar(CANCELADO, `Cancelaste el pedido #${pedido.id}.`)}
                        />
                    )}
                </div>
            </div>

            {abierto && <Detalle id={idDetalle} pedido={pedido} local={local} />}
        </li>
    );
}

function Grupo({ titulo, pedidos, locales, mostrarLocal, ahora }) {
    const id = useId();
    if (pedidos.length === 0) return null;

    return (
        <section className="grupo-admin" aria-labelledby={id}>
            <header className="grupo-admin__cabecera">
                <h2 id={id} className="grupo-admin__titulo">
                    {titulo}
                </h2>
                <p className="grupo-admin__dato">{pedidos.length}</p>
            </header>
            <ul className="grupo-admin__lista">
                {pedidos.map((pedido) => (
                    <FilaPedido
                        key={pedido.id}
                        pedido={pedido}
                        local={mostrarLocal ? locales.find((item) => item.id === pedido.localId) : null}
                        ahora={ahora}
                    />
                ))}
            </ul>
        </section>
    );
}

/*
 * Pedidos: los que están en marcha, del más viejo al más nuevo (el que más espera, primero),
 * y debajo los terminados. Cada botón lleva el pedido al paso siguiente de su circuito.
 */
function AdminPedidos() {
    const { usuario } = useAuth();
    const { pedidos, locales, cargando, error, ahora, recargar } = useAdminDatos();
    const [filtro, setFiltro] = useState('activos');
    const [localId, setLocalId] = useState('');

    const general = usuario.rol === 'general';
    const visibles = pedidos.filter((pedido) => !localId || pedido.localId === Number(localId));
    const activos = visibles.filter(pedidoActivo).reverse();
    const terminados = visibles.filter((pedido) => !pedidoActivo(pedido));

    const mostrarActivos = filtro !== 'terminados';
    const mostrarTerminados = filtro !== 'activos';
    const vacio = (mostrarActivos ? activos.length : 0) + (mostrarTerminados ? terminados.length : 0) === 0;

    return (
        <>
            <EncabezadoAdmin
                titulo="Pedidos"
                bajada={
                    activos.length > 0
                        ? `${activos.length === 1 ? 'Hay 1 pedido' : `Hay ${activos.length} pedidos`} en marcha.`
                        : 'No hay pedidos en marcha.'
                }
            >
                {general && <SelectorLocal locales={locales} valor={localId} onCambiar={setLocalId} />}
                <BotonActualizar />
            </EncabezadoAdmin>

            <CargaAdmin cargando={cargando} error={error} onReintentar={recargar} etiqueta="Cargando los pedidos…">
                <FiltrosAdmin
                    etiqueta="Qué pedidos mostrar"
                    valor={filtro}
                    onCambiar={setFiltro}
                    opciones={[
                        { id: 'activos', etiqueta: 'En marcha', cantidad: activos.length },
                        { id: 'terminados', etiqueta: 'Terminados', cantidad: terminados.length },
                        { id: 'todos', etiqueta: 'Todos', cantidad: visibles.length }
                    ]}
                />

                {vacio ? (
                    <EstadoMensaje
                        className="admin-vacio"
                        titulo={filtro === 'terminados' ? 'Todavía no hay pedidos terminados.' : 'No hay pedidos en marcha.'}
                        descripcion="Cuando llegue uno aparece acá y te avisamos con una notificación."
                    />
                ) : (
                    <>
                        {mostrarActivos && (
                            <Grupo titulo="En marcha" pedidos={activos} locales={locales} mostrarLocal={general} ahora={ahora} />
                        )}
                        {mostrarTerminados && (
                            <Grupo titulo="Terminados" pedidos={terminados} locales={locales} mostrarLocal={general} ahora={ahora} />
                        )}
                    </>
                )}
            </CargaAdmin>
        </>
    );
}

export default AdminPedidos;
