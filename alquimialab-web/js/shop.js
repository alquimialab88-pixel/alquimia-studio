/* ==========================================================================
   Catálogo compartido por /productos y /vitrina.
   Un solo origen de datos: precios, enlaces, textos ES/EN y vista rápida.
   Configuración (antes de cargar este archivo):
     window.SHOP = { mode: 'public' | 'private' };
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.SHOP || {};
  var MODE = CFG.mode === 'private' ? 'private' : 'public';
  var PROMO_ALLOWED = MODE === 'private';

  /* Precio de lista (Gumroad) + precio de la promo Black Friday. */
  var PRODUCTS = [
    {
      id: 'stickly',
      name: 'Stickly — Tu día en orden, en un solo lugar',
      cat: 'digital',
      short: 'Notas, tareas, calendario, contraseñas y enfoque. Privada, offline y sin cuentas.',
      desc: 'Stickly reúne tus notas, tareas, calendario, cuadernos, notas de voz, contraseñas y temporizador de enfoque en una sola app. Sin cuentas, sin servidores y sin suscripciones: tus datos se quedan en tu dispositivo.',
      price: 11.99,
      free: false,
      soon: false,
      img: 'assets/stickly/cover.webp',
      fit: 'cover',
      badge: 'Nuevo',
      note: 'Android + Windows + iPhone/iPad y web · Pago único · Acceso inmediato',
      link: 'https://alquimialab.gumroad.com/l/Stickly_ENG?wanted=true',
      shots: [
        'assets/stickly/mockup.webp',
        'assets/stickly/shot-1.webp',
        'assets/stickly/shot-2.webp',
        'assets/stickly/shot-3.webp',
        'assets/stickly/shot-4.webp',
        'assets/stickly/shot-5.webp'
      ],
      features: [
        'Notas con tablero libre estilo FigJam',
        'Tareas y calendario: día, semana, mes y año',
        'Cuadernos y notas de voz',
        'Contraseñas y notas privadas con PIN y cifrado AES-256',
        'Temporizador Pomodoro configurable',
        'Funciona sin conexión, en 9 idiomas'
      ]
    },
    {
      id: 'diario',
      name: 'El diario imperfecto de una creadora',
      cat: 'digital',
      short: 'La historia real de mi salto a la vida freelance, con 15 prompts y ejercicios.',
      desc: 'La historia real de mi salto a la vida freelance: 15 prompts para copiar y pegar, ejercicios con espacio para escribir y una lista de lanzamiento. Un cuaderno para empezar sin esperar a estar lista.',
      price: null,
      priceLabel: 'COP 19.687+',
      note: 'Precio libre · Paga desde COP 19.687 · PDF + EPUB',
      free: false,
      soon: false,
      img: 'assets/ebook-portada.webp',
      fit: 'contain',
      badge: '',
      link: 'https://alquimialab.gumroad.com/l/Elplanimperfectodeunacredora'
    },
    {
      id: 'planora',
      name: 'Planora — Organizador | Planificador de Redes Sociales',
      cat: 'digital',
      short: 'App de escritorio para organizar y planificar el contenido de tus redes.',
      desc: 'Planora es una app de escritorio para Windows que te ayuda a organizar tu contenido, darle dirección a tus ideas y convertir inspiración en acción. Menos caos, más espacio para crear.',
      price: 7.99,
      salePrice: 3.99,
      free: false,
      soon: false,
      img: 'assets/featured-maestro.webp',
      fit: 'contain',
      badge: 'Nuevo',
      link: 'https://alquimialab.gumroad.com/l/Planora-pro?wanted=true',
      bfLink: 'https://alquimialab.gumroad.com/l/Planora/BLACKFRIDAY88',
      bfLinkEn: 'https://alquimialab.gumroad.com/l/Planora-pro/BLACKFRIDAY88'
    },
    {
      id: 'studio',
      name: 'Alquimia Studio',
      cat: 'digital',
      short: 'Organizador de PDFs + 5 planners digitales, con modo claro y oscuro.',
      desc: 'Organiza y lee tus PDFs en el navegador, junto con cinco planners digitales: Calma y Orden, Anual, TDAH, Ciclo Menstrual y Semanal. Incluye modo claro y oscuro, favoritos, y herramientas de respaldo y restauración. Compra única, sin suscripción mensual.',
      note: 'Tus planners y PDFs se guardan en el navegador de cada dispositivo · Guarda una copia de respaldo',
      price: 9.99,
      salePrice: 4.99,
      free: false,
      soon: false,
      img: 'assets/featured-alquimia.webp',
      fit: 'contain',
      badge: '',
      link: 'https://alquimialab.gumroad.com/l/AlquimiaStudio?wanted=true',
      bfLink: 'https://alquimialab.gumroad.com/l/AlquimiaStudio_Planner/BLACKFRIDAY88',
      bfLinkEn: 'https://alquimialab.gumroad.com/l/AlquimiaStudio/BLACKFRIDAY88'
    },
    {
      id: 'planner',
      name: 'Planner 2027 — Calma y Orden',
      cat: 'print',
      short: 'Un planner minimalista para ordenar tu año con calma e intención.',
      desc: 'Un planner minimalista para organizar tu año con calma e intención. Edición impresa o digital, con espacio para tus metas, proyectos y rituales del día a día.',
      price: 10.99,
      salePrice: 5.49,
      free: false,
      soon: false,
      img: 'journal-cover.webp',
      fit: 'contain',
      badge: '',
      link: 'https://alquimialab.gumroad.com/l/bvzpd',
      bfLink: 'https://alquimialab.gumroad.com/l/bvzpd/BLACKFRIDAY88',
      links: [
        { label: 'Digital', link: 'https://alquimialab.gumroad.com/l/bvzpd', primary: true },
        { label: 'Amazon', link: 'https://www.amazon.com/dp/B0HJ8J6MHG', primary: false }
      ]
    },
    {
      id: 'coloring',
      name: 'Libros para colorear — Lofi Coloring',
      cat: 'print',
      short: 'El mismo libro en español e inglés. Edición impresa y digital.',
      desc: 'El mismo libro en español e inglés, con ilustraciones lofi para colorear y desconectar. Disponible en edición impresa y digital.',
      price: 5,
      salePrice: 2.5,
      free: false,
      soon: false,
      img: 'print-coloring.webp',
      fit: 'cover',
      badge: '',
      link: 'https://alquimialab.gumroad.com/l/LofiColoringBookAlquimia',
      bfLink: 'https://alquimialab.gumroad.com/l/LofiColoringBookAlquimia/BLACKFRIDAY88',
      links: [
        { label: 'Digital', link: 'https://alquimialab.gumroad.com/l/LofiColoringBookAlquimia', primary: true },
        { label: 'Amazon', link: 'https://www.amazon.com/dp/B0HBML5LCP', primary: false }
      ]
    },
    {
      id: 'crm',
      name: 'Freelancer CRM — Planner',
      cat: 'notion',
      short: 'Sistema operativo para ordenar tu flujo de trabajo de principio a fin.',
      desc: 'Un sistema operativo para estructurar tu flujo de trabajo de principio a fin: clientes, proyectos, propuestas y entregas en un solo lugar.',
      price: 9.99,
      free: false,
      soon: false,
      img: 'cover-freelancer-crm.webp',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/freelancercrmplanner'
    },
    {
      id: 'youtube',
      name: 'YouTube Creator OS — Planner & Script',
      cat: 'notion',
      short: 'Guiones, ideas y estrategia para tu canal, de shorts a videos largos.',
      desc: 'Deja de perder ideas de video con un espacio de trabajo completo de Notion creado para creadores y productores. Claridad estratégica para tu canal, desde guiones largos hasta shorts virales.',
      price: 15,
      free: false,
      soon: false,
      img: 'cover-youtube.webp',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/youtube-creator-os-automated-social-media-planner-script'
    },
    {
      id: 'student',
      name: 'Student OS & Study Planner',
      cat: 'notion',
      short: 'Tareas, exámenes y apuntes en un solo panel minimalista.',
      desc: 'Di adiós a notas dispersas y fechas límite olvidadas con un único panel minimalista. Lleva toda tu vida estudiantil, desde tareas diarias hasta exámenes finales.',
      price: 5.99,
      free: false,
      soon: false,
      img: 'assets/student-os-cover.webp',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/student-os-study-planner'
    },
    {
      id: 'social',
      name: 'Planner de Redes Sociales',
      cat: 'notion',
      short: 'Planea publicaciones, campañas e ideas en un solo espacio de Notion.',
      desc: 'Planea tus publicaciones, campañas e ideas de contenido en un solo espacio de Notion — una forma más tranquila para creadores y pequeños negocios de mostrarse en línea.',
      price: 4,
      free: false,
      soon: false,
      img: 'cover-social-media.webp',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/social-media-planner-256'
    },
    {
      id: 'financepro',
      name: 'Finance Planner Pro',
      cat: 'notion',
      short: 'Seguimiento financiero avanzado con reportes y proyecciones.',
      desc: 'Seguimiento financiero avanzado con reportes detallados y proyecciones para entender a dónde va tu dinero y planear con calma.',
      price: 9.99,
      free: false,
      soon: false,
      img: 'cover-finance-pro.webp',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/finance-planner-pro'
    },
    {
      id: 'quiet',
      name: 'Quiet Mind Planner',
      cat: 'notion',
      short: 'Un santuario minimalista para bajar el ruido mental y proteger tu energía.',
      desc: 'Libera tu mente del ruido mental con un santuario minimalista diseñado para proteger tu energía y traer calma. Transforma tus rutinas diarias en un flujo suave de reflexión intencional.',
      price: null,
      free: true,
      soon: false,
      img: 'cover-quiet-mind.webp',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/quiet-mind-planner'
    },
    {
      id: 'habit',
      name: 'Habit Planner',
      cat: 'notion',
      short: 'Hábitos sin culpa, con una pizarra limpia enfocada en tu crecimiento.',
      desc: 'Transforma tus hábitos sin la culpa visual de días perdidos. Un diseño de pizarra limpia para mantener tu mente clara y enfocada en tu crecimiento.',
      price: null,
      free: true,
      soon: false,
      img: 'cover-habit.webp',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/habit-planner'
    },
    {
      id: 'financefree',
      name: 'Finance Planner Free',
      cat: 'notion',
      short: 'Organiza tus finanzas personales con un sistema visual e intuitivo.',
      desc: 'Organiza tus finanzas personales con un sistema visual e intuitivo. Una base simple para empezar a ordenar tus números hoy.',
      price: null,
      free: true,
      soon: false,
      img: 'cover-finance-free.webp',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/finance-planner-785'
    },
    {
      id: 'pet',
      name: 'Pet Planner',
      cat: 'notion',
      short: 'Vacunas, veterinario, medicamentos y comida en un solo panel.',
      desc: 'Vacunas, visitas al veterinario, medicamentos y comida en un solo panel. Para Bonnie, Luna y cada miembro peludo de la familia.',
      price: 15,
      free: false,
      soon: false,
      img: 'cover-pet-planner.jpg',
      fit: 'cover',
      badge: '',
      link: 'https://www.notion.com/templates/pet-planner-your-pet-s-life-in-order'
    }
  ];

  var I18N = {
    es: {
      private: '🔒 Vitrina privada',
      copy: 'Copiar enlace',
      eyebrow: 'Catálogo completo · 2026',
      heroTitle: 'Todos mis productos,<br><em>en vista rápida.</em>',
      heroP: 'Explora, compara y compra en segundos. Toca cualquier producto para ver todos los detalles sin salir de la página.',
      pubEyebrow: 'Catálogo · 2026',
      pubHeroTitle: 'La tienda completa,<br><em>en un solo lugar.</em>',
      pubHeroP: 'Plantillas, planners, libros y herramientas digitales. Toca cualquier producto para ver los detalles y comprar sin salir de la página.',
      trust: '🔒 Compra segura por PayPal, Bancolombia, Nequi y Nu',
      products: 'productos',
      freeLabel: 'gratis',
      from: 'desde',
      bfTag: 'Black Friday',
      bfTitle: 'Black Friday: <b>50%</b> en estos productos digitales',
      bfSub: 'Solo del 12 al 28 de noviembre · Pago único · Sin suscripción',
      bfNote: 'El 50% se aplica automáticamente al comprar desde aquí. La edición impresa en Amazon mantiene su precio.',
      bfPreview: 'Vista previa · La promo no está activa ahora, el código no aplica descuento.',
      search: 'Buscar producto…',
      filters: { all: 'Todos', digital: 'Digitales', print: 'Impresos', notion: 'Notion', free: 'Gratis' },
      resultOne: 'producto',
      resultMany: 'productos',
      resultFor: ' para ',
      clear: 'Limpiar filtros',
      emptyTitle: 'No encontré ese producto',
      emptyText: 'Prueba con otra palabra o mira todo el catálogo.',
      viewAll: 'Ver todos',
      footer: 'Vitrina privada de Alquimia Lab · No aparece en el menú, el sitemap ni en buscadores.',
      back: 'Volver al inicio →',
      close: 'Cerrar vista rápida',
      quick: 'Vista rápida',
      buy: 'Comprar',
      download: 'Descargar gratis',
      freePrice: 'Gratis',
      soonPrice: 'Próximamente',
      noteFree: 'Descarga gratuita en Notion · Sin costo',
      noteSoon: 'Te aviso en cuanto esté disponible.',
      noteBuy: 'Pago único · Acceso inmediato · Compra segura',
      copied: 'Enlace copiado ✔',
      copyFallback: 'Copia el enlace de la barra',
      cats: { digital: 'Digital', print: 'Impreso', notion: 'Plantilla Notion' },
      bubbleDigital: 'Desde $5.00',
      bubbleTemplates: '9 plantillas',
      bubblePrint: 'Desde $12.99'
    },
    en: {
      private: '🔒 Private showcase',
      copy: 'Copy link',
      eyebrow: 'Full catalog · 2026',
      heroTitle: 'All my products,<br><em>in quick view.</em>',
      heroP: 'Explore, compare, and buy in seconds. Tap any product to see every detail without leaving the page.',
      pubEyebrow: 'Catalog · 2026',
      pubHeroTitle: 'The whole shop,<br><em>all in one place.</em>',
      pubHeroP: 'Templates, planners, books and digital tools. Tap any product to see the details and buy without leaving the page.',
      trust: '🔒 Secure checkout via PayPal, Bancolombia, Nequi and Nu',
      products: 'products',
      freeLabel: 'free',
      from: 'from',
      bfTag: 'Black Friday',
      bfTitle: 'Black Friday: <b>50%</b> off these digital products',
      bfSub: 'November 12–28 only · One-time payment · No subscription',
      bfNote: 'The 50% discount is applied automatically when you buy from here. The print edition on Amazon keeps its own price.',
      bfPreview: 'Preview · The promo is not active right now, so the code will not apply a discount.',
      search: 'Search products…',
      filters: { all: 'All', digital: 'Digital', print: 'Print', notion: 'Notion', free: 'Free' },
      resultOne: 'product',
      resultMany: 'products',
      resultFor: ' for ',
      clear: 'Clear filters',
      emptyTitle: 'I couldn’t find that product',
      emptyText: 'Try another word or browse the full catalog.',
      viewAll: 'View all',
      footer: 'Private Alquimia Lab showcase · Not listed in the menu, sitemap, or search engines.',
      back: 'Back to home →',
      close: 'Close quick view',
      quick: 'Quick view',
      buy: 'Buy',
      download: 'Download free',
      freePrice: 'Free',
      soonPrice: 'Coming soon',
      noteFree: 'Free download on Notion · No cost',
      noteSoon: 'I’ll let you know as soon as it’s available.',
      noteBuy: 'One-time purchase · Instant access · Secure checkout',
      copied: 'Link copied ✔',
      copyFallback: 'Copy the link from the address bar',
      cats: { digital: 'Digital', print: 'Print', notion: 'Notion template' },
      bubbleDigital: 'From $5.00',
      bubbleTemplates: '9 templates',
      bubblePrint: 'From $12.99'
    }
  };

  var EN_PRODUCTS = {
    stickly: {
      name: 'Stickly — Your day, in one place',
      short: 'Notes, tasks, calendar, passwords and focus. Private, offline and no accounts.',
      desc: 'Stickly brings your notes, tasks, calendar, notebooks, voice notes, passwords and focus timer together in one app. No accounts, no servers and no subscriptions: your data stays on your device.',
      note: 'Android + Windows + iPhone/iPad and web · One-time purchase · Instant access',
      features: [
        'Notes with a free-form FigJam-style board',
        'Tasks and calendar: day, week, month and year',
        'Notebooks and voice notes',
        'Passwords and private notes with PIN and AES-256 encryption',
        'Configurable Pomodoro timer',
        'Works offline, in 9 languages'
      ]
    },
    diario: {
      name: 'The Imperfect Diary of a Creator',
      short: 'The real story of my leap into freelance life, with 15 prompts and exercises.',
      desc: 'The real story of my leap into freelance life: 15 prompts to copy and paste, exercises with space to write, and a launch checklist. A notebook to start without waiting to feel ready.',
      note: 'Pay what you want · From COP 19.687 · PDF + EPUB'
    },
    planora: {
      name: 'Planora — Social Media Organizer | Planner',
      short: 'Desktop app to organize and plan your social media content.',
      desc: 'Planora is a Windows desktop app that helps you organize your content, give your ideas direction, and turn inspiration into action. Less chaos, more room to create.'
    },
    studio: {
      name: 'Alquimia Studio',
      short: 'PDF organizer + 5 digital planners, with light and dark mode.',
      desc: 'Organize and read your PDFs in your browser, alongside five digital planners: Calm & Order, Annual, ADHD, Menstrual Cycle, and Weekly. Includes light and dark mode, favorites, and backup and restore tools. One-time purchase, no monthly subscription.',
      note: 'Your planners and PDFs are saved in each device’s browser · Keep a backup copy'
    },
    planner: {
      name: 'Planner 2027 — Calm & Order',
      short: 'A minimalist planner to organize your year with calm and intention.',
      desc: 'A minimalist planner to organize your year with calm and intention. Print or digital edition, with space for your goals, projects, and daily rituals.'
    },
    coloring: {
      name: 'Coloring Books — Lofi Coloring',
      short: 'The same book in Spanish and English. Print and digital edition.',
      desc: 'The same book in Spanish and English, with lofi illustrations to color and unwind. Available in print and digital editions.'
    },
    crm: {
      name: 'Freelancer CRM — Planner',
      short: 'An operating system to structure your workflow from start to finish.',
      desc: 'An operating system to structure your workflow from start to finish: clients, projects, proposals, and deliveries in one place.'
    },
    youtube: {
      name: 'YouTube Creator OS — Planner & Script',
      short: 'Scripts, ideas, and strategy for your channel, from shorts to long videos.',
      desc: 'Stop losing video ideas with a comprehensive Notion workspace built for creators and producers. Strategic clarity for your channel, from long-form scripts to viral shorts.'
    },
    student: {
      name: 'Student OS & Study Planner',
      short: 'Tasks, exams, and notes in one minimalist dashboard.',
      desc: 'Say goodbye to scattered notes and missed deadlines with a single minimalist dashboard. Run your entire student life smoothly, from daily tasks to final exams.'
    },
    social: {
      name: 'Social Media Planner',
      short: 'Plan posts, campaigns, and ideas in one Notion workspace.',
      desc: 'Plan your posts, campaigns, and content ideas in one Notion workspace — a calmer way for creators and small businesses to show up online.'
    },
    financepro: {
      name: 'Finance Planner Pro',
      short: 'Advanced financial tracking with reports and projections.',
      desc: 'Advanced financial tracking with detailed reports and projections to understand where your money goes and plan with calm.'
    },
    quiet: {
      name: 'Quiet Mind Planner',
      short: 'A minimalist sanctuary to quiet mental noise and protect your energy.',
      desc: 'Free your mind from mental noise with a minimalist sanctuary designed to protect your energy and bring calm. Transform your daily routines into a gentle flow of intentional reflection.'
    },
    habit: {
      name: 'Habit Planner',
      short: 'Habits without guilt, with a clean slate focused on your growth.',
      desc: 'Transform your habits without the visual guilt of missed days. A clean-slate design to keep your mind clear and focused on your growth.'
    },
    financefree: {
      name: 'Finance Planner Free',
      short: 'Organize your personal finances with a visual, intuitive system.',
      desc: 'Organize your personal finances with a visual and intuitive system. A simple base to start ordering your numbers today.'
    },
    pet: {
      name: 'Pet Planner',
      short: 'Vaccines, vet visits, meds, and food in one dashboard.',
      desc: 'Vaccines, vet visits, meds, and food in one dashboard. For Bonnie, Luna and every furry member of the family.'
    }
  };

  /* ===== Idioma ===== */
  var lang = 'es';
  if (MODE === 'private') {
    try {
      var savedLang = localStorage.getItem('alquimia-lang');
      if (savedLang === 'en' || savedLang === 'es') lang = savedLang;
    } catch (e) { /* ignore */ }
  } else {
    lang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'es';
  }
  var T = I18N[lang];

  /* ===== Promo Black Friday (solo vitrina) ===== */
  var PROMO_START = new Date(2026, 10, 12, 0, 0, 0);
  var PROMO_END = new Date(2026, 10, 28, 23, 0, 0);
  var promoParam = null;
  try { promoParam = new URLSearchParams(location.search).get('promo'); } catch (e) { /* ignore */ }
  var now = new Date();
  var IN_PROMO_WINDOW = now >= PROMO_START && now <= PROMO_END;
  var PROMO_ON = PROMO_ALLOWED && (promoParam === '1' ? true : promoParam === '0' ? false : IN_PROMO_WINDOW);
  var PROMO_PREVIEW = PROMO_ALLOWED && promoParam === '1' && !IN_PROMO_WINDOW;

  var FILTERS = ['all', 'digital', 'print', 'notion', 'free'];
  var activeCat = 'all';

  function shownPrice(p) {
    return PROMO_ON && typeof p.salePrice === 'number' ? p.salePrice : p.price;
  }
  function shownOld(p) {
    return PROMO_ON && typeof p.salePrice === 'number' ? p.price : null;
  }
  function promoLink(p) {
    if (!PROMO_ON || typeof p.salePrice !== 'number') return null;
    return (lang === 'en' && p.bfLinkEn) ? p.bfLinkEn : (p.bfLink || null);
  }

  /* ===== Helpers ===== */
  function $(id) { return document.getElementById(id); }
  function txt(id, value) { var el = $(id); if (el) el.textContent = value; }
  function html(id, value) { var el = $(id); if (el) el.innerHTML = value; }
  function norm(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(n) {
    return '$' + (Number.isInteger(n) ? n : Number(n).toFixed(2));
  }
  function localized(p, field) {
    var en = EN_PRODUCTS[p.id];
    if (lang === 'en' && en && en[field]) return en[field];
    return p[field] || '';
  }
  function localizedList(p, field) {
    var en = EN_PRODUCTS[p.id];
    if (lang === 'en' && en && en[field] && en[field].length) return en[field];
    return p[field] || [];
  }
  function catLabel(cat) { return T.cats[cat] || cat; }
  function badgeLabel(p) { return (lang === 'en' && p.badge === 'Nuevo') ? 'New' : p.badge; }

  function priceHTML(p) {
    if (p.priceLabel) return '<span class="v-price v-price-label">' + esc(p.priceLabel) + '</span>';
    if (p.soon) return '<span class="v-price v-soon">' + esc(T.soonPrice) + '</span>';
    if (p.free) return '<span class="v-price v-free">' + esc(T.freePrice) + '</span>';
    var price = shownPrice(p), old = shownOld(p);
    var out = '<span class="v-price">' + fmt(price) + '</span>';
    if (old && old > price) {
      out += '<s class="v-old">' + fmt(old) + '</s>';
      out += '<span class="v-off">-' + Math.round((1 - price / old) * 100) + '%</span>';
    }
    return out;
  }

  function linksFor(p) {
    var promo = promoLink(p);
    if (p.links && p.links.length) {
      if (!promo) return p.links;
      return p.links.map(function (l) {
        return l.primary ? { label: l.label, link: promo, primary: true } : l;
      });
    }
    return [{
      label: p.free ? T.download : T.buy,
      link: promo || p.link,
      primary: !(p.free || p.soon)
    }];
  }
  function extLink(link) { return /^https?:/i.test(link) ? ' target="_blank" rel="noopener"' : ''; }

  function buyHTML(p, modal, feat) {
    var links = linksFor(p);
    if (feat) {
      links = [{
        label: p.free ? T.download : T.buy,
        link: promoLink(p) || links[0].link,
        primary: true
      }];
    }
    var out = '<div class="v-buy-row' + (links.length > 1 ? ' v-buy-row-split' : '') + (modal ? ' v-buy-row-modal' : '') + '">';
    links.forEach(function (l) {
      var cls = l.primary ? 'btn-primary' : 'btn-secondary';
      out += '<a class="btn-sm ' + cls + ' v-buy" href="' + esc(l.link) + '"' + extLink(l.link) + '>' +
        esc(l.label) + (l.primary ? ' →' : '') + '</a>';
    });
    return out + '</div>';
  }

  function mediaHTML(p) {
    if (!p.img) return '<span class="v-emoji" aria-hidden="true">' + (p.emoji || '✨') + '</span>';
    return '<img src="' + esc(p.img) + '" alt="" loading="lazy" decoding="async">';
  }

  function modalMediaHTML(p, name) {
    if (!p.shots || !p.shots.length) return mediaHTML(p);
    var thumbs = p.shots.map(function (src, i) {
      return '<button type="button" class="qv-thumb' + (i === 0 ? ' active' : '') + '" data-shot="' + i +
        '" role="tab" aria-selected="' + (i === 0) + '" aria-label="' + esc(name + ' · ' + (i + 1)) + '">' +
        '<img src="' + esc(src) + '" alt="" loading="lazy" decoding="async"></button>';
    }).join('');
    return '<div class="qv-gallery">' +
      '<button type="button" class="qv-shot" data-shot-next aria-label="' + esc(lang === 'en' ? 'Next screenshot' : 'Siguiente captura') + '">' +
        '<img id="qvImg" src="' + esc(p.shots[0]) + '" alt="' + esc(name) + '">' +
        '<span class="qv-counter"><b id="qvShotNum">1</b>/' + p.shots.length + '</span>' +
      '</button>' +
      '<div class="qv-thumbs" role="tablist" aria-label="' + esc(lang === 'en' ? 'Screenshots' : 'Capturas') + '">' + thumbs + '</div>' +
    '</div>';
  }

  function cardHTML(p, feat) {
    var name = localized(p, 'name');
    var short = localized(p, 'short');
    var cat = feat ? T.cats.digital : catLabel(p.cat);
    return '' +
      '<article class="v-card">' +
        '<button type="button" class="v-media' + (p.fit === 'contain' ? ' contain' : '') + '" data-qv="' + p.id + '">' +
          mediaHTML(p) +
          '<span class="v-sr">' + esc(name) + '</span>' +
          '<span class="v-cat">' + esc(cat) + '</span>' +
          (p.badge ? '<span class="v-badge">' + esc(badgeLabel(p)) + '</span>' : '') +
          '<span class="v-quick">' + esc(T.quick) + '</span>' +
        '</button>' +
        '<div class="v-body">' +
          '<h2><button type="button" class="v-name" data-qv="' + p.id + '">' + esc(name) + '</button></h2>' +
          '<p class="v-short">' + esc(short) + '</p>' +
          '<div class="v-price-row">' + priceHTML(p) + '</div>' +
          buyHTML(p, false, feat) +
        '</div>' +
      '</article>';
  }

  function matches(p) {
    var q = norm(searchEl.value.trim());
    var catOk = activeCat === 'all' || (activeCat === 'free' ? p.free : p.cat === activeCat);
    if (!catOk) return false;
    if (!q) return true;
    var en = EN_PRODUCTS[p.id];
    var hay = p.name + ' ' + p.short + ' ' + p.desc + ' ' + catLabel(p.cat);
    if (en) hay += ' ' + en.name + ' ' + en.short + ' ' + en.desc;
    return norm(hay).indexOf(q) !== -1;
  }

  function render() {
    var list = PRODUCTS.filter(matches);
    grid.innerHTML = list.map(function (p) { return cardHTML(p, false); }).join('');
    var q = searchEl.value.trim();
    resultEl.textContent = list.length + ' ' + (list.length === 1 ? T.resultOne : T.resultMany) +
      (q ? T.resultFor + '“' + q + '”' : '');
    emptyEl.hidden = list.length !== 0;
    clearEl.hidden = !(activeCat !== 'all' || q);
  }

  function renderBF() {
    if (!bfGrid) return;
    if (!PROMO_ON) {
      if (bfSection) bfSection.hidden = true;
      return;
    }
    if (bfSection) bfSection.hidden = false;
    bfGrid.innerHTML = PRODUCTS.filter(function (p) {
      return typeof p.salePrice === 'number';
    }).map(function (p) { return cardHTML(p, true); }).join('');
  }

  function setCat(id) {
    activeCat = FILTERS.indexOf(id) !== -1 ? id : 'all';
    Array.prototype.forEach.call(chipsEl.querySelectorAll('.v-chip'), function (chip) {
      var on = chip.getAttribute('data-cat') === activeCat;
      chip.classList.toggle('active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    render();
  }

  function chipCount(id) {
    return id === 'all' ? PRODUCTS.length :
      id === 'free' ? PRODUCTS.filter(function (p) { return p.free; }).length :
      PRODUCTS.filter(function (p) { return p.cat === id; }).length;
  }
  function buildChips() {
    chipsEl.innerHTML = FILTERS.map(function (id) {
      return '<button type="button" class="v-chip' + (id === activeCat ? ' active' : '') +
        '" data-cat="' + id + '" aria-pressed="' + (id === activeCat) + '">' +
        esc(T.filters[id]) + '<b>' + chipCount(id) + '</b></button>';
    }).join('');
  }

  function updateLangButton() {
    var btn = $('vLang');
    if (!btn) return;
    btn.setAttribute('data-lang', lang);
    btn.removeAttribute('aria-label');
    var action = lang === 'es' ? 'Switch to English' : 'Cambiar a Español';
    btn.innerHTML = '<span class="cur">ES</span><span class="sep">|</span><span class="cur">EN</span><span class="v-sr">' + action + '</span>';
    var cur = btn.querySelectorAll('.cur');
    cur[0].style.opacity = '1';
    cur[1].style.opacity = '1';
    cur[0].style.fontWeight = lang === 'es' ? '800' : '500';
    cur[1].style.fontWeight = lang === 'en' ? '800' : '500';
  }

  function bubbles() {
    var b1 = document.querySelector('[data-bubble="digital"]');
    var b2 = document.querySelector('[data-bubble="templates"]');
    var b3 = document.querySelector('[data-bubble="print"]');
    if (b1) b1.textContent = T.bubbleDigital;
    if (b2) b2.textContent = T.bubbleTemplates;
    if (b3) b3.textContent = T.bubblePrint;
  }

  function applyStatic() {
    document.documentElement.lang = lang;
    var hero = MODE === 'private'
      ? { eyebrow: T.eyebrow, title: T.heroTitle, text: T.heroP }
      : { eyebrow: T.pubEyebrow, title: T.pubHeroTitle, text: T.pubHeroP };

    txt('vPrivate', T.private);
    txt('copyLabel', T.copy);
    txt('vEyebrow', hero.eyebrow);
    html('vHeroTitle', hero.title);
    txt('vHeroP', hero.text);
    txt('vTrust', T.trust);

    txt('statProductsLabel', T.products);
    txt('statFreeLabel', T.freeLabel);
    txt('statFromLabel', T.from);

    if (searchEl) {
      searchEl.placeholder = T.search;
      searchEl.setAttribute('aria-label', T.search);
    }
    txt('clearFilters', T.clear);
    txt('vEmptyTitle', T.emptyTitle);
    txt('vEmptyText', T.emptyText);
    txt('resetEmpty', T.viewAll);
    txt('vFootText', T.footer);
    txt('vFootLink', T.back);
    var closeBtn = $('qvClose');
    if (closeBtn) closeBtn.setAttribute('aria-label', T.close);

    txt('bfTag', T.bfTag);
    html('bfTitle', T.bfTitle);
    txt('bfSub', T.bfSub);
    txt('bfNote', T.bfNote);
    var prev = $('bfPreview');
    if (prev) prev.hidden = !PROMO_PREVIEW;

    bubbles();
    renderBF();
    updateLangButton();
  }

  function setLang(next) {
    lang = next === 'en' ? 'en' : 'es';
    T = I18N[lang];
    if (MODE === 'private') {
      try { localStorage.setItem('alquimia-lang', lang); } catch (e) { /* ignore */ }
    }
    applyStatic();
    buildChips();
    setCat(activeCat);
    if (dlg && dlg.open && currentId) openQuick(currentId, currentFeat);
  }

  /* ===== Referencias del DOM ===== */
  var grid = $('grid') || $('shop');
  var chipsEl = $('vChips');
  var searchEl = $('vSearch');
  var resultEl = $('resultCount');
  var emptyEl = $('empty');
  var clearEl = $('clearFilters');
  var bfGrid = $('bfGrid');
  var bfSection = $('blackFriday');
  var dlg = $('quickView');
  var currentId = null, currentFeat = false, lastTrigger = null;
  var galleryShots = [], galleryIndex = 0;

  function setShot(index) {
    if (!galleryShots.length) return;
    galleryIndex = ((index % galleryShots.length) + galleryShots.length) % galleryShots.length;
    var img = $('qvImg');
    if (img) img.src = galleryShots[galleryIndex];
    var num = $('qvShotNum');
    if (num) num.textContent = String(galleryIndex + 1);
    var media = $('qvMedia');
    if (!media) return;
    Array.prototype.forEach.call(media.querySelectorAll('.qv-thumb'), function (btn, i) {
      var on = i === galleryIndex;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  if (!grid || !chipsEl || !searchEl) return;

  /* ===== Eventos ===== */
  chipsEl.addEventListener('click', function (e) {
    var chip = e.target.closest('.v-chip');
    if (chip) setCat(chip.getAttribute('data-cat'));
  });
  searchEl.addEventListener('input', render);
  if (clearEl) clearEl.addEventListener('click', function () {
    searchEl.value = '';
    setCat('all');
  });
  var resetEmpty = $('resetEmpty');
  if (resetEmpty) resetEmpty.addEventListener('click', function () {
    searchEl.value = '';
    setCat('all');
  });

  /* Los botones del banner abren la parrilla ya filtrada. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-shop-filter]'), function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-shop-filter');
      setCat(cat);
      if (searchEl.value) { searchEl.value = ''; render(); }
    });
  });

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-qv]');
    if (!trigger) return;
    lastTrigger = trigger;
    openQuick(trigger.getAttribute('data-qv'), !!trigger.closest('.v-bf'));
  });

  function openQuick(id, feat) {
    var p = null;
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) { p = PRODUCTS[i]; break; }
    }
    if (!p || !dlg) return;

    currentId = id;
    currentFeat = !!feat;
    var name = localized(p, 'name');
    var desc = localized(p, 'desc');
    var media = $('qvMedia');
    if (media) {
      media.className = 'v-dialog-media' + (p.shots && p.shots.length ? ' has-gallery' : (p.fit === 'contain' ? ' contain' : ''));
      media.innerHTML = modalMediaHTML(p, name);
      galleryShots = p.shots && p.shots.length ? p.shots.slice() : [];
      galleryIndex = 0;
    }
    txt('qvCat', catLabel(p.cat));
    txt('qvName', name);
    var feats = localizedList(p, 'features');
    html('qvDesc', esc(desc) + (feats.length
      ? '<ul class="v-features">' + feats.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>'
      : ''));
    html('qvPrice', priceHTML(p));
    html('qvBuyWrap', buyHTML(p, true, currentFeat));

    var en = EN_PRODUCTS[p.id];
    var note;
    if (lang === 'en' && en && en.note) note = en.note;
    else if (p.note) note = p.note;
    else if (p.free) note = T.noteFree;
    else if (p.soon) note = T.noteSoon;
    else note = T.noteBuy;
    txt('qvNote', note);

    if (dlg.showModal) { if (!dlg.open) dlg.showModal(); }
    else { window.location.href = p.link; }
  }

  var qvClose = $('qvClose');
  if (qvClose) qvClose.addEventListener('click', function () { if (dlg) dlg.close(); });
  var qvMediaEl = $('qvMedia');
  if (qvMediaEl) {
    qvMediaEl.addEventListener('click', function (e) {
      if (!galleryShots.length) return;
      var thumb = e.target.closest('[data-shot]');
      if (thumb) {
        setShot(Number(thumb.getAttribute('data-shot')) || 0);
        return;
      }
      if (e.target.closest('[data-shot-next]')) setShot(galleryIndex + 1);
    });
  }
  if (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    });
  }

  /* ===== Copiar enlace (solo vitrina) ===== */
  var toastTimer = null;
  function toast(msg) {
    var t = $('vToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  var copyBtn = $('copyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      var done = function () { toast(T.copied); };
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); }
        catch (err) { toast(T.copyFallback); }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(fallback);
      } else {
        fallback();
      }
    });
  }

  /* ===== Botón de idioma ===== */
  var langBtn = $('vLang');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      setLang(lang === 'es' ? 'en' : 'es');
    });
  } else {
    /* En /productos el idioma lo maneja js/lang.js: nos avisa con un evento. */
    document.addEventListener('alquimia:lang', function (e) {
      var next = e && e.detail && e.detail.lang;
      if (next === 'es' || next === 'en') setLang(next);
    });
  }

  /* ===== Arranque ===== */
  /* Enlaces antiguos del inicio: #digitales, #impresos, #notion y #p-… */
  var HASH_CATS = {
    digitales: 'digital', digital: 'digital',
    impresos: 'print', print: 'print',
    notion: 'notion',
    gratis: 'free', free: 'free'
  };
  var HASH_PRODUCTS = {
    'p-stickly': 'stickly',
    'p-diario': 'diario',
    'p-planora': 'planora',
    'p-alquimia-studio': 'studio',
    'p-planner': 'planner',
    'p-coloring': 'coloring',
    'p-crm': 'crm',
    'p-yt': 'youtube',
    'p-student': 'student',
    'p-social': 'social',
    'p-financepro': 'financepro',
    'p-quiet': 'quiet',
    'p-habit': 'habit',
    'p-financefree': 'financefree',
    'p-pet': 'pet'
  };
  function handleHash() {
    var h = decodeURIComponent((location.hash || '').replace('#', '')).toLowerCase();
    if (HASH_CATS[h]) { setCat(HASH_CATS[h]); return; }
    if (HASH_PRODUCTS[h]) { setCat('all'); openQuick(HASH_PRODUCTS[h], false); }
  }

  var paid = PRODUCTS.filter(function (p) {
    return !p.free && !p.soon && typeof p.price === 'number';
  });
  txt('statTotal', PRODUCTS.length);
  txt('statFree', PRODUCTS.filter(function (p) { return p.free; }).length);
  txt('statFrom', fmt(Math.min.apply(null, paid.map(shownPrice))));

  applyStatic();
  buildChips();
  setCat(activeCat);
  handleHash();
  window.addEventListener('hashchange', handleHash);
})();
