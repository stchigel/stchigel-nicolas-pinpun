import Local from '../models/Local.js';

/*
 * Coordenadas tomadas de OpenStreetMap a partir de cada dirección.
 * Los horarios en null son los que todavía no están confirmados.
 */
const locales = [
    new Local(1, 'Almagro', 'Av. Corrientes 3954, Almagro', '011 4862-3260', 'pinpuncorrientes', -34.60335, -58.42042, '07:00', '01:00'),
    new Local(2, 'Angelina', 'Av. Corrientes 5600, Villa Crespo', null, 'pinpunangelina', -34.59650, -58.44261, null, null),
    new Local(3, 'Villa Urquiza', 'La Pampa 5201, Villa Urquiza', '011 4521-2181', 'pinpunurquiza', -34.58037, -58.48132, '07:00', '01:00'),
    new Local(4, 'Monte Castro', 'Av. Lope de Vega 1650, Monte Castro', '011 4567-3115', 'pinpunmontecastro', -34.62480, -58.51130, null, null),
    new Local(5, 'Lanús', 'Av. Hipólito Yrigoyen 4485, Lanús Oeste', null, 'pinpunlanus', -34.70649, -58.39192, '10:00', '23:00'),
    new Local(6, 'Lomas de Zamora', 'Colombres 606, Lomas de Zamora', null, 'pinpunlomas', -34.76367, -58.40633, null, null)
];

const findAll = () => [...locales];

const findById = (id) => locales.find((local) => local.id === id) ?? null;

export default { findAll, findById };
