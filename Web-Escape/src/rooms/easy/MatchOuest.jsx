import { useEffect, useState } from "react";
import axios from "axios";
import useGameStore from "../../state/gameStore";

export default function MatchQuestGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [levelData, setLevelData] = useState(null);
  const { currentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/level/${2}`, {
          withCredentials: true,
        });

        const shuffled = response.data.data.cards
          .map(card => ({ ...card, uuid: crypto.randomUUID() }))
          .sort(() => Math.random() - 0.5);

        setLevelData(response.data);
        setCards(shuffled);
      } catch (error) {
        console.error("Failed to fetch level data:", error);
      }
    };

    fetchLevelData();
  }, [currentLevel]);

  const handleCardClick = (uuid, image) => {
    if (flipped.length === 2 || flipped.some(f => f.uuid === uuid) || matched.includes(uuid)) return;

    const newFlipped = [...flipped, { uuid, image }];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (newFlipped[0].image === newFlipped[1].image) {
        setMatched([...matched, newFlipped[0].uuid, newFlipped[1].uuid]);
        setTimeout(() => setFlipped([]), 800);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (levelData && matched.length === cards.length && cards.length > 0) {
      axios
        .post(
          `http://localhost:3000/api/v1/level/${2}/submit`,
          { answer: "all pairs matched" },
          { withCredentials: true }
        )
        .then(res => {
          if (res.data.success) {
            completeLevel(currentLevel);
            updateScore(10);
          }
        })
        .catch(err => console.error("Submission failed", err));
    }
  }, [matched]);

  if (!levelData) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-6"> {levelData.question}</h1>
      <div className="grid grid-cols-5 gap-5">
        {cards.map(card => {
          const isFlipped = flipped.some(f => f.uuid === card.uuid);
          const isMatched = matched.includes(card.uuid);
          return (
            <div
              key={card.uuid}
              onClick={() => handleCardClick(card.uuid, card.image)}
              className="w-24 h-32 bg-white rounded-md cursor-pointer relative"
            >
              {(isFlipped || isMatched) ? (
                <img
                  src={`http://localhost:3000/uploads/${card.image}`}
                  alt="card"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="bg-gray-700 w-full h-full rounded-md"></div>
              )}
            </div>
          );
        })}
      </div>
      {matched.length === cards.length && (
        <p className="text-green-400 mt-6 text-xl font-bold"> All pairs matched!</p>
      )}
    </div>
  );
}
