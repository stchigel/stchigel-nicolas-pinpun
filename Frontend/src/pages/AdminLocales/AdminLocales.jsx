import { useRef, useState } from 'react';
import CargaAdmin from '../../components/Admin/CargaAdmin.jsx';
import EncabezadoAdmin from '../../components/Admin/EncabezadoAdmin.jsx';
import Boton from '../../components/Boton/Boton.jsx';
import Campo from '../../components/Campo/Campo.jsx';
import Icono from '../../components/Icono/Icono.jsx';
import { useAdminDatos } from '../../hooks/useAdminDatos.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { updateLocal } from '../../services/localService.js';
import { desplazarA, esPantallaAngosta } from '../../utils/desplazar.js';
import { describirHorario } from '../../utils/horario.js';
import './AdminLocales.css';

const HORA_VALIDA = /^([01]\d|2[0-3]):[0-5]\d$/;

const aFormulario = (local) => ({
    numero: local.numero ?? '',
    sinHorario: !local.horarioApertura || !local.horarioCierre,
    apertura: local.horarioApertura ?? '08:00',
    cierre: local.horarioCierre ?? '23:00',
    reservaMax: String(local.reservaMaxPersonas),
    juntarMesas: local.juntarMesas,
    mesas: local.mesas.map((mesa) => ({ capacidad: String(mesa.capacidad), cantidad: String(mesa.cantidad) }))
});

const esEntero = (texto, minimo, maximo) => /^\d+$/.test(texto.trim()) && Number(texto) >= minimo && Number(texto) <= maximo;

function validar(formulario) {
    const errores = {};

    if (!formulario.sinHorario) {
        if (!HORA_VALIDA.test(formulario.apertura)) errores.apertura = 'Elegí a qué hora abre.';
        if (!HORA_VALIDA.test(formulario.cierre)) errores.cierre = 'Elegí a qué hora cierra.';
    }
    if (!esEntero(formulario.reservaMax, 1, 100)) errores.reservaMax = 'Escribí un número entre 1 y 100.';

    const capacidades = formulario.mesas.map((mesa) => mesa.capacidad.trim());
    if (formulario.mesas.some((mesa) => !esEntero(mesa.capacidad, 1, 30) || !esEntero(mesa.cantidad, 0, 200))) {
        errores.mesas = 'En cada fila, los comensales por mesa van de 1 a 30 y la cantidad de mesas de 0 a 200.';
    } else if (new Set(capacidades.map(Number)).size !== capacidades.length) {
        errores.mesas = 'No repitas el mismo tamaño de mesa: sumá las cantidades en una sola fila.';
    }

    return errores;
}

const aDatos = (formulario) => ({
    numero: formulario.numero.trim() || null,
    horarioApertura: formulario.sinHorario ? null : formulario.apertura,
    horarioCierre: formulario.sinHorario ? null : formulario.cierre,
    mesas: formulario.mesas.map((mesa) => ({ capacidad: Number(mesa.capacidad), cantidad: Number(mesa.cantidad) })),
    reservaMaxPersonas: Number(formulario.reservaMax),
    juntarMesas: formulario.juntarMesas
});

/* Totales en vivo mientras se editan las mesas, con las filas que ya están completas */
function totales(mesas) {
    return mesas.reduce(
        (suma, mesa) => {
            if (!esEntero(mesa.capacidad, 1, 30) || !esEntero(mesa.cantidad, 0, 200)) return suma;
            const capacidad = Number(mesa.capacidad);
            const cantidad = Number(mesa.cantidad);
            return {
                mesas: suma.mesas + cantidad,
                comensales: suma.comensales + cantidad * capacidad,
                mayorMesa: cantidad > 0 ? Math.max(suma.mayorMesa, capacidad) : suma.mayorMesa
            };
        },
        { mesas: 0, comensales: 0, mayorMesa: 0 }
    );
}

const plural = (cantidad, singular, pluralTexto) => `${cantidad} ${cantidad === 1 ? singular : pluralTexto}`;

