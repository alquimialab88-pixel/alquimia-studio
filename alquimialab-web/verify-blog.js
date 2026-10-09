/* Verifica blog.html (artículo único) contra lang.js + enlaces desde el resto de la web */
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

// Español intencional: títulos de capítulos (el libro es en español), cintilla decorativa y chrome
const ALLOW = new Set([
  'Alquimia Lab', 'ES | EN', '▾', 'Products', 'Kore', 'Blog', 'Home', 'Contact', 'Links', 'Social',
  'Carta de una amiga', 'Renuncié y me tembló todo', 'Los hilos invisibles', 'La IA y yo',
  'El gran mito del logo hecho por IA', 'La agencia de una sola persona', 'El ángel guardián y Open Code',
  'Bonus', '✶', '♥', '✦', '01', '02', '03', '04', '05', '06', '07',
  'EL DIARIO IMPERFECTO', 'CAPÍTULOS REALES', 'FINALES ABIERTOS', 'EJERCICIOS HONESTOS', 'MUY PRONTO',
  'Facebook', 'Instagram', 'YouTube',
]);

let fail = 0;
function check(name, ok) {
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + name);
  if (!ok) fail++;
}

const blog = fs.readFileSync(path.join(ROOT, 'blog.html'), 'utf8');
const bnodes = nodesOf(blog);
const bmissing = [...new Set(bnodes.filter(t => !keys.has(t) && !ALLOW.has(t)))];
console.log('blog.html — nodos:', bnodes.length, '| en dict:', bnodes.filter(t => keys.has(t)).length);
console.log('--- SIN TRADUCCIÓN (blog.html) ---');
if (bmissing.length === 0) console.log('(ninguno ✅)');
bmissing.forEach(t => console.log(' •', t));
check('blog.html sin faltantes', bmissing.length === 0);

const mTitle = (blog.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
const mDesc = (blog.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
check('título traducido', !!titles[mTitle]);
check('meta descripción traducida', !!descriptions[mDesc]);

check('nav Blog activo', /href="blog\.html" class="active"/.test(blog));
check('Blog antes que Contact en nav', blog.indexOf('href="blog.html" class="active"') < blog.indexOf('href="contacto.html"'));
check('lang.js incluido', /src="js\/lang\.js"/.test(blog));
check('CTA WhatsApp compra', /wa\.me\/573104108483\?text=[^"]*comprar/.test(blog) && />Buy the book/.test(blog));
check('estilo editorial (hoja)', /class="ed-sheet/.test(blog));
check('paleta Kore (sin crema/coral)', !/faf5ec|#e5533d|#ffd9a8|#cdc9ef/.test(blog));
check('sin fuente serif', !/Cormorant/.test(blog));
check('sinopsis legible', /class="dropcap"/.test(blog) && /From that rubble/.test(blog) && /ed-quote/.test(blog));
check('polaroid con ilustración', /class="polaroid"/.test(blog) && /assets\/portada-ilustracion\.png/.test(blog));
check('cintilla animada', /class="ticker anim/.test(blog));
check('CTA final morado', /class="blog-hero anim/.test(blog));
check('sin enlaces a posts viejos', !/href="blog\//.test(blog));
check('divs balanceados', (blog.match(/<div/g) || []).length === (blog.match(/<\/div>/g) || []).length);

/* El resto de la web debe enlazar el blog */
const pages = ['index.html', 'tienda.html', 'productos.html', 'portafolio.html', 'contacto.html',
  'kore-landing.html', 'planner-2027.html', 'branding.html', 'social.html', 'ux.html',
  'ai-characters.html', 'politica-privacidad.html', 'delete-account.html'];
for (const p of pages) {
  const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
  const iBlog = html.indexOf('<a href="blog.html"');
  const iContact = html.indexOf('href="contacto.html"');
  check(p + ' → Blog en nav', iBlog > -1 && (iContact === -1 || iBlog < iContact));
}
for (const p of ['index.html', 'kore-landing.html', 'politica-privacidad.html']) {
  const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
  check(p + ' → Blog en footer', /<li><a href="blog\.html">Blog<\/a><\/li>/.test(html));
}

/* No debe quedar nada de los posts viejos */
check('posts viejos borrados', !fs.existsSync(path.join(ROOT, 'blog')));

/* Cards del libro en tienda y productos llevan al artículo */
const prod = fs.readFileSync(path.join(ROOT, 'productos.html'), 'utf8');
check('productos.html → card libro', /assets\/ebook-portada\.png/.test(prod) && /href="blog\.html"[^>]*>Read synopsis/.test(prod));
const tie = fs.readFileSync(path.join(ROOT, 'tienda.html'), 'utf8');
check('tienda.html → card libro', /assets\/ebook-portada\.png/.test(tie) && /href="blog\.html" class="btn-primary btn-sm">Read synopsis/.test(tie));

/* Portada del ebook presente para la tablet */
check('portada en assets', fs.existsSync(path.join(ROOT, 'assets/ebook-portada.png')));

console.log(fail === 0 ? '--- TODO OK ---' : '--- FALLOS: ' + fail + ' ---');
process.exit(fail === 0 ? 0 : 1);
