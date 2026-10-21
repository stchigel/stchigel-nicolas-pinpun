import { useCallback, useEffect, useRef, useState } from 'react';
import { informarUbicacion } from '../services/pedidoService.js';

const ENVIO_CADA_MS = 6000;

/*
 * Comparte la ubicación del repartidor con los clientes de los pedidos que va llevando (los que están En camino).
 * Solo funciona mientras esta pantalla esté abierta y encendida, así que pide al navegador que no la apague.
 *
 * `estado`:
 *   'inactivo'  no hay pedidos en camino, no se comparte nada
 *   'pausado'   el repartidor eligió dejar de compartir
 *   'pidiendo'  esperando el permiso o la primera posición
 *   'activo'    compartiendo (`ultimoEnvio` es cuándo se mandó por última vez)
 *   'sin-senal' el GPS no responde por ahora; sigue intentando
 *   'denegado'  el navegador no tiene permiso para la ubicación
 *   'inseguro'  el navegador solo da la ubicación en sitios con HTTPS
 *   'no-soportado'
 */
export function useCompartirUbicacion(idsEnCamino) {
    const [pausado, setPausado] = useState(false);
    const [medicion, setMedicion] = useState({ estado: 'pidiendo', ultimoEnvio: null, precision: null });
    const posicion = useRef(null);
    const ids = useRef(idsEnCamino);
    const clave = idsEnCamino.join(',');

    useEffect(() => {
        ids.current = idsEnCamino;
    }, [idsEnCamino]);

    const hayQueCompartir = idsEnCamino.length > 0 && !pausado;

    /* Mientras se comparte, la pantalla no se apaga (si el navegador lo permite) */
    useEffect(() => {
        if (!hayQueCompartir || !('wakeLock' in navigator)) return;

        let candado = null;
        let activo = true;

        const pedir = async () => {
            try {
                candado = await navigator.wakeLock.request('screen');
            } catch {
                /* Sin batería suficiente o sin permiso: el seguimiento sigue mientras la pantalla esté encendida */
            }
        };
        const alVolver = () => {
            if (activo && document.visibilityState === 'visible') pedir();
        };

        pedir();
        document.addEventListener('visibilitychange', alVolver);

        return () => {
            activo = false;
            document.removeEventListener('visibilitychange', alVolver);
            candado?.release().catch(() => {});
        };
    }, [hayQueCompartir]);

    useEffect(() => {
        if (!hayQueCompartir) return;

        if (!('geolocation' in navigator)) {
            setMedicion({ estado: 'no-soportado', ultimoEnvio: null, precision: null });
            return;
        }
        if (!window.isSecureContext) {
            setMedicion({ estado: 'inseguro', ultimoEnvio: null, precision: null });
            return;
        }

        posicion.current = null;
        setMedicion({ estado: 'pidiendo', ultimoEnvio: null, precision: null });

        const enviar = async () => {
            if (!posicion.current) return;

            const actual = posicion.current;
            const resultados = await Promise.allSettled(ids.current.map((id) => informarUbicacion(id, actual)));
            if (resultados.some((resultado) => resultado.status === 'fulfilled')) {
                setMedicion((anterior) => ({ ...anterior, estado: anterior.estado === 'denegado' ? anterior.estado : 'activo', ultimoEnvio: Date.now(), precision: actual.precision }));
            }
        };

        const vigilante = navigator.geolocation.watchPosition(
            ({ coords }) => {
                const primera = posicion.current === null;
                posicion.current = { latitud: coords.latitude, longitud: coords.longitude, precision: Math.round(coords.accuracy) };
                setMedicion((anterior) => ({ ...anterior, estado: 'activo', precision: posicion.current.precision }));
                /* La primera posición sale enseguida: el cliente no espera al siguiente turno del reloj */
                if (primera) enviar();
            },
            (error) => {
                setMedicion((anterior) => ({ ...anterior, estado: error.code === error.PERMISSION_DENIED ? 'denegado' : 'sin-senal' }));
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
        );

        /* Después se manda la última posición conocida cada tanto (también parado, para que el cliente sepa que sigue ahí) */
        const envio = setInterval(enviar, ENVIO_CADA_MS);

        return () => {
            navigator.geolocation.clearWatch(vigilante);
            clearInterval(envio);
        };
        // `clave` cambia cuando sale o termina un pedido: se vuelve a mandar enseguida con la lista nueva
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hayQueCompartir, clave]);

    const pausar = useCallback(() => setPausado(true), []);
    const reanudar = useCallback(() => setPausado(false), []);

    let estado = medicion.estado;
    if (idsEnCamino.length === 0) estado = 'inactivo';
    else if (pausado) estado = 'pausado';

    return { estado, ultimoEnvio: medicion.ultimoEnvio, precision: medicion.precision, cantidad: idsEnCamino.length, pausar, reanudar };
}
