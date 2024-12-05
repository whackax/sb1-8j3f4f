import React from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { useStore } from './store/useStore';

function App() {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatArea />
    </div>
  );
}

export default App;