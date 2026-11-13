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

function previewOf(payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length) {
    const first = items.find((item) => !item.done) || items[0];
    return items.length + " · " + (first && first.text ? first.text : "");
  }
  return (payload.content || "").replace(/\s+/g, " ").trim();
}

function notePreview(note) {
  if (note.privada) {
    const payload = store.noteView(note);
    if (!payload) {
      return { title: t("notaPrivada"), text: t("privateHint"), locked: true };
    }
    return { title: payload.title || t("notaPrivada"), text: previewOf(payload), locked: false };
  }
  return { title: note.title || t("titlePlaceholder"), text: previewOf(note), locked: false };
}

function weekDays(lang) {
  const now = new Date();
  const offset = (now.getDay() + 6) % 7; // lunes = 0
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
  const counts = new Map();
  for (const task of store.state.tasks) {
    counts.set(task.fecha, (counts.get(task.fecha) || 0) + 1);
  }
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = ui.dateKey(date);
    return {
      key,
      date,
      label: ui.weekdayNarrow(date, lang),
      number: date.getDate(),
      today: key === ui.todayKey(),
      tasks: counts.get(key) || 0
    };
  });
}

function avatarHtml() {
  const photo = store.state.profile.photo;
  if (photo) {
    return '<img src="' + ui.esc(photo) + '" alt="">';
  }
  const name = (store.state.profile.name || "").trim();
  return ui.esc((name ? name.charAt(0) : "S").toUpperCase());
}

export async function render(ctx) {
  const lang = getLang();
  const today = ui.todayKey();
  const tasks = store.tasksFor(today);
  const name = (store.state.profile.name || "").trim();

  const important = store.state.notes
    .filter((note) => (note.categoria || "importante") === "importante")
    .slice(0, 3);

  const weekHtml = weekDays(lang).map((day) => (
    '<a class="week-day' + (day.today ? " active" : "") + (day.tasks ? " has-tasks" : "") + '" ' +
      'href="#/calendar?date=' + ui.esc(day.key) + '" aria-label="' + ui.esc(ui.fmtLongDate(day.date, lang)) + '">' +
      '<span class="wd-letter">' + ui.esc(day.label) + "</span>" +
      '<span class="wd-num">' + day.number + "</span>" +
    "</a>"
  )).join("");

  const taskHtml = tasks.length
    ? tasks.slice(0, 6).map((task) => (
      '<button type="button" class="task-row' + (task.hecha ? " done" : "") + '" data-task="' + ui.esc(task.id) + '">' +
        '<span class="check' + (task.hecha ? " on" : "") + '">' + ui.icon("check") + "</span>" +
        '<span class="task-main">' +
          "<h3>" + ui.esc(task.titulo) + "</h3>" +
          (task.materia ? "<p>" + ui.esc(task.materia) + "</p>" : "") +
        "</span>" +
      "</button>"
    )).join("")
    : '<p class="subtle" style="padding:8px 2px 2px">' + ui.esc(t("sinTareas")) + "</p>";

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
    : '<div class="empty" style="padding:24px 10px"><div class="empty-icon">' + ui.icon("note") + "</div>" +
      "<p>" + ui.esc(t("sinNotasImp")) + "</p></div>";

  const quick = [
    { href: "#/notes", icon: "note", label: t("notas"), tone: "" },
    { href: "#/notebooks", icon: "book", label: t("cuadernos"), tone: "pink" },
    { href: "#/passwords", icon: "key", label: t("contrasenas"), tone: "blue" },
    { href: "#/timer", icon: "timer", label: t("tabCronometro"), tone: "orange" },
    { href: "#/calendar", icon: "calendar", label: t("tabCalendario"), tone: "green" },
    { href: "#/settings?focus=data", icon: "download", label: t("backup"), tone: "" },
    { href: "#/settings", icon: "settings", label: t("config"), tone: "pink" },
    { href: "#/profile", icon: "user", label: t("tabPerfil"), tone: "blue" }
  ];

  const quickHtml = quick.map((item) => (
    '<a class="quick-tile" href="' + item.href + '">' +
      '<span class="quick-icon ' + item.tone + '">' + ui.icon(item.icon) + "</span>" +
      "<span>" + ui.esc(item.label) + "</span>" +
    "</a>"
  )).join("");

  const html =
    '<div class="home-top">' +
      "<div>" +
        '<span class="eyebrow">' + ui.esc(greeting()) + "</span>" +
        "<h1>" + ui.esc(name || t("tuNombre")) + "</h1>" +
        '<span class="home-date">' + ui.esc(ui.fmtLongDate(new Date(), lang)) + "</span>" +
      "</div>" +
      '<button type="button" class="avatar" data-go="#/profile" aria-label="' + ui.esc(t("tabPerfil")) + '">' +
        avatarHtml() +
      "</button>" +
    "</div>" +

    '<nav class="week-strip" aria-label="' + ui.esc(t("tabCalendario")) + '">' + weekHtml + "</nav>" +

    '<section class="home-block">' +
      '<div class="home-block-head">' +
        "<div>" +
          '<span class="eyebrow">' + ui.esc(t("hoy")) + "</span>" +
          "<h2>" + ui.esc(t("cosasHacerHoy")) + "</h2>" +
        "</div>" +
        '<button type="button" class="icon-btn hero-add" data-add-task aria-label="' + ui.esc(t("anadirTarea")) + '">' +
          ui.icon("plus") +
        "</button>" +
      "</div>" +
      '<div class="task-list home-tasks">' + taskHtml + "</div>" +
    "</section>" +

    (store.hasPin() ? "" :
      '<button type="button" class="security-cta" data-create-pin>' +
        '<span class="menu-icon">' + ui.icon("shield") + "</span>" +
        '<span class="sc-main"><b>' + ui.esc(t("pinNotSet")) + "</b>" +
          "<small>" + ui.esc(t("vaultHelp")) + "</small></span>" +
        ui.icon("chevron-right", "chev") +
      "</button>") +

    '<div class="section-head">' +
      '<h2 class="section-title">' + ui.esc(t("notasImportantes")) + "</h2>" +
      '<button type="button" class="link-more" data-go="#/notes">' + ui.esc(t("all")) + "</button>" +
    "</div>" +
    '<div class="mini-notes">' + notesHtml + "</div>" +

    '<div class="section-head"><h2 class="section-title">' + ui.esc(t("quickActions")) + "</h2></div>" +
    '<div class="quick-scroll">' + quickHtml + "</div>" +
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
