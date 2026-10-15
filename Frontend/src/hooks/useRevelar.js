import { useLayoutEffect, useRef } from 'react';

/*
 * Marca un elemento como visible la primera vez que entra en pantalla.
 * Antes de pintar le agrega .revelable (para que el CSS pueda esconder lo que va a entrar)
 * y al entrar en pantalla, .esta-visible. El CSS decide cómo entra cada parte
 * (ver styles/revelar.css y components/Fileteado/Fileteado.css).
 */
export function useRevelar() {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const elemento = ref.current;
        if (!elemento) return;

        elemento.classList.add('revelable');

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
