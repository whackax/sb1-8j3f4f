import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { login } from '../services/api';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setIsAuthenticated } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(username, password);
      setUser({ username, iconUrl: 'default-icon.png' });
      setIsAuthenticated(true);
      localStorage.setItem('token', data.access_token);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};