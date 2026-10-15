import { Link } from 'react-router-dom';
import Boton from '../../Boton/Boton.jsx';
import Cinta from '../../Fileteado/Cinta.jsx';
import Foto from '../../Foto/Foto.jsx';
import LogoTexto from '../../LogoTexto/LogoTexto.jsx';
import { ANIO_FUNDACION } from '../../../utils/sitio.js';
import './Hero.css';

/*
 * Portada: el rojo de la fachada de Av. Corrientes con el nombre a todo el ancho,
 * apoyado abajo como el cartel del local. Arriba, la cinta del año, una frase,
 * la acción principal y fotos del local enmarcadas con filete.
 */
function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-titulo">
            <div className="hero__cuerpo contenedor">
                <div className="hero__texto">
                    <div className="hero__cinta" data-entrada style={{ '--i': 0 }}>
                        <Cinta variante="verde">{`Desde ${ANIO_FUNDACION}`}</Cinta>
                    </div>
                    <p className="hero__bajada" data-entrada style={{ '--i': 1 }}>
                        La pizzería más antigua de Buenos Aires. Muzza al molde, fainá y moscato, de Av. Corrientes
                        3954 hasta Lanús.
                    </p>
                    <div className="hero__acciones" data-entrada style={{ '--i': 2 }}>
                        <Boton a="/menu">Ver el menú</Boton>
                        <Link to="/reservas" className="hero__enlace">
                            Reservá una mesa
                        </Link>
                    </div>
                </div>

                <figure className="hero__marco" data-entrada style={{ '--i': 1 }}>
                    <Foto
                        className="hero__foto"
                        nombres={['fachada', 'salon', 'pizzero']}
                        alt="La fachada roja de Pin Pun en Av. Corrientes"
                        relacion={null}
                        ilustracion="pizza"
                        prioridad
                    />
                </figure>
            </div>

            <LogoTexto
                as="h1"
                id="hero-titulo"
                etiqueta={`Pin Pun, pizzería desde ${ANIO_FUNDACION}`}
                className="hero__nombre contenedor"
                data-entrada
                style={{ '--i': 3 }}
            />
        </section>
    );
}

export default Hero;
