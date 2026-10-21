/*
 * Lleva un elemento a la vista con un desplazamiento suave (instantáneo si el usuario pidió menos movimiento).
 * Sirve en pantallas angostas, donde el panel de edición queda debajo de la lista.
 */
export function desplazarA(elemento) {
    if (!elemento) return;

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    elemento.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
}

export const esPantallaAngosta = () => window.matchMedia('(max-width: 75rem)').matches;
