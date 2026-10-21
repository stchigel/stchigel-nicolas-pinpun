import { distanciaEntre } from '../utils/distancia.js';

/*
 * Todo lo que sale a internet para el seguimiento: ubicar una dirección en el mapa y calcular el recorrido.
 * - Direcciones: Nominatim (OpenStreetMap). Pide identificarse y no más de un pedido por segundo: va en una cola
 *   y cada dirección se consulta una sola vez (queda en memoria).
 * - Recorridos y tiempo estimado: servidor público de OSRM (en auto).
 * Ambos son servicios públicos gratuitos pensados para poco tráfico: para uso intenso hay que apuntarlos a
 * un proveedor propio (GEOGRAFIA_GEOCODIFICADOR_URL y GEOGRAFIA_ENRUTADOR_URL).
 * Si fallan, devuelven null y el seguimiento sigue sin destino o sin recorrido: nunca frenan un pedido.
 * Con GEOGRAFIA_SIMULADA=1 responden datos inventados pero estables (para pruebas y para trabajar sin internet).
 */
const SIMULADA = process.env.GEOGRAFIA_SIMULADA === '1';
const GEOCODIFICADOR = process.env.GEOGRAFIA_GEOCODIFICADOR_URL ?? 'https://nominatim.openstreetmap.org/search';
const ENRUTADOR = process.env.GEOGRAFIA_ENRUTADOR_URL ?? 'https://router.project-osrm.org/route/v1/driving';
const AGENTE = process.env.GEOGRAFIA_AGENTE ?? 'PinPun/1.0 (proyecto academico)';
const TIEMPO_LIMITE_MS = 6000;
const ESPERA_ENTRE_BUSQUEDAS_MS = 1100;
const MAXIMO_PUNTOS_DE_RUTA = 120;
const VELOCIDAD_SIMULADA_MS = 25 / 3.6;

/* Buenos Aires y su conurbano: un resultado fuera de esta caja es una dirección que cayó en otra ciudad */
const ZONA = { latMin: -35.2, latMax: -34.3, lngMin: -59.3, lngMax: -57.9 };
const enZona = ({ latitud, longitud }) =>
    latitud >= ZONA.latMin && latitud <= ZONA.latMax && longitud >= ZONA.lngMin && longitud <= ZONA.lngMax;

const dormir = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

const pedirJson = async (url) => {
    const respuesta = await fetch(url, {
        headers: { 'User-Agent': AGENTE, 'Accept-Language': 'es' },
        signal: AbortSignal.timeout(TIEMPO_LIMITE_MS)
    });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    return respuesta.json();
};

/* Las búsquedas de direcciones salen de a una, con una pausa entre cada una */
let cola = Promise.resolve();
const enCola = (tarea) => {
    const resultado = cola.then(tarea);
    cola = resultado.then(
        () => dormir(ESPERA_ENTRE_BUSQUEDAS_MS),
        () => dormir(ESPERA_ENTRE_BUSQUEDAS_MS)
    );
    return resultado;
};

const direcciones = new Map();

/* Un punto estable, cerca de Almagro, que depende solo del texto: así las pruebas no dependen de internet */
const simularDireccion = (direccion) => {
    if (direccion.toLowerCase().includes('inexistente')) return null;

    const suma = [...direccion].reduce((total, letra) => total + letra.charCodeAt(0), 0);
    return {
        latitud: -34.6037 + ((suma % 400) - 200) / 10000,
        longitud: -58.42 + ((Math.floor(suma / 400) % 400) - 200) / 10000
    };
};

/* Si se conoce dónde reparte el local, la búsqueda se limita a un cuadrado alrededor suyo: una "Medrano 850" tiene que ser la del barrio */
const RADIO_DE_REPARTO_GRADOS = 0.09;
const cuadradoAlrededor = ({ latitud, longitud }) =>
    `&viewbox=${longitud - RADIO_DE_REPARTO_GRADOS},${latitud + RADIO_DE_REPARTO_GRADOS},${longitud + RADIO_DE_REPARTO_GRADOS},${latitud - RADIO_DE_REPARTO_GRADOS}&bounded=1`;

