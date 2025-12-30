import { useStore, AISuggestion as AISuggestionType } from '../store/useStore';
import { Check, X, Sparkles } from 'lucide-react';

interface Props {
  suggestion: AISuggestionType;
}

export default function AISuggestion({ suggestion }: Props) {
  const { acceptSuggestion, dismissSuggestion } = useStore();

  return (
    <div
      className="absolute ai-suggestion z-50"
      style={{ left: suggestion.x, top: suggestion.y }}
    >
      <div className="relative">
        {/* Connector line if linked to element */}
        {suggestion.elementId && (
          <div className="absolute -left-6 top-4 w-6 h-0.5 bg-accent-green/50" />
        )}

        {/* Suggestion card */}
        <div className="bg-accent-green/10 backdrop-blur-md border-2 border-accent-green/50 rounded-lg p-3 shadow-2xl shadow-accent-green/20 max-w-xs">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5 animate-pulse" />
            <p className="text-sm text-gray-100 leading-relaxed">{suggestion.message}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => acceptSuggestion(suggestion.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-accent-green/20 hover:bg-accent-green/30 border border-accent-green/40 rounded text-xs text-accent-green transition-all"
            >
              <Check className="w-3 h-3" />
              <span>Apply</span>
            </button>

            <button
              onClick={() => dismissSuggestion(suggestion.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 rounded text-xs text-gray-400 transition-all"
            >
              <X className="w-3 h-3" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>

        {/* Pulsing indicator dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <div className="w-full h-full bg-accent-green rounded-full animate-ping" />
          <div className="absolute inset-0 w-full h-full bg-accent-green rounded-full" />
        </div>
      </div>
    </div>
  );
}
