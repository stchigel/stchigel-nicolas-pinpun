/*
 * Sucursal de Pin Pun.
 * - `mesas` lista los tipos de mesa del salón: { capacidad, cantidad } (por ejemplo 10 mesas de 4 comensales).
 * - `cantidadMesas` y `capacidadComensales` se calculan de ahí y limitan cuántas personas se reservan a la vez.
 * - `reservaMaxPersonas` es el tope de personas que se acepta en una sola reserva.
 * - `juntarMesas` dice si, para un grupo grande, se pueden juntar mesas; si no, cada grupo entra en una sola mesa.
 * - `maximoPorReserva` es lo que de verdad se acepta: el tope, sin pasar lo que el salón puede sentar
 *   (todos los comensales si junta mesas, la mesa más grande si no).
 * - `cartas` dice qué carta (menú) usa en cada canal: { salon, retiro, delivery } con el id de la carta.
 */
class Local {
    constructor(id, nombre, direccion, numero, instagram, latitud, longitud, horarioApertura, horarioCierre, mesas = [], reservaMaxPersonas = 12, juntarMesas = true, cartas = {}) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.numero = numero;
        this.instagram = instagram;
        this.latitud = latitud;
        this.longitud = longitud;
        this.horarioApertura = horarioApertura;
        this.horarioCierre = horarioCierre;
        this.mesas = mesas;
        this.reservaMaxPersonas = reservaMaxPersonas;
        this.juntarMesas = juntarMesas;
        this.cartas = cartas;
        this.cantidadMesas = mesas.reduce((total, mesa) => total + mesa.cantidad, 0);
        this.capacidadComensales = mesas.reduce((total, mesa) => total + mesa.cantidad * mesa.capacidad, 0);
        this.mayorMesa = mesas.reduce((mayor, mesa) => (mesa.cantidad > 0 ? Math.max(mayor, mesa.capacidad) : mayor), 0);
        this.maximoPorReserva = Math.min(reservaMaxPersonas, juntarMesas ? this.capacidadComensales : this.mayorMesa);
    }
}

export default Local;
