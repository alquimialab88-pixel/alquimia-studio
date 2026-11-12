/* ==========================================================================
   Stickly · cuadernos
   ========================================================================== */

import { t } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";

const COLORS = ["#DDD6FE", "#FBCFE8", "#BAE6FD", "#BBF7D0", "#FED7AA", "#FEF08A"];

export function openNotebookSheet(options) {
  const opts = options || {};
  const notebook = opts.notebook || null;
  let color = (notebook && notebook.color) || COLORS[0];

  const sheet = ui.openSheet(
    "<h2>" + ui.esc(notebook ? t("editar") : t("nuevoCuaderno")) + "</h2>" +
    '<label class="field mt-14"><span>' + ui.esc(t("titulo")) + "</span>" +
      '<input id="nbTitle" class="input" type="text" maxlength="80" autocomplete="off" ' +
        'value="' + ui.esc(notebook ? notebook.titulo : "") + '" placeholder="' + ui.esc(t("nuevoCuaderno")) + '"></label>' +
    '<div class="field"><span>' + ui.esc(t("color")) + "</span>" +
      '<div class="color-row">' + COLORS.map((c) =>
        '<button type="button" class="color-swatch' + (c === color ? " active" : "") + '" style="background:' + c + '" data-nb-color="' + c + '"></button>'
      ).join("") + "</div></div>" +
    '<div class="sheet-actions">' +
      '<button type="button" class="btn btn-ghost" data-cancel>' + ui.esc(t("cancelar")) + "</button>" +
      '<button type="button" class="btn btn-primary" data-save>' + ui.esc(t("guardar")) + "</button>" +
    "</div>"
  );

  const titleInput = sheet.querySelector("#nbTitle");

  sheet.querySelectorAll("[data-nb-color]").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      color = swatch.getAttribute("data-nb-color");
      sheet.querySelectorAll("[data-nb-color]").forEach((s) => s.classList.toggle("active", s === swatch));
    });
  });

  const save = async () => {
    const titulo = titleInput.value.trim();
    if (!titulo) {
      ui.toast(t("nuevoCuaderno"));
      titleInput.focus();
      return;
    }
    await store.saveNotebook({ id: notebook ? notebook.id : null, titulo, color, timestamp: notebook ? notebook.timestamp : Date.now() });
    sheet.close();
    ui.toast(t("saved"));
    if (opts.onDone) opts.onDone();
  };

  sheet.querySelector("[data-save]").addEventListener("click", save);
  sheet.querySelector("[data-cancel]").addEventListener("click", () => sheet.close());
  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); save(); }
  });
  setTimeout(() => { titleInput.focus(); titleInput.select(); }, 120);
}

export async function render(ctx) {
  const notebooks = store.state.notebooks;
  const countFor = (id) => store.state.notebookNotes.filter((note) => note.cuadernoId === id).length;

  const cards = notebooks.map((notebook) => {
    const color = notebook.color || COLORS[0];
    return '<button type="button" class="nb-card" style="--nb-c:' + ui.esc(color) + '" data-notebook="' + ui.esc(notebook.id) + '">' +
      '<span class="nb-blob"></span>' +
      '<span class="nb-icon">' + ui.icon("book") + "</span>" +
      "<div><h3>" + ui.esc(notebook.titulo) + "</h3>" +
        '<p class="nb-count">' + ui.esc(t("noteCount", { n: countFor(notebook.id) })) + "</p></div>" +
    "</button>";
  }).join("");

  const html =
    '<div class="page-head">' +
      "<div><h1 class=\"page-title\">" + ui.esc(t("cuadernos")) + "</h1>" +
        '<span class="subtle">' + ui.esc(t("noteCount", { n: store.state.notebookNotes.length })) + "</span></div>" +
    "</div>" +
    (notebooks.length
      ? '<div class="nb-grid">' + cards + "</div>"
      : '<div class="empty"><div class="empty-icon">' + ui.icon("book") + "</div>" +
        "<h3>" + ui.esc(t("cuadernos")) + "</h3>" +
        "<p>" + ui.esc(t("sinCuadernos")) + "</p>" +
        '<button type="button" class="btn btn-primary" data-add-notebook>' + ui.esc(t("nuevoCuaderno")) + "</button></div>") +
    '<button type="button" class="fab" data-add-notebook aria-label="' + ui.esc(t("nuevoCuaderno")) + '">' + ui.icon("plus") + "</button>";

  function mount(root) {
    root.querySelectorAll("[data-notebook]").forEach((card) => {
      card.addEventListener("click", () => {
        ctx.navigate("#/notebook/" + encodeURIComponent(card.getAttribute("data-notebook")));
      });
    });

    root.querySelectorAll("[data-add-notebook]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openNotebookSheet({ onDone: () => ctx.rerender() });
      });
    });
  }

  return { html, mount, cleanup: () => {} };
}
