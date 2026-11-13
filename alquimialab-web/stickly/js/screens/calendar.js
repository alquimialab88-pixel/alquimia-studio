/* ==========================================================================
   Stickly · calendario
   Vistas: día, semana, mes y año.
   ========================================================================== */

import { t, getLang } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import { openTaskSheet } from "./task-sheet.js";

const VIEW_KEY = "stickly-cal-view";
let view = "month";
try {
  const saved = localStorage.getItem(VIEW_KEY);
  if (["day", "week", "month", "year"].indexOf(saved) >= 0) view = saved;
} catch (e) { /* ignore */ }

const now = new Date();
let cursor = new Date(now.getFullYear(), now.getMonth(), 1);
let selected = ui.todayKey();

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function weekStart(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
  return copy;
}

function monthGrid(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const start = addDays(first, -offset);
  return {
    first,
    days: Array.from({ length: 42 }, (_, i) => addDays(start, i))
  };
}

function taskCounts() {
  const counts = new Map();
  for (const task of store.state.tasks) {
    counts.set(task.fecha, (counts.get(task.fecha) || 0) + 1);
  }
  return counts;
}

function tasksFor(key) {
  return store.tasksFor(key);
}

function notesForDay(key) {
  return store.state.notes
    .filter((note) => {
      const stamp = note.updatedAt || note.createdAt || 0;
      return stamp && ui.dateKey(new Date(stamp)) === key;
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 5);
}

function noteTitle(note) {
  if (!note.privada) return note.title || t("titlePlaceholder");
  const payload = store.noteView(note);
  return payload && payload.title ? payload.title : t("notaPrivada");
}

function notePreview(note) {
  if (note.privada) {
    const payload = store.noteView(note);
    return payload ? (payload.content || "").replace(/\s+/g, " ").trim() : t("privateHint");
  }
  if (note.tipo === "checklist" && Array.isArray(note.items) && note.items.length) {
    const done = note.items.filter((item) => item.done).length;
    return done + "/" + note.items.length + " · " + (note.items[0].text || "");
  }
  return (note.content || "").replace(/\s+/g, " ").trim();
}

function taskRow(task, compact) {
  return '<div class="task-row on-board' + (task.hecha ? " done" : "") + '" data-task-row="' + ui.esc(task.id) + '">' +
    '<button type="button" class="check' + (task.hecha ? " on" : "") + '" data-task-check="' + ui.esc(task.id) + '" aria-label="' + ui.esc(t("completed")) + '">' +
      ui.icon("check") + "</button>" +
    '<div class="task-main">' +
      "<h3>" + ui.esc(task.titulo) + "</h3>" +
      (task.materia ? "<p>" + ui.esc(task.materia) + "</p>" : "") +
    "</div>" +
    (compact ? "" :
      '<button type="button" class="icon-btn sm plain" data-task-edit="' + ui.esc(task.id) + '" aria-label="' + ui.esc(t("editar")) + '">' +
        ui.icon("edit", "icon-sm") +
      "</button>" +
      '<button type="button" class="icon-btn sm plain" data-task-del="' + ui.esc(task.id) + '" aria-label="' + ui.esc(t("eliminar")) + '">' +
        ui.icon("trash", "icon-sm") +
      "</button>") +
  "</div>";
}

function noteCard(note) {
  const color = note.color || "#FEF08A";
  return '<button type="button" class="note-mini" style="--note-c:' + ui.esc(color) + '" data-note="' + ui.esc(note.id) + '">' +
    '<span class="note-mini-color"></span>' +
    '<span class="note-mini-main">' +
      "<b>" + ui.esc(noteTitle(note)) + "</b>" +
      "<small>" + ui.esc(notePreview(note) || t("noContent")) + "</small>" +
    "</span>" +
    (note.privada ? ui.icon("lock", "icon-sm") : ui.icon("chevron-right", "icon-sm")) +
  "</button>";
}

function emptyHtml(message) {
  return '<div class="empty" style="padding:26px 16px"><div class="empty-icon">' + ui.icon("file") + "</div>" +
    "<p>" + ui.esc(message) + "</p></div>";
}

function selectedDate() {
  return ui.parseKey(selected);
}

function periodTitle(lang) {
  if (view === "day") return ui.fmtLongDate(selectedDate(), lang);
  if (view === "week") {
    const start = weekStart(selectedDate());
    const end = addDays(start, 6);
    return t("weekOf", { a: ui.fmtShortDate(start, lang), b: ui.fmtShortDate(end, lang) });
  }
  if (view === "year") return String(cursor.getFullYear());
  return ui.fmtMonth(cursor, lang);
}

function movePeriod(direction) {
  if (view === "day") {
    const next = addDays(selectedDate(), direction);
    selected = ui.dateKey(next);
    cursor = new Date(next.getFullYear(), next.getMonth(), 1);
  } else if (view === "week") {
    const next = addDays(selectedDate(), direction * 7);
    selected = ui.dateKey(next);
    cursor = new Date(next.getFullYear(), next.getMonth(), 1);
  } else if (view === "year") {
    cursor = new Date(cursor.getFullYear() + direction, cursor.getMonth(), 1);
  } else {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + direction, 1);
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    selected = ui.dateKey(first);
  }
}

