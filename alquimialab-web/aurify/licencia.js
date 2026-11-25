/* ==========================================================================
   Alquimia Lab · puerta de licencia para las apps web
   --------------------------------------------------------------------------
   Verifica la clave de compra de Gumroad sin backend: llama a la API
   oficial de licencias desde el navegador (Gumroad manda
   `access-control-allow-origin: *`, así que funciona).
   Después de la primera activación queda guardada en el dispositivo y la
   app funciona sin conexión, como siempre.

   Configuración por atributos del propio <script> (así el archivo es
   idéntico en las dos apps y no hace falta script en línea):

     <script src="licencia.js"
       data-app="aurify"                 nombre corto (se usa como sal y prefijo)
       data-nombre="Aurify"              nombre visible
       data-logo="icon-192.png"          icono de la tarjeta
       data-compra="https://…?wanted=true"     ficha en español
       data-compra-en="https://…?wanted=true"  ficha en inglés (opcional)
       data-email="alquimialab88@gmail.com"
       data-productos="id1,id2"          product_id de Gumroad (varios: ES y EN)
       data-payhip="prod_sk_…"           clave secreta del producto en Payhip (opcional)
       data-maestras="hash1,hash2"       claves maestras (solo hashes)
       data-nativo="SticklyDesktop"      globales extra que indican app nativa
     ></script>

   Reglas de comportamiento:
   - App nativa (Electron/Capacitor) → no pide nada: la posesión es la compra.
   - Sin `data-productos` → la puerta queda apagada (no se puede verificar
     ninguna compra y bloquear sería dejar a todo el mundo fuera).
   - `?licencia=1` → fuerza la puerta para probarla.
   ========================================================================== */
