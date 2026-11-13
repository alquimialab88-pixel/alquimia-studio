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

function stickyTilt(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 997;
  return (((hash % 5) - 2) * 0.43).toFixed(2);
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
    ? '<ul>' + data.items.slice(0, 5).map((item) => (
      '<li class="' + (item.done ? "done" : "") + '">' +
        ui.icon(item.done ? "check-circle" : "check") +
        "<span>" + ui.esc(item.text || "") + "</span></li>"
    )).join("") + "</ul>"
    : "<p>" + ui.esc(previewText(data) || t("noContent")) + "</p>";

  return '<div class="sticky" role="button" tabindex="0" style="--note-c:' + ui.esc(color) +
      ';--tilt:' + stickyTilt(note.id) + 'deg" data-note="' + ui.esc(note.id) + '">' +
    (note.privada ? '<span class="sticky-lock">' + ui.icon("lock") + "</span>" : "") +
    image +
    "<h3>" + ui.esc(data.title) + "</h3>" +
    list +
    '<div class="sticky-meta">' + ui.esc(categoryLabel(note.categoria || "importante")) + "</div>" +
  "</div>";
}

function boardHtml(list) {
  return '<p class="board-hint">' + ui.icon("grid", "icon-sm") + "<span>" + ui.esc(t("boardHint")) + "</span></p>" +
    '<div class="note-board" id="noteBoard">' + list.map(stickyHtml).join("") + "</div>";
}

const BOARD_GAP = 12;

function layoutBoard(root) {
  const board = root.querySelector("#noteBoard");
  if (!board) return;
  const cards = Array.from(board.querySelectorAll(".sticky"));
  if (!cards.length) {
    board.style.height = "";
    return;
  }
  const gap = BOARD_GAP;
  const width = board.clientWidth || 320;
  const cardW = Math.max(118, Math.min(168, Math.floor((width - gap) / 2)));
  cards.forEach((card) => { card.style.width = cardW + "px"; });

  const items = cards.map((card) => {
    const id = card.getAttribute("data-note");
    return {
      card,
      id,
      note: store.state.notes.find((n) => n.id === id) || null,
      height: card.offsetHeight || 150
    };
  });

  const colY = [0, 0];
  items.forEach((item) => {
    if (!item.note || !item.note.pos || typeof item.note.x !== "number") return;
    const col = item.note.x < width / 2 ? 0 : 1;
    colY[col] = Math.max(colY[col], (item.note.y || 0) + item.height + gap);
  });

  const pending = [];
  items.forEach((item) => {
    const note = item.note;
    if (note && note.pos && typeof note.x === "number" && typeof note.y === "number") {
      const left = Math.max(0, Math.min(note.x, width - cardW));
      item.card.style.left = left + "px";
      item.card.style.top = Math.max(0, note.y) + "px";
    } else {
      const col = colY[0] <= colY[1] ? 0 : 1;
      const left = col * (cardW + gap);
      const top = colY[col];
      item.card.style.left = left + "px";
      item.card.style.top = top + "px";
      colY[col] = top + item.height + gap;
      if (item.id) pending.push({ id: item.id, left, top });
    }
    item.card.classList.add("placed");
  });

  const bottom = items.reduce((max, item) => {
    return Math.max(max, (parseFloat(item.card.style.top) || 0) + item.height);
  }, 0);
  board.style.height = Math.max(320, bottom + 48) + "px";

  pending.forEach((pos) => {
    store.setNotePosition(pos.id, pos.left, pos.top, cardW).catch(() => {});
  });
}

function wireBoard(root) {
  const board = root.querySelector("#noteBoard");
  if (!board) return;
  let drag = null;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  board.addEventListener("dragstart", (e) => e.preventDefault());

  board.addEventListener("pointerdown", (e) => {
    const card = e.target.closest(".sticky");
    if (!card || (e.button && e.button > 0)) return;
    if (e.target.closest("button, a, input")) return;
    drag = {
      card,
      id: card.getAttribute("data-note"),
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: parseFloat(card.style.left) || 0,
      originY: parseFloat(card.style.top) || 0,
      moved: false
    };
    card.classList.add("pressing");
    try { card.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });

  board.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 7) return;
    if (!drag.moved) {
      drag.moved = true;
      drag.card.classList.add("dragging");
    }
    e.preventDefault();
    const desiredY = drag.originY + dy;
    const minHeight = desiredY + drag.card.offsetHeight + 40;
    if (minHeight > board.clientHeight) board.style.height = minHeight + "px";
    const maxX = Math.max(0, board.clientWidth - drag.card.offsetWidth);
    const maxY = Math.max(0, board.clientHeight - drag.card.offsetHeight - 20);
    drag.card.style.left = clamp(drag.originX + dx, 0, maxX) + "px";
    drag.card.style.top = clamp(desiredY, 0, maxY) + "px";
  }, { passive: false });

  const finish = (e) => {
    if (!drag || (e && e.pointerId !== drag.pointerId)) return;
    const { card, id, moved } = drag;
    card.classList.remove("pressing", "dragging");
    if (moved) {
      card.dataset.suppress = "1";
      setTimeout(() => { delete card.dataset.suppress; }, 260);
      store.setNotePosition(
        id,
        parseFloat(card.style.left) || 0,
        parseFloat(card.style.top) || 0,
        card.offsetWidth
      ).catch(() => {});
    }
    drag = null;
  };

  board.addEventListener("pointerup", finish);
  board.addEventListener("pointercancel", finish);
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
  return boardHtml(list);
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
        if (card.dataset.suppress === "1") {
          delete card.dataset.suppress;
          return;
        }
        open(card.getAttribute("data-note"));
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(card.getAttribute("data-note"));
        }
      });
    });

    wireBoard(body);
    layoutBoard(root);

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

  let onResize = null;

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

    onResize = () => layoutBoard(root);
    window.addEventListener("resize", onResize);
  }

  return {
    html,
    mount,
    cleanup: () => {
      if (onResize) window.removeEventListener("resize", onResize);
      onResize = null;
    }
  };
}
