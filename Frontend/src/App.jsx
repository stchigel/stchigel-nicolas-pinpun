import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import ScrollAlHash from './components/ScrollAlHash/ScrollAlHash.jsx';
import ToastProvider from './components/Toast/ToastProvider.jsx';
import PedidoProvider from './components/Pedido/PedidoProvider.jsx';
import Home from './pages/Home/Home.jsx';
import Menu from './pages/Menu/Menu.jsx';
import CartaEscenario from './pages/CartaEscenario/CartaEscenario.jsx';
import Carrito from './pages/Carrito/Carrito.jsx';
import Pendiente from './pages/Pendiente/Pendiente.jsx';

const EN_CONSTRUCCION = 'Estamos terminando esta parte del sitio. Mientras tanto, te esperamos en cualquiera de los locales.';

/* Estructura general: barra, contenido según la ruta, pie, notificaciones y el pedido en curso. */
function App() {
    return (
        <ToastProvider>
            <PedidoProvider>
                <ScrollAlHash />
                <a href="#contenido" className="saltar-al-contenido">
                    Saltar al contenido
                </a>
                <Navbar />
                <main id="contenido">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/carta" element={<CartaEscenario />} />
                        <Route path="/reservas" element={<Pendiente titulo="Reservas, muy pronto" descripcion={EN_CONSTRUCCION} />} />
                        <Route path="/carrito" element={<Carrito />} />
                        <Route path="*" element={<Pendiente />} />
                    </Routes>
                </main>
                <Footer />
            </PedidoProvider>
        </ToastProvider>
    );
}

export default App;
