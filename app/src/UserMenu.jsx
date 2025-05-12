import React, { useState } from 'react';
import { useTownStore } from './store.js';
import { ProfileView } from './ProfileView.jsx';

export function UserMenu({ onViewProfile }) {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useTownStore((s) => s.logout);

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
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}