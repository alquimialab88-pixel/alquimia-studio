/* Añade las entradas EN->ES (dict/titles/descriptions) de los 5 artículos nuevos a lang.js
   y canonical si falta. Los HTML ya están en EN; este script solo toca lang.js. */
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Isabel/Documents/Default Project/alquimialab-web';

const FILES = ['blog-notion-mistakes.html', 'blog-todo-list.html', 'blog-ai-criteria.html',
  'blog-one-dashboard.html', 'blog-one-woman-studio.html'];

/* [EN, ES] — nodos exactos (colapsados) de los 5 artículos */
const PAIRS = [
  // ---------- compartidos ----------
  ['Guide', 'Guía'],
  ['Story', 'Historia'],
  ['The book', 'El libro'],
  ['I quit, I trembled… and Alquimia was born', 'Renuncié, me tembló todo… y Alquimia nació'],
  ['Read the story →', 'Lee la historia →'],
  ['More from the blog', 'Más del blog'],
  ['Notion', 'Notion'],
  ['Productivity', 'Productividad'],
  ['Digital life', 'Vida digital'],
  ['Read the method →', 'Lee el método →'],
  ['Read the fixes →', 'Lee los arreglos →'],
  ['Read the rules →', 'Lee las reglas →'],
  ['Read the recipe →', 'Lee la receta →'],
  ['AI with criteria', 'IA con criterio'],
  ['AI', 'IA'],
  ['Your whole life in one dashboard', 'Tu vida entera en un solo dashboard'],
  ['The one-woman studio', 'El estudio de una sola persona'],
  ['5 Notion mistakes that make you abandon your system', '5 errores de Notion que te hacen abandonar tu sistema'],
  ['Why your to-do list never works', 'Por qué tu lista de tareas nunca funciona'],
  ['Explore the templates 💜', 'Explora las plantillas 💜'],
  ['Explore the planners 💜', 'Explora los planners 💜'],
  ['Explore the dashboards 💜', 'Explora los dashboards 💜'],

  // ---------- notion-mistakes ----------
  ['5 Notion mistakes that make you', '5 errores de Notion que te hacen'],
  ['abandon your system', 'abandonar tu sistema'],
  ["Your workspace isn't broken — it's just badly designed. These are the 5 mistakes that kill most Notion systems in two weeks, and the small fixes that make them stick.", 'Tu espacio de trabajo no está roto: simplemente está mal diseñado. Estos son los 5 errores que matan a la mayoría de los sistemas de Notion en dos semanas, y los pequeños arreglos que los hacen funcionar.'],
  ["Your Notion isn't broken. It's just badly designed. Almost everyone blames the tool when their workspace turns into a graveyard of half-built pages — but the problem is rarely Notion. It's the setup.", 'Tu Notion no está roto. Simplemente está mal diseñado. Casi todos culpan a la herramienta cuando su espacio de trabajo se convierte en un cementerio de páginas a medio construir, pero el problema rara vez es Notion. Es la configuración.'],
  ["After building Notion systems for my own studio and for clients, I've seen the same five mistakes kill the same beautiful dashboards over and over. The good news: each one has a fix so small it takes less than a day.", 'Después de construir sistemas de Notion para mi propio estudio y para clientes, he visto los mismos cinco errores matar los mismos paneles hermosos una y otra vez. La buena noticia: cada uno tiene un arreglo tan pequeño que toma menos de un día.'],
  ["A system you don't understand is a system you won't use.", 'Un sistema que no entiendes es un sistema que no usarás.'],
  ['The 5 mistakes (and their fixes)', 'Los 5 errores (y sus arreglos)'],
  ['Building before deciding', 'Construir antes de decidir'],
  ['You design pages before knowing what you actually track. Start with the 3 things you check every day — build only around them.', 'Diseñas páginas antes de saber qué registras realmente. Empieza con las 3 cosas que revisas todos los días: construye solo alrededor de ellas.'],
  ['The page-everything trap', 'La trampa de la página para todo'],
  ['One page per idea, forever. Group related pages into 3–5 areas instead — chaos is just ungrouped information.', 'Una página por idea, para siempre. Agrupa las páginas relacionadas en 3 a 5 áreas: el caos es solo información sin agrupar.'],
  ['Databases nobody opens', 'Bases de datos que nadie abre'],
  ["A beautiful database you never open is decoration. If a view doesn't save you time weekly, delete it or automate it.", 'Una base de datos hermosa que nunca abres es decoración. Si una vista no te ahorra tiempo cada semana, elimínala o automatízala.'],
  ['No entry point', 'Sin punto de entrada'],
  ['Ten links, zero priority. Your dashboard needs one obvious "start here" button — everything else is a distraction.', 'Diez enlaces, prioridad cero. Tu dashboard necesita un botón obvio de "empieza aquí": todo lo demás es una distracción.'],
  ['Perfection before habit', 'Perfección antes que hábito'],
  ['You wait for the perfect system instead of using a simple one. A boring system you open daily beats a gorgeous one you avoid.', 'Esperas el sistema perfecto en lugar de usar uno simple. Un sistema aburrido que abres a diario supera a uno hermoso que evitas.'],
  ["None of this is complicated — that's the point. The best Notion system is the one that survives your busiest week, not the one that wins design awards. Start small, make it obvious, and let it grow with you.", 'Nada de esto es complicado: ese es el punto. El mejor sistema de Notion es el que sobrevive a tu semana más ocupada, no el que gana premios de diseño. Empieza pequeño, hazlo obvio y déjalo crecer contigo.'],
  ["And if you'd rather skip the trial and error, my Notion templates already have these fixes baked in — structure, entry points and views that stay out of your way.", 'Y si prefieres saltarte el ensayo y error, mis plantillas de Notion ya tienen estos arreglos incorporados: estructura, puntos de entrada y vistas que no estorban.'],
  ['Notion templates that already work', 'Plantillas de Notion que ya funcionan'],
  ['Planners, dashboards and workspaces with the fixes baked in — ready to use in minutes, in English and Spanish.', 'Planners, dashboards y espacios de trabajo con los arreglos incorporados: listos para usar en minutos, en inglés y español.'],

  // ---------- todo-list ----------
  ['Method', 'Método'],
  ['Why your to-do list', 'Por qué tu lista de tareas'],
  ['never works', 'nunca funciona'],
  ["Your list isn't lazy — it's designed wrong. Here's why long lists of tasks fail, and the simple 3-priority method that actually gets things done.", 'Tu lista no es perezosa: está mal diseñada. Aquí te conto por qué fallan las listas largas de tareas y el simple método de 3 prioridades que sí hace las cosas.'],
  ['Every morning you write the list. Every night it stares back at you, half-checked, slightly guilty. By Friday it has 40 items and zero momentum — and you start over on Monday with fresh hope and the same design.', 'Cada mañana escribes la lista. Cada noche te mira fijo, a medio marcar, un poco culpable. Para el viernes tiene 40 ítems y cero impulso, y vuelves a empezar el lunes con esperanza nueva y el mismo diseño.'],
  ["The problem isn't your discipline. A list with no priority system is just a storage room: everything goes in, nothing comes out first. Your brain, faced with 40 equal options, chooses none.", 'El problema no es tu disciplina. Una lista sin sistema de prioridades es solo un codo de almacenamiento: todo entra, nada sale primero. Tu cerebro, ante 40 opciones iguales, no elige ninguna.'],
  ['The fix is almost annoyingly small: stop listing tasks and start choosing priorities. Three per day. Not thirty. Three.', 'El arreglo es casi irritantemente pequeño: deja de listar tareas y empieza a elegir prioridades. Tres por día. No treinta. Tres.'],
  ["You don't have a time problem. You have a decision problem.", 'No tienes un problema de tiempo. Tienes un problema de decisiones.'],
  ['The 3-priority method', 'El método de 3 prioridades'],
  ['Choose 3, not 30', 'Elige 3, no 30'],
  ['Each morning, pick the 3 tasks that would make the day a success if nothing else happened. Write only those.', 'Cada mañana, elige las 3 tareas que harían del día un éxito si nada más pasara. Escribe solo esas.'],
  ['One is the lifeline', 'Una es la línea de vida'],
  ['Of the 3, mark 1 as non-negotiable. Everything else is a bonus — protect that one with your best hours.', 'De las 3, marca 1 como innegociable. Todo lo demás es bonus: protégela con tus mejores horas.'],
  ['The rest is a parking lot', 'El resto es un estacionamiento'],
  ['Everything else goes on a "someday" list you review weekly. It\'s safe there — and it\'s not screaming at you daily.', 'Todo lo demás va a una lista de "algún día" que revisas semanalmente. Ahí está a salvo, y no te grita a diario.'],
  ["That's the whole method. Three priorities, one lifeline, one parking lot. It works because it respects how your brain actually decides: not by scanning 40 options, but by committing to one obvious next thing.", 'Ese es todo el método. Tres prioridades, una línea de vida, un estacionamiento. Funciona porque respeta cómo decide realmente tu cerebro: no escaneando 40 opciones, sino comprometiéndose con una siguiente cosa obvia.'],
  ['Give it two weeks. If you finish your lifeline most days, the system is working — and the list that never worked finally has a reason to.', 'Dale dos semanas. Si terminas tu línea de vida la mayoría de los días, el sistema funciona, y la lista que nunca funcionó por fin tiene una razón para hacerlo.'],
  ['A planner that thinks in priorities', 'Un planner que piensa en prioridades'],
  ['My habit planners are built around the 3-priority method — space for your lifeline, your parking lot and your week at a glance.', 'Mis planners de hábitos están construidos alrededor del método de 3 prioridades: espacio para tu línea de vida, tu estacionamiento y tu semana de un vistazo.'],

  // ---------- ai-criteria ----------
  ['Opinion', 'Opinión'],
  ['AI with criteria:', 'IA con criterio:'],
  ['your style is the feature', 'tu estilo es la característica'],
  ["AI is not your enemy and not your savior — it's a tool that amplifies your criteria. How to use it in your business without losing your style, your voice or your standards.", 'La IA no es tu enemiga ni tu salvadora: es una herramienta que amplifica tus criterios. Cómo usarla en tu negocio sin perder tu estilo, tu voz ni tus estándares.'],
  ['I spent months treating AI like a sworn enemy — and then weeks treating it like a magic wand. Both were mistakes. The first wasted time; the second nearly cost me my style.', 'Pasé meses tratando a la IA como una enemiga declarada, y luego semanas tratándola como una varita mágica. Ambos fueron errores. El primero desperdició tiempo; el segundo casi me costó mi estilo.'],
  ["Here's what I learned: AI doesn't replace taste, it multiplies it. Feed it clear criteria and it saves you hours. Feed it vagueness and it produces exactly what you fear — content that sounds like everyone else.", 'Esto es lo que aprendí: la IA no reemplaza el gusto, lo multiplica. Aliméntala con criterios claros y te ahorrará horas. Alimétala con vaguedad y produce exactamente lo que temes: contenido que suena a todos los demás.'],
  ["The creators winning with AI right now aren't the ones prompting the hardest. They're the ones with the sharpest criteria: they know their voice, their audience and their standards before they open the tool.", 'Los creadores que están ganando con la IA ahora no son los que más escriben prompts. Son los que tienen los criterios más afilados: conocen su voz, su audiencia y sus estándares antes de abrir la herramienta.'],
  ["A pretty AI logo doesn't make a brand. A clear point of view does.", 'Un logo bonito hecho con IA no hace una marca. Un punto de vista claro sí.'],
  ['My rules for working with AI', 'Mis reglas para trabajar con IA'],
  ['Criteria first, prompts second', 'Criterios primero, prompts después'],
  ["Before opening any AI tool, write down: who is this for, what should they feel, what would I never publish. If you can't answer, don't prompt.", 'Antes de abrir cualquier herramienta de IA, escribe: para quién es esto, qué debería sentir, qué publicaría nunca. Si no puedes responder, no hagas el prompt.'],
  ['AI drafts, you decide', 'La IA esboza, tú decides'],
  ["Never publish raw output. The draft is your starting material — the final call, the cut, the human touch. That's the job AI can't do.", 'Nunca publiques la salida en bruto. El borrador es tu material de partida: la decisión final, el corte, el toque humano. Ese es el trabajo que la IA no puede hacer.'],
  ['Show your work', 'Muestra tu proceso'],
  ['Real process beats polished perfection. Mistakes, sketches and honest stories build more trust than any flawless AI-generated surface.', 'El proceso real le gana a la perfección pulida. Los errores, los bocetos y las historias honestas construyen más confianza que cualquier superficie impecable generada por IA.'],
  ['Keep a swipe file of your own voice', 'Guarda un archivo de tu propia voz'],
  ['Save your best sentences, your favorite phrases, your tone. Feed them to AI as reference so it sounds like you — not like everyone.', 'Guarda tus mejores frases, tus expresiones favoritas, tu tono. Aliméntalos a la IA como referencia para que suene a ti, no a todos.'],
  ["Used this way, AI becomes what it always should have been: a tireless assistant with terrible taste and excellent speed. You bring the taste. It brings the speed. That's the partnership.", 'Usada así, la IA se convierte en lo que siempre debió ser: un asistente incansable con pésimo gusto y excelente velocidad. Tú pones el gusto. Ella pone la velocidad. Ese es el equipo.'],
  ["If you want the longer version — with real prompts, failures and the exact exercises I use — it's all in my book, El diario imperfecto de una creadora.", 'Si quieres la versión larga, con prompts reales, fracasos y los ejercicios exactos que uso, está todo en mi libro, El diario imperfecto de una creadora.'],
  ['The book: from enemy to assistant', 'El libro: de enemiga a asistente'],
  ['15 copy-paste prompts, real chapters, exercises with space to write — the honest story of learning to work with AI.', '15 prompts para copiar y pegar, capítulos reales, ejercicios con espacio para escribir: la historia honesta de aprender a trabajar con la IA.'],

  // ---------- one-dashboard ----------
  ['Your whole life in', 'Tu vida entera en'],
  ['one dashboard', 'un solo dashboard'],
  ['Tasks, habits, notes, money, calendar — scattered across ten apps? Here\'s how to bring your whole life into one calm dashboard without becoming its full-time janitor.', 'Tareas, hábitos, notas, dinero, calendario: ¿esparcidos en diez apps? Así es como traes tu vida entera a un solo dashboard tranquilo sin convertirte en su conserje de tiempo completo.'],
  ["Tasks in one app. Habits in another. Notes in a third. Money in a spreadsheet you opened once. Your life isn't disorganized — it's just paying rent in ten different places.", 'Tareas en una app. Hábitos en otra. Notas en una tercera. Dinero en una hoja de cálculo que abriste una vez. Tu vida no está desordenada: solo está pagando renta en diez lugares distintos.'],
  ['The fantasy of "one dashboard for everything" dies the same way every time: you spend a weekend building it, and a month later you\'re maintaining it instead of using it. A dashboard you have to feed daily is just another chore.', 'La fantasía de "un dashboard para todo" muere de la misma manera siempre: pasas un fin de semana construyéndolo, y un mes después lo estás manteniendo en lugar de usarlo. Un dashboard que tienes que alimentar a diario es solo otra tarea.'],
  ["The calm version is smaller than you think. You don't need every area of life in one place — you need one entry point that tells you where to look, and three areas you actually check every day.", 'La versión tranquila es más pequeña de lo que crees. No necesitas cada área de la vida en un lugar: necesitas un punto de entrada que te diga dónde mirar, y tres áreas que realmente revisas cada día.'],
  ['One entry point, three daily areas, everything else out of sight.', 'Un punto de entrada, tres áreas diarias, todo lo demás fuera de vista.'],
  ['The calm dashboard recipe', 'La receta del dashboard tranquilo'],
  ['One entry point', 'Un punto de entrada'],
  ["A single page you open every morning. Three links max: today's priorities, this week, and the parking lot. If it needs more, it's too much.", 'Una sola página que abres cada mañana. Tres enlaces máximo: las prioridades de hoy, esta semana y el estacionamiento. Si necesita más, es demasiado.'],
  ['Three daily areas', 'Tres áreas diarias'],
  ['Choose the 3 areas you check daily — for most people: tasks, habits, money. Those get real views. Everything else gets a link, not a dashboard.', 'Elige las 3 áreas que revisas a diario; para la mayoría: tareas, hábitos, dinero. Esas obtienen vistas reales. Todo lo demás obtiene un enlace, no un dashboard.'],
  ['A weekly reset, not a daily one', 'Un reinicio semanal, no diario'],
  ["Fifteen minutes every Sunday: review the week, move what didn't happen, choose the next 3. The system lives or dies by this habit.", 'Quince minutos cada domingo: revisa la semana, mueve lo que no pasó, elige las siguientes 3. El sistema vive o muere por este hábito.'],
  ['Delete on sight', 'Elimina a la vista'],
  ["Every week, remove one view, page or automation you didn't open. A dashboard that shrinks is a dashboard that's working.", 'Cada semana, elimina una vista, página o automatización que no abriste. Un dashboard que se encoge es un dashboard que está funcionando.'],
  ["Start with entry point + three areas + weekly reset. That's it. You can always add later — but you can't add back the hours you spent building a control panel for a life you were too busy to live.", 'Empieza con punto de entrada + tres áreas + reinicio semanal. Eso es todo. Siempre puedes añadir después, pero no puedes recuperar las horas que pasaste construyendo un panel de control para una vida que estabas demasiado ocupada para vivir.'],
  ['And if you want the exact structure I use, my Notion dashboard templates already follow this recipe — entry point included.', 'Y si quieres la estructura exacta que uso, mis plantillas de dashboard de Notion ya siguen esta receta, con punto de entrada incluido.'],
  ['The dashboard, already organized', 'El dashboard, ya organizado'],
  ['Notion dashboards with the entry point, the three daily areas and the reset ritual built in — ready in minutes.', 'Dashboards de Notion con el punto de entrada, las tres áreas diarias y el ritual de reinicio incorporados: listos en minutos.'],

  // ---------- one-woman-studio ----------
  ['The one-woman studio', 'El estudio de una sola persona'],
  ['How I built a one-woman studio with no investors, no team and no safety net — just guerrilla resources, calm systems and a lot of learning in public.', 'Cómo construí un estudio de una sola persona sin inversionistas, sin equipo y sin red de seguridad: solo recursos guerrilleros, sistemas tranquilos y mucho aprendizaje en público.'],
  ['There was no business plan. There was no investor, no co-founder, no safety net. There was one person, an anime that broke her heart in the best way, and a decision made on a trembling night: no more $8 posts. No more gifted weekends. From here, something new.', 'No había plan de negocios. No había inversionista, ni cofundador, ni red de seguridad. Había una persona, un anime que le rompió el corazón de la mejor manera, y una decisión tomada en una noche de temblores: no más publicaciones de $8. No más fines de semana regalados. De aquí, algo nuevo.'],
  ['That something became Alquimia Lab. A studio of one, built with guerrilla resources — borrowing tools instead of buying them, automating what could be automated, and learning to work with AI instead of fighting it.', 'Ese algo se convirtió en Alquimia Lab. Un estudio de uno, construido con recursos guerrilleros: pidiendo herramientas prestadas en lugar de comprarlas, automatizando lo que se podía automatizar, y aprendiendo a trabajar con la IA en lugar de pelear contra ella.'],
  ["The surprising part wasn't the struggle. It was how little you actually need: one clear offer, one audience you genuinely understand, and systems calm enough to survive your worst week.", 'La parte sorprendente no fue la lucha. Fue lo poco que realmente necesitas: una oferta clara, una audiencia que entiendes de verdad, y sistemas lo suficientemente tranquilos para sobrevivir tu peor semana.'],
  ["You don't need more resources. You need fewer, clearer decisions.", 'No necesitas más recursos. Necesitas menos decisiones, pero más claras.'],
  ['What actually made it work', 'Lo que realmente hizo que funcionara'],
  ['One clear offer', 'Una oferta clara'],
  ['"Design for calm businesses" beats "I do everything" every single time. Narrow made it visible.', '"Diseño para negocios tranquilos" le gana a "hago de todo" cada vez. Lo estrecho lo hizo visible.'],
  ['Products over hours', 'Productos sobre horas'],
  ["Templates, planners and digital products sell while I sleep. Time-for-money has a ceiling; products don't.", 'Las plantillas, los planners y los productos digitales venden mientras yo duermo. El tiempo por dinero tiene techo; los productos no.'],
  ['Calm systems', 'Sistemas tranquilos'],
  ['A simple dashboard, a weekly reset, three priorities a day. The boring infrastructure is what made the creative work possible.', 'Un dashboard simple, un reinicio semanal, tres prioridades al día. La infraestructura aburrida es lo que hizo posible el trabajo creativo.'],
  ['Learning in public', 'Aprender en público'],
  ['Every failure and win became content. The audience grew because the process was visible — not despite the mess, but because of it.', 'Cada fracaso y cada victoria se convirtió en contenido. La audiencia creció porque el proceso era visible: no a pesar del desorden, sino gracias a él.'],
  ["Two years in, the studio is small on purpose. Small is calm. Small is sustainable. Small is mine. If you're building something alone, my only advice is this: make it smaller, make it clearer, and keep going.", 'Dos años después, el estudio es pequeño a propósito. Pequeño es tranquilo. Pequeño es sostenible. Pequeño es mío. Si estás construyendo algo sola, mi único consejo es este: hazlo más pequeño, hazlo más claro, y sigue adelante.'],
  ['The whole story — the night I quit, the AI wars, the branding myths — is in my book, El diario imperfecto de una creadora.', 'La historia completa, la noche en que renuncié, las guerras con la IA, los mitos del branding, está en mi libro, El diario imperfecto de una creadora.'],
  ['The whole story, in the book', 'La historia completa, en el libro'],
  ['Real chapters, open endings, 15 prompts and a launch checklist — the honest diary of building a one-woman studio.', 'Capítulos reales, finales abiertos, 15 prompts y una checklist de lanzamiento: el diario honesto de construir un estudio de una sola persona.'],
];

