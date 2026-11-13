# -*- coding: utf-8 -*-
"""Genera el resto de frames y el paquete final de Stickly."""
import io
import os
import zipfile

from generate_frames import (
    C, H, W, esc, text, rect, circle, path, icon, group,
    status_bar, home_indicator, tab_bar, fab, save, document,
    task_row, chip, sticky, DEFS, ROOT, OUT,
    frame_onboarding, frame_home
)

# ============================================================ 03 NOTES


def frame_notes():
    b = status_bar()
    b += text(20, 108, "Notas", 26, 700, C["text"])
    b += text(20, 129, "5 notas", 12.5, 500, C["muted"])
    b += rect(328, 84, 42, 42, 14, C["surface"], C["line"])
    b += icon("grid", 338, 94, 22, C["text"])

    b += rect(20, 144, 350, 44, 15, C["surface"], C["line"])
    b += icon("search", 32, 157, 18, C["muted"])
    b += text(56, 172, "Buscar notas…", 13.5, 500, "#9A97B0")

    chips = '<g id="Filtros">'
    chips += chip(20, 202, "Todas", True, 74)
    chips += chip(102, 202, "Importante", False, 100)
    chips += chip(210, 202, "Compras", False, 84)
    chips += chip(302, 202, "Claves", False, 70)
    b += chips + "</g>"

    board = '<g id="Tablero_de_notas">'
    board += sticky(20, 250, 170, 176, C["yellow"], "Lista del súper",
                    ["Leche", "Pan", "Café", "Comprar el viernes"], meta="IMPORTANTE")
    board += sticky(202, 250, 168, 152, C["pink"], "Ideas para el blog",
                    ["Ordenar el diario", "15 prompts reales"], meta="IMPORTANTE")
    board += sticky(20, 438, 170, 154, C["blue"], "Claves del wifi",
                    ["Casa: ******", "Oficina: ******"], lock=True, meta="CLAVES")
    board += sticky(202, 414, 168, 190, C["lilac"], "Regalo de mamá",
                    ["Libro de cocina", "Flores", "Llamar el sábado"], meta="IMPORTANTE")
    b += board + "</g>"

    b += fab(696)
    b += tab_bar("notes")
    b += home_indicator()
    save("03-notas.svg", b, "Stickly · Notas")


# ============================================================ 04 NOTE EDITOR


def frame_note_editor():
    b = status_bar()
    b += rect(20, 58, 42, 42, 14, C["surface"], C["line"])
    b += icon("back", 30, 68, 22, C["text"])
    b += text(195, 84, "Nueva nota", 12, 700, C["muted"], "middle")
    b += rect(328, 58, 42, 42, 14, C["surface"], C["line"])
    b += icon("check", 338, 68, 22, C["text"])

    b += text(22, 148, "Lista del súper", 25, 700, C["text"], letter=-0.7)
    segmented = '<g id="Tipo_de_nota">'
    segmented += rect(20, 168, 350, 44, 14, C["primary_light"])
    segmented += rect(24, 172, 169, 36, 10, "#FFFFFF")
    segmented += text(108, 195, "Texto", 12.5, 700, C["primary_dark"], "middle")
    segmented += text(282, 195, "Checklist", 12.5, 700, C["muted"], "middle")
    b += segmented + "</g>"

    b += rect(20, 228, 350, 148, 14, C["surface"], C["line"])
    b += text(34, 256, "Leche, pan y café.", 14, 500, C["text"])
    b += text(34, 278, "Comprar el viernes por la tarde.", 14, 500, C["text"])
    b += text(34, 300, "Revisar si queda detergente.", 14, 500, C["text"])

    b += text(20, 404, "COLOR", 10, 700, C["muted"], letter=0.8)
    swatches = [C["yellow"], C["pink"], C["blue"], C["green"], C["orange"], C["lilac"], C["white_note"]]
    for i, color in enumerate(swatches):
        cx = 20 + i * 44
        b += circle(cx + 17, 438, 17.5, color, "#FFFFFF" if i != 2 else C["primary"], 3 if i == 2 else 2)

    b += text(20, 488, "CATEGORÍA", 10, 700, C["muted"], letter=0.8)
    b += rect(20, 500, 350, 48, 14, C["surface"], C["line"])
    b += text(34, 530, "Importante", 13.5, 500, C["text"])
    b += icon("chevron-down", 340, 514, 18, C["muted"])

    b += text(20, 580, "IMAGEN DE LA NOTA", 10, 700, C["muted"], letter=0.8)
    b += rect(20, 592, 350, 70, 15, "rgba(255,255,255,.6)", "#CFCCE4", 1.5)
    b += icon("image", 166, 615, 20, C["muted"])
    b += text(194, 630, "Añadir imagen", 12.5, 600, C["muted"])

    b += rect(20, 682, 350, 62, 16, C["surface"], C["line"])
    b += rect(32, 698, 32, 32, 11, C["primary_light"])
    b += icon("unlock", 41, 707, 14, C["primary"])
    b += text(76, 708, "Nota privada", 13, 700, C["text"])
    b += text(76, 724, "Proteger con PIN", 10.5, 500, C["muted"])
    b += rect(320, 698, 40, 24, 12, "#D9D7EA")
    b += circle(330, 710, 9, "#FFFFFF")

    b += rect(20, 762, 350, 46, 15, "url(#gradPrimary)")
    b += text(195, 791, "Guardar", 14, 700, "#FFFFFF", "middle")
    b += home_indicator()
    save("04-editor-nota.svg", b, "Stickly · Editor de nota")


