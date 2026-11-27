/* =========================================================
   STEPHANIA DANIEL — interacciones
   Menú, modales, formularios (maqueta) e idioma ES/EN.
   ========================================================= */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Textos generados por JavaScript ---------- */
const MESSAGES = {
  es: {
    subscribe: '¡Gracias! Tu suscripción quedó registrada.',
    contact:   '¡Gracias por escribir! Tu mensaje se envió correctamente.',
    sending:   'Enviando…',
    error:     'Algo salió mal. Inténtalo de nuevo en un momento.',
    title:     'Stephania Daniel — Escritora de romance y dark romance',
    description: 'Sitio oficial de Stephania Daniel. Novelas de romance y dark romance, la Trilogía de las Hermanas Lombardi y contacto directo con la autora.'
  },
  en: {
    subscribe: 'Thank you! Your subscription has been registered.',
    contact:   'Thank you for writing! Your message was sent successfully.',
    sending:   'Sending…',
    error:     'Something went wrong. Please try again in a moment.',
    title:     'Stephania Daniel — Romance and Dark Romance Author',
    description: 'Official website of Stephania Daniel. Romance and dark romance novels, the Lombardi Sisters Trilogy, and direct contact with the author.'
  }
};

let currentLang = 'es';

/* ---------- Traducción de contenido estático ---------- */
function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Texto (admite HTML interno, p. ej. <em>)
  $$('[data-en]').forEach(el => {
    if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
    el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.es;
  });

  // aria-label
  $$('[data-aria-en]').forEach(el => {
    if (el.dataset.ariaEs === undefined) {
      el.dataset.ariaEs = el.getAttribute('aria-label') || '';
    }
    el.setAttribute('aria-label', lang === 'en' ? el.dataset.ariaEn : el.dataset.ariaEs);
  });

  // placeholder
  $$('[data-ph-en]').forEach(el => {
    if (el.dataset.phEs === undefined) {
      el.dataset.phEs = el.getAttribute('placeholder') || '';
    }
    el.setAttribute('placeholder', lang === 'en' ? el.dataset.phEn : el.dataset.phEs);
  });

  // Imágenes (portadas) según el idioma del libro
  $$('[data-src-en]').forEach(img => {
    if (img.dataset.srcEs === undefined) {
      img.dataset.srcEs = img.getAttribute('src') || '';
    }
    img.setAttribute('src', lang === 'en' ? img.dataset.srcEn : img.dataset.srcEs);
  });

  // Texto alternativo de las imágenes
  $$('[data-alt-en]').forEach(img => {
    if (img.dataset.altEs === undefined) {
      img.dataset.altEs = img.getAttribute('alt') || '';
    }
    img.setAttribute('alt', lang === 'en' ? img.dataset.altEn : img.dataset.altEs);
  });

  // Enlaces de compra: edición española o inglesa
  $$('[data-href-en]').forEach(link => {
    if (link.dataset.hrefEs === undefined) {
      link.dataset.hrefEs = link.getAttribute('href') || '';
    }
    link.setAttribute('href', lang === 'en' ? link.dataset.hrefEn : link.dataset.hrefEs);
  });

  // Estado de las reseñas desplegables
  $$('.review').forEach(card => {
    const copy = card.querySelector('.review-copy');
    const more = card.querySelector('.review-more');
    if (!copy || !more) return;
    const open = card.classList.contains('is-open');
    if (!open) more.hidden = copy.scrollHeight <= copy.clientHeight + 2;
    more.setAttribute('aria-label', reviewMoreLabel(lang, open));
  });

  // Estado de las sinopsis desplegables de la serie
  $$('.serie-book').forEach(book => {
    const synopsis = book.querySelector('.serie-book-synopsis');
    const more = book.querySelector('.serie-more');
    if (!synopsis || !more) return;
    const open = book.classList.contains('is-open');
    if (!open) more.hidden = synopsis.scrollHeight <= synopsis.clientHeight + 2;
    more.textContent = serieMoreLabel(lang, open);
  });

  // Metadatos del documento
  document.title = MESSAGES[lang].title;
  const meta = $('meta[name="description"]');
  if (meta) meta.setAttribute('content', MESSAGES[lang].description);

  // Estado del selector
  const current = $('.lang-current');
  if (current) current.textContent = lang.toUpperCase();
  $$('[data-lang]').forEach(btn => {
    btn.setAttribute('aria-selected', String(btn.dataset.lang === lang));
  });

  // Limpiar confirmaciones de formularios al cambiar de idioma
  $$('.form-status').forEach(status => { status.textContent = ''; });

  // Cerrar modales abiertos para que no queden con texto del otro idioma
  $$('dialog[open]').forEach(dialog => dialog.close());

  try { localStorage.setItem('sd-lang', lang); } catch (e) { /* sin almacenamiento */ }
}

/* ---------- Etiquetas de botones desplegables ---------- */
const reviewMoreLabel = (lang, open) => lang === 'en'
  ? (open ? 'Show less' : 'Read full review')
  : (open ? 'Ver menos' : 'Ver reseña completa');

