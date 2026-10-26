/*
 * Carta del salón de Pin Pun Angelina (Av. Corrientes y Serrano, Villa Crespo), transcripta del menú impreso del local.
 * Mismo formato que la carta de Corrientes (ver carta.js). Las pizzas vienen en Grande y Mediana y, algunas, también
 * por porción; las porciones al corte que repiten una pizza son esa misma porción, así que solo se suma la fainá.
 * Las tres hojas de comida están transcriptas del salón. Las bebidas, postres, tortas y cafetería no estaban en las fotos:
 * por ahora se copian de la carta de delivery (los precios de las dos son parecidos) hasta tener la hoja del salón.
 */

import cartaAngelina from './cartaAngelina.js';

const pizza = (subcategoria, nombre, descripcion, grande, mediana, porcion = null, extra = {}) => ({
    categoria: 'Pizzas',
    subcategoria,
    nombre,
    descripcion,
    variantes: [
        { nombre: 'Grande', precio: grande },
        { nombre: 'Mediana', precio: mediana },
        porcion && { nombre: 'Porción', precio: porcion }
    ].filter(Boolean),
    ...extra
});

const plato = (categoria, nombre, precio, descripcion = '', subcategoria = '', extra = {}) => ({
    categoria,
    subcategoria,
    nombre,
    precio,
    descripcion,
    ...extra
});

/* Cada sabor de empanada se vende al horno de leña o frita, al mismo precio */
const empanadas = (nombre, descripcion = '') =>
    ['Al horno de leña', 'Fritas'].map((subcategoria) => ({
        categoria: 'Empanadas',
        subcategoria,
        nombre,
        descripcion,
        precio: 3200,
        ...(subcategoria === 'Fritas' && nombre === 'Carne' ? { imagen: 'empanada-carne.jpg', destacado: true } : {})
    }));

const HORNO = 'Al horno de leña';
const EXITOS = 'Los éxitos de siempre';
const CEBOLLA = 'Los clásicos de cebolla';
const ESPECIALES = 'Especiales de la casa';
const CORTE = 'Porciones al corte';
const GUARNICION = 'Incluyen guarnición';
const SUPER_MILANGA = 'Súper milanga, con papas fritas españolas';
const PROVENZAL = 'A la provenzal';

