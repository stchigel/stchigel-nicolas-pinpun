import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import ScrollAlHash from './components/ScrollAlHash/ScrollAlHash.jsx';
import ToastProvider from './components/Toast/ToastProvider.jsx';
import Home from './pages/Home/Home.jsx';
import Pendiente from './pages/Pendiente/Pendiente.jsx';

const EN_CONSTRUCCION = 'Estamos terminando esta parte del sitio. Mientras tanto, te esperamos en cualquiera de los locales.';

/* Estructura general: barra, contenido según la ruta, pie y notificaciones. */
function App() {
    const { pathname } = useLocation();

    return (
        <ToastProvider>
            <ScrollAlHash />
            <a href="#contenido" className="saltar-al-contenido">
                Saltar al contenido
            </a>
            <Navbar variante={pathname === '/' ? 'negro' : 'hueso'} />
            <main id="contenido">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Pendiente titulo="El menú está en el horno" descripcion={EN_CONSTRUCCION} />} />
                    <Route path="/reservas" element={<Pendiente titulo="Reservas, muy pronto" descripcion={EN_CONSTRUCCION} />} />
                    <Route path="/carrito" element={<Pendiente titulo="Tu carrito, muy pronto" descripcion={EN_CONSTRUCCION} />} />
                    <Route path="*" element={<Pendiente />} />
                </Routes>
            </main>
            <Footer />
        </ToastProvider>
    );
}

export default App;
