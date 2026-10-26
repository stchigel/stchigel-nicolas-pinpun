import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BarraEscena from '../../components/Escenario/BarraEscena.jsx';
import EscenaFija from '../../components/Escenario/EscenaFija.jsx';
import MitadYMitad from '../../components/Escenario/MitadYMitad.jsx';
import Boton from '../../components/Boton/Boton.jsx';
import EstadoMensaje from '../../components/EstadoMensaje/EstadoMensaje.jsx';
import ElegirServicio from '../../components/Sucursal/ElegirServicio.jsx';
import ServicioActual from '../../components/Sucursal/ServicioActual.jsx';
import { useProductosDeSucursal } from '../../hooks/useProductosDeSucursal.js';
import { useSucursal } from '../../hooks/useSucursal.js';
import { useRevelar } from '../../hooks/useRevelar.js';
import { usePedido } from '../../hooks/usePedido.js';
import { useToast } from '../../hooks/useToast.js';
import { ATAJOS_ESCENAS, ESCENA_PORTADA, ESCENAS, armarEscenas } from '../../utils/escenasCarta.js';
import { formatearPrecio } from '../../utils/formato.js';
import { nombreEnPedido } from '../../utils/carta.js';
import { obtenerFoto } from '../../utils/fotos.js';
import { ANIO_FUNDACION } from '../../utils/sitio.js';
import './CartaEscenario.css';

const FOTOS_ESCENA = [...new Set([ESCENA_PORTADA.foto, ...ESCENAS.map((escena) => escena.foto)])];

/* Franja de lectura: la escena activa es la barra que cruza una línea apenas arriba del medio de la pantalla */
const FRANJA_LECTURA = '-38% 0px -58% 0px';

function Esqueleto() {
    return (
        <div className="escenario__esqueleto" role="status">
            <span className="visualmente-oculto">Cargando la carta…</span>
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="escenario__esqueleto-barra" aria-hidden="true" />
            ))}
        </div>
    );
}

/* La fainá de la carta, para sumarla desde el cierre sin volver a buscarla */
const esFaina = (producto) => producto.nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() === 'faina';

function Cierre({ productos }) {
    const { items, cantidadTotal, agregar } = usePedido();
    const { local, puedePedir, elegir } = useSucursal();
    const notificar = useToast();
    const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const foto = obtenerFoto('faina');
    const ref = useRevelar();

    const faina = productos?.find(esFaina);
    const varianteFaina = faina?.variantes?.[0] ?? null;

    const sumarFaina = () => {
        agregar(faina, varianteFaina);
        notificar.exito(`Sumaste ${nombreEnPedido(faina, varianteFaina)} al pedido.`);
    };

    return (
        <section ref={ref} className="cierre" aria-labelledby="cierre-titulo">
            {foto && (
                <img
                    data-revelar="persiana"
                    className="cierre__foto"
                    src={foto}
                    alt="Porciones de fainá apiladas en la asadera, recién salidas del horno."
                    loading="lazy"
                    decoding="async"
                />
            )}
            <div className="cierre__texto">
                <h2 id="cierre-titulo" className="cierre__titulo" data-revelar="subir">
                    {!puedePedir
                        ? '¿Te quedaste con ganas?'
                        : cantidadTotal > 0
                          ? '¿Algo más arriba de la muzza?'
                          : 'La fainá va arriba de la muzza'}
                </h2>
                <p className="cierre__bajada" data-revelar="subir" style={{ '--i': 1 }}>
                    {!puedePedir
                        ? `Reservá tu mesa en ${local?.nombre ?? 'el local'} y la pizza te espera calentita. Si preferís, pedí y te la llevamos.`
                        : cantidadTotal > 0
                          ? `Llevás ${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'} por ${formatearPrecio(total)}.`
                          : 'Todavía no sumaste nada. Tocá cualquier precio de la carta y aparece en tu pedido.'}
                </p>
                <div className="cierre__acciones" data-revelar="subir" style={{ '--i': 2 }}>
                    {!puedePedir && (
                        <>
                            <Boton a="/reservas" variante="rojo">
                                Reservar una mesa
                            </Boton>
                            <Boton variante="hueso" onClick={() => elegir({ modo: 'pedir' })}>
                                Mejor pido
                            </Boton>
                        </>
                    )}
                    {puedePedir && faina && (
                        <Boton variante="rojo" onClick={sumarFaina}>
                            Agregar fainá{varianteFaina ? `, ${formatearPrecio(varianteFaina.precio)}` : ''}
                        </Boton>
                    )}
                    {puedePedir &&
                        (cantidadTotal > 0 ? (
                            <Boton a="/carrito" variante="verde">
                                Ver mi pedido
                            </Boton>
                        ) : (
                            <Boton href="#carta" variante="hueso">
                                Volver a la carta
                            </Boton>
                        ))}
                </div>
            </div>
        </section>
    );
}

/*
 * Carta en dos mitades: a la izquierda se lee (barras llenas que se abren),
 * a la derecha queda fija una foto del local que acompaña lo que se está leyendo.
 * La mitad y mitad rompe el partido a todo el ancho, y la última foto cierra con el pedido.
 */
