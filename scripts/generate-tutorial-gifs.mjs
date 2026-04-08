/**
 * WA Transportes — Tutorial GIF Generator
 * Usa mocks do Supabase via Playwright route interception (sem internet necessária).
 */

import { chromium } from 'playwright';
import GIFEncoder from 'gif-encoder-2';
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT     = path.resolve(__dirname, '..');
const OUT_DIR  = path.join(ROOT, 'public', 'tutorial-gifs');
const BASE_URL = 'http://127.0.0.1:8080';

// ── JWT fake (client-side decoded only, não verificado pelo browser) ──────────
function b64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}
const FAKE_JWT = [
  b64url({ alg: 'HS256', typ: 'JWT' }),
  b64url({
    sub: 'aabbccdd-0000-0000-0000-112233445566',
    email: 'vendasdesolucoes1@gmail.com',
    role: 'authenticated',
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 86400 * 30,
    iat: Math.floor(Date.now() / 1000),
    app_metadata: { provider: 'email' },
    user_metadata: {},
  }),
  'fake-sig',
].join('.');

const FAKE_SESSION = {
  access_token:  FAKE_JWT,
  refresh_token: 'fake-refresh-token-wa-transportes',
  expires_in:    86400,
  expires_at:    Math.floor(Date.now() / 1000) + 86400 * 30,
  token_type:    'bearer',
  user: {
    id:    'aabbccdd-0000-0000-0000-112233445566',
    email: 'vendasdesolucoes1@gmail.com',
    role:  'authenticated',
    app_metadata: { provider: 'email' },
    user_metadata: {},
    aud: 'authenticated',
  },
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const HOJE = new Date().toISOString().split('T')[0];
const MES  = new Date().toISOString().slice(0, 7);

const MOCK_EMPRESAS = [
  { id: 1, nome: 'Supermercados Norte Ltda', cnpj: '12.345.678/0001-90', telefone: '(11) 3333-1111', email: 'norte@email.com', ativo: true, token_portal: 'tok-norte', created_at: HOJE },
  { id: 2, nome: 'Indústria Sul S/A',        cnpj: '98.765.432/0001-10', telefone: '(11) 3333-2222', email: 'sul@email.com',   ativo: true, token_portal: 'tok-sul',   created_at: HOJE },
  { id: 3, nome: 'Comércio Leste ME',        cnpj: '11.223.344/0001-55', telefone: '(11) 3333-3333', email: 'leste@email.com', ativo: false, token_portal: 'tok-leste', created_at: HOJE },
];

const MOCK_MOTORISTAS = [
  { id: 1, nome: 'Carlos Eduardo Silva',   cnh: '12345678900', categoria_cnh: 'D', validade_cnh: '2027-06-15', telefone: '(11) 99111-2222', status: 'ativo',    created_at: HOJE },
  { id: 2, nome: 'Roberto Alves Costa',    cnh: '98765432100', categoria_cnh: 'E', validade_cnh: '2026-03-20', telefone: '(11) 99333-4444', status: 'ativo',    created_at: HOJE },
  { id: 3, nome: 'Marcos Pereira Santos',  cnh: '55544433300', categoria_cnh: 'D', validade_cnh: '2025-11-30', telefone: '(11) 99555-6666', status: 'ferias',   created_at: HOJE },
  { id: 4, nome: 'João Batista Oliveira',  cnh: '77788899900', categoria_cnh: 'C', validade_cnh: '2028-01-10', telefone: '(11) 99777-8888', status: 'inativo',  created_at: HOJE },
];

const MOCK_VEICULOS = [
  { id: 1, placa: 'ABC-1D23', modelo: 'Volkswagen Delivery 9.170',  ano: 2021, capacidade_kg: 9000,  status: 'ativo',   vencimento_seguro: '2025-08-01', vencimento_crlv: '2025-12-31', motorista_id: 1, created_at: HOJE },
  { id: 2, placa: 'DEF-4G56', modelo: 'Mercedes-Benz Axor 2544',    ano: 2019, capacidade_kg: 25000, status: 'ativo',   vencimento_seguro: '2025-09-15', vencimento_crlv: '2025-12-31', motorista_id: 2, created_at: HOJE },
  { id: 3, placa: 'GHI-7J89', modelo: 'Ford Cargo 1723 Basculante', ano: 2022, capacidade_kg: 15000, status: 'manutencao', vencimento_seguro: '2026-01-20', vencimento_crlv: '2025-12-31', motorista_id: null, created_at: HOJE },
];

const MOCK_SERVICOS = [
  { id: 1, data: HOJE, empresa_id: 1, empresa: 'Supermercados Norte Ltda', motorista_id: 1, motorista: 'Carlos Eduardo Silva', veiculo_id: 1, origem: 'São Paulo', destino: 'Campinas', valor: 850.00, status: 'concluido', descricao: 'Entrega de mercadorias', created_at: HOJE },
  { id: 2, data: HOJE, empresa_id: 2, empresa: 'Indústria Sul S/A',        motorista_id: 2, motorista: 'Roberto Alves Costa',   veiculo_id: 2, origem: 'Guarulhos', destino: 'Santos',   valor: 1200.00, status: 'em_andamento', descricao: 'Transporte de peças', created_at: HOJE },
  { id: 3, data: HOJE, empresa_id: 1, empresa: 'Supermercados Norte Ltda', motorista_id: 1, motorista: 'Carlos Eduardo Silva', veiculo_id: 1, origem: 'São Paulo', destino: 'Sorocaba', valor: 720.00, status: 'agendado', descricao: 'Coleta e entrega', created_at: HOJE },
  { id: 4, data: `${MES}-02`, empresa_id: 2, empresa: 'Indústria Sul S/A', motorista_id: 2, motorista: 'Roberto Alves Costa', veiculo_id: 2, origem: 'Mauá', destino: 'Diadema', valor: 550.00, status: 'concluido', descricao: 'Frete industrial', created_at: HOJE },
  { id: 5, data: `${MES}-05`, empresa_id: 3, empresa: 'Comércio Leste ME', motorista_id: 1, motorista: 'Carlos Eduardo Silva', veiculo_id: 1, origem: 'Itaquera', destino: 'Guarulhos', valor: 430.00, status: 'concluido', descricao: 'Entrega expressa', created_at: HOJE },
];

const MOCK_CUSTOS = [
  { id: 1, data: HOJE, descricao: 'Abastecimento - Posto BR km 23',    valor: 380.00, tipo: 'combustivel',  forma_pagamento: 'cartao',   motorista_id: 1, veiculo_id: 1, created_at: HOJE },
  { id: 2, data: HOJE, descricao: 'Manutenção preventiva - troca óleo', valor: 520.00, tipo: 'manutencao',   forma_pagamento: 'dinheiro', motorista_id: null, veiculo_id: 2, created_at: HOJE },
  { id: 3, data: HOJE, descricao: 'Pedágio SP-070 trecho ida/volta',    valor: 87.40,  tipo: 'pedagio',      forma_pagamento: 'cartao',   motorista_id: 2, veiculo_id: 2, created_at: HOJE },
  { id: 4, data: `${MES}-03`, descricao: 'Pneu dianteiro direito',     valor: 950.00, tipo: 'pneu',         forma_pagamento: 'pix',      motorista_id: null, veiculo_id: 1, created_at: HOJE },
  { id: 5, data: `${MES}-01`, descricao: 'Seguro frota mensal',         valor: 1800.00, tipo: 'seguro',      forma_pagamento: 'boleto',   motorista_id: null, veiculo_id: null, created_at: HOJE },
];

const MOCK_PROFILE = {
  id:         'aabbccdd-0000-0000-0000-112233445566',
  full_name:  'Victor Camisa',
  email:      'vendasdesolucoes1@gmail.com',
  is_admin:   true,
  created_at: HOJE,
};

const MOCK_PERMISSIONS = [
  { user_id: 'aabbccdd-0000-0000-0000-112233445566', permission: 'dashboard_view' },
  { user_id: 'aabbccdd-0000-0000-0000-112233445566', permission: 'services_view' },
  { user_id: 'aabbccdd-0000-0000-0000-112233445566', permission: 'services_create' },
  { user_id: 'aabbccdd-0000-0000-0000-112233445566', permission: 'costs_view' },
  { user_id: 'aabbccdd-0000-0000-0000-112233445566', permission: 'costs_create' },
  { user_id: 'aabbccdd-0000-0000-0000-112233445566', permission: 'users_manage' },
  { user_id: 'aabbccdd-0000-0000-0000-112233445566', permission: 'checklist_access' },
];

const MOCK_PROFILES_LIST = [
  MOCK_PROFILE,
  { id: 'bbccddee-0000-0000-0000-223344556677', full_name: 'Carlos Motorista',  email: 'carlos@wa.com',   is_admin: false, created_at: HOJE },
  { id: 'ccddeeff-0000-0000-0000-334455667788', full_name: 'Roberto Logística', email: 'roberto@wa.com',  is_admin: false, created_at: HOJE },
];

const MOCK_GPS = [
  { id: 1, motorista_id: 1, latitude: -23.5505, longitude: -46.6333, velocidade: 65, created_at: new Date().toISOString() },
  { id: 2, motorista_id: 2, latitude: -23.4668, longitude: -46.5250, velocidade: 80, created_at: new Date().toISOString() },
];

// ── Mock route handler ────────────────────────────────────────────────────────
function tableResponse(data) {
  return { status: 200, contentType: 'application/json', body: JSON.stringify(data) };
}

function mockRoute(url) {
  const u = url.toString();

  // Auth endpoints
  if (u.includes('/auth/v1/token'))    return tableResponse(FAKE_SESSION);
  if (u.includes('/auth/v1/user'))     return tableResponse(FAKE_SESSION.user);
  if (u.includes('/auth/v1/session'))  return tableResponse(FAKE_SESSION);
  if (u.includes('/auth/v1/logout'))   return { status: 204, body: '' };

  // REST endpoints
  if (u.includes('/rest/v1/empresas'))          return tableResponse(MOCK_EMPRESAS);
  if (u.includes('/rest/v1/motoristas'))        return tableResponse(MOCK_MOTORISTAS);
  if (u.includes('/rest/v1/veiculos'))          return tableResponse(MOCK_VEICULOS);
  if (u.includes('/rest/v1/servicos'))          return tableResponse(MOCK_SERVICOS);
  if (u.includes('/rest/v1/custos'))            return tableResponse(MOCK_CUSTOS);
  if (u.includes('/rest/v1/posicoes_gps'))      return tableResponse(MOCK_GPS);
  if (u.includes('/rest/v1/ordens_servico'))    return tableResponse([]);
  if (u.includes('/rest/v1/clientes_portal'))   return tableResponse([]);
  if (u.includes('/rest/v1/company_settings'))  return tableResponse([{ id: 1, company_name: 'WA Transportes', cnpj: '00.000.000/0001-00' }]);
  if (u.includes('/rest/v1/checklist'))         return tableResponse([]);
  if (u.includes('/rest/v1/user_roles'))        return tableResponse([{ user_id: MOCK_PROFILE.id, role: 'admin' }]);
  if (u.includes('/rest/v1/user_permissions'))  return tableResponse(MOCK_PERMISSIONS);
  if (u.includes('/rest/v1/profiles')) {
    if (u.includes(`id=eq.${MOCK_PROFILE.id}`)) return tableResponse([MOCK_PROFILE]);
    return tableResponse(MOCK_PROFILES_LIST);
  }

  return null; // Let other requests pass through
}

// ── GIF builder ───────────────────────────────────────────────────────────────
async function pngToRGBA(buffer) {
  return new Promise((resolve, reject) => {
    new PNG().parse(buffer, (err, data) => err ? reject(err) : resolve(data));
  });
}

async function buildGif(frames, outputPath) {
  if (!frames.length) return;
  const { width, height } = frames[0];
  const encoder = new GIFEncoder(width, height, 'neuquant', true);
  encoder.setDelay(1400);
  encoder.setRepeat(0);
  encoder.setQuality(12);
  encoder.start();
  for (const frame of frames) {
    const rgba = new Uint8Array(frame.data);
    const rgb  = Buffer.alloc(width * height * 3);
    for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
      rgb[j] = rgba[i]; rgb[j+1] = rgba[i+1]; rgb[j+2] = rgba[i+2];
    }
    encoder.addFrame(rgb);
  }
  encoder.finish();
  const buf = encoder.out.getData();
  fs.writeFileSync(outputPath, buf);
  console.log(`  ✓ ${path.basename(outputPath)}  (${Math.round(buf.length/1024)} KB)`);
}

