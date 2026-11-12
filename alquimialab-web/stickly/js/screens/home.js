/* ==========================================================================
   Stickly · inicio
   ========================================================================== */

import { t, getLang } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import { openTaskSheet } from "./task-sheet.js";
import { ensureUnlocked } from "../pin.js";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return t("buenosDias");
  if (hour < 20) return t("buenasTardes");
  return t("buenasNoches");
}

function notePreview(note) {
  if (note.privada) {
    const payload = store.noteView(note);
    if (!payload) {
      return {
        title: t("notaPrivada"),
        text: t("privateHint"),
        locked: true
      };
    }
    return {
      title: payload.title || t("notaPrivada"),
      text: previewOf(payload),
      locked: false
    };
  }
  return {
    title: note.title || t("titlePlaceholder"),
    text: previewOf(note),
    locked: false
  };
}

function previewOf(payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length) {
    const first = items.find((item) => !item.done) || items[0];
    return items.length + " · " + (first && first.text ? first.text : "");
  }
  return (payload.content || "").replace(/\s+/g, " ").trim();
}

export async function render(ctx) {
  const lang = getLang();
  const today = ui.todayKey();
  const tasks = store.tasksFor(today);
  const pending = tasks.filter((task) => !task.hecha).length;
  const completed = tasks.filter((task) => task.hecha).length;
  const name = (store.state.profile.name || "").trim();
  const initial = (name ? name.charAt(0) : "S").toUpperCase();

  const important = store.state.notes
    .filter((note) => (note.categoria || "importante") === "importante")
    .slice(0, 3);

  const taskHtml = tasks.length
    ? tasks.slice(0, 5).map((task) => (
      '<button type="button" class="task-row' + (task.hecha ? " done" : "") + '" data-task="' + ui.esc(task.id) + '">' +
        '<span class="check' + (task.hecha ? " on" : "") + '">' + ui.icon("check") + "</span>" +
        '<span class="task-main">' +
          "<h3>" + ui.esc(task.titulo) + "</h3>" +
          (task.materia ? "<p>" + ui.esc(task.materia) + "</p>" : "") +
        "</span>" +
      "</button>"
    )).join("")
    : '<p class="subtle" style="padding:6px 2px 2px">' + ui.esc(t("sinTareas")) + "</p>";

  const notesHtml = important.length
    ? important.map((note) => {
      const preview = notePreview(note);
      const color = note.color || "var(--yellow)";
      return '<button type="button" class="mini-note" style="--note-c:' + ui.esc(color) + '" data-note="' + ui.esc(note.id) + '">' +
        '<span class="mini-dot"></span>' +
        '<span class="mini-main"><h3>' + ui.esc(preview.title) + "</h3>" +
          "<p>" + ui.esc(preview.text || t("noContent")) + "</p></span>" +
        (preview.locked ? ui.icon("lock", "icon-sm") : ui.icon("chevron-right", "icon-sm")) +
      "</button>";
    }).join("")
    : '<div class="empty" style="padding:26px 10px"><div class="empty-icon">' + ui.icon("note") + "</div>" +
      "<p>" + ui.esc(t("sinNotasImp")) + "</p></div>";

  const html =
    '<div class="home-top">' +
      "<div>" +
        '<span class="eyebrow">' + ui.esc(greeting()) + "</span>" +
        "<h1>" + ui.esc(name || t("tuNombre")) + "</h1>" +
        '<span class="home-date">' + ui.esc(ui.fmtLongDate(new Date(), lang)) + "</span>" +
      "</div>" +
      '<button type="button" class="avatar" data-go="#/menu" aria-label="' + ui.esc(t("tabPerfil")) + '">' +
        ui.esc(initial) +
      "</button>" +
    "</div>" +

    '<section class="hero-card" aria-label="' + ui.esc(t("hoy")) + '">' +
      '<div class="hero-top">' +
        "<div>" +
          '<span class="eyebrow">' + ui.esc(t("hoy")) + "</span>" +
          "<h2>" + ui.esc(t("cosasHacerHoy")) + "</h2>" +
        "</div>" +
        '<button type="button" class="icon-btn hero-add" data-add-task aria-label="' + ui.esc(t("anadirTarea")) + '">' +
          ui.icon("plus") +
        "</button>" +
      "</div>" +
      '<div class="task-list">' + taskHtml + "</div>" +
      '<div class="hero-stats">' +
        '<div class="hero-stat"><b>' + pending + "</b><span>" + ui.esc(t("pending")) + "</span></div>" +
        '<div class="hero-stat"><b>' + completed + "</b><span>" + ui.esc(t("completed")) + "</span></div>" +
        '<div class="hero-stat"><b>' + store.state.notes.length + "</b><span>" + ui.esc(t("notas")) + "</span></div>" +
      "</div>" +
    "</section>" +

    (store.hasPin() ? "" :
      '<button type="button" class="security-cta mt-14" data-create-pin>' +
        '<span class="menu-icon">' + ui.icon("shield") + "</span>" +
        '<span class="sc-main"><b>' + ui.esc(t("pinNotSet")) + "</b>" +
          "<small>" + ui.esc(t("vaultHelp")) + "</small></span>" +
        ui.icon("chevron-right", "chev") +
      "</button>") +

    '<div class="section-head"><h2 class="section-title">' + ui.esc(t("quickActions")) + "</h2></div>" +
    '<div class="quick-grid">' +
      '<a class="quick-tile" href="#/notes">' +
        '<span class="quick-icon">' + ui.icon("note") + "</span>" + ui.esc(t("notas")) + "</a>" +
      '<a class="quick-tile" href="#/notebooks">' +
        '<span class="quick-icon pink">' + ui.icon("book") + "</span>" + ui.esc(t("cuadernos")) + "</a>" +
      '<a class="quick-tile" href="#/passwords">' +
        '<span class="quick-icon blue">' + ui.icon("key") + "</span>" + ui.esc(t("contrasenas")) + "</a>" +
      '<a class="quick-tile" href="#/timer">' +
        '<span class="quick-icon orange">' + ui.icon("timer") + "</span>" + ui.esc(t("tabCronometro")) + "</a>" +
    "</div>" +

    '<div class="section-head">' +
      '<h2 class="section-title">' + ui.esc(t("notasImportantes")) + "</h2>" +
      '<button type="button" class="link-more" data-go="#/notes">' + ui.esc(t("all")) + "</button>" +
    "</div>" +
    '<div class="mini-notes">' + notesHtml + "</div>" +
    '<div style="height:10px"></div>';

  function mount(root) {
    root.querySelectorAll("[data-task]").forEach((row) => {
      row.addEventListener("click", async () => {
        await store.toggleTask(row.getAttribute("data-task"));
        ctx.rerender();
      });
    });

    root.querySelectorAll("[data-note]").forEach((card) => {
      card.addEventListener("click", () => {
        ctx.navigate("#/note/" + encodeURIComponent(card.getAttribute("data-note")));
      });
    });

    root.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => ctx.navigate(btn.getAttribute("data-go")));
    });

    root.querySelectorAll("[data-add-task]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openTaskSheet({ date: today, onDone: () => ctx.rerender() });
      });
    });

    const pinBtn = root.querySelector("[data-create-pin]");
    if (pinBtn) {
      pinBtn.addEventListener("click", async () => {
        const ok = await ensureUnlocked();
        if (ok) ctx.rerender();
      });
    }
  }

  return { html, mount, cleanup: () => {} };
}
