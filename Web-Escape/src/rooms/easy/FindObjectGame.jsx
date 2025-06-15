import { useEffect, useState } from "react";
import useGameStore from "../../state/gameStore";
import axios from "axios";

export default function FindObjectGame() {
  const [levelData, setLevelData] = useState(null);
  const [found, setFound] = useState(false);
  const { currentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/level/${1}`, {
          withCredentials: true,
        });
        setLevelData(response.data);
      } catch (error) {
        console.error("Failed to fetch level data:", error);
      }
    };

    fetchLevelData();
  }, [currentLevel]);

  const handleClick = async (e) => {
  const rect = e.target.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  try {
    const response = await axios.post(
      `http://localhost:3000/api/v1/level/${1}/submit`,
      {
        x: clickX.toString(),
        y: clickY.toString(),
      },
      { withCredentials: true }
    );

    if (response.data.message === "Correct answer" && !found) {
      setFound(true);
      completeLevel(currentLevel);
      updateScore(10);
    }

    console.log(response.data.message);
  } catch (error) {
    console.error("Failed to submit level answer:", error);
  }
};


  if (!levelData) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center text-white min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 {levelData.question}</h1>
      <div className="relative">
        <img
          src={`http://localhost:3000/${levelData.data}`}
          alt={levelData.question}
          onClick={handleClick}
          className={`max-w-full border-4 ${
            found ? "border-green-500" : "border-white"
          }`}
        />
        {found && (
          <div className="absolute inset-0 flex items-center justify-center text-green-400 text-3xl font-bold bg-black/50">
            ✅ Object Found!
          </div>
        )}
      </div>
    </div>
  );
}
