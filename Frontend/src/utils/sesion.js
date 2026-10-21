/* A dónde va cada uno al entrar: la administración, al panel; el repartidor, a su portal de entregas */
export const rutaInicial = (usuario) => (usuario.rol === 'repartidor' ? '/reparto' : '/admin');

export const ETIQUETA_ROL = {
    general: 'Administración general',
    sucursal: 'Administración de sucursal',
    repartidor: 'Reparto'
};
