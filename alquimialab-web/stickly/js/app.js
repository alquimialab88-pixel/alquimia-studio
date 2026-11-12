/* ==========================================================================
   Stickly · arranque, rutas y estructura de la app
   ========================================================================== */

import { t, setLang, detectLang, getLang } from "./i18n.js";
import * as store from "./store.js";
import * as ui from "./ui.js";
import * as pwa from "./pwa.js";
import { closePins } from "./pin.js";

import * as onboarding from "./screens/onboarding.js";
import * as home from "./screens/home.js";
import * as notes from "./screens/notes.js";
import * as editor from "./screens/note-editor.js";
import * as calendar from "./screens/calendar.js";
import * as notebooks from "./screens/notebooks.js";
import * as notebook from "./screens/notebook.js";
import * as passwords from "./screens/passwords.js";
import * as timer from "./screens/timer.js";
import * as menu from "./screens/menu.js";
import * as profile from "./screens/profile.js";
import * as settings from "./screens/settings.js";

const view = document.getElementById("view");
const bootEl = document.getElementById("boot");
const tabbar = document.getElementById("tabbar");
const netBanner = document.getElementById("netBanner");
const netText = document.getElementById("netText");
const updateBanner = document.getElementById("updateBanner");
const updateText = document.getElementById("updateText");
const updateBtn = document.getElementById("updateBtn");

const SCREENS = {
  onboarding,
  home,
  notes,
  note: editor,
  calendar,
  notebooks,
  notebook,
  passwords,
  timer,
  menu,
  profile,
  settings
};

const FULLSCREEN = new Set(["onboarding", "note", "notebook"]);

const TAB_FOR = {
  home: "home",
  notes: "notes",
  note: "notes",
  calendar: "calendar",
  notebooks: "notebooks",
  notebook: "notebooks",
  passwords: "menu",
  timer: "home",
  menu: "menu",
  settings: "menu",
  profile: "menu",
  onboarding: null
};

const TAB_KEYS = {
  home: "tabInicio",
  notes: "notas",
  calendar: "tabCalendario",
  notebooks: "cuadernos",
  menu: "tabMenu"
};

let leaveGuard = null;
let lastHash = location.hash || "#/home";
let renderToken = 0;
let currentCleanup = null;
let booted = false;

/* ============ Rutas ============ */

