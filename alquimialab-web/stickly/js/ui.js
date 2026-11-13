/* ==========================================================================
   Stickly · utilidades de interfaz
   ========================================================================== */

export function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

export function icon(name, cls) {
  return '<svg class="icon' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
}

/* ===== Avisos ===== */

let toastTimer = null;
export function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ===== Diálogos ===== */

export function openDialog(options) {
  const opts = options || {};
  const root = document.getElementById("modalRoot");
  const dlg = document.createElement("dialog");
  dlg.className = "dialog" + (opts.className ? " " + opts.className : "");

  const actions = (opts.actions || [{ label: "OK", value: true, primary: true }]);
  const inputHtml = opts.input
    ? '<label class="field dialog-field"><span>' + esc(opts.input.label || "") + "</span>" +
      '<input id="dialogInput" type="' + esc(opts.input.type || "text") + '" ' +
      'value="' + esc(opts.input.value || "") + '" ' +
      'placeholder="' + esc(opts.input.placeholder || "") + '" ' +
      (opts.input.type === "password" ? 'autocomplete="off" ' : "") +
      (opts.input.inputmode ? 'inputmode="' + esc(opts.input.inputmode) + '" ' : "") + "></label>"
    : "";

  dlg.innerHTML = '<form method="dialog" class="dialog-inner">' +
    '<h2 class="dialog-title">' + esc(opts.title || "") + "</h2>" +
    (opts.text ? '<p class="dialog-text">' + esc(opts.text) + "</p>" : "") +
    (opts.html || "") +
    inputHtml +
    '<div class="dialog-actions">' +
    actions.map((a) => '<button type="button" class="btn ' +
      (a.danger ? "btn-danger" : a.primary ? "btn-primary" : "btn-ghost") +
      '" data-value="' + esc(String(a.value)) + '">' + esc(a.label) + "</button>").join("") +
    "</div></form>";

  root.appendChild(dlg);
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");

  return new Promise((resolve) => {
    const input = dlg.querySelector("#dialogInput");
    if (input) setTimeout(() => { input.focus(); input.select(); }, 60);

    dlg.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-value]");
      if (!btn) return;
      const value = btn.getAttribute("data-value");
      finish(value, true);
    });
    dlg.addEventListener("cancel", (e) => {
      e.preventDefault();
      finish(null, false);
    });
    dlg.addEventListener("close", () => {
      dlg.remove();
    });

    let done = false;
    function finish(value, hasValue) {
      if (done) return;
      done = true;
      const result = {
        action: hasValue ? normalize(value) : null,
        input: input ? input.value : null
      };
      try { dlg.close(); } catch (e) { dlg.remove(); }
      resolve(result);
    }
  });
}

function normalize(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

export async function confirmDialog(options) {
  const opts = options || {};
  const res = await openDialog({
    title: opts.title,
    text: opts.text,
    actions: [
      { label: opts.cancel || "Cancelar", value: false },
      { label: opts.ok || "OK", value: true, primary: !opts.danger, danger: opts.danger }
    ]
  });
  return res.action === true;
}

export async function promptDialog(options) {
  const opts = options || {};
  const res = await openDialog({
    title: opts.title,
    text: opts.text,
    input: opts.input,
    actions: [
      { label: opts.cancel || "Cancelar", value: false },
      { label: opts.ok || "OK", value: true, primary: true }
    ]
  });
  return res.action === true ? res.input : null;
}

/* ===== Hoja inferior ===== */

export function openSheet(html) {
  const root = document.getElementById("modalRoot");
  const wrap = document.createElement("div");
  wrap.className = "sheet-backdrop";
  wrap.innerHTML = '<div class="sheet" role="dialog" aria-modal="true">' +
    '<div class="sheet-grip"></div>' + html + "</div>";
  root.appendChild(wrap);

  const close = () => {
    wrap.classList.add("closing");
    setTimeout(() => wrap.remove(), 180);
  };
  wrap.addEventListener("click", (e) => {
    if (e.target === wrap) close();
  });
  wrap.close = close;
  return wrap;
}

export function closeSheets() {
  document.querySelectorAll(".sheet-backdrop").forEach((el) => el.remove());
}

/* ===== Fechas ===== */

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function dateKey(date) {
  return date.getFullYear() + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate());
}

