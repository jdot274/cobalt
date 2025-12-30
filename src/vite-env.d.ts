/// <reference types="vite/client" />

interface ElectronAPI {
  openSideChat: (toolId: string, toolName: string, position: { x: number; y: number }) => Promise<{ success: boolean; existed: boolean }>;
  closeSideChat: (toolId: string) => Promise<{ success: boolean }>;
  executeAgentCommand: (command: string, context: any) => Promise<{ success: boolean; output: string; context: any }>;
  saveCanvasProject: (projectData: any) => Promise<{ success: boolean; path: string }>;
  loadCanvasProject: (projectPath: string) => Promise<{ success: boolean; data: any }>;
  executeTerminalCommand: (command: string, cwd: string) => Promise<{ success: boolean; stdout: string; stderr: string; error: string | null }>;
  readFile: (filePath: string) => Promise<{ success: boolean; content: string; error?: string }>;
  writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
  readDirectory: (dirPath: string) => Promise<{ success: boolean; files: Array<{ name: string; isDirectory: boolean }>; error?: string }>;
  platform: string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