const buscarDireccion = async (consulta, cerca) => {
    const url = `${GEOCODIFICADOR}?format=jsonv2&limit=1&countrycodes=ar&q=${encodeURIComponent(`${consulta}, Buenos Aires, Argentina`)}${cerca ? cuadradoAlrededor(cerca) : ''}`;
    const [primero] = await enCola(() => pedirJson(url));
    const punto = primero ? { latitud: Number(primero.lat), longitud: Number(primero.lon) } : null;

    return punto && Number.isFinite(punto.latitud) && Number.isFinite(punto.longitud) && enZona(punto) ? punto : null;
};

/*
 * { latitud, longitud } de una dirección de papel, o null si no se encuentra o cae fuera de Buenos Aires.
 * Los clientes suelen escribir la calle y la altura sin el barrio, y hay calles con el mismo nombre en todo el conurbano:
 * por eso se busca primero dentro del área de reparto del local (`cerca`) y, si así no aparece, agregando su barrio (`zona`).
 * Sin `cerca` se busca en todo Buenos Aires.
 */
export const geocodificar = async (direccion, { zona = '', cerca = null } = {}) => {
    const texto = direccion.trim();
    if (SIMULADA) return simularDireccion(texto);

    const clave = `${texto}|${zona}|${cerca ? `${cerca.latitud},${cerca.longitud}` : ''}`;
    if (direcciones.has(clave)) return direcciones.get(clave);

    try {
        let punto = await buscarDireccion(texto, cerca);
        if (!punto && zona && !texto.toLowerCase().includes(zona.toLowerCase())) punto = await buscarDireccion(`${texto}, ${zona}`, cerca);

        direcciones.set(clave, punto);
        return punto;
    } catch (error) {
        console.warn(`No se pudo ubicar "${texto}" en el mapa: ${error.message}`);
        return null;
    }
};

/* Deja la ruta en un máximo de puntos, conservando el primero y el último */
const aligerar = (puntos) => {
    if (puntos.length <= MAXIMO_PUNTOS_DE_RUTA) return puntos;

    const paso = (puntos.length - 1) / (MAXIMO_PUNTOS_DE_RUTA - 1);
    return Array.from({ length: MAXIMO_PUNTOS_DE_RUTA }, (_, i) => puntos[Math.round(i * paso)]);
};

const simularRuta = (desde, hasta) => {
    const distanciaM = Math.round(distanciaEntre(desde, hasta) * 1.3);
    const puntos = Array.from({ length: 12 }, (_, i) => {
        const avance = i / 11;
        return [desde.latitud + (hasta.latitud - desde.latitud) * avance, desde.longitud + (hasta.longitud - desde.longitud) * avance];
    });

    return { puntos, distanciaM, duracionS: Math.round(distanciaM / VELOCIDAD_SIMULADA_MS) };
};

/* { puntos: [[lat, lng], ...], distanciaM, duracionS } del recorrido en auto, o null si no se pudo calcular */
export const calcularRuta = async (desde, hasta) => {
    if (SIMULADA) return simularRuta(desde, hasta);

    try {
        const url = `${ENRUTADOR}/${desde.longitud},${desde.latitud};${hasta.longitud},${hasta.latitud}?overview=full&geometries=geojson`;
        const datos = await pedirJson(url);
        const ruta = datos.routes?.[0];
        if (datos.code !== 'Ok' || !ruta) return null;

        return {
            puntos: aligerar(ruta.geometry.coordinates.map(([longitud, latitud]) => [latitud, longitud])),
            distanciaM: Math.round(ruta.distance),
            duracionS: Math.round(ruta.duration)
        };
    } catch (error) {
        console.warn(`No se pudo calcular el recorrido: ${error.message}`);
        return null;
    }
};
