import { useEffect, useRef } from 'react';

/*
 * Marca un elemento como visible la primera vez que entra en pantalla.
 * El CSS decide cómo entra cada parte (ver styles/revelar.css).
 * Si el navegador no soporta IntersectionObserver, se muestra directamente.
 */
export function useRevelar() {
    const ref = useRef(null);

    useEffect(() => {
        const elemento = ref.current;
        if (!elemento) return;

        if (!('IntersectionObserver' in window)) {
            elemento.classList.add('esta-visible');
            return;
        }

        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (!entrada.isIntersecting) return;
                elemento.classList.add('esta-visible');
                observador.disconnect();
            },
            { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
        );

        observador.observe(elemento);
        return () => observador.disconnect();
    }, []);

    return ref;
}
