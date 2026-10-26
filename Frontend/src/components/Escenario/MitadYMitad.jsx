import { useId, useState } from 'react';
import Boton from '../Boton/Boton.jsx';
import PizzaMitades from './PizzaMitades.jsx';
import { usePedido } from '../../hooks/usePedido.js';
import { useToast } from '../../hooks/useToast.js';
import { useRevelar } from '../../hooks/useRevelar.js';
import { formatearPrecio } from '../../utils/formato.js';
import { pizzasEnTamano, precioEnTamano } from '../../utils/escenasCarta.js';
import './MitadYMitad.css';

/* Los tamaños en que se puede partir una pizza: la carta de cada sucursal usa los suyos (Chica o Mediana) */
const TAMANOS_POSIBLES = ['Grande', 'Mediana', 'Chica'];
const PREFERIDAS = ['Muzzarella', 'Napolitana'];

const elegir = (lista, id, respaldo) => lista.find((pizza) => String(pizza.id) === id) ?? respaldo ?? lista[0];

/*
 * La regla de la carta impresa ("en las mitad y mitad se cobra el precio más alto"),
 * hecha calculadora: se eligen el tamaño y las dos mitades, y se ve cuál marca el precio.
 */
function MitadYMitad({ productos }) {
    const { agregar } = usePedido();
    const notificar = useToast();
    const idTitulo = useId();
    const ref = useRevelar();
    const [tamanoElegido, setTamano] = useState(TAMANOS_POSIBLES[0]);
    const [ids, setIds] = useState([null, null]);

    const tamanos = TAMANOS_POSIBLES.filter((opcion) => pizzasEnTamano(productos, opcion).length > 0);
    if (tamanos.length === 0) return null;

    const tamano = tamanos.includes(tamanoElegido) ? tamanoElegido : tamanos[0];
    const disponibles = pizzasEnTamano(productos, tamano);

    const preferida = (nombre) => disponibles.find((pizza) => pizza.nombre === nombre);
    const primera = elegir(disponibles, ids[0], preferida(PREFERIDAS[0]));
    const segunda = elegir(disponibles, ids[1], preferida(PREFERIDAS[1]) ?? disponibles[1]);

    const precioPrimera = precioEnTamano(primera, tamano);
    const precioSegunda = precioEnTamano(segunda, tamano);
    const precio = Math.max(precioPrimera, precioSegunda);
    const misma = primera.id === segunda.id;
    const cara = precioPrimera >= precioSegunda ? primera : segunda;
    const cobraPrimera = !misma && precioPrimera > precioSegunda;
    const cobraSegunda = !misma && precioSegunda > precioPrimera;

    let explicacion;
    if (misma) explicacion = `Elegiste la misma de los dos lados: es una ${primera.nombre} entera.`;
    else if (precioPrimera === precioSegunda) explicacion = 'Las dos mitades cuestan lo mismo.';
    else explicacion = `Se cobra el precio de la ${cara.nombre}, la más cara de las dos.`;

    const cambiarMitad = (indice) => (evento) => {
        const id = evento.target.value;
        setIds((actuales) => actuales.map((actual, i) => (i === indice ? id : actual)));
    };

    const sumar = () => {
        const variante = { nombre: tamano, precio };

        if (misma) {
            agregar(primera, variante);
            notificar.exito(`Sumaste ${primera.nombre} (${tamano}) al pedido.`);
            return;
        }

        const [a, b] = [primera.id, segunda.id].sort();
        const nombre = `Mitad ${primera.nombre} y mitad ${segunda.nombre}`;
        agregar({ id: `mitad:${a}-${b}`, cartaId: primera.cartaId, nombre, categoria: 'Pizzas', subcategoria: '', precio }, variante);
        notificar.exito(`Sumaste ${nombre} (${tamano}) al pedido.`);
    };

    return (
        <section ref={ref} id="mitad" className="mitad" aria-labelledby={idTitulo}>
            <div className="mitad__interior contenedor">
                <figure className="mitad__plato" data-revelar="persiana">
                    <PizzaMitades primera={primera} segunda={segunda} />
                    <figcaption className="mitad__etiquetas" aria-hidden="true">
                        <span className="mitad__etiqueta" data-cobra={cobraPrimera || undefined}>
                            {primera.nombre}
                        </span>
                        <span className="mitad__etiqueta" data-cobra={cobraSegunda || undefined}>
                            {segunda.nombre}
                        </span>
                    </figcaption>
                </figure>

                <div className="mitad__panel">
                    <h2 id={idTitulo} className="mitad__titulo" data-revelar="subir">Mitad y mitad</h2>
                    <p className="mitad__bajada" data-revelar="subir" style={{ '--i': 1 }}>Elegí las dos mitades. Como en el mostrador, se cobra la más cara.</p>

                    <fieldset className="mitad__tamanos" data-revelar="subir" style={{ '--i': 2 }}>
                        <legend className="visualmente-oculto">Tamaño</legend>
                        {tamanos.map((opcion) => (
                            <label key={opcion} className="mitad__tamano">
                                <input
                                    type="radio"
                                    name="mitad-tamano"
                                    value={opcion}
                                    checked={tamano === opcion}
                                    onChange={() => setTamano(opcion)}
                                />
                                <span>{opcion}</span>
                            </label>
                        ))}
                    </fieldset>

                    <div className="mitad__mitades" data-revelar="subir" style={{ '--i': 3 }}>
                        {[primera, segunda].map((pizza, indice) => (
                            <label key={indice} className="mitad__campo">
                                <span className="mitad__campo-nombre">{indice === 0 ? 'Una mitad' : 'La otra mitad'}</span>
                                <select value={pizza.id} onChange={cambiarMitad(indice)}>
                                    {disponibles.map((opcion) => (
                                        <option key={opcion.id} value={opcion.id}>
                                            {opcion.nombre}, {formatearPrecio(precioEnTamano(opcion, tamano))}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ))}
                    </div>

                    <div className="mitad__total" aria-live="polite" data-revelar="subir" style={{ '--i': 4 }}>
                        <p className="mitad__precio">{formatearPrecio(precio)}</p>
                        <p className="mitad__explicacion">{explicacion}</p>
                    </div>

                    <Boton variante="rojo" onClick={sumar} data-revelar="subir" style={{ '--i': 5 }}>
                        Sumar al pedido
                    </Boton>
                </div>
            </div>
        </section>
    );
}

export default MitadYMitad;
