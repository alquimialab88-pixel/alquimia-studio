# -*- coding: utf-8 -*-
"""
Genera los frames SVG de Stickly listos para importar en Figma.
Cada archivo es un frame de 390 px de ancho, con capas nombradas y textos editables.
"""
import io
import os
import re
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "frames")
SPRITE = r"C:\Users\Isabel\Documents\Default Project\alquimialab-web\stickly\index.html"

os.makedirs(OUT, exist_ok=True)

W = 390
H = 844

C = {
    "primary": "#6463AA",
    "primary_dark": "#4A4990",
    "primary_light": "#EDECF8",
    "primary_soft": "#DCDBF2",
    "bg": "#F8F7FB",
    "surface": "#FFFFFF",
    "text": "#2A2A3E",
    "muted": "#6A6788",
    "line": "#E8E6F4",
    "danger": "#DC2626",
    "danger_bg": "#FEE2E2",
    "green": "#BBF7D0",
    "green_dark": "#1B7A46",
    "yellow": "#FEF08A",
    "pink": "#FBCFE8",
    "blue": "#BAE6FD",
    "orange": "#FED7AA",
    "lilac": "#E9D5FF",
    "white_note": "#F8FAFC",
    "lavender2": "#D7D3F3",
}

FONT = "Quicksand, Nunito, Arial, sans-serif"

# Iconos del sprite de la PWA
sprite = io.open(SPRITE, encoding="utf-8").read()
ICONS = dict(re.findall(r'<symbol id="i-([^"]+)" viewBox="0 0 24 24">(.*?)</symbol>', sprite, re.S))


def esc(value):
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def text(x, y, value, size=13, weight=500, fill=None, anchor="start", opacity=None,
         family=FONT, letter=None, id=None):
    attrs = [
        f'x="{x}"', f'y="{y}"', f'font-family="{family}"', f'font-size="{size}"',
        f'font-weight="{weight}"', f'fill="{fill or C["text"]}"'
    ]
    if anchor != "start":
        attrs.append(f'text-anchor="{anchor}"')
    if opacity is not None:
        attrs.append(f'opacity="{opacity}"')
    if letter is not None:
        attrs.append(f'letter-spacing="{letter}"')
    if id:
        attrs.append(f'id="{id}"')
    return f'<text {" ".join(attrs)}>{esc(value)}</text>'


def rect(x, y, w, h, r=0, fill=None, stroke=None, sw=1, opacity=None, id=None):
    attrs = [f'x="{x}"', f'y="{y}"', f'width="{w}"', f'height="{h}"']
    if r:
        attrs.append(f'rx="{r}"')
    attrs.append(f'fill="{fill or "none"}"')
    if stroke:
        attrs.append(f'stroke="{stroke}" stroke-width="{sw}"')
    if opacity is not None:
        attrs.append(f'opacity="{opacity}"')
    if id:
        attrs.append(f'id="{id}"')
    return f'<rect {" ".join(attrs)}/>'


def circle(cx, cy, r, fill=None, stroke=None, sw=1, opacity=None, id=None):
    attrs = [f'cx="{cx}"', f'cy="{cy}"', f'r="{r}"', f'fill="{fill or "none"}"']
    if stroke:
        attrs.append(f'stroke="{stroke}" stroke-width="{sw}"')
    if opacity is not None:
        attrs.append(f'opacity="{opacity}"')
    if id:
        attrs.append(f'id="{id}"')
    return f'<circle {" ".join(attrs)}/>'


def path(d, fill="none", stroke=None, sw=1.8, opacity=None, cap="round", join="round", id=None):
    attrs = [f'd="{d}"', f'fill="{fill}"']
    if stroke:
        attrs.append(f'stroke="{stroke}" stroke-width="{sw}" stroke-linecap="{cap}" stroke-linejoin="{join}"')
    if opacity is not None:
        attrs.append(f'opacity="{opacity}"')
    if id:
        attrs.append(f'id="{id}"')
    return f'<path {" ".join(attrs)}/>'


def icon(name, x, y, size=22, color=None, sw=1.8, opacity=None, id=None):
    inner = ICONS.get(name, "")
    attrs = [f'transform="translate({x} {y}) scale({size / 24:.4f})"',
             f'fill="none"', f'stroke="{color or C["text"]}"', f'stroke-width="{sw}"',
             'stroke-linecap="round"', 'stroke-linejoin="round"']
    if opacity is not None:
        attrs.append(f'opacity="{opacity}"')
    if id:
        attrs.append(f'id="{id}"')
    return f'<g {" ".join(attrs)}>{inner}</g>'


