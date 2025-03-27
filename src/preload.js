const { contextBridge, ipcRenderer } = require('electron');

// Expose specific APIs to the renderer process
contextBridge.exposeInMainWorld('bridge', {
  savePlayer: (email, phone) => {
    return ipcRenderer.invoke('save-player', email, phone)
  },
  getPlayers: () => {
    return ipcRenderer.invoke('get-players')
  },
  saveQuestion: (question) => {
    return ipcRenderer.invoke('save-question', question)
  },
  getQuestions: () => {
    return ipcRenderer.invoke('get-questions')
  },
});