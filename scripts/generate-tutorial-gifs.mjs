/**
 * WA Transportes — Tutorial GIF Generator
 * 
 * Gera GIFs animados de cada módulo do sistema para o tutorial de novos usuários.
 * 
 * Uso:
 *   node scripts/generate-tutorial-gifs.mjs
 * 
 * Variáveis de ambiente (ou crie um arquivo .env.tutorial):
 *   TUTORIAL_URL=http://localhost:5173
 *   TUTORIAL_EMAIL=seu@email.com
 *   TUTORIAL_PASSWORD=suasenha
 * 
 * O app precisa estar rodando antes de executar este script.
 * Execute em outro terminal: npm run dev
 */

import { chromium } from 'playwright';
import GIFEncoder from 'gif-encoder-2';
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'tutorial-gifs');

// ── Helpers ──────────────────────────────────────────────────────────────────

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function question(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(prompt, ans => { rl.close(); resolve(ans.trim()); }));
}

async function getConfig() {
  const envFile = path.join(ROOT, '.env.tutorial');
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
    for (const line of lines) {
      const [k, ...rest] = line.split('=');
      if (k && rest.length) process.env[k.trim()] = rest.join('=').trim();
    }
  }
  const url      = process.env.TUTORIAL_URL      || 'http://localhost:5173';
  const email    = process.env.TUTORIAL_EMAIL    || await question('Email de login: ');
  const password = process.env.TUTORIAL_PASSWORD || await question('Senha: ');
  return { url, email, password };
}

async function screenshotToRGBA(buffer) {
  return new Promise((resolve, reject) => {
    const png = new PNG();
    png.parse(buffer, (err, data) => {
      if (err) return reject(err);
      resolve({ data: data.data, width: data.width, height: data.height });
    });
  });
}

async function buildGif(frames, outputPath) {
  if (!frames.length) return;
  const { width, height } = frames[0];
  const encoder = new GIFEncoder(width, height, 'neuquant', true);
  encoder.setDelay(1200);
  encoder.setRepeat(0);
  encoder.setQuality(10);
  encoder.start();

  for (const frame of frames) {
    const rgba = new Uint8Array(frame.data);
    // GIF encoder expects RGB (drop alpha channel)
    const rgb = Buffer.alloc(width * height * 3);
    for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
      rgb[j]     = rgba[i];
      rgb[j + 1] = rgba[i + 1];
      rgb[j + 2] = rgba[i + 2];
    }
    encoder.addFrame(rgb);
  }
  encoder.finish();

  const buffer = encoder.out.getData();
  fs.writeFileSync(outputPath, buffer);
  const kb = Math.round(buffer.length / 1024);
  console.log(`  ✓ Salvo: ${path.basename(outputPath)} (${kb} KB)`);
}

async function captureFrames(page, actions) {
  const frames = [];

  for (const action of actions) {
    if (action.wait) {
      await page.waitForTimeout(action.wait);
    }
    if (action.click) {
      try { await page.click(action.click, { timeout: 3000 }); } catch {}
      await page.waitForTimeout(600);
    }
    if (action.scrollTo) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), action.scrollTo);
      await page.waitForTimeout(500);
    }
    if (action.hover) {
      try { await page.hover(action.hover, { timeout: 3000 }); } catch {}
      await page.waitForTimeout(300);
    }
    if (action.type) {
      try { await page.fill(action.type.selector, action.type.value); } catch {}
      await page.waitForTimeout(300);
    }

    // Take screenshot
    const buf = await page.screenshot({ type: 'png' });
    const frame = await screenshotToRGBA(buf);
    frames.push(frame);
  }

  return frames;
}

// ── Module definitions ────────────────────────────────────────────────────────

