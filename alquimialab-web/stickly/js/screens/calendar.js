/* ==========================================================================
   Stickly · calendario y tareas
   ========================================================================== */

import { t, getLang } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import { openTaskSheet } from "./task-sheet.js";

const now = new Date();
let cursor = new Date(now.getFullYear(), now.getMonth(), 1);
let selected = ui.todayKey();

function monthGrid() {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // lunes = 0
  const start = new Date(first);
  start.setDate(first.getDate() - offset);

  const days = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    days.push(date);
  }
  return { first, days };
}

function weekdayLabels(lang) {
  const base = new Date(2024, 0, 1); // lunes
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    return ui.weekdayNarrow(date, lang);
  });
}

function taskRow(task, ctx) {
  return '<div class="task-row on-board' + (task.hecha ? " done" : "") + '" data-task-toggle="' + ui.esc(task.id) + '">' +
    '<button type="button" class="check' + (task.hecha ? " on" : "") + '" data-task-check="' + ui.esc(task.id) + '" aria-label="' + ui.esc(t("completed")) + '">' +
      ui.icon("check") + "</button>" +
    '<div class="task-main">' +
      "<h3>" + ui.esc(task.titulo) + "</h3>" +
      (task.materia ? "<p>" + ui.esc(task.materia) + "</p>" : "") +
    "</div>" +
    '<button type="button" class="icon-btn sm plain" data-task-edit="' + ui.esc(task.id) + '" aria-label="' + ui.esc(t("editar")) + '">' +
      ui.icon("edit", "icon-sm") + "</button>" +
    '<button type="button" class="icon-btn sm plain" data-task-del="' + ui.esc(task.id) + '" aria-label="' + ui.esc(t("eliminar")) + '">' +
      ui.icon("trash", "icon-sm") + "</button>" +
  "</div>";
}

export async function render(ctx) {
  const lang = getLang();
  const today = ui.todayKey();
  const dateParam = ctx.params.query.get("date");

  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    selected = dateParam;
    const d = ui.parseKey(dateParam);
    cursor = new Date(d.getFullYear(), d.getMonth(), 1);
  }

  const { first, days } = monthGrid();
  const month = first.getMonth();

  const counts = new Map();
  for (const task of store.state.tasks) {
    counts.set(task.fecha, (counts.get(task.fecha) || 0) + 1);
  }

  const cells = days.map((date) => {
    const key = ui.dateKey(date);
    const out = date.getMonth() !== month;
    const classes = ["cal-day"];
    if (out) classes.push("out");
    if (key === today) classes.push("today");
    if (key === selected) classes.push("sel");
    if (counts.has(key)) classes.push("has-tasks");
    return '<button type="button" class="' + classes.join(" ") + '" data-day="' + key + '" ' +
      'aria-label="' + ui.esc(ui.fmtLongDate(date, lang)) + '">' +
      "<span>" + date.getDate() + "</span></button>";
  }).join("");

  const dayTasks = store.tasksFor(selected);
  const dayList = dayTasks.length
    ? dayTasks.map((task) => taskRow(task, ctx)).join("")
    : '<p class="subtle" style="padding:8px 2px">' + ui.esc(t("sinTareas")) + "</p>";

  const html =
    '<div class="page-head">' +
      '<div><h1 class="page-title">' + ui.esc(t("tabCalendario")) + "</h1>" +
        '<span class="subtle">' + ui.esc(t("taskCount", { n: store.state.tasks.length })) + "</span></div>" +
      '<button type="button" class="btn btn-ghost" data-today style="min-height:38px;padding:8px 14px;font-size:12px">' +
        ui.esc(t("hoy")) + "</button>" +
    "</div>" +

    '<div class="cal-card">' +
      '<div class="cal-head">' +
        '<button type="button" class="icon-btn sm" data-prev aria-label="' + ui.esc(t("prevMonth")) + '">' + ui.icon("chevron-left", "icon-sm") + "</button>" +
        '<span class="cal-month">' + ui.esc(ui.fmtMonth(cursor, lang)) + "</span>" +
        '<button type="button" class="icon-btn sm" data-next aria-label="' + ui.esc(t("nextMonth")) + '">' + ui.icon("chevron-right", "icon-sm") + "</button>" +
      "</div>" +
      '<div class="cal-grid">' +
        weekdayLabels(lang).map((label) => '<span class="cal-dow">' + ui.esc(label) + "</span>").join("") +
        cells +
      "</div>" +
    "</div>" +

    '<div class="day-panel">' +
      '<div class="day-panel-head">' +
        "<h2>" + ui.esc(ui.fmtLongDate(ui.parseKey(selected), lang)) + "</h2>" +
        '<button type="button" class="icon-btn sm" data-add-task aria-label="' + ui.esc(t("anadirTarea")) + '">' + ui.icon("plus", "icon-sm") + "</button>" +
      "</div>" +
      '<div class="day-tasks">' + dayList + "</div>" +
    "</div>" +

    '<button type="button" class="fab" data-add-task aria-label="' + ui.esc(t("anadirTarea")) + '">' + ui.icon("plus") + "</button>";

  function mount(root) {
    root.querySelectorAll("[data-day]").forEach((cell) => {
      cell.addEventListener("click", () => {
        const key = cell.getAttribute("data-day");
        selected = key;
        const date = ui.parseKey(key);
        cursor = new Date(date.getFullYear(), date.getMonth(), 1);
        ctx.rerender();
      });
    });

    root.querySelector("[data-prev]").addEventListener("click", () => {
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
      selected = ui.dateKey(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
      ctx.rerender();
    });

    root.querySelector("[data-next]").addEventListener("click", () => {
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      selected = ui.dateKey(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
      ctx.rerender();
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

    root.querySelectorAll("[data-task-toggle]").forEach((row) => {
      row.addEventListener("click", async (e) => {
        if (e.target.closest("[data-task-edit]") || e.target.closest("[data-task-del]") || e.target.closest("[data-task-check]")) return;
        await store.toggleTask(row.getAttribute("data-task-toggle"));
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
  }

  return { html, mount, cleanup: () => {} };
}
