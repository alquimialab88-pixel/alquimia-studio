/* Verifica politica-privacidad.html y delete-account.html (fuente EN) contra lang.js */
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Isabel/Documents/Default Project/alquimialab-web';

const langSrc = fs.readFileSync(path.join(ROOT, 'js/lang.js'), 'utf8');
function objAfter(marker) {
  const s = langSrc.indexOf(marker);
  const o = langSrc.indexOf('{', s);
  let d = 0;
  for (let i = o; i < langSrc.length; i++) {
    if (langSrc[i] === '{') d++;
    else if (langSrc[i] === '}') { d--; if (d === 0) return eval('(' + langSrc.slice(o, i + 1).replace(/\/\*[\s\S]*?\*\//g, '') + ')'); }
  }
  return {};
}
const dict = objAfter('var dict = {');
const keys = new Set(Object.keys(dict));
const titles = objAfter('var titles = {');
const descriptions = objAfter('var descriptions = {');
const placeholders = objAfter('var placeholders = {');

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&middot;/g, '·').replace(/&copy;/g, '©').replace(/&nbsp;/g, ' ')
  .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&mdash;/g, '—');

function nodesOf(html) {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<title[\s\S]*?<\/title>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const out = [];
  const re = />([^<]+)</g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const t = decode(m[1]).replace(/\s+/g, ' ').trim();
    if (t) out.push(t);
  }
  return out;
}

const ALLOW_P = new Set([
  '🧪 Alquimia Lab', '▾', 'UX Design', 'Branding', 'Kore', 'Blog', 'ES', '|', 'EN',
  '🔒 GDPR / LOPD', '📧 Email Marketing', '💰 Google AdSense', 'Alquimia Lab',
  'alquimialab-web', 'Isabel Boder', 'alquimialab88@gmail.com', '.', ':', 'Kore App',
  'Firebase (Google)', 'Google AdSense', 'DART', 'Cookies', 'OptOut.org',
  'California Consumer Privacy Act (CCPA)', '"Do Not Sell My Personal Information"',
  'WhatsApp:', '+57 310 410 8483', 'Colombia', 'Legal',
]);
const ALLOW_D = new Set([
  'Alquimia Lab', '▾', 'Kore', 'Blog', 'ES | EN', '\ud83e\uddd8\u200d\u2640\ufe0f',
  '(GDPR/LOPD).', '.', 'Legal',
]);
const ALLOW_PH = new Set(['abc123xyz']);

let fail = 0;
function check(name, ok) {
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + name);
  if (!ok) fail++;
}

const files = [
  ['politica-privacidad.html', ALLOW_P],
  ['delete-account.html', ALLOW_D],
];

for (const [f, allow] of files) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const nodes = nodesOf(html);
  const missing = [...new Set(nodes.filter(t => !keys.has(t) && !allow.has(t)))];
  console.log('== ' + f + ' — nodos: ' + nodes.length + ' | en dict: ' + nodes.filter(t => keys.has(t)).length + ' | allow: ' + nodes.filter(t => allow.has(t)).length);
  if (missing.length === 0) console.log('   sin faltantes ✅');
  missing.forEach(t => console.log('   • ' + t));
  check(f + ' sin faltantes', missing.length === 0);

  const mTitle = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
  const mDesc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
  check(f + ' título traducible', !!titles[mTitle]);
  check(f + ' meta descripción traducible', !!descriptions[mDesc]);

  const phs = [...html.matchAll(/placeholder="([^"]*)"/g)].map(m => m[1]);
  const phMissing = phs.filter(p => !placeholders.hasOwnProperty(p) && !ALLOW_PH.has(p));
  check(f + ' placeholders traducibles (' + phs.length + ')', phMissing.length === 0);
  phMissing.forEach(p => console.log('   • placeholder: ' + p));

  check(f + ' lang="en"', /<html lang="en">/.test(html));
  check(f + ' canonical', new RegExp('rel="canonical" href="https://alquimialab.app/' + f + '"').test(html));
  check(f + ' lang.js', /src="js\/lang\.js"/.test(html));
  check(f + ' divs balanceados', (html.match(/<div/g) || []).length === (html.match(/<\/div>/g) || []).length);
  check(f + ' copyright EN', html.indexOf('Made with calm &amp; coffee') > -1 || html.indexOf('Made with calm & coffee') > -1);
}

const pol = fs.readFileSync(path.join(ROOT, 'politica-privacidad.html'), 'utf8');
check('politica h1 EN', /<h1[^>]*>Privacy Policy<\/h1>/.test(pol));
check('politica sin español residual (Derecho)', pol.indexOf('Derecho de') === -1);
check('politica enlaza delete-account', /href="delete-account\.html"/.test(pol));

const del = fs.readFileSync(path.join(ROOT, 'delete-account.html'), 'utf8');
check('delete form', /<form/.test(del) && /placeholder="your@email\.com"/.test(del));
check('delete sin español residual (¿Qué se elimina)', del.indexOf('¿Qué se elimina?') === -1);
check('delete h2 EN', /What gets deleted\?/.test(del));

console.log(fail === 0 ? '--- TODO OK ---' : '--- FALLOS: ' + fail + ' ---');
process.exit(fail === 0 ? 0 : 1);