function EditorLocal({ local, onGuardado }) {
    const notificar = useToast();
    const [formulario, setFormulario] = useState(() => aFormulario(local));
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);

    const modificado = JSON.stringify(formulario) !== JSON.stringify(aFormulario(local));
    const suma = totales(formulario.mesas);

    /* Lo que de verdad se acepta en una reserva: el tope, sin pasar lo que el salón puede sentar en un grupo */
    const topeEscrito = esEntero(formulario.reservaMax, 1, 100) ? Number(formulario.reservaMax) : Infinity;
    const maximoReserva = Math.min(topeEscrito, formulario.juntarMesas ? suma.comensales : suma.mayorMesa);

    const cambiar = (nombre, valor) => {
        setFormulario((actual) => ({ ...actual, [nombre]: valor }));
        if (errores[nombre]) setErrores((actuales) => ({ ...actuales, [nombre]: undefined }));
    };

    const cambiarTexto = (evento) => cambiar(evento.target.name, evento.target.value);

    const cambiarMesa = (indice, campo, valor) => {
        setFormulario((actual) => ({
            ...actual,
            mesas: actual.mesas.map((mesa, i) => (i === indice ? { ...mesa, [campo]: valor } : mesa))
        }));
        if (errores.mesas) setErrores((actuales) => ({ ...actuales, mesas: undefined }));
    };

    const agregarMesa = () => setFormulario((actual) => ({ ...actual, mesas: [...actual.mesas, { capacidad: '', cantidad: '' }] }));

    const quitarMesa = (indice) => setFormulario((actual) => ({ ...actual, mesas: actual.mesas.filter((_, i) => i !== indice) }));

    const guardar = async (evento) => {
        evento.preventDefault();
        const formularioHtml = evento.currentTarget;
        const nuevos = validar(formulario);
        setErrores(nuevos);

        const primero = Object.keys(nuevos)[0];
        if (primero) {
            (formularioHtml.elements[primero] ?? formularioHtml.querySelector('[name="mesa-capacidad"]'))?.focus();
            return;
        }

        setGuardando(true);
        try {
            const guardado = await updateLocal(local.id, aDatos(formulario));
            setFormulario(aFormulario(guardado));
            onGuardado(guardado);
            notificar.exito(`Guardaste los datos de ${guardado.nombre}.`);
        } catch (falla) {
            notificar.error(falla.message);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <form className="panel-edicion__formulario" onSubmit={guardar} noValidate aria-label={`Datos de ${local.nombre}`}>
            <Campo nombre="numero" etiqueta="Teléfono del local">
                {(props) => <input {...props} type="tel" inputMode="tel" autoComplete="off" value={formulario.numero} onChange={cambiarTexto} />}
            </Campo>

            <div className="campo">
                <p className="campo__etiqueta">Horario</p>
                <label className="casilla">
                    <input
                        type="checkbox"
                        checked={formulario.sinHorario}
                        onChange={(evento) => cambiar('sinHorario', evento.target.checked)}
                    />
                    <span>Todavía no hay horario cargado</span>
                </label>
            </div>

            {!formulario.sinHorario && (
                <>
                    <div className="editor-par">
                        <Campo nombre="apertura" etiqueta="Abre" error={errores.apertura}>
                            {(props) => <input {...props} type="time" value={formulario.apertura} onChange={cambiarTexto} />}
                        </Campo>
                        <Campo nombre="cierre" etiqueta="Cierra" error={errores.cierre}>
                            {(props) => <input {...props} type="time" value={formulario.cierre} onChange={cambiarTexto} />}
                        </Campo>
                    </div>
                    <p className="editor-nota">Si cierra pasada la medianoche, poné la hora del día siguiente: por ejemplo, abre 07:00 y cierra 01:00.</p>
                </>
            )}

            <Campo nombre="reservaMax" etiqueta="Máximo de personas por reserva" error={errores.reservaMax}>
                {(props) => <input {...props} type="text" inputMode="numeric" value={formulario.reservaMax} onChange={cambiarTexto} />}
            </Campo>

            <div className="campo" data-error={errores.mesas ? true : undefined}>
                <p className="campo__etiqueta">Mesas del salón</p>
                <ul className="mesas">
                    <li className="mesas__cabecera" aria-hidden="true">
                        <span>Comensales por mesa</span>
                        <span>Cantidad de mesas</span>
                    </li>
                    {formulario.mesas.map((mesa, indice) => (
                        <li key={indice} className="mesas__fila">
                            <input
                                type="text"
                                inputMode="numeric"
                                name="mesa-capacidad"
                                aria-label={`Comensales por mesa, fila ${indice + 1}`}
                                value={mesa.capacidad}
                                onChange={(evento) => cambiarMesa(indice, 'capacidad', evento.target.value)}
                            />
                            <input
                                type="text"
                                inputMode="numeric"
                                aria-label={`Cantidad de mesas, fila ${indice + 1}`}
                                value={mesa.cantidad}
                                onChange={(evento) => cambiarMesa(indice, 'cantidad', evento.target.value)}
                            />
                            <button type="button" className="tamanos__quitar" aria-label={`Quitar la fila ${indice + 1} de mesas`} onClick={() => quitarMesa(indice)}>
                                <Icono nombre="cerrar" tamano={18} />
                            </button>
                        </li>
                    ))}
                </ul>
                {errores.mesas && (
                    <p className="campo__error">
                        <Icono nombre="error" tamano={18} />
                        {errores.mesas}
                    </p>
                )}
                <button type="button" className="admin__texto-boton" onClick={agregarMesa}>
                    <Icono nombre="sumar" tamano={18} />
                    Agregar otro tamaño de mesa
                </button>
            </div>

            <div className="campo">
                <label className="casilla">
                    <input
                        type="checkbox"
                        checked={formulario.juntarMesas}
                        onChange={(evento) => cambiar('juntarMesas', evento.target.checked)}
                    />
                    <span>Se pueden juntar mesas</span>
                </label>
                <p className="editor-nota">
                    Si está activado, un grupo grande puede ocupar varias mesas juntas. Si no, cada grupo se sienta en una sola mesa y no
                    entran grupos más grandes que la mesa más grande.
                </p>
            </div>

            <p className="editor-total" aria-live="polite">
                <span className="editor-total__cifra">{plural(suma.mesas, 'mesa', 'mesas')}</span>
                <span className="editor-total__cifra">{plural(suma.comensales, 'comensal', 'comensales')}</span>
                <span className="editor-nota">
                    {Number.isFinite(maximoReserva) && maximoReserva > 0
                        ? `Se aceptan reservas de hasta ${plural(maximoReserva, 'persona', 'personas')}.`
                        : 'Cargá las mesas para aceptar reservas.'}{' '}
                    {formulario.juntarMesas ? 'Los grupos grandes pueden ocupar varias mesas juntas.' : 'Cada grupo se sienta en una sola mesa.'}
                </span>
            </p>

            <div className="panel-edicion__acciones">
                <Boton type="submit" variante="rojo" cargando={guardando} disabled={guardando || !modificado}>
                    {guardando ? 'Guardando…' : 'Guardar cambios'}
                </Boton>
                {modificado && (
                    <button
                        type="button"
                        className="admin__texto-boton"
                        onClick={() => {
                            setFormulario(aFormulario(local));
                            setErrores({});
                        }}
                        disabled={guardando}
                    >
                        Descartar cambios
                    </button>
                )}
            </div>
        </form>
    );
}

