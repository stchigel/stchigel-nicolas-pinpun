// Levanta el sistema completo: API (Backend, :3000) y sitio (Frontend, :5173).
// Uso: node iniciar.mjs   (o doble clic en iniciar.bat)
// Ctrl + C corta los dos.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = dirname(fileURLToPath(import.meta.url));
const esWindows = process.platform === 'win32';

const servicios = [
    { nombre: 'back ', carpeta: 'Backend', color: '\x1b[36m' },
    { nombre: 'front', carpeta: 'Frontend', color: '\x1b[35m' }
];
const reset = '\x1b[0m';

function instalarSiHaceFalta(carpeta) {
    const cwd = join(raiz, carpeta);
    if (existsSync(join(cwd, 'node_modules'))) return;
    console.log(`Instalando dependencias de ${carpeta}...`);
    const r = spawnSync('npm install', { cwd, stdio: 'inherit', shell: true });
    if (r.status !== 0) {
        console.error(`No se pudo instalar ${carpeta}.`);
        process.exit(1);
    }
}

function prefijar(servicio, flujo, salida) {
    let resto = '';
    flujo.on('data', (trozo) => {
        const lineas = (resto + trozo.toString()).split(/\r?\n/);
        resto = lineas.pop();
        for (const linea of lineas) {
            salida.write(`${servicio.color}[${servicio.nombre}]${reset} ${linea}\n`);
        }
    });
}

const hijos = [];
let cerrando = false;

function cerrarTodo(codigo = 0) {
    if (cerrando) return;
    cerrando = true;
    for (const hijo of hijos) {
        if (hijo.exitCode !== null) continue;
        if (esWindows) {
            // En Windows hay que matar el árbol entero: npm lanza node como nieto.
            spawnSync('taskkill', ['/pid', String(hijo.pid), '/T', '/F'], { stdio: 'ignore' });
        } else {
            hijo.kill('SIGTERM');
        }
    }
    process.exit(codigo);
}

servicios.forEach((s) => instalarSiHaceFalta(s.carpeta));

for (const servicio of servicios) {
    const hijo = spawn('npm run dev', {
        cwd: join(raiz, servicio.carpeta),
        shell: true,
        env: { ...process.env, FORCE_COLOR: '1' }
    });
    prefijar(servicio, hijo.stdout, process.stdout);
    prefijar(servicio, hijo.stderr, process.stderr);
    hijo.on('exit', (codigo) => {
        if (cerrando) return;
        console.error(`${servicio.color}[${servicio.nombre}]${reset} se detuvo (código ${codigo}). Cerrando todo.`);
        cerrarTodo(codigo ?? 1);
    });
    hijos.push(hijo);
}

console.log('Pin Pun arrancando: API en http://localhost:3000 · sitio en http://localhost:5173 (Ctrl + C para cortar)');

process.on('SIGINT', () => cerrarTodo(0));
process.on('SIGTERM', () => cerrarTodo(0));
