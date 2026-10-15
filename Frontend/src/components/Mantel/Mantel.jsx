import './Mantel.css';

/* Franja de mantel a cuadros: la firma visual de la marca. Es puramente decorativa. */
function Mantel({ className = '' }) {
    return <div className={`mantel ${className}`} aria-hidden="true" />;
}

export default Mantel;
