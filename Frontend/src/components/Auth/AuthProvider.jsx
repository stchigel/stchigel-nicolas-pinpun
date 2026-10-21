import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from './AuthContext.js';
import { registrarSesionVencida } from '../../services/api.js';
import { getSesion, login } from '../../services/authService.js';
import { borrarToken, guardarToken, leerToken } from '../../utils/almacenamientoSesion.js';
import { useToast } from '../../hooks/useToast.js';

/*
 * Sesión del panel de administración. Al cargar la página retoma la sesión guardada preguntándole
 * al servidor quién es; si el token ya no vale, la cierra y avisa.
 * `cargando` es verdadero solo mientras se verifica una sesión guardada.
 */
function AuthProvider({ children }) {
    const notificar = useToast();
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(() => Boolean(leerToken()));

    const salir = useCallback(() => {
        borrarToken();
        setUsuario(null);
    }, []);

    useEffect(() => {
        registrarSesionVencida(() => {
            salir();
            notificar.info('Tu sesión venció. Volvé a iniciar sesión.');
        });
        return () => registrarSesionVencida(null);
    }, [salir, notificar]);

    useEffect(() => {
        if (!leerToken()) return;

        const controlador = new AbortController();
        getSesion({ signal: controlador.signal })
            .then(setUsuario)
            .catch((error) => {
                if (error.name === 'AbortError') return;
                borrarToken();
            })
            .finally(() => {
                if (!controlador.signal.aborted) setCargando(false);
            });

        return () => controlador.abort();
    }, []);

    const ingresar = useCallback(async (mail, contrasena) => {
        const sesion = await login(mail, contrasena);
        guardarToken(sesion.token);
        setUsuario(sesion.usuario);
        return sesion.usuario;
    }, []);

    const valor = useMemo(() => ({ usuario, cargando, ingresar, salir }), [usuario, cargando, ingresar, salir]);

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
