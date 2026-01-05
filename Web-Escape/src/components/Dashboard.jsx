import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

const TOTAL_LEVELS = 10;

const Dashboard = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/game/progress');
        setProgress(response.data);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleStartNewGame = async () => {
    try {
      const response = await api.post('/game/progress/reset', {});

      setProgress(response.data);
      navigate(`/level/1`);
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  const handleResumeGame = () => {
    const level = progress?.levelStatus?.filter(Boolean).length + 1 || 0;
    navigate(`/level/${level}`);
  };

  const levelsCompleted = progress?.levelStatus?.filter(Boolean).length || 0;
  const allCompleted = levelsCompleted === TOTAL_LEVELS;

  if (loading || !progress || !progress.levelStatus) {
    return <div className="text-black text-xl p-6">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Game Dashboard</h1>

      <p className="mb-6 text-lg">
        Levels completed: <span className="font-semibold">{levelsCompleted}/{TOTAL_LEVELS}</span>
      </p>

      {levelsCompleted > 0 && levelsCompleted < TOTAL_LEVELS && (
        <button
          onClick={handleResumeGame}
          className="mb-4 px-6 py-2 bg-green-500 rounded hover:bg-green-600 text-lg"
        >
          Resume Game
        </button>
      )}

      {allCompleted && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">Congratulations!</h2>
          <p>You’ve completed all levels. Want to play again?</p>
        </div>
      )}

      <button
        onClick={handleStartNewGame}
        className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 text-lg"
      >
        Start New Game
      </button>
    </div>
  );
};

export default Dashboard;
