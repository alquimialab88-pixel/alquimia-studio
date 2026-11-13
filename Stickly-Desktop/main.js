const { app, BrowserWindow, Menu, dialog, ipcMain, session, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");

const APP_ROOT = path.join(__dirname, "app");
const APP_ENTRY = "/stickly/";
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".webm": "audio/webm",
  ".txt": "text/plain; charset=utf-8"
};

if (!app.commandLine.hasSwitch("user-data-dir")) {
  app.setPath("userData", path.join(app.getPath("appData"), "Stickly"));
}

let mainWindow = null;
let localServer = null;

function isInside(root, target) {
  const rel = path.relative(root, target);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

function startServer() {
  return new Promise((resolve, reject) => {
    localServer = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url || "/", "http://127.0.0.1");
        let pathname = decodeURIComponent(url.pathname);
        if (pathname === "/" || pathname === "") pathname = APP_ENTRY;

        let filePath = path.join(APP_ROOT, pathname);
        if (!isInside(APP_ROOT, filePath)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }

        let stat = null;
        try {
          stat = await fs.promises.stat(filePath);
        } catch (e) {
          stat = null;
        }

        if (stat && stat.isDirectory()) {
          filePath = path.join(filePath, "index.html");
          try {
            stat = await fs.promises.stat(filePath);
          } catch (e) {
            stat = null;
          }
        }

        if (!stat || !stat.isFile()) {
          // Las rutas internas de la app (hash) no llegan aquí, pero damos
          // una respuesta clara si algún archivo falta.
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Archivo no encontrado");
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          "Content-Type": MIME[ext] || "application/octet-stream",
          "Content-Length": stat.size,
          "Cache-Control": "no-store"
        });
        const stream = fs.createReadStream(filePath);
        stream.on("error", () => {
          if (!res.headersSent) res.writeHead(500);
          res.end();
        });
        stream.pipe(res);
      } catch (e) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Error interno");
      }
    });

    localServer.on("error", reject);
    localServer.listen(0, "127.0.0.1", () => {
      const { port } = localServer.address();
      resolve(port);
    });
  });
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 820,
    minWidth: 380,
    minHeight: 600,
    title: "Stickly",
    icon: path.join(__dirname, "icon.ico"),
    backgroundColor: "#F8F7FB",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  const appOrigin = "http://127.0.0.1:" + port;

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.loadURL(appOrigin + APP_ENTRY);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(appOrigin)) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.webContents.session.setSpellCheckerEnabled(false);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function configurePermissions() {
  const allowed = new Set(["media", "notifications", "clipboard-sanitized-write"]);
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(allowed.has(permission));
  });
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => {
    return allowed.has(permission);
  });
}

ipcMain.handle("stickly:save-file", async (event, filename, text) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);
    const safeName = path.basename(String(filename || "stickly.json"));
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title: "Guardar copia de seguridad",
      defaultPath: safeName,
      filters: [
        { name: "Copia de seguridad de Stickly", extensions: ["json"] },
        { name: "Todos los archivos", extensions: ["*"] }
      ]
    });
    if (canceled || !filePath) return { ok: false, canceled: true };
    await fs.promises.writeFile(filePath, String(text), "utf8");
    return { ok: true, path: filePath };
  } catch (e) {
    return { ok: false, error: String(e && e.message ? e.message : e) };
  }
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(async () => {
    app.setAppUserModelId("com.alquimialab.stickly.desktop");
    Menu.setApplicationMenu(null);
    configurePermissions();
    try {
      const port = await startServer();
      createWindow(port);
    } catch (e) {
      dialog.showErrorBox("Stickly", "No se pudo iniciar la aplicación.\n\n" + (e && e.message ? e.message : e));
      app.quit();
    }
  });

  app.on("window-all-closed", () => {
    if (localServer) localServer.close();
    app.quit();
  });
}
