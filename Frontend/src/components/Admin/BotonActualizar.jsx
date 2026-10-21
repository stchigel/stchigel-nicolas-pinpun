import { useState } from 'react';
import Icono from '../Icono/Icono.jsx';
import { useAdminDatos } from '../../hooks/useAdminDatos.js';
import { haceCuanto } from '../../utils/tiempo.js';

/* Vuelve a pedir los datos del panel y dice cuándo fue la última vez que se actualizaron */
function BotonActualizar() {
    const { recargar, actualizado, ahora } = useAdminDatos();
    const [actualizando, setActualizando] = useState(false);

    const actualizar = async () => {
        setActualizando(true);
        await recargar();
        setActualizando(false);
    };

    return (
        <div className="actualizar">
            <button type="button" className="admin__texto-boton" onClick={actualizar} aria-busy={actualizando || undefined} disabled={actualizando}>
                <Icono nombre="refrescar" tamano={18} className={actualizando ? 'actualizar__giro' : undefined} />
                Actualizar
            </button>
            {actualizado && (
                <p className="actualizar__hora">Se actualiza solo. Última vez: {haceCuanto(new Date(actualizado).toISOString(), ahora)}.</p>
            )}
        </div>
    );
}

export default BotonActualizar;
