/* ==========================================================================
   Stickly · integración PWA
   Instalación, service worker y aviso de actualización.
   ========================================================================== */

let deferredPrompt = null;
let onUpdateReady = null;
let reloading = false;

export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function canInstall() {
  return !!deferredPrompt;
}

export async function promptInstall() {
  if (!deferredPrompt) return false;
  const evt = deferredPrompt;
  deferredPrompt = null;
  try {
    evt.prompt();
    const choice = await evt.userChoice;
    return !!(choice && choice.outcome === "accepted");
  } catch (e) {
    return false;
  }
}

export function isIos() {
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function initPWA(onUpdate) {
  onUpdateReady = onUpdate;

  // En el APK los archivos vienen dentro de la app: no hace falta service worker.
  if (window.SticklyAndroid) {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then((regs) => regs.forEach((reg) => reg.unregister()))
        .catch(() => {});
    }
    if ("caches" in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key))).catch(() => {});
    }
    return;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.dispatchEvent(new CustomEvent("stickly-installable"));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    window.dispatchEvent(new CustomEvent("stickly-installed"));
  });

  if (!("serviceWorker" in navigator)) return;
  if (location.protocol === "file:") return;

  const register = () => {
    navigator.serviceWorker.register("sw.js", { scope: "./" }).then((reg) => {
      if (reg.waiting && navigator.serviceWorker.controller) {
        notifyUpdate();
      }
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            notifyUpdate();
          }
        });
      });
      // Busca actualizaciones al volver a la app.
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) reg.update().catch(() => {});
      });
      window.sticklyRegistration = reg;
    }).catch(() => { /* sin service worker: la app sigue funcionando */ });
  };

  // La app puede terminar de arrancar después del evento load.
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });

  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    if (reloading) return;
    reloading = true;
    location.reload();
  });
}

function notifyUpdate() {
  if (typeof onUpdateReady === "function") onUpdateReady();
}

export async function applyUpdate() {
  const reg = window.sticklyRegistration;
  if (reg && reg.waiting) {
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
    return true;
  }
  location.reload();
  return false;
}
