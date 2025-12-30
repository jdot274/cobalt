import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { sendMessage } from '../services/claude-api';

export default function ChatInterface() {
  const { messages, addMessage, agentMode, extensions } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    setIsLoading(true);

    try {
      // Get enabled extensions
      const enabledExtensions = extensions.filter(e => e.enabled);

      // Send to Claude API
      const response = await sendMessage(userMessage, {
        agentMode,
        availableTools: enabledExtensions.map(e => e.id),
        conversationHistory: messages.slice(-10), // Last 10 messages for context
      });

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response.content,
        toolsUsed: response.toolsUsed,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please make sure your API key is configured.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-cobalt-950/50 to-black">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="text-6xl">🚀</div>
            <h2 className="text-2xl font-bold text-white">Welcome to Cobalt</h2>
            <p className="text-gray-400 max-w-md">
              Your advanced AI development OS. Start chatting or switch to Canvas Builder to design your app visually.
            </p>
            {agentMode && (
              <div className="flex items-center gap-2 px-4 py-2 bg-accent-green/10 border border-accent-green/30 rounded-lg text-accent-green">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Agent Mode Active</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-cobalt-600 text-white'
                      : 'bg-cobalt-900/50 text-gray-100 border border-cobalt-800/50'
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                    {message.content}
                  </div>

                  {message.toolsUsed && message.toolsUsed.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-cobalt-700/30">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-cobalt-400">Tools used:</span>
                        {message.toolsUsed.map((tool) => {
                          const extension = extensions.find(e => e.id === tool);
                          return (
                            <span
                              key={tool}
                              className="text-xs px-2 py-0.5 rounded bg-cobalt-800/50 text-cobalt-200 border border-cobalt-700/30"
                            >
                              {extension?.icon} {extension?.name || tool}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-cobalt-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-cobalt-900/50 border border-cobalt-800/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-cobalt-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-cobalt-800/30 bg-cobalt-900/30 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={agentMode ? "Tell the agent what to build..." : "Ask anything..."}
              className="flex-1 bg-cobalt-900/50 border border-cobalt-700/50 rounded-xl px-4 py-3 text-white placeholder-cobalt-500 focus:outline-none focus:border-cobalt-600 focus:ring-2 focus:ring-cobalt-600/30 resize-none min-h-[60px] max-h-[200px]"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '60px',
                maxHeight: '200px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 200) + 'px';
              }}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`
                p-3 rounded-xl transition-all
                ${input.trim() && !isLoading
                  ? 'bg-cobalt-600 hover:bg-cobalt-500 text-white'
                  : 'bg-cobalt-800/30 text-cobalt-600 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {agentMode && (
            <div className="mt-2 text-xs text-accent-green flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Agent mode active - I can autonomously execute tasks</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
