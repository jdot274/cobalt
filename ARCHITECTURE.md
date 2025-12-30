# Cobalt - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        COBALT APPLICATION                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Extension Toolbar                       │ │
│  │  [📁] [🌐] [⌨️] [📊] [📽️] ... (hover for tooltips)        │ │
│  │  Right-click → Opens side chat window                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────┬──────────────┬─────────────────┐                  │
│  │  Chat   │  Canvas      │  Dev Environment│  ← View Tabs     │
│  └─────────┴──────────────┴─────────────────┘                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   ACTIVE VIEW AREA                        │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  Chat Interface                                   │    │  │
│  │  │  • Message history                                │    │  │
│  │  │  • AI responses with tool badges                  │    │  │
│  │  │  • Input with Agent Mode indicator                │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  │                      OR                                    │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  Canvas Workspace                                 │    │  │
│  │  │  ┌────────┐   ┌─────────┐   💡 Green AI          │    │  │
│  │  │  │Component│   │Component│      Suggestions       │    │  │
│  │  │  └────────┘   └─────────┘                         │    │  │
│  │  │  • Drag-drop components                           │    │  │
│  │  │  • AI suggestions appear contextually             │    │  │
│  │  │  • Component library sidebar                      │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  │                      OR                                    │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  IDE Workspace                                    │    │  │
│  │  │  ┌──────┬─────────────────────────────────────┐  │    │  │
│  │  │  │File  │  Monaco Code Editor                 │  │    │  │
│  │  │  │Tree  │  • Syntax highlighting              │  │    │  │
│  │  │  │      │  • IntelliSense                      │  │    │  │
│  │  │  └──────┴─────────────────────────────────────┘  │    │  │
│  │  │  ┌──────────────────────────────────────────┐    │    │  │
│  │  │  │  XTerm Terminal                          │    │    │  │
│  │  │  │  $ npm run dev                           │    │    │  │
│  │  │  └──────────────────────────────────────────┘    │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

                              ↕️  IPC Communication

┌─────────────────────────────────────────────────────────────────┐
│                      ELECTRON MAIN PROCESS                       │
│  • Window management                                             │
│  • File system operations                                        │
│  • Terminal command execution                                    │
│  • Side chat window creation                                     │
└─────────────────────────────────────────────────────────────────┘

                              ↕️  API Calls

┌─────────────────────────────────────────────────────────────────┐
│                       CLAUDE API (Anthropic)                     │
│  • Message processing                                            │
│  • Agent mode execution                                          │
│  • Canvas suggestion generation                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx (Root)
├── ExtensionProvider
│   └── ChatProvider
│       ├── ExtensionToolbar
│       │   ├── Tooltip (Radix UI)
│       │   └── ContextMenu (Radix UI)
│       │
│       └── MainWorkspace
│           ├── ViewToggle (Chat | Canvas | IDE)
│           ├── AgentModeToggle
│           │
│           ├── ChatInterface (if view === 'chat')
│           │   ├── MessageList
│           │   └── InputArea
│           │
│           ├── CanvasWorkspace (if view === 'canvas')
│           │   ├── ComponentLibrary (Sidebar)
│           │   ├── CanvasElements[]
│           │   └── AISuggestion[] (Green hints)
│           │
│           └── IDEWorkspace (if view === 'ide')
│               ├── FileExplorer
│               ├── CodeEditor (Monaco)
│               └── Terminal (XTerm)
│
└── SideChat (Separate window via Router)
    └── Tool-specific chat interface
```

## Data Flow

### 1. Extension Interaction Flow
```
User hovers extension
    ↓
ExtensionToolbar renders Tooltip
    ↓
Shows: name, description, capabilities, use cases
    ↓
User clicks → toggleExtension(id)
    ↓
Store updates → UI re-renders
```

### 2. Right-Click Side Chat Flow
```
User right-clicks extension
    ↓
ContextMenu opens
    ↓
User selects "Chat about this extension"
    ↓
window.electronAPI.openSideChat(toolId, toolName, position)
    ↓
Electron main process creates new BrowserWindow
    ↓
Loads SideChat component with toolId param
    ↓
Independent chat window focused on that tool
```

### 3. Canvas AI Suggestion Flow
```
User adds component to canvas
    ↓
addCanvasElement(element)
    ↓
setTimeout → addAISuggestion()
    ↓
AISuggestion component renders with green glow
    ↓
User clicks "Apply" → acceptSuggestion(id)
    ↓
Suggestion applied to element
OR
User clicks "Dismiss" → dismissSuggestion(id)
    ↓
Suggestion removed
```

### 4. Chat Message Flow
```
User types message
    ↓
handleSubmit() → addMessage(userMsg)
    ↓
sendMessage(userMsg, { agentMode, availableTools, history })
    ↓
Claude API processes with system prompt
    ↓
Response received
    ↓
addMessage(assistantMsg)
    ↓
UI updates with message + toolsUsed badges
```

### 5. Agent Mode Flow
```
User toggles Agent Mode ON
    ↓
setAgentMode(true)
    ↓
User sends request: "Build a todo app"
    ↓
