const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow;
let sideChats = new Map(); // Track side chat windows

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Close all side chats when main window closes
    sideChats.forEach(win => win.close());
    sideChats.clear();
  });
}

// Create side chat window for specific tool exploration
function createSideChatWindow(toolId, toolName, position) {
  const sideChatWindow = new BrowserWindow({
    width: 500,
    height: 700,
    x: position.x,
    y: position.y,
    frame: true,
    title: `${toolName} - AI Assistant`,
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    sideChatWindow.loadURL(`http://localhost:5173#/side-chat/${toolId}`);
  } else {
    sideChatWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: `/side-chat/${toolId}`
    });
  }

  sideChats.set(toolId, sideChatWindow);

  sideChatWindow.on('closed', () => {
    sideChats.delete(toolId);
  });

  return sideChatWindow;
}

// IPC Handlers
ipcMain.handle('open-side-chat', (event, { toolId, toolName, position }) => {
  // If side chat already exists, focus it
  if (sideChats.has(toolId)) {
    const existingWindow = sideChats.get(toolId);
    existingWindow.focus();
    return { success: true, existed: true };
  }

  createSideChatWindow(toolId, toolName, position);
  return { success: true, existed: false };
});

ipcMain.handle('close-side-chat', (event, toolId) => {
  if (sideChats.has(toolId)) {
    sideChats.get(toolId).close();
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('execute-agent-command', async (event, { command, context }) => {
  // This will handle autonomous agent mode commands
  // For now, just return mock data
  return {
    success: true,
    output: `Agent executing: ${command}`,
    context: context
  };
});

ipcMain.handle('save-canvas-project', async (event, { projectData }) => {
  // Save canvas project to file system
  // TODO: Implement file system save
  return { success: true, path: '/saved/project.json' };
});

ipcMain.handle('load-canvas-project', async (event, { projectPath }) => {
  // Load canvas project from file system
  // TODO: Implement file system load
  return { success: true, data: {} };
});

// Terminal integration
ipcMain.handle('terminal-command', async (event, { command, cwd }) => {
  // Execute terminal commands
  const { exec } = require('child_process');

  return new Promise((resolve) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout,
        stderr,
        error: error ? error.message : null
      });
    });
  });
});

// File system operations
ipcMain.handle('fs-read-file', async (event, filePath) => {
  const fs = require('fs').promises;
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-write-file', async (event, { filePath, content }) => {
  const fs = require('fs').promises;
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fs-read-dir', async (event, dirPath) => {
  const fs = require('fs').promises;
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    return {
      success: true,
      files: files.map(f => ({
        name: f.name,
        isDirectory: f.isDirectory()
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// App lifecycle
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Custom menu
const template = [
  {
    label: 'Cobalt',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
