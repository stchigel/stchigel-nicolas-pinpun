const RADIO_TIERRA_M = 6371000;

const aRadianes = (grados) => (grados * Math.PI) / 180;

/* Distancia en línea recta, en metros, entre dos puntos { latitud, longitud } (fórmula de haversine) */
export const distanciaEntre = (a, b) => {
    const dLat = aRadianes(b.latitud - a.latitud);
    const dLng = aRadianes(b.longitud - a.longitud);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(aRadianes(a.latitud)) * Math.cos(aRadianes(b.latitud)) * Math.sin(dLng / 2) ** 2;

    return 2 * RADIO_TIERRA_M * Math.asin(Math.sqrt(h));
};
