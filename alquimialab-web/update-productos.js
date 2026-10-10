/* Actualiza productos.html con el diseño nuevo (tienda.html), conservando canonical */
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Isabel/Documents/Default Project/alquimialab-web';

let t = fs.readFileSync(path.join(ROOT, 'tienda.html'), 'utf8');
const anchor = '<meta name="theme-color" content="#f2f2f2">\n';
if (!t.includes(anchor)) { console.error('FAIL: ancla theme-color no encontrada'); process.exit(1); }
if (t.includes('rel="canonical"')) { console.error('FAIL: tienda ya tiene canonical (revisar)'); process.exit(1); }
t = t.replace(anchor, anchor + '  <link rel="canonical" href="https://alquimialab.app/productos.html">\n');
fs.writeFileSync(path.join(ROOT, 'productos.html'), t);
console.log('OK productos.html actualizado con el diseño de tienda (' + t.length + ' bytes), canonical conservado');
