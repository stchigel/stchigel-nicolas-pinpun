import { useState } from 'react';
import Boton from '../../components/Boton/Boton.jsx';
import Campo from '../../components/Campo/Campo.jsx';
import Foto from '../../components/Foto/Foto.jsx';
import Icono from '../../components/Icono/Icono.jsx';
import PantallaAparte from '../../components/PantallaAparte/PantallaAparte.jsx';
import TarjetaLocal from '../../components/TarjetaLocal/TarjetaLocal.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useRevelar } from '../../hooks/useRevelar.js';
import { useToast } from '../../hooks/useToast.js';
import { getLocales } from '../../services/localService.js';
import { crearReserva } from '../../services/reservaService.js';
import { describirHorario, tieneHorario } from '../../utils/horario.js';
import {
    MAXIMO_PERSONAS,
    aHora,
    aMinutos,
    fechaHoraDe,
    fechaISO,
    formatearFecha,
    horariosDeReserva
} from '../../utils/reservas.js';
import { esTelefonoValido, MENSAJE_TELEFONO } from '../../utils/validaciones.js';
import '../../components/Carrito/Cantidad.css';
import './Reservas.css';

const personas = (cantidad) => `${cantidad} ${cantidad === 1 ? 'persona' : 'personas'}`;

function validar({ fecha, minutos, nombre, telefono }, hoy) {
    const errores = {};
    if (!fecha || fecha < hoy) errores.fecha = 'Elegí un día de hoy en adelante.';
    if (minutos === null) errores.horario = 'Elegí a qué hora llegan.';
    if (nombre.trim().length < 2) errores.nombre = 'Contanos a nombre de quién va la mesa.';
    if (!esTelefonoValido(telefono)) errores.telefono = MENSAJE_TELEFONO;
    return errores;
}

/*
 * El formulario de la reserva, sobre el verde del salón. El local, el día y el horario se eligen entre
 * lo que el local ofrece; si el local todavía no tiene horario cargado, la hora se escribe y el local la confirma.
 */
