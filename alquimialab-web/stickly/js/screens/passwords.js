/* ==========================================================================
   Stickly · bóveda de contraseñas
   Todo se guarda cifrado. La pantalla solo muestra datos con la sesión abierta.
   ========================================================================== */

import { t } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import { ensureUnlocked, promptPin } from "../pin.js";

const PW_COLORS = ["#EDECF8", "#FDE7F1", "#E3F3FC", "#E5F8EC", "#FEF0E2", "#F3E8FF"];

let query = "";

function colorFor(text) {
  const value = String(text || "?");
  let sum = 0;
  for (let i = 0; i < value.length; i++) sum += value.charCodeAt(i);
  return PW_COLORS[sum % PW_COLORS.length];
}

function initialFor(text) {
  const value = String(text || "?").trim();
  return (value.charAt(0) || "?").toUpperCase();
}

function gate(ctx, hasPin) {
  return {
    html: '<div class="page-head"><h1 class="page-title">' + ui.esc(t("contrasenas")) + "</h1></div>" +
      '<div class="vault-gate">' +
        '<div class="vault-icon">' + ui.icon("lock") + "</div>" +
        "<h1>" + ui.esc(hasPin ? t("pinNeeded") : t("pinNotSet")) + "</h1>" +
        "<p>" + ui.esc(hasPin ? t("pinNeededText") : t("vaultNoPinText")) + "</p>" +
        '<button type="button" class="btn btn-primary" data-open-vault>' +
          ui.esc(hasPin ? t("desbloquear") : t("createPin")) + "</button>" +
      "</div>" +
      '<div class="setting-card" style="margin-top:8px"><div class="setting-row">' +
        '<span class="icon-lead">' + ui.icon("shield") + "</span>" +
        '<span class="label">' + ui.esc(t("vaultHelp")) + "</span>" +
      "</div></div>",
    mount(root) {
      const btn = root.querySelector("[data-open-vault]");
      btn.addEventListener("click", async () => {
        const ok = hasPin ? await promptPin("unlock") : await promptPin("setup");
        if (ok) ctx.rerender();
      });
    },
    cleanup: () => {}
  };
}

