import { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';

interface FileNode {
  name: string;
  isDirectory: boolean;
  path: string;
  children?: FileNode[];
}

interface Props {
  onFileSelect: (filePath: string) => void;
}

export default function FileExplorer({ onFileSelect }: Props) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [currentPath, setCurrentPath] = useState(
    window.electronAPI?.platform === 'darwin' ? '/Users' : 'C:\\'
  );

  const loadDirectory = async (path: string) => {
    if (window.electronAPI) {
      const result = await window.electronAPI.readDirectory(path);
      if (result.success) {
        const nodes: FileNode[] = result.files.map((f: any) => ({
          name: f.name,
          isDirectory: f.isDirectory,
          path: `${path}/${f.name}`,
        }));
        return nodes;
      }
    }
    return [];
  };

  useEffect(() => {
    loadDirectory(currentPath).then(setFiles);
  }, [currentPath]);

  const toggleFolder = async (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
      // Load children if not loaded
      const children = await loadDirectory(path);
      setFiles(prevFiles => {
        const updateNode = (nodes: FileNode[]): FileNode[] => {
          return nodes.map(node => {
            if (node.path === path) {
              return { ...node, children };
            }
            if (node.children) {
              return { ...node, children: updateNode(node.children) };
            }
            return node;
          });
        };
        return updateNode(prevFiles);
      });
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);

    return (
      <div key={node.path}>
        <div
          className={`
            flex items-center gap-2 px-2 py-1.5 cursor-pointer
            hover:bg-cobalt-800/30 transition-colors
          `}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.isDirectory) {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          {node.isDirectory ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <Folder className="w-4 h-4 text-cobalt-400" />
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className="text-sm text-gray-300 truncate">{node.name}</span>
        </div>

        {node.isDirectory && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-cobalt-900/20">
      <div className="flex items-center justify-between px-3 py-2 border-b border-cobalt-800/30">
        <h3 className="text-sm font-semibold text-gray-300">Explorer</h3>
        <button
          onClick={() => loadDirectory(currentPath).then(setFiles)}
          className="p-1 rounded hover:bg-cobalt-800/30 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <input
            type="text"
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                loadDirectory(currentPath).then(setFiles);
              }
            }}
            className="w-full px-2 py-1 text-xs bg-cobalt-900/50 border border-cobalt-700/50 rounded text-gray-300 mb-2"
            placeholder="Path..."
          />
        </div>

        <div>
          {files.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No files found
            </div>
          ) : (
            files.map(node => renderNode(node))
          )}
        </div>
      </div>
    </div>
  );
}
