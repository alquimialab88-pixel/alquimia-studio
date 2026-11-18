# Activar la puerta de licencia

Las dos apps web (Aurify y Stickly) ya traen la puerta puesta. Aurify está **encendida
y probada**; Stickly sigue apagada esperando su `product_id`.

## Estado actual

| App | Puerta | Probada con clave real | `data-productos` |
|---|---|---|---|
| Aurify | ✅ encendida (2026-11-18) | ✅ sí, compra de prueba | `PcQRNBVxRjhvIi-bjuVQLQ==,KG9il-bIF_ziDlu1MpeBMg==` |
| Stickly | ⏳ apagada | — | vacío |

Los dos IDs de Aurify son los de sus dos fichas, confirmados leyendo las páginas públicas:

| Ficha | URL | `product_id` |
|---|---|---|
| Español | `alquimialab.gumroad.com/l/Aurify_ESP` | `PcQRNBVxRjhvIi-bjuVQLQ==` |
| Inglés | `alquimialab.gumroad.com/l/Aurify_ENG` | `KG9il-bIF_ziDlu1MpeBMg==` |

El botón “Comprar en Gumroad” de la puerta elige la ficha según el idioma de la app
(`data-compra` = español, `data-compra-en` = inglés). Si alguien puso la app en otro
idioma, va a la inglesa.

> **No reembolses la compra de prueba.** El código desactiva la licencia de las compras
> reembolsadas, así que esa clave dejaría de entrar. Si algún día la reembolsas, entra
> con una maestra.

## Cómo funciona

1. La persona compra en Gumroad con **license keys activadas**.
2. Gumroad le manda una clave en el recibo (aparece como *License key*).
3. La primera vez que abre `alquimialab.app/aurify/` (o `/stickly/`), la app le pide
   esa clave y la comprueba contra la API oficial de Gumroad.
4. Si es válida, se guarda en el dispositivo y **no vuelve a pedirla**. A partir de
   ahí funciona sin conexión, como siempre.

Si la compra aparece reembolsada o con contracargo, no deja entrar.
Las apps de Windows y Android **no piden clave**: tu compra ya las cubre.

## Encenderla (5 minutos, una vez por producto)

1. **Gumroad → Products → tu producto → Content**. En el editor pulsa **Insert**
   (o el menú `⋯`) y elige **License key**. Aparece un bloque; arrástralo a donde
   quieras que el comprador lo vea (arriba, antes de los archivos).
   Ojo: ya no es un interruptor en “Customize the buyer's experience”, ahora es un
   bloque de contenido. Si no aparece, es que ese producto no es digital.
2. En ese bloque, abre el desplegable y copia el **product_id** (un texto tipo
   `32-nPAicqbLj8B_WswVlMw==`). También está en **Share → API**.
   Deja apagado “Allow customers to choose number of seats per license purchased”.
3. Pégalo en el HTML de la app:

   `alquimialab-web/aurify/index.html`
   ```html
   data-productos="ID_FICHA_ES,ID_FICHA_INGLES"
   ```

   `alquimialab-web/stickly/index.html`
   ```html
   data-productos="ID_FICHA_ES,ID_FICHA_INGLES"
   ```

   Puedes poner uno solo o los dos separados por coma: prueba con cada uno hasta que
   alguno responda que sí.
4. Sube también la versión del service worker al publicar (`aurify-vN`, `stickly-vN`),
   para que los dispositivos que ya tienen la app instalada reciban el cambio.

Mientras `data-productos` esté vacío, la puerta no aparece nunca. Es a propósito:
no se puede verificar ninguna compra y bloquear dejaría a todo el mundo fuera.

## Probarla sin comprar

Añade `?licencia=1` a la URL:

- `http://localhost:8099/aurify/?licencia=1`
- `http://localhost:8099/stickly/?licencia=1`

Ese parámetro fuerza la pantalla de activación aunque la puerta esté apagada, y
también en Electron (si no, el navegador de escritorio se detecta como app nativa).

## Claves maestras

Para tus propios dispositivos y para destrabar a alguien cuya compra no se pueda
verificar (sin internet en el momento, compra antigua sin license key, etc.).

```powershell
node herramientas/licencias.js          # genera 3 claves nuevas
node herramientas/licencias.js --ver ALQ-XXXX-XXXX-XXXX
```

El script imprime las claves en claro y guarda los hashes en `CLAVES-MAESTRAS.txt`
(ese archivo está en `.gitignore`). En el HTML solo viven los **hashes**, así que las
claves no quedan publicadas en el repositorio.

Las claves actuales están en `CLAVES-MAESTRAS.txt`. Valen para las dos apps.

**Ojo:** solo se pueden guardar 3 hashes por app en el HTML. Si generas más, tienes
que reemplazar `data-maestras` en los dos `index.html` con los hashes nuevos.

## Si alguien dice que no le funciona

| Síntoma | Qué mirar |
|---|---|
| “Esa clave no es válida” | ¿Está activado *Generate a unique license key* en ese producto? ¿El `product_id` es el de esa ficha y no el de la otra? |
| “Sin conexión” | La primera activación necesita internet. Que se conecte, active y luego ya puede trabajar offline. |
| “Aparece como reembolsada” | La compra se reembolsó o hubo contracargo; la licencia se desactiva sola. |
| Funciona en un dispositivo y en otro no | Es normal: la clave se guarda por dispositivo. Se pega una vez en cada uno. |
| Quiere borrarla | En la consola del navegador: `Licencia.olvidar()` |

## Límite honesto

Esto es un **pestillo, no una caja fuerte**. La comprobación ocurre en el navegador,
así que alguien con conocimientos podría saltársela editando el código de la página.
Para un producto de US$12 frena al 99% de la gente y hace que el link público deje de
ser una versión gratis sin condiciones.

Si algún día hace falta algo serio (por ejemplo, límite real de dispositivos), el
camino es un intermediario propio —un Cloudflare Worker que hable con Gumroad y
devuelva un token firmado— y la app validando ese token. Se puede montar encima de
esto sin tocar la interfaz.
