/* Shared jsdom harness for the testers. Usage:
   const { boot } = require('./harness');
   const app = boot();            // fresh page at #home with the notice dismissed
   app.visit('services-report');  // route and return the document
   app.toggleLang();
   app.errors                     // uncaught errors so far
*/
var fs = require('fs');
var path = require('path');
var root = require('child_process').execSync('npm root -g').toString().trim();
var JSDOM = require(path.join(root, 'jsdom')).JSDOM;

function boot(opts) {
  opts = opts || {};
  var html = fs.readFileSync(path.join(__dirname, '..', 'dist', 'keysville-demo.html'), 'utf8');
  var errors = [];
  var vc = new (require(path.join(root, 'jsdom')).VirtualConsole)();
  vc.on('jsdomError', function (e) { if (!/scrollTo|Not implemented/.test(String(e && e.message))) errors.push(String(e && e.message || e)); });
  var dom = new JSDOM('<!doctype html><html><head></head><body>' + html + '</body></html>', {
    runScripts: 'dangerously', url: 'https://demo.test/#' + (opts.route || 'home'), pretendToBeVisual: true, virtualConsole: vc
  });
  var w = dom.window, d = w.document;
  w.addEventListener('error', function (e) { errors.push(String(e.message || e.error)); });
  w.scrollTo = function () {};
  w.Element.prototype.scrollIntoView = function () {};
  function flush() { return new Promise(function (r) { setTimeout(r, 0); }); }
  var app = {
    window: w, document: d, errors: errors, dom: dom,
    visit: function (route) {
      w.location.hash = '#' + route;
      w.dispatchEvent(new w.Event('hashchange'));
      return d;
    },
    click: function (sel) { var el = d.querySelector(sel); if (!el) throw new Error('no element ' + sel); el.click(); return el; },
    toggleLang: function () { return app.click('[data-act=toggleLang]'); },
    submit: function (formSel, values) {
      var f = d.querySelector(formSel); if (!f) throw new Error('no form ' + formSel);
      Object.keys(values || {}).forEach(function (k) {
        var el = f.elements[k]; if (!el) return;
        if (el.type === 'checkbox') el.checked = !!values[k];
        else if (el.type === 'radio' || (el.length && el[0] && el[0].type === 'radio')) { Array.prototype.forEach.call(el.length ? el : [el], function (r) { r.checked = r.value === values[k]; }); }
        else el.value = values[k];
      });
      f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
      return f;
    },
    text: function () { return d.body.textContent; },
    flush: flush
  };
  var ok = d.querySelector('[data-act=noticeOk]');
  if (ok && !opts.keepNotice) ok.click();
  return app;
}

var PUBLIC_ROUTES = ['home', 'deals', 'bizlogin', 'help', 'ask', 'track', 'track-K-1048', 'status', 'services', 'services-report', 'water', 'water-service', 'records', 'towncounty',
  'meetings', 'meeting-m-2026-11-09', 'meeting-m-2026-09-14', 'government', 'government-notices', 'living', 'trash', 'streets', 'parks', 'newhere', 'newhere-schools', 'business', 'biz-pinos-pizza', 'biz-wilsons-funeral-home',
  'documents', 'doc-september-14-2026-town-council-meeting-minutes', 'doc-chapter-3-animals', 'doc-zoning-permit-application', 'forms', 'form-zoning-permit', 'form-business-license', 'form-water-service', 'calendar', 'news', 'news-signup', 'contact', 'contact-callback', 'search', 'accessibility', 'accessibility-report', 'accessibility-request',
  'history', 'community', 'visit', 'visit-eat', 'visit-stay', 'visit-outdoors', 'visit-history', 'visit-events', 'visit-getting-here', 'visit-plan', 'legal-privacy', 'legal-cookies', 'legal-foia', 'legal-nondiscrimination', 'legal-language', 'legal-terms', 'legal-records', 'legal-security', 'legal-comment', 'legal-about', 'protect', 'sitemap', 'billing', 'taxes', 'emergency', 'next', 'onepager', 'nosuchpage'];
var DESK_ROUTES = ['desk', 'deskhelp', 'deskforms', 'deskalerts', 'deskmeetings', 'deskevents', 'deskdocs', 'deskanswers', 'deskbiz', 'deskrouting', 'desksecurity', 'desklog', 'deskguide'];

function signIn(app) {
  app.visit('desklogin');
  app.submit('form[data-form=deskLogin1]', { user: 'clerk@keysvilleva.gov', pass: 'x' });
  app.submit('form[data-form=deskLogin2]', { code: '482 913' });
  return app;
}

module.exports = { boot: boot, PUBLIC_ROUTES: PUBLIC_ROUTES, DESK_ROUTES: DESK_ROUTES, signIn: signIn };
