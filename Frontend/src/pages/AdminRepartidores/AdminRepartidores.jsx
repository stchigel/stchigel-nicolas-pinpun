import { useRef, useState } from 'react';
import CargaAdmin from '../../components/Admin/CargaAdmin.jsx';
import EncabezadoAdmin from '../../components/Admin/EncabezadoAdmin.jsx';
import InsigniaEstado from '../../components/Admin/InsigniaEstado.jsx';
import Boton from '../../components/Boton/Boton.jsx';
import Campo from '../../components/Campo/Campo.jsx';
import EstadoMensaje from '../../components/EstadoMensaje/EstadoMensaje.jsx';
import Icono from '../../components/Icono/Icono.jsx';
import { useAdminDatos } from '../../hooks/useAdminDatos.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { actualizarRepartidor, crearRepartidor } from '../../services/repartidorService.js';
import { desplazarA, esPantallaAngosta } from '../../utils/desplazar.js';
import { cargaDeRepartidor } from '../../utils/estados.js';
import { esTelefonoValido, MENSAJE_TELEFONO } from '../../utils/validaciones.js';
import './AdminRepartidores.css';

const NUEVO = 'nuevo';
const MAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MINIMO_CONTRASENA = 8;

const aFormulario = (repartidor, localPorDefecto) => ({
    nombre: repartidor?.nombre ?? '',
    apellido: repartidor?.apellido ?? '',
    mail: repartidor?.mail ?? '',
    numero: repartidor?.numero ?? '',
    localId: String(repartidor?.localId ?? localPorDefecto ?? ''),
    contrasena: '',
    activo: repartidor?.activo ?? true
});

function validar(formulario, nuevo) {
    const errores = {};
    if (formulario.nombre.trim().length < 2) errores.nombre = 'Escribí el nombre.';
    if (formulario.apellido.trim().length < 2) errores.apellido = 'Escribí el apellido.';
    if (nuevo && !MAIL_VALIDO.test(formulario.mail.trim())) errores.mail = 'Escribí un mail válido: es con el que va a entrar.';
    if (!esTelefonoValido(formulario.numero)) errores.numero = MENSAJE_TELEFONO;
    if (nuevo && !formulario.localId) errores.localId = 'Elegí la sucursal a la que pertenece.';

    const clave = formulario.contrasena;
    if (nuevo && clave.length < LARGO_MINIMO_CONTRASENA) errores.contrasena = `Poné una contraseña de al menos ${LARGO_MINIMO_CONTRASENA} caracteres.`;
    else if (!nuevo && clave !== '' && clave.length < LARGO_MINIMO_CONTRASENA) {
        errores.contrasena = `La contraseña nueva necesita al menos ${LARGO_MINIMO_CONTRASENA} caracteres, o dejala vacía para no cambiarla.`;
    }

    return errores;
}

