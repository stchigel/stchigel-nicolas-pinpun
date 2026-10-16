export const Messages = Object.freeze({
    PRODUCTO_NOT_FOUND: 'El producto no existe.',
    PRODUCTO_DUPLICATED: 'Ya existe un producto con ese nombre en la misma categoría.',
    LOCAL_NOT_FOUND: 'El local no existe.',
    INVALID_ID: 'El ID debe ser un número entero positivo.',
    INVALID_DATA: 'Los datos enviados son inválidos.',
    INVALID_JSON: 'El cuerpo de la petición no es un JSON válido.',
    INVALID_NOMBRE: 'El nombre es obligatorio y debe ser un texto.',
    INVALID_CATEGORIA: 'La categoría es obligatoria y debe ser un texto.',
    INVALID_SUBCATEGORIA: 'La subcategoría debe ser un texto.',
    INVALID_PRECIO: 'El precio es obligatorio y debe ser un número mayor a 0.',
    INVALID_VARIANTES: 'Las variantes deben ser una lista de { nombre, precio } con precio mayor a 0.',
    INVALID_DESTACADO: 'El campo destacado debe ser verdadero o falso.',
    INVALID_FILTRO_DESTACADO: 'El filtro destacado debe ser "true" o "false".',
    INVALID_IMAGEN: 'La imagen debe ser un texto.',
    INVALID_DESCRIPCION: 'La descripción debe ser un texto.',
    ROUTE_NOT_FOUND: 'La ruta solicitada no existe.',
    INTERNAL_SERVER_ERROR: 'Ocurrió un error interno en el servidor.'
});
