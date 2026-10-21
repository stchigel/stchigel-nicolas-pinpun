import { useEffect, useId, useMemo, useRef, useState } from 'react';
import AccionConfirmada from '../../components/Admin/AccionConfirmada.jsx';
import CargaAdmin from '../../components/Admin/CargaAdmin.jsx';
import EncabezadoAdmin from '../../components/Admin/EncabezadoAdmin.jsx';
import Boton from '../../components/Boton/Boton.jsx';
import Campo from '../../components/Campo/Campo.jsx';
import EstadoMensaje from '../../components/EstadoMensaje/EstadoMensaje.jsx';
import Icono from '../../components/Icono/Icono.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../../hooks/useToast.js';
import { createProducto, deleteProducto, getProductos, updateProducto } from '../../services/productoService.js';
import { desplazarA, esPantallaAngosta } from '../../utils/desplazar.js';
import { formatearPrecio } from '../../utils/formato.js';
import './AdminMenu.css';

const NUEVO = 'nuevo';

const sinTildes = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const resumenDePrecios = (producto) =>
    producto.variantes.length > 0
        ? producto.variantes.map((variante) => `${variante.nombre} ${formatearPrecio(variante.precio)}`).join(' · ')
        : formatearPrecio(producto.precio);

const esPrecio = (texto) => texto.trim() !== '' && Number.isFinite(Number(texto)) && Number(texto) > 0;

const aFormulario = (producto) => ({
    nombre: producto?.nombre ?? '',
    categoria: producto?.categoria ?? '',
    subcategoria: producto?.subcategoria ?? '',
    descripcion: producto?.descripcion ?? '',
    imagen: producto?.imagen ?? '',
    destacado: producto?.destacado ?? false,
    modo: producto?.variantes.length > 0 ? 'tamanos' : 'unico',
    precio: producto && producto.variantes.length === 0 ? String(producto.precio) : '',
    tamanos:
        producto?.variantes.length > 0
            ? producto.variantes.map((variante) => ({ nombre: variante.nombre, precio: String(variante.precio) }))
            : [{ nombre: '', precio: '' }]
});

function validar(formulario) {
    const errores = {};
    if (formulario.nombre.trim() === '') errores.nombre = 'Escribí el nombre del producto.';
    if (formulario.categoria.trim() === '') errores.categoria = 'Elegí o escribí la categoría.';

    if (formulario.modo === 'unico') {
        if (!esPrecio(formulario.precio)) errores.precio = 'Escribí un precio mayor a 0.';
    } else {
        const nombres = formulario.tamanos.map((tamano) => sinTildes(tamano.nombre.trim()));
        if (formulario.tamanos.length === 0 || formulario.tamanos.some((tamano) => tamano.nombre.trim() === '' || !esPrecio(tamano.precio))) {
            errores.tamanos = 'Cada tamaño necesita un nombre y un precio mayor a 0.';
        } else if (new Set(nombres).size !== nombres.length) {
            errores.tamanos = 'Los tamaños no pueden repetir el nombre.';
        }
    }

    return errores;
}

const aProducto = (formulario) => ({
    nombre: formulario.nombre.trim(),
    categoria: formulario.categoria.trim(),
    subcategoria: formulario.subcategoria.trim(),
    descripcion: formulario.descripcion.trim(),
    imagen: formulario.imagen.trim(),
    destacado: formulario.destacado,
    ...(formulario.modo === 'unico'
        ? { precio: Number(formulario.precio), variantes: [] }
        : { variantes: formulario.tamanos.map((tamano) => ({ nombre: tamano.nombre.trim(), precio: Number(tamano.precio) })) })
});

