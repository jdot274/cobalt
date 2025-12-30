import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Move, Hand, MousePointer, Lightbulb, Sparkles } from 'lucide-react';
import AISuggestion from './AISuggestion';

type Tool = 'select' | 'pan' | 'add';
type ComponentType = 'button' | 'input' | 'text' | 'container' | 'image';

export default function CanvasWorkspace() {
  const {
    canvasElements,
    addCanvasElement,
    updateCanvasElement,
    deleteCanvasElement,
    aiSuggestions,
    addAISuggestion,
  } = useStore();

  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (currentTool === 'add' && showComponentMenu) {
      return; // Don't add if component menu is open
    }

    if (currentTool === 'select') {
      setSelectedElement(null);
    }
  };

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (currentTool === 'select') {
      setSelectedElement(elementId);
    }
  };

  const handleAddComponent = (type: ComponentType) => {
    const newElement = {
      type,
      x: 100 - panOffset.x,
      y: 100 - panOffset.y,
      width: type === 'button' ? 120 : type === 'input' ? 200 : 150,
      height: type === 'button' ? 40 : type === 'input' ? 36 : type === 'text' ? 30 : 100,
      properties: {
        text: type === 'button' ? 'Button' : type === 'text' ? 'Text' : '',
        backgroundColor: type === 'container' ? '#1a1a1a' : type === 'button' ? '#0066e6' : 'transparent',
        color: '#ffffff',
        fontSize: 14,
      },
    };

    addCanvasElement(newElement);
    setShowComponentMenu(false);

    // AI suggestion after adding component
    setTimeout(() => {
      addAISuggestion({
        type: 'improvement',
        message: `Consider adding ${type === 'button' ? 'an onClick handler' : type === 'input' ? 'validation' : 'styling'} to this ${type}`,
        x: newElement.x + newElement.width + 20,
        y: newElement.y,
        accepted: false,
      });
    }, 1000);
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      deleteCanvasElement(selectedElement);
      setSelectedElement(null);
    }
  };

  const triggerAISuggestion = () => {
    // Simulate AI analyzing the canvas
    addAISuggestion({
      type: 'component',
      message: 'Add a navigation bar at the top for better UX',
      x: 50,
      y: 20,
      accepted: false,
    });

    if (canvasElements.length > 3) {
      addAISuggestion({
        type: 'improvement',
        message: 'Group related elements into a container for better organization',
        x: 300,
        y: 150,
        accepted: false,
      });
    }
  };

  const componentLibrary: { type: ComponentType; icon: string; label: string }[] = [
    { type: 'button', icon: '🔘', label: 'Button' },
    { type: 'input', icon: '📝', label: 'Input' },
    { type: 'text', icon: '📄', label: 'Text' },
    { type: 'container', icon: '📦', label: 'Container' },
    { type: 'image', icon: '🖼️', label: 'Image' },
  ];

  return (
    <div className="flex h-full bg-gradient-to-br from-cobalt-950/50 to-black">
      {/* Sidebar - Component Library */}
      <div className="w-64 bg-cobalt-900/30 border-r border-cobalt-800/30 p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Tools</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTool('select')}
              className={`flex-1 p-2 rounded-lg transition-all ${
                currentTool === 'select'
                  ? 'bg-cobalt-600 text-white'
                  : 'bg-cobalt-800/30 text-gray-400 hover:bg-cobalt-700/30'
              }`}
              title="Select (V)"
            >
              <MousePointer className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={() => setCurrentTool('pan')}
              className={`flex-1 p-2 rounded-lg transition-all ${
                currentTool === 'pan'
                  ? 'bg-cobalt-600 text-white'
                  : 'bg-cobalt-800/30 text-gray-400 hover:bg-cobalt-700/30'
              }`}
              title="Pan (H)"
            >
              <Hand className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Components</h3>
          <div className="space-y-2">
            {componentLibrary.map((component) => (
              <button
                key={component.type}
                onClick={() => handleAddComponent(component.type)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-cobalt-800/30 hover:bg-cobalt-700/40 transition-all text-left border border-cobalt-700/30 hover:border-cobalt-600/50"
              >
                <span className="text-2xl">{component.icon}</span>
                <span className="text-sm text-gray-300">{component.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-cobalt-800/30">
          <button
            onClick={triggerAISuggestion}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-accent-green/20 hover:bg-accent-green/30 border border-accent-green/40 text-accent-green transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Get AI Suggestions</span>
          </button>
        </div>

        {selectedElement && (
          <div className="pt-4 border-t border-cobalt-800/30">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Selected Element</h3>
            <button
              onClick={handleDeleteElement}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-900/20 hover:bg-red-900/30 border border-red-700/40 text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-cobalt-800/30 text-xs text-gray-500">
          <p className="mb-1">Keyboard Shortcuts:</p>
          <p>V - Select Tool</p>
          <p>H - Pan Tool</p>
          <p>Del - Delete Selected</p>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative cursor-crosshair"
          onClick={handleCanvasClick}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        >
          {/* Canvas Elements */}
          {canvasElements.map((element) => (
            <div
              key={element.id}
              onClick={(e) => handleElementClick(e, element.id)}
              className={`absolute cursor-move transition-all ${
                selectedElement === element.id
                  ? 'ring-2 ring-accent-green shadow-lg shadow-accent-green/20'
                  : 'ring-1 ring-cobalt-700/50'
              }`}
              style={{
                left: element.x + panOffset.x,
                top: element.y + panOffset.y,
                width: element.width,
                height: element.height,
                backgroundColor: element.properties.backgroundColor,
                color: element.properties.color,
                fontSize: element.properties.fontSize,
              }}
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                {element.type === 'button' && (
                  <span className="font-medium">{element.properties.text}</span>
                )}
                {element.type === 'text' && (
                  <span>{element.properties.text || 'Text'}</span>
                )}
                {element.type === 'input' && (
                  <input
                    type="text"
                    placeholder="Input field"
                    className="w-full h-full bg-transparent border-none outline-none"
                    disabled
                  />
                )}
                {element.type === 'container' && (
                  <span className="text-gray-600 text-xs">Container</span>
                )}
                {element.type === 'image' && (
                  <span className="text-gray-600 text-xs">Image</span>
                )}
              </div>
            </div>
          ))}

          {/* AI Suggestions */}
          {aiSuggestions.map((suggestion) => (
            <AISuggestion key={suggestion.id} suggestion={suggestion} />
          ))}

          {/* Empty State */}
          {canvasElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Lightbulb className="w-16 h-16 text-cobalt-600 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-300">Start Building</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Add components from the sidebar to start wireframing your app.
                  The AI will provide suggestions as you build.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Info */}
        <div className="absolute bottom-4 left-4 px-3 py-2 bg-cobalt-900/80 backdrop-blur-sm border border-cobalt-700/50 rounded-lg text-xs text-gray-400">
          <span>Elements: {canvasElements.length}</span>
          <span className="mx-2">•</span>
          <span>Suggestions: {aiSuggestions.length}</span>
        </div>
      </div>
    </div>
  );
}
