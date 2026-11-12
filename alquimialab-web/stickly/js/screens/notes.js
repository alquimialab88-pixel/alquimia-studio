/* ==========================================================================
   Stickly · lista y tablero de notas
   ========================================================================== */

import { t, getLang } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";

const CATEGORIES = [
  { id: "todas", key: "catTodas" },
  { id: "importante", key: "catImportante" },
  { id: "compras", key: "catCompras" },
  { id: "claves", key: "catClaves" }
];

let view = "board";
let category = "todas";
let query = "";

try {
  const savedView = localStorage.getItem("stickly-notes-view");
  if (savedView === "list" || savedView === "board") view = savedView;
} catch (e) { /* ignore */ }

function categoryLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? t(found.key) : id;
}

function noteData(note) {
  if (!note.privada) {
    return {
      title: note.title || t("titlePlaceholder"),
      content: note.content || "",
      items: Array.isArray(note.items) ? note.items : [],
      image: note.image || null,
      locked: false
    };
  }
  const payload = store.noteView(note);
  if (!payload) {
    return {
      title: t("notaPrivada"),
      content: t("pinNeededText"),
      items: [],
      image: null,
      locked: true
    };
  }
  return {
    title: payload.title || t("notaPrivada"),
    content: payload.content || "",
    items: Array.isArray(payload.items) ? payload.items : [],
    image: payload.image || null,
    locked: false
  };
}

function matches(note) {
  const data = noteData(note);
  if (category !== "todas" && (note.categoria || "importante") !== category) return false;
  if (!query) return true;
  const q = query.toLowerCase();
  if (data.title.toLowerCase().includes(q)) return true;
  if (data.locked) return false;
  if (data.content.toLowerCase().includes(q)) return true;
  return data.items.some((item) => String(item.text || "").toLowerCase().includes(q));
}

function previewText(data) {
  if (data.locked) return data.content;
  if (data.items.length) {
    const done = data.items.filter((item) => item.done).length;
    const first = data.items.find((item) => !item.done) || data.items[0];
    return done + "/" + data.items.length + " · " + (first.text || "");
  }
  return (data.content || "").replace(/\s+/g, " ").trim();
}

function rowHtml(note) {
  const data = noteData(note);
  const color = note.color || "#FEF08A";
  const thumb = data.image
    ? '<img class="note-thumb" src="' + ui.esc(data.image) + '" alt="">'
    : "";

  return '<div class="note-row" role="button" tabindex="0" style="--note-c:' + ui.esc(color) + '" data-note="' + ui.esc(note.id) + '">' +
    '<span class="note-color"></span>' +
    '<div class="note-row-main">' +
      "<h3>" + ui.esc(data.title) + "</h3>" +
      "<p>" + ui.esc(previewText(data) || t("noContent")) + "</p>" +
      '<div class="meta">' +
        '<span class="pill-soft">' + ui.esc(categoryLabel(note.categoria || "importante")) + "</span>" +
        "<span>" + ui.esc(ui.fmtShortDate(new Date(note.updatedAt || note.createdAt || Date.now()), getLang())) + "</span>" +
        (note.privada ? '<span class="lock-pill">' + ui.icon("lock") + ui.esc(t("protegida")) + "</span>" : "") +
      "</div>" +
    "</div>" +
    thumb +
    '<button type="button" class="icon-btn sm plain row-menu" data-del="' + ui.esc(note.id) + '" aria-label="' + ui.esc(t("eliminar")) + '">' +
      ui.icon("trash", "icon-sm") +
    "</button>" +
  "</div>";
}

function stickyHtml(note) {
  const data = noteData(note);
  const color = note.color || "#FEF08A";
  const image = data.image
    ? '<img class="sticky-img" src="' + ui.esc(data.image) + '" alt="">'
    : "";
  const list = data.items.length
    ? '<ul>' + data.items.slice(0, 4).map((item) => (
      '<li class="' + (item.done ? "done" : "") + '">' +
        ui.icon(item.done ? "check-circle" : "check") +
        "<span>" + ui.esc(item.text || "") + "</span></li>"
    )).join("") + "</ul>"
    : "<p>" + ui.esc(previewText(data) || t("noContent")) + "</p>";

  return '<div class="sticky" role="button" tabindex="0" style="--note-c:' + ui.esc(color) + '" data-note="' + ui.esc(note.id) + '">' +
    (note.privada ? '<span class="sticky-lock">' + ui.icon("lock") + "</span>" : "") +
    image +
    "<h3>" + ui.esc(data.title) + "</h3>" +
    list +
    '<div class="sticky-meta">' + ui.esc(categoryLabel(note.categoria || "importante")) + "</div>" +
  "</div>";
}