function FormularioReserva({ local, locales, cargando, error, onReintentar, onElegirLocal, onPedida }) {
    const notificar = useToast();
    const hoy = fechaISO();
    const [fecha, setFecha] = useState(hoy);
    const [horario, setHorario] = useState('');
    const [cantidad, setCantidad] = useState(2);
    const [campos, setCampos] = useState({ nombre: '', telefono: '', aclaraciones: '' });
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);

    const conHorario = Boolean(local) && tieneHorario(local);
    const turnos = local && conHorario && fecha >= hoy ? horariosDeReserva(local, fecha) : [];
    const sinTurnos = conHorario && fecha >= hoy && turnos.length === 0;

    /* El horario elegido vale solo si el local lo ofrece ese día; si cambió el local o el día, hay que elegir de nuevo */
    let minutos = null;
    if (conHorario) {
        const turno = turnos.find((item) => String(item.minutos) === horario);
        minutos = turno ? turno.minutos : null;
    } else if (/^\d{2}:\d{2}$/.test(horario)) {
        minutos = aMinutos(horario);
    }

    const cambiarCampo = (evento) => {
        const { name, value } = evento.target;
        setCampos((actuales) => ({ ...actuales, [name]: value }));
        if (errores[name]) setErrores((actuales) => ({ ...actuales, [name]: undefined }));
    };

    const limpiarError = (nombre) => errores[nombre] && setErrores((actuales) => ({ ...actuales, [nombre]: undefined }));

    const enviar = async (evento) => {
        evento.preventDefault();
        const formulario = evento.currentTarget;
        const nuevos = validar({ fecha, minutos, ...campos }, hoy);
        setErrores(nuevos);

        const primero = Object.keys(nuevos)[0];
        if (primero) {
            formulario.elements[primero]?.focus();
            return;
        }

        const fechaHora = fechaHoraDe(fecha, minutos);
        setEnviando(true);
        try {
            await crearReserva({
                localId: local.id,
                fechaHora: fechaHora.toISOString(),
                cantPersonas: cantidad,
                cliente: { nombre: campos.nombre.trim(), telefono: campos.telefono.trim() },
                aclaraciones: campos.aclaraciones.trim() || undefined
            });
            onPedida({ local, fecha, minutos, cantidad, nombre: campos.nombre.trim() });
        } catch (falla) {
            notificar.error(falla.message);
            setEnviando(false);
        }
    };

    const completa = Boolean(local) && minutos !== null && fecha >= hoy;

    return (
        <form className="reserva" onSubmit={enviar} noValidate aria-label="Datos de la reserva">
            <div className="reserva__interior">
                <h2 className="reserva__titulo">¿Cuándo vienen?</h2>

                <div className="campo">
                    <label className="campo__etiqueta" htmlFor="campo-local">
                        Local
                    </label>
                    <select
                        id="campo-local"
                        name="local"
                        value={local ? String(local.id) : ''}
                        onChange={(evento) => onElegirLocal(evento.target.value)}
                        disabled={cargando || Boolean(error) || locales.length === 0}
                    >
                        {cargando && <option value="">Cargando locales…</option>}
                        {error && <option value="">No pudimos traer los locales</option>}
                        {locales.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nombre}
                            </option>
                        ))}
                    </select>

                    {error && (
                        <div className="reserva__aviso">
                            <p>{error.message}</p>
                            <Boton variante="hueso" onClick={onReintentar}>
                                Reintentar
                            </Boton>
                        </div>
                    )}

                    {local && <p className="reserva__local">{local.direccion}. {describirHorario(local)}.</p>}
                </div>

                <div className="reserva__par">
                    <Campo nombre="fecha" etiqueta="Día" error={errores.fecha}>
                        {(props) => (
                            <input
                                {...props}
                                type="date"
                                min={hoy}
                                value={fecha}
                                onChange={(evento) => {
                                    setFecha(evento.target.value);
                                    limpiarError('fecha');
                                }}
                            />
                        )}
                    </Campo>

                    <Campo nombre="horario" etiqueta="Horario" error={errores.horario}>
                        {(props) =>
                            conHorario ? (
                                <select
                                    {...props}
                                    value={minutos === null ? '' : String(minutos)}
                                    onChange={(evento) => {
                                        setHorario(evento.target.value);
                                        limpiarError('horario');
                                    }}
                                    disabled={turnos.length === 0}
                                >
                                    <option value="">{turnos.length === 0 ? 'Sin horarios' : 'Elegí la hora'}</option>
                                    {turnos.map((turno) => (
                                        <option key={turno.minutos} value={turno.minutos}>
                                            {turno.hora} h{turno.madrugada ? ' (de madrugada)' : ''}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    {...props}
                                    type="time"
                                    value={minutos === null ? '' : horario}
                                    onChange={(evento) => {
                                        setHorario(evento.target.value);
                                        limpiarError('horario');
                                    }}
                                />
                            )
                        }
                    </Campo>
                </div>

                {sinTurnos && (
                    <p className="reserva__nota" role="status">
                        Ya no quedan horarios para ese día en {local.nombre}. Elegí otro día.
                    </p>
                )}
                {local && !conHorario && (
                    <p className="reserva__nota">
                        El horario de {local.nombre} todavía está por confirmar: escribí la hora que querés y el local te dice si puede
                        recibirlos.
                    </p>
                )}

                <div className="campo">
                    <p className="campo__etiqueta" id="etiqueta-personas">
                        Personas
                    </p>
                    <div className="reserva__personas">
                        <div className="cantidad" role="group" aria-labelledby="etiqueta-personas">
                            <button
                                type="button"
                                className="cantidad__boton"
                                aria-label="Una persona menos"
                                disabled={cantidad <= 1}
                                onClick={() => setCantidad((valor) => Math.max(1, valor - 1))}
                            >
                                <Icono nombre="restar" tamano={18} />
                            </button>
                            <output className="cantidad__valor" aria-live="polite">
                                {cantidad}
                            </output>
                            <button
                                type="button"
                                className="cantidad__boton"
                                aria-label="Una persona más"
                                disabled={cantidad >= MAXIMO_PERSONAS}
                                onClick={() => setCantidad((valor) => Math.min(MAXIMO_PERSONAS, valor + 1))}
                            >
                                <Icono nombre="sumar" tamano={18} />
                            </button>
                        </div>
                        {cantidad >= MAXIMO_PERSONAS && (
                            <p className="reserva__nota reserva__nota--suelta">
                                Para más de {MAXIMO_PERSONAS} personas, llamá al local.
                            </p>
                        )}
                    </div>
                </div>

                <div className="reserva__par">
                    <Campo nombre="nombre" etiqueta="A nombre de" error={errores.nombre}>
                        {(props) => (
                            <input {...props} type="text" autoComplete="name" value={campos.nombre} onChange={cambiarCampo} />
                        )}
                    </Campo>
                    <Campo nombre="telefono" etiqueta="Teléfono" error={errores.telefono}>
                        {(props) => (
                            <input
                                {...props}
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                value={campos.telefono}
                                onChange={cambiarCampo}
                            />
                        )}
                    </Campo>
                </div>

                <Campo nombre="aclaraciones" etiqueta="Aclaraciones (opcional)">
                    {(props) => (
                        <textarea
                            {...props}
                            rows={3}
                            value={campos.aclaraciones}
                            onChange={cambiarCampo}
                            placeholder="Cochecito, silla alta, mesa tranquila…"
                        />
                    )}
                </Campo>

                <p className="reserva__resumen" aria-live="polite">
                    {completa
                        ? `Mesa para ${personas(cantidad)}, el ${formatearFecha(fecha)} a las ${aHora(minutos)} h, en ${local.nombre}.`
                        : 'Elegí el local, el día y la hora para ver el resumen.'}
                </p>

                <Boton type="submit" variante="rojo" cargando={enviando} disabled={!local || enviando}>
                    {enviando ? 'Enviando…' : 'Pedir la reserva'}
                </Boton>
            </div>
        </form>
    );
}

/*
 * Reservas: el mismo partido que el carrito. A la izquierda se lee (qué es, el local elegido y el salón);
 * a la derecha, sobre el verde, queda fijo el formulario.
 */
function Reservas() {
    const { datos, cargando, error, reintentar } = useApi(getLocales);
    const [localId, setLocalId] = useState('');
    const [pedida, setPedida] = useState(null);
    const ref = useRevelar();

    const locales = datos ?? [];
    const local = locales.find((item) => String(item.id) === localId) ?? locales[0];

    if (pedida) {
        const { local: elegido, fecha, minutos, cantidad } = pedida;
        return (
            <PantallaAparte
                foto="salon"
                posicion="50% 60%"
                alt="El salón de Pin Pun en Corrientes: mesas de madera y sillas de madera curvada."
                titulo="Reserva pedida"
                bajada={`Pedimos mesa para ${personas(cantidad)} en Pin Pun ${elegido.nombre}, el ${formatearFecha(fecha)} a las ${aHora(minutos)} h. Queda esperando la confirmación del local.`}
            >
                <Boton a="/carta" variante="rojo">
                    Ver la carta
                </Boton>
                <Boton a="/" variante="hueso">
                    Volver al inicio
                </Boton>
            </PantallaAparte>
        );
    }

    return (
        <div ref={ref} className="reservas">
            <div className="reservas__partido">
                <header className="reservas__portada">
                    <h1 className="reservas__titulo" data-revelar="subir">
                        Reservá tu mesa
                    </h1>
                    <p className="reservas__bajada" data-revelar="subir" style={{ '--i': 1 }}>
                        Elegí el local, el día, la hora y cuántos son. El local revisa la disponibilidad y te confirma.
                    </p>
                </header>

                <FormularioReserva
                    local={local}
                    locales={locales}
                    cargando={cargando}
                    error={error}
                    onReintentar={reintentar}
                    onElegirLocal={setLocalId}
                    onPedida={setPedida}
                />

                <div className="reservas__detalle">
                    {local && <TarjetaLocal key={local.id} local={local} className="reservas__tarjeta" />}
                    <div className="reservas__foto" data-revelar="persiana">
                        <Foto
                            nombres="salon"
                            alt="El salón de Pin Pun en Corrientes, con sus mesas y sus sillas de madera."
                            relacion="4 / 3"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reservas;
