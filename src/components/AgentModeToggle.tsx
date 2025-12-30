import { useStore } from '../store/useStore';
import { Sparkles, Bot } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';

export default function AgentModeToggle() {
  const { agentMode, setAgentMode } = useStore();

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-cobalt-900/40 rounded-lg border border-cobalt-800/30">
      <div className="flex items-center gap-2">
        <Bot className={`w-4 h-4 ${agentMode ? 'text-accent-green' : 'text-gray-500'}`} />
        <span className="text-sm font-medium text-gray-300">Agent Mode</span>
      </div>

      <Switch.Root
        checked={agentMode}
        onCheckedChange={setAgentMode}
        className={`
          relative w-11 h-6 rounded-full transition-colors
          ${agentMode ? 'bg-accent-green' : 'bg-gray-700'}
        `}
      >
        <Switch.Thumb
          className={`
            block w-5 h-5 bg-white rounded-full transition-transform
            ${agentMode ? 'translate-x-6' : 'translate-x-0.5'}
            translate-y-0.5
          `}
        />
      </Switch.Root>

      {agentMode && (
        <Sparkles className="w-4 h-4 text-accent-green animate-pulse" />
      )}
    </div>
  );
}
