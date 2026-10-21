import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';

/* Lo que rodea a las páginas del sitio: el salto al contenido, la barra, el contenido de la ruta y el pie */
function LayoutPublico() {
    return (
        <>
            <a href="#contenido" className="saltar-al-contenido">
                Saltar al contenido
            </a>
            <Navbar />
            <main id="contenido">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default LayoutPublico;
