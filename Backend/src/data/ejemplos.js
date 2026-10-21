import pedidoRepository from '../repositories/pedidoRepository.js';
import reservaRepository from '../repositories/reservaRepository.js';
import productoRepository from '../repositories/productoRepository.js';
import ubicacionRepository from '../repositories/ubicacionRepository.js';
import { CANCELADO, EstadoReserva, ESTADOS_PEDIDO } from '../enums/Estados.js';

/*
 * Pedidos y reservas de ejemplo para que el panel de administración no arranque vacío.
 * Son ficticios; se omiten arrancando con SIN_DATOS_DE_EJEMPLO=1. Las fechas son relativas a "ahora".
 */
const MINUTO = 60 * 1000;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

const hace = (ms) => new Date(Date.now() - ms).toISOString();

/* Un día a una hora de salón, en hora de Buenos Aires: dias=1, hora='21:00' es mañana a las 21:00 */
const enElSalon = (dias, hora) => {
    const dia = new Date(Date.now() + dias * DIA - 3 * HORA).toISOString().slice(0, 10);
    return new Date(`${dia}T${hora}:00-03:00`).toISOString();
};

const item = (nombre, variante, cantidad) => {
    const producto = productoRepository.findAll().find((candidato) => candidato.nombre === nombre);
    const precio = producto.variantes.length > 0 ? producto.variantes.find((v) => v.nombre === variante).precio : producto.precio;

    return {
        productoId: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        subcategoria: producto.subcategoria,
        variante,
        precio,
        cantidad
    };
};

const pedido = ({ localId, tipo, estado, antes, cliente, direccion = '', items, repartidorId = null }) => {
    const circuito = ESTADOS_PEDIDO[tipo];
    const recorrido = estado === CANCELADO ? circuito.slice(0, 2) : circuito.slice(0, circuito.indexOf(estado) + 1);
    const historial = [...recorrido, ...(estado === CANCELADO ? [CANCELADO] : [])].map((paso, indice, lista) => ({
        estado: paso,
        fecha: hace(antes - ((antes - 2 * MINUTO) * indice) / Math.max(lista.length - 1, 1))
    }));

    pedidoRepository.create({
        fecha: hace(antes),
        total: items.reduce((suma, renglon) => suma + renglon.precio * renglon.cantidad, 0),
        tipo,
        estado,
        localId,
        cliente,
        direccion,
        items,
        historial,
        repartidorId,
        asignadoEn: repartidorId ? hace(Math.max(antes - 3 * MINUTO, 0)) : null
    });
};

const reserva = ({ localId, cantPersonas, estado, cuando, cliente, aclaraciones = '' }) =>
    reservaRepository.create({ localId, cantPersonas, estado, fechaHora: cuando, cliente, aclaraciones, creada: hace(3 * HORA) });