/*
 * Locales: el horario, las mesas, los comensales y el teléfono de cada sucursal.
 * El administrador general elige entre todas; el de sucursal ve solo la suya.
 */
function AdminLocales() {
    const { usuario } = useAuth();
    const { locales, cargando, error, recargar, reemplazarLocal } = useAdminDatos();
    const [seleccionId, setSeleccionId] = useState(null);
    const panelRef = useRef(null);

    const general = usuario.rol === 'general';
    const propios = general ? locales : locales.filter((local) => local.id === usuario.localId);
    const local = propios.find((item) => item.id === seleccionId) ?? propios[0];

    const elegir = (id) => {
        setSeleccionId(id);
        if (esPantallaAngosta()) desplazarA(panelRef.current);
    };

    return (
        <>
            <EncabezadoAdmin
                titulo={general ? 'Locales' : 'Mi local'}
                bajada={
                    general
                        ? 'El horario y las mesas de cada sucursal. Los cambios se ven enseguida en el sitio.'
                        : 'El horario y las mesas de tu sucursal. Los cambios se ven enseguida en el sitio.'
                }
            />

            <CargaAdmin cargando={cargando} error={error} onReintentar={recargar} etiqueta="Cargando los locales…">
                {local && (
                    <div className="admin-dos">
                        <ul className="locales-admin" aria-label="Locales">
                            {propios.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        className="local-fila"
                                        aria-pressed={item.id === local.id}
                                        onClick={() => elegir(item.id)}
                                    >
                                        <span className="local-fila__nombre">{item.nombre}</span>
                                        <span className="local-fila__sub">{item.direccion}</span>
                                        <span className="local-fila__sub">
                                            {describirHorario(item)} · {plural(item.cantidadMesas, 'mesa', 'mesas')} ·{' '}
                                            {plural(item.capacidadComensales, 'comensal', 'comensales')}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <aside ref={panelRef} className="panel-edicion" aria-label={`Datos de ${local.nombre}`}>
                            <h2 className="panel-edicion__titulo">{local.nombre}</h2>
                            <EditorLocal key={local.id} local={local} onGuardado={reemplazarLocal} />
                        </aside>
                    </div>
                )}
            </CargaAdmin>
        </>
    );
}

export default AdminLocales;