const cartaAngelinaSalon = [
    pizza(HORNO, 'Muzzarella clásica', 'Salsa de tomate, muzzarella, aceitunas y orégano.', 25000, 19000, 3200, { destacado: true }),
    pizza(HORNO, 'Muzzarella y jamón', 'Salsa de tomate, muzzarella, jamón, aceitunas y orégano.', 31500, 24000, 4000),
    pizza(HORNO, 'Muzzarella y morrones', 'Salsa de tomate, muzzarella, morrones, aceitunas y orégano.', 31500, 24000, 4000),
    pizza(HORNO, 'Muzzarella, jamón y morrones', 'Salsa de tomate, muzzarella, jamón, morrones, aceitunas y orégano.', 35000, 27500),
    pizza(HORNO, 'Ajo al óleo', 'Salsa de tomate, ajo, provolone, aceite de oliva, aceitunas y orégano.', 34000, 26500),
    pizza(HORNO, 'Calabresa', 'Salsa de tomate, buena capa de muzzarella, longaniza, morrones rojos y aceitunas.', 36500, 29000, null, { destacado: true }),
    pizza(HORNO, 'Napolitana', 'Salsa de tomate, muzzarella, rodajas de tomate al natural, ajo, parmesano y aceitunas.', 33000, 25000, 4200, { imagen: 'napolitana.jpg', destacado: true }),
    pizza(HORNO, 'Napolitana con jamón', 'Salsa de tomate, muzzarella, rodajas de tomate natural, jamón, ajo, parmesano y aceitunas.', 38500, 31000),
    pizza(HORNO, 'De cancha', 'Salsa de tomate y perejil.', 22500, 17000, 2900),

    pizza(EXITOS, 'Anchoas', 'Salsa de tomate y anchoas.', 31500, 24000, 4000),
    pizza(EXITOS, 'Cuatro quesos', '', 38000, 30500),
    pizza(EXITOS, 'Palmitos Gentleman', 'Salsa de tomate, muzzarella, jamón, palmitos, huevo duro, morrón, salsa golf, aceitunas y orégano.', 43000, 35500),
    pizza(EXITOS, 'Caribeña, jamón y ananá', 'Salsa de tomate, muzzarella, jamón, ananá, morrones, aceitunas y orégano.', 41000, 33500),

    pizza(CEBOLLA, 'Fugazza', 'Cebolla, pimienta blanca y orégano.', 24000, 18000, 3000),
    pizza(CEBOLLA, 'Fugazza con queso', 'Muzzarella y cebolla.', 34000, 26500),
    pizza(CEBOLLA, 'Fugazza con jamón y queso', 'Muzzarella, jamón y cebolla.', 38500, 31000),
    pizza(CEBOLLA, 'Fugazzeta rellena', 'Cebolla rellena con queso fresco.', 44000, 33500, 5500, { imagen: 'fugazza-rellena.jpg', destacado: true }),
    pizza(CEBOLLA, 'Fugazzeta rellena con jamón', 'Cebolla rellena con queso fresco y jamón.', 47000, 35500, 6000),

    pizza(ESPECIALES, 'Roquefort', 'Salsa de tomate, muzzarella, roquefort, jamón, aceitunas y orégano.', 42500, 35000),
    pizza(ESPECIALES, 'Pizza verde', 'Espinaca, salsa blanca y provolone.', 33000, 25000, 4200),
    pizza(ESPECIALES, 'Provolone', 'Muzzarella y provolone rallado.', 39500, 32000),
    pizza(ESPECIALES, 'Jamón crudo y champiñones', 'Muzzarella, jamón crudo y champiñones.', 45000, 34500),
    pizza(ESPECIALES, 'Pin Pun', 'Muzzarella, cebolla, jamón, longaniza, tomate en rodajas, palmitos, morrones y rociado de anchoas.', 46000, 35500),
    pizza(ESPECIALES, 'Jamón crudo y rúcula', 'Muzzarella, jamón crudo y rúcula.', 46000, 35500),
    pizza(ESPECIALES, 'Angelina', 'Muzzarella, jamón cocido, morrones, anchoas y aceitunas.', 46000, 35500),

    { categoria: 'Pizzas', subcategoria: CORTE, nombre: 'Fainá', descripcion: '', variantes: [{ nombre: 'Porción', precio: 1700 }], imagen: 'faina.jpg', destacado: true },

    ...empanadas('Carne'),
    ...empanadas('Jamón y queso'),
    ...empanadas('Pollo'),
    ...empanadas('Humita'),
    ...empanadas('Verdura'),
    ...empanadas('Cebolla y queso', 'Muzzarella y cebolla.'),
    ...empanadas('Pin Pun', 'Carne cortada a cuchillo, picante.'),
    ...empanadas('Longaniza y muzzarella'),
    ...empanadas('Caprese', 'Muzzarella, tomate y albahaca.'),
    ...empanadas('Roquefort', 'Muzzarella y roquefort.'),

    plato('Minutas', 'Milanesa de ternera', 18800, '', GUARNICION),
    plato('Minutas', 'Milanesa de ternera a la napolitana', 31000, '', GUARNICION),
    plato('Minutas', 'Milanesa de ternera completa', 32000, 'Con papas fritas y dos huevos fritos.', GUARNICION),
    plato('Minutas', 'Milanesa de ternera a la riojana', 38500, '', GUARNICION),
    plato('Minutas', 'Milanesa de ternera a la suiza', 31000, '', GUARNICION),
    plato('Minutas', 'Milanesa de ternera a la fugazzeta', 34000, '', GUARNICION),
    plato('Minutas', 'Suprema de pollo', 20500, '', GUARNICION),
    plato('Minutas', 'Milanesa de pollo del muslo', 16500, '', GUARNICION),
    plato('Minutas', 'Suprema con crema de espinaca', 37500, '', GUARNICION),
    plato('Minutas', 'Suprema con crema de verdeo', 37500, '', GUARNICION),
    plato('Minutas', 'Suprema a la napolitana', 37500, '', GUARNICION),
    plato('Minutas', 'Suprema a la suiza', 37500, '', GUARNICION),
    plato('Minutas', 'Suprema Maryland', 44000, 'Para compartir.', GUARNICION),
    plato('Minutas', 'Suprema Angelina', 45000, 'Para compartir. Rellena de espinaca, morrón, muzzarella, verdeo, arvejas, choclo, champiñones, salsa mixta y papas españolas.', GUARNICION),

    plato('Minutas', 'Sencilla', 62000, 'Milanesa de ternera, muzzarella y salsa de tomate.', SUPER_MILANGA),
    plato('Minutas', 'Fugazzeta', 62000, 'Muzzarella, cebolla, parmesano, orégano y aceite de oliva.', SUPER_MILANGA),
    plato('Minutas', 'Napolitana', 68000, 'Muzzarella, rodajas de tomate, ajo y albahaca.', SUPER_MILANGA),
    plato('Minutas', 'A la suiza', 68000, 'Muzzarella, salsa blanca, huevo, morrón y aceitunas negras.', SUPER_MILANGA),
    plato('Minutas', 'A caballo', 74000, 'Con 4 huevos fritos.', SUPER_MILANGA),
    plato('Minutas', 'Roquefort', 74000, 'Muzzarella, roquefort y orégano.', SUPER_MILANGA),
    plato('Minutas', 'Provolone', 74000, 'Muzzarella, jamón, provolone y orégano.', SUPER_MILANGA),
    plato('Minutas', 'De la huerta', 74000, 'Muzzarella, rúcula, panceta crocante y parmesano.', SUPER_MILANGA),
    plato('Minutas', 'Especial', 74000, 'Jamón, muzzarella, salsa de tomate, orégano y rodajas de tomate.', SUPER_MILANGA),
    plato('Minutas', 'Popeye', 74000, 'Muzzarella y espinaca a la crema gratinada.', SUPER_MILANGA),
    plato('Minutas', 'Agregado de cheddar', 15000, '', SUPER_MILANGA),

    plato('Carnes rojas', 'Matambre tiernizado a la pizza', 31000, 'Incluye guarnición.'),
    plato('Carnes rojas', 'Matambre tiernizado a la suiza', 31000, 'Incluye guarnición.'),
    plato('Carnes rojas', 'Matambre al verdeo con gran sabor', 31000, 'Incluye guarnición.'),
    plato('Carnes rojas', 'Matambre de ternera', 25000, 'Incluye guarnición.'),

    plato('Aves', '1/4 pollo al ajillo o a la provenzal', 24000, 'Con papas españolas. Incluye guarnición.'),
    plato('Aves', '1/4 pollo a la calabresa', 24000, 'Con papas españolas. Incluye guarnición.'),
    plato('Aves', '1/4 pollo', 17000, 'Muslo o pechuga. Incluye guarnición.'),

    plato('Pescados', 'Filet de merluza', 18800, 'Incluye guarnición.'),
    plato('Pescados', 'Filet de merluza al roquefort', 31500, 'Con papas noisette. Incluye guarnición.'),
    plato('Pescados', 'Rabas a la romana, sin guarnición', 30000),

    plato('Tortillas', 'Tortilla de papa', 17000),
    plato('Tortillas', 'Tortilla de papa y cebolla', 18500),
    plato('Tortillas', 'Tortilla española', 19500, 'Genial combinación de longaniza, papa, cebolla y huevo.'),
    plato('Tortillas', 'Revuelto gramajo', 18500, 'Bastones de papas fritas, jamón cocido, huevo, cebolla y arvejas.'),

    plato('Omelette', 'Omelette de jamón', 17000),
    plato('Omelette', 'Omelette de queso suizo', 18000),
    plato('Omelette', 'Omelette mixto', 19500),
    plato('Omelette', 'Omelette especial', 21500, 'Jamón, queso y tomate.'),

    plato('Sandwichería', 'Jamón o queso', 10000),
    plato('Sandwichería', 'Jamón y queso', 11500),
    plato('Sandwichería', 'Jamón crudo', 16500),
    plato('Sandwichería', 'Crudo y queso', 18000),
    plato('Sandwichería', 'Tostado mixto', 12500, 'Jamón y queso.'),
    plato('Sandwichería', 'Recargo de tomate, queso o jamón', 1800),
    plato('Sandwichería', 'Recargo por tostar', 1000),

    plato('Ensaladas', 'Mixta', 13000, 'Lechuga, tomate y cebolla.'),
    plato('Ensaladas', 'Mixta, porción', 9000),
    plato('Ensaladas', 'Salpicón de ave', 16000),
    plato('Ensaladas', 'Completa', 16000, 'Lechuga, tomate, zanahoria, remolacha, cebolla, papa, chaucha y huevo duro.'),
    plato('Ensaladas', 'Combinación a piacere', 16800, 'Combiná hasta 6 ingredientes: lechuga, tomate, zanahoria, remolacha, papa, huevo duro, radicheta, rúcula y cebolla.'),

    plato('Pastas frescas', 'Ñoquis caseros', 10000),
    plato('Pastas frescas', 'Ravioles de verdura o ricota', 11000),
    plato('Pastas frescas', 'Canelones de verdura', 11000),
    plato('Pastas frescas', 'Sorrentinos de jamón y muzzarella', 11800),
    plato('Pastas frescas', 'Tallarines al huevo', 10000),
    plato('Pastas frescas', 'Agnolottis de ricota con nuez', 11800),
    plato('Pastas frescas', 'Lasagna de carne, ricota, jamón, muzzarella y verdura', 13000),

    plato('Salsas', 'Manteca', 8000),
    plato('Salsas', 'Fileto', 8000),
    plato('Salsas', 'Crema', 8000),
    plato('Salsas', 'Mixta', 8000),
    plato('Salsas', 'Scarparo', 9000),
    plato('Salsas', 'Bolognesa', 9000),
    plato('Salsas', 'Picante', 11000, 'Fileto, ajo, anchoas, pimentón, cebolla y ají molido.'),
    plato('Salsas', 'Rossini', 9000, 'Salsa blanca y fileto.'),
    plato('Salsas', 'Al funghi', 11500, 'Con hongos frescos, prosciutto, crema y verdeo.'),
    plato('Salsas', 'Cuatro quesos', 11500, 'Muzzarella, roquefort, por salut y parmesano.'),
    plato('Salsas', 'Estofado de carne o pollo', 13000),
    plato('Salsas', 'Gran Caruso', 13000, 'Salsa mixta, ave, jamón y hongos frescos.'),

    plato('Acompañamientos', 'Papas fritas', 5500),
    plato('Acompañamientos', 'Puré de calabaza o papa', 5500),
    plato('Acompañamientos', 'Papas pay', 5500),
    plato('Acompañamientos', 'Papas españolas', 5500),
    plato('Acompañamientos', 'Papas norteñas', 17000, 'Papas fritas gratinadas con queso y 2 huevos fritos, para compartir.'),
    plato('Acompañamientos', 'Espinaca a la crema', 13500),
    plato('Acompañamientos', 'Rúcula y parmesano', 11800),
    plato('Acompañamientos', 'Huevos fritos (2)', 8400),
    plato('Acompañamientos', 'Papas con cheddar', 15500, '', PROVENZAL),
    plato('Acompañamientos', 'Papas con cheddar y panceta', 20000, '', PROVENZAL),
    plato('Acompañamientos', 'Daditos de muzzarella a la milanesa', 18800, '', PROVENZAL)
];

/* Lo que todavía no se transcribió del salón: se copia de la carta de delivery de Angelina */
const CATEGORIAS_COPIADAS = ['Postres', 'Tortas', 'Bebidas', 'Cervezas', 'Cafetería'];
cartaAngelinaSalon.push(...cartaAngelina.filter((plato) => CATEGORIAS_COPIADAS.includes(plato.categoria)));

export default cartaAngelinaSalon;