const TITLE_ENT = [
  ['5 Notion mistakes that make you abandon your system · Alquimia Lab', '5 errores de Notion que te hacen abandonar tu sistema · Alquimia Lab'],
  ['Why your to-do list never works · Alquimia Lab', 'Por qué tu lista de tareas nunca funciona · Alquimia Lab'],
  ['AI with criteria · Alquimia Lab', 'IA con criterio · Alquimia Lab'],
  ['Your whole life in one dashboard · Alquimia Lab', 'Tu vida entera en un solo dashboard · Alquimia Lab'],
  ['The one-woman studio · Alquimia Lab', 'El estudio de una sola persona · Alquimia Lab'],
];

const DESC_ENT = [
  ["Your Notion isn't broken — it's just badly designed. The 5 mistakes that make people abandon their workspace in two weeks, and the small fixes that make it stick.", 'Tu Notion no está roto: simplemente está mal diseñado. Los 5 errores que hacen que la gente abandone su espacio de trabajo en dos semanas, y los pequeños arreglos que lo hacen funcionar.'],
  ["Your to-do list isn't lazy — it's designed wrong. Why long lists of tasks fail, and the simple 3-priority method that actually gets things done.", 'Tu lista de tareas no es perezosa: está mal diseñada. Por qué fallan las listas largas de tareas y el simple método de 3 prioridades que sí hace las cosas.'],
  ["AI is not your enemy and not your savior — it's a tool that amplifies your criteria. How to use AI in your business without losing your style, your voice or your standards.", 'La IA no es tu enemiga ni tu salvadora: es una herramienta que amplifica tus criterios. Cómo usarla en tu negocio sin perder tu estilo, tu voz ni tus estándares.'],
  ["Tasks, habits, notes, money, calendar — scattered across ten apps? Here's how to bring your whole life into one calm dashboard without becoming its full-time janitor.", 'Tareas, hábitos, notas, dinero, calendario: ¿esparcidos en diez apps? Así es como traes tu vida entera a un solo dashboard tranquilo sin convertirte en su conserje de tiempo completo.'],
  ['How I built a one-woman studio with no investors, no team and no safety net — just guerrilla resources, calm systems and a lot of learning in public.', 'Cómo construí un estudio de una sola persona sin inversionistas, sin equipo y sin red de seguridad: solo recursos guerrilleros, sistemas tranquilos y mucho aprendizaje en público.'],
];

