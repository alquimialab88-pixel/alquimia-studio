/* ==========================================================================
   Stickly · temporizador Pomodoro personalizable
   ========================================================================== */

import { t } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";

const STORE_KEY = "stickly-timer";

let mode = "study";
let running = false;
let endAt = 0;
let cycles = 0;
let remaining = 0;
let ticker = null;
let mounted = null;
let audioCtx = null;

function minutesFor(which) {
  const value = Number(store.state.settings[which === "study" ? "studyMin" : "breakMin"]);
  if (!Number.isFinite(value) || value <= 0) return which === "study" ? 25 : 5;
  return Math.min(which === "study" ? 180 : 60, Math.max(1, Math.round(value)));
}

function durationFor(which) {
  return minutesFor(which) * 60;
}

/* ----- Persistencia ----- */
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
  if (saved && (saved.mode === "study" || saved.mode === "break")) {
    mode = saved.mode;
    cycles = Number(saved.cycles) || 0;
    running = !!saved.running;
    endAt = Number(saved.endAt) || 0;
    remaining = Number(saved.remaining);
  }
} catch (e) { /* ignore */ }

if (!Number.isFinite(remaining) || remaining < 0) remaining = durationFor(mode);
if (remaining > durationFor(mode)) remaining = durationFor(mode);
if (running && endAt <= Date.now()) {
  running = false;
  remaining = durationFor(mode);
}

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      mode, remaining: remainingNow(), running, endAt, cycles
    }));
  } catch (e) { /* ignore */ }
}

function remainingNow() {
  if (!running) return Math.max(0, remaining);
  return Math.max(0, Math.round((endAt - Date.now()) / 1000));
}

function fmt(sec) {
  const total = Math.max(0, sec);
  return ui.pad2(Math.floor(total / 60)) + ":" + ui.pad2(total % 60);
}

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    [0, 0.28, 0.56].forEach((offset) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = offset === 0.56 ? 1046 : 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.18, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.24);
    });
  } catch (e) { /* silencio */ }
}

function vibrate() {
  try {
    if (navigator.vibrate) navigator.vibrate([160, 90, 160]);
  } catch (e) { /* ignore */ }
}

function finish() {
  if (!running) return;
  running = false;
  mode = mode === "study" ? "break" : "study";
  if (mode === "break") cycles += 1;
  remaining = durationFor(mode);
  persist();
  beep();
  vibrate();
  ui.toast(t("finTiempo"));
  if (mounted) mounted.ctx.rerender();
}

function updateDom() {
  if (!mounted) return;
  const root = mounted.root;
  if (!root.isConnected) { mounted = null; return; }
  const rem = remainingNow();
  const timeEl = root.querySelector(".timer-time");
  const ring = root.querySelector(".timer-ring");
  if (timeEl) timeEl.textContent = fmt(rem);
  if (ring) ring.style.setProperty("--p", String((rem / durationFor(mode)) * 100));
  if (running && rem <= 0) finish();
}

function ensureTicker() {
  if (ticker) return;
  ticker = setInterval(() => {
    updateDom();
    if (running && remainingNow() <= 0) finish();
  }, 500);
}

function openConfig(ctx) {
  if (running) {
    remaining = remainingNow();
    running = false;
    endAt = 0;
    persist();
  }

  let study = minutesFor("study");
  let descanso = minutesFor("break");

  const sheet = ui.openSheet(
    "<h2>" + ui.esc(t("adjustTimer")) + "</h2>" +
    '<div class="timer-config">' +
      '<label class="timer-config-row">' +
        '<span>' + ui.esc(t("studyMinutes")) + "</span>" +
        '<span class="stepper">' +
          '<button type="button" data-step="study" data-dir="-1">−</button>' +
          '<input id="studyMin" type="number" min="1" max="180" inputmode="numeric" value="' + study + '">' +
          '<button type="button" data-step="study" data-dir="1">+</button>' +
        "</span>" +
      "</label>" +
      '<label class="timer-config-row">' +
        '<span>' + ui.esc(t("breakMinutes")) + "</span>" +
        '<span class="stepper">' +
          '<button type="button" data-step="break" data-dir="-1">−</button>' +
          '<input id="breakMin" type="number" min="1" max="60" inputmode="numeric" value="' + descanso + '">' +
          '<button type="button" data-step="break" data-dir="1">+</button>' +
        "</span>" +
      "</label>" +
    "</div>" +
    '<div class="preset-row">' +
      '<button type="button" class="chip" data-preset="25,5">25 / 5</button>' +
      '<button type="button" class="chip" data-preset="50,10">50 / 10</button>' +
      '<button type="button" class="chip" data-preset="15,3">15 / 3</button>' +
    "</div>" +
    '<div class="sheet-actions">' +
      '<button type="button" class="btn btn-ghost" data-cancel>' + ui.esc(t("cancelar")) + "</button>" +
      '<button type="button" class="btn btn-primary" data-apply>' + ui.esc(t("apply")) + "</button>" +
    "</div>"
  );

  const studyInput = sheet.querySelector("#studyMin");
  const breakInput = sheet.querySelector("#breakMin");

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, Math.round(number)));
  }

  sheet.querySelectorAll("[data-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-step") === "study" ? studyInput : breakInput;
      const max = target === studyInput ? 180 : 60;
      const delta = Number(btn.getAttribute("data-dir")) * (target === studyInput ? 5 : 1);
      target.value = String(clamp(Number(target.value) + delta, 1, max));
    });
  });

  sheet.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parts = btn.getAttribute("data-preset").split(",");
      studyInput.value = parts[0];
      breakInput.value = parts[1];
    });
  });

  sheet.querySelector("[data-cancel]").addEventListener("click", () => sheet.close());

  sheet.querySelector("[data-apply]").addEventListener("click", async () => {
    const studyValue = clamp(studyInput.value, 1, 180);
    const breakValue = clamp(breakInput.value, 1, 60);
    await store.setSetting("studyMin", studyValue);
    await store.setSetting("breakMin", breakValue);
    mode = "study";
    running = false;
    endAt = 0;
    remaining = durationFor("study");
    persist();
    sheet.close();
    ui.toast(t("saved"));
    ctx.rerender();
  });
}

