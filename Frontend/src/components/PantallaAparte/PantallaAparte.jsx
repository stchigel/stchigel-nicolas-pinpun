import { useRevelar } from '../../hooks/useRevelar.js';
import { obtenerFoto } from '../../utils/fotos.js';
import './PantallaAparte.css';

/*
 * Pantalla con una foto a sangre a un lado y un mensaje al otro: el pedido vacío, el pedido enviado,
 * la reserva pedida. `foto` es el nombre de una imagen de src/assets/fotos.
 */
function PantallaAparte({ foto = 'pizzero', alt, posicion = '50% 72%', titulo, bajada, children }) {
    const url = obtenerFoto(foto);
    const ref = useRevelar();

    return (
        <section ref={ref} className="aparte" aria-labelledby="aparte-titulo">
            {url && (
                <img
                    data-revelar="persiana"
                    className="aparte__foto"
                    src={url}
                    alt={alt}
                    style={{ objectPosition: posicion }}
                    decoding="async"
                />
            )}
            <div className="aparte__texto">
                <h1 id="aparte-titulo" className="aparte__titulo" data-revelar="subir">
                    {titulo}
                </h1>
                <p className="aparte__bajada" data-revelar="subir" style={{ '--i': 1 }}>
                    {bajada}
                </p>
                <div className="aparte__acciones" data-revelar="subir" style={{ '--i': 2 }}>
                    {children}
                </div>
            </div>
        </section>
    );
}

export default PantallaAparte;
