/* ==========================================================================
   Generador de claves maestras de Alquimia Lab
   --------------------------------------------------------------------------
   Crea claves válidas sin conexión para tus propios dispositivos y para
   destrabar a un cliente cuya compra no se pueda verificar.

   Uso:
     node herramientas/licencias.js                 genera 3 claves nuevas
     node herramientas/licencias.js --ver CLAVE     comprueba una clave

   El archivo licencia.js de cada app solo guarda el HASH, así que las
   claves en claro no quedan en el repositorio público.
   ========================================================================== */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const APPS = ["aurify", "stickly"];
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin I, O, 0, 1

function sal(app) {
  return "alquimia-lab|" + app + "|v1|2026";
}

function hash(cadena) {
  let h = 0x811c9dc5;
  for (let i = 0; i < cadena.length; i++) {
    h ^= cadena.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return ("0000000" + h.toString(36)).slice(-7);
}

function normalizar(codigo) {
  return String(codigo || "").toUpperCase().replace(/[\s._-]+/g, "");
}

/* Igual que en licencia.js: se hashea la clave ya normalizada. */
function huella(app, clave) {
  return hash(sal(app) + "|" + normalizar(clave));
}

function grupo(n) {
  let salida = "";
  for (let i = 0; i < n; i++) salida += ALFABETO[crypto.randomInt(0, ALFABETO.length)];
  return salida;
}

function nuevaClave() {
  return "ALQ-" + grupo(4) + "-" + grupo(4) + "-" + grupo(4);
}

const args = process.argv.slice(2);

if (args[0] === "--ver") {
  const clave = normalizar(args[1] || "");
  console.log("Clave:", clave);
  for (const app of APPS) {
    console.log("  " + app.padEnd(8) + huella(app, clave));
  }
  process.exit(0);
}

const cantidad = Number(args[0]) > 0 ? Number(args[0]) : 3;
const claves = [];
const lineas = [];

for (let i = 0; i < cantidad; i++) {
  const clave = nuevaClave();
  claves.push(clave);
  lineas.push(clave);
  console.log("\n" + clave);
  for (const app of APPS) {
    const h = huella(app, clave);
    lineas.push("  " + app + ": " + h);
    console.log("  " + app.padEnd(8) + h);
  }
}

lineas.unshift(
  "Claves maestras de Alquimia Lab · generadas " + new Date().toISOString().slice(0, 10),
  "Valen para Aurify y Stickly. No las publiques: son la llave de tu casa.",
  ""
);

const destino = path.join(__dirname, "..", "CLAVES-MAESTRAS.txt");
fs.writeFileSync(destino, lineas.join("\n") + "\n", "utf8");
console.log("\nGuardadas en " + destino);
