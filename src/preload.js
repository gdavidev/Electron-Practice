const { contextBridge, ipcRenderer } = require('electron');

// Expose specific APIs to the renderer process
contextBridge.exposeInMainWorld('bridge', {
  players: {
    save: (email, phone) =>  ipcRenderer.invoke('save-player', email, phone),
    get: () =>  ipcRenderer.invoke('get-players'),
  },
  questions: {
    save: (question) =>  ipcRenderer.invoke('save-question', question),
    get: () =>  ipcRenderer.invoke('get-questions'),
    erase: () =>  ipcRenderer.invoke('erase-questions'),
  },
  configuration: {
    update: (configurationItem) =>  ipcRenderer.invoke('save-configuration', configurationItem),
    get: () =>  ipcRenderer.invoke('get-configurations'),
  }
});