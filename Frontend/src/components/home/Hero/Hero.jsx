import { Link } from 'react-router-dom';
import Boton from '../../Boton/Boton.jsx';
import Foto from '../../Foto/Foto.jsx';
import TextoAjustado from '../../TextoAjustado/TextoAjustado.jsx';
import { ANIO_FUNDACION } from '../../../utils/sitio.js';
import './Hero.css';

const NOMBRE = 'PIN PUN';

/*
 * Portada: el nombre como el cartel de la fachada roja de Av. Corrientes,
 * a todo el ancho y apoyado en el borde inferior. Arriba, el dato que importa
 * (desde 1927), una frase y la acción principal; a la derecha, fotos del local.
 */
function Hero() {
    return (
        <section className="hero" aria-labelledby="hero-titulo">
            <div className="hero__cuerpo contenedor">
                <div className="hero__texto">
                    <p className="hero__anio" data-entrada style={{ '--i': 0 }}>
                        Desde {ANIO_FUNDACION}
                    </p>
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

                <div className="hero__marco" data-entrada style={{ '--i': 1 }}>
                    <Foto
                        className="hero__foto"
                        nombres={['fachada', 'salon', 'pizzero']}
                        alt="La fachada roja de Pin Pun en Av. Corrientes"
                        relacion={null}
                        ilustracion="pizza"
                        prioridad
                    />
                </div>
            </div>

            <TextoAjustado as="h1" id="hero-titulo" className="hero__monumento contenedor">
                <span className="visualmente-oculto">Pin Pun, pizzería desde {ANIO_FUNDACION}</span>
                {[...NOMBRE].map((letra, indice) => (
                    <span key={indice} className="hero__letra" style={{ '--i': indice }} aria-hidden="true">
                        {letra === ' ' ? ' ' : letra}
                    </span>
                ))}
            </TextoAjustado>
        </section>
    );
}

export default Hero;
