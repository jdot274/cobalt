import { createContext, useContext, ReactNode } from 'react';

interface ExtensionContextType {
  // Add extension-specific context methods here
}

const ExtensionContext = createContext<ExtensionContextType | undefined>(undefined);

export function ExtensionProvider({ children }: { children: ReactNode }) {
  return (
    <ExtensionContext.Provider value={{}}>
      {children}
    </ExtensionContext.Provider>
  );
}

export function useExtensionContext() {
  const context = useContext(ExtensionContext);
  if (context === undefined) {
    throw new Error('useExtensionContext must be used within an ExtensionProvider');
  }
  return context;
}
