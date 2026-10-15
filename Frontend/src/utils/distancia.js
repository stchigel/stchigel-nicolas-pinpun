const RADIO_TIERRA_KM = 6371;

const aRadianes = (grados) => (grados * Math.PI) / 180;

/* Distancia en km entre dos coordenadas (fórmula de Haversine). */
export function calcularDistanciaKm(origen, destino) {
    const dLat = aRadianes(destino.latitud - origen.latitud);
    const dLon = aRadianes(destino.longitud - origen.longitud);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(aRadianes(origen.latitud)) * Math.cos(aRadianes(destino.latitud)) * Math.sin(dLon / 2) ** 2;

    return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(a));
}

/* Devuelve cada local con su distancia a la ubicación, del más cercano al más lejano. */
export function ordenarPorDistancia(ubicacion, locales) {
    return locales
        .map((local) => ({ local, distanciaKm: calcularDistanciaKm(ubicacion, local) }))
        .sort((a, b) => a.distanciaKm - b.distanciaKm);
}

/* Pide la ubicación del navegador y la devuelve como promesa. */
export function obtenerUbicacion() {
    return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
            reject(new Error('Tu navegador no permite compartir la ubicación.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => resolve({ latitud: coords.latitude, longitud: coords.longitude }),
            () => reject(new Error('No pudimos acceder a tu ubicación. Revisá los permisos del navegador.')),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
    });
}
