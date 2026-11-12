/* ==========================================================================
   Stickly · menú
   ========================================================================== */

import { t, getLang, langName } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";

function row(iconName, label, href, extra) {
  const content = '<span class="menu-icon ' + (extra && extra.tone ? extra.tone : "") + '">' + ui.icon(iconName) + "</span>" +
    '<span class="label">' + ui.esc(label) + "</span>" +
    (extra && extra.value ? '<span class="value">' + ui.esc(extra.value) + "</span>" : "") +
    ui.icon("chevron-right", "chev");
  if (href) {
    return '<a class="menu-row" href="' + href + '">' + content + "</a>";
  }
  return '<button type="button" class="menu-row" ' + (extra && extra.danger ? 'style="color:var(--danger)"' : "") + ">" + content + "</button>";
}

export async function render(ctx) {
  const name = (store.state.profile.name || "").trim();
  const initial = (name ? name.charAt(0) : "S").toUpperCase();
  const lang = getLang();

  const html =
    '<div class="page-head"><h1 class="page-title">' + ui.esc(t("tabMenu")) + "</h1></div>" +

    '<button type="button" class="profile-card" data-profile style="width:100%;border:0;text-align:left">' +
      '<span class="profile-avatar">' + ui.esc(initial) + "</span>" +
      "<span><h2>" + ui.esc(name || t("tuNombre")) + "</h2>" +
        "<p>Stickly · Alquimia Lab</p></span>" +
    "</button>" +

    '<div class="menu-list">' +
      row("note", t("notas"), "#/notes") +
      row("calendar", t("tabCalendario"), "#/calendar") +
      row("book", t("cuadernos"), "#/notebooks") +
      row("key", t("contrasenas"), "#/passwords", { tone: "blue" }) +
      row("timer", t("tabCronometro"), "#/timer", { tone: "orange" }) +
    "</div>" +

    '<div class="section-head"><h2 class="section-title">' + ui.esc(t("config")) + "</h2></div>" +
    '<div class="menu-list">' +
      row("user", t("tabPerfil"), "#/profile") +
      row("settings", t("config"), "#/settings") +
      row("globe", t("language"), "#/settings", { value: langName(lang) }) +
      (store.hasPin() && store.isUnlocked()
        ? '<button type="button" class="menu-row" data-lock>' +
            '<span class="menu-icon danger">' + ui.icon("lock") + "</span>" +
            '<span class="label">' + ui.esc(t("lockNow")) + "</span>" +
            ui.icon("chevron-right", "chev") +
          "</button>"
        : "") +
    "</div>" +

    '<div class="menu-foot">Stickly <b>1.0.0</b><br>' + ui.esc(t("madeBy")) +
      "<br>" + ui.esc(t("privacy")) + " · " + ui.esc(t("terms")) +
    "</div>";

  function mount(root) {
    root.querySelector("[data-profile]").addEventListener("click", () => ctx.navigate("#/profile"));

    const lockBtn = root.querySelector("[data-lock]");
    if (lockBtn) {
      lockBtn.addEventListener("click", () => {
        store.lock();
        ui.toast(t("locked"));
        ctx.rerender();
      });
    }
  }

  return { html, mount, cleanup: () => {} };
}
