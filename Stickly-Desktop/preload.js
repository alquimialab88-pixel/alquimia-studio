const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("SticklyDesktop", {
  isDesktop: true,
  saveFile(filename, text) {
    return ipcRenderer.invoke("stickly:save-file", filename, text);
  }
});
