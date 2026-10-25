/* Document library and reader. Real town files, rebuilt as web pages. */

function dcState() {
  if (!U.v.docs) U.v.docs = { q: '', type: 'all', cache: {}, loading: {}, failed: {}, lastReq: '', speaking: false, conv: null };
  return U.v.docs;
}

function dcIndex() { return typeof DOC_INDEX !== 'undefined' ? DOC_INDEX : []; }

/* Converted uploads from Town Desk live in S.docs and join the real list. */
function dcAll() {
  var out = dcIndex().slice();
  (S.docs || []).forEach(function (d) {
    if (d.converted) out.unshift({ id: d.id, title: d.title, type: d.type, year: (d.date || '').slice(0, 4), url: '', pages: d.pages || 1, words: d.words || 0, scanned: !!d.scanned, summary: d.summary || '', exampleOf: d.exampleOf || '', isNew: true, date: d.date });
  });
  return out;
}

function dcFind(id) {
  var all = dcAll();
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
}

function dcFormId(d) {
  if (d.formId) return d.formId;
  return (typeof FORM_BY_URL !== 'undefined' && d.url && FORM_BY_URL[d.url]) || '';
}

function dcKind(url) {
  if (/\.docx?$/i.test(url)) return 'word';
  if (/\.xlsx?$/i.test(url)) return 'excel';
  if (/\.(png|jpe?g|gif)$/i.test(url)) return 'image';
  return 'pdf';
}

function dcTypeWord(type) { return t('dc_type_' + (PB_DOC_TYPES.indexOf(type) === -1 ? 'other' : type)); }

function dcPagesWord(n) { return n === 1 ? t('dr_page_one') : t('dr_pages', { n: n }); }

function dcTags(d) {
  var tags = '';
  if (d.isNew) tags += '<span class="tag tag-pine">' + icon('star') + t('dr_new_tag') + '</span>';
  if (d.scanned) tags += '<span class="tag tag-gold">' + icon('warn') + t('dr_scanned_tag') + '</span>';
  else if (d.ocr) tags += '<span class="tag tag-muted">' + t('dr_ocr_tag') + '</span>';
  return tags;
}

/* Loading one document’s block JSON, relative to the page. */
function dcLoad(id, done) {
  var st = dcState();
  if (st.cache[id] || st.failed[id] || st.loading[id]) return;
  if (typeof fetch !== 'function') { st.failed[id] = true; done(); return; }
  st.loading[id] = true;
  var p;
  try { p = fetch('docs/' + encodeURIComponent(id) + '.json'); } catch (e) { p = Promise.reject(e); }
  p.then(function (r) { if (!r.ok) throw new Error('status'); return r.json(); })
    .then(function (json) { st.cache[id] = json && json.blocks ? json : { blocks: [] }; })
    .catch(function () { st.failed[id] = true; })
    .then(function () { delete st.loading[id]; done(); });
}

function dcBlocksHtml(blocks) {
  var html = '', inList = false, seenH2 = false, n = 0;
  function closeList() { if (inList) { html += '</ul>'; inList = false; } }
  blocks.forEach(function (b) {
    if (b.kind === 'li') {
      if (!inList) { html += '<ul>'; inList = true; }
      html += '<li>' + esc(b.text.replace(/^(•|-|\*)\s+/, '')) + '</li>';
      return;
    }
    closeList();
    if (b.kind === 'h2' || b.kind === 'h3') {
      var tag = (b.kind === 'h3' && seenH2) ? 'h3' : 'h2';
      if (tag === 'h2') { seenH2 = true; n++; }
      html += '<' + tag + (tag === 'h2' ? ' id="dc-h-' + n + '"' : '') + '>' + esc(b.text) + '</' + tag + '>';
    } else if (b.kind === 'pre') {
      html += '<pre class="dc-pre">' + esc(b.text) + '</pre>';
    } else {
      html += '<p>' + esc(b.text) + '</p>';
    }
  });
  closeList();
  return html;
}

