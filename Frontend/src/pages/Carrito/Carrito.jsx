import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import Boton from '../../components/Boton/Boton.jsx';
import Campo from '../../components/Campo/Campo.jsx';
import Cantidad from '../../components/Carrito/Cantidad.jsx';
import Icono from '../../components/Icono/Icono.jsx';
import PantallaAparte from '../../components/PantallaAparte/PantallaAparte.jsx';
import { useApi } from '../../hooks/useApi.js';
import { usePedido } from '../../hooks/usePedido.js';
import { useRevelar } from '../../hooks/useRevelar.js';
import { useToast } from '../../hooks/useToast.js';
import { getLocales } from '../../services/localService.js';
import { crearPedido } from '../../services/pedidoService.js';
import { detalleItem } from '../../utils/carta.js';
import { formatearPrecio } from '../../utils/formato.js';
import { guardarSeguimiento, leerSeguimientos } from '../../utils/seguimientoGuardado.js';
import { esTelefonoValido, MENSAJE_TELEFONO } from '../../utils/validaciones.js';
import { describirHorario, estaAbierto, tieneHorario } from '../../utils/horario.js';
import './Carrito.css';

const plural = (cantidad) => `${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`;

const MODALIDADES = [
    { id: 'retiro', etiqueta: 'Retiro' },
    { id: 'delivery', etiqueta: 'Delivery' }
];

/* Los renglones se agrupan por categoría, en el orden en que se fueron sumando */
function agruparPorCategoria(items) {
    const grupos = new Map();
    items.forEach((item) => {
        const nombre = item.categoria || 'Otros';
        if (!grupos.has(nombre)) grupos.set(nombre, []);
        grupos.get(nombre).push(item);
    });

    return [...grupos].map(([nombre, lista]) => ({
        nombre,
        items: lista,
        cantidad: lista.reduce((suma, item) => suma + item.cantidad, 0),
        subtotal: lista.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
    }));
}

