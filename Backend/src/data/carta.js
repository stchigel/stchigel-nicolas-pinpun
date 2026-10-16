/*
 * Carta de Pin Pun (Av. Corrientes 3954), transcripta de los menús impresos del local.
 * Cada plato pertenece a una categoría y, si la carta lo agrupa, a una subcategoría.
 * Los que se venden en más de un tamaño llevan `variantes`; su `precio` es el de la primera.
 * `destacado` marca los platos del carrusel "Nuestros más vendidos".
 */

const pizza = (nombre, descripcion, { grande, chica, porcion }, extra = {}) => ({
    categoria: 'Pizzas',
    nombre,
    descripcion,
    variantes: [
        grande && { nombre: 'Grande', precio: grande },
        chica && { nombre: 'Chica', precio: chica },
        porcion && { nombre: 'Porción', precio: porcion }
    ].filter(Boolean),
    ...extra
});

const empanada = (subcategoria, nombre, extra = {}) => ({
    categoria: 'Empanadas',
    subcategoria,
    nombre,
    precio: 2700,
    ...extra
});

const simple = (categoria, nombre, precio, extra = {}) => ({ categoria, nombre, precio, ...extra });

const carta = [
    pizza('Muzzarella', 'Salsa de tomate, 500 g de muzzarella, aceitunas y orégano.', { grande: 21000, chica: 16000, porcion: 2700 }, { imagen: 'muzzarella.jpg', destacado: true }),
    pizza('Especial "Pin Pun"', 'Salsa de tomate, muzzarella, jamón, morrones, tomate al natural, huevo duro, aceitunas y orégano.', { grande: 36000, chica: 29000 }),
    pizza('Muzzarella y morrón', 'Salsa de tomate, muzzarella, morrón, aceitunas y orégano.', { grande: 27000, chica: 21000 }),
    pizza('Muzzarella y jamón', '', { grande: 25000, chica: 19000, porcion: 3200 }),
    pizza('Jamón y morrones', 'Salsa de tomate, muzzarella, jamón cocido, morrones, aceitunas y orégano.', { grande: 28500, chica: 21500, porcion: 3600 }),
    pizza('De anchoas', 'Salsa de tomate, anchoas, aceitunas y orégano.', { grande: 28000, chica: 21000, porcion: 3500 }),
    pizza('Fugazza', 'Cebolla, pimienta blanca y orégano.', { grande: 20500 }),
    pizza('Fugazza rellena', 'Cebolla, rellena con queso fresco.', { grande: 34000, porcion: 4300 }, { imagen: 'fugazza-rellena.jpg', destacado: true }),
    pizza('Fugazza con jamón', 'Cebolla, rellena con queso fresco y jamón.', { grande: 36500, porcion: 4600 }),
    pizza('Napolitana', 'Salsa de tomate, muzzarella, rodajas de tomate al natural, ajo y aceitunas.', { grande: 28000, chica: 21000, porcion: 3600 }, { imagen: 'napolitana.jpg', destacado: true }),
    pizza('Napolitana especial', 'Salsa de tomate, muzzarella, rodajas de tomate, jamón, huevo duro, aceitunas y orégano.', { grande: 33000, chica: 26000 }),
    pizza('Calabresa', 'Salsa de tomate, muzzarella, longaniza, rodajas de tomate, aceitunas y orégano.', { grande: 34000, chica: 27000 }, { imagen: 'calabresa.jpg', destacado: true }),
    pizza('Provolone', 'Salsa de tomate, muzzarella, jamón, provolone, aceitunas y orégano.', { grande: 34000, chica: 27000 }),
    pizza('Palmitos', 'Salsa de tomate, muzzarella, jamón, palmitos, huevo duro, morrón, salsa golf, aceitunas y orégano.', { grande: 37000, chica: 30000 }),
    pizza('Al roquefort', 'Salsa de tomate, muzzarella, roquefort, jamón, aceitunas y orégano.', { grande: 33000, chica: 26500 }),
    pizza('Caribeña', 'Salsa de tomate, muzzarella, jamón, ananá, morrones, aceitunas y orégano.', { grande: 34000, chica: 27500 }),
    pizza('Romana', 'Salsa de tomate, muzzarella, anchoas, morrones, aceitunas y orégano.', { grande: 36000, chica: 29000 }),
    pizza('Pizza verde', 'Salsa de tomate, acelga, provolone y salsa blanca.', { grande: 29000, chica: 22000, porcion: 3700 }),
    pizza('Fainá', '', { porcion: 1300 }, { imagen: 'faina.jpg', destacado: true }),

    empanada('Al horno', 'Carne'),
    empanada('Al horno', 'Pollo'),
    empanada('Al horno', 'Jamón y queso'),
    empanada('Al horno', 'Verdura'),
    empanada('Al horno', 'Humita'),
    empanada('Al horno', 'Roquefort'),
    empanada('Fritas', 'Carne', { imagen: 'empanada-carne.jpg', destacado: true }),
    empanada('Fritas', 'Pollo'),
    empanada('Fritas', 'Jamón y queso'),
    empanada('Fritas', 'Pastelito de dulce de batata'),
    empanada('Fritas', 'Pastelito de dulce de membrillo'),

    simple('Postres', 'Flan casero', 3400),
    simple('Postres', 'Budín de pan casero', 3400),
    simple('Postres', 'Sopa inglesa', 8000),
    simple('Postres', 'Durazno o ananá en almíbar', 8000),
    simple('Postres', 'Vigilante', 8000, { descripcion: 'Queso y dulce de batata o membrillo.' }),
    simple('Postres', 'Tiramisú artesanal casero', 8500),
    simple('Postres', 'Chocotorta', 8500),
    simple('Postres', 'Recargo con crema o dulce de leche', 1300),
    simple('Postres', 'Recargo mixto', 2600),

    simple('Copas heladas', 'Copa Pin Pun', 33000, { descripcion: 'Helado, flan, obleas, cerezas, frutas, crema, charlotte y dulce de leche.' }),
    simple('Copas heladas', 'Banana split', 33000, { descripcion: 'Helado, banana, cerezas, obleas, crema, charlotte y dulce de leche.' }),
    simple('Copas heladas', 'Don Pedro', 14000, { descripcion: 'Helado de vainilla, whisky, crema, nuez y canela.' }),
    simple('Copas heladas', 'Helado de 2 bochas', 9800),
    simple('Copas heladas', 'Helado mixto de 3 bochas', 12000),

    simple('Cafetería', 'Café expreso "La Esmeralda"', 2700),
    simple('Cafetería', 'Café con crema', 2900),
    simple('Cafetería', 'Café con gotas de whisky y coñac', 6300),
    simple('Cafetería', 'Café americano', 2800),
    simple('Cafetería', 'Americano con crema', 3100),
    simple('Cafetería', 'Café doble', 4100),
    simple('Cafetería', 'Café doble con crema', 4400),
    simple('Cafetería', 'Café con leche', 3800),
    simple('Cafetería', 'Café con leche con 3 medialunas', 6000),
    simple('Cafetería', 'Café con leche con pan y manteca', 5300),
    simple('Cafetería', 'Café con leche con tostadas', 7000, { descripcion: 'Con queso crema o mermelada y dulce de leche.' }),
    simple('Cafetería', 'Capuccino', 3800),
    simple('Cafetería', 'Capuccino a la italiana', 4800),
    simple('Cafetería', 'Té o mate cocido', 2800),
    simple('Cafetería', 'Té con leche', 3800),
    simple('Cafetería', 'Té saborizado o digestivo', 3000),
    simple('Cafetería', 'Vaso de leche fría o caliente', 3900),
    simple('Cafetería', 'Leche chocolatada fría "Nesquik"', 4300),
    simple('Cafetería', 'Submarino con chocolate "Águila"', 4700),

    simple('Pastelería', 'Medialuna', 1000, { descripcion: 'Por unidad.' }),
    simple('Pastelería', 'Medialunas de jamón y queso', 8000, { descripcion: 'Dos unidades.' }),
    simple('Pastelería', 'Tarta de ricota', 5000, { descripcion: 'Porción.' }),

    {
        categoria: 'Bebidas',
        nombre: 'Gaseosa línea Coca-Cola',
        variantes: [
            { nombre: '1,5 litros', precio: 8500 },
            { nombre: '500 cm³', precio: 3600 },
            { nombre: '350 cm³', precio: 3100 }
        ]
    },
    simple('Bebidas', 'Agua Villavicencio', 3100, { descripcion: '500 cm³.' }),
    simple('Bebidas', 'Agua saborizada', 3300, { descripcion: 'Pomelo, naranja, manzana, pera o ananá.' }),
    simple('Bebidas', 'Soda sifón', 2900),

    simple('Licuados', 'Licuado de fruta', 7300, { descripcion: 'Banana, manzana, naranja, durazno o ananá.' }),
    simple('Licuados', 'Licuado tutti frutti', 7900),
    simple('Licuados', 'Recargo de leche', 1200),
    simple('Licuados', 'Milk shake', 8300, { descripcion: 'Helado a elección, leche y crema.' }),
    simple('Licuados', 'Jarra de limonada con menta', 8700, { descripcion: '1/2 litro.' }),

    simple('Cervezas', 'Jarra de litro', 8500),
    simple('Cervezas', 'Jarra de litro y medio', 9800),
    simple('Cervezas', 'Heineken 1 litro', 7900),
    simple('Cervezas', 'Imperial 1 litro', 7000, { descripcion: 'IPA, Stout, Golden o Lager.' }),
    simple('Cervezas', 'Lata Schneider', 3400),
    simple('Cervezas', 'Lata Imperial', 5000),
    simple('Cervezas', 'Lata Heineken', 5800),
    simple('Cervezas', 'Liso', 3400),
    simple('Cervezas', 'Chopp, balón o caña', 3700),
    simple('Cervezas', 'Medio tanque', 7300, { descripcion: '500 cm³.' }),

    simple('Aperitivos', 'Gancia', 4100),
    simple('Aperitivos', 'Cinzano Rosso o Bianco', 4200),
    simple('Aperitivos', 'Hesperidina', 4100),

    simple('Vinos', 'Blanco o tinto bodega Crotta', 3500, { subcategoria: 'Por copa' }),
    simple('Vinos', 'Blanco o tinto Vasco Viejo', 3500, { subcategoria: 'Por copa' }),
    simple('Vinos', 'Moscato Crotta', 3500, { subcategoria: 'Por copa' }),
    {
        categoria: 'Vinos',
        subcategoria: 'Bodega Crotta',
        nombre: 'Blanco o tinto',
        variantes: [
            { nombre: '1/2 litro', precio: 4600 },
            { nombre: '1 litro', precio: 6500 }
        ]
    },
    {
        categoria: 'Vinos',
        subcategoria: 'Bodega Crotta',
        nombre: 'Moscato',
        descripcion: 'El de la botella en cada mesa.',
        imagen: 'moscato.jpg',
        destacado: true,
        variantes: [
            { nombre: '1/2 litro', precio: 4600 },
            { nombre: '1 litro', precio: 6500 }
        ]
    },
    {
        categoria: 'Vinos',
        subcategoria: 'Vinos finos',
        nombre: 'López',
        variantes: [
            { nombre: '3/4 litro', precio: 9800 },
            { nombre: '1/2 litro', precio: 6300 }
        ]
    },
    {
        categoria: 'Vinos',
        subcategoria: 'Vinos finos',
        nombre: 'Vasco Viejo',
        variantes: [
            { nombre: '3/4 litro', precio: 6500 },
            { nombre: '1/2 litro', precio: 4600 }
        ]
    },
    {
        categoria: 'Vinos',
        subcategoria: 'Vinos finos',
        nombre: 'Rincón Famoso',
        variantes: [
            { nombre: '3/4 litro', precio: 11300 },
            { nombre: '1/2 litro', precio: 7300 }
        ]
    },
    {
        categoria: 'Vinos',
        subcategoria: 'Vinos finos',
        nombre: 'Château Vieux',
        variantes: [{ nombre: '3/4 litro', precio: 16500 }]
    },

    simple('Champagne y sidra', 'Champagne extra brut', 27000),
    simple('Champagne y sidra', 'Champagne nacional', 22000),
    simple('Champagne y sidra', 'Sidra', 13000),

    simple('Licores', 'Tía María', 4500),
    simple('Licores', "Bailey's", 8500),
    simple('Licores', 'Legui', 3900),
    simple('Licores', 'Mariposa', 3900),
    simple('Licores', 'Fernet Branca', 5200),
    simple('Licores', 'Gin', 5200),
    simple('Licores', 'Vodka', 6000),
    simple('Licores', 'Licor 8 Hermanos', 4200),
    simple('Licores', 'Ginebra Bols', 4000),
    simple('Licores', 'Boussac', 4200),

    simple('Whisky nacional', 'Blenders Pride', 4300),
    simple('Whisky nacional', 'Old Smuggler', 4300),
    simple('Whisky nacional', 'Criadores', 4300),

    simple('Coñac', 'Reserva San Juan', 4300),

    simple('Tragos', 'Trago largo combinado', 8000, { descripcion: 'Whiscola, Cuba libre, Negroni, Ferroviario o Brancatonic.' }),
    simple('Tragos', 'Fernet con cola', 8000),
    simple('Tragos', 'Gin tonic', 8000)
];

export default carta;
