import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUPPETEER = process.env.PUPPETEER_PATH
  || path.join(process.env.APPDATA || '', 'npm/node_modules/hyperframes/node_modules/puppeteer-core');
const CHROME = process.env.CHROME_PATH
  || path.join(process.env.USERPROFILE || '', '.cache/hyperframes/chrome/chrome-headless-shell/win64-152.0.7977.30/chrome-headless-shell-win64/chrome-headless-shell.exe');
const puppeteer = require(PUPPETEER);

const [modo = 'video', a1, a2, a3] = process.argv.slice(2);
const lista = (txt, def) => (txt ? txt.split(',').map(Number) : def);

const abrir = async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--hide-scrollbars', '--force-device-scale-factor=1', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  page.on('console', (m) => { if (m.type() === 'error') console.log('[pagina]', m.text()); });
  page.on('pageerror', (e) => console.log('[error]', e.message));
  await page.goto(pathToFileURL(path.join(RAIZ, 'index.html')).href + '?render', { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction('window.Deck && window.Deck.listo', { timeout: 120000 });
  return { browser, page };
};

const foto = (page) => page.screenshot({ type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1920, height: 1080 }, optimizeForSpeed: true });

const avanzarHasta = async (page, n) => {
  let tG = 0;
  for (let k = 0; k < n; k++) {
    const info = await page.evaluate((k) => window.Deck.clip(k), k);
    await page.evaluate((t, g) => window.Deck.cuadro(t, g), info.dur, tG + info.dur);
    tG += info.dur;
  }
  return tG;
};

const fotos = async () => {
  const diapos = lista(a1, null);
  const tiempos = lista(a2, [0.5, 2, 5]);
  const salida = path.join(RAIZ, 'render', 'fotos');
  fs.mkdirSync(salida, { recursive: true });
  const { browser, page } = await abrir();
  const total = await page.evaluate(() => window.Deck.total);
  const objetivo = diapos || [...Array(total).keys()];
  let tG = 0;
  for (let n = 0; n <= Math.max(...objetivo); n++) {
    const info = await page.evaluate((n) => window.Deck.clip(n), n);
    if (objetivo.includes(n)) {
      for (const t of [...tiempos, info.dur].filter((v, i, arr) => arr.indexOf(v) === i && v <= info.dur)) {
        await page.evaluate((t, g) => window.Deck.cuadro(t, g), t, tG + t);
        const archivo = path.join(salida, `${info.id}_${String(t).replace('.', '-')}.jpg`);
        fs.writeFileSync(archivo, await foto(page));
      }
    }
    await page.evaluate((t, g) => window.Deck.cuadro(t, g), info.dur, tG + info.dur);
    tG += info.dur;
  }
  await browser.close();
  console.log('fotos listas en', salida);
};

const codificar = (archivo, fps) => {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(fps), '-movflags', '+faststart', archivo], { stdio: ['pipe', 'inherit', 'inherit'] });
  const fin = new Promise((ok, mal) => ff.on('close', (c) => (c === 0 ? ok() : mal(new Error('ffmpeg ' + c)))));
  const escribir = (buf) => new Promise((ok) => (ff.stdin.write(buf) ? ok() : ff.stdin.once('drain', ok)));
  return { escribir, cerrar: () => { ff.stdin.end(); return fin; } };
};

const video = async () => {
  const fps = Number(a3) || 30;
  const salida = path.join(RAIZ, 'videos');
  fs.mkdirSync(salida, { recursive: true });
  const { browser, page } = await abrir();
  const total = await page.evaluate(() => window.Deck.total);
  const desde = Number(a1 || 1) - 1;
  const hasta = Math.min(total, Number(a2 || total)) - 1;
  let tG = await avanzarHasta(page, desde);
  const inicio = Date.now();
  for (let n = desde; n <= hasta; n++) {
    const info = await page.evaluate((n) => window.Deck.clip(n), n);
    const archivo = path.join(salida, `${String(n + 1).padStart(2, '0')}_${info.id}.mp4`);
    const enc = codificar(archivo, fps);
    const cuadros = Math.round(info.dur * fps);
    for (let f = 0; f < cuadros; f++) {
      const t = f / fps;
      await page.evaluate((t, g) => window.Deck.cuadro(t, g), t, tG + t);
      await enc.escribir(await foto(page));
    }
    await enc.cerrar();
    tG += info.dur;
    console.log(`${path.basename(archivo)}  ${cuadros} cuadros  ${((Date.now() - inicio) / 1000).toFixed(0)} s`);
  }
  const notas = await page.evaluate(() => window.Deck.notas());
  fs.writeFileSync(path.join(salida, 'notas.json'), JSON.stringify(notas, null, 2));
  await browser.close();
};

(modo === 'fotos' ? fotos() : video()).catch((e) => {
  console.error(e);
  process.exit(1);
});
