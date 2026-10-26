/*
 * Carta de delivery de Pin Pun Angelina (Av. Corrientes y Serrano, Villa Crespo), transcripta del menú impreso
 * que reparten ("¡Te lo llevamos a tu casa!"). Mismo formato que la carta de Corrientes (ver carta.js).
 * Las pizzas vienen en Grande y Mediana (la de Corrientes, en Grande y Chica).
 */

const pizza = (subcategoria, nombre, descripcion, grande, mediana, extra = {}) => ({
    categoria: 'Pizzas',
    subcategoria,
    nombre,
    descripcion,
    variantes: [
        { nombre: 'Grande', precio: grande },
        { nombre: 'Mediana', precio: mediana }
    ],
    ...extra
});

const plato = (categoria, nombre, precio, descripcion = '', extra = {}) => ({ categoria, nombre, precio, descripcion, ...extra });

/* Cada sabor de empanada se vende al horno de leña o frita, al mismo precio */
const empanadas = (nombre, descripcion = '') =>
    ['Al horno de leña', 'Fritas'].map((subcategoria) => ({
        categoria: 'Empanadas',
        subcategoria,
        nombre,
        descripcion,
        precio: 3000,
        ...(subcategoria === 'Fritas' && nombre === 'Carne' ? { imagen: 'empanada-carne.jpg', destacado: true } : {})
    }));

const HORNO = 'Al horno de leña';
const EXITOS = 'Los éxitos de siempre';
const CEBOLLA = 'Los clásicos de cebolla';
const ESPECIALES = 'Especiales de la casa';
const GUARNICION = 'Incluyen guarnición';
const SUPER_MILANGA = 'Súper milanga para 4 personas, con papas fritas españolas';
const PROVENZAL = 'A la provenzal';

