const formateadorPrecio = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
});

export const formatearPrecio = (precio) => formateadorPrecio.format(precio);

export const formatearDistancia = (km) =>
    km < 1
        ? `a ${Math.round(km * 1000)} m`
        : `a ${km.toLocaleString('es-AR', { maximumFractionDigits: 1 })} km`;