def group(id, body):
    return f'<g id="{id}">{body}</g>'


def status_bar():
    body = text(28, 38, "9:41", 15, 700, C["text"])
    # señal
    for i, h in enumerate([4, 6, 9, 12]):
        body += rect(305 + i * 6, 32 - h, 3.5, h, 1, C["text"])
    # wifi
    body += path("M331 29c3-3 8-3 11 0M334 33c2-2 5-2 7 0M337.5 36.5h.01", stroke=C["text"], sw=1.8)
    # batería
    body += rect(350, 26, 21, 11, 3.2, "none", C["text"], 1.2)
    body += rect(352.5, 28.5, 14, 6, 1.6, C["text"])
    body += rect(372, 29.5, 2, 4, 1, C["text"])
    return group("Barra_de_estado", body)


def home_indicator():
    return rect(135, 827, 120, 5, 2.5, C["text"], opacity=0.22, id="Indicador_de_inicio")


def tab_bar(active="home"):
    tabs = [
        ("home", "home", "Inicio"),
        ("note", "notes", "Notas"),
        ("calendar", "calendar", "Calendario"),
        ("book", "notebooks", "Cuadernos"),
        ("menu", "menu", "Menú"),
    ]
    body = rect(0, 770, W, 74, 0, C["surface"])
    body += rect(0, 770, W, 1, 0, C["line"])
    for i, (ic, key, label) in enumerate(tabs):
        cx = 39 + i * 78
        on = key == active
        if on:
            body += rect(cx - 27, 778, 54, 46, 14, C["primary_light"])
        color = C["primary_dark"] if on else "#736F8C"
        body += icon(ic, cx - 11, 785, 22, color, 1.7)
        body += text(cx, 820, label, 10.5, 700, color, "middle")
    return group("Barra_inferior", body)


def fab(y=696, id="Boton_flotante"):
    body = rect(314, y, 58, 58, 20, "url(#gradPrimary)")
    body += icon("plus", 329, y + 15, 28, "#FFFFFF", 2)
    return group(id, body)


DEFS = """
<defs>
  <linearGradient id="gradPrimary" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7876C6"/><stop offset="1" stop-color="#56549B"/>
  </linearGradient>
  <linearGradient id="gradHero" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#EDECF8"/><stop offset=".6" stop-color="#DCDBF2"/><stop offset="1" stop-color="#D7D3F3"/>
  </linearGradient>
  <linearGradient id="gradAvatar" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#8B89D9"/><stop offset="1" stop-color="#6463AA"/>
  </linearGradient>
  <radialGradient id="gradBg1" cx="1" cy="0" r="1">
    <stop offset="0" stop-color="#E6E4F6" stop-opacity=".9"/><stop offset=".65" stop-color="#E6E4F6" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gradBg2" cx="0" cy="1" r="1">
    <stop offset="0" stop-color="#F0E8F8" stop-opacity=".9"/><stop offset=".65" stop-color="#F0E8F8" stop-opacity="0"/>
  </radialGradient>
</defs>
"""


