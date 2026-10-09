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
    "Hi, I'm": "Hola, soy",
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
    "Digital Products": "Productos digitales",
    "Apps, planners y herramientas digitales que llevan orden con calma a tu contenido y tu día a día.": "Apps, planners y herramientas digitales que llevan orden con calma a tu contenido y tu día a día.",
    "Apps, planners, and digital tools that bring calm order to your content and daily life. Ready on desktop and mobile.": "Apps, planners y herramientas digitales que llevan orden con calma a tu contenido y tu día a día. Listas en escritorio y móvil.",
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
    "Digital Products": "Productos digitales",
    "Apps, planners, and digital tools that bring calm order to your content and daily life. Ready on desktop and mobile.": "Apps, planners y herramientas digitales que llevan orden con calma a tu contenido y a tu día a día. Listas en escritorio y móvil.",
    "Plan Maestro Template": "Plantilla Plan Maestro",
    "Blank content plan for pillars, calendar, copy, ideas, and multiple brands. No more messy spreadsheets.": "Plan de contenido en blanco con pilares, calendario, copys, ideas y varias marcas. Adiós a las hojas de cálculo desordenadas.",
    "Five interactive planners in one place: calm, annual, ADHD, menstrual, and weekly. Dark mode, favorites, and PDF export.": "Cinco planners interactivos en un solo lugar: calma, anual, TDAH, menstrual y semanal. Modo oscuro, favoritos y exportación a PDF.",
    "Pet Control — Notion Template": "Control de Mascotas — Plantilla Notion",
    "Vaccines, vet visits, meds, and food in one dashboard. Never miss a rabies shot again.": "Vacunas, citas, medicamentos y alimento en un solo dashboard. Nunca olvides una antirrábica otra vez.",
    "Coming soon": "Próximamente",
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
    "Same book in English and Spanish. Print and digital edition.": "Mismo libro en inglés y español. Edición impresa y digital.",
    "We're working on it…": "Lo estamos trabajando…",
    "Soon": "Pronto",
    "Soon on Amazon": "Pronto en Amazon",
    "On Amazon": "En Amazon",
    "A minimalist planner to organize your year with calm and intention.": "Un planificador minimalista para organizar tu año con calma e intención.",
    "Planner 2027": "Planificador 2027",
    "🔒 Secure checkout on Amazon & Gumroad": "🔒 Compra segura en Amazon y Gumroad",
    "Which one is for you?": "¿Cuál es para ti?",
    "Pick your chaos:": "Elige tu caos:",
    "My admin life is chaos": "Mi vida administrativa es un caos",
    "I want calm and order": "Quiero calma y orden",
    "I relax by coloring": "Me relajo coloreando",
    "I want a paper planner": "Quiero un planner en papel",

    /* TIENDA / NUEVA PÁGINA DE PRODUCTOS */
    "The whole shop 🛍️": "La tienda completa 🛍️",
    "All products": "Todos los productos",
    "Templates, planners, books, and digital tools — all in one place, made with calm.": "Plantillas, planners, libros y herramientas digitales — todo en un solo lugar, hecho con calma.",
    "See products ↓": "Ver productos ↓",
    "All ✨": "Todo ✨",
    "Try online": "Probar online",
    "NEW": "NUEVO",
    "Tap a category to filter — or keep it on All and browse everything 😊": "Toca una categoría para filtrar — o déjalo en Todo y mira todo 😊",
    "The real story of my leap into the freelance life — with 15 prompts to copy and paste, exercises with space to write, and a launch checklist. Coming very soon.": "La historia real de mi salto a la vida freelance — con 15 prompts para copiar y pegar, ejercicios con espacio para escribir y un checklist de lanzamiento. Muy pronto.",
    "Vaccines, vet visits, meds, and food in one dashboard. For Bonnie, Luna and every fur baby.": "Vacunas, veterinario, medicinas y comida en un solo dashboard. Para Bonnie, Luna y todos los peluditos.",
    "Notify me when it launches 🔔": "Avísame cuando salga 🔔",
    "Browse categories ↓": "Ver categorías ↓",
    "The leap into freelance life, told without filters.": "El salto a la vida freelance, contado sin filtro.",
    "The real story of my leap into the freelance life — with 15 prompts to copy and paste, exercises with space to write, and a launch checklist.": "La historia real de mi salto a la vida freelance — con 15 prompts para copiar y pegar, ejercicios con espacio para escribir y un checklist de lanzamiento.",
    "Planner 2027 — Calma y Orden": "Planificador 2027 — Calma y Orden",
    "© 2026 Alquimia Lab · Made with calm & coffee ·": "© 2026 Alquimia Lab · Hecho con calma y café ·",
    "Your image here ✨": "Tu imagen aquí ✨",
    "Digital tools for calm days": "Herramientas digitales para días con calma",
    "Planners and dashboards that bring order to your content and your day.": "Planners y dashboards que ordenan tu contenido y tu día.",
    "Shop digital →": "Ver digitales →",
    "Your life, organized in one place": "Tu vida, organizada en un solo lugar",
    "CRM, finance, habits, student and creator systems — ready in seconds.": "Sistemas de CRM, finanzas, hábitos, estudiante y creadoras — listos en segundos.",
    "Shop templates →": "Ver plantillas →",
    "Color, plan, unwind on paper": "Colorea, planea y descansa en papel",
    "Coloring books and the 2027 planner — print or digital edition.": "Libros para colorear y el planner 2027 — edición impresa o digital.",
    "Shop printed →": "Ver impresos →",
    "From $3": "Desde $3",
    "7 templates": "7 plantillas",
    "From $12.99": "Desde $12.99",

    /* PRODUCTOS · MODAL JOURNAL + INDEX */
    "Calma y Orden — Hybrid Journal for Self-Care & Productivity": "Calma y Orden — Journal Híbrido de Autocuidado y Productividad",
    "What you'll find inside": "Lo que encontrarás dentro",
    "Vaccines, vet visits, meds, and food in one dashboard. Never miss a rabies shot again — built for Bonnie, Luna, and every fur baby.": "Vacunas, citas, medicamentos y alimento en un solo dashboard. Nunca olvides una antirrábica — para Bonnie, Luna y todos los peluditos.",
    "Join me 💜": "Unirme 💜",
    "Loading...": "Cargando...",
    "Thank you! 💜": "¡Gracias! 💜",
    "Done! Check your inbox to confirm": "¡Listo! Revisa tu correo para confirmar",

    /* SALES · PLANNER 2027 */
    "Print edition · 2027": "Edición impresa · 2027",
    "Calma y Orden —": "Calma y Orden —",
    "A minimalist hybrid journal for self-care and productivity. Organize your responsibilities and your calm in one beautiful place.": "Un journal híbrido minimalista de autocuidado y productividad. Organiza tus responsabilidades y tu calma en un solo lugar hermoso.",
    "Buy on Amazon": "Comprar en Amazon",
    "Digital version": "Versión digital",
    "Secure checkout · Protected by Amazon's return policy": "Compra segura · Protegida por la política de devoluciones de Amazon",
    "Made for you if…": "Hecho para ti si…",
    "🌪️ You live in chaos and need one place for tasks, habits, money, and mind.": "🌪️ Vives en el caos y necesitas un solo lugar para tareas, hábitos, dinero y mente.",
    "💜 Classic planners bore you — you want self-care built in, not as an afterthought.": "💜 Los planners clásicos te aburren — quieres autocuidado integrado, no como añadido.",
    "✍️ You love paper — writing by hand helps you think and remember.": "✍️ Amas el papel — escribir a mano te ayuda a pensar y recordar.",
    "🍃 You want calm, not pressure — no guilt trips, just gentle structure.": "🍃 Quieres calma, no presión — sin culpas, solo estructura amable.",
    "Inside the planner": "Dentro del planner",
    "Monthly calendars": "Calendarios mensuales",
    "with space for key dates and monthly goals.": "con espacio para fechas clave y objetivos del mes.",
    "Weekly planning": "Planificación semanal",
    "combining responsibilities + mandatory self-care.": "que combina responsabilidades + autocuidado obligatorio.",
    "Daily pages": "Páginas diarias",
    "with to-do lists and rotating reflection prompts.": "con listas de tareas y prompts de reflexión rotativos.",
    "Monthly habit tracker": "Tracker de hábitos mensual",
    "— 31-day × 6-habit grid.": "— grilla de 31 días × 6 hábitos.",
    "Personal finance control": "Control de finanzas personales",
    "(income, expenses, savings, balance).": "(ingresos, gastos, ahorro y balance).",
    "Energy & stress log": "Registro de energía y estrés",
    "to spot your patterns.": "para identificar tus patrones.",
    "Free spaces": "Espacios libres",
    "for notes, ideas, and mental downloads.": "para notas, ideas y descarga mental.",
    "Year-end closing page": "Página de cierre anual",
    "to reflect on your growth.": "para reflexionar sobre tu crecimiento.",
    "Get yours": "Consigue el tuyo",
    "Print edition": "Edición impresa",
    "Softcover, delivered to your door by Amazon.": "Tapa blanda, entregado en tu puerta por Amazon.",
    "Digital edition": "Edición digital",
    "Instant download to print or use on your tablet.": "Descarga instantánea para imprimir o usar en tu tableta.",
    "Get digital": "Obtener digital",
    "Is it physical or digital?": "¿Es físico o digital?",
    "Both! The print edition (paperback) ships via Amazon, and the digital edition downloads instantly from Gumroad for tablets or home printing.": "¡Ambos! La edición impresa (tapa blanda) llega vía Amazon, y la digital se descarga al instante desde Gumroad para tableta o impresión en casa.",
    "What if I don't like it?": "¿Y si no me gusta?",
    "Amazon covers print orders with easy returns, and Gumroad covers digital ones. You buy protected.": "Amazon cubre los pedidos impresos con devoluciones fáciles, y Gumroad los digitales. Compras protegida.",
    "Do I need experience with planners?": "¿Necesito experiencia con planners?",
    "None. Every section guides you — just open it and start where you are today.": "Ninguna. Cada sección te guía — solo ábrelo y empieza donde estás hoy.",
    "Your calm 2027 starts here": "Tu calma 2027 empieza aquí",
    "One planner. Your tasks, your habits, your money, your mind — in order.": "Un planner. Tus tareas, tus hábitos, tu dinero, tu mente — en orden.",

    /* CONTACTO */
    "Shall we work together?": "¿Trabajamos juntos?",
    "Tell me about your project and let's create something amazing together.": "Cuéntame sobre tu proyecto y creemos algo increíble juntos.",
    "Send message →": "Enviar mensaje →",

    /* KORE LANDING */
    "Coming soon · by Alquimia Lab": "Muy pronto · por Alquimia Lab",
    "Your space of calm": "Tu espacio de calma",
    ", in an app": ", en una app",
    "Your space of calm, in an app": "Tu espacio de calma, en una app",
    "Your calm space: tasks, habits, notes, diary, lo‑fi music and an AI assistant — all in one app.": "Tu espacio de calma: tareas, hábitos, notas, diario, música lo‑fi y un asistente con IA — todo en una sola app.",
    "Kore is your calm space: tasks, habits, notes, diary, lo‑fi music and an AI assistant — all in one app.": "Kore es tu espacio de calma: tareas, hábitos, notas, diario, música lo‑fi y un asistente con IA — todo en una sola app.",
    "Notify me when it launches": "Avísame cuando salga",
    "Notify me": "Avísame",
    "View modules": "Ver módulos",
    "Android · Coming soon": "Android · Muy pronto",
    "Spaces in 1 app": "Espacios en 1 app",
    "Lo‑fi music": "Música lo‑fi",
    "AI assistant": "Asistente IA",
    "No complicated menus. No 40 buttons. Open, breathe, organize.": "Sin menús complicados. Sin 40 botones. Abres, respiras, organizas.",
    "The problem": "El problema",
    "Does this sound familiar?": "¿Te suena esto?",
    "Kore was born from real chaos. If any of this resonates, it's for you.": "Kore nació de un caos real. Si te identificas con alguno, es para ti.",
    "Tasks everywhere": "Tareas regadas",
    "Notes, WhatsApp, your head… nothing in one place.": "Notas, WhatsApp, mental… nada en un solo lugar.",
    "Habits you quit": "Hábitos que abandonas",
    "By week one they fall apart and you start from zero.": "A la semana se caen y vuelves a empezar de 0.",
    "Racing thoughts": "Pensamientos que rondan",
    "Ideas and feelings with nowhere to go.": "Ideas y emociones sin dónde soltarlas.",
    "Mental noise": "Ruido mental",
    "Your mind won't stop and focus feels impossible.": "La cabeza no para y cuesta concentrarte.",
    "Feeling alone": "Sentirte sola",
    "Doubts with no one to talk them through.": "Dudas sin con quién conversarlas.",
    "The story": "La historia",
    "Why Kore?": "¿Por qué Kore?",
    "Kore was born from a personal need: finding calm in the middle of chaos. Its creator wanted one app to order her day and care for her mind — since it didn't exist, she built it.": "Kore nació de una necesidad personal: encontrar calma en medio del caos. Su creadora quería una sola app que ordenara su día y cuidara su mente — como no existía, la construyó.",
    "In Ancient Greek, Kore (κόρη) means “maiden”: the name of Persephone as goddess of spring — a symbol of rebirth and starting anew.": "En griego antiguo, Kore (κόρη) significa «doncella»: es el nombre de Perséfone como diosa de la primavera, símbolo de renacer y empezar de nuevo.",
    "Kore is that: your daily rebirth, your space to come back to yourself.": "Kore es eso: tu renacer diario, tu espacio para volver a ti.",
    "The modules": "Los módulos",
    "Everything Kore brings": "Todo lo que trae Kore",
    "Kore is your daily companion for order and peace. Organize your tasks, build habits that last, write how you feel in your diary, save ideas in notes, and calm your mind with lo‑fi music. And when you need to talk, Antonio, your AI assistant, is there for you. No distractions, no noise — just you and your calm.": "Kore es tu compañera diaria de orden y tranquilidad. Organiza tus tareas, construye hábitos que sí duran, escribe lo que sientes en tu diario, guarda tus ideas en notas y calma tu mente con música lo‑fi. Y cuando necesites hablar, Antonio, tu asistente con IA, está ahí para acompañarte. Sin distracciones, sin ruido: solo tú y tu calma.",
    "Drag or use the arrows →": "Arrastra o usa las flechas →",
    "Tasks": "Tareas",
    "Write what's pending, check it off, feel the peace of that check ✔": "Escribe lo pendiente, táchalo, siente la paz del check ✔",
    "Habits": "Hábitos",
    "Pick your habits, mark them daily, watch your streak grow 🔥": "Elige tus hábitos, márcalos cada día, mira tu racha crecer 🔥",
    "Notes": "Notas",
    "Quick ideas, lists and reminders in seconds": "Ideas rápidas, listas y recordatorios en segundos",
    "Diary": "Diario",
    "How do you feel today? Saved just for you 🔒": "¿Cómo te sientes hoy? Guardado solo para ti 🔒",
    "Hit play and calm your mind instantly": "Dale play y calma tu mente al instante",
    "Antonio (AI)": "Antonio (IA)",
    "Ask him anything — here for you 24/7": "Pregúntale lo que sea, te acompaña 24/7",
    "This is what opening Kore feels like": "Así se siente abrir Kore",
    "A real look at the app: tasks, habits, diary and your daily calm. No filters, no weird promises — just the interface.": "Un vistazo real a la app: tareas, hábitos, diario y tu calma del día. Sin filtros, sin promesas raras — solo la interfaz.",
    "🌅 Rituals": "🌅 Rituales",
    "📋 Tasks": "📋 Tareas",
    "🌱 Habits": "🌱 Hábitos",
    "📖 Diary": "📖 Diario",
    "🤖 Antonio": "🤖 Antonio",
    "Pricing": "Precios",
    "Start free. Go Premium whenever you want to unlock everything.": "Empieza gratis. Pasa a Premium cuando quieras desbloquear todo.",
    "Feature": "Función",
    "Free": "Gratis",
    "Premium": "Premium",
    "Free vs Premium": "Gratis vs Premium",
    "FAQ": "Preguntas frecuentes",
    "Privacy Policy": "Política de Privacidad",
    "Links": "Enlaces",
    "Social": "Redes",
    "Unlimited tasks": "Ilimitadas",
    "✅ Unlimited tasks": "✅ Ilimitadas",
    "Up to 3": "Hasta 3",
    "Unlimited habits": "Ilimitados",
    "♾️ Unlimited habits": "♾️ Ilimitados",
    "Notes & diary": "Notas y diario",
    "Up to 20": "Hasta 20",
    "Up to 20 active": "Hasta 20 activas",
    "Diary": "Diario",
    "Notes": "Notas",
    "♾️ Unlimited": "♾️ Ilimitado",
    "Unlimited + styles": "Ilimitados + estilos",
    "♾️ Unlimited + styles": "♾️ Ilimitados + estilos",
    "2 playlists": "2 playlists",
    "3 playlists": "3 playlists",
    "Unlimited lo‑fi": "Lo‑fi ilimitado",
    "♾️ Unlimited lo‑fi": "♾️ Lo‑fi ilimitado",
    "Chat with Antonio (AI)": "Chat con Antonio (IA)",
    "5 messages": "5 mensajes",
    "5 messages/day": "5 mensajes/día",
    "Unlimited chat": "Ilimitado",
    "♾️ Unlimited chat": "♾️ Ilimitado",
    "Languages": "Idiomas",
    "Spanish & English": "Español e inglés",
    "All 9 languages": "Los 9 idiomas",
    "Free trial": "Prueba gratis",
    "7 days free": "7 días gratis",
    "Monthly": "Mensual",
    "per month": "por mes",
    "Most popular": "Más popular",
    "Yearly": "Anual",
    "per year · save": "por año · ahorras",
    "Questions": "Preguntas",
    "Is it free?": "¿Es gratis?",
    "Yes. Kore is free to start your daily system. Optional premium features come later — the base will always be free.": "Sí. Kore es gratis para empezar tu sistema diario. Funciones premium opcionales llegarán después — la base siempre será gratuita.",
    "Do I need to use it every day?": "¿Necesito usarlo todos los días?",
    "No guilt here. Miss a day? Come back the next. The tracker shows real progress — not a streak that stresses you out.": "No hay culpa aquí. Si fallas un día, vuelves al siguiente. El tracker te muestra el progreso real, no un streak que te estrese.",
    "Does it work if I have ADHD or anxiety?": "¿Sirve si tengo TDAH o ansiedad?",
    "It was designed with that brain in mind: few decisions, clear rituals, zero scolding. It doesn't replace therapy — it supports your system.": "Fue diseñado con ese cerebro en mente: pocas decisiones, rituales claros, cero regaños. No reemplaza terapia — acompaña tu sistema.",
    "When does it launch?": "¿Cuándo sale?",
    "Very soon. Leave your email or follow us on Instagram @alquimia.lab8 and we'll notify you on launch day.": "Muy pronto. Déjanos tu correo o síguenos en Instagram @alquimia.lab8 y te avisamos el día del lanzamiento.",
    "Who made Kore?": "¿Quién hizo Kore?",
    "Alquimia Lab — Isabel. Product designer with 6 years creating order systems for real people.": "Alquimia Lab — Isabel. Diseñadora de producto con 6 años creando sistemas de orden para personas reales.",
    "🔔 Notify me when it launches": "🔔 Avísame cuando salga",
    "We'll email you on launch day. No spam — just the news.": "Te escribimos el día del lanzamiento. Sin spam, solo la noticia.",
    "Or follow us on": "O síguenos en",
    "Want to delete your data?": "¿Deseas eliminar tus datos?",
    "Do you want to delete your Kore data?": "¿Deseas eliminar tus datos de Kore?",
    "Delete my data": "Eliminar mis datos",
    "Kore App": "App Kore",
    "Android · Coming soon on Google Play": "Android · Próximamente en Google Play",
    "View Kore →": "Ver Kore →",
    "Order, Calm and Autonomy for your day to day.": "Orden, Tranquilidad y Autonomía para tu día a día.",

    /* HOME V2 */
    "Alquimia Lab · design with calm": "Alquimia Lab · diseño con calma",
    "Meet Isabel": "Conoce a Isabel",
    "Hi, I'm": "Hola, soy",
    "Get calm in your inbox": "Recibe calma en tu correo",
    "Launches, news, and early access to Kore. No spam, only the good stuff.": "Lanzamientos, novedades y acceso anticipado a Kore. Sin spam, solo lo bueno.",
    "Join": "Unirme",
    "You're in! Check your inbox 💜": "¡Listo! Revisa tu bandeja 💜",
    "I'm a graphic designer and creator of Alquimia Lab — where thoughtful design meets a conscious life. I create digital sanctuaries and creative tools that help you quiet the mental noise, organize your workflow, and live at a calmer pace.": "Soy diseñadora gráfica y creadora de Alquimia Lab — donde el diseño reflexivo se encuentra con una vida consciente. Creo santuarios digitales y herramientas creativas que te ayudan a silenciar el ruido mental, organizar tu flujo de trabajo y vivir a un ritmo más calmado.",
    "Notion templates, coloring books, planners, and soon": "Plantillas de Notion, libros para colorear, planners y pronto",
    "— my app of calm. Everything I make comes from my own need for order without rigidity.": "— mi app de calma. Todo lo que hago nace de mi propia necesidad de orden sin rigidez.",
    "About me": "Sobre mí",
    "Let's talk": "Hablemos",
    "Selected Work": "Trabajo seleccionado",
    "View full portfolio →": "Ver portafolio completo →",
    "Apps, planners and digital tools that bring calm order to your day.": "Apps, planners y herramientas digitales que llevan orden con calma a tu día.",
    "Branding, UI/UX, illustration and visual design for conscious brands.": "Branding, UI/UX, ilustración y diseño visual para marcas conscientes.",
    "The soundtrack of your calm": "La banda sonora de tu calma",
    "15 mixes for studying, working, and breathing for a while. Made with calm by Alquimia Lab.": "15 mezclas para estudiar, trabajar y respirar un rato. Hechas con calma por Alquimia Lab.",
    "Listen on YouTube →": "Escúchanos en YouTube →",
    "Free your mind from mental noise with a minimalist sanctuary designed to protect your energy and bring calm.": "Libera tu mente del ruido mental con un santuario minimalista diseñado para proteger tu energía y traer calma.",
    "View": "Ver",
    "Social media visuals designed to boost engagement and give each brand a recognizable voice.": "Visuales para redes sociales diseñados para potenciar la interacción y darle a cada marca una voz reconocible.",
    "Stop losing video ideas with a comprehensive Notion workspace built for creators.": "Deja de perder ideas de video con un espacio de trabajo integral de Notion para creadores.",
    "Free your mind from mental noise with a minimalist sanctuary.": "Libera tu mente del ruido mental con un santuario minimalista.",
    "Social media visuals designed to boost engagement.": "Visuales para redes sociales diseñados para potenciar la interacción.",
    "Stop losing video ideas with a comprehensive Notion workspace.": "Deja de perder ideas de video con un espacio de trabajo integral de Notion.",
    "What they say": "Lo que dicen",
    "I wanted to thank you for the help with my personal branding — I got great reception on the posts. I've shared your work and sent you as a reference in a group of developers. Someone mentioned they'd write to you.": "Quería agradecerte la ayuda con mi branding personal — tuvo muy buena acogida en las publicaciones. He compartido tu trabajo y te mandé como referencia en un grupo de desarrolladores. Alguien mencionó que te escribiría.",
    "Software Development & Systems": "Desarrollo de Software y Sistemas",
    "Trusted by teams & founders": "Confían en nosotros equipos y fundadores",
    "The planner for designers and freelancers — order for your creative projects.": "El planner para diseñadores y freelancers — orden para tus proyectos creativos.",
    "Plan your week and your goals with calm and structure.": "Planifica tu semana y tus metas con calma y estructura.",
    "Plan your content, strategy and metrics in one calm Notion workspace.": "Planifica tu contenido, tu estrategia y tus métricas en un solo espacio Notion con calma.",
    "I'd be interested in working on other projects with you — for example, videos or posts with animations.": "Me interesaría hacer otros proyectos con usted — por ejemplo, videos o posts con animaciones.",
    "I wanted to thank you for the help with my personal branding — I got great reception on the posts...": "Quería agradecerte la ayuda con mi branding personal — tuvo muy buena acogida en las publicaciones...",
    "Read full review →": "Leer completo →",

    /* BLOG · artículo único (sinopsis + compra) */
    "Blog": "Blog",
    "The book ·": "El libro ·",
    "Synopsis": "Sinopsis",
    "I quit, I trembled…": "Renuncié, tembló…",
    "and Alquimia was born.": "y nació Alquimia.",
    "The story of El diario imperfecto de una creadora — what happens inside its pages, and why you'll want to read it to the last exercise.": "La historia de El diario imperfecto de una creadora — lo que pasa dentro de sus páginas y por qué vas a querer leerla hasta el último ejercicio.",
    "This is not an expert's book. It's my imperfect diary.": "Esto no es un libro de experta. Es mi diario imperfecto.",
    "One night I had had enough: $8 posts, gifted nights, and a heart that was done. So I quit — and then I trembled in front of the empty calendar.": "Una noche ya no di más: posts de $8, noches regaladas y un corazón que ya no daba. Renuncié — y después temblé frente al calendario vacío.",
    "From that rubble Alquimia was born: a one-woman studio built from an anime, a feeling and a lot of guerrilla resourcefulness.": "De esos escombros nació Alquimia: un estudio de una sola mujer construido con un anime, una sensación y muchos recursos de guerrilla.",
    "And then the real battle began: learning to work with AI instead of fighting it — from sworn enemy to trusted assistant, and why a pretty logo made by AI doesn't make a brand.": "Y entonces empezó la batalla real: aprender a trabajar con IA en vez de pelear con ella — de enemiga jurada a asistente de confianza, y por qué un lindo logo hecho por IA no hace una marca.",
    "Inside you'll find real chapters, unfinished endings, 15 prompts to copy and paste, exercises with space to write, and a launch checklist — the map I wish I'd had.": "Adentro vas a encontrar capítulos reales, finales abiertos, 15 prompts para copiar y pegar, ejercicios con espacio para escribir y un checklist de lanzamiento — el mapa que yo hubiera querido tener.",
    "No smoke here. Just the real thing.": "Aquí no hay humo. Hay lo real.",
    "The diary's guardian · original illustration": "La guardiana del diario · ilustración original",
    "What's inside the diary": "Lo que hay dentro del diario",
    "Where it all begins.": "Por dónde empieza todo.",
    "The night I decided: no more.": "La noche en que decidí: no más.",
    "How Alquimia was born.": "Cómo nació Alquimia.",
    "From sworn enemy to trusted assistant.": "De enemiga jurada a asistente de confianza.",
    "A pretty icon doesn't make a brand.": "Un ícono bonito no hace una marca.",
    "Organizing the chaos with guerrilla resources.": "Organizar el caos con recursos de guerrilla.",
    "The opening of a new world.": "La apertura de un nuevo mundo.",
    "Prompts, tools and launch checklist.": "Prompts, herramientas y checklist de lanzamiento.",
    "Get the book": "Consigue el libro",
    "Read synopsis": "Leer sinopsis",
    "Chapters, prompts, exercises with space to write, and a launch checklist — all in one imperfect diary.": "Capítulos, prompts, ejercicios con espacio para escribir y un checklist de lanzamiento — todo en un diario imperfecto.",
    "Buy the book 💜": "Comprar el libro 💜"
  };

  var placeholders = {
    "Your name": "Tu nombre",
    "Your email": "Tu correo",
    "Subject": "Asunto",
    "Tell me about your project...": "Cuéntame sobre tu proyecto...",
    "your@email.com": "tu@email.com"
  };

  var titles = {
    "Alquimia Lab · Well-being, order & design": "Alquimia Lab · Bienestar, orden y diseño",
    "Portfolio · Alquimia Lab": "Portafolio · Alquimia Lab",
    "User Experience Design · Alquimia Lab": "Diseño de Experiencia de Usuario · Alquimia Lab",
    "Social Media Campaign · Alquimia Lab": "Campaña de Redes Sociales · Alquimia Lab",
    "AI Characters · Alquimia Lab": "Personajes IA · Alquimia Lab",
    "Brand Identity Exploration · Alquimia Lab": "Exploración de Identidad de Marca · Alquimia Lab",
    "Products · Alquimia Lab": "Productos · Alquimia Lab",
    "Contact · Alquimia Lab": "Contacto · Alquimia Lab",
    "Planner 2027 · Calma y Orden · Alquimia Lab": "Planificador 2027 · Calma y Orden · Alquimia Lab",
    "Privacy Policy · Alquimia Lab": "Política de Privacidad · Alquimia Lab",
    "Kore · Coming Soon · Alquimia Lab": "Kore · Próximamente · Alquimia Lab",
    "Kore - Coming Soon · Alquimia Lab": "Kore - Próximamente · Alquimia Lab",
    "Kore · Your calm space · Alquimia Lab": "Kore · Tu espacio de calma · Alquimia Lab",
    "Kore": "Kore",
    "Your calm space": "Tu espacio de calma",
    "Under development": "En desarrollo",
    "Coming soon to Google Play": "Próximamente en Google Play",
    "Kore is in final development phase. It will be your personal calm space: tasks, habits, notes, diary, relaxing music and chat with Antonio (AI).": "Kore está en fase final de desarrollo. Será tu espacio personal de calma: tareas, hábitos, notas, diario, música relajante y chat con Antonio (IA).",
    "Tasks & Habits": "Tareas & Hábitos",
    "Notes & Diary": "Notas & Diario",
    "Relaxing Music": "Música Relajante",
    "AI Chat (Antonio)": "Chat IA (Antonio)",
    "Do you want to delete your Kore data?": "¿Deseas eliminar tus datos de Kore?",
    "Delete my data": "Eliminar mis datos",
    "Want to be notified when it launches?": "¿Quieres que te avise cuando salga?",
    "Notify me when it launches": "Avísame cuando salga",
    "Notify me": "Avísame",
    "Made with calm & coffee by": "Hecho con calma y café por",
    "Privacy": "Privacidad",
    "Delete account": "Eliminar cuenta",
    "Terms": "Términos",
    "Blog · Alquimia Lab": "Blog · Alquimia Lab"
  };

  var descriptions = {
    "Alquimia Lab — Products for your well-being and order + Professional design. Notion templates, coloring books, and design services.": "Alquimia Lab — Productos para tu bienestar y orden + Diseño profesional. Plantillas de Notion, libros para colorear y servicios de diseño.",
    "Alquimia Lab Portfolio — Visual designer, branding, UI/UX, illustration, and packaging.": "Portafolio Alquimia Lab — Diseñadora visual, branding, UI/UX, ilustración y empaques.",
    "Alquimia Lab Portfolio — User Experience Design.": "Portafolio Alquimia Lab — Diseño de Experiencia de Usuario.",
    "Alquimia Lab Portfolio — Social Media Campaigns.": "Portafolio Alquimia Lab — Campañas de Redes Sociales.",
    "Alquimia Lab Portfolio — AI Characters.": "Portafolio Alquimia Lab — Personajes IA.",
    "Alquimia Lab Portfolio — Brand Identity Exploration.": "Portafolio Alquimia Lab — Exploración de Identidad de Marca.",
    "Alquimia Lab Products — Notion templates, coloring books, and productivity tools.": "Productos Alquimia Lab — Plantillas de Notion, libros para colorear y herramientas de productividad.",
    "Alquimia Lab Contact — Let's talk about your next project.": "Contacto Alquimia Lab — Hablemos de tu próximo proyecto.",
    "Calma y Orden — Planner 2027. A minimalist hybrid journal for self-care and productivity. Print on Amazon, digital on Gumroad.": "Calma y Orden — Planificador 2027. Un journal híbrido minimalista de autocuidado y productividad. Impreso en Amazon, digital en Gumroad.",
    "Alquimia Lab — Privacy Policy · GDPR/LOPD Compliance": "Alquimia Lab — Política de Privacidad · Cumplimiento GDPR/LOPD",
    "Alquimia Lab — Privacy Policy for our website and services": "Alquimia Lab — Política de Privacidad para nuestro sitio web y servicios",
    "Kore · Coming Soon · Alquimia Lab": "Kore · Próximamente · Alquimia Lab",
    "Kore · Your calm space · Alquimia Lab": "Kore · Tu espacio de calma · Alquimia Lab",
    "Kore is your calm space: tasks, habits, notes, diary, lo‑fi music and an AI assistant — all in one app.": "Kore es tu espacio de calma: tareas, hábitos, notas, diario, música lo‑fi y un asistente con IA — todo en una sola app.",
    "Coming soon · by Alquimia Lab": "Muy pronto · por Alquimia Lab",
    "Your calm space: tasks, habits, notes, diary, lo‑fi music and an AI assistant — all in one app.": "Tu espacio de calma: tareas, hábitos, notas, diario, música lo‑fi y un asistente con IA — todo en una sola app.",
    "Android · Coming soon on Google Play": "Android · Próximamente en Google Play",
    "View Kore →": "Ver Kore →",
    "Kore App": "App Kore",
    "The story of El diario imperfecto de una creadora — what happens inside its pages, and why you'll want to read it to the last exercise.": "La historia de El diario imperfecto de una creadora — lo que pasa dentro de sus páginas y por qué vas a querer leerla hasta el último ejercicio.",
    "Alquimia Lab — Notion templates, planners, coloring books, Lofi mixes and Kore, your calm app. Design tools for a calmer day.": "Alquimia Lab — Plantillas de Notion, planners, libros para colorear, mixes Lofi y Kore, tu app de calma. Herramientas de diseño para un día con más calma."
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