function bodyHtml() {
  const list = store.state.notes.filter(matches);

  if (!list.length) {
    const hasAny = store.state.notes.length > 0;
    return '<div class="empty">' +
      '<div class="empty-icon">' + ui.icon(hasAny ? "search" : "note") + "</div>" +
      "<h3>" + ui.esc(hasAny ? t("noResults") : t("notas")) + "</h3>" +
      "<p>" + ui.esc(hasAny ? t("searchNotes") : t("emptyNotes")) + "</p>" +
      '<button type="button" class="btn btn-primary" data-new-note>' + ui.esc(t("nuevaNota")) + "</button>" +
    "</div>";
  }

  if (view === "list") {
    return '<div class="notes-list">' + list.map(rowHtml).join("") + "</div>";
  }
  return '<div class="board">' + list.map(stickyHtml).join("") + "</div>";
}

export async function render(ctx) {
  const niceCount = store.state.notes.length;

  const html =
    '<div class="page-head">' +
      "<div>" +
        '<h1 class="page-title">' + ui.esc(t("notas")) + "</h1>" +
        '<span class="subtle">' + ui.esc(t("noteCount", { n: niceCount })) + "</span>" +
      "</div>" +
      '<div class="head-actions">' +
        '<button type="button" class="icon-btn" data-toggle-view aria-label="' +
          ui.esc(view === "list" ? t("vistaTablero") : t("vistaLista")) + '" title="' +
          ui.esc(view === "list" ? t("vistaTablero") : t("vistaLista")) + '">' +
          ui.icon(view === "list" ? "grid" : "list") +
        "</button>" +
      "</div>" +
    "</div>" +

    '<div class="search-field">' + ui.icon("search") +
      '<input id="noteSearch" type="search" autocomplete="off" placeholder="' + ui.esc(t("searchNotes")) + '" value="' + ui.esc(query) + '">' +
    "</div>" +

    '<div class="chips" role="tablist">' + CATEGORIES.map((cat) =>
      '<button type="button" class="chip' + (category === cat.id ? " active" : "") + '" data-cat="' + cat.id + '">' +
        ui.esc(t(cat.key)) + "</button>"
    ).join("") + "</div>" +

    '<div id="notesBody">' + bodyHtml() + "</div>" +
    '<button type="button" class="fab" data-new-note aria-label="' + ui.esc(t("nuevaNota")) + '">' + ui.icon("plus") + "</button>";

  function wireBody(root) {
    const body = root.querySelector("#notesBody");

    const open = (id) => ctx.navigate("#/note/" + encodeURIComponent(id));

    body.querySelectorAll("[data-note]").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-del]")) return;
        open(card.getAttribute("data-note"));
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(card.getAttribute("data-note"));
        }
      });
    });

    body.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const ok = await ui.confirmDialog({
          title: t("borrarPostIt"),
          ok: t("eliminar"),
          cancel: t("cancelar"),
          danger: true
        });
        if (!ok) return;
        await store.deleteNote(btn.getAttribute("data-del"));
        ui.toast(t("deleteAllDone"));
        ctx.rerender();
      });
    });

    body.querySelectorAll("[data-new-note]").forEach((btn) => {
      btn.addEventListener("click", () => ctx.navigate("#/note/new"));
    });
  }

  function mount(root) {
    const search = root.querySelector("#noteSearch");
    if (search) {
      search.addEventListener("input", () => {
        query = search.value;
        const body = root.querySelector("#notesBody");
        body.innerHTML = bodyHtml();
        wireBody(root);
      });
    }

    root.querySelectorAll("[data-cat]").forEach((chip) => {
      chip.addEventListener("click", () => {
        category = chip.getAttribute("data-cat");
        root.querySelectorAll("[data-cat]").forEach((c) => {
          c.classList.toggle("active", c === chip);
        });
        const body = root.querySelector("#notesBody");
        body.innerHTML = bodyHtml();
        wireBody(root);
      });
    });

    const toggle = root.querySelector("[data-toggle-view]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        view = view === "list" ? "board" : "list";
        try { localStorage.setItem("stickly-notes-view", view); } catch (e) { /* ignore */ }
        ctx.rerender();
      });
    }

    root.querySelectorAll("[data-new-note]").forEach((btn) => {
      btn.addEventListener("click", () => ctx.navigate("#/note/new"));
    });

    wireBody(root);
  }

  return { html, mount, cleanup: () => {} };
}
