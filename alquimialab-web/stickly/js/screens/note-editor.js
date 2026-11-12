/* ==========================================================================
   Stickly · editor de notas
   ========================================================================== */

import { t } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import { ensureUnlocked, promptPin } from "../pin.js";

const COLORS = ["#FEF08A", "#FBCFE8", "#BAE6FD", "#BBF7D0", "#FED7AA", "#E9D5FF", "#F8FAFC"];
const CATEGORIES = ["importante", "compras", "claves"];
const CAT_KEYS = { importante: "catImportante", compras: "catCompras", claves: "catClaves" };

function header(ctx, isNew) {
  return '<div class="editor-head">' +
    '<button type="button" class="icon-btn" data-back aria-label="' + ui.esc(t("cancelar")) + '">' + ui.icon("back") + "</button>" +
    '<span class="editor-head-mid">' + ui.esc(isNew ? t("nuevaNota") : t("editar")) + "</span>" +
    '<button type="button" class="icon-btn" data-save aria-label="' + ui.esc(t("guardar")) + '">' + ui.icon("check") + "</button>" +
  "</div>";
}

function lockedScreen(ctx, note) {
  const hasPin = store.hasPin();
  return {
    html: header(ctx, false) +
      '<div class="vault-gate">' +
        '<div class="vault-icon">' + ui.icon("lock") + "</div>" +
        "<h1>" + ui.esc(t("pinNeeded")) + "</h1>" +
        "<p>" + ui.esc(hasPin ? t("pinNeededText") : t("pinForgotText")) + "</p>" +
        (hasPin
          ? '<button type="button" class="btn btn-primary" data-unlock>' + ui.esc(t("desbloquear")) + "</button>"
          : '<button type="button" class="btn btn-danger" data-reset>' + ui.esc(t("pinReset")) + "</button>") +
      "</div>",
    mount(root) {
      root.querySelector("[data-back]").addEventListener("click", () => ctx.navigate("#/notes"));
      const unlock = root.querySelector("[data-unlock]");
      if (unlock) {
        unlock.addEventListener("click", async () => {
          const ok = await promptPin("unlock");
          if (ok) ctx.rerender();
        });
      }
      const reset = root.querySelector("[data-reset]");
      if (reset) {
        reset.addEventListener("click", async () => {
          const ok = await ui.confirmDialog({
            title: t("pinReset"),
            text: t("pinForgotText"),
            ok: t("eliminar"),
            cancel: t("cancelar"),
            danger: true
          });
          if (!ok) return;
          await store.resetPrivate();
          ui.toast(t("deleteAllDone"));
          ctx.navigate("#/notes");
        });
      }
    },
    cleanup: () => {}
  };
}

