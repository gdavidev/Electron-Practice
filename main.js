const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const DataAccess = require("./src/data-access/DataAccess.js");

const db = new DataAccess(app.getPath('userData'))

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, './src/preload.js'),
      contextBridge: true,
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  ipcMain.handle('save-player', async (_, email, phone) => {
    return await db.playerRepository.save(email, phone);
  });
  ipcMain.handle('get-players', async () => {
    return await db.playerRepository.get();
  });
  ipcMain.handle('save-question', async (_, question) => {
    return await db.questionRepository.save(question);
  });
  ipcMain.handle('get-questions', async () => {
    return await db.questionRepository.get();
  });
  ipcMain.handle('erase-questions', async () => {
    return await db.questionRepository.erase();
  });
  ipcMain.handle('save-configuration', async (_, configuration) => {
    return await db.configurationRepository.update(configuration);
  });
  ipcMain.handle('get-configurations', async () => {
    return await db.configurationRepository.get();
  });

  //win.removeMenu();
  win.loadFile('dist/index.html')
      .then(() => { win.show() });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow();
  })
})