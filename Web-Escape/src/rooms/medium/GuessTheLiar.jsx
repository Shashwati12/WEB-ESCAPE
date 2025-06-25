import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import useGameStore from "../../state/gameStore";
import LevelCompleteScreen from "../../components/LevelCompleteScreen"; 

export default function GuessLiarGame() {
  const { id } = useParams(); 
  const level = parseInt(id, 10);

  const [levelData, setLevelData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showCompleteScreen, setShowCompleteScreen] = useState(false); 

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
      } catch (err) {
        console.error("Failed to fetch level data", err);
        setFeedback("⚠️ Failed to load level.");
      }
    };
    fetchLevel();
  }, [level]);

  const handleGuess = async (character) => {
    if (selected) return;
    setSelected(character);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/level/${level}/submit`,
        { answer: character },
        { withCredentials: true }
      );

      if (res.data.success) {
        setFeedback("✅ Correct! You found the liar.");
        completeLevel(level);
        updateScore(10);
        setTimeout(() => setShowCompleteScreen(true), 1500); 
      } else {
        setFeedback("❌ Wrong! That wasn't the liar.");
      }
    } catch (err) {
      console.error("Answer submission error", err);
      setFeedback("⚠️ Submission failed.");
    }
  };

  // ✅ Success screen
  if (showCompleteScreen) return <LevelCompleteScreen />;

  // ✅ Defensive load check
  if (!levelData || !levelData.data?.statements) {
    return <div className="text-white text-center mt-10">Loading or invalid data...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-6">{levelData.question}</h1>

      <div className="relative w-full max-w-5xl aspect-video border-2 border-white rounded-lg overflow-hidden">
        <img
          src={`http://localhost:3000/uploads/${levelData.data.background}`}
          alt="scene"
          className="w-full h-full object-cover"
        />

        {levelData.data.statements.map((s, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center text-center"
            style={{
              top: `${s.y}%`,
              left: `${s.x}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <img
              src={`http://localhost:3000/uploads/${s.image}`}
              alt={s.character}
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-2"
            />
            <button
              onClick={() => handleGuess(s.character)}
              disabled={selected !== null}
              className={`text-base max-w-[60vw] px-4 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                selected === s.character
                  ? "bg-green-600 text-white"
                  : selected
                  ? "bg-gray-600 text-white opacity-60"
                  : "bg-yellow-300 text-black hover:bg-yellow-400"
              }`}
            >
              {s.character}: “{s.text}”
            </button>
          </div>
        ))}
      </div>

      {feedback && (
        <div className="mt-6 text-xl font-bold text-green-400">{feedback}</div>
      )}
    </div>
  );
}
