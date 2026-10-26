import { useId, useState } from 'react';
import Boton from '../Boton/Boton.jsx';
import EstadoMensaje from '../EstadoMensaje/EstadoMensaje.jsx';
import Remate from '../Fileteado/Remate.jsx';
import { useRevelar } from '../../hooks/useRevelar.js';
import { useSucursal } from '../../hooks/useSucursal.js';
import { estaAbierto, textoEstado, tieneHorario } from '../../utils/horario.js';
import './ElegirServicio.css';

const SERVICIOS = [
    {
        id: 'pedir',
        titulo: 'Quiero pedir',
        descripcion: (nombre) => `Delivery o retiro. Armás el pedido con la carta de ${nombre} y se suma todo al carrito.`
    },
    {
        id: 'ver',
        titulo: 'Voy a ir al local',
        descripcion: (nombre) => `Mirás la carta del salón de ${nombre} antes de ir, sin armar un pedido. Si querés, después reservás mesa.`
    }
];

function Esqueleto() {
    return (
        <div className="servicio__esqueleto" role="status">
            <span className="visualmente-oculto">Cargando las sucursales…</span>
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="servicio__hueco" aria-hidden="true" />
            ))}
        </div>
    );
}

/*
 * Lo primero que se pregunta al entrar a la carta: de qué sucursal y a qué se viene (a pedir o a mirar antes de ir).
 * Cada sucursal puede tener su propia carta, y una distinta para el salón, así que sin esto no se sabe cuál mostrar.
 * Arranca con la sucursal que ya estaba elegida (la de Corrientes la primera vez) y "pedir" tildado.
 */
function ElegirServicio() {
    const { locales, local, modo, yaEligio, cargando, error, reintentar, elegir, cerrarElegir } = useSucursal();
    const [localElegido, setLocalElegido] = useState(null);
    const [servicio, setServicio] = useState(modo);
    const idTitulo = useId();
    const ref = useRevelar();

    const seleccion = locales?.find((item) => item.id === localElegido) ?? local;

    const continuar = (evento) => {
        evento.preventDefault();
        if (!seleccion) return;
        elegir({ localId: seleccion.id, modo: servicio });
    };

    let sucursales;
    if (cargando) {
        sucursales = <Esqueleto />;
    } else if (error) {
        sucursales = (
            <EstadoMensaje
                titulo="No pudimos traer las sucursales."
                descripcion={error.message}
                accion="Reintentar"
                onAccion={reintentar}
            />
        );
    } else {
        sucursales = (
            <div className="servicio__sucursales">
                {locales.map((item) => (
                    <label key={item.id} className="servicio__sucursal">
                        <input
                            type="radio"
                            name="sucursal"
                            value={item.id}
                            checked={item.id === seleccion?.id}
                            onChange={() => setLocalElegido(item.id)}
                        />
                        <span className="servicio__sucursal-cuerpo">
                            <span className="servicio__sucursal-nombre">{item.nombre}</span>
                            <span className="servicio__sucursal-direccion">{item.direccion}</span>
                            <span className="servicio__sucursal-estado">
                                {tieneHorario(item) && (
                                    <span className="servicio__punto" data-abierto={estaAbierto(item) || undefined} aria-hidden="true" />
                                )}
                                {textoEstado(item)}
                            </span>
                        </span>
                    </label>
                ))}
            </div>
        );
    }

    return (
        <section ref={ref} className="servicio" aria-labelledby={idTitulo}>
            <form className="servicio__interior contenedor" onSubmit={continuar}>
                <header className="servicio__encabezado">
                    <Remate className="servicio__remate" />
                    <h1 id={idTitulo} className="servicio__titulo" data-revelar="subir">
                        Antes de la carta
                    </h1>
                    <p className="servicio__bajada" data-revelar="subir" style={{ '--i': 1 }}>
                        Cada sucursal puede tener su carta y sus precios, así que primero contanos cuál y a qué venís.
                    </p>
                </header>

                <fieldset className="servicio__grupo servicio__grupo--sucursal" data-revelar="subir" style={{ '--i': 2 }}>
                    <legend className="servicio__pregunta">¿De qué sucursal?</legend>
                    {sucursales}
                </fieldset>

                <fieldset className="servicio__grupo servicio__grupo--motivo" data-revelar="subir" style={{ '--i': 3 }}>
                    <legend className="servicio__pregunta">¿Y para qué la querés ver?</legend>
                    <div className="servicio__opciones">
                        {SERVICIOS.map((opcion) => (
                            <label key={opcion.id} className="servicio__opcion">
                                <input
                                    type="radio"
                                    name="servicio"
                                    value={opcion.id}
                                    checked={servicio === opcion.id}
                                    onChange={() => setServicio(opcion.id)}
                                />
                                <span className="servicio__opcion-cuerpo">
                                    <span className="servicio__opcion-titulo">{opcion.titulo}</span>
                                    <span className="servicio__opcion-texto">{opcion.descripcion(seleccion?.nombre ?? 'la sucursal')}</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="servicio__acciones" data-revelar="subir" style={{ '--i': 4 }}>
                    <Boton type="submit" variante="rojo" disabled={!seleccion}>
                        Ver la carta
                    </Boton>
                    {yaEligio && (
                        <Boton variante="hueso" onClick={cerrarElegir}>
                            Seguir con la que tenía
                        </Boton>
                    )}
                </div>
            </form>
        </section>
    );
}

export default ElegirServicio;
