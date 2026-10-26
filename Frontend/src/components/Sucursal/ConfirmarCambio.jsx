import { useEffect, useRef } from 'react';
import Boton from '../Boton/Boton.jsx';
import { usePedido } from '../../hooks/usePedido.js';
import { useSucursal } from '../../hooks/useSucursal.js';
import './ConfirmarCambio.css';

/*
 * Cambiar de sucursal (o pasar de mirar a pedir) con un pedido armado de otra carta: ahí esos platos no existen.
 * Se avisa antes de vaciar el pedido, en el mismo lugar donde se tocó, y sin vaciar nada si se cancela.
 */
function ConfirmarCambio() {
    const { pendiente, confirmarPendiente, cancelarPendiente } = useSucursal();
    const { cantidadTotal } = usePedido();
    const ref = useRef(null);

    useEffect(() => {
        const dialogo = ref.current;
        if (!dialogo) return;

        if (pendiente && !dialogo.open) {
            dialogo.showModal();
            /* El foco arranca en la opción que no borra nada */
            dialogo.querySelector('.confirmar__conservar')?.focus();
        }
        if (!pendiente && dialogo.open) dialogo.close();
    }, [pendiente]);

    const alCancelar = (evento) => {
        evento.preventDefault();
        cancelarPendiente();
    };

    return (
        <dialog ref={ref} className="confirmar" aria-labelledby="confirmar-titulo" onCancel={alCancelar}>
            {pendiente && (
                <div className="confirmar__interior">
                    <div className="confirmar__rayas" aria-hidden="true" />
                    <h2 id="confirmar-titulo" className="confirmar__titulo">
                        ¿Vaciamos tu pedido?
                    </h2>
                    <p className="confirmar__texto">
                        {cantidadTotal === 1 ? 'Tenés 1 producto sumado' : `Tenés ${cantidadTotal} productos sumados`} de otra carta. En la carta de{' '}
                        {pendiente.nombreLocal} no están, así que para cambiar hay que vaciar el pedido.
                    </p>
                    <div className="confirmar__acciones">
                        <Boton variante="rojo" onClick={confirmarPendiente}>
                            Sí, vaciar y cambiar
                        </Boton>
                        <Boton variante="hueso" className="confirmar__conservar" onClick={cancelarPendiente}>
                            No, dejarlo como estaba
                        </Boton>
                    </div>
                </div>
            )}
        </dialog>
    );
}

export default ConfirmarCambio;