/* ======================= canonical en los HTML ======================= */
for (const f of FILES) {
  const full = path.join(ROOT, f);
  let html = fs.readFileSync(full, 'utf8');
  if (!/rel="canonical"/.test(html)) {
    html = html.replace(/<\/title>/, '</title>\n  <link rel="canonical" href="https://alquimialab.app/' + f + '">');
    fs.writeFileSync(full, html, 'utf8');
    console.log(f + ': + canonical');
  }
}

/* ======================= lang.js ======================= */
function objAfter(src, marker) {
  const s = src.indexOf(marker);
  if (s < 0) throw new Error('marker no encontrado: ' + marker);
  const o = src.indexOf('{', s);
  let d = 0;
  for (let i = o; i < src.length; i++) {
    if (src[i] === '{') d++;
    else if (src[i] === '}') {
      d--;
      if (d === 0) return eval('(' + src.slice(o, i + 1).replace(/\/\*[\s\S]*?\*\//g, '') + ')');
    }
  }
  return {};
}

function insertBlock(src, marker, entries) {
  if (entries.length === 0) return src;
  const i = src.indexOf(marker);
  if (i < 0) throw new Error('marker no encontrado: ' + marker);
  const at = i + marker.length;
  const lines = entries.map(([k, v]) => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(v) + ',');
  return src.slice(0, at) + '\n' + lines.join('\n') + src.slice(at);
}

function newEntries(existing, pairs) {
  const out = [];
  for (const [en, es] of pairs) {
    if (Object.prototype.hasOwnProperty.call(existing, en)) {
      if (existing[en] !== es) console.log('AVISO valor distinto: ' + JSON.stringify(en));
      continue;
    }
    if (out.some(e => e[0] === en)) continue;
    out.push([en, es]);
  }
  return out;
}

/* verificar que todos los pares existen en los HTML */
let missing = 0;
for (const [en] of PAIRS) {
  let found = false;
  for (const f of FILES) {
    if (fs.readFileSync(path.join(ROOT, f), 'utf8').includes(en)) { found = true; break; }
  }
  if (!found) { console.log('FALTA en HTML: ' + JSON.stringify(en)); missing++; }
}

const langPath = path.join(ROOT, 'js/lang.js');
let lang = fs.readFileSync(langPath, 'utf8');

let existing = objAfter(lang, 'var dict = {');
const dictEnt = newEntries(existing, PAIRS);
existing = objAfter(lang, 'var titles = {');
const titleEnt = newEntries(existing, TITLE_ENT);
existing = objAfter(lang, 'var descriptions = {');
const descEnt = newEntries(existing, DESC_ENT);

lang = insertBlock(lang, 'var dict = {', dictEnt);
lang = insertBlock(lang, 'var titles = {', titleEnt);
lang = insertBlock(lang, 'var descriptions = {', descEnt);
fs.writeFileSync(langPath, lang, 'utf8');

console.log('\nlang.js: +dict ' + dictEnt.length + ', +titles ' + titleEnt.length + ', +descriptions ' + descEnt.length);
console.log(missing === 0 ? 'Todos los pares encontrados en los HTML ✓' : 'PARES FALTANTES: ' + missing);
console.log('LISTO');
