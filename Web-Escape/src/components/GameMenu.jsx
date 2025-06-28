import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import axios from 'axios';

const TOTAL_LEVELS = 10;

const GameMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartNewGame = async () => {
    try {
      const resetData = {
        currentLevel: 0,
        levelStatus: Array(TOTAL_LEVELS).fill(false),
        score: 0,
        timer: 0,
        assignedLevels: {},
        shuffledCards: {},
      };

      await axios.put('http://localhost:3000/api/v1/game/progress', resetData, {
        withCredentials: true,
      });

      navigate(`/level/1`)
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  const handleQuitGame = async () => {
    const confirmQuit = window.confirm('Are you sure you want to quit the game and return to dashboard?');
    if (!confirmQuit) return;

    try {
      const resetData = {
        currentLevel: 0,
        levelStatus: Array(TOTAL_LEVELS).fill(false),
        score: 0,
        timer: 0,
        assignedLevels: {},
        shuffledCards: {},
      };

      await axios.put('http://localhost:3000/api/v1/game/progress', resetData, {
        withCredentials: true,
      });

      navigate(`/dashboard`)
    } catch (error) {
      console.error('Failed to quit game:', error);
    }
  };


  const handleDashboard = () => {
    navigate('/dashboard')
  };

return (
    <div className="absolute top-4 right-4 z-50">
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
          <button className="w-full text-left hover:text-blue-600 transition" onClick={handleStartNewGame}>
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