const serieMoreLabel = (lang, open) => lang === 'en'
  ? (open ? 'Show less' : '… see more')
  : (open ? 'Ver menos' : '… ver más');

/* ---------- Contenido dinámico según el idioma ---------- */
function pick(el, base) {
  const key = currentLang === 'en' ? `${base}En` : base;
  return el.dataset[key] || '';
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año del pie de página ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Idioma guardado ---------- */
  let saved = null;
  try { saved = localStorage.getItem('sd-lang'); } catch (e) { /* nada */ }
  applyLanguage(saved === 'en' ? 'en' : 'es');

  /* ---------- Menú móvil ---------- */
  const toggle = $('.nav-toggle');
  const nav = $('#main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    $$('#main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Selector de idioma ---------- */
  const langBtn = $('.lang-btn');
  const langMenu = $('.lang-menu');

  if (langBtn && langMenu) {
    const closeLang = () => {
      langMenu.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
    };

    langBtn.addEventListener('click', event => {
      event.stopPropagation();
      const open = langMenu.classList.toggle('is-open');
      langBtn.setAttribute('aria-expanded', String(open));
    });

    $$('[data-lang]', langMenu).forEach(option => {
      option.addEventListener('click', () => {
        applyLanguage(option.dataset.lang);
        closeLang();
      });
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.lang-switch')) closeLang();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeLang();
    });
  }

  /* ---------- Enlace activo según la sección visible ---------- */
  const navLinks = $$('.main-nav a');
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => spy.observe(section));
  }

  /* ---------- Carrusel de opiniones ---------- */
  const reviewsViewport = $('.reviews-viewport');
  if (reviewsViewport) {
    const track = reviewsViewport.querySelector('.reviews-track');
    const prev = $('.reviews-prev');
    const next = $('.reviews-next');

    const cards = $$('.review', track);

    const stepSize = () => {
      const card = track.querySelector('.review');
      if (!card) return reviewsViewport.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const updateArrows = () => {
      const max = reviewsViewport.scrollWidth - reviewsViewport.clientWidth;
      if (prev) prev.disabled = reviewsViewport.scrollLeft <= 6;
      if (next) next.disabled = reviewsViewport.scrollLeft >= max - 6;
    };

    // Resalta la tarjeta que queda en el centro del carrusel.
    const markCenter = () => {
      const singleView = window.matchMedia('(max-width: 960px)').matches;
      if (singleView) {
        cards.forEach(card => card.classList.remove('is-center'));
        return;
      }

      const box = reviewsViewport.getBoundingClientRect();
      const center = box.left + box.width / 2;
      let closest = null;
      let distance = Infinity;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const gap = Math.abs(rect.left + rect.width / 2 - center);
        if (gap < distance) {
          distance = gap;
          closest = card;
        }
      });

      cards.forEach(card => card.classList.toggle('is-center', card === closest));
    };

    const refresh = () => {
      updateArrows();
      markCenter();
    };

    const scrollStep = direction => {
      const start = reviewsViewport.scrollLeft;
      const max = reviewsViewport.scrollWidth - reviewsViewport.clientWidth;
      const target = Math.max(0, Math.min(max, start + direction * stepSize()));

      reviewsViewport.scrollBy({ left: direction * stepSize(), behavior: 'smooth' });

      // Si el navegador no completa el desplazamiento, salta al destino.
      setTimeout(() => {
        if (Math.abs(reviewsViewport.scrollLeft - target) > 4) {
          reviewsViewport.scrollLeft = target;
        }
        refresh();
      }, 500);
    };

    prev?.addEventListener('click', () => scrollStep(-1));
    next?.addEventListener('click', () => scrollStep(1));

    reviewsViewport.addEventListener('scroll', refresh, { passive: true });
    reviewsViewport.addEventListener('scrollend', refresh);
    window.addEventListener('resize', refresh);
    refresh();
  }

  /* ---------- Reseñas: ver más / ver menos ---------- */
  $$('.review').forEach(card => {
    const copy = card.querySelector('.review-copy');
    const more = card.querySelector('.review-more');
    if (!copy || !more) return;

    const sync = () => {
      const open = card.classList.contains('is-open');
      if (!open) {
        more.hidden = copy.scrollHeight <= copy.clientHeight + 2;
      } else {
        more.hidden = false;
      }
      more.setAttribute('aria-label', reviewMoreLabel(currentLang, open));
    };

    more.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      more.setAttribute('aria-expanded', String(open));
      sync();
    });

    sync();
  });

  /* ---------- Serie: sinopsis ver más / ver menos ---------- */
  function syncSerieBooks() {
    $$('.serie-book').forEach(book => {
      const synopsis = book.querySelector('.serie-book-synopsis');
      const more = book.querySelector('.serie-more');
      if (!synopsis || !more) return;

      const open = book.classList.contains('is-open');
      if (!open) {
        more.hidden = synopsis.scrollHeight <= synopsis.clientHeight + 2;
      } else {
        more.hidden = false;
      }
      more.textContent = serieMoreLabel(currentLang, open);
    });
  }

  $$('.serie-more').forEach(more => {
    more.addEventListener('click', () => {
      const book = more.closest('.serie-book');
      if (!book) return;
      const open = book.classList.toggle('is-open');
      more.setAttribute('aria-expanded', String(open));
      syncSerieBooks();
    });
  });

  syncSerieBooks();
  window.addEventListener('resize', syncSerieBooks);

  /* ---------- Vista previa de la sinopsis (lupa) ---------- */
  $$('.js-obra').forEach(button => {
    const card = button.closest('.obra');
    const cover = button.closest('.obra-cover');
    if (!card || !cover) return;

    const preview = document.createElement('div');
    preview.className = 'obra-preview';
    preview.setAttribute('aria-hidden', 'true');
    preview.innerHTML =
      '<p class="obra-preview-label"></p>' +
      '<p class="obra-preview-title"></p>' +
      '<p class="obra-preview-text"></p>';
    cover.appendChild(preview);

    const label = preview.querySelector('.obra-preview-label');
    const title = preview.querySelector('.obra-preview-title');
    const text = preview.querySelector('.obra-preview-text');

    const fill = () => {
      label.textContent = currentLang === 'en' ? 'Synopsis' : 'Sinopsis';
      title.textContent = pick(card, 'titulo');
      text.textContent = pick(card, 'sinopsis');
    };

    button.addEventListener('mouseenter', () => {
      fill();
      cover.classList.add('is-previewing');
    });
    button.addEventListener('mouseleave', () => {
      cover.classList.remove('is-previewing');
    });
    button.addEventListener('focus', () => {
      fill();
      cover.classList.add('is-previewing');
    });
    button.addEventListener('blur', () => {
      cover.classList.remove('is-previewing');
    });
    button.addEventListener('click', () => {
      cover.classList.remove('is-previewing');
    });
  });

  /* ---------- Modal de obra (sinopsis) ---------- */
  const obraModal = $('#modal-obra');

  $$('.js-obra').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.obra');
      if (!card || !obraModal) return;

      const set = (key, value) => {
        const node = obraModal.querySelector(`[data-modal="${key}"]`);
        if (node) node.textContent = value || '';
      };

      const titulo = pick(card, 'titulo');
      set('titulo', titulo);
      set('serie', pick(card, 'serie'));
      set('sinopsis', pick(card, 'sinopsis'));

      // Portada real del libro en el modal (según el idioma activo)
      const cover = obraModal.querySelector('#modal-obra-cover');
      const cardImg = card.querySelector('.obra-img');
      if (cover && cardImg) {
        cover.src = cardImg.getAttribute('src');
        cover.alt = cardImg.getAttribute('alt');
      }

      const originBtns = card.querySelectorAll('.obra-actions .btn-buy');
      const modalBtns = obraModal.querySelectorAll('.btn-buy');
      modalBtns.forEach((btn, i) => {
        const href = originBtns[i]?.getAttribute('href');
        if (href) btn.setAttribute('href', href);
      });

      obraModal.showModal();
    });
  });

  /* ---------- Modal de serie (ver más) ---------- */
  const serieModal = $('#modal-serie');

  $$('.js-serie').forEach(button => {
    button.addEventListener('click', () => {
      serieModal?.showModal();
      syncSerieBooks();
    });
  });

  /* ---------- Cerrar modales ---------- */
  $$('[data-close]').forEach(button => {
    button.addEventListener('click', () => {
      button.closest('dialog')?.close();
    });
  });

  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      // Cerrar al hacer clic fuera de la caja del modal
      if (event.target === dialog) dialog.close();
    });
  });

  /* ---------- Formularios (Netlify Forms) ---------- */
  // Netlify recibe el POST en la raíz del sitio y guarda el envío.
  // Los avisos por correo se configuran en Netlify → Forms.
  const forms = [
    { form: $('.subscribe-form'), key: 'subscribe' },
    { form: $('.contact-form'),   key: 'contact' }
  ];

  forms.forEach(({ form, key }) => {
    if (!form) return;

    form.addEventListener('submit', async event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const status = $('.form-status', form);
      const button = form.querySelector('button[type="submit"]');
      const original = button ? button.textContent : '';

      if (button) button.disabled = true;
      if (status) status.textContent = MESSAGES[currentLang].sending;

      try {
        const data = Object.fromEntries(new FormData(form).entries());

        // Permite responder directamente a quien escribe
        if (data.correo) data.replyto = data.correo;
        else if (data.email) data.replyto = data.email;

        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) throw new Error('HTTP ' + response.status);

        if (status) status.textContent = MESSAGES[currentLang][key];
        form.reset();
      } catch (error) {
        if (status) status.textContent = MESSAGES[currentLang].error;
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = original;
        }
      }
    });
  });

});
