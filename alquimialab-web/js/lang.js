(function () {
  var STORE_KEY = "alquimia-lang";

  var dict = {
    /* NAV */
    "Home": "Inicio",
    "Portfolio": "Portafolio",
    "Products": "Productos",
    "Contact": "Contacto",
    "Projects": "Proyectos",
    "About Me": "Sobre mí",
    "Work Experience": "Experiencia laboral",
    "Education": "Educación",

    /* INDEX */
    "Welcome to": "Bienvenido a",
    "I create digital tools and designs that bring clarity and calm to your daily routine. Notion templates, coloring books, productivity tools, and visual design solutions.": "Creo herramientas digitales y diseños que aportan claridad y calma a tu rutina diaria. Plantillas de Notion, libros para colorear, herramientas de productividad y soluciones de diseño visual.",
    "View Portfolio": "Ver portafolio",
    "View Products": "Ver productos",
    "What is Alquimia Lab": "¿Qué es Alquimia Lab?",
    "Alquimia Lab is where thoughtful design meets mindful living. I craft digital sanctuaries and creative tools designed to help you quiet mental noise, organize your workflow, and embrace a calmer daily rhythm.": "Alquimia Lab es donde el diseño reflexivo se encuentra con una vida consciente. Creo santuarios digitales y herramientas creativas diseñadas para ayudarte a silenciar el ruido mental, organizar tu flujo de trabajo y adoptar un ritmo diario más calmado.",
    "Notion Templates": "Plantillas de Notion",
    "Organization systems for freelancers, planning, and personal productivity.": "Sistemas de organización para freelancers, planificación y productividad personal.",
    "Explore": "Explorar",
    "Printed Products": "Productos impresos",
    "Coloring books with a lofi aesthetic and designs that invite you to unwind.": "Libros para colorear con estética lofi y diseños que te invitan a relajarte.",
    "Explore Design Portfolio": "Explora el portafolio de diseño",
    "Bold brand identities, intuitive UI/UX, and social media visuals crafted to captivate.": "Identidades de marca audaces, UI/UX intuitivos y visuales para redes sociales creados para cautivar.",
    "Featured": "Destacados",
    "Operating system to structure your workflow from start to finish.": "Sistema operativo para estructurar tu flujo de trabajo de principio a fin.",
    "Available in Free and Pro versions.": "Disponible en versiones Free y Pro.",
    "Clear mental noise and protect your energy with a minimalist sanctuary.": "Silencia el ruido mental y protege tu energía con un santuario minimalista.",
    "Comprehensive Notion workspace for creators and producers.": "Espacio de trabajo integral de Notion para creadores y productores.",
    "A minimalist ecosystem for creators and entrepreneurs.": "Un ecosistema minimalista para creadores y emprendedores.",
    "Coloring Books": "Libros para colorear",
    "Print edition on Amazon and digital on Gumroad.": "Edición impresa en Amazon y digital en Gumroad.",
    "Get it": "Conseguir",
    "Explore all products": "Explorar todos los productos",
    "© 2026 Alquimia Lab · Made with calm & coffee": "© 2026 Alquimia Lab · Hecho con calma y café",

    /* PORTAFOLIO */
    "Graphic Designer & Visual Content Curator": "Diseñadora Gráfica y Curadora de Contenido Visual",
    "Hi! I'm Isabel Boder, a 30-year-old passionate graphic designer. I thrive in both collaborative and independent environments, bringing a strong sense of responsibility and discipline to successfully tackle every project.": "¡Hola! Soy Isabel Boder, una apasionada diseñadora gráfica de 30 años. Me desenvuelvo bien tanto en entornos colaborativos como independientes, aportando un fuerte sentido de responsabilidad y disciplina para afrontar con éxito cada proyecto.",
    "In the fast-paced world of design, I believe in staying curious, continuously learning, and keeping up with the latest tools, trends, and creative strategies. I'm committed to growing every day to consistently deliver work that exceeds expectations.": "En el vertiginoso mundo del diseño, creo en mantener la curiosidad, aprender continuamente y estar al día con las últimas herramientas, tendencias y estrategias creativas. Estoy comprometida a crecer cada día para entregar siempre un trabajo que supere las expectativas.",
    "Skills": "Habilidades",
    "Time Management": "Gestión del Tiempo",
    "Planning": "Planificación",
    "Teamwork": "Trabajo en Equipo",
    "Communication": "Comunicación",
    "Tools": "Herramientas",
    "2023 — Now": "2023 — Actualidad",
    "Visual Content Curator": "Curadora de Contenido Visual",
    "Select and evaluate graphic resources (vectors & photos) for publishing on Freepik.com": "Seleccionar y evaluar recursos gráficos (vectores y fotos) para su publicación en Freepik.com",
    "Freelance Designer": "Diseñadora Freelance",
    "Various clients (Ongoing)": "Varios clientes (en curso)",
    "Branding, digital content, and visual design for web and social media": "Branding, contenido digital y diseño visual para web y redes sociales",
    "Digital Graphic Designer": "Diseñadora Gráfica Digital",
    "Created short animations in After Effects. Developed branding, visual identity, and social media layouts. Designed websites in Figma, including structure and sitemap. Created digital catalogs and print pieces: billboards, photo calls, flyers, stationery.": "Creé animaciones cortas en After Effects. Desarrollé branding, identidad visual y piezas para redes sociales. Diseñé sitios web en Figma, incluyendo estructura y mapa del sitio. Creé catálogos digitales y piezas impresas: vallas, photocalls, volantes y papelería.",
    "La Company — Advertising Agency": "La Company — Agencia de Publicidad",
    "Graphic Design Intern": "Practicante de Diseño Gráfico",
    "Created mailings, banners for Instagram & Facebook. Edited short videos and photo content. Designed and laid out the full real estate magazine EME.": "Creé mailings y banners para Instagram y Facebook. Edité videos cortos y contenido fotográfico. Diseñé y maqueté la revista inmobiliaria completa EME.",
    "Graphic Designer": "Diseñadora Gráfica",
    "Updated the brand using the newly designed logo. Designed learning books to help improve Spanish skills. Handled the design and layout of the website: www.blinkspanish.com": "Actualicé la marca usando el nuevo logo diseñado. Diseñé libros de aprendizaje para ayudar a mejorar el español. Me encargué del diseño y maquetación del sitio web: www.blinkspanish.com",
    "Associate Degree in Graphic Design Management": "Tecnología en Gestión del Diseño Gráfico",
    "Bachelor's Degree in Graphic Design": "Licenciatura en Diseño Gráfico",
    "UI/UX Design Certificate": "Certificado en Diseño UI/UX",
    "User Research": "Investigación de Usuarios",
    "Certifications": "Certificaciones",
    "Credential ID: 9jeajmszyggp": "ID de credencial: 9jeajmszyggp",
    "Credential ID: tdreqsssjkra": "ID de credencial: tdreqsssjkra",
    "Credential ID: 2n6z7wwujeow": "ID de credencial: 2n6z7wwujeow",
    "Services": "Servicios",
    "Creation of unique brand identities, including logos, visual systems, and brand guidelines.": "Creación de identidades de marca únicas, incluyendo logos, sistemas visuales y guías de marca.",
    "UI/UX Design": "Diseño UI/UX",
    "Design of intuitive and user-centered digital experiences, including user research, wireframing, interface design, and interactive prototyping.": "Diseño de experiencias digitales intuitivas y centradas en el usuario, incluyendo investigación de usuarios, wireframes, diseño de interfaz y prototipado interactivo.",
    "Social Media Design": "Diseño para Redes Sociales",
    "Creation of engaging social media visuals, campaign graphics, post templates, and story designs that help brands connect with their audience online.": "Creación de visuales atractivos para redes sociales, gráficas de campañas, plantillas de publicaciones y diseños de historias que ayudan a las marcas a conectar con su audiencia en línea.",
    "Visual Design": "Diseño Visual",
    "Development of creative visual assets including editorial design, packaging, illustrations, and motion graphics for digital and print media.": "Desarrollo de piezas visuales creativas, incluyendo diseño editorial, empaques, ilustraciones y motion graphics para medios digitales e impresos.",
    "Social Media": "Redes Sociales",
    "Illustration": "Ilustración",
    "Print & Packaging": "Impreso y Empaques",
    "Character": "Personaje",
    "View project": "Ver",
    "Brand Identity Exploration": "Exploración de Identidad de Marca",
    "User Experience Design": "Diseño de Experiencia de Usuario",
    "Social Media Campaign": "Campaña de Redes Sociales",
    "Creative Illustration": "Ilustración Creativa",
    "Packaging & Editorial": "Empaques y Editorial",
    "AI Characters": "Personajes IA",
    "Packaging": "Empaques",
    "Editorial": "Editorial",

    /* UX */
    "← Back to Portfolio": "← Volver al portafolio",
    "USER EXPERIENCE DESIGN": "DISEÑO DE EXPERIENCIA DE USUARIO",
    "Landing pages and a mobile app designed with a focus on usability, clarity, and delightful interactions.": "Landing pages y una app móvil diseñadas con foco en la usabilidad, la claridad e interacciones agradables.",
    "Tap on each project to preview it.": "Toca cada proyecto para previsualizarlo.",
    "This design was a practice piece — not created for a client.": "Este diseño fue una pieza de práctica, no fue creado para un cliente.",
    "Open in Figma": "Abrir en Figma",

    /* SOCIAL */
    "SOCIAL MEDIA CAMPAIGN": "CAMPAÑA DE REDES SOCIALES",
    "Social media visuals designed to boost engagement and give each brand a recognizable, cohesive voice online.": "Visuales para redes sociales diseñados para potenciar la interacción y darle a cada marca una voz reconocible y coherente en línea.",
    "Tap on each campaign to browse its posts.": "Toca cada campaña para revisar sus publicaciones.",
    "Liked by alquimia.lab8": "Le gusta a alquimia.lab8",

    /* AI CHARACTERS */
    "AI CHARACTERS": "PERSONAJES IA",
    "Original characters designed with artificial intelligence, each with its own personality.": "Personajes originales diseñados con inteligencia artificial, cada uno con su propia personalidad.",
    "Tap a character to open their profile.": "Toca un personaje para abrir su perfil.",
    "Eduardo is an enigmatic otherworldly creature who, despite his terrifying appearance, is a sweet and sensitive soul with a huge heart. Passionate about drama, darkness, and true crime, he has an insatiable curiosity for investigating criminal cases, perfectly balancing a dark aesthetic with a surprisingly warm and gentle personality.": "Eduardo es una criatura enigmática de otro mundo que, a pesar de su apariencia aterradora, es un alma dulce y sensible de gran corazón. Apasionado por el drama, la oscuridad y el true crime, siente una curiosidad insaciable por investigar casos criminales, equilibrando a la perfección una estética oscura con una personalidad sorprendentemente cálida y gentil.",
    "Antonio is an endearingly shy red panda with a clumsy charm and a deep passion for creativity and continuous learning. He adores everything cozy and peaceful that brings a sense of calm. While he isn't the most outgoing soul, he treats his small inner circle like true family.": "Antonio es un panda rojo adorablemente tímido, con un encanto torpe y una profunda pasión por la creatividad y el aprendizaje continuo. Adora todo lo acogedor y pacífico que aporta sensación de calma. Aunque no es el alma más sociable, trata a su pequeño círculo cercano como una verdadera familia.",

    /* BRANDING */
    "BRAND IDENTITY EXPLORATION": "EXPLORACIÓN DE IDENTIDAD DE MARCA",
    "A selection of logo designs developed to capture the essence of each brand through clean, adaptable, and impactful visuals.": "Una selección de diseños de logo desarrollados para capturar la esencia de cada marca a través de visuales limpias, adaptables e impactantes.",
    "Tap on each logo to view the complete brand board.": "Toca cada logo para ver el brand board completo.",
    "Color Palette": "Paleta de Colores",
    "Typography": "Tipografía",
    "Primary / Headline": "Primaria / Titular",
    "Secondary / Body": "Secundaria / Cuerpo",

    /* PRODUCTOS */
    "My Products": "Mis Productos",
    "Tools and creativity to organize your life, find calm, and work with intention.": "Herramientas y creatividad para organizar tu vida, encontrar calma y trabajar con intención.",
    "My Lofi Music": "Mi Música Lofi",
    "Subscribe on YouTube →": "Suscríbete en YouTube →",
    "Productivity, planning, and personal & professional organization systems. 7 templates available.": "Sistemas de productividad, planificación y organización personal y profesional. 7 plantillas disponibles.",
    "View all": "Ver todo",
    "Coloring books, productivity PDFs, and more. Available on Amazon and Gumroad.": "Libros para colorear, PDFs de productividad y más. Disponibles en Amazon y Gumroad.",
    "← Back": "← Volver",
    "Organize your personal finances with a visual and intuitive system.": "Organiza tus finanzas personales con un sistema visual e intuitivo.",
    "Advanced financial tracking with detailed reports and projections.": "Seguimiento financiero avanzado con informes detallados y proyecciones.",
    "Transform your habits without the visual guilt of missed days from the past. A clean-slate design to keep your mind clear and focused entirely on your growth.": "Transforma tus hábitos sin la culpa visual de los días perdidos del pasado. Un diseño de hoja en blanco para mantener tu mente clara y enfocada por completo en tu crecimiento.",
    "Say goodbye to scattered notes and missed deadlines with a single minimalist dashboard. Run your entire student life smoothly, from daily tasks to final exams.": "Di adiós a las notas dispersas y a los plazos perdidos con un único dashboard minimalista. Lleva toda tu vida estudiantil sin contratiempos, desde las tareas diarias hasta los exámenes finales.",
    "Free your mind from mental noise with a minimalist sanctuary designed to protect your energy and bring calm. Transform your daily routines into a gentle daily flow of intentional reflection.": "Libera tu mente del ruido mental con un santuario minimalista diseñado para proteger tu energía y traer calma. Transforma tus rutinas diarias en un flujo suave de reflexión intencional.",
    "Stop losing video ideas with a comprehensive Notion workspace built for creators and producers. Bring strategic clarity to your channel, from long-form scripts to viral shorts.": "Deja de perder ideas de video con un espacio de trabajo integral de Notion creado para creadores y productores. Lleva claridad estratégica a tu canal, desde guiones largos hasta shorts virales.",
    "Bring mental clarity and absolute control to your digital business with a minimalist ecosystem designed for creators and entrepreneurs. Manage everything seamlessly in one aesthetic place.": "Lleva claridad mental y control absoluto a tu negocio digital con un ecosistema minimalista diseñado para creadores y emprendedores. Gestiona todo sin esfuerzo en un solo lugar estético.",
    "Buy": "Comprar",
    "Download": "Descargar",
    "Your Notion isn't broken. It's just poorly designed. 43-page protocol.": "Tu Notion no está roto. Solo está mal diseñado. Protocolo de 43 páginas.",
    "Coloring Books — Lofi Coloring": "Libros para Colorear — Lofi Coloring",
    "Available in English and Spanish. Print and digital edition.": "Disponibles en inglés y español. Edición impresa y digital.",
    "We're working on it…": "Lo estamos trabajando…",
    "Soon": "Pronto",

    /* CONTACTO */
    "Shall we work together?": "¿Trabajamos juntos?",
    "Tell me about your project and let's create something amazing together.": "Cuéntame sobre tu proyecto y creemos algo increíble juntos.",
    "Send message →": "Enviar mensaje →"
  };

  var placeholders = {
    "Your name": "Tu nombre",
    "Your email": "Tu correo",
    "Subject": "Asunto",
    "Tell me about your project...": "Cuéntame sobre tu proyecto..."
  };

  var titles = {
    "Alquimia Lab · Well-being, order & design": "Alquimia Lab · Bienestar, orden y diseño",
    "Portfolio · Alquimia Lab": "Portafolio · Alquimia Lab",
    "User Experience Design · Alquimia Lab": "Diseño de Experiencia de Usuario · Alquimia Lab",
    "Social Media Campaign · Alquimia Lab": "Campaña de Redes Sociales · Alquimia Lab",
    "AI Characters · Alquimia Lab": "Personajes IA · Alquimia Lab",
    "Brand Identity Exploration · Alquimia Lab": "Exploración de Identidad de Marca · Alquimia Lab",
    "Products · Alquimia Lab": "Productos · Alquimia Lab",
    "Contact · Alquimia Lab": "Contacto · Alquimia Lab"
  };

  var descriptions = {
    "Alquimia Lab — Products for your well-being and order + Professional design. Notion templates, coloring books, and design services.": "Alquimia Lab — Productos para tu bienestar y orden + Diseño profesional. Plantillas de Notion, libros para colorear y servicios de diseño.",
    "Alquimia Lab Portfolio — Visual designer, branding, UI/UX, illustration, and packaging.": "Portafolio Alquimia Lab — Diseñadora visual, branding, UI/UX, ilustración y empaques.",
    "Alquimia Lab Portfolio — User Experience Design.": "Portafolio Alquimia Lab — Diseño de Experiencia de Usuario.",
    "Alquimia Lab Portfolio — Social Media Campaigns.": "Portafolio Alquimia Lab — Campañas de Redes Sociales.",
    "Alquimia Lab Portfolio — AI Characters.": "Portafolio Alquimia Lab — Personajes IA.",
    "Alquimia Lab Portfolio — Brand Identity Exploration.": "Portafolio Alquimia Lab — Exploración de Identidad de Marca.",
    "Alquimia Lab Products — Notion templates, coloring books, and productivity tools.": "Productos Alquimia Lab — Plantillas de Notion, libros para colorear y herramientas de productividad.",
    "Alquimia Lab Contact — Let's talk about your next project.": "Contacto Alquimia Lab — Hablemos de tu próximo proyecto."
  };

  var nodes = [], phNodes = [], titleSnap, descSnap;

  (function capture() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (p && p.tagName && /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT|SVG|SELECT|OPTION)$/.test(p.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = w.nextNode())) {
      nodes.push({ n: n, t: n.nodeValue });
    }
    var ph = document.querySelectorAll("[placeholder]");
    for (var i = 0; i < ph.length; i++) {
      phNodes.push({ el: ph[i], v: ph[i].getAttribute("placeholder") });
    }
    titleSnap = document.title;
    var meta = document.querySelector('meta[name="description"]');
    descSnap = meta ? meta.getAttribute("content") : null;
  })();

  function restore() {
    for (var i = 0; i < nodes.length; i++) nodes[i].n.nodeValue = nodes[i].t;
    for (var j = 0; j < phNodes.length; j++) phNodes[j].el.setAttribute("placeholder", phNodes[j].v);
    if (titleSnap !== null) document.title = titleSnap;
    var meta = document.querySelector('meta[name="description"]');
    if (descSnap !== null && meta) meta.setAttribute("content", descSnap);
  }

  function applyLang(l) {
    restore();
    if (l === "es") {
      var key, node, lead, trail;
      for (var i = 0; i < nodes.length; i++) {
        node = nodes[i].n;
        if (!node.nodeValue) continue;
        key = node.nodeValue.replace(/\s+/g, " ").trim();
        if (dict.hasOwnProperty(key)) {
          lead = node.nodeValue.match(/^\s*/)[0];
          trail = node.nodeValue.match(/\s*$/)[0];
          node.nodeValue = lead + dict[key] + trail;
        }
      }
      for (var j = 0; j < phNodes.length; j++) {
        if (placeholders.hasOwnProperty(phNodes[j].v)) {
          phNodes[j].el.setAttribute("placeholder", placeholders[phNodes[j].v]);
        }
      }
      if (titles.hasOwnProperty(titleSnap)) document.title = titles[titleSnap];
      var meta = document.querySelector('meta[name="description"]');
      if (descSnap !== null && meta && descriptions.hasOwnProperty(descSnap)) {
        meta.setAttribute("content", descriptions[descSnap]);
      }
      document.documentElement.setAttribute("lang", "es");
    } else {
      document.documentElement.setAttribute("lang", "en");
    }
    var btn = document.getElementById("langToggle");
    if (btn) {
      btn.setAttribute("data-lang", l);
      btn.innerHTML = '<span class="cur" data-cur>ES</span><span class="sep">|</span><span class="cur" data-cur>EN</span>';
      var cur = btn.querySelectorAll("[data-cur]");
      cur[0].style.opacity = l === "es" ? "1" : ".45";
      cur[1].style.opacity = l === "en" ? "1" : ".45";
      btn.setAttribute("aria-label", l === "es" ? "Switch to English" : "Cambiar a Español");
    }
    try { localStorage.setItem(STORE_KEY, l); } catch (e) { /* ignore */ }
  }

  function detectLang() {
    try {
      var n = (navigator.language || navigator.userLanguage || "es").toLowerCase();
      // Preferimos inglés para hispanohablantes de EE.UU./posibles angloparlantes
      if (n.indexOf("en") === 0) return "en";
      return "es";
    } catch (e) { return "es"; }
  }

  var lang = null;
  try { lang = localStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
  if (lang !== "es" && lang !== "en") lang = detectLang();
  applyLang(lang);

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t) return;
    var btn = (t.tagName && t.tagName.toLowerCase() === "button" && t.id === "langToggle") ? t : (t.parentNode && t.parentNode.id === "langToggle" ? t.parentNode : null);
    if (btn) {
      var cur = document.documentElement.getAttribute("lang") === "es" ? "es" : "en";
      applyLang(cur === "es" ? "en" : "es");
    }
  });
})();