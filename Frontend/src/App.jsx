import { Navigate, Route, Routes } from 'react-router-dom';
import AuthProvider from './components/Auth/AuthProvider.jsx';
import RutaProtegida from './components/Auth/RutaProtegida.jsx';
import LayoutAdmin from './components/Admin/LayoutAdmin.jsx';
import LayoutPublico from './components/LayoutPublico/LayoutPublico.jsx';
import ScrollAlHash from './components/ScrollAlHash/ScrollAlHash.jsx';
import ToastProvider from './components/Toast/ToastProvider.jsx';
import PedidoProvider from './components/Pedido/PedidoProvider.jsx';
import Home from './pages/Home/Home.jsx';
import Menu from './pages/Menu/Menu.jsx';
import CartaEscenario from './pages/CartaEscenario/CartaEscenario.jsx';
import Carrito from './pages/Carrito/Carrito.jsx';
import Reservas from './pages/Reservas/Reservas.jsx';
import AdminIngreso from './pages/AdminIngreso/AdminIngreso.jsx';
import AdminPedidos from './pages/AdminPedidos/AdminPedidos.jsx';
import AdminReservas from './pages/AdminReservas/AdminReservas.jsx';
import AdminMenu from './pages/AdminMenu/AdminMenu.jsx';
import AdminLocales from './pages/AdminLocales/AdminLocales.jsx';
import Pendiente from './pages/Pendiente/Pendiente.jsx';

/*
 * Estructura general: notificaciones, sesión y pedido en curso envuelven dos mundos con su propio marco:
 * el sitio (barra, contenido y pie) y el panel de administración (barra lateral y contenido).
 * La carta del sitio es /carta; /menu quedó como alternativa.
 */
function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <PedidoProvider>
                    <ScrollAlHash />
                    <Routes>
                        <Route element={<LayoutPublico />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/menu" element={<Menu />} />
                            <Route path="/carta" element={<CartaEscenario />} />
                            <Route path="/reservas" element={<Reservas />} />
                            <Route path="/carrito" element={<Carrito />} />
                            <Route path="*" element={<Pendiente />} />
                        </Route>

                        <Route path="/admin/ingresar" element={<AdminIngreso />} />
                        <Route
                            path="/admin"
                            element={
                                <RutaProtegida>
                                    <LayoutAdmin />
                                </RutaProtegida>
                            }
                        >
                            <Route index element={<Navigate to="pedidos" replace />} />
                            <Route path="pedidos" element={<AdminPedidos />} />
                            <Route path="reservas" element={<AdminReservas />} />
                            <Route
                                path="menu"
                                element={
                                    <RutaProtegida roles={['general']}>
                                        <AdminMenu />
                                    </RutaProtegida>
                                }
                            />
                            <Route path="locales" element={<AdminLocales />} />
                        </Route>
                    </Routes>
                </PedidoProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
