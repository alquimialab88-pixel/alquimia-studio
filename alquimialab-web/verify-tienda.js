/* Verifica que cada texto visible de tienda.html tenga entrada en lang.js */
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Isabel/Documents/Default Project/alquimialab-web';

const html = fs.readFileSync(path.join(ROOT, 'tienda.html'), 'utf8');
const langSrc = fs.readFileSync(path.join(ROOT, 'js/lang.js'), 'utf8');

// extraer el objeto dict
const start = langSrc.indexOf('var dict = {');
if (start < 0) { console.error('dict not found'); process.exit(1); }
const open = langSrc.indexOf('{', start);
let depth = 0, end = -1;
for (let i = open; i < langSrc.length; i++) {
  const ch = langSrc[i];
  if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) { end = i; break; } }
}
const dictLiteral = langSrc.slice(open, end + 1);
// comentarios /* */ dentro del literal
const dict = eval('(' + dictLiteral.replace(/\/\*[\s\S]*?\*\//g, '') + ')');
const keys = new Set(Object.keys(dict));

// titles (document.title) y descriptions (meta)
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
const titles = objAfter('var titles = {');
const descriptions = objAfter('var descriptions = {');

// quitar script/style, luego extraer nodos de texto
let noScript = html
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<title[\s\S]*?<\/title>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '');

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&middot;/g, '·').replace(/&copy;/g, '©').replace(/&nbsp;/g, ' ');

const nodes = [];
const re = />([^<]+)</g;
let m;
while ((m = re.exec(noScript)) !== null) {
  const t = decode(m[1]).replace(/\s+/g, ' ').trim();
  if (t) nodes.push(t);
}

// permitidos: nombres propios / marcas / símbolos / que se repiten igual en ES
const ALLOW = new Set([
  'Alquimia Lab', 'ES | EN', '▾', 'Products', 'Kore',
  'Amazon', 'Amazon EN', 'Amazon ES', 'Digital',
  'Plan Maestro', 'Alquimia Studio', 'Focus Dock',
  'Freelancer CRM — Planner', 'YouTube Creator OS — Planner & Script',
  'Student OS & Study Planner', 'Social Media Planner',
  'Finance Planner Pro', 'Finance Planner Free',
  'Quiet Mind Planner', 'Habit Planner', 'Pet Control',
  'El diario imperfecto de una creadora', 'Isabel · Alquimia Lab',
  'Lo-Fi · Alquimia Lab',   'Freelancer CRM', 'Quiet Mind', 'Coloring Books', 'Planner 2027',
  '$7', '$3', '$14.99', '$12.99', '$27', '$9.99', '$15', '$5.99', '$4', '$5', 'FREE',
  '📖', '🧾', '🌱', '🎨', '📓', '🎓', '🐾', '🐼',
]);

const missing = [];
const seen = new Set();
for (const t of nodes) {
  if (keys.has(t)) continue;
  if (ALLOW.has(t)) continue;
  if (seen.has(t)) continue;
  seen.add(t);
  missing.push(t);
}

console.log('Nodos de texto totales:', nodes.length);
console.log('En diccionario:', nodes.filter(t => keys.has(t)).length);
console.log('Permitidos (nombres/marcas):', nodes.filter(t => ALLOW.has(t)).length);
console.log('\n--- SIN TRADUCCIÓN (revisar) ---');
if (missing.length === 0) console.log('(ninguno ✅)');
missing.forEach(t => console.log(' •', t));

