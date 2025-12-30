import { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { useStore } from '../store/useStore';
import { BUILT_IN_EXTENSIONS } from '../data/extensions';
import { MessageSquare, Info, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ExtensionToolbar() {
  const { extensions, activeExtensions, toggleExtension, setExtensions } = useStore();
  const [hoveredExtension, setHoveredExtension] = useState<string | null>(null);

  // Initialize extensions if empty
  useState(() => {
    if (extensions.length === 0) {
      setExtensions(BUILT_IN_EXTENSIONS);
    }
  });

  const handleRightClick = async (extensionId: string, extensionName: string, event: React.MouseEvent) => {
    event.preventDefault();

    if (window.electronAPI) {
      const position = {
        x: event.clientX,
        y: event.clientY
      };

      await window.electronAPI.openSideChat(extensionId, extensionName, position);
    }
  };

  const handleToggle = (extensionId: string) => {
    const extension = extensions.find(e => e.id === extensionId);
    if (extension) {
      // Update the extension's enabled state
      setExtensions(extensions.map(e =>
        e.id === extensionId ? { ...e, enabled: !e.enabled } : e
      ));
      toggleExtension(extensionId);
    }
  };

  const getExtensionStatus = (extensionId: string) => {
    const extension = extensions.find(e => e.id === extensionId);
    return extension?.enabled || false;
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-cobalt-900/50 to-transparent border-b border-cobalt-800/30">
        <div className="flex items-center gap-2 mr-4">
          <div className="text-sm font-semibold text-cobalt-300">Extensions</div>
          <div className="text-xs text-cobalt-500">
            {extensions.filter(e => e.enabled).length} active
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {extensions.map((extension) => {
            const isEnabled = getExtensionStatus(extension.id);
            const isActive = activeExtensions.includes(extension.id);

            return (
              <ContextMenu.Root key={extension.id}>
                <ContextMenu.Trigger>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        className={`
                          relative group px-3 py-2 rounded-lg transition-all duration-200
                          ${isEnabled
                            ? 'bg-cobalt-800/40 hover:bg-cobalt-700/50 border border-cobalt-700/50'
                            : 'bg-gray-800/30 hover:bg-gray-700/40 border border-gray-700/30 opacity-50'
                          }
                          ${isActive ? 'ring-2 ring-accent-green shadow-lg shadow-accent-green/20' : ''}
                        `}
                        onMouseEnter={() => setHoveredExtension(extension.id)}
                        onMouseLeave={() => setHoveredExtension(null)}
                        onClick={() => handleToggle(extension.id)}
                        onContextMenu={(e) => handleRightClick(extension.id, extension.name, e)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{extension.icon}</span>
                          <span className="text-xs font-medium text-gray-200">
                            {extension.name}
                          </span>
                          {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                          )}
                        </div>

                        {/* Enabled indicator */}
                        <div className={`
                          absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-cobalt-900
                          ${isEnabled ? 'bg-accent-green' : 'bg-gray-600'}
                        `} />
                      </button>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-cobalt-950 border border-cobalt-700 rounded-lg p-4 shadow-2xl max-w-sm z-50"
                        sideOffset={8}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{extension.icon}</span>
                              <h3 className="font-semibold text-white">{extension.name}</h3>
                            </div>
                            <span className={`
                              text-xs px-2 py-0.5 rounded-full
                              ${isEnabled
                                ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                                : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                              }
                            `}>
                              {isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>

                          <p className="text-sm text-gray-300">{extension.description}</p>

                          <div>
                            <h4 className="text-xs font-semibold text-cobalt-300 mb-1.5">Capabilities:</h4>
                            <ul className="space-y-1">
                              {extension.capabilities.slice(0, 4).map((capability, idx) => (
                                <li key={idx} className="text-xs text-gray-400 flex items-start gap-1.5">
                                  <span className="text-accent-green mt-0.5">•</span>
                                  <span>{capability}</span>
                                </li>
                              ))}
                              {extension.capabilities.length > 4 && (
                                <li className="text-xs text-cobalt-400 italic">
                                  +{extension.capabilities.length - 4} more...
                                </li>
                              )}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-cobalt-300 mb-1.5">Use Cases:</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {extension.useCases.slice(0, 3).map((useCase, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-0.5 rounded bg-cobalt-800/50 text-cobalt-200 border border-cobalt-700/30"
                                >
                                  {useCase}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-cobalt-800/50 text-xs text-cobalt-500">
                            <div className="flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              <span>Right-click to chat about this extension</span>
                            </div>
                          </div>
                        </div>
                        <Tooltip.Arrow className="fill-cobalt-700" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </ContextMenu.Trigger>

                <ContextMenu.Portal>
                  <ContextMenu.Content className="bg-cobalt-950 border border-cobalt-700 rounded-lg p-2 shadow-2xl min-w-[200px] z-50">
                    <ContextMenu.Item
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-cobalt-800/50 cursor-pointer text-sm text-gray-200 outline-none"
                      onSelect={(e) => {
                        e.preventDefault();
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        handleRightClick(extension.id, extension.name, {
                          clientX: rect.left,
                          clientY: rect.bottom,
                          preventDefault: () => {}
                        } as any);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 text-accent-green" />
                      <span>Chat about this extension</span>
                    </ContextMenu.Item>

                    <ContextMenu.Separator className="h-px bg-cobalt-800/50 my-1" />

                    <ContextMenu.Item
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-cobalt-800/50 cursor-pointer text-sm text-gray-200 outline-none"
                      onSelect={() => handleToggle(extension.id)}
                    >
                      {isEnabled ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-accent-green" />
                          <span>Disable extension</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                          <span>Enable extension</span>
                        </>
                      )}
                    </ContextMenu.Item>

                    <ContextMenu.Item
                      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-cobalt-800/50 cursor-pointer text-sm text-gray-200 outline-none"
                    >
                      <Info className="w-4 h-4 text-cobalt-400" />
                      <span>View documentation</span>
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            );
          })}
        </div>
      </div>
    </Tooltip.Provider>
  );
}