Claude API receives extended system prompt
    ↓
AI autonomously:
  - Selects tools (filesystem, code editor)
  - Executes multi-step plan
  - Creates files
  - Writes code
  - Reports progress
    ↓
User sees real-time updates
```

## State Management (Zustand)

```typescript
CobaltStore
├── extensions: Extension[]           // All available extensions
├── activeExtensions: string[]        // Currently in use
├── messages: Message[]               // Chat history
├── agentMode: boolean                // Autonomous mode
├── canvasElements: CanvasElement[]   // Canvas components
├── aiSuggestions: AISuggestion[]     // Green hints
├── currentView: 'chat' | 'canvas' | 'ide'
└── sidebarCollapsed: boolean
```

## IPC Communication

### Renderer → Main Process
```javascript
// Open side chat
window.electronAPI.openSideChat(toolId, toolName, position)

// File operations
window.electronAPI.readFile(path)
window.electronAPI.writeFile(path, content)
window.electronAPI.readDirectory(path)

// Terminal
window.electronAPI.executeTerminalCommand(command, cwd)

// Agent
window.electronAPI.executeAgentCommand(command, context)

// Canvas
window.electronAPI.saveCanvasProject(data)
window.electronAPI.loadCanvasProject(path)
```

### Main Process → Renderer
```javascript
// Responses via Promise resolution
{ success: boolean, data: any, error?: string }
```

## Extension System Architecture

### Extension Definition
```typescript
interface Extension {
  id: string              // Unique identifier
  name: string           // Display name
  description: string    // What it does
  icon: string          // Emoji or icon
  category: string      // filesystem | browser | office | mcp | custom
  enabled: boolean      // On/off state
  capabilities: string[] // What it can do
  useCases: string[]    // When to use it
}
```

### Extension Registry
All 16 extensions defined in `src/data/extensions.ts`
- Loaded on app startup
- Stored in Zustand state
- Rendered in toolbar
- Available to Claude API when enabled

## AI Integration Points

### 1. Chat Messages
```typescript
sendMessage(prompt, {
  agentMode: boolean,
  availableTools: string[],
  conversationHistory: Message[]
})
```

### 2. Canvas Analysis
```typescript
analyzeCanvasForSuggestions(
  elements: CanvasElement[],
  context: string
) → string[] // Suggestions
```

### 3. Tool Recommendations
```typescript
// In system prompt:
"You have access to: [filesystem, terminal, api-client, ...]"
```

## Multi-Window Architecture

### Main Window
- Full app UI
- Chat, Canvas, IDE views
- Extension toolbar
- State management

### Side Chat Windows
- Tool-specific chats
- Independent of main window
- Receive tool context
- Can remain open while working
- Managed by Electron main process

### Window Communication
```
Main Window ←→ Electron Main Process ←→ Side Chat Windows
           IPC                    IPC
```

## Security Model

### Context Isolation
- Renderer process isolated from Node.js
- Preload script exposes only safe APIs
- No direct Node.js access in React

### IPC Security
```javascript
// Preload: Safe API exposure
contextBridge.exposeInMainWorld('electronAPI', {
  openSideChat: (toolId, toolName, pos) =>
    ipcRenderer.invoke('open-side-chat', { toolId, toolName, pos })
})
```

### API Key Security
- Stored in .env file (gitignored)
- Or localStorage (encrypted recommended)
- Never exposed to main app code
- Only used in service layer

## Performance Optimizations

1. **Lazy Loading**: Components load on demand
2. **Virtualization**: Large lists use windowing
3. **Memoization**: React.memo on heavy components
4. **Debouncing**: Input handlers debounced
5. **Code Splitting**: Route-based chunks

## Extensibility Points

### Adding New Extensions
1. Edit `src/data/extensions.ts`
2. Add extension object
3. Implement functionality in service layer
4. Connect via IPC if needed

### Adding New Views
1. Create component in `src/components/`
2. Add route in `App.tsx`
3. Add tab in `MainWorkspace.tsx`
4. Update store if needed

### Custom AI Prompts
1. Edit `src/services/claude-api.ts`
2. Modify system prompt
3. Add new analysis functions
4. Connect to UI

## Technology Stack Details

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Desktop Runtime | Electron 28 | Native app wrapper |
| UI Framework | React 18 | Component rendering |
| Language | TypeScript | Type safety |
| Build Tool | Vite 5 | Fast dev & build |
| Styling | Tailwind CSS | Utility-first CSS |
| State Management | Zustand | Global state |
| Routing | React Router 6 | SPA navigation |
| Code Editor | Monaco | VS Code editor |
| Terminal | XTerm.js | Terminal emulator |
| UI Components | Radix UI | Accessible primitives |
| Icons | Lucide React | Icon library |
| AI Integration | Anthropic SDK | Claude API |

## File Size Estimate
- Source code: ~500 KB
- node_modules: ~300 MB
- Built app: ~150 MB (macOS)
- Runtime memory: ~200-400 MB

---

This architecture provides:
- ✅ Modularity
- ✅ Extensibility
- ✅ Security
- ✅ Performance
- ✅ Maintainability
- ✅ Scalability
