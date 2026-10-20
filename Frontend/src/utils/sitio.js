/* Configuración fija del sitio (navegación y enlaces externos). Los datos del negocio vienen de la API. */
export const ENLACES_IZQUIERDA = [
    { etiqueta: 'Menú', destino: '/carta' },
    { etiqueta: 'Contacto', destino: '/#contacto' }
];

export const ENLACES_DERECHA = [
    { etiqueta: 'Locales', destino: '/#locales' },
    { etiqueta: 'Historia', destino: '/#historia' }
];

export const ANIO_FUNDACION = 1927;

export const INSTAGRAM_PRINCIPAL = 'pinpuncorrientes';

export const urlInstagram = (usuario) => `https://www.instagram.com/${usuario}/`;

/*
 * Los mapas buscan el local por nombre y dirección, no por coordenadas:
 * así Google abre la ficha de Pin Pun en lugar del negocio que quede más cerca del punto.
 */
const busquedaLocal = ({ direccion }) => encodeURIComponent(`Pin Pun, ${direccion}`);

export const urlComoLlegar = (local) => `https://www.google.com/maps/dir/?api=1&destination=${busquedaLocal(local)}`;

export const urlMapaEmbebido = (local) => `https://maps.google.com/maps?q=${busquedaLocal(local)}&z=16&output=embed`;

export const urlTelefono = (numero) => `tel:${numero.replace(/[^\d+]/g, '')}`;