/* ===== Vistas ===== */

function dayView(lang) {
  const date = selectedDate();
  const key = ui.dateKey(date);
  const tasks = tasksFor(key);
  const notes = notesForDay(key);

  const tasksHtml = tasks.length
    ? tasks.map((task) => taskRow(task, false)).join("")
    : emptyHtml(t("sinTareas"));

  const notesHtml = notes.length
    ? notes.map(noteCard).join("")
    : emptyHtml(t("noNotesDay"));

  return '<div class="period-head">' +
      '<button type="button" class="icon-btn sm" data-prev aria-label="' + ui.esc(t("prevMonth")) + '">' + ui.icon("chevron-left", "icon-sm") + "</button>" +
      '<h2 class="period-title">' + ui.esc(ui.fmtLongDate(date, lang)) + "</h2>" +
      '<button type="button" class="icon-btn sm" data-next aria-label="' + ui.esc(t("nextMonth")) + '">' + ui.icon("chevron-right", "icon-sm") + "</button>" +
    "</div>" +
    '<div class="day-view-card">' +
      '<div class="day-section-head"><h3>' + ui.esc(t("tasks")) + " · " + tasks.length + "</h3>" +
        '<button type="button" class="icon-btn sm" data-add-task aria-label="' + ui.esc(t("anadirTarea")) + '">' + ui.icon("plus", "icon-sm") + "</button>" +
      "</div>" +
      '<div class="day-tasks">' + tasksHtml + "</div>" +
      '<div class="day-section-head"><h3>' + ui.esc(t("notesOfDay")) + " · " + notes.length + "</h3>" +
        '<button type="button" class="icon-btn sm" data-new-note aria-label="' + ui.esc(t("nuevaNota")) + '">' + ui.icon("note", "icon-sm") + "</button>" +
      "</div>" +
      '<div class="notes-day">' + notesHtml + "</div>" +
    "</div>";
}

function weekView(lang) {
  const start = weekStart(selectedDate());
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const blocks = days.map((date) => {
    const key = ui.dateKey(date);
    const tasks = tasksFor(key);
    const isSelected = key === selected;
    const isToday = key === ui.todayKey();
    return '<section class="week-block' + (isSelected ? " selected" : "") + (isToday ? " today" : "") + '">' +
      '<button type="button" class="week-block-head" data-open-day="' + key + '">' +
        '<span class="week-block-date"><b>' + date.getDate() + "</b>" + ui.esc(ui.weekdayNarrow(date, lang)) + "</span>" +
        "<span>" + ui.esc(ui.fmtLongDate(date, lang)) + "</span>" +
        '<span class="pill-soft">' + tasks.length + "</span>" +
      "</button>" +
      (tasks.length
        ? '<div class="week-tasks">' + tasks.slice(0, 4).map((task) => taskRow(task, true)).join("") + "</div>"
        : '<p class="week-empty">' + ui.esc(t("sinTareas")) + "</p>") +
    "</section>";
  }).join("");

  return '<div class="period-head">' +
      '<button type="button" class="icon-btn sm" data-prev aria-label="' + ui.esc(t("prevMonth")) + '">' + ui.icon("chevron-left", "icon-sm") + "</button>" +
      '<h2 class="period-title">' + ui.esc(periodTitle(lang)) + "</h2>" +
      '<button type="button" class="icon-btn sm" data-next aria-label="' + ui.esc(t("nextMonth")) + '">' + ui.icon("chevron-right", "icon-sm") + "</button>" +
    "</div>" +
    '<div class="week-list">' + blocks + "</div>";
}

