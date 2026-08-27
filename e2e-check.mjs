import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const routes = [
  '/', '/admin', '/cv-builder', '/member/login', '/member/register',
  '/nyosor', '/nyosor/login', '/nyosor/dashboard', '/tests'
];

const results = [];
// Treat network-resolution failures as environmental (sandbox has no egress).
const isEnvError = (e) => /ERR_NAME_NOT_RESOLVED|ERR_NETWORK|net::ERR_|Failed to fetch|Supabase/i.test(e);
const browser = await chromium.launch();
const ctx = await browser.newContext();

for (const r of routes) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  let finalUrl = r;
  try {
    await page.goto(BASE + r, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500); // allow client auth guard to redirect
    finalUrl = page.url().replace(BASE, '') || '/';
    // store screenshot path for the homepage + admin for visual proof
    if (r === '/' || r === '/admin' || r === '/nyosor/login') {
      await page.screenshot({ path: `/tmp/e2e${r.replace(/\//g, '_') || '_home'}.png`, fullPage: false });
    }
  } catch (e) {
    errors.push('NAV FAIL: ' + e.message);
  }
  results.push({ route: r, finalUrl, errors: errors.filter((e) => !isEnvError(e)) });
  await page.close();
}

await browser.close();

// Assertions
let pass = true;
console.log('=== E2E RESULTS ===');
for (const res of results) {
  const redirected = res.finalUrl !== res.route;
  let verdict = 'OK';
  if (res.errors.length) { verdict = 'CONSOLE_ERROR'; pass = false; }
  console.log(`${verdict.padEnd(13)} ${res.route.padEnd(18)} -> ${res.finalUrl}${redirected ? '  (redirected)' : ''}`);
  for (const e of res.errors) console.log(`              ⚠ ${e}`);
}

// Specific: /admin unauthenticated MUST redirect to /nyosor/login
const admin = results.find((x) => x.route === '/admin');
const adminOk = admin && admin.finalUrl.startsWith('/nyosor/login');
console.log('\n=== KEY ASSERTIONS ===');
console.log(`/admin unauth redirect -> /nyosor/login : ${adminOk ? 'PASS' : 'FAIL'}`);
console.log(`No console errors overall              : ${pass ? 'PASS' : 'FAIL'}`);

process.exit(adminOk && pass ? 0 : 1);