def document(name, body, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{esc(title)}">
<title>{esc(title)}</title>
{DEFS}
<g id="Fondo">
  {rect(0, 0, W, H, 0, C["bg"])}
  <rect width="{W}" height="{H}" fill="url(#gradBg1)"/>
  <rect width="{W}" height="{H}" fill="url(#gradBg2)"/>
</g>
{body}
</svg>
'''


def save(filename, body, title):
    svg = document(filename, body, title)
    with io.open(os.path.join(OUT, filename), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(svg)
    return svg


def card(x, y, w, h, fill=C["surface"], r=18, stroke=C["line"], sw=1):
    body = rect(x, y, w, h, r, fill, stroke, sw)
    return body


def check_circle(x, y, size=22, done=False):
    if done:
        body = circle(x + size / 2, y + size / 2, size / 2, C["primary"])
        body += icon("check", x + size / 2 - 6.5, y + size / 2 - 6.5, 13, "#FFFFFF", 2.6)
    else:
        body = circle(x + size / 2, y + size / 2, size / 2 - 1, "none", "#B9B6D1", 1.8)
    return body


def task_row(x, y, w, title, subject, done=False):
    body = rect(x, y, w, 46, 14, "#FFFFFF" if not done else "rgba(255,255,255,.64)")
    body += check_circle(x + 10, y + 12)
    body += text(x + 40, y + 21, title, 13.5, 600, C["text"] if not done else "#A3A0B8")
    if subject:
        body += text(x + 40, y + 36, subject, 11.5, 500, C["muted"], opacity=0.9)
    return group("Tarea", body)


def chip(x, y, label, active=False, w=None):
    width = w or (max(64, len(label) * 7 + 26))
    fill = C["primary"] if active else "#FFFFFF"
    color = "#FFFFFF" if active else C["muted"]
    body = rect(x, y, width, 34, 17, fill, C["primary"] if active else C["line"])
    body += text(x + width / 2, y + 22, label, 12.5, 600, color, "middle")
    return group("Chip_" + label.replace(" ", "_"), body)


def sticky(x, y, w, h, color, title, lines, lock=False, meta=""):
    body = rect(x, y, w, h, 18, color)
    if lock:
        body += icon("lock", x + w - 26, y + 11, 14, C["text"], 2, 0.65)
    body += text(x + 14, y + 28, title, 14, 700, "#38355A")
    yy = y + 48
    for line in lines:
        body += text(x + 14, yy, line, 12, 500, "#38355A", opacity=0.82)
        yy += 18
    if meta:
        body += text(x + 14, y + h - 12, meta, 9.5, 700, "#38355A", opacity=0.5, letter=0.5)
    return group("Post_it_" + title.replace(" ", "_"), body)


def top_head(title, subtitle=None, back=False, right_icon=None, right_label=None):
    body = ""
    if back:
        body += rect(20, 54, 42, 42, 14, C["surface"], C["line"])
        body += icon("back", 30, 64, 22, C["text"])
        body += text(195, 68, title, 12, 700, C["muted"], "middle")
    else:
        body += text(20, 108, title, 26, 700, C["text"])
        if subtitle:
            body += text(20, 129, subtitle, 12.5, 500, C["muted"])
    if right_icon:
        body += rect(328, 84, 42, 42, 14, C["surface"], C["line"])
        body += icon(right_icon, 338, 94, 22, C["text"])
    if right_label:
        body += rect(300, 84, 70, 34, 12, C["surface"], C["line"])
        body += text(335, 105, right_label, 12, 600, C["muted"], "middle")
    return body


def sheet_frame(extra_backdrop=""):
    body = rect(0, 0, W, H, 0, "#1C1B32", opacity=0.46)
    body += extra_backdrop
    body += rect(0, 444, W, 400, 26, C["bg"])
    body += rect(174, 452, 42, 4, 2, "#D8D5E8")
    return body


# ============================================================ 01 ONBOARDING

def frame_onboarding():
    b = ""
    b += status_bar()
    b += text(330, 80, "Ahora no", 12.5, 600, C["muted"], "middle")

    art = '<g id="Ilustracion">'
    art += '<g transform="rotate(-9 130 300)">' + rect(50, 245, 130, 130, 26, C["yellow"]) + "</g>"
    art += '<g transform="rotate(7 235 260)">' + rect(170, 195, 130, 130, 26, C["pink"]) + "</g>"
    art += '<g transform="rotate(-2 160 365)">' + rect(92, 300, 130, 130, 26, C["blue"]) + "</g>"
    for gy, gx in [(275, 68), (295, 68), (315, 68)]:
        art += rect(gx, gy, 72 if gy == 275 else 54, 6, 3, "#3C3864", opacity=0.18)
    art += rect(205, 238, 60, 6, 3, "#3C3864", opacity=0.16)
    art += rect(205, 254, 44, 6, 3, "#3C3864", opacity=0.16)
    art += rect(236, 352, 62, 62, 20, "url(#gradPrimary)")
    art += icon("note", 250, 366, 32, "#FFFFFF", 1.8)
    art += "</g>"
    b += art

    b += text(195, 500, "BIENVENIDA A STICKLY", 10.5, 700, C["primary"], "middle", letter=1.2)
    b += text(195, 546, "Tu día, en orden", 30, 700, C["text"], "middle", letter=-1)
    b += text(195, 582, "y en un solo lugar.", 30, 700, C["text"], "middle", letter=-1)
    b += text(195, 618, "Tus notas, tareas y contraseñas se guardan", 14, 500, C["muted"], "middle")
    b += text(195, 640, "localmente. Sin cuenta y sin servidores.", 14, 500, C["muted"], "middle")

    dots = '<g id="Indicadores">'
    for i in range(3):
        dots += rect(183 + i * 14, 674, 7 if i else 22, 7, 3.5, C["primary"] if i == 0 else "#D8D5E8")
    dots += "</g>"
    b += dots

    b += rect(25, 708, 340, 50, 16, "url(#gradPrimary)")
    b += text(195, 739, "Siguiente", 14, 700, "#FFFFFF", "middle")
    b += text(195, 784, "Stickly · Alquimia Lab · v1.0.0", 10.5, 500, "#8A87A1", "middle")
    b += home_indicator()
    save("01-onboarding.svg", b, "Stickly · Bienvenida")


# ============================================================ 02 HOME

def frame_home():
    b = status_bar()
    b += text(20, 96, "BUENAS TARDES", 10.5, 700, C["muted"], letter=1)
    b += text(20, 126, "Isabel", 27, 700, C["text"], letter=-0.8)
    b += text(20, 148, "Jueves, 12 de noviembre", 12.5, 600, C["muted"])
    b += rect(320, 86, 50, 50, 18, "url(#gradAvatar)")
    b += text(345, 118, "I", 19, 700, "#FFFFFF", "middle")

    save_card = '<g id="Tarjeta_hoy">'
    save_card += rect(20, 168, 350, 264, 26, "url(#gradHero)")
    save_card += '<clipPath id="clipHero"><rect x="20" y="168" width="350" height="264" rx="26"/></clipPath>'
    save_card += '<g clip-path="url(#clipHero)">' + circle(368, 150, 70, "#FFFFFF", opacity=0.45) + '</g>' 
    save_card += text(38, 202, "HOY", 10.5, 700, C["muted"], letter=1)
    save_card += text(38, 226, "Cosas que debes hacer hoy", 18, 700, C["text"], letter=-0.3)
    save_card += rect(308, 190, 42, 42, 14, "#FFFFFF")
    save_card += icon("plus", 318, 200, 22, C["primary"])
    save_card += task_row(36, 244, 318, "Entregar ensayo", "Literatura")
    save_card += task_row(36, 296, 318, "Estudiar biología", "Examen el viernes")
    save_card += task_row(36, 348, 318, "Comprar café", "Casa", True)
    save_card += rect(36, 386, 318, 1, 0, C["primary"], opacity=0.16)
    b += save_card + "</g>"

    stats = '<g id="Estadisticas">'
    for i, (num, lab) in enumerate([("2", "PENDIENTES"), ("1", "COMPLETADAS"), ("5", "NOTAS")]):
        stats += text([38, 155, 272][i], 410, num, 20, 700, C["primary_dark"])
        stats += text([38, 155, 272][i], 423, lab, 9, 700, "#6F6C93", letter=0.4)
    b += stats + "</g>"

    b += text(20, 470, "Accesos rápidos", 16, 700, C["text"], letter=-0.2)
    quick = [("note", "Notas", C["primary_light"], C["primary"]),
             ("book", "Cuadernos", "#FDE7F1", "#C2417A"),
             ("key", "Contraseñas", "#E3F3FC", "#267AA2"),
             ("timer", "Cronómetro", "#FEF0E2", "#B45309")]
    qg = '<g id="Accesos_rapidos">'
    for i, (ic, lab, bg, fg) in enumerate(quick):
        x = 20 + i * 88.5
        qg += rect(x, 486, 80, 86, 18, C["surface"], C["line"])
        qg += rect(x + 20, 499, 40, 40, 14, bg)
        qg += icon(ic, x + 30, 509, 20, fg, 1.8)
        qg += text(x + 40, 559, lab, 9.5, 700, C["text"], "middle")
    b += qg + "</g>"

    b += text(20, 612, "Notas importantes", 16, 700, C["text"], letter=-0.2)
    b += text(352, 612, "Todo", 12.5, 700, C["primary"], "end")

    mini = '<g id="Notas_importantes">'
    mini += rect(20, 628, 350, 58, 16, C["yellow"])
    mini += circle(33, 657, 3.5, "#3B3866", opacity=0.35)
    mini += text(46, 652, "Lista del súper", 13.5, 700, "#3B3866")
    mini += text(46, 670, "Leche, pan y café. Comprar el viernes.", 12, 500, "#3B3866", opacity=0.8)
    mini += icon("chevron-right", 340, 647, 18, "#3B3866", 1.8, 0.5)
    mini += rect(20, 696, 350, 58, 16, C["pink"])
    mini += circle(33, 725, 3.5, "#3B3866", opacity=0.35)
    mini += text(46, 720, "Ideas para el blog", 13.5, 700, "#3B3866")
    mini += text(46, 738, "Ordenar el diario y los prompts.", 12, 500, "#3B3866", opacity=0.8)
    mini += icon("chevron-right", 340, 715, 18, "#3B3866", 1.8, 0.5)
    b += mini + "</g>"

    b += tab_bar("home")
    b += home_indicator()
    save("02-home.svg", b, "Stickly · Inicio")