# ============================================================ 05 CALENDAR


def frame_calendar():
    b = status_bar()
    b += text(20, 108, "Calendario", 26, 700, C["text"])
    b += text(20, 129, "6 tareas", 12.5, 500, C["muted"])
    b += rect(304, 84, 66, 34, 12, C["surface"], C["line"])
    b += text(337, 106, "Hoy", 12, 700, C["muted"], "middle")

    b += rect(20, 146, 350, 330, 22, C["surface"], C["line"])
    b += rect(34, 156, 30, 30, 10, C["primary_light"])
    b += icon("chevron-left", 41, 163, 16, C["primary"])
    b += text(195, 176, "Noviembre de 2026", 17, 700, C["text"], "middle", letter=-0.3)
    b += rect(326, 156, 30, 30, 10, C["primary_light"])
    b += icon("chevron-right", 333, 163, 16, C["primary"])

    dows = ["L", "M", "X", "J", "V", "S", "D"]
    for i, d in enumerate(dows):
        b += text(49 + i * 48, 212, d, 9.5, 700, "#6E6B89", "middle", letter=0.5)

    days = list(range(1, 31))
    for idx, day in enumerate(days):
        pos = idx + 5  # 1 de noviembre de 2026 cae en domingo
        row = pos // 7
        col = pos % 7
        if row > 5:
            continue
        cx = 49 + col * 48
        cy = 236 + row * 39
        sel = day == 12
        if sel:
            b += circle(cx, cy - 4, 17, C["primary"])
        color = "#FFFFFF" if sel else C["text"]
        b += text(cx, cy, str(day), 12.5, 600, color, "middle")
        if day in (3, 12, 18, 24):
            b += circle(cx, cy + 11, 2, "#FFFFFF" if sel else C["primary"])
    for i in range(5):
        cx = 49 + i * 48
        b += text(cx, 236, str(26 + i), 12.5, 500, "#6E6B89", "middle", opacity=0.7)

    b += text(20, 510, "Jueves, 12 de noviembre", 15, 700, C["text"])
    b += rect(328, 492, 34, 34, 12, C["surface"], C["line"])
    b += icon("plus", 337, 501, 16, C["text"])

    b += task_row(20, 530, 350, "Entregar ensayo", "Literatura")
    b += icon("edit", 342, 538, 17, C["muted"])
    b += task_row(20, 584, 350, "Estudiar biología", "Examen el viernes")
    b += icon("edit", 342, 592, 17, C["muted"])

    b += fab(696)
    b += tab_bar("calendar")
    b += home_indicator()
    save("05-calendario.svg", b, "Stickly · Calendario")


# ============================================================ 06 NOTEBOOKS


