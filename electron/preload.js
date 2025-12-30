const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Side chat management
  openSideChat: (toolId, toolName, position) =>
    ipcRenderer.invoke('open-side-chat', { toolId, toolName, position }),

  closeSideChat: (toolId) =>
    ipcRenderer.invoke('close-side-chat', toolId),

  // Agent mode
  executeAgentCommand: (command, context) =>
    ipcRenderer.invoke('execute-agent-command', { command, context }),

  // Canvas project management
  saveCanvasProject: (projectData) =>
    ipcRenderer.invoke('save-canvas-project', { projectData }),

  loadCanvasProject: (projectPath) =>
    ipcRenderer.invoke('load-canvas-project', { projectPath }),

  // Terminal
  executeTerminalCommand: (command, cwd) =>
    ipcRenderer.invoke('terminal-command', { command, cwd }),

  // File system
  readFile: (filePath) =>
    ipcRenderer.invoke('fs-read-file', filePath),

  writeFile: (filePath, content) =>
    ipcRenderer.invoke('fs-write-file', { filePath, content }),

  readDirectory: (dirPath) =>
    ipcRenderer.invoke('fs-read-dir', dirPath),

  // Platform info
  platform: process.platform
});
