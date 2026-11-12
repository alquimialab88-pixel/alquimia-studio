#!/usr/bin/env node
/**
 * Verificador de la promo Black Friday de Alquimia Lab.
 *
 * Comprueba, sin dependencias:
 *   1. Que el cupón BLACKFRIDAY88 esté activo en Gumroad.
 *   2. Que el precio de lista de cada ficha coincida con el que muestra la web.
 *   3. Que el 50% dé exactamente el precio que se muestra en la vitrina.
 *   4. Que los enlaces de la web usen el cupón y las fichas correctas.
 *
 * Uso:  node tools/check-promo.mjs
 * Sale con código 1 si algo no cuadra.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://alquimialab.app";
const GUMROAD = "https://alquimialab.gumroad.com/l/";
const CODE = "BLACKFRIDAY88";
const DISCOUNT = 0.5;

// Precio de lista (Gumroad), precio tachado en la web y precio final mostrado.
// Gumroad trunca el medio centavo (799 * 50% = 399.5 -> 399), verificado en el
// checkout real el 12/11/2026: $7.99 -> COP 13.071 = $3.99, no $4.00.
const PRODUCTS = [
  { name: "Planora (ES)",        slug: "Planora",                  list: 7.99,  shown: 3.99 },
  { name: "Planora (EN)",        slug: "Planora-pro",              list: 7.99,  shown: 3.99 },
  { name: "Alquimia Studio (ES)", slug: "AlquimiaStudio_Planner",  list: 9.99,  shown: 4.99 },
  { name: "Alquimia Studio (EN)", slug: "AlquimiaStudio",          list: 9.99,  shown: 4.99 },
  { name: "Planner 2027",        slug: "bvzpd",                    list: 10.99, shown: 5.49 },
  { name: "Lofi Coloring",       slug: "LofiColoringBookAlquimia", list: 5.0,   shown: 2.5 },
];

const promoPrice = (list) => Math.floor(list * 100 * (1 - DISCOUNT)) / 100;

const money = (n) => "$" + n.toFixed(2);
const pad = (s, n) => String(s).padEnd(n);

async function get(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; AlquimiaPromoCheck/1.0)" },
  });
  return { status: res.status, text: (await res.text()).replace(/&quot;/g, '"') };
}

function promoWindow() {
  // Mismas fechas que vitrina.html (hora local del visitante).
  const start = new Date(2026, 10, 12, 0, 0, 0);
  const end = new Date(2026, 10, 28, 23, 0, 0);
  const now = new Date();
  return { start, end, now, inside: now >= start && now <= end };
}

async function checkGumroad() {
  const rows = [];
  for (const p of PRODUCTS) {
    const { status, text } = await get(GUMROAD + p.slug + "/" + CODE);
    const code = text.match(/"discount_code":\{[^}]*\}/);
    const valid = /"valid":true/.test(code ? code[0] : "");
    const err = (code && code[0].match(/"error_code":"([a-z_]+)"/)) || null;
    const priceCents = (text.match(/"price_cents":(\d+)/) || [])[1];
    const currency = ((text.match(/"currency_code":"([a-z]+)"/) || [])[1] || "").toUpperCase();
    const list = priceCents ? Number(priceCents) / 100 : null;

    rows.push({
      ...p,
      status,
      valid,
      err: err ? err[1] : null,
      listFromGumroad: list,
      discounted: list === null ? null : promoPrice(list),
      listOk: list !== null && Math.abs(list - p.list) < 0.005,
      shownOk: list !== null && Math.abs(promoPrice(list) - p.shown) < 0.005,
      currency,
    });
  }
  return rows;
}

function checkSite() {
  const vitrina = readFileSync(join(ROOT, "alquimialab-web", "vitrina.html"), "utf8");
  const productos = readFileSync(join(ROOT, "alquimialab-web", "productos.html"), "utf8");
  const issues = [];

  for (const p of PRODUCTS) {
    if (!vitrina.includes(`/${p.slug}/${CODE}`)) {
      issues.push(`vitrina.html: falta el enlace /${p.slug}/${CODE}`);
    }
  }
  if (!vitrina.includes("var PROMO_START = new Date(2026, 10, 12")) issues.push("vitrina.html: PROMO_START inesperado");
  if (!vitrina.includes("var PROMO_END = new Date(2026, 10, 28, 23")) issues.push("vitrina.html: PROMO_END inesperado");
  if (!vitrina.includes("bfPreview")) issues.push("vitrina.html: falta el aviso de vista previa");

  const shownOnCatalog = [7.99, 9.99, 10.99, 5.0];
  for (const price of shownOnCatalog) {
    if (!productos.includes(`$${price}`)) issues.push(`productos.html: no aparece el precio $${price}`);
  }
  return issues;
}

async function checkLive() {
  const issues = [];
  try {
    const { status, text } = await get(SITE + "/vitrina?check=" + Date.now());
    if (status !== 200) issues.push(`/vitrina respondió ${status}`);
    if (!/noindex/i.test(text)) issues.push("/vitrina perdió el meta noindex");
    if (!text.includes(CODE)) issues.push("/vitrina no contiene el código de descuento");
    const { text: robots } = await get(SITE + "/robots.txt");
    const { text: sitemap } = await get(SITE + "/sitemap.xml");
    if (/vitrina/i.test(robots)) issues.push("robots.txt menciona vitrina");
    if (/vitrina/i.test(sitemap)) issues.push("sitemap.xml menciona vitrina");
  } catch (e) {
    issues.push("no se pudo consultar el sitio en vivo: " + e.message);
  }
  return issues;
}

const win = promoWindow();
const rows = await checkGumroad();
const siteIssues = checkSite();
const liveIssues = await checkLive();

const fmt = (d) => d.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
console.log("");
console.log("Black Friday · código " + CODE + " (-" + DISCOUNT * 100 + "%)");
console.log("Ventana: " + fmt(win.start) + " → " + fmt(win.end));
console.log("Ahora:   " + fmt(win.now) + "  ·  " + (win.inside ? "DENTRO de la promo" : "FUERA de la promo"));
console.log("");
console.log(pad("Producto", 22) + pad("Lista", 9) + pad("-50%", 9) + pad("Web", 8) + "Cupón");
console.log("-".repeat(58));

let problems = 0;
for (const r of rows) {
  const cupon = r.valid ? "activo" : "inactivo" + (r.err ? " (" + r.err + ")" : "");
  const web = r.shownOk ? "ok" : "MISMATCH";
  if (!r.listOk) problems++;
  if (!r.shownOk) problems++;
  if (r.valid !== win.inside) problems++;
  console.log(
    pad(r.name, 22) +
      pad(r.listFromGumroad === null ? "?" : money(r.listFromGumroad), 9) +
      pad(r.discounted === null ? "?" : money(r.discounted), 9) +
      pad(web, 8) +
      cupon
  );
}
console.log("");

if (siteIssues.length) {
  console.log("Fuente del sitio:");
  siteIssues.forEach((i) => console.log("  ✗ " + i));
  problems += siteIssues.length;
}
if (liveIssues.length) {
  console.log("Sitio en vivo:");
  liveIssues.forEach((i) => console.log("  ✗ " + i));
  problems += liveIssues.length;
}

if (!win.inside) {
  console.log("Nota: fuera de la ventana la vitrina oculta la sección y muestra precios normales.");
}
console.log("");
if (problems === 0) {
  console.log("Todo en orden.");
  process.exit(0);
}
console.log("Revisar: " + problems + " punto(s) a corregir.");
process.exit(1);
