# Cobalt - Advanced AI Development OS

**Beyond Chat. Beyond Apps. A Complete AI-Powered Development Environment.**

Cobalt is your own Claude-like application, but significantly better. It combines intelligent chat, visual app building, and a full development environment into one powerful desktop application.

![Cobalt Banner](https://via.placeholder.com/1200x300/0066e6/ffffff?text=Cobalt+AI+Development+OS)

## Features

### 1. Intelligent Chat Interface
- **Smart Extension Suggestions**: AI analyzes your prompts and recommends relevant extensions
- **Extension Toolbar**: Hover over any extension icon to see capabilities and use cases
- **Right-Click Tool Chat**: Context menu on any extension opens a dedicated AI chat about that specific tool
- **Multi-Model Support**: Claude Opus, Sonnet, and Haiku models
- **Agent Mode**: Autonomous AI that can execute multi-step tasks

### 2. Visual Canvas App Builder
- **Drag-and-Drop Components**: Build UIs visually with buttons, inputs, containers, and more
- **AI Suggestions**: Green glowing hints appear as you build, suggesting improvements
- **Context-Aware Intelligence**: AI understands your design and offers relevant recommendations
- **Component Library**: Pre-built components ready to use
- **Export to Code**: Generate production-ready code from your designs

### 3. Integrated Development Environment
- **File Explorer**: Browse and manage project files
- **Monaco Code Editor**: Full-featured editor with syntax highlighting for 20+ languages
- **Integrated Terminal**: Execute commands without leaving the app
- **Multi-Pane Layout**: Resizable panels for optimal workflow
- **Real-Time Collaboration**: Work with AI while editing code

### 4. Extension System
Built-in extensions include:
- 📁 **File System** - Read/write files and directories
- 🌐 **Browser Control** - Automate Chrome, scrape data
- ⌨️ **Terminal** - Execute shell commands
- 📊 **Excel Integration** - Work with spreadsheets
- 📽️ **PowerPoint** - Create presentations
- 🗄️ **Database** - SQL and NoSQL operations
- 🔌 **API Client** - HTTP requests and webhooks
- 📦 **Git** - Version control operations
- 🐳 **Docker** - Container management
- 💻 **Code Editor** - Built-in Monaco editor
- 🔧 **MCP Servers** - Model Context Protocol integration
- And many more...

### 5. Agent Mode
Enable autonomous AI capabilities:
- Multi-step task execution
- Automatic tool selection
- Proactive problem-solving
- Build entire features from descriptions
- Real-time progress tracking

## Installation

### Prerequisites
- Node.js 18+ and npm
- macOS, Windows, or Linux
- Claude API key (get one from https://console.anthropic.com)

### Setup

1. **Clone or navigate to the project**
   ```bash
   cd /Users/joey/Desktop/Cobalt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your Claude API key**

   Create a `.env` file in the root directory:
   ```
   CLAUDE_API_KEY=your_api_key_here
   ```

   Or, you'll be prompted to enter it when you first run the app.

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will:
   - Start the Vite dev server on port 5173
   - Launch Electron in development mode
   - Open Cobalt with hot-reload enabled

5. **Build for production** (optional)
   ```bash
   npm run build
   ```

## Usage Guide

### Getting Started

1. **Launch Cobalt**
   - The app opens with the Chat interface
   - Extension toolbar shows all available tools at the top

2. **Using Extensions**
   - **Hover** over any extension icon to see what it can do
   - **Click** to enable/disable an extension
   - **Right-click** to open a dedicated chat about that extension
   - Green dot indicates active extensions

3. **Chat Mode**
   - Type your question or request
   - AI automatically suggests relevant extensions
   - See which tools were used in each response
   - Toggle Agent Mode for autonomous capabilities

4. **Canvas Builder**
   - Click "Canvas Builder" tab
   - Drag components from the sidebar
   - Watch for green AI suggestions appearing
   - Click "Apply" to accept suggestions
   - Export your design to code

5. **Dev Environment**
   - Click "Dev Environment" tab
   - Browse files in the left sidebar
   - Edit code in the Monaco editor
   - Run commands in the integrated terminal
   - Resize panels to fit your workflow

### Extension Tooltips

When you hover over an extension, you'll see:
- **Name and description**
- **Capabilities** - What the extension can do
- **Use cases** - When to use it
- **Status** - Enabled or disabled

### Right-Click Tool Chats

Right-click any extension to open a concurrent side window where you can:
- Ask specific questions about that tool
- Get usage examples
- Troubleshoot issues
- Learn best practices

The side chat window remains open while you work in the main app.

### AI Suggestions in Canvas

As you build in Canvas mode:
1. Add components by clicking them in the sidebar
2. Watch for green glowing suggestions to appear
3. Suggestions are context-aware based on your design
4. Click "Apply" to implement the suggestion
5. Click "Dismiss" to ignore it

Example suggestions:
- "Add a navigation bar at the top for better UX"
- "This button needs an onClick handler"
- "Group these elements in a container"

### Agent Mode

Enable Agent Mode for autonomous AI:
1. Click the Agent Mode toggle in the top bar
2. Describe what you want to build
3. AI will:
   - Break down the task into steps
   - Select and use appropriate extensions
   - Execute commands and write code
   - Report progress in real-time
4. Review and approve autonomous actions

## Architecture

```
Cobalt/
├── electron/          # Electron main process
│   ├── main.js       # Window management, IPC handlers
│   └── preload.js    # Secure IPC bridge
├── src/
│   ├── components/   # React components
│   │   ├── ChatInterface.tsx
│   │   ├── CanvasWorkspace.tsx
│   │   ├── IDEWorkspace.tsx
│   │   ├── ExtensionToolbar.tsx
│   │   └── ...
│   ├── services/     # API and business logic
│   │   └── claude-api.ts
│   ├── store/        # Zustand state management
│   │   └── useStore.ts
│   ├── data/         # Extension registry
│   │   └── extensions.ts
│   └── App.tsx       # Main app component
├── package.json
└── README.md
```

## Key Technologies

- **Electron** - Desktop app framework
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Monaco Editor** - Code editor
- **XTerm.js** - Terminal emulator
- **Radix UI** - Accessible components
- **Anthropic SDK** - Claude API integration

## Keyboard Shortcuts

### Global
- `Cmd/Ctrl + ,` - Settings
- `Cmd/Ctrl + K` - Focus chat input
- `Cmd/Ctrl + B` - Toggle sidebar

### Canvas Mode
- `V` - Select tool
- `H` - Pan tool
- `Del` - Delete selected element
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo

### IDE Mode
- `Cmd/Ctrl + S` - Save file
- `Cmd/Ctrl + P` - Quick file open
- `Cmd/Ctrl + F` - Find in file
- `` Cmd/Ctrl + ` `` - Toggle terminal

## Configuration

### API Key
Store your Claude API key in:
1. `.env` file (recommended for development)
2. localStorage (set in app settings)
3. Environment variable `CLAUDE_API_KEY`

### Extension Configuration
Edit `src/data/extensions.ts` to:
- Add custom extensions
- Modify extension capabilities
- Change default enabled state

### MCP Servers
Add MCP server configurations in Settings → Connectors

## Troubleshooting

### API Key Issues
- Error: "Claude API key not configured"
- Solution: Add your API key to `.env` or settings

### Extension Not Working
- Check if the extension is enabled (green dot)
- Right-click the extension and ask for help in the side chat
- Review extension capabilities in the hover tooltip

### Canvas Suggestions Not Appearing
- Click "Get AI Suggestions" button manually
- Ensure you have elements on the canvas
- Check that Agent Mode is enabled for proactive suggestions

### Terminal Commands Failing
- Verify you have permission to execute the command
- Check current working directory
- Try using absolute paths

## Development

### Project Structure
- `electron/` - Main process code
- `src/components/` - React UI components
- `src/services/` - Business logic
- `src/store/` - Global state
- `src/data/` - Static data and configs

### Adding a New Extension

1. Add to `src/data/extensions.ts`:
```typescript
{
  id: 'my-extension',
  name: 'My Extension',
  description: 'What it does',
  icon: '🚀',
  category: 'custom',
  enabled: false,
  capabilities: ['Capability 1', 'Capability 2'],
  useCases: ['Use case 1', 'Use case 2']
}
```

2. Implement the extension logic in a new service file

3. Connect it to the main app through IPC handlers

### Building Electron App

```bash
npm run build
```

This creates distributable packages in `dist/` for your platform.

## Roadmap

- [ ] Plugin marketplace for community extensions
- [ ] Team collaboration features
- [ ] Cloud sync for projects
- [ ] Mobile companion app
- [ ] Voice input mode
- [ ] Multi-language support
- [ ] Theme customization
- [ ] Workflow automation builder

## Contributing

Contributions welcome! This is your personal project, but feel free to:
1. Add new extensions
2. Improve AI suggestions
3. Enhance the canvas builder
4. Optimize performance

## License

MIT License - Use however you want!

## Credits

Built by Joey Walter using:
- Claude API by Anthropic
- React, Electron, and the amazing open-source community

---

**Cobalt** - Where AI meets development. Build faster. Code smarter. Ship better.

For questions or issues, check the extension tooltips or right-click for help!
