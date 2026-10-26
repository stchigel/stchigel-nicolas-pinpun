/*
 * Locales con los que arranca una base nueva. Coordenadas tomadas de OpenStreetMap a partir de cada dirección.
 * Los horarios en null son los que todavía no están confirmados.
 * Las mesas son datos de ejemplo hasta que cada sucursal cargue las suyas desde el panel de administración.
 */
const mesas = (dosPersonas, cuatroPersonas, seisPersonas) =>
    [
        { capacidad: 2, cantidad: dosPersonas },
        { capacidad: 4, cantidad: cuatroPersonas },
        { capacidad: 6, cantidad: seisPersonas }
    ].filter((tipo) => tipo.cantidad > 0);

const locales = [
    { id: 1, nombre: 'Almagro', direccion: 'Av. Corrientes 3954, Almagro', numero: '011 4862-3260', instagram: 'pinpuncorrientes', latitud: -34.60335, longitud: -58.42042, horarioApertura: '07:00', horarioCierre: '01:00', mesas: mesas(8, 10, 2) },
    { id: 2, nombre: 'Angelina', direccion: 'Av. Corrientes 5600, Villa Crespo', numero: null, instagram: 'pinpunangelina', latitud: -34.5965, longitud: -58.44261, horarioApertura: null, horarioCierre: null, mesas: mesas(6, 8, 1) },
    { id: 3, nombre: 'Villa Urquiza', direccion: 'La Pampa 5201, Villa Urquiza', numero: '011 4521-2181', instagram: 'pinpunurquiza', latitud: -34.58037, longitud: -58.48132, horarioApertura: '07:00', horarioCierre: '01:00', mesas: mesas(6, 9, 2) },
    { id: 4, nombre: 'Monte Castro', direccion: 'Av. Lope de Vega 1650, Monte Castro', numero: '011 4567-3115', instagram: 'pinpunmontecastro', latitud: -34.6248, longitud: -58.5113, horarioApertura: null, horarioCierre: null, mesas: mesas(5, 7, 1) },
    { id: 5, nombre: 'Lanús', direccion: 'Av. Hipólito Yrigoyen 4485, Lanús Oeste', numero: null, instagram: 'pinpunlanus', latitud: -34.70649, longitud: -58.39192, horarioApertura: '10:00', horarioCierre: '23:00', mesas: mesas(6, 8, 2) },
    { id: 6, nombre: 'Lomas de Zamora', direccion: 'Colombres 606, Lomas de Zamora', numero: null, instagram: 'pinpunlomas', latitud: -34.76367, longitud: -58.40633, horarioApertura: null, horarioCierre: null, mesas: mesas(4, 6, 1) }
];

export default locales;
