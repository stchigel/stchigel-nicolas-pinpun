import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/*
 * React Router no baja solo hasta un "#ancla" ni vuelve arriba al cambiar de página.
 * Este componente se encarga de las dos cosas.
 */
function ScrollAlHash() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
            return;
        }

        const destino = document.getElementById(decodeURIComponent(hash.slice(1)));
        destino?.scrollIntoView({ block: 'start' });
    }, [pathname, hash]);

    return null;
}

export default ScrollAlHash;
