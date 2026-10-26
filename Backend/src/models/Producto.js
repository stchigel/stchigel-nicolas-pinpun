/*
 * Plato o bebida de una carta.
 * - `cartaId` es la carta (menú) a la que pertenece: cada local usa una distinta en el salón y al pedir (delivery y retiro).
 * - `categoria` y `subcategoria` ordenan la carta ("Empanadas" / "Fritas").
 * - `variantes` lista los tamaños con su precio ({ nombre, precio }); vacía si hay un solo precio.
 * - `precio` es el precio único o, si hay variantes, el de la primera.
 * - `destacado` lo muestra en "Nuestros más vendidos".
 * - `tipo` es 'simple' o 'combo'. Un combo se ve en la carta como cualquier otro plato (con su propio precio) y, por dentro,
 *   `componentes` dice de qué platos se compone: [{ productoId, nombre, variante, cantidad, precio }], con el precio unitario
 *   de cada uno por separado (para saber cuánto se ahorra con el combo).
 */
class Producto {
    constructor({ id, cartaId, nombre, categoria, subcategoria = '', imagen = '', precio, variantes = [], descripcion = '', destacado = false, tipo = 'simple', componentes = [] }) {
        this.id = id;
        this.cartaId = cartaId;
        this.nombre = nombre;
        this.categoria = categoria;
        this.subcategoria = subcategoria;
        this.imagen = imagen;
        this.precio = variantes.length > 0 ? variantes[0].precio : precio;
        this.variantes = variantes;
        this.descripcion = descripcion;
        this.destacado = destacado;
        this.tipo = tipo;
        this.componentes = componentes;
    }
}

export default Producto;