def frame_notebooks():
    b = status_bar()
    b += text(20, 108, "Cuadernos", 26, 700, C["text"])
    b += text(20, 129, "4 notas de voz y texto", 12.5, 500, C["muted"])

    cards = [
        ("Biología", "2 notas", C["green"], 20, 150),
        ("Historia", "1 nota", C["pink"], 202, 150),
        ("Recetas", "3 notas", C["orange"], 20, 305),
        ("Viaje", "Sin notas", C["blue"], 202, 305),
    ]
    nb = '<g id="Cuadernos">'
    for i, (title, count, color, x, y) in enumerate(cards):
        nb += f'<clipPath id="clipNb{i}"><rect x="{x}" y="{y}" width="168" height="142" rx="20"/></clipPath>'
        nb += rect(x, y, 168, 142, 20, C["surface"], C["line"])
        nb += f'<g clip-path="url(#clipNb{i})">' + circle(x + 150, y + 18, 48, color, opacity=0.7) + '</g>' 
        nb += rect(x + 16, y + 16, 40, 40, 13, color)
        nb += icon("book", x + 26, y + 26, 20, "#4C4775")
        nb += text(x + 16, y + 88, title, 14.5, 700, C["text"], letter=-0.2)
        nb += text(x + 16, y + 106, count, 11, 600, C["muted"])
    b += nb + "</g>"

    b += rect(20, 470, 350, 92, 20, "url(#gradHero)")
    b += icon("mic", 36, 490, 28, C["primary"])
    b += text(76, 500, "Notas de voz", 15, 700, C["text"])
    b += text(76, 520, "Graba una idea antes de que se escape.", 11.5, 500, C["muted"])
    b += rect(290, 494, 60, 34, 12, "#FFFFFF")
    b += text(320, 516, "Grabar", 11, 700, C["primary"], "middle")

    b += fab(696)
    b += tab_bar("notebooks")
    b += home_indicator()
    save("06-cuadernos.svg", b, "Stickly · Cuadernos")


# ============================================================ 07 NOTEBOOK


def frame_notebook():
    b = status_bar()
    b += rect(20, 54, 42, 42, 14, C["surface"], C["line"])
    b += icon("back", 30, 64, 22, C["text"])
    b += text(195, 80, "Cuaderno", 12, 700, C["muted"], "middle")
    b += rect(300, 54, 34, 34, 11, C["surface"], C["line"])
    b += icon("edit", 308, 62, 18, C["text"])
    b += rect(340, 54, 34, 34, 11, C["surface"], C["line"])
    b += icon("trash", 348, 62, 18, C["text"], 1.6)

    b += rect(20, 112, 350, 100, 22, C["green"])
    b += '<clipPath id="clipNbHero"><rect x="20" y="112" width="350" height="100" rx="22"/></clipPath>'
    b += '<g clip-path="url(#clipNbHero)">' + circle(352, 100, 60, "#FFFFFF", opacity=0.4) + '</g>' 
    b += text(38, 152, "Biología", 22, 700, "#3C3760", letter=-0.6)
    b += text(38, 174, "2 notas", 11.5, 600, "#3C3760", opacity=0.72)
    b += text(38, 194, "Profesora Marín · 2026", 10.5, 600, "#3C3760", opacity=0.5)

    note1 = '<g id="Nota_mitosis">'
    note1 += rect(20, 236, 350, 140, 17, C["surface"], C["line"])
    note1 += text(34, 262, "Mitosis", 14, 700, C["text"])
    note1 += icon("edit", 340, 250, 16, C["muted"])
    note1 += text(34, 284, "Fases: profase, metafase, anafase y telofase.", 12.5, 500, C["muted"])
    note1 += text(34, 304, "La célula se divide en dos células hijas.", 12.5, 500, C["muted"])
    note1 += rect(34, 318, 302, 38, 10, C["bg"])
    note1 += circle(50, 337, 12, C["primary"])
    note1 += path("M47 332l7 5-7 5z", fill="#FFFFFF")
    for i, h in enumerate([5, 10, 14, 8, 6, 12, 9, 4, 11, 7, 13, 6]):
        note1 += rect(70 + i * 9, 337 - h / 2, 3, h, 1.5, C["primary"], opacity=0.55)
    note1 += text(34, 366, "12 nov · 0:24", 9.5, 600, "#6E6B89")
    b += note1 + "</g>"

    note2 = '<g id="Nota_repaso">'
    note2 += rect(20, 392, 350, 120, 17, C["surface"], C["line"])
    note2 += text(34, 418, "Repaso para el examen", 14, 700, C["text"])
    note2 += text(34, 440, "Preguntas: fotosíntesis, respiración celular", 12.5, 500, C["muted"])
    note2 += text(34, 460, "y diferencias entre célula animal y vegetal.", 12.5, 500, C["muted"])
    note2 += text(34, 488, "11 nov", 9.5, 600, "#6E6B89")
    b += note2 + "</g>"

    b += fab(756, "Boton_flotante")
    b += home_indicator()
    save("07-cuaderno.svg", b, "Stickly · Detalle del cuaderno")


# ============================================================ 08 VAULT LOCKED


