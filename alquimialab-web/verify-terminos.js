// verify-terminos.js — valida terminos.html (i18n + estructura). Uso: node verify-terminos.js
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

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
const titles = objAfter('var titles = {');
const descriptions = objAfter('var descriptions = {');

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&middot;/g, '·').replace(/&copy;/g, '©').replace(/&nbsp;/g, ' ');

const ALLOW = new Set(['🧪 Alquimia Lab', '▾', 'UX Design', 'Branding', 'Kore', 'ES', '|', 'EN',
  'Isabel Boder', 'alquimialab88@gmail.com', 'Google Play', '.', 'WhatsApp:', '+57 310 410 8483',
  'Colombia', 'Legal']);

const html = fs.readFileSync(path.join(ROOT, 'terminos.html'), 'utf8');
const clean = html
  .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<title[\s\S]*?<\/title>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
const nodes = [];
const re = />([^<]+)</g;
let m;
while ((m = re.exec(clean)) !== null) {
  const t = decode(m[1]).replace(/\s+/g, ' ').trim();
  if (t) nodes.push(t);
}
const missing = [...new Set(nodes.filter(t => !dict[t] && !ALLOW.has(t)))];

let fails = 0;
const ok = (label, cond) => { console.log((cond ? 'OK  ' : 'FAIL ') + label); if (!cond) fails++; };

console.log('== terminos.html — nodos: ' + nodes.length + ' | en dict: ' + nodes.filter(t => dict[t]).length + ' | allow: ' + ALLOW.size);
console.log(missing.length === 0 ? '   sin faltantes ✅' : '   FALTAN: ' + JSON.stringify(missing));
ok('terminos sin faltantes de traducción', missing.length === 0);

const mTitle = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
const mDesc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
ok('título traducible', !!titles[mTitle]);
ok('meta descripción traducible', !!descriptions[mDesc]);
ok('lang="en"', /<html[^>]* lang="en"/.test(html));
ok('canonical', html.includes('https://alquimialab.app/terminos.html'));
ok('lang.js incluido', html.includes('js/lang.js'));
ok('nav Terms activo', html.includes('class="nav-pp active"'));
ok('enlaza privacy', html.includes('politica-privacidad.html'));
ok('footer enlaza terminos', html.includes('terminos.html'));
ok('divs balanceados', (html.match(/<div/g) || []).length === (html.match(/<\/div>/g) || []).length);
ok('14 secciones', (html.match(/<h2>/g) || []).length >= 14);
ok('copyright EN', html.indexOf('Made with calm &amp; coffee') > -1 || html.indexOf('Made with calm & coffee') > -1);

console.log(fails === 0 ? '--- TODO OK ---' : '--- FALLOS: ' + fails + ' ---');
process.exit(0);