export const cargarEjemplos = () => {
    pedido({
        localId: 1,
        tipo: 'retiro',
        estado: 'Recibido',
        antes: 4 * MINUTO,
        cliente: { nombre: 'Julieta Ramos', telefono: '011 5523-9841' },
        items: [item('Muzzarella', 'Grande', 1), item('Fainá', 'Porción', 2)]
    });
    pedido({
        localId: 1,
        tipo: 'delivery',
        estado: 'En preparación',
        antes: 18 * MINUTO,
        cliente: { nombre: 'Martín Sosa', telefono: '011 4777-2210' },
        direccion: 'Medrano 850, 3° B, Almagro',
        repartidorId: 1,
        items: [item('Napolitana', 'Grande', 1), item('Muzzarella', 'Chica', 1)]
    });
    pedido({
        localId: 1,
        tipo: 'delivery',
        estado: 'En camino',
        antes: 42 * MINUTO,
        cliente: { nombre: 'Carolina Paz', telefono: '011 6012-4455' },
        direccion: 'Av. Corrientes 4120, Almagro',
        repartidorId: 1,
        items: [item('Fugazza rellena', 'Grande', 1)]
    });
    pedido({
        localId: 1,
        tipo: 'retiro',
        estado: 'Retirado',
        antes: 2 * HORA,
        cliente: { nombre: 'Diego Luna', telefono: '011 4861-0933' },
        items: [item('Muzzarella', 'Porción', 3)]
    });
    pedido({
        localId: 1,
        tipo: 'retiro',
        estado: CANCELADO,
        antes: 3 * HORA,
        cliente: { nombre: 'Sofía Ibarra', telefono: '011 5100-7788' },
        items: [item('Napolitana', 'Chica', 1)]
    });
    pedido({
        localId: 1,
        tipo: 'delivery',
        estado: 'Listo',
        antes: 12 * MINUTO,
        cliente: { nombre: 'Brenda Aguirre', telefono: '011 5430-1187' },
        direccion: 'Bulnes 1450, 2° A, Almagro',
        repartidorId: 2,
        items: [item('Muzzarella', 'Grande', 1), item('Fainá', 'Porción', 2)]
    });
    pedido({
        localId: 1,
        tipo: 'delivery',
        estado: 'Entregado',
        antes: 95 * MINUTO,
        cliente: { nombre: 'Esteban Roldán', telefono: '011 4963-8820' },
        direccion: 'Yatay 640, Almagro',
        repartidorId: 1,
        items: [item('Napolitana', 'Chica', 2)]
    });
    pedido({
        localId: 3,
        tipo: 'retiro',
        estado: 'Listo',
        antes: 25 * MINUTO,
        cliente: { nombre: 'Andrés Gómez', telefono: '011 4522-3190' },
        items: [item('Muzzarella', 'Grande', 2)]
    });
    pedido({
        localId: 3,
        tipo: 'delivery',
        estado: 'Recibido',
        antes: 6 * MINUTO,
        cliente: { nombre: 'Valeria Núñez', telefono: '011 5934-6671' },
        direccion: 'Triunvirato 4550, Villa Urquiza',
        items: [item('Fugazza rellena', 'Grande', 1), item('Muzzarella', 'Porción', 2)]
    });

    const enCamino = pedidoRepository.findAll({ estado: 'En camino' })[0];
    if (enCamino) {
        pedidoRepository.guardarDestino(enCamino.id, { latitud: -34.6031, longitud: -58.423 });
        ubicacionRepository.guardar(enCamino.id, { latitud: -34.6064, longitud: -58.4208, precision: 20 });
    }

    reserva({
        localId: 1,
        cantPersonas: 4,
        estado: EstadoReserva.ESPERANDO,
        cuando: enElSalon(1, '21:00'),
        cliente: { nombre: 'Familia Rossi', telefono: '011 4864-1020' },
        aclaraciones: 'Una silla alta, por favor.'
    });
    reserva({
        localId: 1,
        cantPersonas: 2,
        estado: EstadoReserva.ESPERANDO,
        cuando: enElSalon(1, '22:30'),
        cliente: { nombre: 'Lautaro Vega', telefono: '011 5510-3322' }
    });
    reserva({
        localId: 1,
        cantPersonas: 8,
        estado: EstadoReserva.ACEPTADA,
        cuando: enElSalon(2, '21:30'),
        cliente: { nombre: 'Cumple de Mica', telefono: '011 6123-8870' },
        aclaraciones: 'Es un cumpleaños: vamos a llevar una torta.'
    });
    reserva({
        localId: 1,
        cantPersonas: 3,
        estado: EstadoReserva.CONCLUIDA,
        cuando: enElSalon(-1, '21:00'),
        cliente: { nombre: 'Tomás Acuña', telefono: '011 4860-5544' }
    });
    reserva({
        localId: 3,
        cantPersonas: 5,
        estado: EstadoReserva.ESPERANDO,
        cuando: enElSalon(1, '20:30'),
        cliente: { nombre: 'Equipo de Fútbol 5', telefono: '011 5877-2001' }
    });
};