function dcToc(blocks) {
  var heads = [], seenH2 = false, n = 0;
  blocks.forEach(function (b) {
    if (b.kind === 'h2' || (b.kind === 'h3' && !seenH2)) { seenH2 = true; n++; heads.push({ n: n, text: b.text }); }
  });
  if (heads.length < 3) return '';
  return '<nav class="dc-toc" aria-labelledby="dc-toc-h"><h2 id="dc-toc-h" class="h3">' + t('dr_on_page') + '</h2><ol>' +
    heads.slice(0, 40).map(function (h) { return '<li><a href="#dc-h-' + h.n + '">' + esc(h.text) + '</a></li>'; }).join('') + '</ol></nav>';
}

function dcPlainText(d, json) {
  var parts = [d.title];
  if (json && json.blocks && json.blocks.length) json.blocks.forEach(function (b) { parts.push(b.text); });
  else if (d.summary) parts.push(d.summary);
  return parts.join('. ');
}

function dcSiblings(d) {
  var same = dcAll().filter(function (x) { return x.type === d.type; });
  var i = -1;
  same.forEach(function (x, k) { if (x.id === d.id) i = k; });
  return { prev: i > 0 ? same[i - 1] : null, next: i >= 0 && i < same.length - 1 ? same[i + 1] : null };
}

function dcAccBtn(d, cls) {
  return '<button type="button" class="btn ' + (cls || 'btn-sm') + '" data-act="dcAccessible" data-id="' + esc(d.id) + '" data-title="' + esc(d.title) + '">' + icon('access') + t('dr_request_acc') + '</button>';
}

function dcDownload(d, short) {
  if (!d.url) return '';
  var kind = t('dr_kind_' + dcKind(d.url));
  return extLink(d.url, t(short ? 'dr_download_short' : 'dr_download', { kind: kind }), 'btn btn-sm');
}

/* Reader */
views.doc = {
  section: 'government',
  title: function (arg) { var d = dcFind(arg); return d ? d.title : t('dr_not_found'); },
  render: function (arg) {
    var d = dcFind(arg);
    if (!d) {
      return pageHead({ crumbs: [['home', t('nav_home')], ['documents', t('dc_title')]], title: t('dr_not_found') }) +
        '<div class="wrap"><p>' + link('documents', '', t('dr_back'), 'btn btn-primary') + '</p></div>';
    }
    var st = dcState();
    var formId = dcFormId(d);
    var tools = '<div class="dc-toolbar cluster" role="group" aria-label="' + esc(t('dr_file')) + '">' +
      dcDownload(d) +
      (canSpeak() ? '<button type="button" class="btn btn-sm" data-act="dcSpeak" data-id="' + esc(d.id) + '" aria-pressed="' + (st.speaking ? 'true' : 'false') + '">' + icon(st.speaking ? 'stop' : 'sound') + (st.speaking ? t('dr_stop_aloud') : t('dr_read_aloud')) + '</button>' : '') +
      (formId ? link('form', formId, icon('edit') + t('dr_fill_online'), 'btn btn-sm btn-primary') : '') +
      dcAccBtn(d) + '</div>';
    var meta = '<p class="dc-meta small muted cluster"><span>' + dcTypeWord(d.type) + '</span>' + (d.year ? '<span>' + esc(d.year) + '</span>' : '') +
      '<span>' + dcPagesWord(d.pages || 1) + '</span>' + (d.words ? '<span>' + t('dr_words', { n: d.words.toLocaleString(lang() === 'es' ? 'es' : 'en-US') }) + '</span>' : '') +
      '<span>' + t('dr_kind_' + dcKind(d.url || '.pdf')) + '</span></p>' +
      (dcTags(d) ? '<p class="cluster dc-tags">' + dcTags(d) + '</p>' : '');
    var sib = dcSiblings(d);
    var pager = (sib.prev || sib.next) ? '<nav class="dc-pager" aria-label="' + esc(t('dr_more_type', { type: dcTypeWord(d.type) })) + '">' +
      (sib.prev ? link('doc', sib.prev.id, '<span class="small muted">' + icon('back') + t('dr_prev') + '</span><span class="dc-pager-title">' + esc(sib.prev.title) + '</span>', 'dc-pager-link') : '<span></span>') +
      (sib.next ? link('doc', sib.next.id, '<span class="small muted">' + t('dr_next') + icon('arrow') + '</span><span class="dc-pager-title">' + esc(sib.next.title) + '</span>', 'dc-pager-link dc-pager-next') : '') + '</nav>' : '';
    return pageHead({ crumbs: [['home', t('nav_home')], ['government', t('nav_government')], ['documents', t('dc_title')]], eyebrow: dcTypeWord(d.type) + (d.year ? ', ' + d.year : ''), title: d.title }) +
      '<div class="wrap dc-reader">' + meta + tools +
      '<p class="small muted dc-official">' + icon('info') + ' ' + t('dr_official') + (d.ocr ? ' ' + t('dr_ocr_note') : '') + '</p>' +
      (lang() === 'es' ? '<p class="callout small">' + t('only_english') + '</p>' : '') +
      '<p class="dc-status" role="status" data-part="dcStatus">' + parts.dcStatus() + '</p>' +
      '<div data-part="dcBody">' + parts.dcBody() + '</div>' +
      pager + '<p class="dc-back">' + link('documents', '', icon('back') + t('dr_back'), 'btn btn-ghost') + '</p>' +
      humanStrip() + '</div>';
  },
  after: function (arg) {
    var d = dcFind(arg);
    if (!d || d.scanned) return;
    var id = d.exampleOf || d.id;
    dcLoad(id, function () { if (U.route.view === 'doc' && U.route.arg === arg) refresh('dcBody'); });
  }
};

