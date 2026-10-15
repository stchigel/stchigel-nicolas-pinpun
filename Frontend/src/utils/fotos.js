/*
 * Busca las fotos reales que haya en src/assets/fotos.
 * Se referencian por nombre de archivo sin extensión ("fachada", "salon")
 * o por el nombre que guarda el backend ("muzzarella.jpg").
 * Si la foto todavía no existe, devuelve null y el componente Foto dibuja un reemplazo.
 */
const archivos = import.meta.glob('../assets/fotos/**/*.{jpg,jpeg,png,webp,avif}', {
    eager: true,
    import: 'default'
});

const quitarExtension = (nombre) => nombre.replace(/\.[^.]+$/, '').toLowerCase();

const fotos = Object.fromEntries(
    Object.entries(archivos).map(([ruta, url]) => [quitarExtension(ruta.split('/').pop()), url])
);

export function obtenerFoto(nombre) {
    if (!nombre) return null;
    return fotos[quitarExtension(nombre)] ?? null;
}

export function obtenerFotos(nombres) {
    return nombres.map(obtenerFoto).filter(Boolean);
}
