import { useState } from 'react';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';

export default function IDEWorkspace() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [terminalHeight, setTerminalHeight] = useState(200);

  return (
    <div className="flex h-full bg-gradient-to-br from-cobalt-950/50 to-black">
      {/* File Explorer */}
      <div className="w-64 border-r border-cobalt-800/30">
        <FileExplorer onFileSelect={setSelectedFile} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor filePath={selectedFile} />
        </div>

        {/* Resizable Divider */}
        <div
          className="h-1 bg-cobalt-800/30 hover:bg-cobalt-700 cursor-row-resize transition-colors"
          onMouseDown={(e) => {
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = terminalHeight;

            const handleMouseMove = (moveEvent: MouseEvent) => {
              const deltaY = startY - moveEvent.clientY;
              const newHeight = Math.max(100, Math.min(400, startHeight + deltaY));
              setTerminalHeight(newHeight);
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Terminal */}
        <div style={{ height: terminalHeight }}>
          <Terminal />
        </div>
      </div>
    </div>
  );
}
