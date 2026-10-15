/* Configuración fija del sitio (navegación y enlaces externos). Los datos del negocio vienen de la API. */
export const ENLACES_IZQUIERDA = [
    { etiqueta: 'Menú', destino: '/menu' },
    { etiqueta: 'Contacto', destino: '/#contacto' }
];

export const ENLACES_DERECHA = [
    { etiqueta: 'Locales', destino: '/#locales' },
    { etiqueta: 'Historia', destino: '/#historia' }
];

export const ANIO_FUNDACION = 1927;

export const INSTAGRAM_PRINCIPAL = 'pinpuncorrientes';

export const urlInstagram = (usuario) => `https://www.instagram.com/${usuario}/`;

export const urlComoLlegar = ({ latitud, longitud }) =>
    `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`;

export const urlMapaEmbebido = ({ latitud, longitud }) =>
    `https://maps.google.com/maps?q=${latitud},${longitud}&z=16&output=embed`;

export const urlTelefono = (numero) => `tel:${numero.replace(/[^\d+]/g, '')}`;
