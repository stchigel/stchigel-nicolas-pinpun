import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapaSeguimiento.css';

const MOSAICOS = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATRIBUCION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const ROJO = '#c1121f';

/* Marcadores dibujados con CSS (sin imágenes que el empaquetador tenga que resolver) */
const marcador = (clase, texto) =>
    L.divIcon({
        className: 'seg-marcador-caja',
        html: `<span class="seg-marcador ${clase}" aria-hidden="true">${texto}</span>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
    });

const puntoDe = ({ latitud, longitud }) => [latitud, longitud];

/*
 * Mapa con el local, el destino, el repartidor y el recorrido que le falta. El repartidor se mueve a medida que llega una
 * posición nueva y el recorrido se redibuja desde donde está; el mapa se encuadra para que se vean todos los puntos
 * y solo se vuelve a acomodar si aparece el destino o si el repartidor se sale de la vista.
 * Se carga solo cuando hace falta (la librería de mapas no viaja con el resto del sitio).
 */
function MapaSeguimiento({ local, repartidor, destino, ruta, nombreRepartidor }) {
    const contenedor = useRef(null);
    const mapa = useRef(null);
    const marcadorRepartidor = useRef(null);
    const marcadorDestino = useRef(null);
    const trazado = useRef(null);
    const encuadre = useRef({ inicial: false, conDestino: false });

    useEffect(() => {
        const instancia = L.map(contenedor.current, { scrollWheelZoom: false, zoomControl: true }).setView(puntoDe(local), 15);
        L.tileLayer(MOSAICOS, { maxZoom: 19, attribution: ATRIBUCION }).addTo(instancia);
        L.marker(puntoDe(local), { icon: marcador('seg-marcador--local', 'PP'), title: `Pin Pun ${local.nombre}`, keyboard: false }).addTo(instancia);
        mapa.current = instancia;

        return () => {
            instancia.remove();
            mapa.current = null;
            marcadorRepartidor.current = null;
            marcadorDestino.current = null;
            trazado.current = null;
            encuadre.current = { inicial: false, conDestino: false };
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [local.latitud, local.longitud, local.nombre]);

    /* El destino y el recorrido que falta (por debajo de los marcadores) */
    useEffect(() => {
        const instancia = mapa.current;
        if (!instancia) return;

        if (destino && !marcadorDestino.current) {
            marcadorDestino.current = L.marker(puntoDe(destino), {
                icon: marcador('seg-marcador--destino', 'Vos'),
                title: 'Tu dirección',
                keyboard: false
            }).addTo(instancia);
        }

        if (ruta?.puntos?.length > 1) {
            if (trazado.current) trazado.current.setLatLngs(ruta.puntos);
            else trazado.current = L.polyline(ruta.puntos, { color: ROJO, weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }).addTo(instancia);
        } else if (trazado.current) {
            trazado.current.remove();
            trazado.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destino?.latitud, destino?.longitud, ruta?.calculadaEn]);

    /* El repartidor, y el encuadre del mapa */
    useEffect(() => {
        const instancia = mapa.current;
        if (!instancia) return;

        const posicion = puntoDe(repartidor);

        if (!marcadorRepartidor.current) {
            marcadorRepartidor.current = L.marker(posicion, {
                icon: marcador('seg-marcador--repartidor', '&#9679;'),
                title: nombreRepartidor ? `${nombreRepartidor}, tu repartidor` : 'Tu repartidor',
                keyboard: false,
                zIndexOffset: 1000
            }).addTo(instancia);
        } else {
            marcadorRepartidor.current.setLatLng(posicion);
        }

        const puntos = [puntoDe(local), posicion, ...(destino ? [puntoDe(destino)] : [])];
        const faltaEncuadrar = !encuadre.current.inicial || (destino && !encuadre.current.conDestino);

        if (faltaEncuadrar) {
            instancia.fitBounds(puntos, { padding: [48, 48], maxZoom: 16 });
            encuadre.current = { inicial: true, conDestino: Boolean(destino) };
        } else if (!instancia.getBounds().pad(-0.1).contains(posicion)) {
            instancia.panTo(posicion);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repartidor.latitud, repartidor.longitud, local.latitud, local.longitud, destino?.latitud, destino?.longitud, nombreRepartidor]);

    return <div ref={contenedor} className="mapa-seguimiento" role="region" aria-label="Mapa con la posición de tu repartidor y tu dirección" />;
}

export default MapaSeguimiento;
