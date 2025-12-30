import { create } from 'zustand';

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'filesystem' | 'browser' | 'office' | 'mcp' | 'custom';
  enabled: boolean;
  capabilities: string[];
  useCases: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  toolsUsed?: string[];
}

export interface CanvasElement {
  id: string;
  type: 'button' | 'input' | 'text' | 'container' | 'image' | 'custom';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
  children?: string[];
}

export interface AISuggestion {
  id: string;
  elementId?: string;
  type: 'component' | 'action' | 'improvement';
  message: string;
  x: number;
  y: number;
  accepted: boolean;
}

interface CobaltStore {
  // Extensions
  extensions: Extension[];
  activeExtensions: string[];
  setExtensions: (extensions: Extension[]) => void;
  toggleExtension: (id: string) => void;

  // Chat
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Agent Mode
  agentMode: boolean;
  setAgentMode: (enabled: boolean) => void;
  agentTasks: string[];
  addAgentTask: (task: string) => void;

  // Canvas
  canvasElements: CanvasElement[];
  addCanvasElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateCanvasElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteCanvasElement: (id: string) => void;

  // AI Suggestions for Canvas
  aiSuggestions: AISuggestion[];
  addAISuggestion: (suggestion: Omit<AISuggestion, 'id'>) => void;
  acceptSuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;

  // UI State
  currentView: 'chat' | 'canvas' | 'ide';
  setCurrentView: (view: 'chat' | 'canvas' | 'ide') => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<CobaltStore>((set) => ({
  // Extensions
  extensions: [],
  activeExtensions: [],
  setExtensions: (extensions) => set({ extensions }),
  toggleExtension: (id) =>
    set((state) => ({
      activeExtensions: state.activeExtensions.includes(id)
        ? state.activeExtensions.filter((e) => e !== id)
        : [...state.activeExtensions, id],
    })),

  // Chat
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),

  // Agent Mode
  agentMode: false,
  setAgentMode: (enabled) => set({ agentMode: enabled }),
  agentTasks: [],
  addAgentTask: (task) =>
    set((state) => ({ agentTasks: [...state.agentTasks, task] })),

  // Canvas
  canvasElements: [],
  addCanvasElement: (element) =>
    set((state) => ({
      canvasElements: [
        ...state.canvasElements,
        { ...element, id: `elem-${Date.now()}-${Math.random()}` },
      ],
    })),
  updateCanvasElement: (id, updates) =>
    set((state) => ({
      canvasElements: state.canvasElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),
  deleteCanvasElement: (id) =>
    set((state) => ({
      canvasElements: state.canvasElements.filter((el) => el.id !== id),
    })),

  // AI Suggestions
  aiSuggestions: [],
  addAISuggestion: (suggestion) =>
    set((state) => ({
      aiSuggestions: [
        ...state.aiSuggestions,
        { ...suggestion, id: `sug-${Date.now()}-${Math.random()}` },
      ],
    })),
  acceptSuggestion: (id) =>
    set((state) => ({
      aiSuggestions: state.aiSuggestions.map((s) =>
        s.id === id ? { ...s, accepted: true } : s
      ),
    })),
  dismissSuggestion: (id) =>
    set((state) => ({
      aiSuggestions: state.aiSuggestions.filter((s) => s.id !== id),
    })),

  // UI State
  currentView: 'chat',
  setCurrentView: (view) => set({ currentView: view }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
