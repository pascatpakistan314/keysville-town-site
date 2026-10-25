// Screenshot harness for the UI cross-check. Run: node review/shoot.js [routes...]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'shots');
fs.mkdirSync(out, { recursive: true });
const html = fs.readFileSync(path.join(root, 'dist/keysville-demo.html'), 'utf8');
const wrapper = path.join(__dirname, 'wrapper.html');
fs.writeFileSync(wrapper, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + html + '</body></html>');

const PUBLIC = ['home', 'help', 'ask', 'services', 'water', 'records', 'meetings', 'meeting-m-2026-11-10', 'government', 'living', 'documents', 'calendar', 'news', 'contact', 'search', 'accessibility', 'history', 'community', 'legal-privacy', 'status', 'track-K-1048'];
const DESK = ['desk', 'deskhelp', 'deskalerts', 'deskmeetings', 'deskevents', 'deskdocs'];
const only = process.argv.slice(2);
const pick = (list) => only.length ? list.filter((r) => only.includes(r)) : list;

const report = [];

async function load(page, w, h, opts = {}) {
  await page.setViewportSize({ width: w, height: h });
  if (opts.dark) await page.emulateMedia({ colorScheme: 'dark' });
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
}

async function check(page, label) {
  const info = await page.evaluate(() => {
    const de = document.documentElement;
    const iw = window.innerWidth;
    const over = [];
    document.querySelectorAll('#app *').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.width && b.right > iw + 1 && getComputedStyle(el).position !== 'fixed') {
        over.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : '') + ' r=' + Math.round(b.right));
      }
    });
    const hs = [...document.querySelectorAll('main h1,main h2,main h3,main h4')].map((h) => h.tagName + ':' + h.textContent.trim());
    const h1s = hs.filter((x) => x.startsWith('H1'));
    const dupes = hs.filter((x, i) => hs.indexOf(x) !== i);
    const unlabeled = [...document.querySelectorAll('main input:not([type=hidden]),main select,main textarea')].filter((i) => !i.labels || !i.labels.length).filter((i) => !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')).map((i) => i.outerHTML.slice(0, 80));
    const small = [...document.querySelectorAll('#app button,#app a')].filter((el) => { const b = el.getBoundingClientRect(); return b.width && b.height && (b.height < 24 || b.width < 24); }).map((el) => el.tagName + ' ' + el.textContent.trim().slice(0, 30) + ' ' + Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height));
    const quotes = (document.querElementorAll ? [] : []);
    const txt = document.getElementById('main') ? document.getElementById('main').innerText : '';
    const straight = (txt.match(/\w'\w/g) || []).slice(0, 5);
    const tells = (txt.match(/not just|seamless|robust|whether you.re|elevate|empower|unlock|dive in|first line of defense|dream|exceeding|\s—\s/gi) || []).slice(0, 6);
    return { scrollW: de.scrollWidth, iw, over: over.slice(0, 8), h1: h1s.length, dupes: dupes.slice(0, 5), unlabeled: unlabeled.slice(0, 5), small: small.slice(0, 6), straight, tells };
  });
  report.push({ label, ...info });
}

async function shoot(page, r, w, suffix) {
  await goRoute(page, r);
  await check(page, r + '-' + w + (suffix || ''));
  await page.screenshot({ path: path.join(out, r + '-' + w + (suffix || '') + '.png'), fullPage: true });
}

async function login(page) {
  await goRoute(page, 'desklogin');
  await page.fill('#li-user', 'clerk@keysvilleva.gov');
  await page.click('form[data-form=deskLogin1] button[type=submit]');
  await page.waitForTimeout(200);
  await page.click('form[data-form=deskLogin2] button[type=submit]');
  await page.waitForTimeout(300);
}

(async () => {
  const browser = await chromium.launch();
  const sizes = [[390, 844], [768, 1024], [1440, 900]];
  for (const [w, h] of sizes) {
    const page = await browser.newPage();
    await load(page, w, h);
    for (const r of pick(PUBLIC)) await shoot(page, r, w);
    if (pick(DESK).length) {
      await login(page);
      for (const r of pick(DESK)) await shoot(page, r, w);
    }
    await page.close();
  }
  if (!only.length || only.includes('a11y')) {
    const page = await browser.newPage();
    await load(page, 390, 844, { cls: 'size-3 hc easy' });
    for (const r of ['home', 'services', 'meetings']) await shoot(page, r, 390, '-a11y');
    await page.close();
  }
  if (!only.length || only.includes('dark')) {
    const page = await browser.newPage();
    await load(page, 1440, 900, { dark: true });
    for (const r of ['home', 'help']) await shoot(page, r, 1440, '-dark');
    await login(page);
    await shoot(page, 'desk', 1440, '-dark');
    await page.close();
    const pm = await browser.newPage();
    await load(pm, 390, 844, { dark: true });
    for (const r of ['home', 'help']) await shoot(pm, r, 390, '-dark');
    await pm.close();
  }
  if (!only.length || only.includes('es')) {
    const page = await browser.newPage();
    await load(page, 390, 844);
    await page.click('[data-act=toggleLang]');
    await page.waitForTimeout(200);
    for (const r of ['home', 'services', 'water', 'meetings', 'government', 'contact', 'help', 'accessibility', 'calendar', 'documents']) await shoot(page, r, 390, '-es');
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const r of ['home', 'services', 'government']) await shoot(page, r, 1440, '-es');
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'checks.json'), JSON.stringify(report, null, 1));
  for (const r of report) {
    const flags = [];
    if (r.scrollW > r.iw) flags.push('HSCROLL ' + r.scrollW + '>' + r.iw);
    if (r.over.length) flags.push('over: ' + r.over.join(' | '));
    if (r.h1 !== 1) flags.push('h1 count ' + r.h1);
    if (r.dupes.length) flags.push('dupes: ' + r.dupes.join(' | '));
    if (r.unlabeled.length) flags.push('unlabeled: ' + r.unlabeled.join(' | '));
    if (r.small.length) flags.push('small: ' + r.small.join(' | '));
    if (r.straight.length) flags.push("straight ': " + r.straight.join(' '));
    if (r.tells.length) flags.push('tells: ' + r.tells.join(' , '));
    console.log(r.label + (flags.length ? '\n   ' + flags.join('\n   ') : ' ok'));
  }
})().catch((e) => { console.error(e); process.exit(1); });
