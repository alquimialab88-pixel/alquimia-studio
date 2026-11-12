/* ==========================================================================
   Stickly · temporizador Pomodoro
   25 min de estudio / 5 min de descanso, con ciclos completados.
   ========================================================================== */

import { t } from "../i18n.js";
import * as ui from "../ui.js";

const DURATION = { study: 25 * 60, break: 5 * 60 };
const STORE_KEY = "stickly-timer";

let mode = "study";
let remaining = DURATION.study;
let running = false;
let endAt = 0;
let cycles = 0;
let ticker = null;
let mounted = null;
let audioCtx = null;

/* ----- Persistencia ----- */
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
  if (saved && (saved.mode === "study" || saved.mode === "break")) {
    mode = saved.mode;
    cycles = Number(saved.cycles) || 0;
    running = !!saved.running;
    endAt = Number(saved.endAt) || 0;
    remaining = Number(saved.remaining);
    if (!Number.isFinite(remaining) || remaining < 0) remaining = DURATION[mode];
  }
} catch (e) { /* ignore */ }

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
  remaining = 0;
  const endedStudy = mode === "study";
  if (endedStudy) cycles += 1;
  mode = endedStudy ? "break" : "study";
  remaining = DURATION[mode];
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
  if (ring) ring.style.setProperty("--p", String((rem / DURATION[mode]) * 100));
  if (running && rem <= 0) finish();
}

function ensureTicker() {
  if (ticker) return;
  ticker = setInterval(() => {
    updateDom();
    if (running && remainingNow() <= 0) finish();
  }, 500);
}

export async function render(ctx) {
  ensureTicker();
  const rem = remainingNow();
  if (running && rem <= 0) finish();

  const isBreak = mode === "break";
  const percent = (Math.max(0, remainingNow()) / DURATION[mode]) * 100;

  const html =
    '<div class="page-head">' +
      "<div><h1 class=\"page-title\">" + ui.esc(t("tabCronometro")) + "</h1>" +
        '<span class="subtle">' + ui.esc(isBreak ? t("tomateDescanso") : t("estudio")) + "</span></div>" +
      '<span class="timer-mode' + (isBreak ? " break" : "") + '">' + ui.icon(isBreak ? "clock" : "sparkles", "icon-sm") +
        ui.esc(isBreak ? t("descanso") : t("estudio")) + "</span>" +
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
          ui.esc(running ? t("pausar") : (rem < DURATION[mode] ? t("reanudar") : t("iniciar"))) + '">' +
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
    if (remainingNow() <= 0) remaining = DURATION[mode];
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
    remaining = DURATION[mode];
    persist();
    ctx.rerender();
  }

  function setMode(next) {
    running = false;
    endAt = 0;
    mode = next;
    remaining = DURATION[mode];
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
