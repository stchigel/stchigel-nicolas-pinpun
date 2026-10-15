import { Link } from 'react-router-dom';
import Boton from '../../Boton/Boton.jsx';
import Cinta from '../../Fileteado/Cinta.jsx';
import LetraFileteada from '../../Fileteado/LetraFileteada.jsx';
import MarcoFileteado from '../../Fileteado/MarcoFileteado.jsx';
import { useRevelar } from '../../../hooks/useRevelar.js';
import { ANIO_FUNDACION } from '../../../utils/sitio.js';
import './Hero.css';

/*
 * Portada: un cartel fileteado colgado sobre los azulejos negros del salón,
 * centrado como en el boceto, con la cinta del año, el nombre en letra de cartel
 * y la acción principal.
 */
function Hero() {
    const ref = useRevelar();

    return (
        <section className="hero" ref={ref} aria-labelledby="hero-titulo">
            <div className="hero__cuerpo contenedor">
                <MarcoFileteado className="hero__cartel">
                    <div className="hero__cinta" data-entrada style={{ '--i': 0 }}>
                        <Cinta>{`Desde ${ANIO_FUNDACION}`}</Cinta>
                    </div>

                    <h1 id="hero-titulo" className="hero__titulo" data-entrada style={{ '--i': 1 }}>
                        <LetraFileteada texto="PIN PUN" etiqueta={`Pin Pun, pizzería desde ${ANIO_FUNDACION}`} />
                    </h1>

                    <p className="hero__rubro" data-entrada style={{ '--i': 2 }}>
                        Pizzería y bodegón porteño
                    </p>

                    <p className="hero__bajada" data-entrada style={{ '--i': 3 }}>
                        La pizzería más antigua de Buenos Aires. Muzza al molde, fainá y moscato, de Av. Corrientes
                        3954 hasta Lanús.
                    </p>

                    <div className="hero__acciones" data-entrada style={{ '--i': 4 }}>
                        <Boton a="/menu">Ver el menú</Boton>
                        <Link to="/reservas" className="hero__enlace">
                            Reservá una mesa
                        </Link>
                    </div>
                </MarcoFileteado>
            </div>
        </section>
    );
}

export default Hero;
