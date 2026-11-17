const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("AurifyDesktop", {
  isDesktop: true,
  savePdf(filename) {
    return ipcRenderer.invoke("aurify:save-pdf", filename);
  }
});
