import { useEffect, useState } from "react";
import axios from "axios";
import useGameStore from "../../state/gameStore";

export default function OutputPredictorLevel() {
  const [levelData, setLevelData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  const { currentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/level/${6}`, // Replace with dynamic ID if needed
          { withCredentials: true }
        );
        setLevelData(response.data);
      } catch (error) {
        console.error("Error fetching output predictor data:", error);
        setFeedback("⚠️ Failed to load the question.");
      }
    };

    fetchLevelData();
  }, []);

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;
    setIsSubmitting(true);
    setFeedback("");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/level/${6}/submit`,
        { answer: userAnswer },
        { withCredentials: true }
      );

      const correct = response.data.message === "Correct answer";
      if (correct) {
        setFeedback("✅ Correct!");
        setFinished(true);
        completeLevel(currentLevel);
        updateScore(10);
      } else {
        setFeedback("❌ Incorrect! Try again.");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setFeedback("⚠️ Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  if (!levelData) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 Output Predictor</h1>

      <pre className="mb-8 text-lg max-w-xl text-center whitespace-pre-wrap font-mono">
        {levelData.question}
      </pre>

      {!finished && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter the expected output"
            className="px-4 py-2 rounded text-black w-64 text-center bg-white"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-all"
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
          🎉 Output Predicted!
        </p>
      )}
    </div>
  );
}
