/* ==========================================================================
   Stickly · teclado de PIN
   Modos: "setup" (crear), "unlock" (abrir), "change" (cambiar).
   El PIN nunca se guarda: solo se usa para derivar la llave.
   ========================================================================== */

import { t } from "./i18n.js";
import * as store from "./store.js";
import * as ui from "./ui.js";

const root = document.getElementById("pinRoot");

export function promptPin(mode, options) {
  const opts = options || {};
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "pin-screen";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<div class="pin-top">' +
        '<div class="pin-brand"><span class="pin-brand-mark">S</span>Stickly</div>' +
        '<button type="button" class="icon-btn plain pin-close" aria-label="' + ui.esc(t("cerrar")) + '">' +
          ui.icon("close") + "</button>" +
      "</div>" +
      '<div class="pin-body">' +
        '<div class="pin-badge">' + ui.icon(mode === "setup" ? "shield" : "lock") + "</div>" +
        '<h2 class="pin-title"></h2>' +
        '<p class="pin-sub"></p>' +
        '<div class="pin-dots" aria-hidden="true">' +
          Array.from({ length: 6 }, () => '<span class="pin-dot"></span>').join("") +
        "</div>" +
        '<p class="pin-msg" role="status" aria-live="polite"></p>' +
        '<div class="keypad"></div>' +
        '<div class="pin-foot"><button type="button" class="pin-link pin-forgot" hidden></button></div>' +
      "</div>";

    root.appendChild(overlay);

    const body = overlay.querySelector(".pin-body");
    const titleEl = overlay.querySelector(".pin-title");
    const subEl = overlay.querySelector(".pin-sub");
    const dotsEl = overlay.querySelector(".pin-dots");
    const msgEl = overlay.querySelector(".pin-msg");
    const keypad = overlay.querySelector(".keypad");
    const forgotBtn = overlay.querySelector(".pin-forgot");

    let phase = mode === "change" ? "current" : mode === "setup" ? "new" : "unlock";
    let firstPin = "";
    let currentPin = "";
    let buffer = "";
    let busy = false;
    let finished = false;
    let lockTimer = null;
    let toastAfter = null;

    /* ----- Teclado ----- */
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "blank", "0", "back"];
    keypad.innerHTML = keys.map((k) => {
      if (k === "blank") return '<span class="key blank"></span>';
      if (k === "back") {
        return '<button type="button" class="key ghost" data-key="back" aria-label="' +
          ui.esc(t("cancelar")) + '">' + ui.icon("back", "icon-sm") + "</button>";
      }
      return '<button type="button" class="key" data-key="' + k + '">' + k + "</button>";
    }).join("");

    function setBusy(value) {
      busy = value;
      overlay.querySelectorAll(".key").forEach((key) => {
        if (key.classList.contains("blank")) return;
        key.disabled = value;
      });
    }

    function setMsg(text, ok) {
      msgEl.textContent = text || "";
      msgEl.classList.toggle("ok", !!ok);
    }

    function renderDots() {
      const dots = dotsEl.querySelectorAll(".pin-dot");
      dots.forEach((dot, i) => dot.classList.toggle("on", i < buffer.length));
    }

    function phaseCopy() {
      if (phase === "new") {
        return {
          title: t("pin6"),
          sub: mode === "change" ? t("vaultHelp") : t("onb2d")
        };
      }
      if (phase === "confirm") {
        return { title: t("pin6confirm"), sub: t("privateHint") };
      }
      if (phase === "current") {
        return { title: t("pin6enter"), sub: t("pinNeededText") };
      }
      return { title: t("pin6enter"), sub: opts.text || t("pinNeededText") };
    }

    function renderPhase() {
      const copy = phaseCopy();
      titleEl.textContent = copy.title;
      subEl.textContent = copy.sub;
      renderDots();
      setMsg("");
      forgotBtn.hidden = mode === "setup" || !store.hasPin();
    }

    function shake() {
      body.classList.remove("shake");
      void body.offsetWidth;
      body.classList.add("shake");
    }

    function finish(ok) {
      if (finished) return;
      finished = true;
      clearInterval(lockTimer);
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      if (ok && toastAfter) ui.toast(toastAfter);
      resolve(ok);
    }

    async function handleComplete() {
      if (busy || finished) return;
      const value = buffer;

      if (phase === "new") {
        firstPin = value;
        buffer = "";
        phase = "confirm";
        renderPhase();
        return;
      }

      if (phase === "confirm") {
        if (value !== firstPin) {
          buffer = "";
          renderDots();
          setMsg(t("pinMismatch"));
          shake();
          return;
        }
        setBusy(true);
        setMsg("…");
        try {
          if (mode === "setup") {
            await store.setupPin(firstPin);
            toastAfter = t("pinCreated");
            finish(true);
          } else {
            const ok = await store.changePin(currentPin, firstPin);
            if (!ok) {
              setBusy(false);
              buffer = "";
              phase = "current";
              renderPhase();
              setMsg(t("pinWrong"));
              shake();
              return;
            }
            toastAfter = t("pinChanged");
            finish(true);
          }
        } catch (e) {
          console.error(e);
          setBusy(false);
          buffer = "";
          renderDots();
          setMsg(t("error"));
        }
        return;
      }

      if (phase === "current") {
        setBusy(true);
        setMsg("…");
        const result = await store.verifyPin(value);
        setBusy(false);
        if (!result.ok) {
          buffer = "";
          renderDots();
          shake();
          if (result.wait > 0) startLockout();
          else setMsg(t("pinWrong"));
          return;
        }
        currentPin = value;
        buffer = "";
        phase = "new";
        renderPhase();
        return;
      }

      // unlock
      setBusy(true);
      setMsg("…");
      const result = await store.unlockWithPin(value);
      setBusy(false);
      if (!result.ok) {
        buffer = "";
        renderDots();
        shake();
        if (result.wait > 0) startLockout();
        else setMsg(t("pinWrong"));
        return;
      }
      toastAfter = null;
      finish(true);
    }

    function startLockout() {
      clearInterval(lockTimer);
      lockTimer = null;
      const tick = () => {
        const wait = store.lockWait();
        if (wait > 0) {
          setBusy(true);
          setMsg(t("pinLocked") + " · " + t("pinWait", { s: wait }));
        } else {
          clearInterval(lockTimer);
          lockTimer = null;
          setBusy(false);
          setMsg("");
        }
      };
      tick();
      if (store.lockWait() > 0) lockTimer = setInterval(tick, 1000);
    }

    function press(key) {
      if (busy || finished) return;
      if (store.lockWait() > 0) {
        startLockout();
        return;
      }
      if (key === "back") {
        buffer = buffer.slice(0, -1);
        renderDots();
        return;
      }
      if (buffer.length >= 6) return;
      buffer += key;
      renderDots();
      if (buffer.length === 6) {
        setTimeout(handleComplete, 90);
      }
    }

    keypad.addEventListener("click", (e) => {
      const key = e.target.closest("button[data-key]");
      if (!key) return;
      press(key.getAttribute("data-key"));
    });

    overlay.querySelector(".pin-close").addEventListener("click", () => finish(false));

    forgotBtn.addEventListener("click", async () => {
      const ok = await ui.confirmDialog({
        title: t("pinForgot"),
        text: t("pinForgotText"),
        ok: t("pinReset"),
        cancel: t("cancelar"),
        danger: true
      });
      if (!ok) return;
      setBusy(true);
      await store.resetPrivate();
      ui.toast(t("deleteAllDone"));
      finish(false);
    });

    function onKeyDown(e) {
      if (finished) return;
      if (e.key === "Escape") {
        e.preventDefault();
        finish(false);
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        press("back");
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        press(e.key);
      }
    }
    document.addEventListener("keydown", onKeyDown);

    renderPhase();
    if (store.lockWait() > 0) startLockout();
    setTimeout(() => overlay.querySelector(".pin-close").focus(), 60);
  });
}

/** Asegura que la sesión privada esté abierta; crea PIN si aún no hay. */
export async function ensureUnlocked(options) {
  const opts = options || {};
  if (!store.hasPin()) {
    return promptPin("setup", { text: opts.text || t("onb2d") });
  }
  if (store.isUnlocked()) return true;
  return promptPin("unlock", opts);
}

/** Cambia el PIN pidiendo primero el actual y luego el nuevo. */
export async function changePinFlow() {
  if (!store.hasPin()) return promptPin("setup");
  if (!store.isUnlocked()) {
    const ok = await promptPin("unlock");
    if (!ok) return false;
  }
  return promptPin("change");
}
