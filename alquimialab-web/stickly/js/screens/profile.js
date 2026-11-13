/* ==========================================================================
   Stickly · perfil
   ========================================================================== */

import { t } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import { ensureUnlocked } from "../pin.js";

export async function render(ctx) {
  const name = (store.state.profile.name || "").trim();
  const photo = store.state.profile.photo || null;
  const initial = (name ? name.charAt(0) : "S").toUpperCase();
  const pendingTasks = store.state.tasks.filter((task) => !task.hecha).length;

  const avatar = photo
    ? '<img src="' + ui.esc(photo) + '" alt="">'
    : ui.esc(initial);

  const stat = (value, label) =>
    '<div class="stat-card"><b>' + value + "</b><span>" + ui.esc(label) + "</span></div>";

  const html =
    '<div class="editor-head">' +
      '<button type="button" class="icon-btn" data-back aria-label="' + ui.esc(t("tabMenu")) + '">' + ui.icon("back") + "</button>" +
      '<span class="editor-head-mid">' + ui.esc(t("tabPerfil")) + "</span>" +
      '<span style="width:42px"></span>' +
    "</div>" +

    '<div class="profile-photo-card">' +
      '<button type="button" class="profile-avatar big" data-pick-photo aria-label="' + ui.esc(t("changePhoto")) + '">' + avatar + "</button>" +
      "<h2>" + ui.esc(name || t("tuNombre")) + "</h2>" +
      "<p>Stickly · Alquimia Lab</p>" +
    "</div>" +

    '<div class="photo-actions">' +
      '<button type="button" class="btn btn-ghost" data-pick-photo>' + ui.icon("image", "icon-sm") + " " + ui.esc(t("changePhoto")) + "</button>" +
      (photo ? '<button type="button" class="btn btn-ghost" data-remove-photo>' + ui.esc(t("removePhoto")) + "</button>" : "") +
    "</div>" +
    '<p class="photo-hint">' + ui.icon("shield", "icon-sm") + ui.esc(t("photoHint")) + "</p>" +

    '<label class="field"><span>' + ui.esc(t("nombre")) + "</span>" +
      '<input id="profileName" class="input" type="text" maxlength="60" autocomplete="off" ' +
        'value="' + ui.esc(name) + '" placeholder="' + ui.esc(t("tuNombre")) + '"></label>' +
    '<button type="button" class="btn btn-primary btn-block" data-save-name>' + ui.esc(t("guardar")) + "</button>" +

    '<div class="section-head"><h2 class="section-title">' + ui.esc(t("summary")) + "</h2></div>" +
    '<div class="stats-grid">' +
      stat(store.state.notes.length, t("notas")) +
      stat(pendingTasks, t("pending")) +
      stat(store.state.notebooks.length, t("cuadernos")) +
      stat(store.state.passwords.length, t("contrasenas")) +
    "</div>" +

    '<div class="setting-card mt-20"><div class="setting-row">' +
      '<span class="icon-lead">' + ui.icon("shield") + "</span>" +
      '<span class="label">' + ui.esc(store.hasPin() ? t("pinSet") : t("pinNotSet")) +
        "<small>" + ui.esc(t("dataHelp")) + "</small></span>" +
      (store.hasPin()
        ? '<span class="lock-pill">' + ui.icon("lock") + ui.esc(t("locked")) + "</span>"
        : '<button type="button" class="btn btn-primary" style="min-height:36px;padding:7px 12px;font-size:12px" data-create-pin>' +
          ui.esc(t("createPin")) + "</button>") +
    "</div></div>" +

    '<p class="subtle text-center mt-20">' + ui.esc(t("privacyText")) + "</p>" +
    '<div style="height:8px"></div>';

  function mount(root) {
    const input = root.querySelector("#profileName");

    async function saveName() {
      await store.setName(input.value);
      ui.toast(t("saved"));
      ctx.rerender();
    }

    async function pickPhoto() {
      const file = await ui.pickImage();
      if (!file) return;
      try {
        const data = await ui.compressImage(file, 640);
        await store.setPhoto(data);
        ui.toast(t("saved"));
        ctx.rerender();
      } catch (e) {
        ui.toast(t("error"));
      }
    }

    root.querySelector("[data-save-name]").addEventListener("click", saveName);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveName();
      }
    });
    root.querySelector("[data-back]").addEventListener("click", () => ctx.navigate("#/menu"));

    root.querySelectorAll("[data-pick-photo]").forEach((btn) => {
      btn.addEventListener("click", pickPhoto);
    });

    const remove = root.querySelector("[data-remove-photo]");
    if (remove) {
      remove.addEventListener("click", async () => {
        const ok = await ui.confirmDialog({
          title: t("removePhoto"),
          ok: t("eliminar"),
          cancel: t("cancelar"),
          danger: true
        });
        if (!ok) return;
        await store.setPhoto(null);
        ctx.rerender();
      });
    }

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
