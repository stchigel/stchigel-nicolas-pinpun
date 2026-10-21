import Boton from '../Boton/Boton.jsx';
import Icono from '../Icono/Icono.jsx';
import { haceCuanto } from '../../utils/tiempo.js';

const clientes = (cantidad) => (cantidad === 1 ? 'el cliente de 1 pedido' : `los clientes de ${cantidad} pedidos`);

/*
 * Lo que el repartidor tiene que saber siempre: si su ubicación se está compartiendo, con quién y cómo cortarlo.
 * Solo aparece mientras lleva algún pedido En camino.
 */
function UbicacionCompartida({ estado, cantidad, ultimoEnvio, precision, ahora, onPausar, onReanudar }) {
    if (estado === 'inactivo') return null;

    const problema = ['sin-senal', 'denegado', 'inseguro', 'no-soportado'].includes(estado);
    let titulo;
    let detalle;

    if (estado === 'activo') {
        titulo = `Estás compartiendo tu ubicación con ${clientes(cantidad)}.`;
        detalle = `${ultimoEnvio ? `Última vez: ${haceCuanto(new Date(ultimoEnvio).toISOString(), ahora)}. ` : ''}${precision ? `Precisión de unos ${precision} m. ` : ''}Dejá esta pantalla abierta: si la cerrás o cambiás de app, dejan de verte. Se corta sola al entregar.`;
    } else if (estado === 'pidiendo') {
        titulo = 'Pidiendo tu ubicación…';
        detalle = 'Si el navegador te pregunta, tocá "Permitir" para que los clientes vean por dónde vas.';
    } else if (estado === 'pausado') {
        titulo = 'Dejaste de compartir tu ubicación.';
        detalle = 'Los clientes no ven dónde estás hasta que vuelvas a compartirla.';
    } else if (estado === 'sin-senal') {
        titulo = 'No llegamos a ubicarte.';
        detalle = 'Seguimos intentando. Si estás bajo techo, probá salir a cielo abierto.';
    } else if (estado === 'denegado') {
        titulo = 'El navegador no nos deja usar tu ubicación.';
        detalle = 'Tocá el candado de la barra de direcciones, elegí Ubicación y marcá Permitir. Después volvé acá.';
    } else if (estado === 'inseguro') {
        titulo = 'No podemos compartir tu ubicación desde esta dirección.';
        detalle = 'El navegador solo da la ubicación en páginas con HTTPS. Abrí el portal desde la dirección segura del sitio.';
    } else {
        titulo = 'Este navegador no puede compartir la ubicación.';
        detalle = 'Probá con otro navegador. Mientras tanto, los clientes no ven dónde estás.';
    }

    return (
        <section className="ubicacion" data-estado={problema ? 'problema' : estado} aria-label="Tu ubicación compartida">
            <Icono nombre="ubicacion" tamano={26} />
            <div className="ubicacion__texto" role="status">
                <p className="ubicacion__titulo">{titulo}</p>
                <p className="ubicacion__detalle">{detalle}</p>
            </div>
            {estado === 'pausado' ? (
                <Boton variante="rojo" onClick={onReanudar}>
                    Volver a compartir
                </Boton>
            ) : (
                (estado === 'activo' || estado === 'pidiendo' || estado === 'sin-senal') && (
                    <Boton variante="hueso" onClick={onPausar}>
                        Dejar de compartir
                    </Boton>
                )
            )}
        </section>
    );
}

export default UbicacionCompartida;