function getModules(baseUrl) {
  const dash = (tab) => `${baseUrl}/dashboard?tab=${tab}`;

  return [
    {
      id: 'welcome',
      name: 'Bem-vindo',
      setup: async (page) => {
        await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 200 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 800 },
      ],
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      setup: async (page) => {
        await page.goto(dash('dashboard'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 600 },
        { hover: 'button:has-text("Novo Serviço")' },
        { wait: 500 },
        { hover: 'button:has-text("Novo Custo")' },
        { wait: 500 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 600 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 500 },
      ],
    },
    {
      id: 'empresas',
      name: 'Empresas',
      setup: async (page) => {
        await page.goto(dash('empresas'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 600 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
    {
      id: 'servicos',
      name: 'Serviços',
      setup: async (page) => {
        await page.goto(dash('services'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 600 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 600 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 500 },
      ],
    },
    {
      id: 'checklist',
      name: 'Checklist',
      setup: async (page) => {
        await page.goto(dash('checklist'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 600 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
    {
      id: 'mapa',
      name: 'Mapa ao Vivo',
      setup: async (page) => {
        await page.goto(dash('mapa'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(2500);
      },
      actions: [
        { wait: 1000 },
        { scrollTo: 0 },
        { wait: 800 },
        { scrollTo: 300 },
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
      ],
    },
    {
      id: 'custos',
      name: 'Custos',
      setup: async (page) => {
        await page.goto(dash('costs'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 600 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 600 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 500 },
      ],
    },
    {
      id: 'fechamento',
      name: 'Fechamento',
      setup: async (page) => {
        await page.goto(dash('fechamento'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
    {
      id: 'motoristas',
      name: 'Motoristas',
      setup: async (page) => {
        await page.goto(dash('motoristas'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
    {
      id: 'veiculos',
      name: 'Veículos',
      setup: async (page) => {
        await page.goto(dash('veiculos'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
    {
      id: 'usuarios',
      name: 'Usuários',
      setup: async (page) => {
        await page.goto(dash('users'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
    {
      id: 'configuracoes',
      name: 'Configurações',
      setup: async (page) => {
        await page.goto(dash('configuracoes'), { waitUntil: 'networkidle' });
        await page.waitForTimeout(1800);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
    {
      id: 'portal',
      name: 'Portal do Cliente',
      setup: async (page) => {
        await page.goto(`${baseUrl}/portal`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
    {
      id: 'motorista-app',
      name: 'App do Motorista',
      setup: async (page) => {
        await page.goto(`${baseUrl}/motorista`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
      },
      actions: [
        { wait: 800 },
        { scrollTo: 0 },
        { wait: 700 },
        { scrollTo: 300 },
        { wait: 700 },
        { scrollTo: 0 },
        { wait: 600 },
      ],
    },
  ];
}

// ── Login ─────────────────────────────────────────────────────────────────────

async function login(page, baseUrl, email, password) {
  console.log('\n🔐 Fazendo login...');
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${baseUrl}/dashboard**`, { timeout: 15000 });
  await page.waitForTimeout(2000);
  console.log('  ✓ Login realizado com sucesso!');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║  WA Transportes — Gerador de GIFs Tutorial ║');
  console.log('╚═══════════════════════════════════════════╝\n');

  ensureOutputDir();
  const { url, email, password } = await getConfig();

  console.log(`\n🌐 URL do sistema: ${url}`);
  console.log(`📂 GIFs serão salvos em: ${OUTPUT_DIR}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Suppress console noise from the app
  page.on('console', () => {});
  page.on('pageerror', () => {});

  try {
    await login(page, url, email, password);

    const modules = getModules(url);
    const total = modules.length;

    for (let i = 0; i < modules.length; i++) {
      const mod = modules[i];
      console.log(`\n[${i + 1}/${total}] Capturando: ${mod.name}`);

      const outputPath = path.join(OUTPUT_DIR, `${mod.id}.gif`);

      try {
        await mod.setup(page);
        const frames = await captureFrames(page, mod.actions);
        await buildGif(frames, outputPath);
      } catch (err) {
        console.error(`  ✗ Erro em "${mod.name}":`, err.message);
        // Continue with next module
      }
    }

    console.log('\n✅ Todos os GIFs gerados com sucesso!');
    console.log(`📁 Local: ${OUTPUT_DIR}`);
    console.log('\nAcesse o tutorial em: /tutorial');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('\n❌ Erro fatal:', err.message);
  process.exit(1);
});
