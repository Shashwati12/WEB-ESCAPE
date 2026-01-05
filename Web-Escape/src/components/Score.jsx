import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ScoreDisplay = () => {
  const [score, setScore] = useState(0);


  const fetchScore = async () => {
    try {
      const res = await api.get('/game/progress');
      setScore(res.data.score || 0);
    } catch (error) {
      console.error('Failed to fetch score:', error);
    }
  };

  useEffect(() => {
    fetchScore();


    const handleScoreUpdate = () => {
      fetchScore();
    };

    window.addEventListener('scoreUpdated', handleScoreUpdate);
    window.addEventListener('resetTimer', handleScoreUpdate);

    return () => {
      window.removeEventListener('scoreUpdated', handleScoreUpdate);
      window.removeEventListener('resetTimer', handleScoreUpdate);
    };
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-lg px-4 py-2 rounded-2xl shadow text-yellow-700 text-[15px] font-semibold">
      🏆 Score: {score}
    </div>
  );
};

export default ScoreDisplay;








