import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { sendMessage } from '../services/api';

export const ChatArea: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const { activeConversation, addMessage } = useStore();

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [activeConversation?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConversation) return;

    const userMessage = { content: input, sender: 'user' as const };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const history = activeConversation.messages
        .filter((msg) => msg.sender === 'user')
        .map((msg) => msg.content);

      const data = await sendMessage(userMessage.content, history);
      addMessage({ content: data.response, sender: 'bot' });
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div
        ref={chatboxRef}
        className="flex-1 p-6 overflow-y-auto bg-white"
      >
        {activeConversation?.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } mb-4`}
          >
            <div
              className={`max-w-md px-4 py-2 rounded-lg shadow ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-4 bg-white">
          <div className="loader"></div>
        </div>
      )}

      <div className="border-t border-gray-200 p-4 flex items-center space-x-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};