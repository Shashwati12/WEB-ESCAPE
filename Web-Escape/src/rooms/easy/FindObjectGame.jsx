
import { useEffect, useState } from "react";
import useGameStore from "../../state/gameStore";
import skeletonsImg from "../../assets/Skeletons.png"
import batImg from "../../assets/Bat.png";
import ghostImg from "../../assets/Ghost.jpeg";
import axios from "axios";

const imageList = [
  {
    id: "skeletons",
    src: skeletonsImg,
    alt: "Skeleton Puzzle",
    answerCoords: { x1: 604, y1: 153, x2: 666, y2: 238 },
    correctAnswer: "skeletons",
  },
  {
    id: "bat",
    src: batImg,
    alt: "Bat Puzzle",
    answerCoords: { x1: 122, y1: 519, x2: 176, y2: 575 },
    correctAnswer: "bat",
  },
  {
    id: "ghost",
    src: ghostImg,
    alt: "Ghost Puzzle",
    answerCoords: { x1: 200, y1: 615, x2: 248, y2: 662 },
    correctAnswer: "ghost",
  },
];

export default function FindObjectGame() {
  const [imageData, setImageData] = useState(null);
  const [found, setFound] = useState(false);
  const { currentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    const random = imageList[Math.floor(Math.random() * imageList.length)];
    setImageData(random);
  }, []);

  const handleClick = async (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const { x1, y1, x2, y2 } = imageData.answerCoords;

    const clickedCorrectly = clickX >= x1 && clickX <= x2 && clickY >= y1 && clickY <= y2;

    if (clickedCorrectly && !found) {
      setFound(true);
      completeLevel(currentLevel);
      updateScore(10);

      try {
        await axios.post(
          `http://localhost:3000/api/v1/${currentLevel}/submit`,
          {
            answer: imageData.correctAnswer,
          },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("❌ Failed to submit level answer:", error);
      }
    }
  };

  if (!imageData) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center text-white min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 Find the Hidden Object!</h1>
      <div className="relative">
        <img
          src={imageData.src}
          alt={imageData.alt}
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
