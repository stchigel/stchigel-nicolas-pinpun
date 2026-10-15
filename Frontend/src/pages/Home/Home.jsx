import Hero from '../../components/home/Hero/Hero.jsx';
import Historia from '../../components/home/Historia/Historia.jsx';
import MasVendidos from '../../components/home/MasVendidos/MasVendidos.jsx';
import Locales from '../../components/home/Locales/Locales.jsx';
import Mantel from '../../components/Mantel/Mantel.jsx';

/* Página principal, en el orden del boceto: portada, historia, más vendidos y locales. */
function Home() {
    return (
        <>
            <Hero />
            <Mantel />
            <Historia />
            <MasVendidos />
            <Locales />
        </>
    );
}

export default Home;
