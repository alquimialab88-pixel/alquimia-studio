/* ==========================================================================
   Stickly · detalle del cuaderno y notas de voz
   ========================================================================== */

import { t, getLang } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import { openNotebookSheet } from "./notebooks.js";

let sessionCleanup = null;

function stopSession() {
  if (sessionCleanup) {
    try { sessionCleanup(); } catch (e) { /* ignore */ }
    sessionCleanup = null;
  }
}

function fmtDuration(sec) {
  const total = Math.max(0, Math.round(Number(sec) || 0));
  return Math.floor(total / 60) + ":" + ui.pad2(total % 60);
}

function pickMime() {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  for (const type of types) {
    try {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) return type;
    } catch (e) { /* ignore */ }
  }
  return "";
}

function openNoteSheet(options) {
  const opts = options || {};
  const note = opts.note || null;
  const notebookId = opts.notebookId;
  const notebook = store.state.notebooks.find((item) => item.id === notebookId);
  const draft = {
    id: note ? note.id : null,
    titulo: note ? note.titulo : "",
    contenido: note ? note.contenido : "",
    audio: note ? note.audio : null,
    audioSec: note ? (note.audioSec || 0) : 0
  };

  let dirty = false;
  let recorder = null;
  let stream = null;
  let chunks = [];
  let recording = false;
  let startedAt = 0;
  let tickTimer = null;
  let maxTimer = null;
  let stopPromise = null;
  let stopResolve = null;

  const sheet = ui.openSheet(
    "<h2>" + ui.esc(note ? t("editar") : t("nuevaNota")) + "</h2>" +
    '<p class="sheet-sub">' + ui.esc(notebook ? notebook.titulo : t("cuaderno")) + "</p>" +
    '<label class="field"><span>' + ui.esc(t("titulo")) + "</span>" +
      '<input id="nnTitle" class="input" type="text" maxlength="110" autocomplete="off" ' +
        'value="' + ui.esc(draft.titulo) + '" placeholder="' + ui.esc(t("titlePlaceholder")) + '"></label>' +
    '<label class="field"><span>' + ui.esc(t("escribeAqui")) + "</span>" +
      '<textarea id="nnContent" class="input" rows="5" placeholder="' + ui.esc(t("escribeAqui")) + '">' + ui.esc(draft.contenido) + "</textarea></label>" +
    '<div id="recBox"></div>' +
    '<div class="sheet-actions">' +
      (note ? '<button type="button" class="btn btn-danger" data-del>' + ui.esc(t("eliminar")) + "</button>" : "") +
      '<button type="button" class="btn btn-ghost" data-cancel>' + ui.esc(t("cancelar")) + "</button>" +
      '<button type="button" class="btn btn-primary" data-save>' + ui.esc(t("guardar")) + "</button>" +
    "</div>"
  );

  const titleInput = sheet.querySelector("#nnTitle");
  const contentInput = sheet.querySelector("#nnContent");
  const recBox = sheet.querySelector("#recBox");
  const markDirty = () => { dirty = true; };

  titleInput.addEventListener("input", markDirty);
  contentInput.addEventListener("input", markDirty);

  function cleanup() {
    clearInterval(tickTimer);
    clearTimeout(maxTimer);
    tickTimer = null;
    maxTimer = null;
    if (recorder && recorder.state !== "inactive") {
      try { recorder.onstop = null; recorder.stop(); } catch (e) { /* ignore */ }
    }
    recorder = null;
    if (stream) {
      stream.getTracks().forEach((track) => { try { track.stop(); } catch (e) { /* ignore */ } });
      stream = null;
    }
    recording = false;
  }

  function recorderHtml() {
    if (recording) {
      return '<div class="recorder">' +
        '<span class="rec-dot on"></span>' +
        '<div class="rec-main"><b>' + ui.esc(t("grabando")) + "</b><small>" + ui.esc(t("recordHint")) + "</small></div>" +
        '<span class="rec-time" id="recTime">0:00</span>' +
        '<button type="button" class="icon-btn danger" data-rec-stop aria-label="' + ui.esc(t("detener")) + '">' + ui.icon("stop", "icon-sm") + "</button>" +
      "</div>";
    }
    if (draft.audio) {
      return '<div class="field"><span>' + ui.esc(t("audioNote")) + "</span>" +
        '<audio controls preload="metadata" src="' + ui.esc(draft.audio) + '"></audio>' +
        '<div class="row mt-8" style="gap:8px">' +
          '<button type="button" class="btn btn-ghost grow" data-rec-start>' + ui.icon("mic", "icon-sm") + " " + ui.esc(t("recordAgain")) + "</button>" +
          '<button type="button" class="btn btn-danger" data-rec-del>' + ui.esc(t("removeAudio")) + "</button>" +
        "</div></div>";
    }
    return '<div class="recorder">' +
      '<span class="rec-dot"></span>' +
      '<div class="rec-main"><b>' + ui.esc(t("audioNote")) + "</b><small>" + ui.esc(t("recordHint")) + "</small></div>" +
      '<button type="button" class="btn btn-primary" style="min-height:38px;padding:8px 14px;font-size:12px" data-rec-start>' +
        ui.icon("mic", "icon-sm") + " " + ui.esc(t("grabar")) + "</button>" +
    "</div>";
  }

  function paintRecorder() {
    recBox.innerHTML = recorderHtml();
    wireRecorder();
  }

  function wireRecorder() {
    const start = recBox.querySelector("[data-rec-start]");
    if (start) start.addEventListener("click", startRecording);

    const stop = recBox.querySelector("[data-rec-stop]");
    if (stop) stop.addEventListener("click", stopRecording);

    const del = recBox.querySelector("[data-rec-del]");
    if (del) {
      del.addEventListener("click", () => {
        draft.audio = null;
        draft.audioSec = 0;
        markDirty();
        paintRecorder();
      });
    }
  }

  function tick() {
    const el = recBox.querySelector("#recTime");
    if (el) el.textContent = fmtDuration((Date.now() - startedAt) / 1000);
  }

  async function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
      ui.toast(t("audioUnsupported"));
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      ui.toast(t("permisoAudio"));
      return;
    }

    const mime = pickMime();
    try {
      recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch (e) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
      ui.toast(t("audioUnsupported"));
      return;
    }

    chunks = [];
    recorder.addEventListener("dataavailable", (e) => {
      if (e.data && e.data.size) chunks.push(e.data);
    });

    recorder.addEventListener("stop", async () => {
      const type = (recorder && recorder.mimeType) || mime || "audio/webm";
      const duration = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      if (stream) {
        stream.getTracks().forEach((track) => { try { track.stop(); } catch (e) { /* ignore */ } });
        stream = null;
      }
      recorder = null;
      recording = false;
      clearInterval(tickTimer);
      clearTimeout(maxTimer);
      tickTimer = null;
      maxTimer = null;

      if (!chunks.length) {
        paintRecorder();
        if (stopResolve) { stopResolve(); stopResolve = null; stopPromise = null; }
        return;
      }
      try {
        const blob = new Blob(chunks, { type });
        draft.audio = await ui.blobToDataUrl(blob);
        draft.audioSec = duration;
        markDirty();
        ui.toast(t("audioReady"));
      } catch (e) {
        ui.toast(t("audioError"));
      }
      paintRecorder();
      if (stopResolve) { stopResolve(); stopResolve = null; stopPromise = null; }
    });

    recorder.start();
    recording = true;
    startedAt = Date.now();
    paintRecorder();
    tickTimer = setInterval(tick, 500);
    maxTimer = setTimeout(() => {
      if (recording) stopRecording();
    }, 10 * 60 * 1000);
  }

  function stopRecording() {
    if (!recorder || recorder.state === "inactive") return Promise.resolve();
    if (stopPromise) return stopPromise;
    stopPromise = new Promise((resolve) => {
      stopResolve = resolve;
      try {
        recorder.stop();
      } catch (e) {
        stopResolve = null;
        stopPromise = null;
        resolve();
      }
    });
    return stopPromise;
  }

  paintRecorder();

  let guardando = false;

  const save = async () => {
    if (guardando) return;
    const titulo = titleInput.value.trim();
    const contenido = contentInput.value.trim();

    if (recording) {
      ui.toast(t("audioSaving"));
      await stopRecording();
    }
    if (recording) {
      ui.toast(t("audioWait"));
      return;
    }
    if (!titulo && !contenido && !draft.audio) {
      ui.toast(t("noContent"));
      return;
    }

    guardando = true;
    try {
      const saved = await store.saveNotebookNote({
        id: draft.id,
        cuadernoId: notebookId,
        titulo,
        contenido,
        audio: draft.audio,
        audioSec: draft.audioSec,
        timestamp: note ? note.timestamp : Date.now()
      });
      if (!saved) {
        ui.toast(t("noContent"));
        return;
      }
      cleanup();
      sheet.close();
      ui.toast(t("saved"));
      if (opts.onDone) opts.onDone();
    } catch (e) {
      console.error(e);
      ui.toast(t("audioNoSave"));
    } finally {
      guardando = false;
    }
  };

  sheet.querySelector("[data-save]").addEventListener("click", save);
  sheet.querySelector("[data-cancel]").addEventListener("click", () => sheet.close());

  const del = sheet.querySelector("[data-del]");
  if (del) {
    del.addEventListener("click", async () => {
      const ok = await ui.confirmDialog({
        title: t("deleteNotebookNote"),
        ok: t("eliminar"),
        cancel: t("cancelar"),
        danger: true
      });
      if (!ok) return;
      await store.deleteNotebookNote(note.id);
      cleanup();
      sheet.close();
      ui.toast(t("deleteAllDone"));
      if (opts.onDone) opts.onDone();
    });
  }

  const originalClose = sheet.close.bind(sheet);
  sheet.close = () => {
    cleanup();
    if (sessionCleanup === cleanup) sessionCleanup = null;
    originalClose();
  };
  sessionCleanup = cleanup;

  // Si dirty no se usa todavía aquí, pero evita perder una nota por un toque fuera.
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet && dirty) {
      // el clic en el fondo lo maneja openSheet; no hacemos nada especial
    }
  });

  setTimeout(() => { titleInput.focus(); }, 140);
}

