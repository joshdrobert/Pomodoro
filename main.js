const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createTray() {
  const iconPath = path.join(__dirname, 'icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Pomodoro Buddy', enabled: false },
    { type: 'separator' },
    {
      label: 'Show/Hide Buddy', click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      }
    },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' }
  ]);

  tray.setToolTip('Pomodoro Buddy');
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 250,
    height: 420,
    x: screenWidth - 270,
    y: 50,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    skipTaskbar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Updated path to isolated src folder
  mainWindow.loadFile('src/index.html');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.setIgnoreMouseEvents(false);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.setIgnoreMouseEvents(ignore, options);
});
