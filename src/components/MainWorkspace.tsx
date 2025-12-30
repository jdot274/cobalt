import { useState } from 'react';
import { useStore } from '../store/useStore';
import ExtensionToolbar from './ExtensionToolbar';
import ChatInterface from './ChatInterface';
import CanvasWorkspace from './CanvasWorkspace';
import IDEWorkspace from './IDEWorkspace';
import AgentModeToggle from './AgentModeToggle';
import { MessageSquare, Layers, Code2, Settings } from 'lucide-react';

export default function MainWorkspace() {
  const { currentView, setCurrentView } = useStore();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0a0a]">
      {/* Extension Toolbar */}
      <ExtensionToolbar />

      {/* View Toggle Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-cobalt-900/30 border-b border-cobalt-800/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('chat')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${currentView === 'chat'
                ? 'bg-cobalt-700/50 text-white border border-cobalt-600/50'
                : 'text-gray-400 hover:text-white hover:bg-cobalt-800/30'
              }
            `}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Chat</span>
          </button>

          <button
            onClick={() => setCurrentView('canvas')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${currentView === 'canvas'
                ? 'bg-cobalt-700/50 text-white border border-cobalt-600/50'
                : 'text-gray-400 hover:text-white hover:bg-cobalt-800/30'
              }
            `}
          >
            <Layers className="w-4 h-4" />
            <span className="text-sm font-medium">Canvas Builder</span>
          </button>

          <button
            onClick={() => setCurrentView('ide')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${currentView === 'ide'
                ? 'bg-cobalt-700/50 text-white border border-cobalt-600/50'
                : 'text-gray-400 hover:text-white hover:bg-cobalt-800/30'
              }
            `}
          >
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">Dev Environment</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <AgentModeToggle />

          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cobalt-800/30 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'chat' && <ChatInterface />}
        {currentView === 'canvas' && <CanvasWorkspace />}
        {currentView === 'ide' && <IDEWorkspace />}
      </div>
    </div>
  );
}
