const { app, BrowserWindow, Menu, dialog, ipcMain, session, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");

const APP_ROOT = path.join(__dirname, "app");
const APP_ENTRY = "/aurify/";
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
  ".txt": "text/plain; charset=utf-8"
};

if (!app.commandLine.hasSwitch("user-data-dir")) {
  app.setPath("userData", path.join(app.getPath("appData"), "Aurify"));
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
    width: 1240,
    height: 860,
    minWidth: 420,
    minHeight: 620,
    title: "Aurify",
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
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(permission === "clipboard-sanitized-write");
  });
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => {
    return permission === "clipboard-sanitized-write";
  });
}

function nombreSeguro(value) {
  const base = String(value || "Aurify").replace(/[\\/:*?"<>|\r\n\t]+/g, "-").trim().slice(0, 80);
  return /\.pdf$/i.test(base) ? base : base + ".pdf";
}

ipcMain.handle("aurify:save-pdf", async (event, filename) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title: "Guardar PDF",
      defaultPath: path.join(app.getPath("documents"), nombreSeguro(filename)),
      filters: [{ name: "Documento PDF", extensions: ["pdf"] }]
    });
    if (canceled || !filePath) return { ok: false, canceled: true };

    const pdf = await win.webContents.printToPDF({
      printBackground: true,
      preferCSSPageSize: true
    });
    await fs.promises.writeFile(filePath, pdf);
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
    app.setAppUserModelId("com.alquimialab.aurify.desktop");
    Menu.setApplicationMenu(null);
    configurePermissions();
    try {
      const port = await startServer();
      createWindow(port);
    } catch (e) {
      dialog.showErrorBox("Aurify", "No se pudo iniciar la aplicación.\n\n" + (e && e.message ? e.message : e));
      app.quit();
    }
  });

  app.on("window-all-closed", () => {
    if (localServer) localServer.close();
    app.quit();
  });
}