parts.dcStatus = function () {
  var st = dcState();
  return st.lastReq ? t('dr_acc_sent', { ref: st.lastReq }) : '';
};

parts.dcBody = function () {
  var d = dcFind(U.route.arg);
  if (!d) return '';
  var st = dcState();
  if (d.scanned) {
    return '<div class="callout callout-gold dc-scanned">' + icon('warn', 'ico-lg') + '<div><h2 class="h3">' + t('dr_scanned_h') + '</h2><p>' + t('dr_scanned_p') + '</p>' +
      '<p class="cluster">' + dcAccBtn(d, '') + dcDownload(d, true) + '</p></div></div>';
  }
  var id = d.exampleOf || d.id;
  var json = st.cache[id];
  if (json) {
    var blocks = json.blocks || [];
    if (!blocks.length) return '<p class="empty" role="status">' + t('dr_no_text') + '</p>';
    return (d.exampleOf ? '<p class="cluster"><span class="tag tag-gold">' + t('dr_example_tag') + '</span></p>' : '') +
      dcToc(blocks) + '<div class="prose dc-prose" lang="en">' + dcBlocksHtml(blocks) + '</div>' +
      (json.note ? '<p class="small muted dc-note">' + t('dr_shortened') + '</p>' : '');
  }
  if (st.failed[id]) {
    return '<div class="dc-fallback"><p class="small muted">' + t('dr_offline') + '</p>' +
      (d.summary ? '<div class="prose dc-prose" lang="en"><p>' + esc(d.summary) + '</p></div>' : '') +
      '<p class="cluster">' + dcDownload(d) + '</p></div>';
  }
  return '<p class="dc-loading" role="status">' + t('dr_loading') + '</p>';
};

on.click.dcSpeak = function (el) {
  var st = dcState();
  if (st.speaking) { stopSpeaking(); st.speaking = false; announce(t('dr_stopped')); rerender(); return; }
  var d = dcFind(el.getAttribute('data-id'));
  if (!d) return;
  st.speaking = true;
  speak(dcPlainText(d, st.cache[d.exampleOf || d.id]));
  announce(t('dr_reading'));
  rerender();
};

on.click.dcAccessible = function (el) {
  var title = el.getAttribute('data-title');
  // Same clock as a records request: 5 working days, as the Routing screen promises.
  var tk = openTicket({ cat: 'accessible', source: 'accessible', text: 'Accessible copy requested: ' + title, where: title, due: parseISO(workingDaysAfter(todayISO(), 5)).getTime() });
  dcState().lastReq = tk.ref;
  refresh('dcStatus');
  toast(t('dr_acc_sent', { ref: tk.ref }), 'ok');
};

