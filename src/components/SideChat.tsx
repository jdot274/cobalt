import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Send, X } from 'lucide-react';

export default function SideChat() {
  const { toolId } = useParams<{ toolId: string }>();
  const { extensions } = useStore();
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');

  const extension = extensions.find(e => e.id === toolId);

  useEffect(() => {
    if (extension) {
      // Initialize with welcome message
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm here to help you with **${extension.name}**. You can ask me about:\n\n${extension.capabilities.map(c => `• ${c}`).join('\n')}\n\nWhat would you like to know?`
      }]);
    }
  }, [extension]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I can help you with that using ${extension?.name}. This is a demo response - integrate with Claude API for real responses.`
      }]);
    }, 1000);
  };

  const handleClose = () => {
    if (window.electronAPI && toolId) {
      window.electronAPI.closeSideChat(toolId);
    }
  };

  if (!extension) {
    return <div className="p-4 text-red-400">Extension not found</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-cobalt-900/50 border-b border-cobalt-800/30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{extension.icon}</span>
          <div>
            <h2 className="font-semibold text-sm">{extension.name}</h2>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 rounded hover:bg-cobalt-800/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-cobalt-600 text-white'
                  : 'bg-cobalt-900/70 text-gray-100 border border-cobalt-800/50'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-cobalt-800/30 bg-cobalt-900/30 p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${extension.name}...`}
            className="flex-1 bg-cobalt-900/50 border border-cobalt-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-cobalt-500 focus:outline-none focus:border-cobalt-600"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2 rounded-lg transition-all ${
              input.trim()
                ? 'bg-cobalt-600 hover:bg-cobalt-500 text-white'
                : 'bg-cobalt-800/30 text-cobalt-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
