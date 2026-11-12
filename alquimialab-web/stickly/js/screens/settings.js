/* ==========================================================================
   Stickly · ajustes
   ========================================================================== */

import { t, getLang, langName, LANGS } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import * as pwa from "../pwa.js";
import { changePinFlow, promptPin } from "../pin.js";

function infoSheet(title, body) {
  const sheet = ui.openSheet(
    "<h2>" + ui.esc(title) + "</h2>" +
    '<p class="sheet-sub" style="white-space:pre-line;margin-top:12px">' + ui.esc(body) + "</p>" +
    '<div class="sheet-actions"><button type="button" class="btn btn-primary" data-close>' + ui.esc(t("cerrar")) + "</button></div>"
  );
  sheet.querySelector("[data-close]").addEventListener("click", () => sheet.close());
}

function openExport(ctx) {
  let include = false;
  const sheet = ui.openSheet(
    "<h2>" + ui.esc(t("exportData")) + "</h2>" +
    '<p class="sheet-sub">' + ui.esc(t("backupWarning")) + "</p>" +
    '<div class="switch-row">' +
      '<span class="menu-icon">' + ui.icon("lock") + "</span>" +
      '<span class="switch-main"><b>' + ui.esc(t("exportIncludePrivate")) + "</b>" +
        "<small>" + ui.esc(t("vaultHelp")) + "</small></span>" +
      '<button type="button" class="switch" role="switch" aria-checked="false" data-include></button>' +
    "</div>" +
    '<div class="sheet-actions">' +
      '<button type="button" class="btn btn-ghost" data-cancel>' + ui.esc(t("cancelar")) + "</button>" +
      '<button type="button" class="btn btn-primary" data-export>' + ui.icon("download", "icon-sm") + " " + ui.esc(t("exportData")) + "</button>" +
    "</div>"
  );

  const toggle = sheet.querySelector("[data-include]");
  toggle.addEventListener("click", () => {
    include = !include;
    toggle.classList.toggle("on", include);
    toggle.setAttribute("aria-checked", include ? "true" : "false");
  });

  sheet.querySelector("[data-cancel]").addEventListener("click", () => sheet.close());
  sheet.querySelector("[data-export]").addEventListener("click", async () => {
    const btn = sheet.querySelector("[data-export]");
    btn.disabled = true;
    try {
      const data = await store.exportData(include);
      ui.downloadText("stickly-" + ui.todayKey() + ".json", JSON.stringify(data, null, 2));
      sheet.close();
      ui.toast(t("exportDone"));
    } catch (e) {
      ui.toast(t("error"));
    }
    btn.disabled = false;
  });
}

async function importFlow(ctx) {
  const file = await ui.pickJsonFile();
  if (!file) return;
  let obj = null;
  try {
    const text = await ui.readTextFile(file);
    obj = JSON.parse(text);
  } catch (e) {
    ui.toast(t("importError"));
    return;
  }
  if (!store.validateBackup(obj)) {
    ui.toast(t("importError"));
    return;
  }
  const ok = await ui.confirmDialog({
    title: t("importData"),
    text: t("importConfirm"),
    ok: t("importData"),
    cancel: t("cancelar")
  });
  if (!ok) return;
  try {
    await store.importData(obj);
    store.lock();
    ui.toast(t("importDone"));
    ctx.navigate("#/home");
  } catch (e) {
    console.error(e);
    ui.toast(t("importError"));
  }
}