function openEditSheet(ctx, row) {
  const payload = row ? store.passwordView(row) : {
    titulo: "", usuario: "", clave: "", url: "", nota: ""
  };
  if (row && !payload) {
    ui.toast(t("pinNeeded"));
    return;
  }

  let visible = false;
  const sheet = ui.openSheet(
    "<h2>" + ui.esc(row ? t("editPassword") : t("nuevaContrasena")) + "</h2>" +
    '<label class="field mt-14"><span>' + ui.esc(t("titulo")) + "</span>" +
      '<input id="pwTitle" class="input" type="text" maxlength="100" autocomplete="off" ' +
        'value="' + ui.esc(payload.titulo) + '" placeholder="' + ui.esc(t("nuevaContrasena")) + '"></label>' +
    '<label class="field"><span>' + ui.esc(t("usuario")) + "</span>" +
      '<input id="pwUser" class="input" type="text" maxlength="140" autocomplete="off" ' +
        'value="' + ui.esc(payload.usuario) + '" placeholder="' + ui.esc(t("usuario")) + '"></label>' +
    '<label class="field"><span>' + ui.esc(t("clave")) + "</span>" +
      '<div class="row" style="gap:6px">' +
        '<input id="pwPass" class="input grow" type="password" maxlength="200" autocomplete="new-password" ' +
          'value="' + ui.esc(payload.clave) + '" placeholder="' + ui.esc(t("clave")) + '">' +
        '<button type="button" class="icon-btn" data-toggle-pass aria-label="' + ui.esc(t("verClave")) + '">' + ui.icon("eye") + "</button>" +
      "</div></label>" +
    '<label class="field"><span>' + ui.esc(t("sitioWeb")) + "</span>" +
      '<input id="pwUrl" class="input" type="text" maxlength="220" autocomplete="off" inputmode="url" ' +
        'value="' + ui.esc(payload.url) + '" placeholder="https://"></label>' +
    '<label class="field"><span>' + ui.esc(t("notaAdicional")) + "</span>" +
      '<textarea id="pwNote" class="input" rows="3" placeholder="' + ui.esc(t("notaAdicional")) + '">' + ui.esc(payload.nota) + "</textarea></label>" +
    '<p class="subtle">' + ui.esc(t("vaultHelp")) + "</p>" +
    '<div class="sheet-actions">' +
      (row ? '<button type="button" class="btn btn-danger" data-del>' + ui.esc(t("eliminar")) + "</button>" : "") +
      '<button type="button" class="btn btn-ghost" data-cancel>' + ui.esc(t("cancelar")) + "</button>" +
      '<button type="button" class="btn btn-primary" data-save>' + ui.esc(t("guardar")) + "</button>" +
    "</div>"
  );

  const titleInput = sheet.querySelector("#pwTitle");
  const userInput = sheet.querySelector("#pwUser");
  const passInput = sheet.querySelector("#pwPass");
  const urlInput = sheet.querySelector("#pwUrl");
  const noteInput = sheet.querySelector("#pwNote");
  const toggleBtn = sheet.querySelector("[data-toggle-pass]");

  toggleBtn.addEventListener("click", () => {
    visible = !visible;
    passInput.type = visible ? "text" : "password";
    toggleBtn.innerHTML = ui.icon(visible ? "eye-off" : "eye");
    toggleBtn.setAttribute("aria-label", t(visible ? "ocultarClave" : "verClave"));
  });

  const save = async () => {
    const titulo = titleInput.value.trim();
    if (!titulo) {
      ui.toast(t("nuevaContrasena"));
      titleInput.focus();
      return;
    }
    if (!store.isUnlocked()) {
      const ok = await ensureUnlocked();
      if (!ok) return;
    }
    await store.savePassword({
      id: row ? row.id : null,
      titulo,
      usuario: userInput.value,
      clave: passInput.value,
      url: urlInput.value,
      nota: noteInput.value,
      createdAt: row ? row.createdAt : Date.now()
    });
    sheet.close();
    ui.toast(t("saved"));
    ctx.rerender();
  };

  sheet.querySelector("[data-save]").addEventListener("click", save);
  sheet.querySelector("[data-cancel]").addEventListener("click", () => sheet.close());

  const del = sheet.querySelector("[data-del]");
  if (del) {
    del.addEventListener("click", async () => {
      const ok = await ui.confirmDialog({
        title: t("deletePassword"),
        ok: t("eliminar"),
        cancel: t("cancelar"),
        danger: true
      });
      if (!ok) return;
      await store.deletePassword(row.id);
      sheet.close();
      ui.toast(t("deleteAllDone"));
      ctx.rerender();
    });
  }

  setTimeout(() => { titleInput.focus(); titleInput.select(); }, 130);
}

