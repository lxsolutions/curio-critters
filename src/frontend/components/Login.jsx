
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [grade, setGrade] = useState('1');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    // Store user info in localStorage for now
    localStorage.setItem('user', JSON.stringify({ username, grade }));

    // Redirect to pet care game
    navigate('/pet-care');
  };

  return (
    <div className="login-container flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome to Curio Critters!</h1>

      <div className="login-card bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
              Your Grade
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={(i + 1).toString()}>
                  Grade {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Adventure!
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
