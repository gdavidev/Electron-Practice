const { contextBridge, ipcRenderer } = require('electron');

// Expose specific APIs to the renderer process
contextBridge.exposeInMainWorld('bridge', {
  onJsonData: (callback) => ipcRenderer.on('json-data', callback),
});