def frame_vault_locked():
    b = status_bar()
    b += text(20, 108, "Contraseñas", 26, 700, C["text"])
    b += rect(150, 190, 90, 90, 28, "url(#gradHero)")
    b += icon("lock", 174, 214, 42, C["primary"], 1.6)
    b += text(195, 320, "Este contenido está protegido", 21, 700, C["text"], "middle", letter=-0.4)
    b += text(195, 350, "Escribe tu PIN para desbloquear tus", 13.5, 500, C["muted"], "middle")
    b += text(195, 370, "contraseñas y notas privadas.", 13.5, 500, C["muted"], "middle")
    b += rect(55, 402, 280, 50, 16, "url(#gradPrimary)")
    b += text(195, 433, "Desbloquear", 14, 700, "#FFFFFF", "middle")
    b += rect(20, 480, 350, 66, 18, C["surface"], C["line"])
    b += rect(34, 494, 38, 38, 12, C["primary_light"])
    b += icon("shield", 43, 503, 20, C["primary"])
    b += text(84, 510, "Cifrado con AES-256.", 12.5, 700, C["text"])
    b += text(84, 528, "Tu PIN no se guarda en el dispositivo.", 10.5, 500, C["muted"])
    b += tab_bar("menu")
    b += home_indicator()
    save("08-boveda-bloqueada.svg", b, "Stickly · Bóveda bloqueada")


# ============================================================ 09 VAULT


def pw_row(y, title, user, color, initial):
    b = rect(20, y, 350, 64, 16, C["surface"], C["line"])
    b += rect(32, y + 11, 42, 42, 14, color)
    b += text(53, y + 39, initial, 16, 700, "#464174", "middle")
    b += text(86, y + 30, title, 13.5, 700, C["text"])
    b += text(86, y + 47, user, 11.5, 500, C["muted"])
    b += icon("copy", 296, y + 22, 18, C["primary"])
    b += icon("chevron-right", 330, y + 22, 18, "#B8B5C8")
    return group("Contrasena_" + title.replace(" ", "_"), b)


def frame_vault():
    b = status_bar()
    b += text(20, 108, "Contraseñas", 26, 700, C["text"])
    b += text(20, 129, "3 contraseñas", 12.5, 500, C["muted"])
    b += rect(328, 84, 42, 42, 14, C["surface"], C["line"])
    b += icon("lock", 338, 94, 22, C["text"])

    b += rect(20, 146, 350, 44, 15, C["surface"], C["line"])
    b += icon("search", 32, 159, 18, C["muted"])
    b += text(56, 174, "Buscar…", 13.5, 500, "#9A97B0")

    b += pw_row(204, "Correo", "isabel@ejemplo.com", C["primary_light"], "C")
    b += pw_row(276, "Banco", "isabel", C["pink"], "B")
    b += pw_row(348, "Notion", "isabel@ejemplo.com", C["blue"], "N")

    b += rect(20, 436, 350, 82, 18, C["surface"], C["line"])
    b += icon("shield", 34, 454, 22, C["primary"])
    b += text(68, 468, "Tus claves están cifradas", 12.5, 700, C["text"])
    b += text(68, 486, "Solo se muestran con la sesión desbloqueada.", 10.5, 500, C["muted"])
    b += text(68, 502, "El PIN nunca se guarda.", 10.5, 500, C["muted"])

    b += fab(650)
    b += tab_bar("menu")
    b += home_indicator()
    save("09-boveda.svg", b, "Stickly · Bóveda")


# ============================================================ 10 TIMER


def frame_timer():
    b = status_bar()
    b += text(20, 108, "Cronómetro", 26, 700, C["text"])
    b += text(20, 129, "Estudio · 25 minutos", 12.5, 500, C["muted"])
    b += rect(260, 84, 110, 30, 15, C["primary_light"])
    b += icon("sparkles", 272, 91, 15, C["primary_dark"])
    b += text(294, 103, "Estudio", 11, 700, C["primary_dark"])

    cx, cy, r = 195, 340, 140
    b += circle(cx, cy, r, "none", C["primary_light"], 26)
    b += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="url(#gradPrimary)" stroke-width="26" stroke-linecap="round" stroke-dasharray="660 880" transform="rotate(-90 {cx} {cy})"/>'
    b += text(cx, cy + 6, "18:42", 58, 700, C["primary_dark"], "middle", letter=0.5)
    b += text(cx, cy + 40, "ESTUDIO", 11, 700, C["muted"], "middle", letter=1)

    b += circle(112, 540, 31, C["surface"], C["line"])
    b += icon("reset", 100, 528, 24, C["primary"])
    b += circle(195, 540, 31, "url(#gradPrimary)")
    b += icon("pause", 183, 528, 24, "#FFFFFF", 2)
    b += circle(278, 540, 31, C["surface"], C["line"])
    b += icon("arrow-right", 266, 528, 24, C["primary"])

    b += text(195, 620, "3", 26, 700, C["primary_dark"], "middle")
    b += text(195, 640, "ciclos completados", 11, 600, C["muted"], "middle")

    b += chip(88, 672, "Estudio", True, 100)
    b += chip(198, 672, "Descanso", False, 104)
    b += tab_bar("home")
    b += home_indicator()
    save("10-cronometro.svg", b, "Stickly · Cronómetro")


