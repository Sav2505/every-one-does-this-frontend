const { app, BrowserWindow } = require('electron');
const path = require('path');
const { CONFIG_API } = require('../Frontend/src/configs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL(`${CONFIG_API.BASE_URL}:5173`);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
