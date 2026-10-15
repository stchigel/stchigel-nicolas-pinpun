import Foto from '../../Foto/Foto.jsx';
import { useRevelar } from '../../../hooks/useRevelar.js';
import { ANIO_FUNDACION } from '../../../utils/sitio.js';
import './Historia.css';

const DATOS = [
    { etiqueta: 'Abrió en', valor: ANIO_FUNDACION },
    { etiqueta: 'Primer local', valor: 'Av. Corrientes 3954, Almagro' },
    { etiqueta: 'Lo fundaron', valor: 'Los mismos inmigrantes italianos que abrieron Güerrín' }
];

const PREMIOS = [
    { nombre: 'Mejor pizzería, Buenos Aires Capital Gastronómica', anio: 2018 },
    { nombre: 'Mejor muzzarella, Muzza 5K', anio: 2015 }
];

const EN_EL_SALON = [
    'Pizzeros trabajando a la vista',
    'Columnas de cajas de pizza',
    'Barra para comer de parado',
    'Una botella de moscato en cada mesa',
    'Fotos de visitantes, de Gardel a Palito Ortega'
];

/* "Un lugar, muchas palabras" del boceto: el relato, los datos duros y fotos del salón. */
function Historia() {
    const ref = useRevelar();

    return (
        <section id="historia" className="historia contenedor" ref={ref} aria-labelledby="historia-titulo">
            <h2 id="historia-titulo" className="historia__titulo" data-revelar="subir">
                Un lugar, muchas historias
            </h2>

            <div className="historia__fila">
                <dl className="historia__datos">
                    {DATOS.map(({ etiqueta, valor }, indice) => (
                        <div key={etiqueta} className="historia__dato" data-revelar="fila" style={{ '--i': indice }}>
                            <dt>{etiqueta}</dt>
                            <dd>{valor}</dd>
                        </div>
                    ))}
                </dl>

                <p className="historia__relato" data-revelar="subir" style={{ '--i': 1 }}>
                    Pin Pun abrió en {ANIO_FUNDACION} en una casona afrancesada de Almagro. Adentro es
                    una pizzería de barrio de las de siempre: azulejos negros, piso calcáreo, carteles de neón y la
                    muzza saliendo del horno a la vista de todos. Casi cien años después, sigue siendo la pizzería
                    más antigua de la Ciudad.
                </p>
            </div>

            <div className="historia__fila historia__fila--registro">
                <div className="historia__registros">
                    <div>
                        <h3 className="historia__subtitulo" data-revelar="subir">
                            Premios
                        </h3>
                        <ul className="historia__lista">
                            {PREMIOS.map(({ nombre, anio }, indice) => (
                                <li key={nombre} data-revelar="fila" style={{ '--i': indice }}>
                                    <span>{nombre}</span>
                                    <span className="historia__anio">{anio}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="historia__subtitulo" data-revelar="subir">
                            En el salón
                        </h3>
                        <ul className="historia__lista">
                            {EN_EL_SALON.map((detalle, indice) => (
                                <li key={detalle} data-revelar="fila" style={{ '--i': indice + 2 }}>
                                    {detalle}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="historia__collage">
                    <div className="historia__foto-grande" data-revelar="persiana">
                        <Foto nombres="salon" alt="El salón de Pin Pun en Almagro" relacion="4 / 3" />
                    </div>
                    <div className="historia__foto-chica" data-revelar="persiana" style={{ '--i': 2 }}>
                        <Foto
                            nombres="pizzero"
                            alt="Un pizzero de Pin Pun sacando una muzza del horno"
                            relacion="4 / 5"
                            ilustracion="pizza"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Historia;
