
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useGameStore from "../../state/gameStore";
import LevelCompleteScreen from "../../components/LevelCompleteScreen";
import useAttempt from "../../hooks/useAttempt";

export default function ShadowShapeLevel() {
  const { id } = useParams();
  const level = parseInt(id, 10);

  const [levelData, setLevelData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);

  const { currentLevel, setCurrentLevel, completeLevel, updateScore } = useGameStore();

  const {
    attemptsLeft,
    isLocked,
    retrying,
    handleUseAttempt,
    handleRetry,
  } = useAttempt(level);

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
        console.error("Error fetching shadow shape data:", error);
        setFeedback("⚠️ Failed to load the puzzle.");
      }
    };

    fetchLevelData();
  }, [level]);

  const handleSubmit = async () => {
    if (!userAnswer.trim() || isSubmitting || isLocked) return;
    setIsSubmitting(true);
    setFeedback("");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/level/${level}/submit`,
        { answer: userAnswer },
        { withCredentials: true }
      );

      const correct = response.data.message === "Correct answer";
      if (correct) {
        setFeedback("✅ Correct!");
        completeLevel(level);
        updateScore(10);
        setFinished(true);
        setTimeout(() => setShowCompleteScreen(true), 1500);
      } else {
        setFeedback("❌ Incorrect! Try again.");
        await handleUseAttempt();
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setFeedback("⚠️ Submission failed.");
    }

    setIsSubmitting(false);
  };

  if (showCompleteScreen) return <LevelCompleteScreen />;

  if (!levelData || !levelData.data || !levelData.data.image) {
    return <div className="text-white mt-10 text-center">Loading or invalid data...</div>;
  }

  const currentPuzzle = levelData.data;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">🕶️ Shadow Shape</h1>
      <p className="text-lg mb-4 text-center max-w-xl whitespace-pre-line">
        {levelData.question}
      </p>

      {attemptsLeft !== null && (
        <p className="text-yellow-300 mb-2">🧠 Attempts Left: {attemptsLeft}</p>
      )}

      {isLocked && (
        <p className="text-red-400 font-semibold text-lg mb-2">❌ No attempts left</p>
      )}

      <div className="mb-6">
        <img
          src={`http://localhost:3000/${currentPuzzle.image}`}
          alt="shadow"
          className="w-64 h-64 object-contain border-2 border-white rounded-lg"
        />
      </div>

      {!finished && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer"
            disabled={isLocked || isSubmitting}
            className="px-4 py-2 rounded text-black w-64 text-center bg-white disabled:opacity-60"
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !userAnswer.trim()}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition-all disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      )}

      {feedback && (
        <p
          className={`mt-6 text-xl ${
            feedback.startsWith("✅")
              ? "text-green-400"
              : feedback.startsWith("❌")
              ? "text-red-400"
              : "text-yellow-300"
          }`}
        >
          {feedback}
        </p>
      )}

      {finished && (
        <p className="mt-8 text-3xl font-bold text-green-400">
          🎉 Shadow Solved!
        </p>
      )}

      {isLocked && (
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="mt-6 px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
        >
          {retrying ? "Retrying..." : "Retry Level (-5 Score)"}
        </button>
      )}
    </div>
  );
}
