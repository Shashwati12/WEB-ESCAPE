import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Confetti from 'react-confetti';

const Victory = () => {
    const navigate = useNavigate();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [gameStats, setGameStats] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/game/progress');
                setGameStats(response.data);
            } catch (error) {
                console.error('Failed to fetch game stats:', error);
            }
        };
        fetchStats();
    }, []);

    const handleReplay = async () => {
        try {
            await api.post('/game/progress/reset', {});
            navigate('/level/1');
        } catch (error) {
            console.error('Failed to restart game:', error);
        }
    };

    const handleDashboard = () => {
        navigate('/dashboard');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={true}
                numberOfPieces={200}
            />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center shadow-2xl">
                {/* Trophy Icon */}
                <div className="mb-8 animate-bounce">
                    <div className="text-8xl">🏆</div>
                </div>

                {/* Main Congratulations */}
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-4 animate-pulse">
                    CONGRATULATIONS!
                </h1>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    You Have Escaped The Web! 🎉
                </h2>

                <p className="text-xl text-gray-300 mb-8">
                    You've successfully completed all 10 levels and conquered every challenge!
                </p>

                {/* Game Stats */}
                {gameStats && (
                    <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/20">
                        <h3 className="text-2xl font-bold text-yellow-400 mb-4">Your Stats</h3>
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-gray-400 text-sm">Final Score</p>
                                <p className="text-3xl font-bold text-green-400">{gameStats.score}</p>
                            </div>
                            <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-gray-400 text-sm">Total Time</p>
                                <p className="text-3xl font-bold text-blue-400">{formatTime(gameStats.timer || 0)}</p>
                            </div>
                            <div className="bg-black/30 rounded-xl p-4 col-span-2">
                                <p className="text-gray-400 text-sm">Levels Completed</p>
                                <p className="text-3xl font-bold text-purple-400">10/10</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleReplay}
                        className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            🔄 Play Again
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>

                    <button
                        onClick={handleDashboard}
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            🏠 Dashboard
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="mt-8 flex justify-center gap-4 text-4xl">
                    <span className="animate-bounce delay-100">🎮</span>
                    <span className="animate-bounce delay-200">⭐</span>
                    <span className="animate-bounce delay-300">🎯</span>
                    <span className="animate-bounce delay-400">🚀</span>
                </div>
            </div>
        </div>
    );
};

export default Victory;
