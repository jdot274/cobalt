import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainWorkspace from './components/MainWorkspace';
import SideChat from './components/SideChat';
import { ExtensionProvider } from './contexts/ExtensionContext';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(typeof window.electronAPI !== 'undefined');
  }, []);

  return (
    <Router>
      <ExtensionProvider>
        <ChatProvider>
          <div className="w-full h-full bg-[#0a0a0a] text-white">
            <Routes>
              <Route path="/" element={<MainWorkspace />} />
              <Route path="/side-chat/:toolId" element={<SideChat />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ChatProvider>
      </ExtensionProvider>
    </Router>
  );
}

export default App;
