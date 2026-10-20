/* Un teléfono sirve si tiene al menos 8 dígitos, con o sin espacios, guiones o paréntesis */
export const esTelefonoValido = (texto) => texto.replace(/\D/g, '').length >= 8;

export const MENSAJE_TELEFONO = 'Escribí un teléfono con código de área, por ejemplo 011 4862-3260.';