/* Library. Replaces the earlier documents view; same house look. */
function dcSampleTarget(d) {
  if (d.id === 'd5') return ['form', 'business-license'];
  if (d.id === 'd6') return ['form', 'zoning-permit'];
  if (d.id === 'd7') return ['form', 'water-service'];
  if (d.id === 'd12') return ['records', ''];
  return ['services', ''];
}

function dcRow(d) {
  var formId = dcFormId(d);
  var meta = '<span>' + dcTypeWord(d.type) + '</span>' + (d.year ? '<span>' + esc(d.year) + '</span>' : '') +
    '<span>' + dcPagesWord(d.pages || 1) + '</span>' + (d.words ? '<span>' + t('dr_words', { n: d.words.toLocaleString(lang() === 'es' ? 'es' : 'en-US') }) + '</span>' : '');
  return '<li class="dc-row"><span class="dc-row-ico">' + icon(d.type === 'form' ? 'edit' : d.type === 'map' ? 'pin' : 'doc', 'ico-lg') + '</span>' +
    '<div class="dc-row-body"><p class="dc-row-title">' + link('doc', d.id, esc(d.title)) + '</p>' +
    '<p class="small muted cluster dc-row-meta">' + meta + '</p>' +
    (d.summary ? '<p class="small dc-row-sum" lang="en">' + esc(d.summary) + '</p>' : '') +
    (dcTags(d) ? '<p class="cluster dc-tags">' + dcTags(d) + '</p>' : '') + '</div>' +
    '<div class="dc-row-actions">' + link('doc', d.id, icon('eye') + t('dr_read_online'), 'btn btn-sm btn-primary') + dcDownload(d, true) +
    (formId ? link('form', formId, icon('edit') + t('dr_fill_online'), 'btn btn-sm') : '') + dcAccBtn(d) + '</div></li>';
}

function dcSampleRow(d) {
  var target = dcSampleTarget(d);
  return '<li class="dc-row"><span class="dc-row-ico">' + icon(d.type === 'form' ? 'edit' : 'doc', 'ico-lg') + '</span>' +
    '<div class="dc-row-body"><p class="dc-row-title"><span>' + esc(d.title) + '</span></p>' +
    '<p class="small muted cluster dc-row-meta"><span>' + dcTypeWord(d.type) + '</span><span>' + esc(fmtDate(d.date, 'short')) + '</span><span>' + esc(d.size) + '</span></p>' +
    '<p class="cluster dc-tags">' + sampleTag() + (d.scanned ? '<span class="tag tag-gold">' + icon('warn') + t('dr_scanned_tag') + '</span>' : '') + '</p></div>' +
    '<div class="dc-row-actions">' + (d.online ? link(target[0], target[1], icon('edit') + t('dr_fill_online'), 'btn btn-sm btn-primary') : '') +
    '<button type="button" class="btn btn-sm" data-act="dcAccessible" data-id="' + esc(d.id) + '" data-title="' + esc(d.title) + '">' + icon('access') + t('dr_request_acc') + '</button></div></li>';
}

