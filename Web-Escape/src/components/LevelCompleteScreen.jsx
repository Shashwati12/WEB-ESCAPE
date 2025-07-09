import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../state/gameStore';



const LevelCompleteScreen = () => {
  const navigate = useNavigate();
  

  const { currentLevel, setCurrentLevel } = useGameStore();

  const handleNext = () => {
     window.dispatchEvent(new Event('scoreUpdated'));
    if (currentLevel < 10) {
      setCurrentLevel(currentLevel + 1);
      navigate(`/level/${currentLevel + 1}`);
    } else {
      navigate('/game-complete');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center p-6">
      <h1 className="text-4xl font-bold mb-4">🎉 Room {currentLevel} Escaped!</h1>
      <p className="text-lg mb-6">You did it! Now let’s move to the next challenge.</p>
        
         
      <button
        onClick={handleNext}
      
        className="px-6 py-3 bg-purple-600 hover:bg-purple-800 transition rounded-2xl text-xl font-semibold shadow-xl"
      >
        Next Room →
      </button>
    </div>
  );
};

export default LevelCompleteScreen;
