// Screenshot harness for the UX pass. Run: node review/shoot2.js [routes...|group]
// Saves review/shots2/<route>-<w>[-suffix].png (first screen) and -full.png (whole page, capped).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'shots2');
fs.mkdirSync(out, { recursive: true });
const html = fs.readFileSync(path.join(root, 'dist/keysville-demo.html'), 'utf8');
const wrapper = path.join(__dirname, 'wrapper2.html');
fs.writeFileSync(wrapper, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + html + '</body></html>');

const PUBLIC = ['home', 'help', 'ask', 'services', 'water', 'records', 'meetings', 'meeting-m-2026-11-10', 'government', 'living', 'trash', 'parks', 'newhere', 'business', 'biz-pinos-pizza', 'deals', 'documents', 'doc-town-charter', 'forms', 'form-water-service', 'calendar', 'news', 'contact', 'search', 'accessibility', 'history', 'community', 'visit', 'visit-plan', 'protect', 'legal-about', 'status', 'track-K-1048'];
const DESK = ['desk', 'deskhelp', 'deskforms', 'deskalerts', 'deskmeetings', 'deskevents', 'deskdocs', 'deskanswers', 'deskbiz', 'deskdeals', 'deskrouting', 'desksecurity', 'desklog', 'deskguide'];
const BIZ = ['bizlogin', 'bizdesk', 'bizlisting', 'bizhours', 'bizoffers', 'bizevents', 'bizphotos', 'bizinsights', 'bizhelp'];
const argv = process.argv.slice(2);
const groups = { public: PUBLIC, desk: DESK, biz: BIZ };
const only = argv.filter((a) => !groups[a] && !['a11y', 'dark', 'es', 'flows'].includes(a));
const wantGroup = (g) => argv.includes(g) || (!argv.length);
const pick = (list, g) => only.length ? list.filter((r) => only.includes(r)) : (wantGroup(g) ? list : []);
const wantExtra = (k) => !argv.length || argv.includes(k);

async function load(page, w, h, opts = {}) {
  await page.setViewportSize({ width: w, height: h });
  await page.emulateMedia({ colorScheme: opts.dark ? 'dark' : 'light' });
  await page.goto('file://' + wrapper);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
  await page.waitForSelector('#app *');
  const ok = await page.$('[data-act=noticeOk]');
  if (ok) await ok.click();
  if (opts.cls) await page.evaluate((c) => { document.documentElement.className += ' ' + c; }, opts.cls);
}
async function goRoute(page, r) {
  await page.evaluate((r) => { location.hash = r; }, r);
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 0));
}
async function shoot(page, name, w, suffix) {
  const base = path.join(out, name + '-' + w + (suffix || ''));
  await page.screenshot({ path: base + '.png', fullPage: false });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  if (h > page.viewportSize().height + 40) {
    await page.screenshot({ path: base + '-full.png', fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(h, 5200) } });
  }
}
async function login(page) {
  await goRoute(page, 'desklogin');
  await page.fill('#li-user', 'clerk@keysvilleva.gov');
  await page.click('form[data-form=deskLogin1] button[type=submit]');
  await page.waitForTimeout(200);
  await page.click('form[data-form=deskLogin2] button[type=submit]');
  await page.waitForTimeout(300);
}
async function bizLogin(page) {
  await goRoute(page, 'bizlogin');
  await page.fill('#bl-filter', 'Pino');
  await page.waitForTimeout(150);
  await page.selectOption('#bl-biz', 'pinos-pizza');
  await page.fill('#bl-email', 'owner@example.com');
  await page.click('form[data-form=bdLogin1] button[type=submit]');
  await page.waitForTimeout(200);
  await page.click('form[data-form=bdLogin2] button[type=submit]');
  await page.waitForTimeout(200);
  if (await page.$('#cl-owner')) {
    await page.fill('#cl-owner', 'Sample Owner');
    await page.fill('#cl-phone', '434-555-0100');
    await page.check('#cl-attest');
    await page.click('form[data-form=bdClaim] button[type=submit]');
    await page.waitForTimeout(300);
  }
}

(async () => {
  const browser = await chromium.launch();
  const sizes = [[390, 844], [768, 1024], [1440, 900]];
  for (const [w, h] of sizes) {
    const page = await browser.newPage();
    await load(page, w, h);
    for (const r of pick(PUBLIC, 'public')) {
      await goRoute(page, r);
      await shoot(page, r, w);
      if (r === 'form-water-service') {
        const next = await page.$('main button[data-act], main form button[type=submit]');
        if (next) { await next.click(); await page.waitForTimeout(200); await page.evaluate(() => window.scrollTo(0, 0)); await shoot(page, r + '-step2', w); }
      }
    }
    if (pick(DESK, 'desk').length) {
      await login(page);
      await shoot(page, 'desk-afterlogin', w);
      for (const r of pick(DESK, 'desk')) {
        await goRoute(page, r);
        await shoot(page, r, w);
        if (r === 'deskhelp') {
          const row = await page.$('main [data-act=openTicket], main [data-act=tdOpen], main [data-act*="icket"], main a[href*="deskhelp-"]');
          if (row) { await row.click(); await page.waitForTimeout(250); await page.evaluate(() => window.scrollTo(0, 0)); await shoot(page, 'deskhelp-ticket', w); }
        }
        if (r === 'desk') {
          const help = await page.$('[data-act=deskHelpMe], [data-act=tdHelpMe], [data-act*="elpMe"], button[aria-controls*="help"]');
          if (help) { await help.click(); await page.waitForTimeout(250); await shoot(page, 'desk-helpme', w); await page.keyboard.press('Escape'); }
        }
      }
    }
    if (pick(BIZ, 'biz').length) {
      await goRoute(page, 'bizlogin');
      await shoot(page, 'bizlogin', w);
      await bizLogin(page);
      for (const r of pick(BIZ, 'biz').filter((x) => x !== 'bizlogin')) { await goRoute(page, r); await shoot(page, r, w); }
    }
    await page.close();
  }
  if (wantExtra('a11y')) {
    const page = await browser.newPage();
    await load(page, 390, 844, { cls: 'size-3 hc easy' });
    for (const r of ['home', 'services', 'water', 'deals']) { await goRoute(page, r); await shoot(page, r, 390, '-a11y'); }
    await login(page);
    for (const r of ['desk', 'deskhelp']) { await goRoute(page, r); await shoot(page, r, 390, '-a11y'); }
    await page.close();
  }
  if (wantExtra('dark')) {
    const page = await browser.newPage();
    await load(page, 1440, 900, { dark: true });
    for (const r of ['home', 'services', 'deals', 'forms']) { await goRoute(page, r); await shoot(page, r, 1440, '-dark'); }
    await login(page);
    for (const r of ['desk', 'deskalerts']) { await goRoute(page, r); await shoot(page, r, 1440, '-dark'); }
    await bizLogin(page);
    await goRoute(page, 'bizdesk'); await shoot(page, 'bizdesk', 1440, '-dark');
    await page.close();
  }
  if (wantExtra('es')) {
    const page = await browser.newPage();
    await load(page, 390, 844);
    await page.click('[data-act=toggleLang]');
    await page.waitForTimeout(200);
    for (const r of ['home', 'services', 'water', 'deals', 'forms', 'visit', 'trash']) { await goRoute(page, r); await shoot(page, r, 390, '-es'); }
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const r of ['home', 'deals', 'bizlogin']) { await goRoute(page, r); await shoot(page, r, 1440, '-es'); }
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
