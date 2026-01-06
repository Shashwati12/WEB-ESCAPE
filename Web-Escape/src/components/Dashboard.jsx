import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

const TOTAL_LEVELS = 10;

const Dashboard = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
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

    // Get username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    fetchProgress();
  }, []);

  const handleStartNewGame = async () => {
    try {
      await api.post('/game/progress/reset', {});

      // Add delay and navigate
      await new Promise(resolve => setTimeout(resolve, 200));
      window.dispatchEvent(new Event('scoreUpdated'));
      navigate(`/level/1`);
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  const handleResumeGame = () => {
    const level = progress?.levelStatus?.filter(Boolean).length + 1 || 0;
    navigate(`/level/${level}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const levelsCompleted = progress?.levelStatus?.filter(Boolean).length || 0;
  const allCompleted = levelsCompleted === TOTAL_LEVELS;

  if (loading || !progress || !progress.levelStatus) {
    return <div className="text-black text-xl p-6">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      {/* Username Welcome Message */}
      {username && (
        <div className="mb-6 text-center">
          <p className="text-2xl font-semibold text-blue-400">
            Welcome back, <span className="text-yellow-400">{username}</span>! 👋
          </p>
        </div>
      )}

      {allCompleted ? (
        // Completion Screen
        <div className="max-w-3xl w-full">
          {/* Congratulations Header */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4">
              CONGRATULATIONS!
            </h1>
            <h2 className="text-3xl font-bold text-white mb-2">
              You Completed All The Levels! 🏆
            </h2>
            <p className="text-xl text-gray-300">
              You've mastered every challenge and escaped the web!
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Your Achievement Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-2xl p-6 border border-green-700/50 text-center transform hover:scale-105 transition-transform">
                <p className="text-gray-300 text-sm mb-2">Final Score</p>
                <p className="text-4xl font-bold text-green-400">{progress.score}</p>
                <p className="text-xs text-gray-400 mt-2">Points Earned</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-2xl p-6 border border-blue-700/50 text-center transform hover:scale-105 transition-transform">
                <p className="text-gray-300 text-sm mb-2">Total Time</p>
                <p className="text-4xl font-bold text-blue-400">{formatTime(progress.timer || 0)}</p>
                <p className="text-xs text-gray-400 mt-2">Time Taken</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-6 border border-purple-700/50 text-center transform hover:scale-105 transition-transform">
                <p className="text-gray-300 text-sm mb-2">Completion</p>
                <p className="text-4xl font-bold text-purple-400">100%</p>
                <p className="text-xs text-gray-400 mt-2">All Levels Done</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartNewGame}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                🔄 Replay Game
              </span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                🏠 Home
              </span>
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center gap-6 text-4xl">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '100ms' }}>🎮</span>
            <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🏆</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🎯</span>
            <span className="animate-bounce" style={{ animationDelay: '400ms' }}>⭐</span>
          </div>
        </div>
      ) : (
        // Regular Dashboard
        <div className="max-w-2xl w-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-3xl p-10 border border-gray-700 shadow-2xl">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Game Dashboard
          </h1>

          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="text-lg text-gray-300">Your Progress</p>
              <span className="text-2xl font-bold text-blue-400">{levelsCompleted}/{TOTAL_LEVELS}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(levelsCompleted / TOTAL_LEVELS) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              {levelsCompleted === 0 ? 'Start your journey!' : `${TOTAL_LEVELS - levelsCompleted} levels remaining`}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Current Score</p>
              <p className="text-2xl font-bold text-green-400">{progress.score}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Time Played</p>
              <p className="text-2xl font-bold text-blue-400">{formatTime(progress.timer || 0)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            {levelsCompleted > 0 && levelsCompleted < TOTAL_LEVELS && (
              <button
                onClick={handleResumeGame}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-200"
              >
                ▶ Resume Game (Level {levelsCompleted + 1})
              </button>
            )}

            <button
              onClick={handleStartNewGame}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200"
            >
              {levelsCompleted > 0 ? '🔄 Start New Game' : '🚀 Start Game'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