views.documents = {
  section: 'government',
  title: function () { return t('dc_title'); },
  render: function () {
    var st = dcState();
    var all = dcAll();
    var counts = {};
    all.forEach(function (d) { var k = PB_DOC_TYPES.indexOf(d.type) === -1 ? 'other' : d.type; counts[k] = (counts[k] || 0) + 1; });
    var chips = '<button type="button" class="chip" data-act="dcType" data-val="all" aria-pressed="' + (st.type === 'all' ? 'true' : 'false') + '">' + t('dc_all') + ' <span class="dc-count">' + all.length + '</span></button>' +
      PB_DOC_TYPES.filter(function (k) { return counts[k]; }).map(function (k) {
        return '<button type="button" class="chip" data-act="dcType" data-val="' + k + '" aria-pressed="' + (st.type === k ? 'true' : 'false') + '">' + t('dc_type_' + k) + ' <span class="dc-count">' + counts[k] + '</span></button>';
      }).join('');
    var samples = (S.docs || []).filter(function (d) { return !d.converted; });
    return pageHead({ crumbs: [['home', t('nav_home')], ['government', t('nav_government')]], eyebrow: t('dc_eyebrow'), title: t('dc_title'), lead: t('dr_lead') }) +
      '<div class="wrap"><div class="split dc-lib">' +
      '<aside class="side dc-side"><div class="field"><label for="dc-q">' + t('dc_search') + '</label><input class="input" type="search" id="dc-q" value="' + esc(st.q) + '" data-input="dcSearch" autocomplete="off" aria-describedby="dc-q-hint"><p class="hint" id="dc-q-hint">' + t('dr_search_hint') + '</p></div>' +
      '<div role="group" aria-label="' + esc(t('dc_filter_type')) + '" class="dc-chips">' + chips + '</div>' +
      '<div class="callout small"><p><strong>' + t('dc_legend_h') + '</strong></p><p>' + t('dr_legend_real') + '</p><p><span class="tag tag-gold">' + icon('warn') + t('dr_scanned_tag') + '</span> ' + t('dr_legend_scanned') + '</p><p>' + sampleTag() + ' ' + t('dc_legend_sample') + '</p></div></aside>' +
      '<div class="main"><div data-part="dcList">' + parts.dcList() + '</div>' +
      '<p class="dc-status" role="status" data-part="dcStatus">' + parts.dcStatus() + '</p>' +
      (samples.length ? '<section class="section dc-samples" aria-labelledby="dc-samples-h"><div class="section-head"><h2 id="dc-samples-h">' + t('dr_sample_h') + '</h2>' + sampleTag() + '</div><p class="small muted">' + t('dr_sample_p') + '</p><ul class="plain dc-list">' + samples.map(dcSampleRow).join('') + '</ul></section>' : '') +
      '<div class="callout callout-pine dc-acc-note"><p><strong>' + t('dc_acc_h') + '</strong> ' + t('dc_acc_p') + ' ' + link('accessibility', '', t('dc_acc_link')) + '</p></div>' +
      humanStrip() + '</div></div></div>';
  }
};

parts.dcList = function () {
  var st = dcState();
  var q = (st.q || '').trim().toLowerCase();
  var list = dcAll().filter(function (d) {
    var k = PB_DOC_TYPES.indexOf(d.type) === -1 ? 'other' : d.type;
    return (st.type === 'all' || k === st.type) && (!q || d.title.toLowerCase().indexOf(q) !== -1 || (d.summary || '').toLowerCase().indexOf(q) !== -1);
  });
  if (!list.length) return '<p class="empty" role="status">' + t('dc_none') + '</p>';
  var minutes = list.filter(function (d) { return d.type === 'minutes'; });
  var rest = list.filter(function (d) { return d.type !== 'minutes'; });
  var html = '<p class="small muted" role="status">' + t('dr_count_real', { n: list.length }) + '</p>';
  if (rest.length) html += '<ul class="plain dc-list">' + rest.map(dcRow).join('') + '</ul>';
  if (minutes.length) {
    var byYear = {};
    minutes.forEach(function (d) { var y = d.year || '—'; (byYear[y] = byYear[y] || []).push(d); });
    html += Object.keys(byYear).sort().reverse().map(function (y) {
      return '<section class="dc-year" aria-labelledby="dc-y-' + esc(y) + '"><h2 id="dc-y-' + esc(y) + '" class="h3">' + t('dc_minutes_year', { year: y }) + '</h2><ul class="plain dc-list">' + byYear[y].map(dcRow).join('') + '</ul></section>';
    }).join('');
  }
  return html;
};

on.click.dcType = function (el) { dcState().type = el.getAttribute('data-val'); rerender(); };
on.input.dcSearch = function (el) { dcState().q = el.value; refresh('dcList'); };

/* Town Desk: the upload flow, added under the existing documents screen. */
var DC_EXAMPLE_ID = 'september-14-2026-town-council-meeting-minutes';

