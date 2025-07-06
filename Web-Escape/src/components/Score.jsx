// src/components/Score.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Score = ({ currentLevel }) => {
  const [score, setScore] = useState(0);

  // Fetch score initially
  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/game/progress/score", {
          withCredentials: true,
        });
        setScore(res.data.score || 0);
      } catch (err) {
        console.error("Failed to fetch score", err);
      }
    };
    fetchScore();
  }, []);

  // Update score when currentLevel changes
  useEffect(() => {
    const updateScore = async () => {
      try {
        const res = await axios.patch(
          "http://localhost:3000/api/v1/game/progress/score",
          {
            increment: 10,
            currentLevel: currentLevel, // pass correctly
          },
          { withCredentials: true }
        );
        setScore(res.data.score);
      } catch (err) {
        console.error("Failed to update score", err);
      }
    };

    if (currentLevel > 1 && currentLevel <= 10) {
      updateScore();
    }
  }, [currentLevel]);

  return (
    <div className="text-lg font-bold text-yellow-500">
      🏆 Score: {score}
    </div>
  );
};

export default Score;
