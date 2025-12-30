import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Save, FileCode } from 'lucide-react';

interface Props {
  filePath: string | null;
}

export default function CodeEditor({ filePath }: Props) {
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (filePath && window.electronAPI) {
      window.electronAPI.readFile(filePath).then(result => {
        if (result.success) {
          setContent(result.content);
          setHasChanges(false);
        }
      });
    }
  }, [filePath]);

  const handleSave = async () => {
    if (filePath && window.electronAPI) {
      const result = await window.electronAPI.writeFile(filePath, content);
      if (result.success) {
        setHasChanges(false);
      }
    }
  };

  const getLanguageFromPath = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      jsx: 'javascript',
      py: 'python',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      cs: 'csharp',
      php: 'php',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      xml: 'xml',
      md: 'markdown',
      sh: 'shell',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  if (!filePath) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <FileCode className="w-16 h-16 text-cobalt-600 mx-auto" />
          <p className="text-gray-400">Select a file to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-cobalt-900/30 border-b border-cobalt-800/30">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cobalt-400" />
          <span className="text-sm text-gray-300">{filePath.split('/').pop()}</span>
          {hasChanges && (
            <span className="w-2 h-2 rounded-full bg-accent-amber" />
          )}
        </div>

        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-cobalt-600 hover:bg-cobalt-500 text-white text-sm rounded transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        )}
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageFromPath(filePath)}
          value={content}
          onChange={(value) => {
            setContent(value || '');
            setHasChanges(true);
          }}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