# ============================================================ 11 MENU


def menu_row(y, ic, label, value=None, tone=None):
    b = rect(20, y, 350, 48, 16, C["surface"], C["line"])
    b += rect(32, y + 7, 34, 34, 11, tone or C["primary_light"])
    b += icon(ic, 41, y + 16, 16, C["primary"] if not tone else C["primary_dark"])
    b += text(78, y + 29, label, 13.5, 600, C["text"])
    if value:
        b += text(330, y + 29, value, 11.5, 600, C["muted"], "end")
    else:
        b += icon("chevron-right", 334, y + 15, 18, "#B8B5C8")
    return group("Fila_" + label.replace(" ", "_"), b)


def frame_menu():
    b = status_bar()
    b += text(20, 108, "Menú", 26, 700, C["text"])

    b += rect(20, 132, 350, 104, 24, "url(#gradHero)")
    b += '<clipPath id="clipMenu"><rect x="20" y="132" width="350" height="104" rx="24"/></clipPath>'
    b += '<g clip-path="url(#clipMenu)">' + circle(352, 120, 64, "#FFFFFF", opacity=0.45) + '</g>' 
    b += rect(36, 152, 58, 58, 19, "#FFFFFF")
    b += text(65, 190, "I", 22, 700, C["primary"], "middle")
    b += text(110, 176, "Isabel", 19, 700, C["text"], letter=-0.3)
    b += text(110, 195, "Stickly · Alquimia Lab", 11.5, 500, "#5C5980")
    b += icon("chevron-right", 338, 174, 18, C["muted"])

    rows = [
        ("note", "Notas"),
        ("calendar", "Calendario"),
        ("book", "Cuadernos"),
        ("key", "Contraseñas"),
        ("timer", "Cronómetro"),
    ]
    y = 252
    for ic, label in rows:
        b += menu_row(y, ic, label)
        y += 54

    b += text(22, 548, "CONFIGURACIÓN", 10, 700, C["muted"], letter=1)
    b += menu_row(564, "user", "Perfil")
    b += menu_row(618, "settings", "Ajustes")
    b += menu_row(672, "globe", "Idioma", "Español")

    b += text(195, 748, "Stickly 1.0.0 · Hecho por Alquimia Lab", 10.5, 500, "#8A87A1", "middle")
    b += tab_bar("menu")
    b += home_indicator()
    save("11-menu.svg", b, "Stickly · Menú")


# ============================================================ 12 SETTINGS


def setting_row(y, ic, label, value=None, danger=False, sub=None):
    h = 46 if not sub else 54
    b = rect(20, y, 350, h, 14, "#FFFFFF", C["line"])
    b += icon(ic, 34, y + 14, 18, C["danger"] if danger else C["primary"])
    b += text(62, y + (28 if not sub else 25), label, 12.5, 600, C["danger"] if danger else C["text"])
    if sub:
        b += text(62, y + 41, sub, 10, 500, C["muted"])
    if value:
        b += text(330, y + 28, value, 11, 600, C["muted"], "end")
    else:
        b += icon("chevron-right", 334, y + 14, 17, "#B8B5C8")
    return group("Ajuste_" + label.replace(" ", "_"), b)


def frame_settings():
    b = status_bar()
    b += rect(20, 54, 42, 42, 14, C["surface"], C["line"])
    b += icon("back", 30, 64, 22, C["text"])
    b += text(195, 80, "Ajustes", 12, 700, C["muted"], "middle")

    b += text(22, 130, "IDIOMA", 10, 700, C["muted"], letter=1)
    langs = ["Español", "English", "Français", "Italiano", "Português", "Deutsch", "日本語", "简体中文", "한국어"]
    for i, lang in enumerate(langs):
        col = i % 2
        row = i // 2
        x = 20 + col * 178
        y = 144 + row * 44
        active = i == 0
        b += rect(x, y, 172, 38, 11, C["primary"] if active else "#FBFAFF", C["primary"] if active else C["line"])
        b += text(x + 12, y + 24, lang, 11.5, 600, "#FFFFFF" if active else C["text"])
        if active:
            b += icon("check", x + 150, y + 12, 15, "#FFFFFF", 2.4)

    b += text(22, 396, "SEGURIDAD", 10, 700, C["muted"], letter=1)
    b += setting_row(410, "lock", "PIN de 6 dígitos", "Activo")
    b += setting_row(462, "key", "Cambiar PIN")
    b += setting_row(514, "clock", "Bloqueo automático", "5 min")

    b += text(22, 590, "DATOS", 10, 700, C["muted"], letter=1)
    b += setting_row(604, "download", "Exportar copia", sub="Guarda esta copia en un lugar seguro.")
    b += setting_row(664, "upload", "Importar copia")
    b += setting_row(716, "trash", "Borrar todos los datos", danger=True)

    b += text(195, 800, "Stickly · Alquimia Lab · 1.0.0", 10, 500, "#8A87A1", "middle")
    b += home_indicator()
    save("12-ajustes.svg", b, "Stickly · Ajustes")


