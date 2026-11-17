const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.resolve(root, "..", "alquimialab-web", "aurify");
const targetRoot = path.join(root, "app");
const target = path.join(targetRoot, "aurify");

if (!fs.existsSync(path.join(source, "index.html"))) {
  console.error("No se encontró la PWA de Aurify en: " + source);
  process.exit(1);
}

fs.mkdirSync(targetRoot, { recursive: true });
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, {
  recursive: true,
  filter: (src) => {
    const name = path.basename(src);
    return name !== ".DS_Store" && name !== "Thumbs.db";
  }
});

console.log("Aurify copiado a app/aurify");