// chequeos duros
function stripKeyframes(s) {
  var out = '', i = 0;
  while (true) {
    var k = s.indexOf('@keyframes', i);
    if (k < 0) { out += s.slice(i); break; }
    out += s.slice(i, k);
    var b = s.indexOf('{', k), depth = 0, j = b;
    for (; j < s.length; j++) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') { depth--; if (depth === 0) { j++; break; } }
    }
    i = j;
  }
  return out;
}
const checks = [
  ['sin data-es', !/data-es=/.test(html)],
  ['sin vídeo botones', !/video-cta|btn-video|introVideoBtn/.test(html) && !/href="https:\/\/www\.youtube\.com\/"/.test(html)],
  ['spotlight ebook', /ebook-story/.test(html) && /es-book/.test(html) && /story-label/.test(html)],
  ['ebook después de categorías', html.indexOf('class="ebook-story anim') > html.indexOf('id="categories-grid"')],
  ['match guide', /goProduct\('p-crm'\)/.test(html) && /goProduct\('p-quiet'\)/.test(html)],
  ['ids tarjetas', /id="p-planner"/.test(html) && /id="p-coloring"/.test(html)],
  ['pet control', /Pet Control/.test(html)],
  ['banner lofi', /lofi-video\.mp4/.test(html)],
  ['wa ebook', /wa\.me\/573104108483\?text=/.test(html)],
  ['lang.js incluido', /js\/lang\.js/.test(html)],
  ['tarjetas categoría', /id="cat-notion"/.test(html) && /id="cat-impresos"/.test(html) && /id="cat-digitales"/.test(html) && /openShop\('notion'\)/.test(html)],
  ['15 tarjetas', (html.match(/class="notion-card shop-card/g) || []).length === 15],
  ['card libro → blog', /href="blog\.html" class="btn-primary btn-sm">Read synopsis<\/a>/.test(html) && /assets\/ebook-portada\.png/.test(html)],
  ['banner carrusel', /id="shopBanner"/.test(html) && /id="bannerTrack"/.test(html)],
  ['3 slides banner', (html.match(/class="banner-slide/g) || []).length === 3],
  ['flechas', (html.match(/class="banner-arrow/g) || []).length === 2],
  ['dots', (html.match(/class="banner-dot[" ]/g) || []).length === 3],
  ['assets banner', ['banner-digital', 'banner-notion', 'banner-impresos'].every(function(n){ return html.indexOf('assets/' + n + '.png') > -1; })],
  ['autoplay', /setInterval/.test(html) && /visibilitychange/.test(html)],
  ['hero pro: 3 títulos', (html.match(/class="bs-title"/g) || []).length === 3],
  ['hero pro: 3 burbujas', (html.match(/class="bs-bubble"/g) || []).length === 3],
  ['hero pro: 3 CTAs abren tienda', (html.match(/href="#shop" onclick="openShop\('/g) || []).length === 3],
  ['hero pro: fondos s1/s2/s3', /class="banner-slide s1/.test(html) && /class="banner-slide s2/.test(html) && /class="banner-slide s3/.test(html)],
  ['banner full-bleed (antes de .page)', html.indexOf('id="shopBanner"') < html.indexOf('<div class="page">')],
  ['banner 100vh', /min-height:100vh; min-height:100svh/.test(html)],
  ['fusión: crossfade + blur', /filter:blur\(8px\)/.test(html) && /\.banner-slide\.active/.test(html)],
  ['sin translateX (fuera de keyframes)', !/translateX\(/.test(stripKeyframes(html))],
  ['slide1 activo al cargar', /class="banner-slide s1 active"/.test(html)],
  ['texto con margen anti-flecha', /clamp\(130px,15vw,270px\)/.test(html)],
  ['título traducido', titles.hasOwnProperty('Products · Alquimia Lab')],
  ['meta descripción traducida', descriptions.hasOwnProperty('Alquimia Lab Products — Notion templates, coloring books, and productivity tools.')],
  ['productos ocultos al cargar', /id="shop-products" style="display:none/.test(html)],
  ['orden: youtube antes que categorías', html.indexOf('youtube-banner') < html.indexOf('id="categories-grid"')],
  ['orden: categorías antes que productos', html.indexOf('id="categories-grid"') < html.indexOf('id="shop-products"')],
  ['aviso debajo del banner', html.indexOf('shop-hero anim') > html.indexOf('class="banner-banner"') || (html.indexOf('shop-hero anim') > 0 && html.indexOf('shop-hero anim') < html.indexOf('<!-- EBOOK'))],
  ['divs balanceados', (html.match(/<div/g) || []).length === (html.match(/<\/div>/g) || []).length],
];
console.log('\n--- CHECKS ---');
checks.forEach(([name, ok]) => console.log(ok ? 'OK ' : 'FAIL ', name));
process.exit(checks.every(c => c[1]) && missing.length === 0 ? 0 : 1);