function dcTitleFromName(name) {
  var s = String(name || '').replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return s.replace(/\b([A-Za-z])([A-Za-z]*)/g, function (m, a, b) {
    if (b.length > 1 && b === b.toUpperCase()) return a.toUpperCase() + b.toLowerCase();
    return a.toUpperCase() + b;
  });
}

function dcGuessType(title) {
  var s = title.toLowerCase();
  if (/minutes|mintues|hearing/.test(s)) return 'minutes';
  if (/ordinance|chapter|charter/.test(s)) return 'ordinance';
  if (/budget|rate/.test(s)) return 'budget';
  if (/application|form|survey|permit/.test(s)) return 'form';
  if (/report|plan|summary/.test(s)) return 'report';
  if (/map/.test(s)) return 'map';
  return 'notice';
}

var dcOrigDocs = desk.deskdocs;
desk.deskdocs = {
  title: dcOrigDocs.title,
  render: function (a) {
    var st = dcState();
    var c = st.conv;
    var pick = '<form data-form="dcConvert" class="stack" novalidate>' +
      '<div class="field"><label for="dc-file">Choose a PDF from the town’s files</label><input class="input dc-file" type="file" id="dc-file" name="file" accept=".pdf,application/pdf" data-change="dcPick" aria-describedby="dc-file-hint"><p class="hint" id="dc-file-hint">Nothing is uploaded anywhere in this demo. The file is read in your browser only.</p>' +
      (c && c.err ? '<p class="err" role="alert">' + esc(c.err) + '</p>' : '') + '</div>' +
      '<p><button type="submit" class="btn btn-primary">' + icon('upload') + 'Convert</button></p></form>';
    var result = '<div data-part="dcConvResult">' + parts.dcConvResult() + '</div>';
    var how = '<p class="small muted">On the finished site, staff upload a PDF and the system pulls out the text, finds the headings and lists, and shows a draft page for review. When staff approve it, the page goes live with the PDF kept as the official download.</p>';
    return dcOrigDocs.render(a) + '<div class="dc-convert">' + tdCard('Turn a PDF into a web page', how + pick + result) + '</div>';
  },
  after: dcOrigDocs.after
};

parts.dcConvResult = function () {
  var st = dcState();
  var c = st.conv;
  if (!c || !c.name) return '';
  if (c.pending) return '<p class="small muted" role="status">Checking ' + esc(c.name) + '…</p>';
  var json = st.cache[DC_EXAMPLE_ID];
  var verdict = c.scanned ?
    '<div class="callout callout-gold td-result">' + icon('warn', 'ico-lg') + '<div><p><strong>Looks like a scanned image.</strong> Few or no fonts were found inside the file, so there is no text to build a page from.</p><p class="small">You can still publish it. The public page will say it is scanned and offer a readable copy on request. Better: export the PDF again from the original document, or run OCR.</p></div></div>' :
    '<div class="callout callout-pine td-result">' + icon('check', 'ico-lg') + '<div><p><strong>Readable text found.</strong> The file carries real text, so the page can be built from it.</p><p class="small">Headings, paragraphs and lists are detected from the layout. Review the draft below, fix anything odd, then publish.</p></div></div>';
  var preview = '';
  if (!c.scanned) {
    if (json) preview = '<div class="dc-preview"><p class="cluster"><span class="tag tag-gold">Example output</span><span class="small muted">Shown from a real converted document so you can see the shape of a page.</span></p><div class="prose dc-prose dc-preview-body" lang="en">' + dcBlocksHtml(json.blocks.slice(0, 14)) + '</div></div>';
    else if (st.failed[DC_EXAMPLE_ID]) preview = '<p class="small muted">The example page text loads when the demo is served from its site.</p>';
    else preview = '<p class="small muted" role="status">Building the preview…</p>';
  }
  var facts = '<dl class="kicker-list dc-facts"><dt>File</dt><dd>' + esc(c.name) + ' (' + esc(c.sizeWord) + ')</dd><dt>Title</dt><dd>' + esc(c.title) + '</dd><dt>Type</dt><dd>' + esc(c.type) + '</dd><dt>Pages</dt><dd>about ' + c.pages + '</dd></dl>';
  var publish = c.published ? '<p class="callout callout-pine small">Published. ' + link('doc', c.published, 'See the public page') + '.</p>' :
    '<p><button type="button" class="btn btn-primary" data-act="dcPublish">' + icon('check') + 'Publish page</button></p>';
  return '<div class="stack dc-conv-out">' + verdict + facts + preview + publish + '</div>';
};

