import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
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
        const res = await api.get(`/level/${level}`);
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
    let isSubmitting = false;

    const onKey = async (e) => {
      if (!levelData || gameOverMessage || attempt >= MAX_ATTEMPTS) return;
      if (isSubmitting) return;

      const key = e.key.toLowerCase();

      if (key === "backspace") {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (key === "enter") {
        if (currentGuess.length !== WORD_LENGTH) return;

        if (grid[attempt].some(letter => letter !== "")) return;

        try {
          isSubmitting = true;

          const res = await api.post(
            `/level/${level}/submit`,
            { answer: currentGuess }
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
        } finally {
          isSubmitting = false;
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
      await api.post(
        `/game/level/${level}/retry`,
        {}
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 text-[#E5E5E5] bg-gradient-to-br from-[#0D0D0D] via-[#1a0e2a] to-[#0D0D0D]">
      <h1 className="text-2xl font-extrabold mb-8 text-[#9D4EDD] drop-shadow-[0_0_8px_rgba(157,78,221,0.8)] text-center tracking-wide">
        {levelData.question}
      </h1>

      <div className="grid grid-rows-6 gap-4 mb-6">
        {grid.map((row, i) => (
          <div key={i} className="grid grid-cols-5 gap-4">
            {row.map((ch, j) => {
              const status = feedbackGrid[i][j];
              const displayChar = i === attempt ? currentGuess[j] || "" : ch;

              const base =
                "w-16 h-16 rounded-xl font-extrabold text-2xl flex items-center justify-center border backdrop-blur-md transition-all duration-300 transform";

              const shouldPop = i < attempt && status;
              const animate = shouldPop ? "animate-pop" : "hover:scale-105";

              const statusStyle =
                status === "correct"
                  ? "bg-green-400/20 text-green-300 border-green-400 shadow-[0_0_12px_2px_rgba(0,255,0,0.5)]"
                  : status === "present"
                    ? "bg-yellow-300/20 text-yellow-300 border-yellow-300 shadow-[0_0_12px_2px_rgba(255,255,0,0.4)]"
                    : status === "absent"
                      ? "bg-gray-600/30 text-gray-400 border-gray-500 shadow-[inset_0_0_4px_rgba(255,255,255,0.1)]"
                      : "bg-white/5 text-[#E5E5E5] border-[#3F0071]";

              return (
                <div key={j} className={`${base} ${statusStyle} ${animate}`}>
                  {(displayChar || "").toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 mb-3 italic text-center tracking-wide">
        Type letters. Use Backspace to delete. Press Enter to submit.
      </p>

      {gameOverMessage && (
        <p className="text-lg font-bold mt-2 text-[#D0FF00] animate-pulse tracking-wide text-center drop-shadow-[0_0_8px_#D0FF00]">
          {gameOverMessage}
        </p>
      )}

      {gameOverMessage === "❌ Out of guesses!" && (
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="mt-4 px-6 py-3 bg-yellow-500/20 text-yellow-300 font-bold rounded-xl hover:bg-yellow-600/30 border border-yellow-400 shadow-[0_0_12px_2px_rgba(255,215,0,0.4)] backdrop-blur-md transition-all duration-300 disabled:opacity-50"
        >
          {retrying ? "Retrying..." : "Retry Level (-5 Score)"}
        </button>
      )}
    </div>
  );

}
