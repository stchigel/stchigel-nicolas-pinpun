/*
 * Geometría de los firuletes del fileteado porteño.
 *
 * Una voluta es un trazo cuya curvatura crece a lo largo del recorrido:
 * arranca casi recto y termina enroscado en un "ojo". El ancho se afina
 * hacia la punta. Sobre el trazo base se pintan una luz (banda más clara)
 * y un brillo (línea fina), como hace el fileteador con el pincel.
 */

const PASOS = 90;

const redondear = (n) => Math.round(n * 10) / 10;

/* Recorre la línea central de la voluta y devuelve puntos con su normal y ancho. */
function recorrer({ x, y, angulo, largo, curvaInicial, curvaFinal, ancho, sentido, exponente = 2.4 }) {
    const puntos = [];
    const ds = largo / PASOS;
    let theta = (angulo * Math.PI) / 180;
    let px = x;
    let py = y;

    for (let i = 0; i <= PASOS; i++) {
        const t = i / PASOS;
        const grosor = ancho * Math.min(1, t / 0.12) ** 0.6 * (1 - 0.82 * t ** 0.85);
        const nx = -Math.sin(theta) * sentido;
        const ny = Math.cos(theta) * sentido;
        puntos.push({ x: px, y: py, nx, ny, grosor, t });

        const curva = curvaInicial + (curvaFinal - curvaInicial) * t ** exponente;
        theta += curva * ds * sentido;
        px += Math.cos(theta) * ds;
        py += Math.sin(theta) * ds;
    }

    return puntos;
}

const comoTrazo = (lista) =>
    lista.map((p, i) => `${i === 0 ? 'M' : 'L'}${redondear(p[0])} ${redondear(p[1])}`).join(' ');

/* Contorno cerrado de una banda que sigue la línea central, desplazada y con ancho relativo. */
function banda(puntos, { desde = 0, hasta = 1, desplazamiento = 0, proporcion = 1 }) {
    const tramo = puntos.filter((p) => p.t >= desde && p.t <= hasta);
    const lado = (signo) =>
        tramo.map((p) => {
            const centro = p.grosor * desplazamiento;
            const medio = (p.grosor * proporcion) / 2;
            return [p.x + p.nx * (centro + signo * medio), p.y + p.ny * (centro + signo * medio)];
        });

    return `${comoTrazo(lado(1))} ${comoTrazo(lado(-1).reverse()).replace('M', 'L')} Z`;
}

/*
 * Devuelve los caminos SVG de una voluta: cuerpo, luz y brillo, más el ojo final.
 * `sentido` 1 enrosca en sentido horario (en pantalla), -1 antihorario.
 */
export function voluta(opciones) {
    const puntos = recorrer(opciones);
    const ultimo = puntos[puntos.length - 1];

    return {
        cuerpo: banda(puntos, {}),
        luz: banda(puntos, { desde: 0.06, hasta: 0.9, desplazamiento: 0.2, proporcion: 0.34 }),
        brillo: comoTrazo(
            puntos
                .filter((p) => p.t >= 0.12 && p.t <= 0.62)
                .map((p) => [p.x - p.nx * p.grosor * 0.28, p.y - p.ny * p.grosor * 0.28])
        ),
        ojo: { cx: redondear(ultimo.x), cy: redondear(ultimo.y), r: redondear(Math.max(ultimo.grosor * 0.9, 1.6)) }
    };
}