function monthView(lang) {
  const { first, days } = monthGrid(cursor);
  const month = first.getMonth();
  const counts = taskCounts();

  const cells = days.map((date) => {
    const key = ui.dateKey(date);
    const out = date.getMonth() !== month;
    const classes = ["cal-day"];
    if (out) classes.push("out");
    if (key === ui.todayKey()) classes.push("today");
    if (key === selected) classes.push("sel");
    if (counts.has(key)) classes.push("has-tasks");
    return '<button type="button" class="' + classes.join(" ") + '" data-day="' + key + '" ' +
      'aria-label="' + ui.esc(ui.fmtLongDate(date, lang)) + '">' +
      "<span>" + date.getDate() + "</span></button>";
  }).join("");

  const tasks = tasksFor(selected);
  const notes = notesForDay(selected);
  const dayList = tasks.length
    ? tasks.map((task) => taskRow(task, false)).join("")
    : '<p class="subtle" style="padding:8px 2px">' + ui.esc(t("sinTareas")) + "</p>";

  return '<div class="cal-card">' +
      '<div class="cal-head">' +
        '<button type="button" class="icon-btn sm" data-prev aria-label="' + ui.esc(t("prevMonth")) + '">' + ui.icon("chevron-left", "icon-sm") + "</button>" +
        '<span class="cal-month">' + ui.esc(ui.fmtMonth(cursor, lang)) + "</span>" +
        '<button type="button" class="icon-btn sm" data-next aria-label="' + ui.esc(t("nextMonth")) + '">' + ui.icon("chevron-right", "icon-sm") + "</button>" +
      "</div>" +
      '<div class="cal-grid">' +
        Array.from({ length: 7 }, (_, i) => days[i]).map((date) =>
          '<span class="cal-dow">' + ui.esc(ui.weekdayNarrow(date, lang)) + "</span>"
        ).join("") +
        cells +
      "</div>" +
    "</div>" +
    '<div class="day-panel">' +
      '<div class="day-panel-head">' +
        "<h2>" + ui.esc(ui.fmtLongDate(ui.parseKey(selected), lang)) + "</h2>" +
        '<div class="toolbar">' +
          '<button type="button" class="icon-btn sm" data-new-note aria-label="' + ui.esc(t("nuevaNota")) + '">' + ui.icon("note", "icon-sm") + "</button>" +
          '<button type="button" class="icon-btn sm" data-add-task aria-label="' + ui.esc(t("anadirTarea")) + '">' + ui.icon("plus", "icon-sm") + "</button>" +
        "</div>" +
      "</div>" +
      '<div class="day-tasks">' + dayList + "</div>" +
      (notes.length ? '<div class="notes-day-title">' + ui.esc(t("notesOfDay")) + "</div>" +
        '<div class="notes-day">' + notes.map(noteCard).join("") + "</div>" : "") +
    "</div>";
}

function miniMonth(year, month, counts, lang) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  let cells = "";
  for (let i = 0; i < 42; i++) {
    const dayNum = i - offset + 1;
    const inMonth = dayNum >= 1 && dayNum <= total;
    const key = inMonth ? ui.dateKey(new Date(year, month, dayNum)) : "";
    const classes = ["mini-cell"];
    if (!inMonth) classes.push("out");
    if (counts.has(key)) classes.push("has");
    if (key === ui.todayKey()) classes.push("today");
    cells += '<span class="' + classes.join(" ") + '"></span>';
  }
  const monthTasks = Array.from(counts.entries())
    .filter(([key]) => key.startsWith(year + "-" + ui.pad2(month + 1)))
    .reduce((totalCount, entry) => totalCount + entry[1], 0);

  return '<button type="button" class="year-month" data-month="' + month + '">' +
    '<span class="year-month-head"><b>' + ui.esc(ui.fmtMonthShort(new Date(year, month, 1), lang)) + "</b>" +
      "<small>" + monthTasks + "</small></span>" +
    '<span class="mini-cal">' + cells + "</span>" +
  "</button>";
}

function yearView(lang) {
  const year = cursor.getFullYear();
  const counts = taskCounts();
  const months = Array.from({ length: 12 }, (_, m) => miniMonth(year, m, counts, lang)).join("");
  return '<div class="period-head">' +
      '<button type="button" class="icon-btn sm" data-prev aria-label="' + ui.esc(t("prevMonth")) + '">' + ui.icon("chevron-left", "icon-sm") + "</button>" +
      '<h2 class="period-title">' + year + "</h2>" +
      '<button type="button" class="icon-btn sm" data-next aria-label="' + ui.esc(t("nextMonth")) + '">' + ui.icon("chevron-right", "icon-sm") + "</button>" +
    "</div>" +
    '<div class="year-grid">' + months + "</div>";
}