function openDetailSheet(ctx, row) {
  const payload = store.passwordView(row);
  if (!payload) {
    ui.toast(t("pinNeeded"));
    return;
  }

  const color = colorFor(payload.titulo);
  let visible = false;

  const sheet = ui.openSheet(
    '<div class="pw-detail-top">' +
      '<span class="pw-avatar" style="--pw-c:' + ui.esc(color) + '">' + ui.esc(initialFor(payload.titulo)) + "</span>" +
      "<div><h2>" + ui.esc(payload.titulo) + "</h2>" +
        (payload.usuario ? "<p>" + ui.esc(payload.usuario) + "</p>" : "") + "</div>" +
    "</div>" +

    (payload.usuario
      ? '<div class="pw-field"><div class="pf-main"><small>' + ui.esc(t("usuario")) + "</small>" +
        "<b>" + ui.esc(payload.usuario) + '</b></div><button type="button" class="icon-btn" data-copy-user aria-label="' +
        ui.esc(t("copyUser")) + '">' + ui.icon("copy", "icon-sm") + "</button></div>"
      : "") +

    '<div class="pw-field"><div class="pf-main"><small>' + ui.esc(t("clave")) + "</small>" +
      '<b class="mono" data-pw>' + (visible ? ui.esc(payload.clave) : "••••••••") + "</b></div>" +
      '<button type="button" class="icon-btn" data-reveal aria-label="' + ui.esc(t("verClave")) + '">' + ui.icon("eye", "icon-sm") + "</button>" +
      '<button type="button" class="icon-btn" data-copy-pass aria-label="' + ui.esc(t("copyPassword")) + '">' + ui.icon("copy", "icon-sm") + "</button>" +
    "</div>" +

    (payload.url
      ? '<div class="pw-field"><div class="pf-main"><small>' + ui.esc(t("sitioWeb")) + "</small>" +
        "<b>" + ui.esc(payload.url) + '</b></div><button type="button" class="icon-btn" data-copy-url aria-label="' +
        ui.esc(t("copy")) + '">' + ui.icon("copy", "icon-sm") + "</button></div>"
      : "") +

    (payload.nota
      ? '<div class="pw-field"><div class="pf-main"><small>' + ui.esc(t("notaAdicional")) + "</small>" +
        '<div class="pw-note">' + ui.esc(payload.nota) + "</div></div></div>"
      : "") +

    '<div class="sheet-actions">' +
      '<button type="button" class="btn btn-danger" data-del>' + ui.esc(t("eliminar")) + "</button>" +
      '<button type="button" class="btn btn-primary" data-edit>' + ui.esc(t("editar")) + "</button>" +
    "</div>"
  );

  sheet.querySelector("[data-copy-user]")?.addEventListener("click", async () => {
    if (await ui.copyText(payload.usuario)) ui.toast(t("copiado"));
  });
  sheet.querySelector("[data-copy-pass]")?.addEventListener("click", async () => {
    if (await ui.copyText(payload.clave)) ui.toast(t("copiado"));
  });
  sheet.querySelector("[data-copy-url]")?.addEventListener("click", async () => {
    if (await ui.copyText(payload.url)) ui.toast(t("copiado"));
  });

  const reveal = sheet.querySelector("[data-reveal]");
  const pwEl = sheet.querySelector("[data-pw]");
  reveal.addEventListener("click", () => {
    visible = !visible;
    pwEl.textContent = visible ? payload.clave : "••••••••";
    reveal.innerHTML = ui.icon(visible ? "eye-off" : "eye", "icon-sm");
    reveal.setAttribute("aria-label", t(visible ? "ocultarClave" : "verClave"));
  });

  sheet.querySelector("[data-edit]").addEventListener("click", () => {
    sheet.close();
    openEditSheet(ctx, row);
  });

  sheet.querySelector("[data-del]").addEventListener("click", async () => {
    const ok = await ui.confirmDialog({
      title: t("deletePassword"),
      ok: t("eliminar"),
      cancel: t("cancelar"),
      danger: true
    });
    if (!ok) return;
    await store.deletePassword(row.id);
    sheet.close();
    ui.toast(t("deleteAllDone"));
    ctx.rerender();
  });
}