function CartaDeLaSucursal() {
    const { datos: productos, cargando, error, reintentar } = useProductosDeSucursal();
    const { local, puedePedir, elegir } = useSucursal();
    const notificar = useToast();
    /* Todas las barras arrancan abiertas: se guardan las que el visitante cierra */
    const [cerradas, setCerradas] = useState(() => new Set());
    const [activa, setActiva] = useState(ESCENA_PORTADA.id);
    const portadaRef = useRef(null);
    const cartaRef = useRevelar();
    const barrasRef = useRef(new Map());

    useEffect(() => {
        if (error) notificar.error(error.message);
    }, [error, notificar]);

    const escenas = useMemo(() => (productos ? armarEscenas(productos) : []), [productos]);
    const escena = escenas.find((item) => item.id === activa) ?? ESCENA_PORTADA;

    /* El toggle inicial de las barras que ya arrancan abiertas no cuenta: solo cambia la foto si el visitante la abre */
    const cambiarBarra = useCallback(
        (id, abierta) => {
            if (!cerradas.has(id) === abierta) return;
            setCerradas((actuales) => {
                const nuevas = new Set(actuales);
                if (abierta) nuevas.delete(id);
                else nuevas.add(id);
                return nuevas;
            });
            if (abierta) setActiva(id);
        },
        [cerradas]
    );

    /* La foto sigue a la barra que se está leyendo */
    useEffect(() => {
        if (escenas.length === 0 || !('IntersectionObserver' in window)) return;

        const observador = new IntersectionObserver(
            (entradas) => {
                const visible = entradas.find((entrada) => entrada.isIntersecting);
                if (visible) setActiva(visible.target.dataset.escena);
            },
            { rootMargin: FRANJA_LECTURA }
        );

        if (portadaRef.current) observador.observe(portadaRef.current);
        barrasRef.current.forEach((elemento) => observador.observe(elemento));
        return () => observador.disconnect();
    }, [escenas]);

    const registrarBarra = (id) => (elemento) => {
        if (elemento) barrasRef.current.set(id, elemento);
        else barrasRef.current.delete(id);
    };

    const atajos = ATAJOS_ESCENAS.map((id) => escenas.find((item) => item.id === id)).filter(Boolean);

    let carta;
    if (cargando) {
        carta = <Esqueleto />;
    } else if (error) {
        carta = (
            <EstadoMensaje
                className="escenario__estado"
                titulo="No pudimos traer la carta."
                descripcion={error.message}
                accion="Reintentar"
                onAccion={reintentar}
            />
        );
    } else if (escenas.length === 0) {
        carta = (
            <EstadoMensaje
                className="escenario__estado"
                titulo="Todavía no hay platos cargados."
                descripcion="Volvé a pasar en un rato: el horno ya está prendido."
            />
        );
    } else {
        carta = (
            <div className="escenario__barras">
                {escenas.map((item, indice) => (
                    <BarraEscena
                        key={item.id}
                        orden={indice}
                        ref={registrarBarra(item.id)}
                        escena={item}
                        abierta={!cerradas.has(item.id)}
                        onCambiar={cambiarBarra}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="escenario">
            <div className="escenario__partido">
                <div className="escenario__lectura">
                    <header ref={portadaRef} className="escenario__portada" data-escena={ESCENA_PORTADA.id}>
                        <div className="escenario__rayas" aria-hidden="true" />
                        <ServicioActual />
                        <h1 className="escenario__titular">Pizza al molde, desde {ANIO_FUNDACION}</h1>
                        <p className="escenario__bajada">
                            {puedePedir
                                ? `La carta completa de ${local?.direccion ?? 'Pin Pun'}. Tocá cualquier precio y se suma a tu pedido.`
                                : `La carta del salón de ${local?.direccion ?? 'Pin Pun'}. Mirala tranquila antes de ir.`}
                        </p>
                        <div className="escenario__acciones">
                            {puedePedir ? (
                                <Boton href="#mitad" variante="rojo">
                                    Armar una mitad y mitad
                                </Boton>
                            ) : (
                                <>
                                    <Boton a="/reservas" variante="rojo">
                                        Reservar una mesa
                                    </Boton>
                                    <Boton variante="hueso" onClick={() => elegir({ modo: 'pedir' })}>
                                        Quiero pedir
                                    </Boton>
                                </>
                            )}
                            {atajos.length > 0 && (
                                <nav aria-label="Atajos de la carta">
                                    <ul className="escenario__atajos">
                                        {atajos.map((item) => (
                                            <li key={item.id}>
                                                <a href={`#escena-${item.id}`} onClick={() => cambiarBarra(item.id, true)}>
                                                    {item.titulo}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </header>

                    <section ref={cartaRef} id="carta" className="escenario__carta" aria-labelledby="carta-titulo">
                        <h2 id="carta-titulo" className="escenario__palabra" data-revelar="subir">
                            Carta
                        </h2>
                        {carta}
                    </section>
                </div>

                <EscenaFija escena={escena} fotos={FOTOS_ESCENA} />
            </div>

            {productos && puedePedir && <MitadYMitad productos={productos} />}

            <Cierre productos={productos} />
        </div>
    );
}

/* Antes de la carta se pregunta de qué sucursal y para qué; después se muestra la que corresponde */
function CartaEscenario() {
    const { mostrarSelector } = useSucursal();

    return mostrarSelector ? <ElegirServicio /> : <CartaDeLaSucursal />;
}

export default CartaEscenario;