on.change.dcPick = function (el) {
  var f = el.files && el.files[0];
  var st = dcState();
  if (!f) { st.conv = null; refresh('dcConvResult'); return; }
  var reader = new FileReader();
  reader.onload = function () {
    var bytes = new Uint8Array(reader.result || []);
    var head = '', fonts = 0, images = 0, i;
    for (i = 0; i < Math.min(8, bytes.length); i++) head += String.fromCharCode(bytes[i]);
    var text = '', end = Math.min(bytes.length, 3 * 1024 * 1024);
    for (i = 0; i < end; i += 1) text += String.fromCharCode(bytes[i]);
    fonts = (text.match(/\/Font\b/g) || []).length;
    images = (text.match(/\/Image\b/g) || []).length;
    var pages = (text.match(/\/Type\s*\/Page\b/g) || []).length || 1;
    var scanned = head.indexOf('%PDF') === 0 ? (fonts === 0 || (images >= pages && fonts < 2 && f.size > 300000)) : true;
    var title = dcTitleFromName(f.name);
    st.conv = { name: f.name, size: f.size, sizeWord: f.size > 1048576 ? (f.size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(f.size / 1024)) + ' KB', title: title, type: dcGuessType(title), pages: pages, scanned: scanned, isPdf: head.indexOf('%PDF') === 0, ready: false };
    refresh('dcConvResult');
  };
  reader.onerror = function () { st.conv = { err: 'The file could not be read. Try another PDF.' }; rerender(); };
  st.conv = { name: f.name, pending: true };
  reader.readAsArrayBuffer(f);
};

on.submit.dcConvert = function (form) {
  var st = dcState();
  var input = form.elements.file;
  if (!input || !input.files || !input.files.length) {
    st.conv = { err: 'Choose a PDF first.' };
    rerender();
    var el = document.getElementById('dc-file');
    if (el) el.focus();
    return;
  }
  if (!st.conv || st.conv.err || st.conv.pending) { on.change.dcPick(input); return; }
  st.conv.err = '';
  if (!st.conv.scanned) dcLoad(DC_EXAMPLE_ID, function () { refresh('dcConvResult'); });
  rerender();
  toast(st.conv.scanned ? 'Checked. This PDF is a scanned image.' : 'Converted. Review the draft page below.', st.conv.scanned ? 'warn' : 'ok');
  var out = document.querySelector('[data-part="dcConvResult"] .td-result');
  if (out) { out.setAttribute('tabindex', '-1'); out.focus(); }
};

on.click.dcPublish = function () {
  var st = dcState();
  var c = st.conv;
  if (!c || !c.name || c.pending) return;
  var ex = st.cache[DC_EXAMPLE_ID];
  var summary = '';
  if (ex && !c.scanned) {
    var words = [];
    ex.blocks.forEach(function (b) { if (b.kind === 'p' && words.length < 40) words = words.concat(b.text.split(' ')); });
    summary = words.slice(0, 40).join(' ');
  }
  var id = 'c' + Date.now();
  S.docs.unshift({ id: id, title: c.title, type: c.type, date: todayISO(), scanned: !!c.scanned, online: false, size: 'PDF, ' + c.sizeWord + (c.scanned ? ' (scanned)' : ''), retention: pbRetention(c.type), converted: true, pages: c.pages, words: c.scanned ? 0 : (ex ? ex.words : 0), summary: summary, exampleOf: c.scanned ? '' : DC_EXAMPLE_ID });
  logAct('Published web page from PDF: ' + c.title + (c.scanned ? ' (scanned, flagged)' : ''));
  save();
  c.published = id;
  rerender();
  toast('Published. The page is on the public Documents list now, marked “New”.', 'ok');
};