export function todayKey() {
  return dateKey(new Date());
}

export function parseKey(key) {
  const parts = String(key || "").split("-").map(Number);
  return new Date(parts[0] || 2000, (parts[1] || 1) - 1, parts[2] || 1);
}

export function fmtMonth(date, lang) {
  try {
    const s = new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(date);
    return s.charAt(0).toUpperCase() + s.slice(1);
  } catch (e) {
    return date.getMonth() + 1 + "/" + date.getFullYear();
  }
}

export function fmtMonthShort(date, lang) {
  try {
    const s = new Intl.DateTimeFormat(lang, { month: "short" }).format(date);
    return s.charAt(0).toUpperCase() + s.slice(1);
  } catch (e) {
    return String(date.getMonth() + 1);
  }
}

export function fmtLongDate(date, lang) {
  try {
    const s = new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long" }).format(date);
    return s.charAt(0).toUpperCase() + s.slice(1);
  } catch (e) {
    return date.toDateString();
  }
}

export function fmtShortDate(date, lang) {
  try {
    const s = new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "short" }).format(date);
    return s.charAt(0).toUpperCase() + s.slice(1);
  } catch (e) {
    return date.toDateString();
  }
}

export function weekdayNarrow(date, lang) {
  try {
    return new Intl.DateTimeFormat(lang, { weekday: "narrow" }).format(date).toUpperCase();
  } catch (e) {
    return ["D", "L", "M", "X", "J", "V", "S"][date.getDay()];
  }
}

/* ===== Imágenes ===== */

export function pickImage() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    document.body.appendChild(input);
    let settled = false;
    const done = (file) => {
      if (settled) return;
      settled = true;
      input.remove();
      resolve(file || null);
    };
    input.addEventListener("change", () => done(input.files && input.files[0]));
    input.addEventListener("cancel", () => done(null));
    window.addEventListener("focus", () => setTimeout(() => done(input.files && input.files[0]), 500), { once: true });
    input.click();
  });
}

export function compressImage(file, maxSize) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const max = maxSize || 1400;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > max || h > max) {
          const scale = Math.min(max / w, max / h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/* ===== Archivos ===== */

export function downloadText(filename, text, mime) {
  // En el APK se comparte con el selector del sistema.
  if (window.SticklyAndroid && typeof window.SticklyAndroid.saveFile === "function") {
    window.SticklyAndroid.saveFile(filename, text);
    return;
  }
  // En la app de escritorio se abre el diálogo nativo de guardar.
  if (window.SticklyDesktop && typeof window.SticklyDesktop.saveFile === "function") {
    window.SticklyDesktop.saveFile(filename, text);
    return;
  }
  const blob = new Blob([text], { type: mime || "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function pickJsonFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json,.stickly";
    input.style.display = "none";
    document.body.appendChild(input);
    let settled = false;
    const done = (file) => {
      if (settled) return;
      settled = true;
      input.remove();
      resolve(file || null);
    };
    input.addEventListener("change", () => done(input.files && input.files[0]));
    input.addEventListener("cancel", () => done(null));
    input.click();
  });
}

export function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/* ===== Portapapeles ===== */

export async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* seguimos con el plan B */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function dataUrlToBlob(dataUrl) {
  const parts = String(dataUrl || "").split(",");
  const mime = (parts[0].match(/data:([^;]+)/) || [])[1] || "application/octet-stream";
  const bin = atob(parts[1] || "");
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function debounce(fn, ms) {
  let timer = null;
  return function () {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), ms);
  };
}
