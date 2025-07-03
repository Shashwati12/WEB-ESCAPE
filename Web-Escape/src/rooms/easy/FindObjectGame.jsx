import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGameStore from "../../state/gameStore";
import axios from "axios";
import LevelCompleteScreen from "../../components/LevelCompleteScreen"; 
import useAttempt from "../../hooks/useAttempt";

export default function FindObjectGame() {
  const { id } = useParams();
  const level = parseInt(id, 10); 

  const [levelData, setLevelData] = useState(null);
  const [found, setFound] = useState(false);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);

  const {
    attemptsLeft,
    isLocked,
    retrying,
    handleUseAttempt,
    handleRetry,
  } = useAttempt(level);

  const {
    currentLevel,
    setCurrentLevel,
    completeLevel,
    updateScore,
  } = useGameStore();

  useEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/level/${level}`,
          { withCredentials: true }
        );
        setLevelData(response.data);
      } catch (error) {
        console.error("Failed to fetch level data:", error);
      }
    };

    fetchLevelData();
  }, [level]);

  const handleClick = async (e) => {
    if (found || isLocked) return; 

    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/level/${level}/submit`,
        {
          x: clickX.toString(),
          y: clickY.toString(),
        },
        { withCredentials: true }
      );

      if (response.data.message === "Correct answer" && !found) {
        setFound(true);
        completeLevel(level);
        updateScore(10);
        setTimeout(() => setShowCompleteScreen(true), 1500);
      } else if (response.data.message === "Wrong answer") {
        setWrongMessage(true);
        setTimeout(() => setWrongMessage(false), 2000);

        await handleUseAttempt();

      }

      console.log(response.data.message);
    } catch (error) {
      console.error("Failed to submit level answer:", error);
    }
  };

  if (showCompleteScreen) return <LevelCompleteScreen />;

  if (!levelData) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center text-white min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 {levelData.question}</h1>

      {attemptsLeft !== null && (
        <p className="mb-2 text-sm text-yellow-300">
          Attempts Left: {attemptsLeft}
        </p>
      )}

      {isLocked && (
        <div className="text-red-400 font-bold mb-3 text-lg">
          ❌ No attempts left!
        </div>
      )}

      <div className="relative">
        <img
          src={`http://localhost:3000/${levelData.data}`}
          alt={levelData.question}
          onClick={handleClick}
          className={`max-w-full border-4 ${
            found ? "border-green-500" : "border-white"
          } cursor-crosshair`}
        />

        {found && (
          <div className="absolute inset-0 flex items-center justify-center text-green-400 text-3xl font-bold bg-black/50">
            ✅ Object Found!
          </div>
        )}
        {wrongMessage && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-3xl font-bold bg-black/50">
            ❌ Wrong object!
          </div>
        )}
      </div>

      {isLocked && (
        <button
          onClick={handleRetry}
          className="mt-6 px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
          disabled={retrying}
        >
          Retry Level (-5 Score)
        </button>
      )}

    </div>
  );
}
