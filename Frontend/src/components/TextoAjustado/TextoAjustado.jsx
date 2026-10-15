import { useLayoutEffect, useRef } from 'react';
import './TextoAjustado.css';

/*
 * Escribe un texto en una sola línea con el tamaño justo para ocupar
 * todo el ancho de su contenedor. Se recalcula al cambiar el ancho
 * y cuando terminan de cargar las tipografías.
 */
function TextoAjustado({ as: Etiqueta = 'p', children, className = '', ...props }) {
    const contenedorRef = useRef(null);
    const textoRef = useRef(null);

    useLayoutEffect(() => {
        const contenedor = contenedorRef.current;
        const texto = textoRef.current;
        if (!contenedor || !texto) return;

        let anchoAnterior = 0;

        const ajustar = (forzar = false) => {
            const estilo = getComputedStyle(contenedor);
            const ancho =
                contenedor.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight);

            if (!forzar && ancho === anchoAnterior) return;
            anchoAnterior = ancho;
            texto.style.fontSize = '100px';
            const proporcion = ancho / texto.scrollWidth;
            texto.style.fontSize = `${Math.floor(100 * proporcion * 100) / 100}px`;
        };

        ajustar(true);
        document.fonts?.ready.then(() => ajustar(true));

        const observador = new ResizeObserver(() => ajustar());
        observador.observe(contenedor);
        return () => observador.disconnect();
    }, []);

    return (
        <Etiqueta ref={contenedorRef} className={`texto-ajustado ${className}`} {...props}>
            <span ref={textoRef} className="texto-ajustado__linea">
                {children}
            </span>
        </Etiqueta>
    );
}

export default TextoAjustado;
