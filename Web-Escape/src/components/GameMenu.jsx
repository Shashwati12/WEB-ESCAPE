import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import api from '../api/axios';

const TOTAL_LEVELS = 10;

const GameMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartNewGame = async () => {
    try {
      await api.post('/game/progress/reset', {});
      window.dispatchEvent(new Event('resetTimer'));
      window.dispatchEvent(new Event('scoreUpdated'));
      navigate(`/level/1`);
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  const handleRestartGame = async () => {
    try {
      // Reset progress in backend (including timer to 0)
      await api.post('/game/progress/reset', {});

      // Add a small delay to ensure backend has completed the reset
      await new Promise(resolve => setTimeout(resolve, 200));

      // Hard refresh to level 1 - Timer will fetch reset value (0) from backend
      window.location.href = '/level/1';

    } catch (error) {
      console.error("Failed to restart game:", error);
    }
  };



  const handleQuitGame = async () => {
    const confirmQuit = window.confirm('Are you sure you want to quit the game and return to dashboard?');
    if (!confirmQuit) return;

    try {
      await api.post('/game/progress/reset', {});
      window.dispatchEvent(new Event('resetTimer'));
      window.dispatchEvent(new Event('scoreUpdated'));
      navigate(`/dashboard`)
    } catch (error) {
      console.error('Failed to quit game:', error);
    }
  };


  const handleDashboard = () => {
    navigate('/dashboard')
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-auto">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-white hover:scale-105 rounded-full shadow backdrop-blur-md transition filter grayscale contrast-125"
        >
          <Menu className="w-5 h-5 text-gray-900" />
        </button>
      )}

      {isOpen && (
        <div className="w-56 bg-white/90 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-4 space-y-3 text-[15px] text-gray-800 animate-fade-in">
          <button className="w-full text-left hover:text-blue-600 transition" onClick={handleRestartGame}>
            🔁 Restart the Game
          </button>
          <button className="w-full text-left hover:text-blue-600 transition" onClick={handleDashboard}>
            🏠 Dashboard
          </button>
          <button className="w-full text-left text-red-600 hover:text-red-700 transition" onClick={handleQuitGame}>
            🚪 Quit Game
          </button>
          <div className="border-t border-gray-300 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-gray-600 hover:text-black transition"
            >
              ✖ Close Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMenu;