const cartaAngelina = [
    pizza(HORNO, 'Muzzarella clásica', 'Salsa de tomate, muzzarella, aceitunas y orégano.', 23800, 18000, { destacado: true }),
    pizza(HORNO, 'Muzzarella y jamón', 'Salsa de tomate, muzzarella, jamón, aceitunas y orégano.', 30000, 22500),
    pizza(HORNO, 'Muzzarella y morrones', 'Salsa de tomate, muzzarella, morrones, aceitunas y orégano.', 30000, 22500),
    pizza(HORNO, 'Muzzarella, jamón y morrones', 'Salsa de tomate, muzzarella, jamón, morrones, aceitunas y orégano.', 33000, 25000),
    pizza(HORNO, 'Ajo al óleo', 'Salsa de tomate, ajo, provolone, aceite de oliva, aceitunas y orégano.', 33000, 25000),
    pizza(HORNO, 'Calabresa', 'Salsa de tomate, buena capa de muzzarella, longaniza, morrones rojos y aceitunas.', 35000, 27000, { destacado: true }),
    pizza(HORNO, 'Napolitana', 'Salsa de tomate, muzzarella, rodajas de tomate al natural, ajo, parmesano y aceitunas.', 32000, 24000, { imagen: 'napolitana.jpg', destacado: true }),
    pizza(HORNO, 'Napolitana con jamón', 'Salsa de tomate, muzzarella, rodajas de tomate natural, jamón, ajo, parmesano y aceitunas.', 37000, 29000),
    pizza(HORNO, 'De cancha', 'Salsa de tomate y perejil.', 22000, 16500),

    pizza(EXITOS, 'Anchoas', 'Salsa de tomate y anchoas.', 30500, 23000),
    pizza(EXITOS, 'Cuatro quesos', '', 37000, 29000),
    pizza(EXITOS, 'Palmitos Gentleman', 'Salsa de tomate, muzzarella, jamón, palmitos, huevo duro, morrón, salsa golf, aceitunas y orégano.', 41000, 33000),
    pizza(EXITOS, 'Caribeña, jamón y ananá', 'Salsa de tomate, muzzarella, jamón, ananá, morrones, aceitunas y orégano.', 39000, 31000),

    pizza(CEBOLLA, 'Fugazza', 'Cebolla, pimienta blanca y orégano.', 22000, 16500),
    pizza(CEBOLLA, 'Fugazza con queso', 'Muzzarella y cebolla.', 32000, 24000),
    pizza(CEBOLLA, 'Fugazza con jamón y queso', 'Muzzarella, jamón y cebolla.', 37000, 29000),
    pizza(CEBOLLA, 'Fugazzeta rellena', 'Cebolla rellena con queso fresco.', 40000, 30000, { imagen: 'fugazza-rellena.jpg', destacado: true }),
    pizza(CEBOLLA, 'Fugazzeta rellena con jamón', 'Cebolla rellena con queso fresco y jamón.', 44000, 33500),

    pizza(ESPECIALES, 'Roquefort', 'Salsa de tomate, muzzarella, roquefort, jamón, aceitunas negras y orégano.', 40500, 32500),
    pizza(ESPECIALES, 'Pizza verde', 'Espinaca, salsa blanca y provolone.', 32000, 24000),
    pizza(ESPECIALES, 'Provolone', 'Muzzarella y provolone rallado.', 38000, 30000),
    pizza(ESPECIALES, 'Jamón crudo y champiñones', 'Muzzarella, jamón crudo y champiñones.', 43000, 33000),
    pizza(ESPECIALES, 'Pin Pun', 'Muzzarella, cebolla, jamón, longaniza, tomate en rodajas, palmitos, morrones y rociado de anchoas.', 44800, 33800),
    pizza(ESPECIALES, 'Jamón crudo y rúcula', 'Muzzarella, jamón crudo y rúcula.', 44800, 33800),
    pizza(ESPECIALES, 'Angelina', 'Muzzarella, jamón cocido, morrones, anchoas y aceitunas.', 45000, 34000),

    ...empanadas('Carne'),
    ...empanadas('Jamón y queso'),
    ...empanadas('Pollo'),
    ...empanadas('Humita'),
    ...empanadas('Verdura'),
    ...empanadas('Cebolla y queso'),
    ...empanadas('Pin Pun', 'Carne cortada a cuchillo, picante.'),
    ...empanadas('Muzzarella y cebolla'),
    ...empanadas('Longaniza y muzzarella'),
    ...empanadas('Roquefort', 'Muzzarella y roquefort.'),
    ...empanadas('Caprese', 'Muzzarella, tomate y albahaca.'),

    { ...plato('Minutas', 'Milanesa de ternera', 18000), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Milanesa de ternera a la napolitana', 30000), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Milanesa de ternera completa', 31000, 'Con papas fritas y 2 huevos fritos.'), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Milanesa de ternera a la riojana', 37000), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Milanesa de ternera a la suiza', 30000), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Milanesa de ternera a la fugazzeta', 33000), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Suprema de pollo', 19500), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Milanesa de pollo del muslo', 15500), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Suprema con crema de verdeo', 35000), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Suprema a la napolitana', 35000), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Suprema a la suiza', 35000), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Suprema Maryland', 42000, 'Para compartir.'), subcategoria: GUARNICION },
    { ...plato('Minutas', 'Suprema Angelina', 43000, 'Para compartir. Rellena de espinaca, morrón, muzzarella, verdeo, arvejas, choclo, champiñones, salsa mixta y papas españolas.'), subcategoria: GUARNICION },

    { ...plato('Minutas', 'Sencilla', 60000, 'Milanesa de ternera, muzzarella y salsa de tomate.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'Fugazzeta', 60000, 'Muzzarella, cebolla, parmesano, orégano y aceite de oliva.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'Napolitana', 65000, 'Muzzarella, rodajas de tomate, ajo y albahaca.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'A la suiza', 65000, 'Muzzarella, salsa blanca, huevo, morrón y aceitunas negras.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'A caballo', 70000, 'Con 4 huevos fritos.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'Roquefort', 70000, 'Muzzarella, roquefort y orégano.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'Provolone', 70000, 'Muzzarella, jamón, provolone y orégano.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'De la huerta', 70000, 'Muzzarella, rúcula, panceta crocante y parmesano.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'Especial', 70000, 'Jamón, muzzarella, salsa de tomate, orégano y rodajas de tomate.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'Popeye', 70000, 'Muzzarella y espinaca a la crema gratinada.'), subcategoria: SUPER_MILANGA },
    { ...plato('Minutas', 'Agregado de cheddar', 14000), subcategoria: SUPER_MILANGA },

    plato('Carnes rojas', 'Matambre tiernizado a la pizza', 29500),
    plato('Carnes rojas', 'Matambre tiernizado a la suiza', 29500),
    plato('Carnes rojas', 'Matambre al verdeo con gran sabor', 29500),
    plato('Carnes rojas', 'Matambre de ternera', 23000),

    plato('Aves', '1/4 pollo al ajillo a la provenzal', 23000, 'Con papas españolas.'),
    plato('Aves', '1/4 pollo a la calabresa', 23000, 'Con papas españolas.'),
    plato('Aves', '1/4 pollo', 16500, 'Muslo o pechuga.'),

    plato('Pescados', 'Filet de merluza', 18000),
    plato('Pescados', 'Filet de merluza al roquefort', 30000, 'Con papas noisette.'),
    plato('Pescados', 'Rabas a la romana, sin guarnición', 28000),

    plato('Tortillas', 'Tortilla de papa', 16000),
    plato('Tortillas', 'Tortilla española', 17500, 'Genial combinación de longaniza, papa, cebolla y huevo.'),
    plato('Tortillas', 'Revuelto gramajo', 17500, 'Bastones de papas fritas, jamón cocido, huevo, cebolla y arvejas.'),
    plato('Tortillas', 'Tortilla de papa y cebolla', 17500),

    plato('Omelette', 'Omelette de jamón', 16000),
    plato('Omelette', 'Omelette de queso suizo', 17000),
    plato('Omelette', 'Omelette mixto', 18500),
    plato('Omelette', 'Omelette especial', 20000, 'Jamón, queso y tomate.'),

    plato('Sandwichería', 'Jamón o queso', 9500),
    plato('Sandwichería', 'Jamón y queso', 11000),
    plato('Sandwichería', 'Jamón crudo', 14500),
    plato('Sandwichería', 'Crudo y queso', 16000),
    plato('Sandwichería', 'Tostado mixto', 12000, 'Jamón y queso.'),
    plato('Sandwichería', 'Recargo de tomate, queso o jamón', 1800),
    plato('Sandwichería', 'Recargo por tostar', 1000),

    plato('Ensaladas', 'Mixta', 12500, 'Lechuga, tomate y cebolla.'),
    plato('Ensaladas', 'Mixta, porción', 8500),
    plato('Ensaladas', 'Salpicón de ave', 15000),
    plato('Ensaladas', 'Completa', 15000, 'Lechuga, tomate, zanahoria, remolacha, cebolla, papa, chaucha y huevo duro.'),
    plato('Ensaladas', 'Combinación a piacere', 15500, 'Combiná hasta 6 ingredientes: lechuga, tomate, zanahoria, remolacha, papa, huevo duro, radicheta, rúcula y cebolla.'),

    plato('Pastas frescas', 'Ñoquis caseros', 9500),
    plato('Pastas frescas', 'Ravioles de verdura o ricota', 10500),
    plato('Pastas frescas', 'Canelones de verdura', 10500),
    plato('Pastas frescas', 'Sorrentinos de jamón y muzzarella', 10800),
    plato('Pastas frescas', 'Tallarines al huevo', 9500),
    plato('Pastas frescas', 'Agnolottis de ricota con nuez', 10800),
    plato('Pastas frescas', 'Lasagna de carne, ricota, jamón, muzzarella y verdura', 12000),

    plato('Salsas', 'Manteca, fileto, crema o mixta', 8000),
    plato('Salsas', 'Scarparo', 9000),
    plato('Salsas', 'Bolognesa', 9000),
    plato('Salsas', 'Picante', 10000, 'Fileto, ajo, anchoas, pimentón, cebolla y ají molido.'),
    plato('Salsas', 'Rossini', 9000, 'Salsa blanca y fileto.'),
    plato('Salsas', 'Al funghi', 11000, 'Con hongos frescos.'),
    plato('Salsas', 'Cuatro quesos', 11000, 'Muzzarella, roquefort, por salut y parmesano.'),
    plato('Salsas', 'Estofado de carne o pollo', 12500),
    plato('Salsas', 'Gran Caruso', 12500, 'Salsa mixta, ave, jamón y hongos frescos.'),

    plato('Acompañamientos', 'Papas fritas', 5000),
    plato('Acompañamientos', 'Puré de calabaza o papa', 5000),
    plato('Acompañamientos', 'Papas pay', 5000),
    plato('Acompañamientos', 'Papas españolas', 5000),
    plato('Acompañamientos', 'Papas norteñas', 16000, 'Papas fritas gratinadas con queso y 2 huevos fritos, para compartir.'),
    plato('Acompañamientos', 'Espinaca a la crema', 13000),
    plato('Acompañamientos', 'Rúcula y parmesano', 11500),
    plato('Acompañamientos', 'Huevos fritos (2)', 8000),
    { ...plato('Acompañamientos', 'Papas con cheddar', 15000), subcategoria: PROVENZAL },
    { ...plato('Acompañamientos', 'Papas con cheddar y panceta', 19000), subcategoria: PROVENZAL },
    { ...plato('Acompañamientos', 'Daditos de muzzarella a la milanesa', 18000), subcategoria: PROVENZAL },

    plato('Postres', 'Vigilante clásico', 9500, 'Queso cremoso y dulce de membrillo o batata.'),
    plato('Postres', 'Flan casero', 4000),
    plato('Postres', 'Panqueque clásico con dulce de leche', 10500, 'Dos unidades.'),
    plato('Postres', 'Panqueque de manzana', 10500),
    plato('Postres', 'Acaramelado al ron', 16500),
    plato('Postres', 'Chocotorta casera', 10500),
    plato('Postres', 'Budín de pan casero', 4000),
    plato('Postres', 'Gran tiramisú caserito', 10500),
    plato('Postres', 'Sopa inglesa tradicional', 10500),
    plato('Postres', 'Ensalada de frutas', 10300),

    plato('Tortas', 'Mousse de chocolate o chajá', 10500),
    plato('Tortas', 'Black Mamba', 10500),
    plato('Tortas', 'Lemon pie', 10500),
    plato('Tortas', 'Cheesecake', 10500),
    plato('Tortas', 'Cheesecake Oreo', 10500),
    plato('Tortas', 'Brownie', 10500),
    plato('Tortas', 'Torta de ricota entera', 20500),
    plato('Tortas', 'Pasta frola entera', 18500),

    plato('Bebidas', 'Agua mineral con o sin gas', 3800),
    plato('Bebidas', 'Saborizadas 600 cc', 4000),
    plato('Bebidas', 'Saborizada de 1,5 L', 11500),
    plato('Bebidas', 'Gaseosa 600 cc', 4300),
    plato('Bebidas', 'Gaseosa 1,75 L', 11500),
    plato('Bebidas', 'Jugo exprimido de naranja', 9800),

    plato('Cervezas', 'Imperial lager, IPA o roja, 970 cm³', 9600),
    plato('Cervezas', 'Heineken 970 cm³', 10300),
    plato('Cervezas', 'Lata Heineken', 7800),
    plato('Cervezas', 'Lata Imperial', 7000),
    plato('Cervezas', 'Lata Amstel', 7000)
];

const CAFETERIA = 'Cafetería tradicional';
const cafe = (nombre, precio, descripcion = '') => ({ ...plato('Cafetería', nombre, precio, descripcion), subcategoria: CAFETERIA });

cartaAngelina.push(
    cafe('Café', 3500),
    cafe('Café descafeinado', 3700),
    cafe('Café con crema', 3800),
    cafe('Café doble', 5500),
    cafe('Café doble con crema', 5800),
    cafe('Café con leche', 5000),
    cafe('Café con leche con 3 medialunas', 8000),
    cafe('Café americano', 3600),
    cafe('Café americano con crema', 3900),
    cafe('Capuchino', 5000),
    cafe('Capuchino a la italiana', 6000),
    cafe('Té', 3700),
    cafe('Té con leche', 5000),
    cafe('Tés medicinales', 4000),
    cafe('Tés saborizados', 4000),
    cafe('Submarino', 6500),
    cafe('Submarino con 3 facturas', 8500),
    cafe('Leche fría o caliente', 5300),
    cafe('Leche cortada', 6000),
    cafe('Tostadas, pan a elección', 3800),
    cafe('Para untar', 1900, 'Manteca, mermelada, dulce de leche o queso light.'),
    cafe('Medialunas', 1400),
    cafe('Medialunas, docena', 14000),
    { ...plato('Cafetería', 'Desayuno', 9800, 'Café con leche, tostadas, queso light, mermelada o dulce de leche.'), subcategoria: 'Desayunos y meriendas' },
    { ...plato('Cafetería', 'Good Morning', 13000, 'Café americano, medialuna rellena con jamón cocido y queso, y vasito de jugo exprimido.'), subcategoria: 'Desayunos y meriendas' }
);

export default cartaAngelina;
