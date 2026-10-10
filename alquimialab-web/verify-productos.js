/* Verifica productos.html: i18n (EN fuente → ES en lang.js) + tarjetas y modal */
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

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&middot;/g, '·').replace(/&copy;/g, '©').replace(/&nbsp;/g, ' ')
  .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&mdash;/g, '—')
  .replace(/&ndash;/g, '–').replace(/&times;/g, '×').replace(/&larr;/g, '←').replace(/&rarr;/g, '→')
  .replace(/&iacute;/g, 'í').replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é')
  .replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ')
  .replace(/&#(\d+);/g, (m, d) => String.fromCharCode(+d));

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

// permitidos: mismo set que verify-tienda (nombres de producto/marca, precios, símbolos)
const ALLOW = new Set([
  'Alquimia Lab', 'ES | EN', '▾', 'Products', 'Kore',
  'Amazon', 'Amazon EN', 'Amazon ES', 'Digital',
  'Plan Maestro', 'Alquimia Studio', 'Focus Dock',
  'Freelancer CRM — Planner', 'YouTube Creator OS — Planner & Script',
  'Student OS & Study Planner', 'Social Media Planner',
  'Finance Planner Pro', 'Finance Planner Free',
  'Quiet Mind Planner', 'Habit Planner', 'Pet Control',
  'El diario imperfecto de una creadora', 'Isabel · Alquimia Lab',
  'Lo-Fi · Alquimia Lab', 'Freelancer CRM', 'Quiet Mind', 'Coloring Books', 'Planner 2027',
  '$7', '$3', '$14.99', '$12.99', '$27', '$9.99', '$15', '$5.99', '$4', '$5', 'FREE',
  '📖', '🧾', '🌱', '🎨', '📓', '🎓', '🐾', '🐼',
]);

const missing = [];
const seen = new Set();
const prod = fs.readFileSync(path.join(ROOT, 'productos.html'), 'utf8');
const nodes = nodesOf(prod);
for (const t of nodes) {
  if (keys.has(t)) continue;
  if (ALLOW.has(t)) continue;
  if (seen.has(t)) continue;
  seen.add(t);
  missing.push(t);
}
console.log('Nodos:', nodes.length, '| en dict:', nodes.filter(t => keys.has(t)).length, '| permitidos:', nodes.filter(t => ALLOW.has(t)).length);

let fail = 0;
function check(name, ok) {
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + name);
  if (!ok) fail++;
}
check('productos sin faltantes de traducción', missing.length === 0);
missing.forEach(t => console.log('  •', t));

const mTitle = (prod.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
const mDesc = (prod.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
check('título traducido', !!titles[mTitle]);
check('meta descripción traducida', !!descriptions[mDesc]);
check('lang.js incluido', /src="js\/lang\.js"/.test(prod));
check('selector ES | EN', /id="langToggle"/.test(prod));
check('nav Blog antes que Contact', (() => {
  const iB = prod.indexOf('<a href="blog.html"');
  const iC = prod.indexOf('href="contacto.html"');
  return iB > -1 && (iC === -1 || iB < iC);
})());
check('canonical productos', /rel="canonical" href="https:\/\/alquimialab\.app\/productos\.html"/.test(prod));
check('banner carrusel (diseño tienda)', /id="shopBanner"/.test(prod) && /banner-track/.test(prod) && /banner-slide s3/.test(prod));
check('guía "¿cuál es para ti?"', /match-wrap/.test(prod) && /goProduct\('p-crm'\)/.test(prod));
check('productos ocultos hasta elegir', /id="shop-products" style="display:none/.test(prod));
check('ebook historia estilo Kore', /class="ebook-story/.test(prod) && /assets\/ebook-portada\.png/.test(prod));
check('card libro → blog', /assets\/ebook-portada\.png/.test(prod) && /href="blog\.html"[^>]*>Read synopsis/.test(prod));
check('divs balanceados', (prod.match(/<div/g) || []).length === (prod.match(/<\/div>/g) || []).length);

console.log(fail === 0 ? '--- TODO OK ---' : '--- FALLOS: ' + fail + ' ---');
process.exit(fail === 0 ? 0 : 1);
