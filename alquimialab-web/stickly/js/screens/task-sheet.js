/* ==========================================================================
   Stickly · hoja para crear o editar una tarea
   ========================================================================== */

import { t } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";

export function openTaskSheet(options) {
  const opts = options || {};
  const task = opts.task || null;
  const isEdit = !!task;
  const date = opts.date || (task && task.fecha) || ui.todayKey();

  const sheet = ui.openSheet(
    "<h2>" + ui.esc(isEdit ? t("editTask") : t("nuevaTarea")) + "</h2>" +
    '<p class="sheet-sub">' + ui.esc(ui.fmtLongDate(ui.parseKey(date), uiLang())) + "</p>" +
    '<label class="field"><span>' + ui.esc(t("titulo")) + "</span>" +
      '<input id="tsTitle" class="input" type="text" maxlength="120" autocomplete="off" ' +
        'value="' + ui.esc(task ? task.titulo : "") + '" placeholder="' + ui.esc(t("anadirTarea")) + '"></label>' +
    '<label class="field"><span>' + ui.esc(t("materia")) + "</span>" +
      '<input id="tsSubject" class="input" type="text" maxlength="80" autocomplete="off" ' +
        'value="' + ui.esc(task ? task.materia : "") + '" placeholder="' + ui.esc(t("subjectPlaceholder")) + '"></label>' +
    '<label class="field"><span>' + ui.esc(t("tabCalendario")) + "</span>" +
      '<input id="tsDate" class="input" type="date" value="' + ui.esc(date) + '"></label>' +
    '<div class="sheet-actions">' +
      (isEdit ? '<button type="button" class="btn btn-danger" data-del>' + ui.esc(t("eliminar")) + "</button>" : "") +
      '<button type="button" class="btn btn-ghost" data-cancel>' + ui.esc(t("cancelar")) + "</button>" +
      '<button type="button" class="btn btn-primary" data-save>' + ui.esc(t("guardar")) + "</button>" +
    "</div>"
  );

  const titleInput = sheet.querySelector("#tsTitle");
  const subjectInput = sheet.querySelector("#tsSubject");
  const dateInput = sheet.querySelector("#tsDate");

  const save = async () => {
    const titulo = titleInput.value.trim();
    if (!titulo) {
      ui.toast(t("anadirTarea"));
      titleInput.focus();
      return;
    }
    await store.saveTask({
      id: task ? task.id : null,
      titulo,
      materia: subjectInput.value,
      fecha: dateInput.value || ui.todayKey(),
      hecha: task ? task.hecha : false,
      timestamp: task ? task.timestamp : Date.now()
    });
    sheet.close();
    ui.toast(t("saved"));
    if (opts.onDone) opts.onDone();
  };

  sheet.querySelector("[data-save]").addEventListener("click", save);
  sheet.querySelector("[data-cancel]").addEventListener("click", () => sheet.close());
  const del = sheet.querySelector("[data-del]");
  if (del) {
    del.addEventListener("click", async () => {
      const ok = await ui.confirmDialog({
        title: t("deleteTask"),
        ok: t("eliminar"),
        cancel: t("cancelar"),
        danger: true
      });
      if (!ok) return;
      await store.deleteTask(task.id);
      sheet.close();
      ui.toast(t("deleteAllDone"));
      if (opts.onDone) opts.onDone();
    });
  }

  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
  });

  setTimeout(() => {
    titleInput.focus();
    titleInput.select();
  }, 120);
}

function uiLang() {
  try {
    return document.documentElement.lang || "es";
  } catch (e) {
    return "es";
  }
}