function listHtml(ctx) {
  const rows = store.state.passwords.filter((row) => {
    const payload = store.passwordView(row);
    if (!payload) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return payload.titulo.toLowerCase().includes(q) ||
      payload.usuario.toLowerCase().includes(q) ||
      payload.url.toLowerCase().includes(q);
  });

  if (!rows.length) {
    const hasAny = store.state.passwords.length > 0;
    return '<div class="empty"><div class="empty-icon">' + ui.icon(hasAny ? "search" : "key") + "</div>" +
      "<h3>" + ui.esc(hasAny ? t("noResults") : t("contrasenas")) + "</h3>" +
      "<p>" + ui.esc(hasAny ? t("search") : t("sinContrasenas")) + "</p>" +
      '<button type="button" class="btn btn-primary" data-new-pw>' + ui.esc(t("nuevaContrasena")) + "</button></div>";
  }

  return '<div class="pw-list">' + rows.map((row) => {
    const payload = store.passwordView(row);
    const color = colorFor(payload.titulo);
    return '<div class="pw-row" role="button" tabindex="0" data-pw-row="' + ui.esc(row.id) + '">' +
      '<span class="pw-avatar" style="--pw-c:' + ui.esc(color) + '">' + ui.esc(initialFor(payload.titulo)) + "</span>" +
      '<div class="pw-main"><h3>' + ui.esc(payload.titulo) + "</h3>" +
        "<p>" + ui.esc(payload.usuario || payload.url || "") + "</p></div>" +
      '<div class="pw-actions">' +
        '<button type="button" class="icon-btn plain" data-copy="' + ui.esc(row.id) + '" aria-label="' + ui.esc(t("copyPassword")) + '">' +
          ui.icon("copy", "icon-sm") + "</button>" +
      "</div>" +
    "</div>";
  }).join("") + "</div>";
}

export async function render(ctx) {
  if (!store.hasPin()) return gate(ctx, false);
  if (!store.isUnlocked()) return gate(ctx, true);

  const html =
    '<div class="page-head">' +
      "<div><h1 class=\"page-title\">" + ui.esc(t("contrasenas")) + "</h1>" +
        '<span class="subtle">' + ui.esc(t("passwordCount", { n: store.state.passwords.length })) + "</span></div>" +
      '<div class="head-actions">' +
        '<button type="button" class="icon-btn" data-lock-vault aria-label="' + ui.esc(t("lockNow")) + '">' + ui.icon("lock") + "</button>" +
      "</div>" +
    "</div>" +

    '<div class="search-field">' + ui.icon("search") +
      '<input id="pwSearch" type="search" autocomplete="off" placeholder="' + ui.esc(t("search")) + '" value="' + ui.esc(query) + '">' +
    "</div>" +

    '<div id="pwBody">' + listHtml(ctx) + "</div>" +
    '<button type="button" class="fab" data-new-pw aria-label="' + ui.esc(t("nuevaContrasena")) + '">' + ui.icon("plus") + "</button>";

  function wireBody(root) {
    const body = root.querySelector("#pwBody");

    body.querySelectorAll("[data-pw-row]").forEach((rowEl) => {
      const open = () => {
        const row = store.state.passwords.find((item) => item.id === rowEl.getAttribute("data-pw-row"));
        if (row) openDetailSheet(ctx, row);
      };
      rowEl.addEventListener("click", (e) => {
        if (e.target.closest("[data-copy]")) return;
        open();
      });
      rowEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    body.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const row = store.state.passwords.find((item) => item.id === btn.getAttribute("data-copy"));
        const payload = row ? store.passwordView(row) : null;
        if (payload && await ui.copyText(payload.clave)) ui.toast(t("copiado"));
      });
    });

    body.querySelectorAll("[data-new-pw]").forEach((btn) => {
      btn.addEventListener("click", () => openEditSheet(ctx, null));
    });
  }

  function mount(root) {
    root.querySelector("[data-lock-vault]").addEventListener("click", () => ctx.lockNow());

    const search = root.querySelector("#pwSearch");
    search.addEventListener("input", () => {
      query = search.value;
      const body = root.querySelector("#pwBody");
      body.innerHTML = listHtml(ctx);
      wireBody(root);
    });

    const fab = root.querySelector(".fab[data-new-pw]");
    if (fab) fab.addEventListener("click", () => openEditSheet(ctx, null));

    wireBody(root);
  }

  return { html, mount, cleanup: () => {} };
}