function parseHash() {
  let raw = String(location.hash || "").replace(/^#\/?/, "");
  if (!raw) raw = "home";
  const qIndex = raw.indexOf("?");
  const path = qIndex >= 0 ? raw.slice(0, qIndex) : raw;
  const query = new URLSearchParams(qIndex >= 0 ? raw.slice(qIndex + 1) : "");
  const parts = path.split("/").filter(Boolean);
  return {
    name: parts[0] || "home",
    id: parts[1] ? decodeURIComponent(parts[1]) : null,
    query
  };
}

export function navigate(path) {
  const target = path.startsWith("#") ? path : "#" + path;
  if (location.hash === target) {
    renderRoute();
  } else {
    location.hash = target;
  }
}

async function handleHashChange() {
  const target = location.hash;
  if (leaveGuard) {
    let ok = false;
    try { ok = await leaveGuard(); } catch (e) { ok = true; }
    if (!ok) {
      history.replaceState(null, "", lastHash || "#/home");
      return;
    }
    leaveGuard = null;
  }
  lastHash = target;
  await renderRoute();
}

window.addEventListener("hashchange", handleHashChange);

/* ============ Render ============ */

async function renderRoute() {
  const token = ++renderToken;
  const route = parseHash();
  const mod = SCREENS[route.name] || home;
  const fullscreen = FULLSCREEN.has(route.name);

  if (currentCleanup) {
    try { currentCleanup(); } catch (e) { /* ignore */ }
    currentCleanup = null;
  }
  leaveGuard = null;
  closePins();
  ui.closeSheets();

  view.setAttribute("data-screen", route.name);
  tabbar.hidden = fullscreen;
  view.classList.toggle("no-nav", fullscreen);
  setActiveTab(TAB_FOR[route.name] || null);

  try {
    const result = await mod.render({
      params: route,
      navigate,
      rerender: () => renderRoute(),
      setGuard: (fn) => { leaveGuard = fn; },
      hideNav: (hide) => {
        tabbar.hidden = hide;
        view.classList.toggle("no-nav", hide);
      },
      setLanguage: async (lang) => {
        setLang(lang);
        await store.setSetting("lang", lang);
        applyChrome();
        await renderRoute();
      },
      lockNow: () => {
        store.lock();
        applyChrome();
        ui.toast(t("locked"));
        renderRoute();
      }
    });

    if (token !== renderToken) return;
    if (!result) return;

    view.innerHTML = result.html;
    if (result.mount) result.mount(view);
    currentCleanup = result.cleanup || null;
    applyChrome();
    window.scrollTo(0, 0);
  } catch (err) {
    console.error(err);
    if (token !== renderToken) return;
    view.innerHTML =
      '<div class="empty"><div class="empty-icon">' + ui.icon("alert", "icon-lg") + "</div>" +
      "<h3>" + ui.esc(t("error")) + "</h3>" +
      '<p>' + ui.esc(t("retry")) + "</p>" +
      '<button type="button" class="btn btn-primary" id="retryRender">' + ui.esc(t("retry")) + "</button></div>";
    const retry = view.querySelector("#retryRender");
    if (retry) retry.addEventListener("click", () => renderRoute());
  }
}

function setActiveTab(name) {
  tabbar.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.getAttribute("data-tab") === name;
    tab.classList.toggle("active", active);
    if (active) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
}

function applyChrome() {
  document.documentElement.lang = getLang();
  tabbar.querySelectorAll(".tab").forEach((tab) => {
    const key = TAB_KEYS[tab.getAttribute("data-tab")];
    const label = tab.querySelector("span");
    if (key && label) label.textContent = t(key);
  });
  updateText.textContent = t("newVersion");
  updateBtn.textContent = t("update");
  netText.textContent = t("offline");
}

/* ============ Red ============ */

function refreshNet() {
  const offline = !navigator.onLine;
  netBanner.hidden = !offline;
  if (offline) netText.textContent = t("offline");
}

window.addEventListener("offline", refreshNet);
window.addEventListener("online", () => {
  netBanner.hidden = true;
  ui.toast(t("offlineReady"));
});

/* ============ Bloqueo automático ============ */

let hiddenAt = 0;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    hiddenAt = Date.now();
    return;
  }
  if (!hiddenAt) return;
  const minutes = Number(store.state.settings.autoLock);
  const away = Date.now() - hiddenAt;
  hiddenAt = 0;
  if (!store.hasPin() || !store.isUnlocked()) return;
  if (minutes > 0 && away >= minutes * 60000) {
    store.lock();
    ui.toast(t("locked"));
    renderRoute();
  }
});

/* ============ Service worker ============ */

function showUpdate() {
  updateBanner.hidden = false;
  updateText.textContent = t("newVersion");
  updateBtn.textContent = t("update");
}

updateBtn.addEventListener("click", () => {
  updateBtn.disabled = true;
  pwa.applyUpdate();
});

/* ============ Arranque ============ */

async function boot() {
  setLang(detectLang());
  applyChrome();
  refreshNet();

  try {
    await store.init();
  } catch (err) {
    console.error(err);
    bootEl.innerHTML =
      '<div class="empty"><div class="empty-icon">' + ui.icon("alert", "icon-lg") + "</div>" +
      "<h3>" + ui.esc(t("error")) + "</h3><p>" + ui.esc(t("storage")) + "</p>" +
      '<button type="button" class="btn btn-primary" id="bootRetry">' + ui.esc(t("retry")) + "</button></div>";
    const retry = bootEl.querySelector("#bootRetry");
    if (retry) retry.addEventListener("click", () => location.reload());
    return;
  }

  if (store.state.settings && store.state.settings.lang) {
    setLang(store.state.settings.lang, false);
  }
  applyChrome();

  if (!store.state.onboarding) {
    history.replaceState(null, "", "#/onboarding");
  } else if (!location.hash || location.hash === "#" || location.hash === "#/") {
    history.replaceState(null, "", "#/home");
  }
  lastHash = location.hash || "#/home";

  await renderRoute();

  booted = true;
  bootEl.classList.add("hide");
  setTimeout(() => {
    if (bootEl.parentNode) bootEl.parentNode.removeChild(bootEl);
  }, 420);

  pwa.initPWA(showUpdate);
}

// Precarga de la pantalla de inicio para que el primer cambio sea inmediato.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

// Expone un par de utilidades para depuración y para otras pantallas.
window.stickly = {
  navigate,
  refresh: renderRoute,
  language: getLang,
  isBooted: () => booted
};