# ============================================================ 13 PIN


def frame_pin():
    b = status_bar()
    b += rect(20, 58, 28, 28, 9, "url(#gradPrimary)")
    b += text(34, 77, "S", 14, 700, "#FFFFFF", "middle")
    b += text(56, 77, "Stickly", 13, 700, C["primary_dark"])
    b += icon("close", 344, 62, 22, C["muted"])

    b += rect(162, 150, 66, 66, 21, C["primary_light"])
    b += icon("lock", 180, 168, 30, C["primary"], 1.7)

    b += text(195, 258, "Escribe tu PIN", 21, 700, C["text"], "middle", letter=-0.4)
    b += text(195, 284, "Desbloquea tus contraseñas y notas privadas.", 12.5, 500, C["muted"], "middle")

    for i in range(6):
        on = i < 3
        b += circle(136 + i * 24, 324, 6.5, C["primary"] if on else C["bg"], "#B9B6D1" if not on else C["primary"], 1.6)
    b += text(195, 356, "PIN incorrecto · Espera 30 s", 11.5, 600, C["danger"], "middle")

    keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"]
    for i, key in enumerate(keys):
        col = i % 3
        row = i // 3
        x = 55 + col * 98
        y = 392 + row * 68
        if key == "":
            continue
        if key == "back":
            b += icon("back", x + 20, y + 16, 22, C["muted"])
        else:
            b += rect(x, y, 56, 56, 17, C["surface"], C["line"])
            b += text(x + 28, y + 37, key, 21, 600, C["text"], "middle")

    b += text(195, 700, "¿Olvidaste tu PIN? Restablecer Stickly", 12, 600, C["primary"], "middle")
    b += text(195, 728, "Cifrado con AES-256. Tu PIN no se guarda.", 10, 500, "#8A87A1", "middle")
    b += home_indicator()
    save("13-pin.svg", b, "Stickly · PIN")


# ============================================================ 14 TASK SHEET


def frame_task_sheet():
    b = status_bar()
    b += text(20, 96, "BUENAS TARDES", 10.5, 700, C["muted"], letter=1)
    b += text(20, 126, "Isabel", 27, 700, C["text"])
    b += rect(20, 168, 350, 238, 26, "url(#gradHero)")
    b += text(38, 202, "HOY", 10.5, 700, C["muted"], letter=1)
    b += text(38, 226, "Cosas que debes hacer hoy", 18, 700, C["text"])
    b += task_row(36, 244, 318, "Entregar ensayo", "Literatura")
    b += task_row(36, 296, 318, "Estudiar biología", "Examen el viernes")
    b += rect(0, 0, W, H, 0, "#1C1B32", opacity=0.46)

    b += rect(0, 402, W, 442, 26, C["bg"])
    b += rect(174, 412, 42, 4, 2, "#D8D5E8")
    b += text(20, 452, "Nueva tarea", 19, 700, C["text"], letter=-0.3)
    b += text(20, 472, "Jueves, 12 de noviembre", 12, 500, C["muted"])

    b += text(20, 506, "TÍTULO", 10, 700, C["muted"], letter=0.8)
    b += rect(20, 518, 350, 46, 14, C["surface"], C["line"])
    b += text(34, 547, "Entregar ensayo", 13.5, 500, C["text"])

    b += text(20, 592, "MATERIA", 10, 700, C["muted"], letter=0.8)
    b += rect(20, 604, 350, 46, 14, C["surface"], C["line"])
    b += text(34, 633, "Literatura", 13.5, 500, C["text"])

    b += text(20, 678, "FECHA", 10, 700, C["muted"], letter=0.8)
    b += rect(20, 690, 350, 46, 14, C["surface"], C["line"])
    b += text(34, 719, "2026-11-12", 13.5, 500, C["text"])
    b += icon("calendar", 338, 704, 18, C["muted"])

    b += rect(20, 758, 90, 46, 14, C["danger_bg"])
    b += text(65, 787, "Eliminar", 12, 700, C["danger"], "middle")
    b += rect(118, 758, 118, 46, 14, C["surface"], C["line"])
    b += text(177, 787, "Cancelar", 12, 700, C["text"], "middle")
    b += rect(244, 758, 126, 46, 14, "url(#gradPrimary)")
    b += text(307, 787, "Guardar", 12, 700, "#FFFFFF", "middle")
    b += home_indicator()
    save("14-hoja-tarea.svg", b, "Stickly · Nueva tarea")