/* Formulario de un producto: el mismo para crear y para editar, sobre el panel verde */
function EditorProducto({ producto, categorias, subcategorias, onGuardado, onEliminado, onCerrar }) {
    const notificar = useToast();
    const idCategorias = useId();
    const idSubcategorias = useId();
    const [formulario, setFormulario] = useState(() => aFormulario(producto));
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);
    const nuevo = producto === null;

    const cambiar = (nombre, valor) => {
        setFormulario((actual) => ({ ...actual, [nombre]: valor }));
        if (errores[nombre]) setErrores((actuales) => ({ ...actuales, [nombre]: undefined }));
    };

    const cambiarTexto = (evento) => cambiar(evento.target.name, evento.target.value);

    const cambiarTamano = (indice, campo, valor) => {
        setFormulario((actual) => ({
            ...actual,
            tamanos: actual.tamanos.map((tamano, i) => (i === indice ? { ...tamano, [campo]: valor } : tamano))
        }));
        if (errores.tamanos) setErrores((actuales) => ({ ...actuales, tamanos: undefined }));
    };

    const agregarTamano = () => setFormulario((actual) => ({ ...actual, tamanos: [...actual.tamanos, { nombre: '', precio: '' }] }));

    const quitarTamano = (indice) =>
        setFormulario((actual) => ({ ...actual, tamanos: actual.tamanos.filter((_, i) => i !== indice) }));

    const guardar = async (evento) => {
        evento.preventDefault();
        const formularioHtml = evento.currentTarget;
        const nuevos = validar(formulario);
        setErrores(nuevos);

        const primero = Object.keys(nuevos)[0];
        if (primero) {
            (formularioHtml.elements[primero] ?? formularioHtml.querySelector('[name="tamano-nombre"]'))?.focus();
            return;
        }

        setGuardando(true);
        try {
            const datos = aProducto(formulario);
            const guardado = nuevo ? await createProducto(datos) : await updateProducto(producto.id, datos);
            notificar.exito(nuevo ? `Creaste ${guardado.nombre}.` : `Guardaste los cambios de ${guardado.nombre}.`);
            onGuardado(guardado);
        } catch (falla) {
            notificar.error(falla.message);
        } finally {
            setGuardando(false);
        }
    };

    const eliminar = async () => {
        try {
            await deleteProducto(producto.id);
            notificar.exito(`Eliminaste ${producto.nombre}.`);
            onEliminado(producto);
        } catch (falla) {
            notificar.error(falla.message);
        }
    };

    return (
        <form className="panel-edicion__formulario" onSubmit={guardar} noValidate aria-label={nuevo ? 'Nuevo producto' : `Editar ${producto.nombre}`}>
            <Campo nombre="nombre" etiqueta="Nombre" error={errores.nombre}>
                {(props) => <input {...props} type="text" value={formulario.nombre} onChange={cambiarTexto} />}
            </Campo>

            <div className="editor-par">
                <Campo nombre="categoria" etiqueta="Categoría" error={errores.categoria}>
                    {(props) => <input {...props} type="text" list={idCategorias} value={formulario.categoria} onChange={cambiarTexto} />}
                </Campo>
                <Campo nombre="subcategoria" etiqueta="Subcategoría">
                    {(props) => (
                        <input
                            {...props}
                            type="text"
                            list={idSubcategorias}
                            placeholder="Opcional"
                            value={formulario.subcategoria}
                            onChange={cambiarTexto}
                        />
                    )}
                </Campo>
            </div>
            <datalist id={idCategorias}>
                {categorias.map((categoria) => (
                    <option key={categoria} value={categoria} />
                ))}
            </datalist>
            <datalist id={idSubcategorias}>
                {subcategorias.map((subcategoria) => (
                    <option key={subcategoria} value={subcategoria} />
                ))}
            </datalist>

            <Campo nombre="descripcion" etiqueta="Descripción (opcional)">
                {(props) => <textarea {...props} rows={3} value={formulario.descripcion} onChange={cambiarTexto} />}
            </Campo>

            <div className="campo">
                <p className="campo__etiqueta" id="etiqueta-tipo-precio">
                    Precio
                </p>
                <fieldset className="segmentos" aria-labelledby="etiqueta-tipo-precio">
                    {[
                        { id: 'unico', etiqueta: 'Un solo precio' },
                        { id: 'tamanos', etiqueta: 'Por tamaño' }
                    ].map(({ id, etiqueta }) => (
                        <label key={id} className="segmento">
                            <input type="radio" name="modo" value={id} checked={formulario.modo === id} onChange={() => cambiar('modo', id)} />
                            <span>{etiqueta}</span>
                        </label>
                    ))}
                </fieldset>
            </div>

            {formulario.modo === 'unico' ? (
                <Campo nombre="precio" etiqueta="Precio en pesos" error={errores.precio}>
                    {(props) => <input {...props} type="text" inputMode="numeric" value={formulario.precio} onChange={cambiarTexto} />}
                </Campo>
            ) : (
                <div className="campo" data-error={errores.tamanos ? true : undefined}>
                    <p className="campo__etiqueta">Tamaños y precios</p>
                    <ul className="tamanos">
                        {formulario.tamanos.map((tamano, indice) => (
                            <li key={indice} className="tamanos__fila">
                                <input
                                    type="text"
                                    name="tamano-nombre"
                                    aria-label={`Nombre del tamaño ${indice + 1}`}
                                    placeholder="Grande"
                                    value={tamano.nombre}
                                    onChange={(evento) => cambiarTamano(indice, 'nombre', evento.target.value)}
                                />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    aria-label={`Precio del tamaño ${indice + 1}`}
                                    placeholder="$"
                                    value={tamano.precio}
                                    onChange={(evento) => cambiarTamano(indice, 'precio', evento.target.value)}
                                />
                                <button
                                    type="button"
                                    className="tamanos__quitar"
                                    aria-label={`Quitar el tamaño ${tamano.nombre || indice + 1}`}
                                    disabled={formulario.tamanos.length === 1}
                                    onClick={() => quitarTamano(indice)}
                                >
                                    <Icono nombre="cerrar" tamano={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                    {errores.tamanos && (
                        <p className="campo__error">
                            <Icono nombre="error" tamano={18} />
                            {errores.tamanos}
                        </p>
                    )}
                    <button type="button" className="admin__texto-boton" onClick={agregarTamano}>
                        <Icono nombre="sumar" tamano={18} />
                        Agregar otro tamaño
                    </button>
                </div>
            )}

            <Campo nombre="imagen" etiqueta="Nombre de la foto (opcional)">
                {(props) => <input {...props} type="text" placeholder="muzzarella.jpg" value={formulario.imagen} onChange={cambiarTexto} />}
            </Campo>

            <label className="casilla">
                <input
                    type="checkbox"
                    checked={formulario.destacado}
                    onChange={(evento) => cambiar('destacado', evento.target.checked)}
                />
                <span>Mostrar en “Nuestros más vendidos”</span>
            </label>

            <div className="panel-edicion__acciones">
                <Boton type="submit" variante="rojo" cargando={guardando} disabled={guardando}>
                    {guardando ? 'Guardando…' : nuevo ? 'Crear producto' : 'Guardar cambios'}
                </Boton>
                <Boton variante="hueso" onClick={onCerrar} disabled={guardando}>
                    Cerrar
                </Boton>
                {!nuevo && (
                    <AccionConfirmada
                        etiqueta="Eliminar"
                        pregunta={`¿Eliminar ${producto.nombre}? No se puede deshacer.`}
                        confirmar="Sí, eliminar"
                        rechazar="No, dejarlo"
                        onConfirmar={eliminar}
                        deshabilitado={guardando}
                    />
                )}
            </div>
        </form>
    );
}

/*
 * Menú: la carta completa, igual para todos los locales, con buscador y filtro por categoría.
 * Elegir un producto (o crear uno) abre su formulario en el panel verde de la derecha.
 */
function AdminMenu() {
    const { datos, cargando, error, reintentar } = useApi(getProductos);
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [seleccion, setSeleccion] = useState(null);
    const panelRef = useRef(null);
    const idBusqueda = useId();
    const idCategoria = useId();

    useEffect(() => {
        if (datos) setProductos(datos);
    }, [datos]);

    useEffect(() => {
        if (seleccion !== null && esPantallaAngosta()) desplazarA(panelRef.current);
    }, [seleccion]);

    const categorias = useMemo(() => [...new Set(productos.map((producto) => producto.categoria))], [productos]);
    const subcategorias = useMemo(
        () => [...new Set(productos.map((producto) => producto.subcategoria).filter(Boolean))],
        [productos]
    );

    const filtrados = productos.filter(
        (producto) =>
            (!categoria || producto.categoria === categoria) &&
            (!busqueda.trim() || sinTildes(`${producto.nombre} ${producto.subcategoria}`).includes(sinTildes(busqueda.trim())))
    );

    const grupos = [];
    filtrados.forEach((producto) => {
        const grupo = grupos.find((item) => item.nombre === producto.categoria);
        if (grupo) grupo.productos.push(producto);
        else grupos.push({ nombre: producto.categoria, productos: [producto] });
    });

    const seleccionado = seleccion !== null && seleccion !== NUEVO ? productos.find((producto) => producto.id === seleccion) : null;

    const alGuardar = (guardado) => {
        setProductos((actuales) =>
            actuales.some((producto) => producto.id === guardado.id)
                ? actuales.map((producto) => (producto.id === guardado.id ? guardado : producto))
                : [...actuales, guardado]
        );
        setSeleccion(guardado.id);
    };

    const alEliminar = (eliminado) => {
        setProductos((actuales) => actuales.filter((producto) => producto.id !== eliminado.id));
        setSeleccion(null);
    };

    return (
        <>
            <EncabezadoAdmin titulo="Menú" bajada="La carta es la misma para todos los locales: lo que cambies acá se ve en el sitio enseguida.">
                <Boton variante="rojo" onClick={() => setSeleccion(NUEVO)}>
                    <Icono nombre="sumar" tamano={18} />
                    Nuevo producto
                </Boton>
            </EncabezadoAdmin>

            <CargaAdmin cargando={cargando} error={error} onReintentar={reintentar} etiqueta="Cargando la carta…">
                <div className="admin-dos">
                    <div>
                        <div className="menu-filtros">
                            <div className="selector-admin">
                                <label htmlFor={idBusqueda}>Buscar</label>
                                <input
                                    id={idBusqueda}
                                    type="search"
                                    placeholder="Muzzarella, flan…"
                                    value={busqueda}
                                    onChange={(evento) => setBusqueda(evento.target.value)}
                                />
                            </div>
                            <div className="selector-admin">
                                <label htmlFor={idCategoria}>Categoría</label>
                                <select id={idCategoria} value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
                                    <option value="">Todas</option>
                                    {categorias.map((nombre) => (
                                        <option key={nombre} value={nombre}>
                                            {nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {grupos.length === 0 ? (
                            <EstadoMensaje
                                className="admin-vacio"
                                titulo="No hay productos con ese filtro."
                                descripcion="Probá con otra búsqueda o con otra categoría."
                            />
                        ) : (
                            grupos.map((grupo) => (
                                <section key={grupo.nombre} className="grupo-admin" aria-label={grupo.nombre}>
                                    <header className="grupo-admin__cabecera" aria-hidden="true">
                                        <h2 className="grupo-admin__titulo">{grupo.nombre}</h2>
                                        <p className="grupo-admin__dato">{grupo.productos.length}</p>
                                    </header>
                                    <ul className="grupo-admin__lista">
                                        {grupo.productos.map((producto) => (
                                            <li key={producto.id} className="producto" data-seleccionado={seleccion === producto.id || undefined}>
                                                <p className="producto__texto">
                                                    <span className="producto__nombre">
                                                        {producto.nombre}
                                                        {producto.subcategoria && <span className="producto__sub"> · {producto.subcategoria}</span>}
                                                        {producto.destacado && <span className="producto__destacado">Más vendido</span>}
                                                    </span>
                                                    <span className="producto__precios">{resumenDePrecios(producto)}</span>
                                                </p>
                                                <button
                                                    type="button"
                                                    className="admin__texto-boton"
                                                    aria-label={`Editar ${producto.nombre}`}
                                                    aria-pressed={seleccion === producto.id}
                                                    onClick={() => setSeleccion(producto.id)}
                                                >
                                                    <Icono nombre="editar" tamano={18} />
                                                    Editar
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))
                        )}
                    </div>

                    <aside ref={panelRef} className="panel-edicion" aria-label="Editor de productos">
                        {seleccion === null || (seleccion !== NUEVO && !seleccionado) ? (
                            <div className="panel-edicion__vacio">
                                <h2 className="panel-edicion__titulo">Editor</h2>
                                <p>Elegí un producto de la lista para cambiar su nombre, sus precios o su descripción, o creá uno nuevo.</p>
                                <Boton variante="hueso" onClick={() => setSeleccion(NUEVO)}>
                                    Nuevo producto
                                </Boton>
                            </div>
                        ) : (
                            <>
                                <h2 className="panel-edicion__titulo">{seleccion === NUEVO ? 'Nuevo producto' : 'Editar producto'}</h2>
                                <EditorProducto
                                    key={seleccion}
                                    producto={seleccionado ?? null}
                                    categorias={categorias}
                                    subcategorias={subcategorias}
                                    onGuardado={alGuardar}
                                    onEliminado={alEliminar}
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

export default AdminMenu;
