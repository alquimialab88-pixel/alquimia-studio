/* ==========================================================================
   Stickly · bienvenida
   ========================================================================== */

import { t, getLang } from "../i18n.js";
import * as store from "../store.js";
import * as ui from "../ui.js";
import { promptPin } from "../pin.js";

const SLIDES = [
  { title: "onb1t", text: "onb1d", icon: "note", art: "notes", photo: "assets/antonio-1.webp" },
  { title: "onb2t", text: "onb2d", icon: "shield", art: "shield", photo: "assets/antonio-2.webp" },
  { title: "onb3t", text: "onb3d", icon: "download", art: "install", photo: "assets/antonio-3.webp" }
];

function art(icon, kind) {
  if (kind === "shield") {
    return '<div class="onb-art">' +
      '<div class="oa" style="background:var(--green)"><span></span><span></span><span></span></div>' +
      '<div class="oa" style="background:var(--lilac)"><span></span><span></span><span></span></div>' +
      '<div class="oa" style="background:var(--blue)"><span></span><span></span><span></span></div>' +
      '<span class="oa-badge">' + ui.icon("shield") + "</span></div>";
  }
  if (kind === "install") {
    return '<div class="onb-art">' +
      '<div class="oa" style="background:var(--pink)"><span></span><span></span><span></span></div>' +
      '<div class="oa" style="background:var(--yellow)"><span></span><span></span><span></span></div>' +
      '<div class="oa" style="background:var(--green)"><span></span><span></span><span></span></div>' +
      '<span class="oa-badge">' + ui.icon("download") + "</span></div>";
  }
  return '<div class="onb-art">' +
    '<div class="oa" style="background:var(--yellow)"><span></span><span></span><span></span></div>' +
    '<div class="oa" style="background:var(--pink)"><span></span><span></span><span></span></div>' +
    '<div class="oa" style="background:var(--blue)"><span></span><span></span><span></span></div>' +
    '<span class="oa-badge">' + ui.icon(icon) + "</span></div>";
}

// Ilustración de respaldo + foto de Antonio. Si el archivo no existe,
// se queda la ilustración y no aparece ningún icono roto.
function visual(slide) {
  return '<div class="onb-visual">' +
    art(slide.icon, slide.art) +
    '<img class="onb-photo" src="' + ui.esc(slide.photo) + '" alt="" decoding="async">' +
  "</div>";
}

function wirePhotos(root) {
  root.querySelectorAll(".onb-photo").forEach((img) => {
    const wrap = img.closest(".onb-visual");
    if (!wrap) return;
    if (img.complete && img.naturalWidth) {
      wrap.classList.add("has-photo");
      return;
    }
    img.addEventListener("load", () => wrap.classList.add("has-photo"));
    img.addEventListener("error", () => {
      const step = Number(img.dataset.retried || "0");
      img.dataset.retried = String(step + 1);
      const next = [".webp", ".png", ".jpg"];
      const current = next.findIndex((ext) => img.src.endsWith(ext));
      if (step < 2 && current >= 0 && current < next.length - 1) {
        img.src = img.src.split(next[current]).join(next[current + 1]);
      } else {
        img.remove();
      }
    });
  });
}

export async function render(ctx) {
  let step = 0;

  function screen() {
    if (step < SLIDES.length) {
      const slide = SLIDES[step];
      return '<div class="onb">' +
        '<button type="button" class="onb-skip" data-skip>' + ui.esc(t("skip")) + "</button>" +
        '<div class="onb-body">' +
          visual(slide) +
          '<span class="onb-eyebrow">' + ui.esc(step === 0 ? t("onbEyebrow") : "Stickly") + "</span>" +
          "<h1>" + ui.esc(step === 0 ? t("onbTitle") : t(slide.title)) + "</h1>" +
          '<p class="onb-text">' + ui.esc(t(slide.text)) + "</p>" +
          '<div class="onb-dots">' + SLIDES.map((_, i) =>
            '<span class="' + (i === step ? "on" : "") + '"></span>').join("") + "</div>" +
          '<div class="onb-actions">' +
            '<button type="button" class="btn btn-primary btn-block" data-next>' +
              ui.esc(step === SLIDES.length - 1 ? t("start") : t("next")) +
            "</button>" +
          "</div>" +
          '<p class="onb-foot">Stickly · Alquimia Lab · v1.0.0</p>' +
        "</div>" +
      "</div>";
    }

    // Paso final: ofrecer PIN (sin ilustración).
    return '<div class="onb">' +
      '<div class="onb-body onb-body-plain">' +
        '<span class="onb-eyebrow">' + ui.esc(t("security")) + "</span>" +
        "<h1>" + ui.esc(t("pin6")) + "</h1>" +
        '<p class="onb-text">' + ui.esc(t("onb2d")) + "</p>" +
        '<div class="onb-actions mt-20">' +
          '<button type="button" class="btn btn-primary btn-block" data-create-pin>' +
            ui.esc(t("createPin")) + "</button>" +
          '<button type="button" class="btn btn-ghost btn-block" data-skip>' +
            ui.esc(t("skip")) + "</button>" +
        "</div>" +
        '<p class="onb-foot">' + ui.esc(t("vaultHelp")) + "</p>" +
      "</div>" +
    "</div>";
  }

  async function finish() {
    await store.completeOnboarding();
    ctx.navigate("#/home");
  }

  function html() {
    return screen();
  }

  function mount(root) {
    function paint() {
      root.innerHTML = screen();
      wire();
    }

    function wire() {
      const next = root.querySelector("[data-next]");
      if (next) {
        next.addEventListener("click", () => {
          step = Math.min(SLIDES.length, step + 1);
          paint();
        });
      }
      root.querySelectorAll("[data-skip]").forEach((btn) => {
        btn.addEventListener("click", finish);
      });
      const create = root.querySelector("[data-create-pin]");
      if (create) {
        create.addEventListener("click", async () => {
          create.disabled = true;
          const ok = await promptPin("setup", { text: t("onb2d") });
          create.disabled = false;
          if (ok) await finish();
        });
      }
      wirePhotos(root);
    }

    wire();
  }

  return {
    html: html(),
    mount,
    cleanup: () => {}
  };
}