# ============================================================ 15 PROFILE


def frame_profile():
    b = status_bar()
    b += rect(20, 54, 42, 42, 14, C["surface"], C["line"])
    b += icon("back", 30, 64, 22, C["text"])
    b += text(195, 80, "Perfil", 12, 700, C["muted"], "middle")

    b += rect(20, 118, 350, 104, 24, "url(#gradHero)")
    b += rect(36, 138, 64, 64, 21, "#FFFFFF")
    b += text(68, 178, "I", 26, 700, C["primary"], "middle")
    b += text(116, 164, "Isabel", 19, 700, C["text"])
    b += text(116, 184, "Stickly · Alquimia Lab", 11.5, 500, "#5C5980")

    b += text(20, 258, "NOMBRE", 10, 700, C["muted"], letter=0.8)
    b += rect(20, 270, 350, 46, 14, C["surface"], C["line"])
    b += text(34, 299, "Isabel", 13.5, 500, C["text"])
    b += rect(20, 326, 350, 46, 15, "url(#gradPrimary)")
    b += text(195, 355, "Guardar", 13.5, 700, "#FFFFFF", "middle")

    b += text(20, 404, "RESUMEN", 10, 700, C["muted"], letter=0.8)
    stats = [("5", "NOTAS"), ("2", "PENDIENTES"), ("2", "CUADERNOS"), ("3", "CONTRASEÑAS")]
    for i, (num, lab) in enumerate(stats):
        col = i % 2
        row = i // 2
        x = 20 + col * 178
        y = 418 + row * 82
        b += rect(x, y, 172, 72, 17, C["surface"], C["line"])
        b += text(x + 16, y + 32, num, 23, 700, C["primary_dark"])
        b += text(x + 16, y + 50, lab, 9.5, 700, C["muted"], letter=0.5)

    b += rect(20, 604, 350, 74, 18, C["surface"], C["line"])
    b += rect(34, 620, 40, 40, 12, C["primary_light"])
    b += icon("shield", 43, 629, 20, C["primary"])
    b += text(86, 636, "PIN activo", 13, 700, C["text"])
    b += text(86, 654, "Tus contraseñas y notas privadas están cifradas.", 10.5, 500, C["muted"])
    b += text(20, 714, "Tus datos se quedan en este dispositivo.", 10.5, 500, "#8A87A1")

    b += tab_bar("menu")
    b += home_indicator()
    save("15-perfil.svg", b, "Stickly · Perfil")


FRAMES = [
    ("01-onboarding.svg", "Bienvenida", "Primer arranque y creación de PIN"),
    ("02-home.svg", "Inicio", "Saludo, tareas de hoy, accesos rápidos y notas"),
    ("03-notas.svg", "Notas", "Tablero de post-its, búsqueda y filtros"),
    ("04-editor-nota.svg", "Editor de nota", "Texto/checklist, color, categoría e imagen"),
    ("05-calendario.svg", "Calendario", "Mes, día seleccionado y tareas"),
    ("06-cuadernos.svg", "Cuadernos", "Listado y acceso a notas de voz"),
    ("07-cuaderno.svg", "Cuaderno", "Detalle con notas de voz"),
    ("08-boveda-bloqueada.svg", "Bóveda bloqueada", "Puerta de PIN"),
    ("09-boveda.svg", "Bóveda", "Contraseñas desbloqueadas"),
    ("10-cronometro.svg", "Cronómetro", "Pomodoro de estudio y descanso"),
    ("11-menu.svg", "Menú", "Perfil y navegación secundaria"),
    ("12-ajustes.svg", "Ajustes", "Idioma, seguridad, datos y copia"),
    ("13-pin.svg", "PIN", "Teclado de 6 dígitos"),
    ("14-hoja-tarea.svg", "Nueva tarea", "Hoja inferior sobre inicio"),
    ("15-perfil.svg", "Perfil", "Nombre y resumen"),
]