export async function render(ctx) {
  ensureTicker();
  const rem = remainingNow();
  if (running && rem <= 0) finish();

  const isBreak = mode === "break";
  const total = durationFor(mode);
  const percent = (Math.max(0, remainingNow()) / total) * 100;

  const html =
    '<div class="page-head">' +
      "<div><h1 class=\"page-title\">" + ui.esc(t("tabCronometro")) + "</h1>" +
        '<span class="subtle">' + ui.esc(isBreak ? t("tomateDescanso") : t("estudio")) + " · " +
          minutesFor(mode) + " min</span></div>" +
      '<div class="head-actions">' +
        '<button type="button" class="icon-btn" data-config aria-label="' + ui.esc(t("adjustTimer")) + '">' + ui.icon("settings") + "</button>" +
        '<span class="timer-mode' + (isBreak ? " break" : "") + '">' + ui.icon(isBreak ? "clock" : "sparkles", "icon-sm") +
          ui.esc(isBreak ? t("descanso") : t("estudio")) + "</span>" +
      "</div>" +
    "</div>" +

    '<div class="timer-wrap">' +
      '<div class="timer-ring' + (isBreak ? " is-break" : "") + '" style="--p:' + percent.toFixed(2) + '">' +
        '<div class="timer-inner">' +
          '<div class="timer-time">' + fmt(rem) + "</div>" +
          '<div class="timer-state">' + ui.esc(isBreak ? t("descanso") : t("estudio")) + "</div>" +
        "</div>" +
      "</div>" +

      '<div class="timer-controls">' +
        '<button type="button" class="btn-round secondary" data-reset aria-label="' + ui.esc(t("reiniciar")) + '">' +
          ui.icon("reset") + "</button>" +
        '<button type="button" class="btn-round" data-toggle aria-label="' +
          ui.esc(running ? t("pausar") : (rem < total ? t("reanudar") : t("iniciar"))) + '">' +
          ui.icon(running ? "pause" : "play") + "</button>" +
        '<button type="button" class="btn-round secondary" data-skip aria-label="' + ui.esc(t("descanso")) + '">' +
          ui.icon("arrow-right") + "</button>" +
      "</div>" +

      '<div class="timer-cycles">' +
        "<b>" + cycles + "</b>" + ui.esc(t("cycles")) +
      "</div>" +

      '<div class="chips mt-20" style="margin-top:22px">' +
        '<button type="button" class="chip' + (!isBreak ? " active" : "") + '" data-mode="study">' + ui.esc(t("estudio")) + "</button>" +
        '<button type="button" class="chip' + (isBreak ? " active" : "") + '" data-mode="break">' + ui.esc(t("descanso")) + "</button>" +
      "</div>" +
    "</div>";

  function paint() {
    updateDom();
  }

  function start() {
    if (remainingNow() <= 0) remaining = durationFor(mode);
    endAt = Date.now() + remainingNow() * 1000;
    running = true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        if (!audioCtx) audioCtx = new Ctx();
        if (audioCtx.state === "suspended") audioCtx.resume();
      }
    } catch (e) { /* ignore */ }
    persist();
    ctx.rerender();
  }

  function pause() {
    remaining = remainingNow();
    running = false;
    endAt = 0;
    persist();
    ctx.rerender();
  }

  function reset() {
    running = false;
    endAt = 0;
    remaining = durationFor(mode);
    persist();
    ctx.rerender();
  }

  function setMode(next) {
    running = false;
    endAt = 0;
    mode = next;
    remaining = durationFor(mode);
    persist();
    ctx.rerender();
  }

  function mount(root) {
    mounted = { root, ctx };

    root.querySelector("[data-toggle]").addEventListener("click", () => {
      if (running) pause();
      else start();
    });
    root.querySelector("[data-reset]").addEventListener("click", reset);
    root.querySelector("[data-config]").addEventListener("click", () => openConfig(ctx));
    root.querySelector("[data-skip]").addEventListener("click", () => {
      setMode(mode === "study" ? "break" : "study");
    });
    root.querySelectorAll("[data-mode]").forEach((chip) => {
      chip.addEventListener("click", () => setMode(chip.getAttribute("data-mode")));
    });

    paint();
  }

  return {
    html,
    mount,
    cleanup: () => { mounted = null; }
  };
}
