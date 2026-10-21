import { randomBytes, scryptSync } from 'node:crypto';

/* La contraseña se guarda como "sal:hash" (scrypt), nunca en texto plano */
export const hashContrasena = (contrasena) => {
    const sal = randomBytes(16).toString('hex');
    return `${sal}:${scryptSync(contrasena, sal, 32).toString('hex')}`;
};