export async function render(ctx) {
  const id = ctx.params.id;
  const notebook = store.state.notebooks.find((item) => item.id === id);

  if (!notebook) {
    return {
      html: '<div class="editor-head"><button type="button" class="icon-btn" data-back>' + ui.icon("back") + "</button>" +
        '<span class="editor-head-mid">' + ui.esc(t("cuaderno")) + "</span><span style=\"width:42px\"></span></div>" +
        '<div class="empty"><div class="empty-icon">' + ui.icon("alert") + "</div><h3>" + ui.esc(t("error")) + "</h3>" +
        '<button type="button" class="btn btn-primary" data-back>' + ui.esc(t("cuadernos")) + "</button></div>",
      mount(root) {
        root.querySelectorAll("[data-back]").forEach((btn) => btn.addEventListener("click", () => ctx.navigate("#/notebooks")));
      },
      cleanup: () => {}
    };
  }

  const notes = store.notesForNotebook(id);
  const color = notebook.color || "#DDD6FE";

  const noteCards = notes.map((note) => (
    '<div class="nb-note" role="button" tabindex="0" data-note="' + ui.esc(note.id) + '">' +
      '<div class="nb-note-top"><h3>' + ui.esc(note.titulo || t("titlePlaceholder")) + "</h3>" +
        ui.icon("edit", "icon-sm") + "</div>" +
      (note.contenido ? "<p>" + ui.esc(note.contenido) + "</p>" : "") +
      (note.audio
        ? '<audio controls preload="metadata" src="' + ui.esc(note.audio) + '"></audio>'
        : "") +
      '<div class="meta">' +
        ui.esc(ui.fmtShortDate(new Date(note.timestamp || Date.now()), getLang())) +
        (note.audioSec ? " · " + ui.icon("mic", "icon-sm") + " " + fmtDuration(note.audioSec) : "") +
      "</div>" +
    "</div>"
  )).join("");

  const html =
    '<div class="editor-head">' +
      '<button type="button" class="icon-btn" data-back aria-label="' + ui.esc(t("cuadernos")) + '">' + ui.icon("back") + "</button>" +
      '<span class="editor-head-mid">' + ui.esc(t("cuaderno")) + "</span>" +
      '<div class="row">' +
        '<button type="button" class="icon-btn sm plain" data-edit-nb aria-label="' + ui.esc(t("editNotebook")) + '">' + ui.icon("edit", "icon-sm") + "</button>" +
        '<button type="button" class="icon-btn sm plain" data-del-nb aria-label="' + ui.esc(t("eliminar")) + '">' + ui.icon("trash", "icon-sm") + "</button>" +
      "</div>" +
    "</div>" +

    '<div class="nb-hero" style="--nb-c:' + ui.esc(color) + '">' +
      "<h1>" + ui.esc(notebook.titulo) + "</h1>" +
      "<p>" + ui.esc(t("noteCount", { n: notes.length })) + "</p>" +
    "</div>" +

    (notes.length
      ? '<div class="nb-notes">' + noteCards + "</div>"
      : '<div class="empty"><div class="empty-icon">' + ui.icon("file") + "</div>" +
        "<h3>" + ui.esc(t("nuevaNota")) + "</h3>" +
        "<p>" + ui.esc(t("sinNotasCuaderno")) + "</p>" +
        '<button type="button" class="btn btn-primary" data-add-note>' + ui.esc(t("nuevaNota")) + "</button></div>") +

    '<button type="button" class="fab no-nav" data-add-note aria-label="' + ui.esc(t("nuevaNota")) + '">' + ui.icon("plus") + "</button>";

  function mount(root) {
    root.querySelectorAll("[data-back]").forEach((btn) => btn.addEventListener("click", () => ctx.navigate("#/notebooks")));

    root.querySelector("[data-edit-nb]").addEventListener("click", () => {
      openNotebookSheet({ notebook, onDone: () => ctx.rerender() });
    });

    root.querySelector("[data-del-nb]").addEventListener("click", async () => {
      const ok = await ui.confirmDialog({
        title: t("deleteNotebook"),
        ok: t("eliminar"),
        cancel: t("cancelar"),
        danger: true
      });
      if (!ok) return;
      await store.deleteNotebook(notebook.id);
      ui.toast(t("deleteAllDone"));
      ctx.navigate("#/notebooks");
    });

    root.querySelectorAll("[data-add-note]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openNoteSheet({ notebookId: notebook.id, onDone: () => ctx.rerender() });
      });
    });

    root.querySelectorAll("[data-note]").forEach((card) => {
      const openNote = () => {
        const note = store.state.notebookNotes.find((item) => item.id === card.getAttribute("data-note"));
        if (note) openNoteSheet({ note, notebookId: notebook.id, onDone: () => ctx.rerender() });
      };
      card.addEventListener("click", (e) => {
        if (e.target.closest("audio")) return;
        openNote();
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openNote();
        }
      });
    });
  }

  return {
    html,
    mount,
    cleanup: () => { stopSession(); }
  };
}
