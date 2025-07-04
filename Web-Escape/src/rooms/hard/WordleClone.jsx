import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useGameStore from "../../state/gameStore";
import LevelCompleteScreen from "../../components/LevelCompleteScreen";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

export default function WordleGame() {
  const { id } = useParams();
  const level = parseInt(id, 10);

  const [levelData, setLevelData] = useState(null);
  const [grid, setGrid] = useState([]);
  const [feedbackGrid, setFeedbackGrid] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [retrying, setRetrying] = useState(false); 

  const { setCurrentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    setCurrentLevel(level); 
  }, [level]);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/level/${level}`, {
          withCredentials: true,
        });
        setLevelData(res.data);
        setGrid(Array(MAX_ATTEMPTS).fill().map(() => Array(WORD_LENGTH).fill("")));
        setFeedbackGrid(Array(MAX_ATTEMPTS).fill().map(() => Array(WORD_LENGTH).fill("")));
      } catch (err) {
        console.error("Failed to fetch level", err);
        setGameOverMessage("⚠️ Failed to load level.");
      }
    };
    fetchLevel();
  }, [level]);

  useEffect(() => {
    const onKey = async (e) => {
      if (!levelData || gameOverMessage || attempt >= MAX_ATTEMPTS) return;
      const key = e.key.toLowerCase();

      if (key === "backspace") {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (key === "enter") {
        if (currentGuess.length !== WORD_LENGTH) return;

        try {
          const res = await axios.post(
            `http://localhost:3000/api/v1/level/${level}/submit`,
            { answer: currentGuess },
            { withCredentials: true }
          );

          const fb = res.data.feedback;
          const newGrid = [...grid];
          const newFB = [...feedbackGrid];
          newGrid[attempt] = currentGuess.split("");
          newFB[attempt] = fb;
          setGrid(newGrid);
          setFeedbackGrid(newFB);

          if (res.data.success) {
            completeLevel(level);
            updateScore(10);
            setGameOverMessage("🎉 You guessed it!");
            setTimeout(() => setShowCompleteScreen(true), 1500); 
          } else if (attempt + 1 >= MAX_ATTEMPTS) {
            setGameOverMessage("❌ Out of guesses!");
          }

          setAttempt(a => a + 1);
          setCurrentGuess("");
        } catch (err) {
          console.error("Submit error:", err);
        }
      } else if (/^[a-z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + key);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [levelData, currentGuess, attempt, grid, feedbackGrid, gameOverMessage]);

  const handleRestart = () => {
    setGrid(Array(MAX_ATTEMPTS).fill().map(() => Array(WORD_LENGTH).fill("")));
    setFeedbackGrid(Array(MAX_ATTEMPTS).fill().map(() => Array(WORD_LENGTH).fill("")));
    setCurrentGuess("");
    setAttempt(0);
    setGameOverMessage("");
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/game/level/${level}/retry`,
        {},
        { withCredentials: true }
      );
      handleRestart(); 
    } catch (err) {
      console.error("Retry failed", err);
    } finally {
      setRetrying(false);
    }
  };

 
  if (showCompleteScreen) return <LevelCompleteScreen />;

  if (!levelData || !levelData.question) {
    return <div className="text-white text-center mt-10">Loading or invalid data...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-xl font-bold mb-4">{levelData.question}</h1>

      <div className="grid grid-rows-6 gap-2 mb-4">
        {grid.map((row, i) => (
          <div key={i} className="grid grid-cols-5 gap-1">
            {row.map((ch, j) => {
              const status = feedbackGrid[i][j];
              const color =
                status === "correct"
                  ? "bg-green-500"
                  : status === "present"
                  ? "bg-yellow-500"
                  : status === "absent"
                  ? "bg-gray-700"
                  : "";
              const displayChar = i === attempt ? currentGuess[j] || "" : ch;

              return (
                <div
                  key={j}
                  className={`w-10 h-10 flex items-center justify-center border ${color} text-xl font-bold`}
                >
                  {(displayChar || "").toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 mb-2">
        Type letters. Use Backspace to delete. Press Enter to submit.
      </p>
        
      {gameOverMessage && (
        <p className="text-xl font-bold mt-2 text-green-400">{gameOverMessage}</p>
      )}

      {gameOverMessage === "❌ Out of guesses!" && (
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-xl hover:bg-yellow-600 transition disabled:opacity-50"
        >
          {retrying ? "Retrying..." : "Retry Level (-5 Score)"}
        </button>
      )}

    </div>
  );
}
