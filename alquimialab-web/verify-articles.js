/* Verifica los 5 artículos del blog (fuente EN) contra lang.js */
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

/* partes invariantes de kickers y decoración */
const ALLOW = new Set(['✶', '♥', 'Alquimia Lab', '▾', 'Kore', 'ES | EN', 'Facebook', 'Instagram', 'YouTube', 'Notion ·', 'Productivity ·', 'AI ·', 'Digital life ·', 'Behind the scenes ·', 'More from the blog', '01', '02', '03', '04', '05']);

const FILES = ['blog-notion-mistakes.html', 'blog-todo-list.html', 'blog-ai-criteria.html',
  'blog-one-dashboard.html', 'blog-one-woman-studio.html'];
const OTHERS = ['blog.html', ...FILES];

let fail = 0;
function check(name, ok) {
  console.log((ok ? 'OK  ' : 'FAIL') + ' ' + name);
  if (!ok) fail++;
}

for (const f of FILES) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const nodes = nodesOf(html);
  const missing = [...new Set(nodes.filter(t => !keys.has(t) && !ALLOW.has(t)))];
  console.log('== ' + f + ' — nodos: ' + nodes.length + ' | en dict: ' + nodes.filter(t => keys.has(t)).length);
  if (missing.length === 0) console.log('   sin faltantes ✅');
  missing.forEach(t => console.log('   • ' + t));
  check(f + ' sin faltantes', missing.length === 0);

  const mTitle = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
  const mDesc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
  check(f + ' título traducible', !!titles[mTitle]);
  check(f + ' meta descripción traducible', !!descriptions[mDesc]);

  check(f + ' lang="en"', /<html lang="en">/.test(html));
  check(f + ' canonical', new RegExp('rel="canonical" href="https://alquimialab.app/' + f + '"').test(html));
  check(f + ' lang.js', /src="js\/lang\.js(\?v=\d+)?"/.test(html));
  check(f + ' divs balanceados', (html.match(/<div/g) || []).length === (html.match(/<\/div>/g) || []).length);
  check(f + ' copyright EN', html.indexOf('Made with calm &amp; coffee') > -1);
  check(f + ' nav blog', /href="blog\.html">Blog<\/a>/.test(html));

  /* enlaza a los otros 4 artículos */
  for (const o of FILES) {
    if (o !== f) check(f + ' → ' + o, html.indexOf('href="' + o + '"') > -1);
  }
  check(f + ' → blog.html', html.indexOf('href="blog.html"') > -1);
}

console.log(fail === 0 ? '--- TODO OK ---' : '--- FALLOS: ' + fail + ' ---');
process.exit(fail === 0 ? 0 : 1);
