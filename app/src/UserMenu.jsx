import React, { useState, useEffect } from 'react';
import { useTownStore } from './store.js';
import { ProfileView } from './ProfileView.jsx';
import { Leaderboard } from './Leaderboard.jsx';

export function UserMenu({ onViewProfile, onViewLeaderboard }) {
  const [isOpen, setIsOpen] = useState(false);
  const resetGrid = useTownStore((s) => s.resetGrid);

  useEffect(() => {
    window.handleLogout = function () {
      const auth = window.firebaseAuth;
      auth.signOut().then(() => {
        // Clear the town map/grid on logout
        resetGrid();

        // Hide app
        document.getElementById("app").style.display = "none";

        // Create and append login form
        const loginForm = document.createElement("div");
        loginForm.id = "login-form";
        loginForm.className = "w-full max-w-sm p-6";
        loginForm.innerHTML = `
          <input type="email" id="email" placeholder="Email" class="w-full p-3 mb-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
          <input type="password" id="password" placeholder="Password" class="w-full p-3 mb-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
          <button onclick="handleLogin()" class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">Login</button>
          <button onclick="handleRegister()" class="w-full py-3 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">Register</button>
          <button onclick="handleGoogleLogin()" class="w-full py-3 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">Login with Google</button>
        `;

        // Remove existing login form if it exists
        const existingForm = document.getElementById("login-form");
        if (existingForm) {
          existingForm.remove();
        }

        // Add the new form to the document
        const container = document.createElement("div");
        container.className = "w-full max-w-sm";
        container.appendChild(loginForm);
        document.body.appendChild(container);

      }).catch((error) => {
        console.error("Logout error:", error.message);
      });
    };
  }, [resetGrid]);

  const handleLogout = () => {
    window.handleLogout();
    setIsOpen(false);
  };

  return (
    <div className="absolute right-4 top-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600"
      >
        👤
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2">
          <button
            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700"
            onClick={() => {
              setIsOpen(false);
              onViewProfile();
            }}
          >
            View Profile
          </button>
          <button
            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700"
            onClick={() => {
              setIsOpen(false);
              if (onViewLeaderboard) onViewLeaderboard();
            }}
          >
            View Leaderboard
          </button>
          <button
            className="w-full px-4 py-2 text-left text-white hover:bg-gray-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function App() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  if (showLeaderboard) {
    return <Leaderboard onBack={() => setShowLeaderboard(false)} />;
  }

  return (
    <div className="p-6 text-center">
      <UserMenu onViewProfile={() => setShowProfile(true)} />
      <h1 className="text-2xl font-bold mb-4">Tiny Towns Builder</h1>
      {/* ... */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleResetGame}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset Game
        </button>
        <button
          onClick={handleEndGame}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          End Game
        </button>
        <button
          onClick={() => setShowLeaderboard(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Leaderboard
        </button>
      </div>
    </div>
  );
}