(function () {
  "use strict";

  var SCRIPT = document.currentScript;
  var D = (SCRIPT && SCRIPT.dataset) || {};

  var APP = String(D.app || "app").toLowerCase();
  var NOMBRE = D.nombre || APP.charAt(0).toUpperCase() + APP.slice(1);
  var LOGO = D.logo || "";
  var COMPRA = D.compra || "";
  var COMPRA_EN = D.compraEn || "";
  var CORREO = D.email || "alquimialab88@gmail.com";
  var PRODUCTOS = lista(D.productos);
  var PAYHIP = D.payhip || "";
  var MAESTRAS = lista(D.maestras);
  var NATIVOS = lista(D.nativo);

  var CLAVE_ALMACEN = "alquimia-licencia-v1:" + APP;
  var SAL = "alquimia-lab|" + APP + "|v1|2026";
  var FORZAR = /[?&]licencia=1(?:&|$)/.test(location.search);
  var ESTILO_ID = "licencia-estilos";

  /* ------------------------------------------------------------------ textos */

  var TEXTOS = {
    es: {
      title: "Activa tu copia de {app}",
      lead: "Pega la clave que te llegó por correo cuando compraste la app (Gumroad o Payhip). Solo hace falta una vez.",
      placeholder: "Tu clave de compra",
      action: "Activar",
      checking: "Comprobando la clave…",
      ok: "¡Listo! Abriendo {app}…",
      bad: "Esa clave no es válida. Revísala y vuelve a intentar.",
      refunded: "Esa compra aparece como reembolsada, así que la licencia ya no está activa.",
      offline: "Sin conexión. La primera activación necesita internet; después funciona sin ella.",
      noConfig: "Esta copia todavía no tiene licencias activadas.",
      where: "¿Dónde está mi clave?",
      buy: "Comprar en Gumroad",
      help: "¿Problemas? Escríbenos",
      note: "La clave queda guardada solo en este dispositivo."
    },
    en: {
      title: "Activate your copy of {app}",
      lead: "Paste the key from your Gumroad or Payhip receipt. You only need to do this once.",
      placeholder: "Your purchase key",
      action: "Activate",
      checking: "Checking your key…",
      ok: "All set! Opening {app}…",
      bad: "That key doesn't work. Check it and try again.",
      refunded: "That purchase was refunded, so the licence is no longer active.",
      offline: "You're offline. The first activation needs internet; after that it works without it.",
      noConfig: "This copy doesn't have licences turned on yet.",
      where: "Where's my key?",
      buy: "Buy on Gumroad",
      help: "Need help? Email us",
      note: "The key is stored on this device only."
    },
    fr: {
      title: "Activez votre copie de {app}",
      lead: "Collez la clé reçue par e-mail lors de votre achat sur Gumroad. Une seule fois suffit.",
      placeholder: "Votre clé d'achat",
      action: "Activer",
      checking: "Vérification de la clé…",
      ok: "C'est bon ! Ouverture de {app}…",
      bad: "Cette clé n'est pas valide. Vérifiez-la et réessayez.",
      refunded: "Cet achat a été remboursé : la licence n'est plus active.",
      offline: "Pas de connexion. La première activation nécessite internet ; ensuite, tout fonctionne hors ligne.",
      noConfig: "Cette copie n'a pas encore de licences activées.",
      where: "Où est ma clé ?",
      buy: "Acheter sur Gumroad",
      help: "Un souci ? Écrivez-nous",
      note: "La clé est enregistrée uniquement sur cet appareil."
    },
    it: {
      title: "Attiva la tua copia di {app}",
      lead: "Incolla la chiave che hai ricevuto via email con l'acquisto su Gumroad. Basta una volta.",
      placeholder: "La tua chiave d'acquisto",
      action: "Attiva",
      checking: "Verifica della chiave…",
      ok: "Fatto! Apertura di {app}…",
      bad: "Questa chiave non è valida. Controllala e riprova.",
      refunded: "Quell'acquisto è stato rimborsato, quindi la licenza non è più attiva.",
      offline: "Nessuna connessione. La prima attivazione richiede internet; poi funziona offline.",
      noConfig: "Questa copia non ha ancora le licenze attive.",
      where: "Dov'è la mia chiave?",
      buy: "Acquista su Gumroad",
      help: "Problemi? Scrivici",
      note: "La chiave viene salvata solo su questo dispositivo."
    },
    pt: {
      title: "Ative sua cópia do {app}",
      lead: "Cole a chave que chegou por e-mail quando você comprou no Gumroad. Basta uma vez.",
      placeholder: "Sua chave de compra",
      action: "Ativar",
      checking: "Verificando a chave…",
      ok: "Pronto! Abrindo o {app}…",
      bad: "Essa chave não é válida. Confira e tente de novo.",
      refunded: "Essa compra foi reembolsada, então a licença não está mais ativa.",
      offline: "Sem conexão. A primeira ativação precisa de internet; depois funciona offline.",
      noConfig: "Esta cópia ainda não tem licenças ativadas.",
      where: "Onde está minha chave?",
      buy: "Comprar no Gumroad",
      help: "Problemas? Fale com a gente",
      note: "A chave fica salva só neste dispositivo."
    },
    de: {
      title: "{app} aktivieren",
      lead: "Füge den Schlüssel aus deiner Gumroad-Bestellung ein. Einmal reicht.",
      placeholder: "Dein Kaufschlüssel",
      action: "Aktivieren",
      checking: "Schlüssel wird geprüft…",
      ok: "Fertig! {app} wird geöffnet…",
      bad: "Dieser Schlüssel ist ungültig. Prüfe ihn und versuche es erneut.",
      refunded: "Dieser Kauf wurde erstattet, die Lizenz ist nicht mehr aktiv.",
      offline: "Keine Verbindung. Die erste Aktivierung braucht Internet, danach läuft alles offline.",
      noConfig: "Für diese Kopie sind noch keine Lizenzen aktiviert.",
      where: "Wo ist mein Schlüssel?",
      buy: "Auf Gumroad kaufen",
      help: "Probleme? Schreib uns",
      note: "Der Schlüssel wird nur auf diesem Gerät gespeichert."
    },
    ja: {
      title: "{app} を認証する",
      lead: "Gumroad で購入したときに届いたキーを貼り付けてください。必要なのは一度だけです。",
      placeholder: "購入キー",
      action: "認証",
      checking: "キーを確認しています…",
      ok: "完了しました。{app} を開きます…",
      bad: "このキーは有効ではありません。確認してもう一度お試しください。",
      refunded: "この購入は返金済みのため、ライセンスは有効ではありません。",
      offline: "オフラインです。初回の認証にはインターネットが必要です。以後はオフラインで使えます。",
      noConfig: "このコピーではライセンスがまだ有効になっていません。",
      where: "キーはどこにありますか？",
      buy: "Gumroad で購入",
      help: "お困りですか？ご連絡ください",
      note: "キーはこの端末にのみ保存されます。"
    },
    zh: {
      title: "激活你的 {app}",
      lead: "粘贴你在 Gumroad 购买后收到的密钥。只需一次。",
      placeholder: "你的购买密钥",
      action: "激活",
      checking: "正在验证密钥…",
      ok: "好了！正在打开 {app}…",
      bad: "该密钥无效，请检查后重试。",
      refunded: "该购买已退款，许可证不再有效。",
      offline: "没有网络连接。首次激活需要联网，之后可离线使用。",
      noConfig: "此副本尚未启用许可证。",
      where: "我的密钥在哪里？",
      buy: "在 Gumroad 购买",
      help: "遇到问题？联系我们",
      note: "密钥只保存在此设备上。"
    },
    ko: {
      title: "{app} 인증하기",
      lead: "Gumroad에서 구매할 때 받은 키를 붙여넣으세요. 한 번만 하면 됩니다.",
      placeholder: "구매 키",
      action: "인증",
      checking: "키를 확인하는 중…",
      ok: "완료! {app}을(를) 여는 중…",
      bad: "이 키는 유효하지 않습니다. 확인 후 다시 시도해 주세요.",
      refunded: "이 구매는 환불되어 라이선스가 더 이상 유효하지 않습니다.",
      offline: "오프라인입니다. 첫 인증에는 인터넷이 필요하며, 이후에는 오프라인에서도 작동합니다.",
      noConfig: "이 복사본은 아직 라이선스가 활성화되지 않았습니다.",
      where: "내 키는 어디에 있나요?",
      buy: "Gumroad에서 구매",
      help: "문제가 있나요? 문의하세요",
      note: "키는 이 기기에만 저장됩니다."
    }
  };

  var IDIOMA = idiomaPreferido();
  var T = TEXTOS[IDIOMA] || TEXTOS.en;

  function texto(clave) {
    var valor = (T && T[clave]) || TEXTOS.en[clave] || "";
    return String(valor).replace(/\{app\}/g, NOMBRE);
  }

  /* El idioma elegido en la app manda sobre el del navegador: si alguien puso
     la app en inglés, la tarjeta y la ficha de compra también van en inglés.
     Así el texto y el enlace nunca se contradicen. */
  function idiomaPreferido() {
    try {
      var guardado = localStorage.getItem("alquimia-lang");
      if (guardado === "es" || guardado === "en") return guardado;
    } catch (e) { /* ignore */ }
    return detectarIdioma();
  }

  function detectarIdioma() {
    var candidatos = [];
    try {
      if (navigator.languages && navigator.languages.length) candidatos = candidatos.concat(navigator.languages);
      if (navigator.language) candidatos.push(navigator.language);
    } catch (e) { /* ignore */ }
    candidatos.push(document.documentElement.lang || "");
    for (var i = 0; i < candidatos.length; i++) {
      var corto = String(candidatos[i] || "").toLowerCase().slice(0, 2);
      if (TEXTOS[corto]) return corto;
    }
    return "en";
  }

  /* ------------------------------------------------------------------ utilidades */

  function lista(valor) {
    return String(valor || "")
      .split(",")
      .map(function (parte) { return parte.trim(); })
      .filter(Boolean);
  }

  /* FNV-1a en base 36: suficiente para comparar contra hashes guardados. */
  function hash(cadena) {
    var h = 0x811c9dc5;
    for (var i = 0; i < cadena.length; i++) {
      h ^= cadena.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ("0000000" + h.toString(36)).slice(-7);
  }

  function normalizarMaestra(codigo) {
    return String(codigo || "").toUpperCase().replace(/[\s._-]+/g, "");
  }

  function esNativa() {
    if (location.protocol === "file:") return true;
    if (/Electron\//.test(navigator.userAgent)) return true;
    try {
      if (window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" &&
          window.Capacitor.isNativePlatform()) return true;
    } catch (e) { /* ignore */ }
    var conocidos = ["AurifyDesktop", "AurifyAndroid", "SticklyDesktop", "SticklyAndroid"];
    for (var i = 0; i < conocidos.length; i++) {
      if (window[conocidos[i]]) return true;
    }
    for (var j = 0; j < NATIVOS.length; j++) {
      if (window[NATIVOS[j]]) return true;
    }
    return false;
  }

  function leer() {
    try {
      var crudo = localStorage.getItem(CLAVE_ALMACEN);
      if (!crudo) return null;
      var registro = JSON.parse(crudo);
      if (!registro || registro.v !== 1 || typeof registro.c !== "string") return null;
      if (registro.h !== hash(SAL + "|" + registro.c)) return null;
      return registro;
    } catch (e) {
      return null;
    }
  }

  function guardar(codigo, modo) {
    var registro = { v: 1, c: codigo, m: modo, t: Date.now() };
    registro.h = hash(SAL + "|" + codigo);
    try { localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(registro)); } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------------ estilos */

  function inyectarEstilos() {
    if (document.getElementById(ESTILO_ID)) return;
    var estilo = document.createElement("style");
    estilo.id = ESTILO_ID;
    estilo.textContent = [
      "html.licencia-pendiente{overflow:hidden}",
      "html.licencia-pendiente body>*:not(#licenciaRoot){visibility:hidden!important}",
      "#licenciaRoot{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;",
      "padding:24px;background:radial-gradient(120% 120% at 20% 0%,#FAF9FE 0%,#F1EFFB 45%,#E7E4F7 100%);",
      "font-family:Roboto,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#2E2C46;overflow:auto}",
      "#licenciaRoot *{box-sizing:border-box}",
      ".lc-card{width:min(460px,100%);background:#fff;border:1px solid #E8E6F4;border-radius:24px;",
      "padding:34px 30px 26px;box-shadow:0 26px 60px rgba(66,62,120,.16);text-align:center}",
      ".lc-logo{width:72px;height:72px;border-radius:20px;display:block;margin:0 auto 16px}",
      ".lc-title{margin:0 0 10px;font-size:21px;line-height:1.25;letter-spacing:-.01em;font-weight:700}",
      ".lc-lead{margin:0 0 20px;font-size:14px;line-height:1.55;color:#5B5878}",
      ".lc-form{display:flex;flex-direction:column;gap:10px;margin:0}",
      ".lc-input{width:100%;padding:13px 15px;border:1px solid #DAD6EE;border-radius:13px;font-size:15px;",
      "font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.03em;text-align:center;",
      "background:#FCFBFF;color:#2E2C46}",
      ".lc-input:focus{outline:none;border-color:#6463AA;box-shadow:0 0 0 3px rgba(100,99,170,.16);background:#fff}",
      ".lc-btn{width:100%;padding:13px 18px;border:1px solid #6463AA;border-radius:13px;background:#6463AA;color:#fff;",
      "font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:filter .15s,transform .15s}",
      ".lc-btn:hover{filter:brightness(1.06)}",
      ".lc-btn:active{transform:translateY(1px)}",
      ".lc-btn[disabled]{opacity:.65;cursor:progress}",
      ".lc-status{min-height:20px;margin:14px 0 0;font-size:13px;line-height:1.45;color:#8A87A4}",
      ".lc-status[data-tipo=error]{color:#A8344B}",
      ".lc-status[data-tipo=ok]{color:#3C7A55}",
      ".lc-links{display:flex;flex-wrap:wrap;gap:6px 18px;justify-content:center;margin:16px 0 0;font-size:13px}",
      ".lc-links a{color:#6463AA;text-decoration:none;font-weight:600}",
      ".lc-links a:hover{text-decoration:underline}",
      ".lc-note{margin:18px 0 0;font-size:11.5px;line-height:1.5;color:#9A97B2}",
      "@media (max-width:520px){.lc-card{padding:28px 20px 22px;border-radius:20px}.lc-title{font-size:19px}}",
      "@media print{html.licencia-pendiente body>*:not(#licenciaRoot){display:none!important}}"
    ].join("");
    document.head.appendChild(estilo);
  }

  /* ------------------------------------------------------------------ pintar */

  var raiz = null;

  function pintar() {
    if (raiz) return;
    inyectarEstilos();

    raiz = document.createElement("div");
    raiz.id = "licenciaRoot";
    raiz.setAttribute("role", "dialog");
    raiz.setAttribute("aria-modal", "true");
    raiz.setAttribute("aria-labelledby", "lc-title");

    var logo = LOGO
      ? '<img class="lc-logo" src="' + escapar(LOGO) + '" alt="">'
      : "";

    var enlaces = [];
    /* Cada ficha de Gumroad tiene su idioma: en español va a la ficha española,
       y en cualquier otro idioma a la inglesa (si existe). */
    var destinoCompra = IDIOMA !== "es" && COMPRA_EN ? COMPRA_EN : COMPRA;
    if (destinoCompra) {
      enlaces.push('<a href="' + escapar(destinoCompra) + '" target="_blank" rel="noopener">' + escapar(texto("buy")) + "</a>");
    }
    enlaces.push('<a href="https://gumroad.com/library" target="_blank" rel="noopener">' + escapar(texto("where")) + "</a>");
    if (CORREO) {
      var asunto = encodeURIComponent(NOMBRE + " · activación");
      enlaces.push('<a href="mailto:' + escapar(CORREO) + "?subject=" + asunto + '">' + escapar(texto("help")) + "</a>");
    }

    raiz.innerHTML =
      '<div class="lc-card">' +
        logo +
        '<h1 class="lc-title" id="lc-title">' + escapar(texto("title")) + "</h1>" +
        '<p class="lc-lead">' + escapar(texto("lead")) + "</p>" +
        '<form class="lc-form" novalidate>' +
          '<label for="lc-key" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">' +
            escapar(texto("placeholder")) + "</label>" +
          '<input class="lc-input" id="lc-key" type="text" name="clave" autocomplete="off" spellcheck="false" ' +
            'autocapitalize="characters" placeholder="' + escapar(texto("placeholder")) + '">' +
          '<button class="lc-btn" type="submit">' + escapar(texto("action")) + "</button>" +
        "</form>" +
        '<p class="lc-status" role="status" aria-live="polite"></p>' +
        '<div class="lc-links">' + enlaces.join("") + "</div>" +
        '<p class="lc-note">' + escapar(texto("note")) + "</p>" +
      "</div>";

    document.body.appendChild(raiz);
    document.documentElement.classList.add("licencia-pendiente");

    var form = raiz.querySelector(".lc-form");
    var campo = raiz.querySelector(".lc-input");
    var boton = raiz.querySelector(".lc-btn");
    var estado = raiz.querySelector(".lc-status");

    if (!PRODUCTOS.length) {
      estado.textContent = texto("noConfig");
    }

    setTimeout(function () { try { campo.focus(); } catch (e) { /* ignore */ } }, 60);

    form.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var codigo = String(campo.value || "").trim();
      if (!codigo) { campo.focus(); return; }

      boton.disabled = true;
      campo.readOnly = true;
      ponerEstado(texto("checking"), "");

      verificar(codigo).then(function (resultado) {
        if (resultado.ok) {
          guardar(codigo, resultado.modo);
          ponerEstado(texto("ok"), "ok");
          setTimeout(desbloquear, 420);
          return;
        }
        boton.disabled = false;
        campo.readOnly = false;
        if (resultado.tipo === "reembolsada") ponerEstado(texto("refunded"), "error");
        else if (resultado.tipo === "sin-config") ponerEstado(texto("noConfig"), "error");
        else ponerEstado(texto("bad"), "error");
        campo.focus();
        campo.select();
      }).catch(function (error) {
        boton.disabled = false;
        campo.readOnly = false;
        if (!navigator.onLine || (error && error.name === "AbortError")) ponerEstado(texto("offline"), "error");
        else ponerEstado(texto("bad"), "error");
        campo.focus();
      });
    });

    function ponerEstado(mensaje, tipo) {
      estado.textContent = mensaje;
      if (tipo) estado.setAttribute("data-tipo", tipo);
      else estado.removeAttribute("data-tipo");
    }
  }

  function desbloquear() {
    document.documentElement.classList.remove("licencia-pendiente");
    if (raiz && raiz.parentNode) raiz.parentNode.removeChild(raiz);
    raiz = null;
    try {
      window.dispatchEvent(new CustomEvent("licencia:activada"));
    } catch (e) { /* ignore */ }
  }

  function escapar(cadena) {
    return String(cadena)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ------------------------------------------------------------------ verificar */

  function verificar(codigo) {
    if (MAESTRAS.length) {
      var huella = hash(SAL + "|" + normalizarMaestra(codigo));
      if (MAESTRAS.indexOf(huella) >= 0) {
        return Promise.resolve({ ok: true, modo: "maestra" });
      }
    }

    if (!PRODUCTOS.length && !PAYHIP) {
      return Promise.resolve({ ok: false, tipo: "sin-config" });
    }

    if (navigator.onLine === false) {
      return Promise.reject(new Error("offline"));
    }

    var indice = 0;

    function siguiente() {
      if (indice >= PRODUCTOS.length) return conPayhip();
      var producto = PRODUCTOS[indice++];
      return pedir(producto, codigo).then(function (respuesta) {
        if (respuesta && respuesta.success) {
          var compra = respuesta.purchase || {};
          if (compra.refunded || compra.chargebacked) {
            return { ok: false, tipo: "reembolsada" };
          }
          return { ok: true, modo: "gumroad" };
        }
        return siguiente();
      });
    }

    /* Si no era de Gumroad, se prueba la tienda de Payhip. */
    function conPayhip() {
      if (!PAYHIP) return Promise.resolve({ ok: false, tipo: "invalida" });
      return pedirPayhip(codigo);
    }

    return siguiente();
  }

  function pedirPayhip(codigo) {
    var control = null;
    var temporizador = null;
    if (typeof AbortController === "function") {
      control = new AbortController();
      temporizador = setTimeout(function () { control.abort(); }, 12000);
    }

    var url = "https://payhip.com/api/v2/license/verify?license_key=" + encodeURIComponent(codigo);

    return fetch(url, {
      method: "GET",
      headers: { "product-secret-key": PAYHIP },
      signal: control ? control.signal : undefined,
    }).then(function (respuesta) {
      if (temporizador) clearTimeout(temporizador);
      if (!respuesta.ok && respuesta.status !== 200) {
        return { ok: false, tipo: "invalida" };
      }
      return respuesta.json().catch(function () { return {}; }).then(function (datos) {
        var d = datos && datos.data;
        if (d && d.enabled !== false && d.license_key) {
          return { ok: true, modo: "payhip" };
        }
        return { ok: false, tipo: "invalida" };
      });
    }, function (error) {
      if (temporizador) clearTimeout(temporizador);
      throw error;
    });
  }

  function pedir(producto, codigo) {
    var cuerpo = new URLSearchParams();
    cuerpo.set("product_id", producto);
    cuerpo.set("license_key", codigo);
    cuerpo.set("increment_uses_count", "false");

    var control = null;
    var temporizador = null;
    if (typeof AbortController === "function") {
      control = new AbortController();
      temporizador = setTimeout(function () { control.abort(); }, 12000);
    }

    return fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Accept": "application/json"
      },
      body: cuerpo.toString(),
      signal: control ? control.signal : undefined
    }).then(function (respuesta) {
      if (temporizador) clearTimeout(temporizador);
      return respuesta.json().catch(function () { return {}; });
    }, function (error) {
      if (temporizador) clearTimeout(temporizador);
      throw error;
    });
  }

  /* ------------------------------------------------------------------ arranque */

  function iniciar() {
    if (!FORZAR && esNativa()) return;
    if (!FORZAR && !PRODUCTOS.length) return;
    if (!FORZAR && leer()) return;
    pintar();
  }

  window.Licencia = {
    estaActiva: function () { return !!leer(); },
    modo: function () { var r = leer(); return r ? r.m : null; },
    abrir: pintar,
    olvidar: function () {
      try { localStorage.removeItem(CLAVE_ALMACEN); } catch (e) { /* ignore */ }
      location.reload();
    }
  };

  if (document.body) iniciar();
  else document.addEventListener("DOMContentLoaded", iniciar, { once: true });
})();
