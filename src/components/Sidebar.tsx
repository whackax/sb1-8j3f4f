import React from 'react';
import { useStore } from '../store/useStore';
import { Conversation } from '../types';
import { uploadIcon } from '../services/api';

export const Sidebar: React.FC = () => {
  const {
    conversations,
    activeConversation,
    user,
    createNewConversation,
    setActiveConversation,
    setUser,
    setIsAuthenticated,
  } = useStore();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const data = await uploadIcon(token, file);
      if (user) {
        setUser({
          ...user,
          iconUrl: `${data.icon_filename}?t=${Date.now()}`,
        });
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
      alert('Failed to upload icon');
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="flex-shrink-0 px-4 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sejong University Assistant</h2>
        <button
          onClick={createNewConversation}
          className="bg-gray-700 px-2 py-1 rounded-md text-sm hover:bg-gray-600"
        >
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {conversations.map((conv: Conversation) => (
          <button
            key={conv.id}
            onClick={() => setActiveConversation(conv)}
            className={`w-full text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
              activeConversation?.id === conv.id ? 'bg-gray-700' : ''
            }`}
          >
            {conv.title}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 bg-gray-800 flex items-center space-x-2">
        <label className="cursor-pointer">
          <img
            src={user?.iconUrl || 'default-icon.png'}
            alt="User Icon"
            className="w-8 h-8 rounded-full"
          />
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            onChange={handleIconUpload}
          />
        </label>
        <span className="text-white text-sm font-medium">{user?.username}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-2 py-1 rounded-md text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};