/* Alta y edición de una cuenta de reparto, sobre el panel verde */
function EditorRepartidor({ repartidor, locales, localPropio, enCurso, onGuardado, onCerrar }) {
    const { usuario } = useAuth();
    const notificar = useToast();
    const nuevo = repartidor === null;
    const general = usuario.rol === 'general';
    const [formulario, setFormulario] = useState(() => aFormulario(repartidor, localPropio));
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);

    const cambiar = (evento) => {
        const { name, value } = evento.target;
        setFormulario((actual) => ({ ...actual, [name]: value }));
        if (errores[name]) setErrores((actuales) => ({ ...actuales, [name]: undefined }));
    };

    const guardar = async (evento) => {
        evento.preventDefault();
        const html = evento.currentTarget;
        const nuevos = validar(formulario, nuevo);
        setErrores(nuevos);

        const primero = Object.keys(nuevos)[0];
        if (primero) {
            html.elements[primero]?.focus();
            return;
        }

        setGuardando(true);
        try {
            const datos = {
                nombre: formulario.nombre.trim(),
                apellido: formulario.apellido.trim(),
                numero: formulario.numero.trim(),
                ...(formulario.contrasena ? { contrasena: formulario.contrasena } : {})
            };
            const guardado = nuevo
                ? await crearRepartidor({ ...datos, mail: formulario.mail.trim(), ...(general ? { localId: Number(formulario.localId) } : {}) })
                : await actualizarRepartidor(repartidor.id, { ...datos, activo: formulario.activo });

            notificar.exito(nuevo ? `Creaste la cuenta de ${guardado.nombre}.` : `Guardaste los datos de ${guardado.nombre}.`);
            onGuardado(guardado);
        } catch (falla) {
            notificar.error(falla.message);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <form className="panel-edicion__formulario" onSubmit={guardar} noValidate aria-label={nuevo ? 'Nuevo repartidor' : `Editar a ${repartidor.nombre}`}>
            <div className="editor-par">
                <Campo nombre="nombre" etiqueta="Nombre" error={errores.nombre}>
                    {(props) => <input {...props} type="text" autoComplete="off" value={formulario.nombre} onChange={cambiar} />}
                </Campo>
                <Campo nombre="apellido" etiqueta="Apellido" error={errores.apellido}>
                    {(props) => <input {...props} type="text" autoComplete="off" value={formulario.apellido} onChange={cambiar} />}
                </Campo>
            </div>

            {nuevo ? (
                <Campo nombre="mail" etiqueta="Mail (con el que entra)" error={errores.mail}>
                    {(props) => <input {...props} type="text" inputMode="email" autoComplete="off" value={formulario.mail} onChange={cambiar} />}
                </Campo>
            ) : (
                <div className="campo">
                    <p className="campo__etiqueta">Mail (con el que entra)</p>
                    <p className="editor-fijo">{repartidor.mail}</p>
                </div>
            )}

            <Campo nombre="numero" etiqueta="Teléfono" error={errores.numero}>
                {(props) => <input {...props} type="tel" inputMode="tel" autoComplete="off" value={formulario.numero} onChange={cambiar} />}
            </Campo>

            {nuevo && general ? (
                <Campo nombre="localId" etiqueta="Sucursal" error={errores.localId}>
                    {(props) => (
                        <select {...props} value={formulario.localId} onChange={cambiar}>
                            <option value="">Elegí una sucursal</option>
                            {locales.map((local) => (
                                <option key={local.id} value={local.id}>
                                    {local.nombre}
                                </option>
                            ))}
                        </select>
                    )}
                </Campo>
            ) : (
                <div className="campo">
                    <p className="campo__etiqueta">Sucursal</p>
                    <p className="editor-fijo">{locales.find((local) => local.id === (repartidor?.localId ?? Number(localPropio)))?.nombre}</p>
                </div>
            )}

            <Campo nombre="contrasena" etiqueta={nuevo ? 'Contraseña' : 'Contraseña nueva (opcional)'} error={errores.contrasena}>
                {(props) => (
                    <input
                        {...props}
                        type="text"
                        autoComplete="off"
                        placeholder={nuevo ? 'Al menos 8 caracteres' : 'Dejala vacía para no cambiarla'}
                        value={formulario.contrasena}
                        onChange={cambiar}
                    />
                )}
            </Campo>

            {!nuevo && (
                <div className="campo">
                    <label className="casilla">
                        <input
                            type="checkbox"
                            checked={formulario.activo}
                            onChange={(evento) => setFormulario((actual) => ({ ...actual, activo: evento.target.checked }))}
                        />
                        <span>Cuenta activa</span>
                    </label>
                    {enCurso > 0 && (
                        <p className="editor-nota">
                            Lleva {enCurso} {enCurso === 1 ? 'pedido' : 'pedidos'} en curso: para desactivarlo, reasignalos desde Pedidos.
                        </p>
                    )}
                </div>
            )}

            <div className="panel-edicion__acciones">
                <Boton type="submit" variante="rojo" cargando={guardando} disabled={guardando}>
                    {guardando ? 'Guardando…' : nuevo ? 'Crear cuenta' : 'Guardar cambios'}
                </Boton>
                <Boton variante="hueso" onClick={onCerrar} disabled={guardando}>
                    Cerrar
                </Boton>
            </div>
        </form>
    );
}

/*
 * Repartidores: las cuentas con las que entran al portal de reparto. Cada sucursal maneja las suyas;
 * la administración general, las de todas. En vez de borrar una cuenta se desactiva, así no se pierde su historial.
 */
