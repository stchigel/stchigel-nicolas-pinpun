import { useCallback, useEffect, useState } from 'react';

/*
 * Ejecuta una función de servicio al montar el componente y expone
 * los tres estados que toda pantalla necesita: cargando, error y datos.
 * `reintentar` vuelve a pedir la información.
 * Si `servicio` es null todavía no hay nada que pedir (falta un dato): sigue en "cargando" hasta que llegue.
 */
export function useApi(servicio) {
    const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        if (!servicio) return;

        const controlador = new AbortController();
        setEstado((anterior) => ({ ...anterior, cargando: true, error: null }));

        servicio({ signal: controlador.signal })
            .then((datos) => setEstado({ datos, cargando: false, error: null }))
            .catch((error) => {
                if (error.name === 'AbortError') return;
                setEstado({ datos: null, cargando: false, error });
            });

        return () => controlador.abort();
    }, [servicio, intento]);

    const reintentar = useCallback(() => setIntento((n) => n + 1), []);

    return { ...estado, reintentar };
}
