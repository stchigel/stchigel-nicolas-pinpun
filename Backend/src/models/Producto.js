/*
 * Plato o bebida de una carta.
 * - `cartaId` es la carta (menú) a la que pertenece: cada local usa una distinta en el salón, el retiro y el delivery.
 * - `categoria` y `subcategoria` ordenan la carta ("Empanadas" / "Fritas").
 * - `variantes` lista los tamaños con su precio ({ nombre, precio }); vacía si hay un solo precio.
 * - `precio` es el precio único o, si hay variantes, el de la primera.
 * - `destacado` lo muestra en "Nuestros más vendidos".
 */
class Producto {
    constructor({ id, cartaId, nombre, categoria, subcategoria = '', imagen = '', precio, variantes = [], descripcion = '', destacado = false }) {
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
    }
}

export default Producto;
