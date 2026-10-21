import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Boton from '../../components/Boton/Boton.jsx';
import Campo from '../../components/Campo/Campo.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { obtenerFoto } from '../../utils/fotos.js';
import './AdminIngreso.css';

const CUENTAS_DE_PRUEBA = [
    { rol: 'Administración general', mail: 'admin@pinpun.com', contrasena: 'pinpun2026' },
    { rol: 'Sucursal Almagro', mail: 'almagro@pinpun.com', contrasena: 'almagro2026' },
    { rol: 'Sucursal Villa Urquiza', mail: 'urquiza@pinpun.com', contrasena: 'urquiza2026' }
];

const MAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Entrada al panel: la fachada de un lado y, sobre el verde del salón, el formulario del otro */
function AdminIngreso() {
    const { usuario, cargando, ingresar } = useAuth();
    const notificar = useToast();
    const navegar = useNavigate();
    const ubicacion = useLocation();
    const [campos, setCampos] = useState({ mail: '', contrasena: '' });
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const foto = obtenerFoto('fachada');

    if (!cargando && usuario) return <Navigate to={ubicacion.state?.desde ?? '/admin'} replace />;

    const cambiarCampo = (evento) => {
        const { name, value } = evento.target;
        setCampos((actuales) => ({ ...actuales, [name]: value }));
        if (errores[name]) setErrores((actuales) => ({ ...actuales, [name]: undefined }));
    };

    const enviar = async (evento) => {
        evento.preventDefault();
        const formulario = evento.currentTarget;
        const nuevos = {};
        if (!MAIL_VALIDO.test(campos.mail.trim())) nuevos.mail = 'Escribí tu mail, por ejemplo nombre@pinpun.com.';
        if (campos.contrasena.length === 0) nuevos.contrasena = 'Escribí tu contraseña.';
        setErrores(nuevos);

        const primero = Object.keys(nuevos)[0];
        if (primero) {
            formulario.elements[primero]?.focus();
            return;
        }

        setEnviando(true);
        try {
            const sesion = await ingresar(campos.mail.trim(), campos.contrasena);
            notificar.exito(`Hola, ${sesion.nombre}.`);
            navegar(ubicacion.state?.desde ?? '/admin', { replace: true });
        } catch (falla) {
            notificar.error(falla.message);
            setEnviando(false);
            formulario.elements.contrasena?.focus();
        }
    };

    return (
        <div className="ingreso">
            {foto && <img className="ingreso__foto" src={foto} alt="La fachada roja de Pin Pun sobre la avenida Corrientes." decoding="async" />}

            <main className="ingreso__panel">
                <div className="ingreso__interior">
                    <Link to="/" className="ingreso__marca" aria-label="Pin Pun, ir al sitio">
                        <Logo />
                    </Link>

                    <h1 className="ingreso__titulo">Panel de administración</h1>
                    <p className="ingreso__bajada">Entrá con la cuenta de tu sucursal para ver los pedidos y las reservas.</p>

                    <form className="ingreso__formulario" onSubmit={enviar} noValidate aria-label="Iniciar sesión">
                        <Campo nombre="mail" etiqueta="Mail" error={errores.mail}>
                            {(props) => (
                                <input {...props} type="text" inputMode="email" autoComplete="username" value={campos.mail} onChange={cambiarCampo} />
                            )}
                        </Campo>
                        <Campo nombre="contrasena" etiqueta="Contraseña" error={errores.contrasena}>
                            {(props) => (
                                <input
                                    {...props}
                                    type="password"
                                    autoComplete="current-password"
                                    value={campos.contrasena}
                                    onChange={cambiarCampo}
                                />
                            )}
                        </Campo>

                        <Boton type="submit" variante="rojo" cargando={enviando} disabled={enviando}>
                            {enviando ? 'Entrando…' : 'Entrar'}
                        </Boton>
                    </form>

                    {import.meta.env.DEV && (
                        <details className="ingreso__pruebas">
                            <summary>Cuentas de prueba (solo en desarrollo)</summary>
                            <ul>
                                {CUENTAS_DE_PRUEBA.map(({ rol, mail, contrasena }) => (
                                    <li key={mail}>
                                        <button
                                            type="button"
                                            className="admin__texto-boton"
                                            onClick={() => {
                                                setCampos({ mail, contrasena });
                                                setErrores({});
                                            }}
                                        >
                                            {rol}
                                        </button>
                                        <span>
                                            {mail} · {contrasena}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminIngreso;
