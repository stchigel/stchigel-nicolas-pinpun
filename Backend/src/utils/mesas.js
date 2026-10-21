/*
 * ¿Entran todos estos grupos en el salón a la misma hora?
 * - Si el local junta mesas, alcanza con que la suma de personas no pase los comensales del salón.
 * - Si no las junta, cada grupo tiene que sentarse en una sola mesa: se reparte de mayor a menor,
 *   a cada grupo la mesa libre más chica en la que entre, y entran todos si a ninguno le falta mesa.
 * `mesas` es la lista de tipos del local: [{ capacidad, cantidad }].
 */
export const hayLugar = (mesas, juntarMesas, grupos) => {
    if (juntarMesas) {
        const comensales = mesas.reduce((total, mesa) => total + mesa.capacidad * mesa.cantidad, 0);
        return grupos.reduce((total, personas) => total + personas, 0) <= comensales;
    }

    const libres = mesas.flatMap((mesa) => Array(mesa.cantidad).fill(mesa.capacidad)).sort((a, b) => a - b);

    return [...grupos]
        .sort((a, b) => b - a)
        .every((personas) => {
            const indice = libres.findIndex((capacidad) => capacidad >= personas);
            if (indice === -1) return false;

            libres.splice(indice, 1);
            return true;
        });
};
