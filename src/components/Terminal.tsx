import { useEffect, useRef, useState } from 'react';
import { Terminal as XTermTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { X, Maximize2, Minimize2 } from 'lucide-react';

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTermTerminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cwd, setCwd] = useState(process.env.HOME || '/');

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      // Create terminal
      const term = new XTermTerminal({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
        theme: {
          background: '#0a0a0a',
          foreground: '#ffffff',
          cursor: '#10b981',
          black: '#000000',
          red: '#ef4444',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          magenta: '#a855f7',
          cyan: '#06b6d4',
          white: '#ffffff',
        },
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      // Welcome message
      term.writeln('Welcome to Cobalt Terminal');
      term.writeln('Type commands below and press Enter to execute');
      term.writeln('');
      term.write('$ ');

      // Handle resize
      const handleResize = () => fitAddon.fit();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.dispose();
      };
    }
  }, []);

  const executeCommand = async (cmd: string) => {
    const term = xtermRef.current;
    if (!term || !window.electronAPI) return;

    term.writeln('');

    if (cmd.trim() === 'clear') {
      term.clear();
      term.write('$ ');
      return;
    }

    if (cmd.trim().startsWith('cd ')) {
      const newPath = cmd.trim().substring(3);
      setCwd(newPath);
      term.writeln(`Changed directory to: ${newPath}`);
      term.write('$ ');
      return;
    }

    const result = await window.electronAPI.executeTerminalCommand(cmd, cwd);

    if (result.success) {
      if (result.stdout) {
        term.writeln(result.stdout);
      }
      if (result.stderr) {
        term.writeln(`\x1b[31m${result.stderr}\x1b[0m`);
      }
    } else {
      term.writeln(`\x1b[31mError: ${result.error}\x1b[0m`);
    }

    term.write('$ ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setHistory(prev => [...prev, command]);
    executeCommand(command);
    setCommand('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-t border-cobalt-800/30">
      <div className="flex items-center justify-between px-3 py-1.5 bg-cobalt-900/30 border-b border-cobalt-800/30">
        <span className="text-xs font-semibold text-gray-400">TERMINAL</span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-cobalt-800/30 transition-colors">
            <Minimize2 className="w-3 h-3 text-gray-400" />
          </button>
          <button className="p-1 rounded hover:bg-cobalt-800/30 transition-colors">
            <Maximize2 className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div ref={terminalRef} className="w-full h-full p-2" />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-cobalt-800/30 p-2 bg-cobalt-900/20">
        <div className="flex items-center gap-2">
          <span className="text-xs text-accent-green">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type command..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-600"
          />
        </div>
      </form>
    </div>
  );
}
