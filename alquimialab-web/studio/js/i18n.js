(function () {
  'use strict';

  var translations = {
    'Cargando tu espacio creativo...': 'Loading your creative space...',
    'Tus planners, libros y momentos de calma en un solo lugar': 'Your planners, books, and moments of calm in one place',
    'Ingresa tu código de acceso para activar': 'Enter your access code to activate',
    'Activar': 'Activate',
    'Volver': 'Back',
    'Abrir menú': 'Open menu',
    'Cerrar menú': 'Close menu',
    '¿Aún no tienes acceso?': "Don't have access yet?",
    'Descubre Alquimia Studio': 'Discover Alquimia Studio',
    '¡Activado correctamente!': 'Activated successfully!',
    'Tu acceso es válido': 'Your access is valid',
    'Código inválido. Verifica e intenta de nuevo.': 'Invalid code. Check it and try again.',
    'Un espacio para volver a ti': 'A space to reconnect with yourself',
    'Organiza tus ideas, acompaña tus días y disfruta tus lecturas a tu propio ritmo.': 'Organize your ideas, make space for your days, and enjoy reading at your own pace.',
    'TU ESPACIO CREATIVO': 'YOUR CREATIVE SPACE',
    'Mis Planners': 'My Planners',
    'Mi Biblioteca': 'My Library',
    'Mi Biblioteca PDF': 'My PDF Library',
    'Favoritos': 'Favorites',
    'Ver todos los PDFs': 'View all PDFs',
    'Abrir HTML o PDF': 'Open HTML or PDF',
    'Abrir un planner HTML o un PDF': 'Open an HTML planner or PDF',
    'Tu espacio': 'Your Space',
    'Guardar una copia': 'Save a Backup',
    'Guardar una copia de tus PDFs y datos': 'Back up your PDFs and data',
    'Restaurar una copia': 'Restore a Backup',
    'Recuperar tus PDFs y datos desde una copia': 'Restore your PDFs and data from a backup',
    'Cambiar apariencia': 'Change appearance',
    'Modo oscuro': 'Dark mode',
    'Modo claro': 'Light mode',
    'Buscar planner…': 'Search planners…',
    'Buscar en planner': 'Search planner',
    'Buscar en este planner…': 'Search this planner…',
    'Agregar este planner a favoritos': 'Add this planner to favorites',
    'Quitar de favoritos': 'Remove from favorites',
    'Agregar a favoritos': 'Add to favorites',
    'Exportar PDF': 'Export PDF',
    'Pantalla completa': 'Full screen',
    'Mi Biblioteca PDF': 'My PDF Library',
    'Sube tus PDFs y léelos como un ebook': 'Upload your PDFs and read them like an ebook',
    'Calma y Orden': 'Calm & Order',
    'Journal anual de autocuidado + organización': 'Annual self-care and organization journal',
    'Planner Anual': 'Annual Planner',
    'Planifica tu año con intención': 'Plan your year with intention',
    'Planner TDAH': 'ADHD Planner',
    'Prioridades visuales para cerebros diferentes': 'Visual priorities for different kinds of brains',
    'Calendario Menstrual': 'Menstrual Cycle Planner',
    'Ciclo, síntomas y bienestar': 'Cycle, symptoms, and well-being',
    'Archivo personalizado': 'Custom file',
    'Sin favoritos aún': 'No favorites yet',
    'Tus lecturas recientes aparecerán aquí.': 'Your recent reads will appear here.',
    'Buscar en este planner…': 'Search this planner…',
    'No se encontraron resultados': 'No results found',
    'Elige un archivo HTML o PDF.': 'Choose an HTML or PDF file.',
    'No se pudo abrir la biblioteca PDF. Recarga la página e inténtalo de nuevo.': 'Could not open the PDF library. Reload the page and try again.',
    'No se pudo acceder a la biblioteca PDF. Recarga la página e inténtalo de nuevo.': 'Could not access the PDF library. Reload the page and try again.',
    'No se pudo leer el archivo HTML: ': 'Could not read the HTML file: ',
    'La copia incluirá tus PDFs y datos personales de los planners. Puede ocupar bastante espacio; guárdala en un lugar privado. ¿Guardar una copia ahora?': 'The backup will include your PDFs and personal planner data. It may be large; save it somewhere private. Save a backup now?',
    'No se pudo guardar la copia: ': 'Could not save the backup: ',
    'El archivo no tiene un formato de copia válido.': 'The file is not a valid backup format.',
    'La copia contiene ajustes no válidos.': 'The backup contains invalid settings.',
    'No se pudo leer la copia: ': 'Could not read the backup: ',
    'Se recuperarán los ajustes y datos de planners incluidos, y se agregarán o actualizarán los PDFs de la copia. Los demás PDFs de este dispositivo se conservarán. ¿Continuar?': 'Included settings and planner data will be restored, and PDFs in the backup will be added or updated. Other PDFs on this device will be kept. Continue?',
    'No se pudieron restaurar los ajustes: ': 'Could not restore the settings: ',
    'Copia restaurada correctamente (': 'Backup restored successfully (',
    ' PDF(s)). La página se recargará.': ' PDF(s)). The page will reload.',
    'No se pudo recuperar la copia: ': 'Could not restore the backup: ',
    'No se pudo leer el archivo de copia.': 'Could not read the backup file.',
    'No hay PDFs que coincidan con tu búsqueda.': 'No PDFs match your search.',
    'Sube tus PDFs (libros, guías, apuntes) y léelos aquí como un ebook, en tu compu, tablet o celular.': 'Upload your PDFs (books, guides, notes) and read them here like an ebook on your computer, tablet, or phone.',
    'Renombrar': 'Rename',
    'Eliminar': 'Delete',
    'pág.': 'pg.',
    'Elige un archivo HTML o PDF.': 'Choose an HTML or PDF file.',
    'Alquimia Studio': 'Alquimia Studio',
    'Volver a Alquimia Lab': 'Back to Alquimia Lab',
    'Buscar': 'Search',
    'Buscar por título…': 'Search by title…',
    'Un lugar tranquilo para reunir tus lecturas y volver a ellas cuando quieras.': 'A quiet place to gather your reading and return to it whenever you like.',
    'Tus PDFs se guardan en este navegador. Usa ': 'Your PDFs are stored in this browser. Use ',
    ' para recuperarlos si borras sus datos o cambias de equipo.': ' to restore them if you clear your data or switch devices.',
    'Subir PDFs': 'Upload PDFs',
    'Subir mi primer PDF': 'Upload my first PDF',
    'Todos': 'All',
    'Recientes': 'Recent',
    'Cerrar': 'Close',
    'Favorito': 'Favorite',
    'Modo noche': 'Night mode',
    'Anterior': 'Previous',
    'Siguiente': 'Next',
    'Alejar': 'Zoom out',
    'Acercar': 'Zoom in',
    'Ajustar al ancho': 'Fit to width',
    'Cargando…': 'Loading…',
    'Preparando…': 'Preparing…',
    'Tu biblioteca está vacía': 'Your library is empty',
    'Sube tus PDFs (libros, guías, apuntes) y léelos aquí como un ebook, en tu compu, tablet o celular.': 'Upload your PDFs (books, guides, notes) and read them here like an ebook on your computer, tablet, or phone.',
    'No hay PDFs que coincidan con tu búsqueda.': 'No PDFs match your search.',
    'No se pudo guardar el favorito.': 'Could not save the favorite.',
    'No se pudo leer uno de los PDFs.': 'Could not read one of the PDFs.',
    'El respaldo contiene un PDF inválido.': 'The backup contains an invalid PDF.',
    'La lista de PDFs del respaldo no es válida.': 'The PDF list in the backup is invalid.',
    'El respaldo contiene datos de PDF inválidos.': 'The backup contains invalid PDF data.',
    'El tamaño de un PDF no coincide con sus datos de respaldo.': 'A PDF size does not match its backup data.',
    'No se pudo guardar la biblioteca restaurada.': 'Could not save the restored library.',
    'Elige uno o varios archivos PDF.': 'Choose one or more PDF files.',
    'No se pudo cargar el lector de PDF. Recarga la página.': 'Could not load the PDF reader. Reload the page.',
    'Preparando ': 'Preparing ',
    ' de ': ' of ',
    'No se pudo agregar el PDF. Revisa que no esté dañado.': 'Could not add the PDF. Check that it is not damaged.',
    ' PDF agregado a tu biblioteca ✓': ' PDF added to your library ✓',
    ' PDFs agregados a tu biblioteca ✓': ' PDFs added to your library ✓',
    ' con error': ' with errors',
    'No se pudo mostrar la página.': 'Could not display the page.',
    'No se pudo actualizar tu lectura reciente.': 'Could not update your recent reading activity.',
    'No se pudo abrir este PDF.': 'Could not open this PDF.',
    'Nuevo título para este PDF:': 'New title for this PDF:',
    'Título actualizado ✓': 'Title updated ✓',
    'PDF eliminado.': 'PDF deleted.',
    'No se pudo eliminar el PDF.': 'Could not delete the PDF.',
    'El lector de PDF no está disponible.': 'The PDF reader is unavailable.',
    '× El archivo se borra de este dispositivo.': '× The file will be deleted from this device.',
    'Semana': 'Week',
    'Mes de': 'Month of',
    'Mes': 'Month',
    'Contenido': 'Contents',
    'Índice': 'Contents',
    'Imprimir / PDF': 'Print / PDF',
    'Imprimir': 'Print',
    'Borrar datos': 'Clear data',
    '¿Borrar los datos de este planner?': 'Clear this planner’s data?',
    '¿Borrar todo lo que escribiste en este journal?': 'Clear everything you wrote in this journal?',
    'Planner Anual': 'Annual Planner',
    'Planner Semanal': 'Weekly Planner',
    'Planner Semanal': 'Weekly Planner',
    'Planner Menstrual': 'Menstrual Cycle Planner',
    'Planner TDAH': 'ADHD Planner',
    'Agenda anual · Autocuidado + Organización': 'Annual Journal · Self-Care + Organization',
    'Edición digital interactiva · Tus datos se guardan automáticamente': 'Interactive digital edition · Your data is saved automatically',
    'Edición Digital Interactiva': 'Interactive Digital Edition',
    'Edición digital interactiva · Escribe directamente aquí, tus avances se guardan automáticamente': 'Interactive digital edition · Write here and your progress is saved automatically',
    'Este planner pertenece a': 'This planner belongs to',
    'Este journal pertenece a': 'This journal belongs to',
    'Empecé a planificar el': 'I started planning on',
    'Empecé a registrar el': 'I started tracking on',
    'Comencé este viaje el': 'I began this journey on',
    'Frase o mantra del día': 'Daily phrase or mantra',
    'Imprescindibles de hoy': 'Today’s must-dos',
    'Si alcanzo, me gustaría…': 'If I have time, I’d like to…',
    'Cierre del día': 'End-of-day reflection',
    'Una línea sobre cómo fue mi día': 'One line about my day',
    'Mañana quiero empezar con': 'Tomorrow I want to start with',
    'Mañana me gustaría empezar con': 'Tomorrow I’d like to start with',
    'Top 3 prioridades de la semana': 'Top 3 priorities this week',
    'Mi enfoque de bienestar esta semana': 'My well-being focus this week',
    'Agenda y compromisos': 'Schedule & commitments',
    'Pausas mentales agendadas (no negociables)': 'Scheduled mental breaks (non-negotiable)',
    'Revisión semanal': 'Weekly review',
    'Notas libres': 'Free notes',
    'Ir directo a un mes': 'Jump to a month',
    'Calendario de ': 'Calendar for ',
    'Fechas clave': 'Key dates',
    'Fechas importantes': 'Important dates',
    'Objetivos del mes': 'Monthly goals',
    'Máximo tres. Menos metas, más avance.': 'Three at most. Fewer goals, more progress.',
    'Solo 2. Menos es más.': 'Just 2. Less is more.',
    'Objetivo ': 'Goal ',
    'Primer paso pequeño': 'One small first step',
    'Primer paso': 'First step',
    'Hábitos del mes': 'Monthly habits',
    'Descarga mental': 'Brain dump',
    'Tracker de hábitos': 'Habit tracker',
    'Marca un check por día cumplido.': 'Check off each day you complete it.',
    'Semana del ': 'Week of ',
    'Mes de ': 'Month of ',
    'Una semana bien planificada vale más que un mes de improvisación.': 'A well-planned week is worth more than a month of improvising.',
    'Organiza tu semana con intención. Un espacio para planificar, avanzar y cuidarte.': 'Plan your week with intention. A space to plan, make progress, and care for yourself.',
    'Organiza tu año con intención. 12 meses para planificar, avanzar y cuidarte.': 'Plan your year with intention. 12 months to plan, make progress, and care for yourself.',
    'Frase o mantra del día': 'Daily phrase or mantra',
    'Planifica tu semana con intención.': 'Plan your week with intention.',
    'Mi enfoque este mes': 'My focus this month',
    'Mi enfoque este mes (solo 1)': 'My focus this month (just 1)',
    'Mi enfoque de bienestar esta semana': 'My well-being focus this week',
    'Lo que quiero lograr': 'What I want to achieve',
    'Lo que quiero lograr este mes': 'What I want to achieve this month',
    'Mi enfoque esta semana (solo 1)': 'My focus this week (just 1)',
    '3 cosas que necesito esta semana': '3 things I need this week',
    'Lo que necesito para tener buena semana': 'What I need for a good week',
    '¿Qué necesito de mí mismo(a)?': 'What do I need from myself?',
    '¿Qué necesito de otros?': 'What do I need from others?',
    '¿Qué logré y de qué me siento orgulloso(a)?': 'What did I accomplish, and what am I proud of?',
    '¿Qué quedó pendiente y qué haré con ello?': 'What is still pending, and what will I do about it?',
    '¿Cómo estuvo mi energía esta semana, del 1 al 10?': 'How was my energy this week, from 1 to 10?',
    '¿Qué me ayudó a sentir calma?': 'What helped me feel calm?',
    'Algo amable que me diré para la próxima semana:': 'Something kind I’ll tell myself next week:',
    'Planner semanal · ': 'Weekly planner · ',
    'Planifica tu año con intención': 'Plan your year with intention',
    'Elige entre dos y cuatro hábitos. La constancia amable vale más que la intensidad.': 'Choose two to four habits. Gentle consistency matters more than intensity.',
    'Vacía aquí todo lo que ronda tu cabeza antes de planificar.': 'Clear your mind here before you start planning.',
    'Agenda y compromisos': 'Schedule & commitments',
    'Una semana bien planificada vale más que un mes de improvisación.': 'A well-planned week is worth more than a month of improvising.',
    'Diseñado para cerebros que funcionan diferente. Menos texto, más acción, prioridades visuales.': 'Designed for brains that work differently. Less text, more action, visual priorities.',
    'Cómo funciona este planner': 'How this planner works',
    'Prioridades visuales:': 'Visual priorities:',
    'cada día tiene 3 cuadros grandes. Escribí UNA tarea en cada uno.': 'each day has 3 large boxes. Write ONE task in each.',
    'Semáforo de energía:': 'Energy traffic light:',
    'marcá cómo estás hoy: rojo (bajo), amarillo (ok), verde (bien).': 'mark how you feel today: red (low), yellow (okay), green (good).',
    'Bloque de enfoque:': 'Focus block:',
    'elegí UNA hora para concentrarte. Solo una.': 'choose ONE hour to focus. Just one.',
    'Sin presión:': 'No pressure:',
    'si un día no sale, mañana es otro día. Sin culpa.': 'if a day doesn’t go as planned, tomorrow is a new day. No guilt.',
    '5 preguntas para cerrar la semana con honestidad.': '5 questions to wrap up the week honestly.',
    'Mis 3 prioridades de hoy': 'My 3 priorities today',
    'Si me sobra tiempo…': 'If I have time left…',
    'Bloque de enfoque': 'Focus block',
    'Inicio': 'Start',
    'Fin': 'End',
    '¿En qué trabajé?': 'What did I work on?',
    'Cómo me fue hoy': 'How my day went',
    '¿Qué es lo #': 'What is my #',
    'Pequeños pasos siguen siendo pasos.': 'Small steps are still steps.',
    'Tu ritmo es válido.': 'Your pace is valid.',
    'Cada mes es una nueva página en blanco.': 'Every month is a fresh page.',
    'Planificar es cuidar de tu futuro yo.': 'Planning is a way to care for your future self.',
    'La constancia supera al talento.': 'Consistency beats talent.',
    'Un día a la vez, un mes a la vez.': 'One day at a time, one month at a time.',
    'Tu tiempo es tu recurso más valioso.': 'Your time is your most valuable resource.',
    'Organizar no es rigidir, es fluir.': 'Organization is not rigidity; it is a way to flow.',
    'Pequeños pasos generan grandes cambios.': 'Small steps create big changes.',
    'La productividad empieza por la intención.': 'Productivity begins with intention.',
    'Cada checkmark es un mini logro.': 'Every check mark is a small win.',
    'Descansar también es productivo.': 'Rest is productive, too.',
    'Terminar fuerte es empezar bien.': 'Finishing strong is a good way to begin.',
    'Cierra el año con gratitud.': 'Close the year with gratitude.',
    'Un año tranquilo se construye con días honestos.': 'A peaceful year is built one honest day at a time.',
    'El orden no es rigidez: es una forma de cuidarse.': 'Organization is not rigidity; it is a way to care for yourself.',
    'Pequeños pasos sostenidos recorren caminos largos.': 'Small, steady steps take you a long way.',
    'Respira: no todo tiene que resolverse hoy.': 'Breathe: not everything has to be solved today.',
    'Tu paz también es una forma de productividad.': 'Your peace is a form of productivity, too.',
    'Haz menos cosas, pero hazlas con presencia.': 'Do fewer things, but do them with intention.',
    'La constancia amable transforma más que la intensidad.': 'Gentle consistency creates more change than intensity.',
    'Empezar otra vez también es un logro.': 'Starting over is an accomplishment, too.',
    'Primero lo esencial; después lo urgente.': 'First what matters; then what is urgent.',
    'Gracias por lo vivido; listo(a) para lo nuevo.': 'Grateful for what has been; ready for what is next.',
    'Cerrar con calma también es terminar bien.': 'Closing with calm is a good way to finish.',
    'Tu cerebro no está roto. Solo funciona diferente.': 'Your brain is not broken. It just works differently.',
    'Lo hecho está hecho. Hoy es nuevo.': 'What’s done is done. Today is a fresh start.',
    'No es procrastinación. Es descanso que necesitabas.': 'It is not procrastination. It is the rest you needed.',
    'Empezá de nuevo. Sin culpa.': 'Begin again. No guilt.',
    'No necesitás ser perfecto. Solo presente.': 'You don’t have to be perfect. Just be present.',
    'Hoy elijo lo esencial.': 'Today I choose what matters.',
    'Si es muy grande, partilo. Si es muy pequeño, hacelo.': 'If it feels too big, break it down. If it is small, do it.',
    'Tu energía merece un plan, no una exigencia.': 'Your energy deserves a plan, not pressure.',
    'Está bien ir lento. Lo que no está bien es detenerse.': 'It is okay to go slowly. What matters is to keep going.',
    'Celebrá cada cosita.': 'Celebrate every little thing.',
    'Cada fase tiene su regalo.': 'Every phase has its gift.',
    'Tu cuerpo te habla. Escuchalo sin juicio.': 'Your body is speaking. Listen without judgment.',
    'Cada ciclo es diferente. Todas son válidas.': 'Every cycle is different. They are all valid.',
    'Descansar durante la regla no es debilidad.': 'Resting during your period is not weakness.',
    'Conocer tu cuerpo es un acto de amor.': 'Knowing your body is an act of self-love.',
    'Los altos y bajos son parte del camino.': 'The highs and lows are part of the journey.',
    'Tu energía fluctúa. Planificá en consecuencia.': 'Your energy changes. Plan accordingly.',
    'No pelees con tu cuerpo. Acompañalo.': 'Don’t fight your body. Work with it.',
    'Hoy es buen día para ser amable contigo.': 'Today is a good day to be kind to yourself.',
    'Permitite fluir con tu ciclo.': 'Let yourself flow with your cycle.',
    'Tu bienestar es prioridad, siempre.': 'Your well-being is always a priority.',
    'Un espacio para cuidar tu paz mental mientras ordenas tus días, tus tareas y tus metas.': 'A space to care for your peace of mind as you organize your days, tasks, and goals.',
    'Un año tranquilo se construye con días honestos.': 'A peaceful year is built one honest day at a time.',
    'Que estas páginas sean un refugio y un mapa: refugio cuando el día pesa, mapa cuando toque avanzar.': 'May these pages be both shelter and map: shelter when the day feels heavy, and a map when it is time to move forward.',
    'Hola, bienvenido(a) a este espacio que será tuyo durante los próximos meses. Este journal nació de una idea sencilla: no tienes que elegir entre cuidar tu paz mental y mantener tu vida en orden. Aquí, ambas cosas viven juntas.': 'Welcome to a space that will be yours for the coming months. This journal began with a simple idea: you do not have to choose between caring for your peace of mind and keeping your life organized. Here, both can coexist.',
    'En estas páginas encontrarás herramientas para organizar tus tareas, pendientes y metas, pero también espacios diseñados para respirar, reflexionar y reconectar contigo.': 'These pages offer tools to organize your tasks, to-dos, and goals, as well as space to breathe, reflect, and reconnect with yourself.',
    'No busques la perfección: este journal funciona cuando se usa con honestidad, no con exigencia.': 'Do not aim for perfection: this journal works best when you use it honestly, not under pressure.',
    'La calma no es ausencia de ocupaciones; es la forma en que decimos sí a lo importante.': 'Calm is not the absence of things to do; it is how we say yes to what matters.',
    'Empieza por tus intenciones:': 'Start with your intentions:',
    'dedica una sesión tranquila a esa sección antes de comenzar el primer mes.': 'set aside a quiet moment for this section before beginning the first month.',
    'Un momento al día es suficiente:': 'One moment a day is enough:',
    'cinco minutos en la página diaria valen más que una hora perfecta que nunca llega.': 'five minutes on a daily page are better than a perfect hour that never comes.',
    'El autocuidado no es opcional:': 'Self-care is not optional:',
    'los bloques de bienestar están integrados en cada semana porque merecen el mismo lugar que tus responsabilidades.': 'well-being blocks are built into every week because they deserve the same space as your responsibilities.',
    'Sé flexible:': 'Be flexible:',
    'si te saltas días, vuelve sin culpa. Este journal te espera sin juicios.': 'if you miss a day, come back without guilt. This journal will be here without judgment.',
    'Intenciones a mediano plazo': 'Mid-term intentions',
    'Antes de organizar los días, define hacia dónde miras. Escribe con calma; puedes volver a esta página cada mes para recordarte el rumbo.': 'Before organizing your days, decide where you are heading. Write calmly; return to this page each month to remind yourself of your direction.',
    'Mi intención para los próximos 3 meses': 'My intention for the next 3 months',
    'Lo que quiero lograr en 6 meses': 'What I want to achieve in 6 months',
    'La visión que tengo de mí dentro de un año': 'How I see myself a year from now',
    'Una palabra que guiará esta etapa': 'A word to guide this season',
    'Para cuidar mi paz mental, me comprometo a': 'To care for my peace of mind, I commit to',
    'Para ordenar mi día a día, me comprometo a': 'To bring order to my day-to-day life, I commit to',
    '¿Qué logré y de qué me siento orgulloso(a)?': 'What did I accomplish, and what am I proud of?',
    '¿Qué quedó pendiente y qué haré con ello? (reagendar, delegar o soltar)': 'What is still pending, and what will I do about it? (Reschedule, delegate, or let it go.)',
    '¿Qué funcionó esta semana?': 'What worked this week?',
    '¿Qué no funcionó y qué cambio?': 'What did not work, and what will I change?',
    '¿Cómo estuvo mi energía del 1 al 10?': 'How was my energy, from 1 to 10?',
    '¿Qué me ayudó a concentrarme?': 'What helped me focus?',
    'Un recordatorio amable para la próxima semana:': 'A kind reminder for next week:',
    '¿Cómo fue mi energía esta semana?': 'How was my energy this week?',
    '¿Qué síntomas noté más?': 'Which symptoms did I notice most?',
    '¿Qué hice para cuidarme?': 'What did I do to care for myself?',
    '¿Qué quiero cambiar la próxima semana?': 'What would I like to change next week?',
    'Algo bonito que quiero recordar:': 'Something lovely I want to remember:',
    'Un momento de este año que atesoraré siempre': 'A moment from this year I will always treasure',
    'Lo más difícil que atravesé y cómo lo hice': 'The hardest thing I went through and how I got through it',
    'Lo que aprendí sobre mí mismo(a)': 'What I learned about myself',
    'Lo que quiero dejar ir antes de empezar de nuevo': 'What I want to let go of before beginning again',
    'Mi intención para el siguiente ciclo': 'My intention for the next cycle',
    'Gracias por regalarte estos meses de calma y orden. Esto apenas comienza.': 'Thank you for giving yourself these months of calm and order. This is only the beginning.',
    'Tu cuerpo te habla. Escuchalo sin juicio.': 'Your body is speaking. Listen without judgment.',
    'Cada ciclo es diferente. Todas son válidas.': 'Every cycle is different. They are all valid.',
    'Descansar durante la regla no es debilidad.': 'Resting during your period is not weakness.',
    'Conocer tu cuerpo es un acto de amor.': 'Knowing your body is an act of self-love.',
    'Los altos y bajos son parte del camino.': 'The highs and lows are part of the journey.',
    'Tu energía fluctúa. Planificá en consecuencia.': 'Your energy changes. Plan accordingly.',
    'No pelees con tu cuerpo. Acompañalo.': 'Don’t fight your body. Work with it.',
    'Hoy es buen día para ser amable contigo.': 'Today is a good day to be kind to yourself.',
    'Escuchar a tu cuerpo es sabiduría, no debilidad.': 'Listening to your body is wisdom, not weakness.',
    'Cada fase tiene su regalo.': 'Every phase has its gift.',
    'Permitite fluir con tu ciclo.': 'Let yourself flow with your cycle.',
    'Tu bienestar es prioridad, siempre.': 'Your well-being is always a priority.',
    'Cómo funciona': 'How it works',
    'Fase menstrual ( días 1-5):': 'Menstrual phase (days 1–5):',
    'tu cuerpo se está renovando. Descansá, hidratate, sé amable.': 'your body is renewing itself. Rest, hydrate, and be kind to yourself.',
    'Fase folicular (días 6-13):': 'Follicular phase (days 6–13):',
    'tu energía sube. Buen momento para empezar proyectos nuevos.': 'your energy rises. A good time to start new projects.',
    'Ovulación (día 14):': 'Ovulation (day 14):',
    'tu energía está en su pico. Socializá, creá, expone.': 'your energy is at its peak. Connect, create, and express yourself.',
    'Fase lútea (días 15-28):': 'Luteal phase (days 15–28):',
    'tu energía baja gradualmente. Preparate, planificá, descansá.': 'your energy gradually declines. Prepare, plan, and rest.',
    'Síntomas:': 'Symptoms:',
    'tocá los iconos para registrar cómo te sentís cada día.': 'tap the icons to track how you feel each day.',
    'Salud:': 'Health:',
    'registra sueño, ejercicio, agua, alimentación y ánimo del 1 al 5.': 'rate your sleep, exercise, hydration, nutrition, and mood from 1 to 5.',
    'Calendario Menstrual': 'Menstrual Cycle Planner',
    'Conocé tu ciclo, cuidá tu cuerpo y planificá con intención en cada fase.': 'Get to know your cycle, care for your body, and plan with intention through every phase.',
    'Conocer tu ciclo es conocerte a ti. Cada fase tiene su regalo.': 'Knowing your cycle is knowing yourself. Every phase has its gift.',
    'Mi ciclo típico dura (días)': 'My typical cycle lasts (days)',
    'Mi último periodo empezó el': 'My last period started on',
    '¿Cómo me siento hoy?': 'How am I feeling today?',
    'Salud del día': 'Daily well-being',
    'Notas del día': 'Daily notes',
    'Cómo me siento física y emocionalmente': 'How I feel physically and emotionally',
    'Algo que noto en mi cuerpo': 'Something I notice in my body',
    'Día del ciclo': 'Cycle day',
    'Top 3 prioridades del mes': 'Top 3 priorities this month',
    'Mi enfoque de bienestar esta semana': 'My well-being focus this week',
    'Lo que necesito para tener buena semana': 'What I need for a good week',
    '¿Qué necesito de mí mismo(a)?': 'What do I need from myself?',
    '¿Qué necesito de otros?': 'What do I need from others?',
    'Frase que me acompaña': 'A phrase to carry with me',
    'Tracker de hábitos': 'Habit tracker',
    'Marca, colorea o pega un punto por día cumplido.': 'Check, color, or add a dot for each day you complete it.',
    'Finanzas · Ingresos y gastos fijos': 'Finances · Income & fixed expenses',
    'Finanzas · Variables, ahorro y balance': 'Finances · Variable expenses, savings & check-in',
    'Ingresos del mes': 'Monthly income',
    'Gastos fijos': 'Fixed expenses',
    'Gastos variables': 'Variable expenses',
    'Meta del mes': 'Monthly goal',
    'Ahorrado real': 'Actual savings',
    'Nota breve': 'Quick note',
    'Conocé tu ciclo, cuidá tu cuerpo y planificá con intención en cada fase.': 'Get to know your cycle, care for your body, and plan with intention through every phase.',
    'Fase menstrual ( días 1-5):': 'Menstrual phase (days 1–5):',
    'tu cuerpo se está renovando. Descansá, hidratate, sé amable.': 'your body is renewing itself. Rest, hydrate, and be kind to yourself.',
    'Fase folicular (días 6-13):': 'Follicular phase (days 6–13):',
    'tu energía sube. Buen momento para empezar proyectos nuevos.': 'your energy rises. A good time to start new projects.',
    'Ovulación (día 14):': 'Ovulation (day 14):',
    'tu energía está en su pico. Socializá, creá, expone.': 'your energy is at its peak. Connect, create, and express yourself.',
    'Fase lútea (días 15-28):': 'Luteal phase (days 15–28):',
    'tu energía baja gradualmente. Preparate, planificá, descansá.': 'your energy gradually declines. Prepare, plan, and rest.',
    'No buscues la perfección': 'Do not aim for perfection',
    'Conocer tu ciclo es conocerte a ti. Cada fase tiene su regalo.': 'Knowing your cycle is knowing yourself. Every phase has its gift.',
    'Máximo dos. Cuidate mientras avanzás.': 'Two at most. Take care of yourself as you make progress.',
    'La calma no es ausencia de ocupaciones; es la forma en que decimos sí a lo importante.': 'Calm is not the absence of things to do; it is how we say yes to what matters.',
    'La constancia amable transforma más que la intensidad.': 'Gentle consistency creates more change than intensity.',
    'Cada checkmark es un mini logro.': 'Every check mark is a small win.',
    'Organizar no es rigidir, es fluir.': 'Organization is not rigidity; it is a way to flow.',
    'Planner Semanal': 'Weekly Planner',
    'Borrar datos': 'Clear data',
    '¿Borrar todo lo que escribiste en este journal?': 'Clear everything you wrote in this journal?',
    'Inicio': 'Start',
    'Fin': 'End',
    'Mes de': 'Month of',
    'Contenido': 'Contents',
    'Calendario de ': 'Calendar for ',
    'Objetivo ': 'Goal ',
    'Finanzas · ': 'Finances · ',
    'Tracker de hábitos · ': 'Habit tracker · ',
    'Síntomas · ': 'Symptoms · ',
    'Salud y bienestar · ': 'Health & well-being · ',
    'Energía y estrés · ': 'Energy & stress · ',
    'Notas libres · ': 'Free notes · ',
    'Alcanzado': 'Achieved',
    'Total': 'Total',
    'Hábito': 'Habit',
    'Día': 'Day',
    'Page': 'Page',
    'Top 3 prioridades del mes': 'Top 3 priorities this month',
    'Balance del mes': 'Monthly check-in',
    'Finanzas': 'Finances',
    'Ingresos y gastos fijos': 'Income & fixed expenses',
    'Ingresos del mes': 'Monthly income',
    'Gastos fijos': 'Fixed expenses',
    'Variables, ahorro y balance': 'Variable expenses, savings & check-in',
    'Gastos variables': 'Variable expenses',
    'Ahorro': 'Savings',
    'Meta del mes': 'Monthly goal',
    'Ahorrado real': 'Actual savings',
    'Cinco minutos de honestidad. ': 'Five minutes of honest reflection. ',
    'Hábitos y descarga mental': 'Habits & brain dump',
    'Hábitos que cultivo este mes': 'Habits I am building this month',
    'Descarga mental del mes': 'Monthly brain dump',
    'Portada e introducción': 'Cover and introduction',
    '12 meses, cada uno con:': '12 months, each with:',
    'Portada del mes y frase inspiradora': 'Monthly cover and inspiring quote',
    'Calendario mensual': 'Monthly calendar',
    'Tracker de hábitos': 'Habit tracker',
    'Semanas, cada una con:': 'Weeks, each with:',
    'Vista semanal completa': 'Full weekly view',
    '7 páginas diarias': '7 daily pages',
    '7 páginas diarias por semana': '7 daily pages per week',
    'Bienvenida y cómo usar este journal': 'Welcome and how to use this journal',
    'Intenciones a mediano plazo': 'Mid-term intentions',
    'Semanas con planificador por bloques y página diaria': 'Weeks with time-block planning and daily pages',
    'Fecha': 'Date',
    'Concepto': 'Description',
    'Monto': 'Amount',
    'Categoría': 'Category',
    'Energía': 'Energy',
    'Estrés': 'Stress',
    'Nota breve': 'Quick note',
    'Frase que me acompaña': 'A phrase to carry with me',
    'Top 3 prioridades de la semana': 'Top 3 priorities this week',
    'Intención del mes': 'Monthly intention',
    'Lo que quiero lograr este mes': 'What I want to achieve this month',
    'Máximo tres. Menos metas, más avance.': 'Three at most. Fewer goals, more progress.',
    'Solo 2. Menos es más.': 'Just 2. Less is more.',
    'Solo 2. Menos es más.': 'Just 2. Less is more.',
    'Elige entre dos y cuatro hábitos. La constancia amable vale más que la intensidad.': 'Choose two to four habits. Gentle consistency matters more than intensity.',
    'Vacía aquí todo lo que ronda tu cabeza antes de planificar.': 'Clear your mind here before you start planning.',
    'Marca un check por día cumplido.': 'Check off each day you complete it.',
    'Marca, colorea o pega un punto por día cumplido.': 'Check, color, or add a dot for each day you complete it.',
    'Pausas mentales agendadas (no negociables)': 'Scheduled mental breaks (non-negotiable)',
    'Agenda y compromisos': 'Schedule & commitments',
    'Notas libres': 'Free notes',
    'Regla': 'Period',
    'Cólicos': 'Cramps',
    'Náuseas': 'Nausea',
    'Dolor pecho': 'Breast tenderness',
    'Irritabilidad': 'Irritability',
    'Tristeza': 'Sadness',
    'Cansancio': 'Fatigue',
    'Antojos': 'Cravings',
    'Hinchazón': 'Bloating',
    'Insomnio': 'Insomnia',
    'Niebla mental': 'Brain fog',
    'Dolor espalda': 'Back pain',
    'Acné': 'Acne',
    'Buen ánimo': 'Good mood',
    'Energía alta': 'High energy',
    'Zen': 'Calm',
    'Sueño': 'Sleep',
    'Ejercicio': 'Exercise',
    'Agua': 'Water',
    'Alimentación': 'Nutrition',
    'Ánimo': 'Mood',
    'Nota': 'Note',
    'Máximo dos. Cuidate mientras avanzás.': 'Two at most. Take care of yourself as you make progress.',
    'Mi intención este mes para mi cuerpo': 'My intention for my body this month',
    'Lo que quiero registrar con más atención': 'What I want to track more closely',
    '¿En qué fase del ciclo estoy?': 'What phase of my cycle am I in?',
    '¿Qué necesita mi cuerpo esta semana?': 'What does my body need this week?',
    'Resumen semanal': 'Weekly summary',
    'Síntomas': 'Symptoms',
    'Salud y bienestar': 'Health & well-being',
    'Marca con un check cada síntoma que experimentaste.': 'Check each symptom you experienced.',
    'Registra del 1 al 5: 1=malo, 5=excelente.': 'Rate from 1 to 5: 1 = poor, 5 = excellent.',
    'Energía y estrés': 'Energy & stress',
    'Registra rápido cada día: energía (1–5) y estrés (1–5). Al final del mes, mira tus patrones sin juzgarte.': 'Quickly track your energy (1–5) and stress (1–5) each day. At the end of the month, look for patterns without judgment.',
    'Calma &': 'Calm &',
    'orden': 'order',
    'Un espacio para cuidar tu paz mental mientras ordenas tus días, tus tareas y tus metas.': 'A space to care for your peace of mind as you organize your days, tasks, and goals.',
    'Bienvenida: un espacio para ti': 'Welcome: a space for you',
    'Cómo usar este journal': 'How to use this journal',
    'Intenciones a mediano plazo': 'Mid-term intentions',
    'Portada e intención del mes': 'Monthly cover and intention',
    'Calendario mensual y fechas clave': 'Monthly calendar and key dates',
    'Objetivos, hábitos y descarga mental': 'Goals, habits, and brain dump',
    'Semanas con planificador por bloques y página diaria': 'Weeks with time-block planning and daily pages',
    'Trackers: hábitos, finanzas, energía y estrés': 'Trackers: habits, finances, energy, and stress',
    'Cierre: un año contigo': 'Closing: a year with yourself',
    'Intención': 'Intention',
    'Gratitud': 'Gratitude',
    'Autoconocimiento': 'Self-awareness',
    'Celebración': 'Celebration',
    'Placer simple': 'Simple pleasure',
    'Soltar': 'Letting go',
    '¿Qué actitud quiero llevarme hoy?': 'What attitude do I want to carry with me today?',
    'Hoy agradezco tres cosas pequeñas:': 'Today I am grateful for three small things:',
    'Lo que necesito sacar de mi cabeza ahora mismo es…': 'What I need to get off my mind right now is…',
    '¿Qué necesitó hoy mi cuerpo o mi mente?': 'What did my body or mind need today?',
    'Un logro de esta semana, aunque sea pequeño:': 'One thing I accomplished this week, even if it is small:',
    'Algo que haré hoy solo(a), por puro gusto:': 'Something I will do just for fun today:',
    'Dejo ir de esta semana:': 'I am letting go of this week:',
    'Top 3 prioridades del mes': 'Top 3 priorities this month',
    'Balance del mes': 'Monthly check-in',
    'Finanzas del mes': 'Monthly finances',
    'Energía y estrés': 'Energy & stress',
    'Cierre del año: un año contigo': 'Year-end reflection: a year with yourself',
    'Un momento de este año que atesoraré siempre': 'A moment from this year I will always treasure',
    'Lo más difícil que atravesé y cómo lo hice': 'The hardest thing I went through and how I got through it',
    'Lo que aprendí sobre mí mismo(a)': 'What I learned about myself',
    'Lo que quiero dejar ir antes de empezar de nuevo': 'What I want to let go of before beginning again',
    'Mi intención para el siguiente ciclo': 'My intention for the next cycle',
    '¿En qué me gustaría gastar menos?': 'What would I like to spend less on?',
    '¿En qué vale la pena invertir más?': 'What is worth investing more in?',
    'Registra rápido cada día: energía (1–5) y estrés (1–5). Al final del mes, mira tus patrones sin juzgarte.': 'Quickly track your energy (1–5) and stress (1–5) each day. At the end of the month, look for patterns without judgment.'
  };

  var wordTranslations = {
    'Enero': 'January', 'Febrero': 'February', 'Marzo': 'March', 'Abril': 'April',
    'Mayo': 'May', 'Junio': 'June', 'Julio': 'July', 'Agosto': 'August',
    'Septiembre': 'September', 'Octubre': 'October', 'Noviembre': 'November', 'Diciembre': 'December',
    'Lunes': 'Monday', 'Martes': 'Tuesday', 'Miércoles': 'Wednesday', 'Jueves': 'Thursday',
    'Viernes': 'Friday', 'Sábado': 'Saturday', 'Domingo': 'Sunday',
    'Total': 'Total', 'Hábito': 'Habit', 'Día': 'Day',
    'X': 'W'
  };

  var originalText = new WeakMap();
  var originalAttributes = new WeakMap();
  var translationKeys = Object.keys(translations).sort(function (a, b) { return b.length - a.length; });
  var wordKeys = Object.keys(wordTranslations).sort(function (a, b) { return b.length - a.length; });
  var currentLanguage = localStorage.getItem('alquimia-language') === 'en' ? 'en' : 'es';

  function translateMonth(month) {
    var normalized = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    return wordTranslations[normalized] || month;
  }

  function translate(text) {
    if (currentLanguage !== 'en' || !text) return text;
    var trimmed = text.trim();
    if (translations[trimmed]) {
      return text.replace(trimmed, translations[trimmed]);
    }
    var weekMatch = trimmed.match(/^Semana (\d+) · del (\d+) al (\d+)(?: de (.+))?$/);
    if (weekMatch) {
      return text.replace(trimmed, 'Week ' + weekMatch[1] + ' · ' + weekMatch[2] + '–' + weekMatch[3]
        + (weekMatch[4] ? ' ' + translateMonth(weekMatch[4]) : ''));
    }
    weekMatch = trimmed.match(/^Semana del (\d+) al (\d+) de (.+)$/);
    if (weekMatch) {
      return text.replace(trimmed, 'Week of ' + translateMonth(weekMatch[3]) + ' ' + weekMatch[1] + '–' + weekMatch[2]);
    }
    var dateMatch = trimmed.match(/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo) (\d+) de (.+)$/);
    if (dateMatch) {
      return text.replace(trimmed, translate(dateMatch[1]) + ', ' + translateMonth(dateMatch[3]) + ' ' + dateMatch[2]);
    }

    var result = text;
    translationKeys.forEach(function (source) {
      if (source.length > 3 && result.indexOf(source) !== -1) {
        result = result.split(source).join(translations[source]);
      }
    });

    wordKeys.forEach(function (source) {
      var escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp('\\b' + escaped + '\\b', 'g'), wordTranslations[source]);
    });
    result = result.replace(/\bdel\b/g, 'of the').replace(/\bde\b/g, 'of').replace(/\bal\b/g, 'to');
    return result;
  }

  function apply(root) {
    if (!root) return;
    var doc = root.ownerDocument || document;
    if (root.nodeType === 3) {
      if (!originalText.has(root)) originalText.set(root, root.nodeValue);
      var source = originalText.get(root);
      root.nodeValue = currentLanguage === 'en' ? translate(source) : source;
      return;
    }
    var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var textNodes = [];
    while (walker.nextNode()) {
      var node = walker.currentNode;
      var parent = node.parentElement;
      if (parent && !/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/i.test(parent.tagName)) textNodes.push(node);
    }
    textNodes.forEach(function (node) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      var next = currentLanguage === 'en' ? translate(originalText.get(node)) : originalText.get(node);
      if (currentLanguage === 'en' && next === originalText.get(node)) {
        var host = node.parentElement;
        if (host && (host.parentElement && host.parentElement.classList.contains('cal-head')
          || host.tagName === 'TD' && /^[LMXJVSD]$/.test(originalText.get(node).trim()))) {
          var shortDays = { L: 'M', M: 'T', X: 'W', J: 'T', V: 'F', S: 'S', D: 'S' };
          next = shortDays[originalText.get(node).trim()] || next;
        }
      }
      if (node.nodeValue !== next) node.nodeValue = next;
    });

    var elements = root.nodeType === 1 ? [root] : [];
    if (root.querySelectorAll) elements = elements.concat(Array.prototype.slice.call(root.querySelectorAll('*')));
    elements.forEach(function (el) {
      ['placeholder', 'title', 'aria-label'].forEach(function (attr) {
        if (!el.hasAttribute(attr)) return;
        var saved = originalAttributes.get(el) || {};
        if (!Object.prototype.hasOwnProperty.call(saved, attr)) saved[attr] = el.getAttribute(attr);
        originalAttributes.set(el, saved);
        var original = saved[attr];
        var next = currentLanguage === 'en' ? translate(original) : original;
        if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
      });
    });
    if (root === document || root === document.documentElement) {
      document.documentElement.lang = currentLanguage;
    }
  }

  function setLanguage(language) {
    currentLanguage = language === 'en' ? 'en' : 'es';
    localStorage.setItem('alquimia-language', currentLanguage);
    document.documentElement.lang = currentLanguage;
    apply(document.documentElement);
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply(document.documentElement);
    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        if (record.type === 'childList') {
          record.addedNodes.forEach(function (node) {
            if (node.nodeType === 1 || node.nodeType === 3) apply(node);
          });
        } else if (record.type === 'characterData') {
          apply(record.target);
        }
      });
    });
    observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
  });

  window.AlquimiaI18n = {
    t: translate,
    apply: apply,
    getLanguage: function () { return currentLanguage; },
    setLanguage: setLanguage
  };
})();