function AdminRepartidores() {
    const { usuario } = useAuth();
    const { repartidores, pedidos, locales, cargando, error, recargar, reemplazarRepartidor } = useAdminDatos();
    const [seleccion, setSeleccion] = useState(null);
    const panelRef = useRef(null);

    const general = usuario.rol === 'general';
    const seleccionado = typeof seleccion === 'number' ? repartidores.find((repartidor) => repartidor.id === seleccion) : null;

    const abrir = (valor) => {
        setSeleccion(valor);
        if (esPantallaAngosta()) desplazarA(panelRef.current);
    };

    const grupos = locales
        .map((local) => ({ local, repartidores: repartidores.filter((repartidor) => repartidor.localId === local.id) }))
        .filter((grupo) => grupo.repartidores.length > 0);

    const alGuardar = (guardado) => {
        reemplazarRepartidor(guardado);
        setSeleccion(guardado.id);
    };

    return (
        <>
            <EncabezadoAdmin
                titulo="Repartidores"
                bajada={
                    general
                        ? 'Las cuentas de reparto de todas las sucursales. Cada repartidor ve en su portal solo los pedidos que le asignan.'
                        : 'Las cuentas de reparto de tu sucursal. Cada repartidor ve en su portal solo los pedidos que le asignan.'
                }
            >
                <Boton variante="rojo" onClick={() => abrir(NUEVO)}>
                    <Icono nombre="sumar" tamano={18} />
                    Nuevo repartidor
                </Boton>
            </EncabezadoAdmin>

            <CargaAdmin cargando={cargando} error={error} onReintentar={recargar} etiqueta="Cargando los repartidores…">
                <div className="admin-dos">
                    <div>
                        {grupos.length === 0 ? (
                            <EstadoMensaje
                                className="admin-vacio"
                                titulo="Todavía no hay repartidores."
                                descripcion="Creá una cuenta para poder asignarle deliveries."
                            />
                        ) : (
                            grupos.map(({ local, repartidores: delLocal }) => (
                                <section key={local.id} className="grupo-admin" aria-label={`Repartidores de ${local.nombre}`}>
                                    <header className="grupo-admin__cabecera" aria-hidden="true">
                                        <h2 className="grupo-admin__titulo">{local.nombre}</h2>
                                        <p className="grupo-admin__dato">{delLocal.length}</p>
                                    </header>
                                    <ul className="grupo-admin__lista">
                                        {delLocal.map((repartidor) => {
                                            const enCurso = cargaDeRepartidor(pedidos, repartidor.id);

                                            return (
                                                <li key={repartidor.id} className="repartidor" data-seleccionado={seleccion === repartidor.id || undefined}>
                                                    <p className="repartidor__texto">
                                                        <span className="repartidor__nombre">
                                                            {repartidor.nombre} {repartidor.apellido}
                                                        </span>
                                                        <span className="repartidor__sub">
                                                            {repartidor.mail} · {repartidor.numero}
                                                        </span>
                                                        <span className="repartidor__sub">
                                                            {enCurso === 0 ? 'Sin pedidos en curso' : `${enCurso} ${enCurso === 1 ? 'pedido' : 'pedidos'} en curso`}
                                                        </span>
                                                    </p>
                                                    <InsigniaEstado estado={repartidor.activo ? 'Activo' : 'Desactivado'} />
                                                    <button
                                                        type="button"
                                                        className="admin__texto-boton"
                                                        aria-label={`Editar a ${repartidor.nombre} ${repartidor.apellido}`}
                                                        aria-pressed={seleccion === repartidor.id}
                                                        onClick={() => abrir(repartidor.id)}
                                                    >
                                                        <Icono nombre="editar" tamano={18} />
                                                        Editar
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            ))
                        )}
                    </div>

                    <aside ref={panelRef} className="panel-edicion" aria-label="Editor de repartidores">
                        {seleccion === null || (seleccion !== NUEVO && !seleccionado) ? (
                            <div className="panel-edicion__vacio">
                                <h2 className="panel-edicion__titulo">Editor</h2>
                                <p>Elegí un repartidor para cambiar sus datos, su contraseña o desactivar su cuenta, o creá uno nuevo.</p>
                                <Boton variante="hueso" onClick={() => abrir(NUEVO)}>
                                    Nuevo repartidor
                                </Boton>
                            </div>
                        ) : (
                            <>
                                <h2 className="panel-edicion__titulo">{seleccion === NUEVO ? 'Nuevo repartidor' : 'Editar repartidor'}</h2>
                                <EditorRepartidor
                                    key={seleccion}
                                    repartidor={seleccionado ?? null}
                                    locales={locales}
                                    localPropio={usuario.localId}
                                    enCurso={seleccionado ? cargaDeRepartidor(pedidos, seleccionado.id) : 0}
                                    onGuardado={alGuardar}
                                    onCerrar={() => setSeleccion(null)}
                                />
                            </>
                        )}
                    </aside>
                </div>
            </CargaAdmin>
        </>
    );
}

export default AdminRepartidores;