export async function render(ctx) {
  const id = ctx.params.id;
  const isNew = !id || id === "new";
  const note = isNew ? null : store.state.notes.find((item) => item.id === id);

  if (!isNew && !note) {
    return {
      html: header(ctx, false) +
        '<div class="empty"><div class="empty-icon">' + ui.icon("alert") + "</div>" +
        "<h3>" + ui.esc(t("error")) + "</h3>" +
        '<button type="button" class="btn btn-primary" data-back-empty>' + ui.esc(t("notas")) + "</button></div>",
      mount(root) {
        root.querySelector("[data-back]").addEventListener("click", () => ctx.navigate("#/notes"));
        root.querySelector("[data-back-empty]").addEventListener("click", () => ctx.navigate("#/notes"));
      },
      cleanup: () => {}
    };
  }

  if (note && note.privada && !store.isUnlocked()) {
    return lockedScreen(ctx, note);
  }

  const payload = note && note.privada ? store.noteView(note) : note;
  const draft = {
    id: note ? note.id : null,
    title: (payload && payload.title) || "",
    content: (payload && payload.content) || "",
    items: Array.isArray(payload && payload.items)
      ? payload.items.map((item) => ({ text: item.text || "", done: !!item.done }))
      : [],
    image: (payload && payload.image) || null,
    tipo: (note && note.tipo) || "texto",
    color: (note && note.color) || COLORS[0],
    categoria: (note && note.categoria) || "importante",
    privada: !!(note && note.privada)
  };

  if (draft.tipo === "checklist" && !draft.items.length) {
    draft.items.push({ text: "", done: false });
  }

  let dirty = false;

  const itemsHtml = () => draft.items.map((item, i) =>
    '<div class="check-item">' +
      '<button type="button" class="check' + (item.done ? " on" : "") + '" data-item-toggle="' + i + '" aria-label="' + ui.esc(t("tipoLista")) + '">' +
        ui.icon("check") + "</button>" +
      '<input type="text" data-item-text="' + i + '" value="' + ui.esc(item.text) + '" placeholder="' + ui.esc(t("item")) + " " + (i + 1) + '" autocomplete="off">' +
      '<button type="button" class="icon-btn sm plain" data-item-del="' + i + '" aria-label="' + ui.esc(t("eliminar")) + '">' +
        ui.icon("trash", "icon-sm") + "</button>" +
    "</div>"
  ).join("");

  const imageHtml = () => draft.image
    ? '<div class="image-box"><img src="' + ui.esc(draft.image) + '" alt="' + ui.esc(t("noteImage")) + '">' +
      '<button type="button" class="remove-img" data-img-remove aria-label="' + ui.esc(t("quitarImagen")) + '">' +
        ui.icon("close", "icon-sm") + "</button></div>"
    : '<button type="button" class="image-add" data-img-add>' + ui.icon("image") + ui.esc(t("subirImagen")) + "</button>";

  const html = header(ctx, isNew) +
    '<div class="editor-title">' +
      '<input id="edTitle" type="text" maxlength="140" autocomplete="off" placeholder="' + ui.esc(t("titlePlaceholder")) + '" value="' + ui.esc(draft.title) + '">' +
    "</div>" +

    '<div class="segmented" role="tablist">' +
      '<button type="button" class="' + (draft.tipo === "texto" ? "active" : "") + '" data-type="texto">' + ui.esc(t("tipoTexto")) + "</button>" +
      '<button type="button" class="' + (draft.tipo === "checklist" ? "active" : "") + '" data-type="checklist">' + ui.esc(t("tipoLista")) + "</button>" +
    "</div>" +

    '<div id="textSection"' + (draft.tipo === "checklist" ? ' class="hide"' : "") + ">" +
      '<textarea id="edContent" class="input" rows="7" placeholder="' + ui.esc(t("escribeAqui")) + '">' + ui.esc(draft.content) + "</textarea>" +
    "</div>" +

    '<div id="checkSection"' + (draft.tipo === "checklist" ? "" : ' class="hide"') + ">" +
      '<div class="checklist-editor" id="edItems">' + itemsHtml() + "</div>" +
      '<button type="button" class="btn btn-ghost btn-block mt-8" data-item-add>' + ui.icon("plus", "icon-sm") + " " + ui.esc(t("anadirItem")) + "</button>" +
    "</div>" +

    '<div class="field mt-14"><span>' + ui.esc(t("color")) + "</span>" +
      '<div class="color-row">' + COLORS.map((color) =>
        '<button type="button" class="color-swatch' + (draft.color === color ? " active" : "") + '" ' +
          'style="background:' + color + '" data-color="' + color + '" aria-label="' + color + '"></button>'
      ).join("") + "</div>" +
    "</div>" +

    '<label class="field"><span>' + ui.esc(t("categoria")) + "</span>" +
      '<select id="edCategory" class="input">' + CATEGORIES.map((cat) =>
        '<option value="' + cat + '"' + (draft.categoria === cat ? " selected" : "") + ">" + ui.esc(t(CAT_KEYS[cat])) + "</option>"
      ).join("") + "</select>" +
    "</label>" +

    '<div class="field"><span>' + ui.esc(t("noteImage")) + '</span><div id="edImageBox">' + imageHtml() + "</div></div>" +

    '<div class="switch-row">' +
      '<span class="menu-icon">' + ui.icon(draft.privada ? "lock" : "unlock") + "</span>" +
      '<span class="switch-main"><b>' + ui.esc(t("notaPrivada")) + "</b>" +
        "<small>" + ui.esc(draft.privada ? t("privateHint") : t("marcarPrivada")) + "</small></span>" +
      '<button type="button" class="switch' + (draft.privada ? " on" : "") + '" role="switch" ' +
        'aria-checked="' + (draft.privada ? "true" : "false") + '" data-private aria-label="' + ui.esc(t("notaPrivada")) + '"></button>' +
    "</div>" +

    '<div class="editor-actions">' +
      (note ? '<button type="button" class="btn btn-danger btn-icon-only" data-del aria-label="' + ui.esc(t("eliminar")) + '">' + ui.icon("trash") + "</button>" : "") +
      '<button type="button" class="btn btn-primary" data-save-bottom>' + ui.esc(t("guardar")) + "</button>" +
    "</div>" +
    '<div style="height:8px"></div>';

  function mount(root) {
    const titleInput = root.querySelector("#edTitle");
    const contentInput = root.querySelector("#edContent");
    const categorySelect = root.querySelector("#edCategory");
    const itemsBox = root.querySelector("#edItems");
    const imageBox = root.querySelector("#edImageBox");
    const switchBtn = root.querySelector("[data-private]");

    const markDirty = () => { dirty = true; };

    titleInput.addEventListener("input", markDirty);
    contentInput.addEventListener("input", markDirty);
    categorySelect.addEventListener("change", () => {
      draft.categoria = categorySelect.value;
      markDirty();
    });

    root.querySelectorAll("[data-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-type");
        if (type === draft.tipo) return;
        draft.tipo = type;
        root.querySelectorAll("[data-type]").forEach((b) => b.classList.toggle("active", b === btn));
        root.querySelector("#textSection").classList.toggle("hide", type !== "texto");
        root.querySelector("#checkSection").classList.toggle("hide", type !== "checklist");
        if (type === "checklist" && !draft.items.length) {
          draft.items.push({ text: "", done: false });
          renderItems();
        }
        markDirty();
      });
    });

    function renderItems() {
      itemsBox.innerHTML = itemsHtml();
    }

    itemsBox.addEventListener("input", (e) => {
      const input = e.target.closest("input[data-item-text]");
      if (!input) return;
      const index = Number(input.getAttribute("data-item-text"));
      if (draft.items[index]) draft.items[index].text = input.value;
      markDirty();
    });

    itemsBox.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-item-toggle]");
      if (toggle) {
        const index = Number(toggle.getAttribute("data-item-toggle"));
        if (!draft.items[index]) return;
        draft.items[index].done = !draft.items[index].done;
        renderItems();
        markDirty();
        return;
      }
      const del = e.target.closest("[data-item-del]");
      if (del) {
        const index = Number(del.getAttribute("data-item-del"));
        draft.items.splice(index, 1);
        if (!draft.items.length) draft.items.push({ text: "", done: false });
        renderItems();
        markDirty();
      }
    });

    root.querySelector("[data-item-add]").addEventListener("click", () => {
      draft.items.push({ text: "", done: false });
      renderItems();
      markDirty();
      const inputs = itemsBox.querySelectorAll("input[data-item-text]");
      const last = inputs[inputs.length - 1];
      if (last) last.focus();
    });

    root.querySelectorAll("[data-color]").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        draft.color = swatch.getAttribute("data-color");
        root.querySelectorAll("[data-color]").forEach((s) => s.classList.toggle("active", s === swatch));
        markDirty();
      });
    });

    function paintImage() {
      imageBox.innerHTML = imageHtml();
      wireImage();
    }

    function wireImage() {
      const add = imageBox.querySelector("[data-img-add]");
      if (add) {
        add.addEventListener("click", async () => {
          const file = await ui.pickImage();
          if (!file) return;
          try {
            draft.image = await ui.compressImage(file, 1400);
            paintImage();
            markDirty();
          } catch (e) {
            ui.toast(t("error"));
          }
        });
      }
      const remove = imageBox.querySelector("[data-img-remove]");
      if (remove) {
        remove.addEventListener("click", () => {
          draft.image = null;
          paintImage();
          markDirty();
        });
      }
    }
    wireImage();

    function paintSwitch() {
      switchBtn.classList.toggle("on", draft.privada);
      switchBtn.setAttribute("aria-checked", draft.privada ? "true" : "false");
      const iconBox = root.querySelector(".switch-row .menu-icon");
      if (iconBox) iconBox.innerHTML = ui.icon(draft.privada ? "lock" : "unlock");
      const small = root.querySelector(".switch-row small");
      if (small) small.textContent = draft.privada ? t("privateHint") : t("marcarPrivada");
    }

    switchBtn.addEventListener("click", async () => {
      if (draft.privada) {
        const ok = await ui.confirmDialog({
          title: t("desmarcarPrivada"),
          text: t("privateOffText"),
          ok: t("desmarcarPrivada"),
          cancel: t("cancelar"),
          danger: true
        });
        if (!ok) return;
        draft.privada = false;
      } else {
        const ok = await ensureUnlocked();
        if (!ok) return;
        draft.privada = true;
      }
      paintSwitch();
      markDirty();
    });

    async function save() {
      const title = titleInput.value.trim();
      const content = contentInput.value;
      const items = draft.tipo === "checklist"
        ? draft.items.map((item) => ({ text: String(item.text || "").trim(), done: !!item.done })).filter((item) => item.text)
        : [];
      if (!title && !content.trim() && !items.length && !draft.image) {
        ui.toast(t("noContent"));
        return;
      }
      if (draft.privada) {
        if (!store.isUnlocked()) {
          const ok = await ensureUnlocked();
          if (!ok) return;
        }
      }
      try {
        await store.saveNote({
          id: draft.id,
          titulo: title,
          title,
          content,
          items,
          image: draft.image,
          tipo: draft.tipo,
          color: draft.color,
          categoria: draft.categoria,
          privada: draft.privada
        });
        dirty = false;
        ctx.setGuard(null);
        ui.toast(t("saved"));
        ctx.navigate("#/notes");
      } catch (e) {
        console.error(e);
        ui.toast(e && e.message === "locked" ? t("locked") : t("error"));
      }
    }

    root.querySelector("[data-save]").addEventListener("click", save);
    root.querySelector("[data-save-bottom]").addEventListener("click", save);

    const del = root.querySelector("[data-del]");
    if (del) {
      del.addEventListener("click", async () => {
        const ok = await ui.confirmDialog({
          title: t("borrarPostIt"),
          ok: t("eliminar"),
          cancel: t("cancelar"),
          danger: true
        });
        if (!ok) return;
        await store.deleteNote(note.id);
        dirty = false;
        ctx.setGuard(null);
        ui.toast(t("deleteAllDone"));
        ctx.navigate("#/notes");
      });
    }

    root.querySelector("[data-back]").addEventListener("click", () => ctx.navigate("#/notes"));

    ctx.setGuard(() => {
      if (!dirty) return true;
      return ui.confirmDialog({
        title: t("confirmLeave"),
        ok: t("discard"),
        cancel: t("keepEditing"),
        danger: true
      });
    });

    const onBeforeUnload = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }

  let cleanupFn = null;
  return {
    html,
    mount(root) { cleanupFn = mount(root); },
    cleanup() { if (cleanupFn) cleanupFn(); }
  };
}
