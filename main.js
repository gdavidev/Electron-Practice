const { app, BrowserWindow } = require('electron')
const fs = require('fs');
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  
  let jsonData
  const jsonPath = path.join(__dirname, './assets/data/questions.json');
  fs.readFile(jsonPath, 'utf-8', (err, data) => {
    if (err)
      return console.error('Error reading the JSON file:', err);
    jsonData = JSON.parse(data);
  });
  
  //win.removeMenu();
  win.loadFile('index.html')
      .then(() => { win.webContents.send('json-data', jsonData.data) })
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
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})