// ── Screenshot actions ────────────────────────────────────────────────────────
async function shoot(page, actions) {
  const frames = [];
  for (const act of actions) {
    if (act.wait)     await page.waitForTimeout(act.wait);
    if (act.scrollTo !== undefined) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'smooth' }), act.scrollTo);
      await page.waitForTimeout(400);
    }
    if (act.hover) { try { await page.hover(act.hover, { timeout: 2000 }); } catch {} await page.waitForTimeout(250); }
    if (act.click) { try { await page.click(act.click, { timeout: 2000 }); } catch {} await page.waitForTimeout(600); }
    const png = await page.screenshot({ type: 'png', fullPage: false });
    frames.push(await pngToRGBA(png));
  }
  return frames;
}

// ── Modules ───────────────────────────────────────────────────────────────────
function dash(tab) { return `${BASE_URL}/dashboard?tab=${tab}`; }

const MODULES = [
  {
    id: 'welcome', name: 'Bem-vindo',
    url: `${BASE_URL}/dashboard`,
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 800 }, { scrollTo: 250 }, { wait: 800 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'dashboard', name: 'Dashboard',
    url: dash('dashboard'),
    actions: [
      { wait: 1000 }, { scrollTo: 0 }, { wait: 700 },
      { hover: 'button:has-text("Novo Serviço")' }, { wait: 500 },
      { hover: 'button:has-text("Novo Custo")' }, { wait: 500 },
      { scrollTo: 350 }, { wait: 700 }, { scrollTo: 700 }, { wait: 700 }, { scrollTo: 0 }, { wait: 500 },
    ],
  },
  {
    id: 'empresas', name: 'Empresas',
    url: dash('empresas'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 700 }, { scrollTo: 300 }, { wait: 700 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'servicos', name: 'Serviços',
    url: dash('services'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 700 }, { scrollTo: 350 }, { wait: 700 }, { scrollTo: 700 }, { wait: 700 }, { scrollTo: 0 }, { wait: 500 }],
  },
  {
    id: 'checklist', name: 'Checklist',
    url: dash('checklist'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 800 }, { scrollTo: 350 }, { wait: 800 }, { scrollTo: 700 }, { wait: 700 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'mapa', name: 'Mapa ao Vivo',
    url: dash('mapa'),
    actions: [{ wait: 2000 }, { scrollTo: 0 }, { wait: 1000 }, { scrollTo: 300 }, { wait: 800 }, { scrollTo: 0 }, { wait: 700 }],
  },
  {
    id: 'custos', name: 'Custos',
    url: dash('costs'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 700 }, { scrollTo: 350 }, { wait: 700 }, { scrollTo: 700 }, { wait: 700 }, { scrollTo: 0 }, { wait: 500 }],
  },
  {
    id: 'fechamento', name: 'Fechamento',
    url: dash('fechamento'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 800 }, { scrollTo: 300 }, { wait: 800 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'motoristas', name: 'Motoristas',
    url: dash('motoristas'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 700 }, { scrollTo: 300 }, { wait: 700 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'veiculos', name: 'Veículos',
    url: dash('veiculos'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 700 }, { scrollTo: 300 }, { wait: 700 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'usuarios', name: 'Usuários',
    url: dash('users'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 700 }, { scrollTo: 300 }, { wait: 700 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'configuracoes', name: 'Configurações',
    url: dash('configuracoes'),
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 800 }, { scrollTo: 300 }, { wait: 800 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'portal', name: 'Portal do Cliente',
    url: `${BASE_URL}/portal`,
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 800 }, { scrollTo: 300 }, { wait: 800 }, { scrollTo: 0 }, { wait: 600 }],
  },
  {
    id: 'motorista-app', name: 'App do Motorista',
    url: `${BASE_URL}/motorista`,
    actions: [{ wait: 1200 }, { scrollTo: 0 }, { wait: 800 }, { scrollTo: 300 }, { wait: 800 }, { scrollTo: 0 }, { wait: 600 }],
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  WA Transportes — Tutorial GIF Generator v2  ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-proxy-server', '--disable-web-security'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });

  // ── Inject fake session into localStorage before every page load ─────────
  const STORAGE_KEY = 'sb-vdolwbdylmegjjqkhjrn-auth-token';
  await context.addInitScript((args) => {
    const { key, session } = args;
    try { localStorage.setItem(key, JSON.stringify(session)); } catch {}
  }, { key: STORAGE_KEY, session: FAKE_SESSION });

  const page = await context.newPage();
  page.on('console', () => {});
  page.on('pageerror', () => {});

  // ── Intercept ALL Supabase requests ────────────────────────────────────
  await page.route('**/supabase.co/**', async (route) => {
    const mock = mockRoute(route.request().url());
    if (mock) {
      await route.fulfill(mock);
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
  });

  // Also intercept huggingface (logo background removal) to avoid hangs
  await page.route('**/huggingface.co/**', async (route) => {
    await route.abort();
  });

  console.log(`🌐 URL: ${BASE_URL}`);
  console.log(`📂 Output: ${OUT_DIR}\n`);

  // Warm-up: navigate to dashboard once to let React initialize
  try {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2500);
  } catch {}

  const total = MODULES.length;
  for (let i = 0; i < total; i++) {
    const mod = MODULES[i];
    process.stdout.write(`[${i+1}/${total}] ${mod.name} ... `);

    try {
      await page.goto(mod.url, { waitUntil: 'domcontentloaded', timeout: 12000 });
      await page.waitForTimeout(1500);

      const frames = await shoot(page, mod.actions);
      if (frames.length) {
        await buildGif(frames, path.join(OUT_DIR, `${mod.id}.gif`));
      } else {
        console.log('sem frames');
      }
    } catch (err) {
      console.log(`ERRO: ${err.message.split('\n')[0]}`);
    }
  }

  await browser.close();
  console.log('\n✅ Concluído!');
  console.log(`📁 GIFs em: ${OUT_DIR}`);
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