export async function render(ctx) {
  const lang = getLang();
  const pin = store.hasPin();
  const minutes = Number(store.state.settings.autoLock);
  const autoOptions = [
    { value: 5, label: t("min5") },
    { value: 15, label: t("min15") },
    { value: 60, label: t("min60") },
    { value: 0, label: t("never") }
  ];

  const langButtons = LANGS.map((code) =>
    '<button type="button" class="lang-option' + (code === lang ? " active" : "") + '" data-lang="' + code + '">' +
      "<span>" + ui.esc(langName(code)) + '</span><span class="code">' + code + "</span>" +
    "</button>"
  ).join("");

  const installRow = pwa.isStandalone()
    ? '<div class="setting-row"><span class="icon-lead">' + ui.icon("download") + "</span>" +
      '<span class="label">' + ui.esc(t("install")) + "<small>" + ui.esc(t("installHint")) + "</small></span>" +
      '<span class="lock-pill">' + ui.icon("check") + ui.esc(t("installed")) + "</span></div>"
    : '<button type="button" class="setting-row" data-install>' +
      '<span class="icon-lead">' + ui.icon("download") + "</span>" +
      '<span class="label">' + ui.esc(t("install")) + "<small>" + ui.esc(t("installHint")) + "</small></span>" +
      ui.icon("chevron-right", "chev") + "</button>";

  const html =
    '<div class="editor-head">' +
      '<button type="button" class="icon-btn" data-back aria-label="' + ui.esc(t("tabMenu")) + '">' + ui.icon("back") + "</button>" +
      '<span class="editor-head-mid">' + ui.esc(t("config")) + "</span>" +
      '<span style="width:42px"></span>' +
    "</div>" +

    '<div class="settings-section">' +
      '<h2 class="settings-title">' + ui.esc(t("language")) + "</h2>" +
      '<div class="setting-card"><div class="lang-grid">' + langButtons + "</div></div>" +
    "</div>" +

    '<div class="settings-section">' +
      '<h2 class="settings-title">' + ui.esc(t("security")) + "</h2>" +
      '<div class="setting-card">' +
        '<div class="setting-row"><span class="icon-lead">' + ui.icon(pin ? "lock" : "unlock") + "</span>" +
          '<span class="label">PIN<small>' + ui.esc(pin ? t("pinSet") : t("pinNotSet")) + "</small></span>" +
          (pin ? '<span class="lock-pill">' + ui.icon("lock") + ui.esc(t("locked")) + "</span>" : "") +
        "</div>" +
        '<button type="button" class="setting-row" data-pin>' +
          '<span class="icon-lead">' + ui.icon("key") + "</span>" +
          '<span class="label">' + ui.esc(pin ? t("changePin") : t("createPin")) +
            "<small>" + ui.esc(t("vaultHelp")) + "</small></span>" +
          ui.icon("chevron-right", "chev") + "</button>" +
        '<div class="setting-row"><span class="icon-lead">' + ui.icon("clock") + "</span>" +
          '<span class="label">' + ui.esc(t("autoLock")) + "<small>" + ui.esc(t("autoLockHelp")) + "</small></span>" +
          '<select data-autolock aria-label="' + ui.esc(t("autoLock")) + '">' +
            autoOptions.map((option) =>
              '<option value="' + option.value + '"' + (option.value === minutes ? " selected" : "") + ">" +
                ui.esc(option.label) + "</option>"
            ).join("") +
          "</select></div>" +
        (pin && store.isUnlocked()
          ? '<button type="button" class="setting-row" data-lock>' +
            '<span class="icon-lead">' + ui.icon("lock") + "</span>" +
            '<span class="label">' + ui.esc(t("lockNow")) + "</span>" +
            ui.icon("chevron-right", "chev") + "</button>"
          : "") +
      "</div>" +
    "</div>" +

    '<div class="settings-section">' +
      '<h2 class="settings-title">' + ui.esc(t("data")) + "</h2>" +
      '<div class="setting-card">' +
        '<div class="setting-row" style="display:block">' +
          '<div class="row"><span class="icon-lead">' + ui.icon("folder") + "</span>" +
            '<span class="label">' + ui.esc(t("storage")) + "<small>" + ui.esc(t("dataHelp")) + "</small></span>" +
            '<span class="value" data-storage>—</span></div>' +
          '<div class="storage-bar"><span data-storage-bar style="width:0%"></span></div>' +
        "</div>" +
        '<button type="button" class="setting-row" data-persist>' +
          '<span class="icon-lead">' + ui.icon("shield") + "</span>" +
          '<span class="label">' + ui.esc(t("storagePersist")) + "</span>" +
          '<span class="value" data-persist-value>—</span>' +
        "</button>" +
        '<button type="button" class="setting-row" data-export>' +
          '<span class="icon-lead">' + ui.icon("download") + "</span>" +
          '<span class="label">' + ui.esc(t("exportData")) + "<small>" + ui.esc(t("backupWarning")) + "</small></span>" +
          ui.icon("chevron-right", "chev") + "</button>" +
        '<button type="button" class="setting-row" data-import>' +
          '<span class="icon-lead">' + ui.icon("upload") + "</span>" +
          '<span class="label">' + ui.esc(t("importData")) + "</span>" +
          ui.icon("chevron-right", "chev") + "</button>" +
        '<button type="button" class="setting-row danger" data-wipe>' +
          '<span class="icon-lead" style="color:var(--danger)">' + ui.icon("trash") + "</span>" +
          '<span class="label">' + ui.esc(t("deleteAll")) + "</span>" +
          ui.icon("chevron-right", "chev") + "</button>" +
      "</div>" +
    "</div>" +

    '<div class="settings-section">' +
      '<h2 class="settings-title">Stickly</h2>' +
      '<div class="setting-card">' +
        installRow +
        '<button type="button" class="setting-row" data-privacy>' +
          '<span class="icon-lead">' + ui.icon("shield") + "</span>" +
          '<span class="label">' + ui.esc(t("privacy")) + "</span>" +
          ui.icon("chevron-right", "chev") + "</button>" +
        '<button type="button" class="setting-row" data-terms>' +
          '<span class="icon-lead">' + ui.icon("file") + "</span>" +
          '<span class="label">' + ui.esc(t("terms")) + "</span>" +
          ui.icon("chevron-right", "chev") + "</button>" +
        '<button type="button" class="setting-row" data-about>' +
          '<span class="icon-lead">' + ui.icon("info") + "</span>" +
          '<span class="label">' + ui.esc(t("about")) + "</span>" +
          '<span class="value">1.0.0</span>' +
          ui.icon("chevron-right", "chev") + "</button>" +
      "</div>" +
    "</div>" +

    '<p class="menu-foot">Stickly <b>1.0.0</b><br>' + ui.esc(t("madeBy")) + "</p>" +
    '<div style="height:8px"></div>';

  function mount(root) {
    root.querySelector("[data-back]").addEventListener("click", () => ctx.navigate("#/menu"));

    root.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const code = btn.getAttribute("data-lang");
        if (code !== lang) await ctx.setLanguage(code);
      });
    });

    root.querySelector("[data-pin]").addEventListener("click", async () => {
      const ok = pin ? await changePinFlow() : await promptPin("setup");
      if (ok) ctx.rerender();
    });

    root.querySelector("[data-autolock]").addEventListener("change", async (e) => {
      await store.setSetting("autoLock", Number(e.target.value));
      ui.toast(t("saved"));
    });

    const lock = root.querySelector("[data-lock]");
    if (lock) lock.addEventListener("click", () => ctx.lockNow());

    root.querySelector("[data-export]").addEventListener("click", () => openExport(ctx));
    root.querySelector("[data-import]").addEventListener("click", () => importFlow(ctx));

    root.querySelector("[data-wipe]").addEventListener("click", async () => {
      const ok = await ui.confirmDialog({
        title: t("deleteAll"),
        text: t("deleteAllText"),
        ok: t("deleteAll"),
        cancel: t("cancelar"),
        danger: true
      });
      if (!ok) return;
      await store.wipeAll();
      try { localStorage.removeItem("stickly-timer"); } catch (e) { /* ignore */ }
      ui.toast(t("deleteAllDone"));
      ctx.navigate("#/onboarding");
    });

    root.querySelector("[data-persist]").addEventListener("click", async () => {
      if (!navigator.storage || !navigator.storage.persist) {
        ui.toast(t("storagePersistNo"));
        return;
      }
      try {
        const ok = await navigator.storage.persist();
        ui.toast(ok ? t("storagePersistOk") : t("storagePersistNo"));
        paintPersist();
      } catch (e) {
        ui.toast(t("storagePersistNo"));
      }
    });

    function paintPersist() {
      const el = root.querySelector("[data-persist-value]");
      if (!el) return;
      if (!navigator.storage || !navigator.storage.persisted) {
        el.textContent = "—";
        return;
      }
      navigator.storage.persisted().then((ok) => {
        el.textContent = ok ? t("si") : t("no");
      }).catch(() => { el.textContent = "—"; });
    }
    paintPersist();

    store.storageEstimate().then((estimate) => {
      const valueEl = root.querySelector("[data-storage]");
      const barEl = root.querySelector("[data-storage-bar]");
      if (!valueEl || !valueEl.isConnected) return;
      if (!estimate) {
        valueEl.textContent = "—";
        return;
      }
      valueEl.textContent = ui.formatBytes(estimate.usage);
      if (barEl && estimate.quota) {
        const pct = Math.min(100, Math.max(1, (estimate.usage / estimate.quota) * 100));
        barEl.style.width = pct.toFixed(1) + "%";
      }
    });

    root.querySelector("[data-privacy]").addEventListener("click", () => infoSheet(t("privacy"), t("privacyText")));
    root.querySelector("[data-terms]").addEventListener("click", () => infoSheet(t("terms"), t("termsText")));
    root.querySelector("[data-about]").addEventListener("click", () => {
      infoSheet(t("about"), "Stickly 1.0.0\n" + t("madeBy") + "\n\n" + t("tagline"));
    });

    const install = root.querySelector("[data-install]");
    if (install) {
      install.addEventListener("click", async () => {
        if (pwa.canInstall()) {
          const ok = await pwa.promptInstall();
          if (ok) ui.toast(t("installed"));
          else ctx.rerender();
        } else {
          infoSheet(t("install"), t("installHint"));
        }
      });
    }

    const onInstallable = () => {
      if (root.isConnected) ctx.rerender();
    };
    window.addEventListener("stickly-installable", onInstallable);
    window.addEventListener("stickly-installed", onInstallable);

    return () => {
      window.removeEventListener("stickly-installable", onInstallable);
      window.removeEventListener("stickly-installed", onInstallable);
    };
  }

  let cleanupFn = null;
  return {
    html,
    mount(root) { cleanupFn = mount(root); },
    cleanup() { if (cleanupFn) cleanupFn(); }
  };
}