function Grupo({ grupo, orden }) {
    const id = useId();

    return (
        <section className="grupo" aria-labelledby={id} data-revelar="fila" style={{ '--i': orden }}>
            <header className="grupo__cabecera">
                <h2 id={id} className="grupo__titulo">
                    {grupo.nombre}
                </h2>
                <p className="grupo__dato">
                    {plural(grupo.cantidad)} · {formatearPrecio(grupo.subtotal)}
                </p>
            </header>

            <ul className="grupo__lista">
                {grupo.items.map((item) => (
                    <li key={item.clave} className="linea">
                        <p className="linea__texto">
                            <span className="linea__nombre">{item.nombre}</span>
                            {detalleItem(item) && <span className="linea__detalle">{detalleItem(item)}</span>}
                        </p>
                        <Cantidad item={item} />
                        <p className="linea__importe">
                            <span className="linea__total">{formatearPrecio(item.precio * item.cantidad)}</span>
                            {item.cantidad > 1 && (
                                <span className="linea__unidad">{formatearPrecio(item.precio)} c/u</span>
                            )}
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

/* Vaciar todo pide confirmación en el mismo lugar: es lo único que no se puede deshacer de un toque */
function VaciarPedido() {
    const { vaciar } = usePedido();
    const notificar = useToast();
    const [confirmando, setConfirmando] = useState(false);

    if (!confirmando) {
        return (
            <button type="button" className="vaciar__enlace" onClick={() => setConfirmando(true)}>
                Vaciar pedido
            </button>
        );
    }

    return (
        <div className="vaciar" role="group" aria-label="Confirmar que se vacía el pedido">
            <p className="vaciar__pregunta">¿Vaciar todo el pedido?</p>
            <div className="vaciar__acciones">
                <Boton
                    variante="rojo"
                    onClick={() => {
                        vaciar();
                        notificar.info('Vaciaste el pedido.');
                    }}
                >
                    Sí, vaciar
                </Boton>
                <Boton variante="hueso" onClick={() => setConfirmando(false)} autoFocus>
                    No, dejarlo
                </Boton>
            </div>
        </div>
    );
}

function validar({ tipo, nombre, telefono, direccion }) {
    const errores = {};
    if (nombre.trim().length < 2) errores.nombre = 'Contanos tu nombre para llamarte cuando esté listo.';
    if (!esTelefonoValido(telefono)) errores.telefono = MENSAJE_TELEFONO;
    if (tipo === 'delivery' && direccion.trim().length < 5) errores.direccion = 'Falta la dirección de entrega, con calle y altura.';
    return errores;
}

/*
 * La comanda: lo único que falta decidir para que el pedido salga (cómo y desde qué local).
 * Va sobre el verde del salón, como el mitad y mitad de la carta.
 */
function Comanda({ onConfirmado }) {
    const { items, cantidadTotal, total } = usePedido();
    const notificar = useToast();
    const { datos: locales, cargando, error, reintentar } = useApi(getLocales);
    const [tipo, setTipo] = useState('retiro');
    const [localId, setLocalId] = useState('');
    const [campos, setCampos] = useState({ nombre: '', telefono: '', direccion: '' });
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);

    const lista = locales ?? [];
    const porDefecto = lista.find((local) => estaAbierto(local)) ?? lista[0];
    const local = lista.find((item) => String(item.id) === localId) ?? porDefecto;
    const cerrado = Boolean(local) && tieneHorario(local) && !estaAbierto(local);

    const cambiarCampo = (evento) => {
        const { name, value } = evento.target;
        setCampos((actuales) => ({ ...actuales, [name]: value }));
        if (errores[name]) setErrores((actuales) => ({ ...actuales, [name]: undefined }));
    };

    const enviar = async (evento) => {
        evento.preventDefault();
        const formulario = evento.currentTarget;
        const nuevos = validar({ tipo, ...campos });
        setErrores(nuevos);

        const primero = Object.keys(nuevos)[0];
        if (primero) {
            formulario.elements[primero]?.focus();
            return;
        }

        setEnviando(true);
        try {
            const creado = await crearPedido({
                localId: local.id,
                tipo,
                cliente: { nombre: campos.nombre.trim(), telefono: campos.telefono.trim() },
                direccion: tipo === 'delivery' ? campos.direccion.trim() : undefined,
                items: items.map(({ productoId, nombre, categoria, subcategoria, variante, precio, cantidad }) => ({
                    productoId,
                    nombre,
                    categoria,
                    subcategoria,
                    variante,
                    precio,
                    cantidad
                }))
            });
            guardarSeguimiento(creado.codigoSeguimiento);
            onConfirmado({ tipo, local, nombre: campos.nombre.trim(), direccion: campos.direccion.trim(), codigo: creado.codigoSeguimiento });
        } catch (falla) {
            notificar.error(falla.message);
            setEnviando(false);
        }
    };

    return (
        <form className="comanda" onSubmit={enviar} noValidate aria-label="Datos del pedido">
            <div className="comanda__interior">
                <h2 className="comanda__titulo">Cómo lo recibís</h2>

                <fieldset className="comanda__modalidad">
                    <legend className="visualmente-oculto">Modalidad</legend>
                    {MODALIDADES.map(({ id, etiqueta }) => (
                        <label key={id} className="modalidad">
                            <input type="radio" name="modalidad" value={id} checked={tipo === id} onChange={() => setTipo(id)} />
                            <span>{etiqueta}</span>
                        </label>
                    ))}
                </fieldset>

                <div className="campo">
                    <label className="campo__etiqueta" htmlFor="campo-local">
                        {tipo === 'retiro' ? 'Local donde retirás' : 'Local que lo prepara'}
                    </label>
                    <select
                        id="campo-local"
                        name="local"
                        value={local ? String(local.id) : ''}
                        onChange={(evento) => setLocalId(evento.target.value)}
                        disabled={cargando || Boolean(error) || lista.length === 0}
                    >
                        {cargando && <option value="">Cargando locales…</option>}
                        {error && <option value="">No pudimos traer los locales</option>}
                        {lista.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nombre}
                            </option>
                        ))}
                    </select>

                    {error && (
                        <div className="comanda__aviso">
                            <p>{error.message}</p>
                            <Boton variante="hueso" onClick={reintentar}>
                                Reintentar
                            </Boton>
                        </div>
                    )}

                    {local && (
                        <p className="comanda__local" data-cerrado={cerrado || undefined}>
                            {local.direccion}. {describirHorario(local)}.
                        </p>
                    )}
                </div>

                <div className="comanda__par">
                    <Campo nombre="nombre" etiqueta="Tu nombre" error={errores.nombre}>
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

                {tipo === 'delivery' && (
                    <Campo nombre="direccion" etiqueta="Dirección de entrega" error={errores.direccion}>
                        {(props) => (
                            <input
                                {...props}
                                type="text"
                                autoComplete="street-address"
                                value={campos.direccion}
                                onChange={cambiarCampo}
                            />
                        )}
                    </Campo>
                )}

                <div className="comanda__total" aria-live="polite">
                    <p className="comanda__monto" key={total}>
                        {formatearPrecio(total)}
                    </p>
                    <p className="comanda__cantidad">Total de {plural(cantidadTotal)}</p>
                </div>

                {cerrado && (
                    <p className="comanda__aviso-cierre" role="status">
                        {local.nombre} está cerrado ahora. Elegí otro local o volvé cuando abra.
                    </p>
                )}

                <Boton type="submit" variante="rojo" cargando={enviando} disabled={!local || cerrado || enviando}>
                    {enviando ? 'Enviando…' : 'Confirmar pedido'}
                </Boton>
            </div>
        </form>
    );
}

function PedidoArmado({ onConfirmado }) {
    const { items, cantidadTotal, total } = usePedido();
    const ref = useRevelar();
    const grupos = agruparPorCategoria(items);

    return (
        <div className="carrito">
            <div className="carrito__partido">
                <div ref={ref} className="carrito__lectura">
                    <header className="carrito__portada">
                        <h1 className="carrito__titulo" data-revelar="subir">
                            Tu pedido
                        </h1>
                        <p className="carrito__bajada" data-revelar="subir" style={{ '--i': 1 }}>
                            Llevás {plural(cantidadTotal)} por {formatearPrecio(total)}. Ajustá las cantidades y elegí cómo lo
                            recibís.
                        </p>
                        <Link to="/carta" className="carrito__volver" data-revelar="subir" style={{ '--i': 2 }}>
                            <Icono nombre="flechaIzquierda" tamano={20} />
                            Seguir pidiendo
                        </Link>
                    </header>

                    <div className="carrito__grupos">
                        {grupos.map((grupo, indice) => (
                            <Grupo key={grupo.nombre} grupo={grupo} orden={indice} />
                        ))}
                    </div>

                    <VaciarPedido />
                </div>

                <Comanda onConfirmado={onConfirmado} />
            </div>
        </div>
    );
}

function Carrito() {
    const { items, vaciar } = usePedido();
    const [enviado, setEnviado] = useState(null);
    const [ultimoSeguimiento] = useState(() => leerSeguimientos()[0]);

    const alConfirmar = (datos) => {
        setEnviado(datos);
        vaciar();
    };

    if (enviado) {
        const { tipo, local, direccion, codigo } = enviado;
        return (
            <PantallaAparte
                alt="Un pizzero con gorra a cuadros, detrás del mostrador, con una porción de fugazzeta en la bandeja."
                titulo="Pedido enviado"
                bajada={
                    tipo === 'retiro'
                        ? `Se lo mandamos a Pin Pun ${local.nombre}. Lo retirás en ${local.direccion}.`
                        : `Se lo mandamos a Pin Pun ${local.nombre}. Va a ${direccion}.`
                }
            >
                <Boton a={`/seguimiento/${codigo}`} variante="rojo">
                    Seguir mi pedido
                </Boton>
                <Boton a="/carta" variante="hueso">
                    Volver a la carta
                </Boton>
            </PantallaAparte>
        );
    }

    if (items.length === 0) {
        return (
            <PantallaAparte
                alt="Un pizzero con gorra a cuadros, detrás del mostrador, con una porción de fugazzeta en la bandeja."
                titulo="Todavía no sumaste nada"
                bajada="Tocá cualquier precio de la carta y aparece acá, con su cantidad y su total."
            >
                <Boton a="/carta" variante="rojo">
                    Ir a la carta
                </Boton>
                {ultimoSeguimiento && (
                    <Boton a={`/seguimiento/${ultimoSeguimiento}`} variante="hueso">
                        Seguir mi último pedido
                    </Boton>
                )}
            </PantallaAparte>
        );
    }

    return <PedidoArmado onConfirmado={alConfirmar} />;
}

export default Carrito;
