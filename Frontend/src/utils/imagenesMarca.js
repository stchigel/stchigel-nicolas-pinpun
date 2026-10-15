/*
 * Imágenes de marca guardadas en src/assets/logo:
 * - "logo": el óvalo completo, para la barra de navegación.
 * - "texto": solo las letras PIN PUN, para la portada y el pie.
 * Devuelve null si el archivo todavía no existe.
 */
const archivos = import.meta.glob('../assets/logo/*.{png,svg,webp,jpg,jpeg,avif}', {
    eager: true,
    import: 'default'
});

const imagenes = Object.fromEntries(
    Object.entries(archivos).map(([ruta, url]) => [ruta.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase(), url])
);

export const obtenerImagenMarca = (nombre) => imagenes[nombre] ?? null;
