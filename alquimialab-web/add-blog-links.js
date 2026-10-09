/* Inserta link Blog en nav (izq. de Contact) y footer (tras Products) de todas las páginas */
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Isabel/Documents/Default Project/alquimialab-web';
const skip = new Set(['blog.html', 'bisect.html']);

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !skip.has(f));
const navDone = [], footDone = [], skipped = [];

for (const f of files) {
  const p = path.join(ROOT, f);
  let html = fs.readFileSync(p, 'utf8');
  const orig = html;

  if (html.includes('href="blog.html"')) { skipped.push(f + ' (ya tiene Blog)'); continue; }

  const m = html.match(/\n(\s*)<a href="contacto\.html"/);
  if (m) {
    html = html.replace(/\n(\s*)<a href="contacto\.html"/, (s, ind) =>
      '\n' + ind + '<a href="blog.html">Blog</a>\n' + ind + '<a href="contacto.html"');
    navDone.push(f);
  }

  const re = /<li><a href="productos\.html"[^>]*>[^<]*<\/a><\/li>/g;
  let last = null, mm;
  while ((mm = re.exec(html)) !== null) last = mm;
  if (last) {
    const end = last.index + last[0].length;
    const lineStart = html.lastIndexOf('\n', last.index) + 1;
    const indent = html.slice(lineStart, last.index);
    html = html.slice(0, end) + '\n' + indent + '<li><a href="blog.html">Blog</a></li>' + html.slice(end);
    footDone.push(f);
  }

  if (html !== orig) fs.writeFileSync(p, html);
}

console.log('NAV Blog añadido (' + navDone.length + '):');
console.log('  ' + navDone.join('\n  '));
console.log('FOOTER Blog añadido (' + footDone.length + '):');
console.log('  ' + (footDone.join(', ') || '(ninguno)'));
console.log('SALTADOS: ' + skipped.join(' | '));
const noNav = files.filter(f => !navDone.includes(f) && !skipped.includes(f + ' (ya tiene Blog)'));
if (noNav.length) console.log('SIN NAV (revisar): ' + noNav.join(', '));