README = """# Stickly · frames para Figma

15 frames SVG de **390 × 844 px** con el diseño de la PWA de Stickly, listos para editar en Figma.

## Cómo usarlos

1. Descomprime `Stickly-Figma-frames.zip`.
2. En Figma: **Archivo → Importar** y elige los `.svg`, o arrástralos directamente al lienzo.
3. Cada SVG se convierte en un frame con capas nombradas (header, tarjetas, botones, textos...).
4. Instala la fuente **Roboto** desde Google Fonts para que los textos se vean igual.
5. Los colores y medidas están abajo y también dentro de cada SVG.

## Medidas base

- Frame: 390 × 844 px
- Márgenes laterales: 20 px
- Radio de tarjetas: 18–26 px
- Barra inferior: 74 px de alto
- Colores: `#6463AA` primario, `#4A4990` primario oscuro, `#EDECF8` lavanda claro,
  `#F8F7FB` fondo, `#2A2A3E` texto, `#6A6788` texto suave, `#E8E6F4` bordes.

## Frames incluidos

01 Bienvenida · 02 Inicio · 03 Notas · 04 Editor de nota · 05 Calendario ·
06 Cuadernos · 07 Cuaderno · 08 Bóveda bloqueada · 09 Bóveda · 10 Cronómetro ·
11 Menú · 12 Ajustes · 13 PIN · 14 Nueva tarea · 15 Perfil

También puedes regenerarlos con `python generate_frames.py` y `python generate_extra.py`.
"""


def build_index():
    cards = ""
    for filename, title, desc in FRAMES:
        cards += (
            f'\n      <article class="card"><div class="shot"><img src="frames/{filename}" '
            f'alt="{esc(title)}" loading="lazy"></div><h2>{esc(title)}</h2>'
            f'<p>{esc(desc)}</p><code>{filename}</code></article>'
        )
    html = f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stickly · Frames para Figma</title>
<style>
  :root {{ --bg:#F8F7FB; --surface:#fff; --text:#2A2A3E; --muted:#6A6788; --line:#E8E6F4; --primary:#6463AA; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; padding:32px 24px 60px; font-family:Roboto,Arial,sans-serif; color:var(--text);
    background:radial-gradient(900px 500px at 100% -10%,#E6E4F6,transparent 60%),var(--bg); }}
  header {{ max-width:1180px; margin:0 auto 28px; }}
  h1 {{ margin:0 0 6px; font-size:30px; letter-spacing:-.5px; }}
  header p {{ margin:0; color:var(--muted); font-size:14px; line-height:1.6; max-width:760px; }}
  .grid {{ max-width:1180px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:22px; }}
  .card {{ background:var(--surface); border:1px solid var(--line); border-radius:20px; padding:14px;
    box-shadow:0 6px 22px rgba(90,88,160,.08); }}
  .shot {{ border-radius:16px; overflow:hidden; background:var(--bg); }}
  .shot img {{ display:block; width:100%; height:auto; }}
  h2 {{ font-size:15px; margin:12px 4px 2px; }}
  .card p {{ margin:0 4px 8px; font-size:11.5px; color:var(--muted); line-height:1.5; min-height:34px; }}
  code {{ display:block; margin:0 4px 2px; font-size:10px; color:#9A97B0; }}
</style>
</head>
<body>
<header>
  <h1>Stickly · frames para Figma</h1>
  <p>15 frames SVG de 390 × 844 px, con capas nombradas y textos editables. Importa los archivos en Figma
  (Archivo → Importar) o arrástralos al lienzo. Tipografía recomendada: Roboto (Google Fonts).</p>
</header>
<main class="grid">{cards}
</main>
</body>
</html>
'''
    with io.open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(html)


def build_zip():
    zip_path = os.path.join(ROOT, "Stickly-Figma-frames.zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for filename, _, _ in FRAMES:
            zf.write(os.path.join(OUT, filename), "stickly-frames/" + filename)
        zf.write(os.path.join(ROOT, "README.md"), "stickly-frames/README.md")
    return zip_path


def main():
    frame_onboarding()
    frame_home()
    frame_notes()
    frame_note_editor()
    frame_calendar()
    frame_notebooks()
    frame_notebook()
    frame_vault_locked()
    frame_vault()
    frame_timer()
    frame_menu()
    frame_settings()
    frame_pin()
    frame_task_sheet()
    frame_profile()
    with io.open(os.path.join(ROOT, "README.md"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(README)
    build_index()
    build_zip()
    print("extra frames ok")


if __name__ == "__main__":
    main()
