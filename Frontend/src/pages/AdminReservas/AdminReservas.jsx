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
import { ACCION_RESERVA, ACEPTADA, CONCLUIDA, ESPERANDO, RECHAZADA, reservaActiva } from '../../utils/estados.js';
import { urlTelefono } from '../../utils/sitio.js';
import { claveDia, etiquetaDia, horaDe } from '../../utils/tiempo.js';
import './AdminReservas.css';

const FILTROS = {
    pendientes: (reserva) => reserva.estado === ESPERANDO,
    aceptadas: (reserva) => reserva.estado === ACEPTADA,
    cerradas: (reserva) => reserva.estado === RECHAZADA || reserva.estado === CONCLUIDA,
    todas: () => true
};

function FilaReserva({ reserva, local }) {
    const { cambiarEstadoReserva } = useAdminDatos();
    const notificar = useToast();
    const [trabajando, setTrabajando] = useState(false);
    const accion = ACCION_RESERVA[reserva.estado];

    const cambiar = async (estado, mensaje) => {
        try {
            await cambiarEstadoReserva(reserva.id, estado);
            notificar.exito(mensaje);
        } catch (falla) {
            notificar.error(falla.message);
        }
    };

    const avanzar = async () => {
        setTrabajando(true);
        await cambiar(accion.estado, `Reserva de ${reserva.cliente.nombre}: ${accion.estado.toLowerCase()}.`);
        setTrabajando(false);
    };

    return (
        <li className="reserva-fila">
            <p className="reserva-fila__hora">{horaDe(reserva.fechaHora)}</p>

            <p className="reserva-fila__quien">
                <span className="reserva-fila__nombre">
                    {reserva.cliente.nombre}
                    <span className="reserva-fila__personas">
                        {' '}
                        · {reserva.cantPersonas} {reserva.cantPersonas === 1 ? 'persona' : 'personas'}
                    </span>
                </span>
                <span className="reserva-fila__sub">
                    <a href={urlTelefono(reserva.cliente.telefono)}>{reserva.cliente.telefono}</a>
                    {local && ` · ${local.nombre}`}
                </span>
                {reserva.aclaraciones && <span className="reserva-fila__aclaracion">“{reserva.aclaraciones}”</span>}
            </p>

            <div className="reserva-fila__estado">
                <InsigniaEstado estado={reserva.estado} />
            </div>

            <div className="reserva-fila__acciones">
                {accion && (
                    <Boton variante="rojo" onClick={avanzar} cargando={trabajando} disabled={trabajando}>
                        {accion.verbo}
                    </Boton>
                )}
                {reservaActiva(reserva) && (
                    <AccionConfirmada
                        etiqueta={reserva.estado === ESPERANDO ? 'Rechazar' : 'Cancelar'}
                        pregunta={`¿${reserva.estado === ESPERANDO ? 'Rechazar' : 'Cancelar'} la reserva de ${reserva.cliente.nombre}?`}
                        confirmar={reserva.estado === ESPERANDO ? 'Sí, rechazar' : 'Sí, cancelar'}
                        rechazar="No, dejarla"
                        onConfirmar={() => cambiar(RECHAZADA, `Rechazaste la reserva de ${reserva.cliente.nombre}.`)}
                    />
                )}
            </div>
        </li>
    );
}

function Dia({ etiqueta, reservas, locales, mostrarLocal }) {
    const id = useId();
    const personas = reservas.reduce((suma, reserva) => suma + reserva.cantPersonas, 0);

    return (
        <section className="grupo-admin" aria-labelledby={id}>
            <header className="grupo-admin__cabecera">
                <h2 id={id} className="grupo-admin__titulo">
                    {etiqueta}
                </h2>
                <p className="grupo-admin__dato">
                    {reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'} · {personas} {personas === 1 ? 'persona' : 'personas'}
                </p>
            </header>
            <ul className="grupo-admin__lista">
                {reservas.map((reserva) => (
                    <FilaReserva
                        key={reserva.id}
                        reserva={reserva}
                        local={mostrarLocal ? locales.find((item) => item.id === reserva.localId) : null}
                    />
                ))}
            </ul>
        </section>
    );
}

/* Reservas agrupadas por día, de la más próxima a la más lejana: lo primero que hay que resolver son las por confirmar */
function AdminReservas() {
    const { usuario } = useAuth();
    const { reservas, locales, cargando, error, ahora, recargar } = useAdminDatos();
    const [filtro, setFiltro] = useState('pendientes');
    const [localId, setLocalId] = useState('');

    const general = usuario.rol === 'general';
    const delLocal = reservas.filter((reserva) => !localId || reserva.localId === Number(localId));
    const cantidad = (id) => delLocal.filter(FILTROS[id]).length;
    const visibles = delLocal.filter(FILTROS[filtro]);

    /* Reservas ya ordenadas por fecha: se corta cada vez que cambia el día */
    const dias = [];
    visibles.forEach((reserva) => {
        const clave = claveDia(reserva.fechaHora);
        const ultimo = dias.at(-1);
        if (ultimo?.clave === clave) ultimo.reservas.push(reserva);
        else dias.push({ clave, etiqueta: etiquetaDia(reserva.fechaHora, ahora), reservas: [reserva] });
    });

    const porConfirmar = cantidad('pendientes');

    return (
        <>
            <EncabezadoAdmin
                titulo="Reservas"
                bajada={
                    porConfirmar > 0
                        ? `${porConfirmar === 1 ? 'Hay 1 reserva' : `Hay ${porConfirmar} reservas`} por confirmar.`
                        : 'No hay reservas por confirmar.'
                }
            >
                {general && <SelectorLocal locales={locales} valor={localId} onCambiar={setLocalId} />}
                <BotonActualizar />
            </EncabezadoAdmin>

            <CargaAdmin cargando={cargando} error={error} onReintentar={recargar} etiqueta="Cargando las reservas…">
                <FiltrosAdmin
                    etiqueta="Qué reservas mostrar"
                    valor={filtro}
                    onCambiar={setFiltro}
                    opciones={[
                        { id: 'pendientes', etiqueta: 'Por confirmar', cantidad: cantidad('pendientes') },
                        { id: 'aceptadas', etiqueta: 'Aceptadas', cantidad: cantidad('aceptadas') },
                        { id: 'cerradas', etiqueta: 'Cerradas', cantidad: cantidad('cerradas') },
                        { id: 'todas', etiqueta: 'Todas', cantidad: cantidad('todas') }
                    ]}
                />

                {dias.length === 0 ? (
                    <EstadoMensaje
                        className="admin-vacio"
                        titulo={filtro === 'pendientes' ? 'No hay reservas por confirmar.' : 'No hay reservas en esta lista.'}
                        descripcion="Cuando alguien pida una mesa aparece acá y te avisamos con una notificación."
                    />
                ) : (
                    dias.map(({ clave, etiqueta, reservas: delDia }) => (
                        <Dia key={clave} etiqueta={etiqueta} reservas={delDia} locales={locales} mostrarLocal={general} />
                    ))
                )}
            </CargaAdmin>
        </>
    );
}

export default AdminReservas;