export async function render(ctx) {
  const lang = getLang();
  const dateParam = ctx.params.query.get("date");

  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    selected = dateParam;
    const d = ui.parseKey(dateParam);
    cursor = new Date(d.getFullYear(), d.getMonth(), 1);
  }

  const total = store.state.tasks.length;
  const views = [
    { id: "day", label: t("viewDay") },
    { id: "week", label: t("viewWeek") },
    { id: "month", label: t("viewMonth") },
    { id: "year", label: t("viewYear") }
  ];

  const body = view === "day" ? dayView(lang)
    : view === "week" ? weekView(lang)
    : view === "year" ? yearView(lang)
    : monthView(lang);

  const html =
    '<div class="page-head">' +
      '<div><h1 class="page-title">' + ui.esc(t("tabCalendario")) + "</h1>" +
        '<span class="subtle">' + ui.esc(t("taskCount", { n: total })) + "</span></div>" +
      '<button type="button" class="btn btn-ghost" data-today style="min-height:38px;padding:8px 14px;font-size:12px">' +
        ui.esc(t("hoy")) + "</button>" +
    "</div>" +

    '<div class="segmented four cal-views" role="tablist">' +
      views.map((item) =>
        '<button type="button" class="' + (view === item.id ? "active" : "") + '" data-view="' + item.id + '">' +
          ui.esc(item.label) + "</button>"
      ).join("") +
    "</div>" +

    body +
    '<button type="button" class="fab" data-add-task aria-label="' + ui.esc(t("anadirTarea")) + '">' + ui.icon("plus") + "</button>";

  function mount(root) {
    root.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        view = btn.getAttribute("data-view");
        try { localStorage.setItem(VIEW_KEY, view); } catch (e) { /* ignore */ }
        if (view !== "year") {
          const d = selectedDate();
          cursor = new Date(d.getFullYear(), d.getMonth(), 1);
        }
        ctx.rerender();
      });
    });

    root.querySelectorAll("[data-day]").forEach((cell) => {
      cell.addEventListener("click", () => {
        const key = cell.getAttribute("data-day");
        selected = key;
        const date = ui.parseKey(key);
        cursor = new Date(date.getFullYear(), date.getMonth(), 1);
        ctx.rerender();
      });
    });

    root.querySelectorAll("[data-open-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selected = btn.getAttribute("data-open-day");
        const date = ui.parseKey(selected);
        cursor = new Date(date.getFullYear(), date.getMonth(), 1);
        view = "day";
        try { localStorage.setItem(VIEW_KEY, view); } catch (e) { /* ignore */ }
        ctx.rerender();
      });
    });

    root.querySelectorAll("[data-month]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const month = Number(btn.getAttribute("data-month"));
        cursor = new Date(cursor.getFullYear(), month, 1);
        selected = ui.dateKey(new Date(cursor.getFullYear(), month, 1));
        view = "month";
        try { localStorage.setItem(VIEW_KEY, view); } catch (e) { /* ignore */ }
        ctx.rerender();
      });
    });

    root.querySelectorAll("[data-prev]").forEach((btn) => {
      btn.addEventListener("click", () => { movePeriod(-1); ctx.rerender(); });
    });
    root.querySelectorAll("[data-next]").forEach((btn) => {
      btn.addEventListener("click", () => { movePeriod(1); ctx.rerender(); });
    });

    root.querySelector("[data-today]").addEventListener("click", () => {
      const todayDate = new Date();
      cursor = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
      selected = ui.todayKey();
      ctx.rerender();
    });

    root.querySelectorAll("[data-add-task]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openTaskSheet({ date: selected, onDone: () => ctx.rerender() });
      });
    });

    root.querySelectorAll("[data-new-note]").forEach((btn) => {
      btn.addEventListener("click", () => ctx.navigate("#/note/new"));
    });

    root.querySelectorAll("[data-task-row]").forEach((row) => {
      row.addEventListener("click", async (e) => {
        if (e.target.closest("[data-task-edit]") || e.target.closest("[data-task-del]") || e.target.closest("[data-task-check]")) return;
        await store.toggleTask(row.getAttribute("data-task-row"));
        ctx.rerender();
      });
    });

    root.querySelectorAll("[data-task-check]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await store.toggleTask(btn.getAttribute("data-task-check"));
        ctx.rerender();
      });
    });

    root.querySelectorAll("[data-task-edit]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const task = store.state.tasks.find((item) => item.id === btn.getAttribute("data-task-edit"));
        if (task) openTaskSheet({ task, onDone: () => ctx.rerender() });
      });
    });

    root.querySelectorAll("[data-task-del]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const ok = await ui.confirmDialog({
          title: t("deleteTask"),
          ok: t("eliminar"),
          cancel: t("cancelar"),
          danger: true
        });
        if (!ok) return;
        await store.deleteTask(btn.getAttribute("data-task-del"));
        ui.toast(t("deleteAllDone"));
        ctx.rerender();
      });
    });

    root.querySelectorAll("[data-note]").forEach((card) => {
      card.addEventListener("click", () => {
        ctx.navigate("#/note/" + encodeURIComponent(card.getAttribute("data-note")));
      });
    });
  }

  return { html, mount, cleanup: () => {} };
}
