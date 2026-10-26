/*
 * Cuentas con las que arranca una base nueva (ver README). Las contraseñas se guardan hasheadas al cargarlas.
 * - el administrador general (`localId: null`) gestiona todas las sucursales;
 * - cada administrador de sucursal gestiona solo la suya;
 * - cada repartidor pertenece a una sucursal y ve solo los pedidos que le asignaron.
 * Son cuentas de prueba: en una base real hay que cambiarlas o borrarlas.
 */
export const administradores = [
    { dni: '30111222', nombre: 'Marta', apellido: 'Ferrari', mail: 'admin@pinpun.com', numero: '011 4862-3260', direccion: 'Av. Corrientes 3954', contrasena: 'pinpun2026', localId: null },
    { dni: '32333444', nombre: 'Raúl', apellido: 'Bianchi', mail: 'almagro@pinpun.com', numero: '011 4862-3260', direccion: 'Av. Corrientes 3954', contrasena: 'almagro2026', localId: 1 },
    { dni: '33444555', nombre: 'Lucía', apellido: 'Conti', mail: 'urquiza@pinpun.com', numero: '011 4521-2181', direccion: 'La Pampa 5201', contrasena: 'urquiza2026', localId: 3 }
];

export const repartidores = [
    { dni: '35111222', nombre: 'Diego', apellido: 'Paredes', mail: 'diego@pinpun.com', numero: '011 5611-2034', direccion: 'Medrano 1200', contrasena: 'reparto2026', localId: 1 },
    { dni: '36222333', nombre: 'Nahuel', apellido: 'Ortiz', mail: 'nahuel@pinpun.com', numero: '011 5877-4410', direccion: 'Gascón 640', contrasena: 'reparto2026', localId: 1 },
    { dni: '37333444', nombre: 'Verónica', apellido: 'Salas', mail: 'vero@pinpun.com', numero: '011 6034-9921', direccion: 'Triunvirato 4200', contrasena: 'reparto2026', localId: 3 }
];
