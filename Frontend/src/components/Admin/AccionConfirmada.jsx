import { useState } from 'react';
import Boton from '../Boton/Boton.jsx';

/*
 * Una acción que no se puede deshacer pide confirmación en el mismo lugar, sin ventana que tape la pantalla:
 * el botón de texto se cambia por la pregunta y dos respuestas. El foco queda en "No" para que Enter no destruya nada.
 */
function AccionConfirmada({ etiqueta, pregunta, confirmar, rechazar = 'No', onConfirmar, deshabilitado = false }) {
    const [preguntando, setPreguntando] = useState(false);
    const [trabajando, setTrabajando] = useState(false);

    const confirmarAccion = async () => {
        setTrabajando(true);
        try {
            await onConfirmar();
        } finally {
            setTrabajando(false);
            setPreguntando(false);
        }
    };

    if (!preguntando) {
        return (
            <button type="button" className="admin__texto-boton admin__texto-boton--peligro" onClick={() => setPreguntando(true)} disabled={deshabilitado}>
                {etiqueta}
            </button>
        );
    }

    return (
        <div className="confirmar" role="group" aria-label={pregunta}>
            <p className="confirmar__pregunta">{pregunta}</p>
            <div className="confirmar__acciones">
                <Boton variante="rojo" onClick={confirmarAccion} cargando={trabajando} disabled={trabajando}>
                    {confirmar}
                </Boton>
                <Boton variante="hueso" onClick={() => setPreguntando(false)} disabled={trabajando} autoFocus>
                    {rechazar}
                </Boton>
            </div>
        </div>
    );
}

export default AccionConfirmada;
