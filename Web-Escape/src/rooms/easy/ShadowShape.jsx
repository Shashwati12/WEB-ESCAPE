

import { useEffect, useState } from "react";
import axios from "axios";
import useGameStore from "../../state/gameStore";

export default function ShadowShapeLevel() {
  const [levelData, setLevelData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  const { currentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/level/${3}`, {
          withCredentials: true,
        });
        setLevelData(response.data); 
      } catch (err) {
        console.error("Error loading puzzle:", err);
        setFeedback("⚠️ Failed to load puzzle.");
      }
    };
    fetchPuzzle();
  }, []);

  const handleSubmit = async () => {
    if (!selected || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/level/${3}/submit`,
        { answer: selected },
        { withCredentials: true }
      );

      const correct = response.data.message === "Correct answer";
      if (correct) {
        setFeedback("✅ Correct!");
        completeLevel(currentLevel);
        updateScore(10);
        setFinished(true);
      } else {
        setFeedback("❌ Incorrect! Try again.");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setFeedback("⚠️ Submission failed.");
    }

    setIsSubmitting(false);
  };

  if (!levelData) return <div className="text-white text-center mt-10">Loading...</div>;

  const currentPuzzle = levelData.data;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">🕶️ Shadow Shape</h1>
      <p className="text-lg mb-4 text-center max-w-xl whitespace-pre-line">
        {levelData.question}
      </p>

      <div className="mb-6">
        <img
          src={`http://localhost:3000/${currentPuzzle.image}`}
          alt="shadow"
          className="w-64 h-64 object-contain border-2 border-white rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {currentPuzzle.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(option)}
            className={`px-4 py-2 rounded border ${
              selected === option ? "bg-green-600" : "bg-white text-black"
            } hover:bg-green-700 transition-all`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !selected}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-all"
      >
        Submit
      </button>

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
    </div>
  );
}
