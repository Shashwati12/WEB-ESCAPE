// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import useGameStore from "../../state/gameStore";
// import LevelCompleteScreen from "../../components/LevelCompleteScreen";

// export default function MatchQuestGame() {
//   const { id } = useParams();
//   const level = parseInt(id, 10);

//   const [cards, setCards] = useState([]);
//   const [flipped, setFlipped] = useState([]);
//   const [matched, setMatched] = useState([]);
//   const [levelData, setLevelData] = useState(null);
//   const [showCompleteScreen, setShowCompleteScreen] = useState(false);

//   const { currentLevel, setCurrentLevel, completeLevel, updateScore } = useGameStore();

//   useEffect(() => {
//     setCurrentLevel(level);
//   }, [level]);

//   useEffect(() => {
//     const fetchLevelData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/v1/level/${level}`, {
//           withCredentials: true,
//         });

//         const shuffled = response.data.data.cards
//           .map(card => ({ ...card, uuid: crypto.randomUUID() }))
//           .sort(() => Math.random() - 0.5);

//         setLevelData(response.data);
//         setCards(shuffled);
//       } catch (error) {
//         console.error("Failed to fetch level data:", error);
//       }
//     };

//     fetchLevelData();
//   }, [level]);

//   const handleCardClick = (uuid, image) => {
//     if (flipped.length === 2 || flipped.some(f => f.uuid === uuid) || matched.includes(uuid)) return;

//     const newFlipped = [...flipped, { uuid, image }];
//     setFlipped(newFlipped);

//     if (newFlipped.length === 2) {
//       if (newFlipped[0].image === newFlipped[1].image) {
//         setMatched([...matched, newFlipped[0].uuid, newFlipped[1].uuid]);
//         setTimeout(() => setFlipped([]), 800);
//       } else {
//         setTimeout(() => setFlipped([]), 1000);
//       }
//     }
//   };

//   useEffect(() => {
//     if (levelData && matched.length === cards.length && cards.length > 0) {
//       axios
//         .post(
//           `http://localhost:3000/api/v1/level/${level}/submit`,
//           { answer: "all pairs matched" },
//           { withCredentials: true }
//         )
//         .then(res => {
//           if (res.data.success) {
//             completeLevel(level);
//             updateScore(10);
//             setTimeout(() => setShowCompleteScreen(true), 1500);
//           }
//         })
//         .catch(err => console.error("Submission failed", err));
//     }
//   }, [matched]);

//   if (showCompleteScreen) return <LevelCompleteScreen />;

//   if (!levelData) return <div className="text-white">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
//       <h1 className="text-2xl font-bold mb-6">{levelData.question}</h1>
//       <div className="grid grid-cols-5 gap-5">
//         {cards.map(card => {
//           const isFlipped = flipped.some(f => f.uuid === card.uuid);
//           const isMatched = matched.includes(card.uuid);
//           return (
//             <div
//               key={card.uuid}
//               onClick={() => handleCardClick(card.uuid, card.image)}
//               className="w-24 h-32 bg-white rounded-md cursor-pointer relative"
//             >
//               {(isFlipped || isMatched) ? (
//                 <img
//                   src={`http://localhost:3000/uploads/${card.image}`}
//                   alt="card"
//                   className="w-full h-full object-cover rounded-md"
//                 />
//               ) : (
//                 <div className="bg-gray-700 w-full h-full rounded-md"></div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//       {matched.length === cards.length && (
//         <p className="text-green-400 mt-6 text-xl font-bold">All pairs matched!</p>
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useGameStore from "../../state/gameStore";
import LevelCompleteScreen from "../../components/LevelCompleteScreen";
import Confetti from "react-confetti";
import Particles from "../../components/ParticlesBack";

export default function MatchQuestGame() {
  const { id } = useParams();
  const level = parseInt(id, 10);
  const gridRef = useRef(null);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [levelData, setLevelData] = useState(null);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mismatched, setMismatched] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { currentLevel, setCurrentLevel, completeLevel, updateScore } =
    useGameStore();

  // Track window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/level/${level}`,
          {
            withCredentials: true,
          }
        );

        const shuffled = response.data.data.cards
          .map((card) => ({ ...card, uuid: crypto.randomUUID() }))
          .sort(() => Math.random() - 0.5);

        setLevelData(response.data);
        setCards(shuffled);
      } catch (error) {
        console.error("Failed to fetch level data:", error);
      }
    };

    fetchLevelData();
  }, [level]);

  const handleCardClick = (uuid, image) => {
    if (
      flipped.length === 2 ||
      flipped.some((f) => f.uuid === uuid) ||
      matched.includes(uuid)
    )
      return;

    const newFlipped = [...flipped, { uuid, image }];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (newFlipped[0].image === newFlipped[1].image) {
        setMatched((prev) => [...prev, newFlipped[0].uuid, newFlipped[1].uuid]);
        setTimeout(() => setFlipped([]), 800);
      } else {
        setMismatched(newFlipped.map((card) => card.uuid));
        setTimeout(() => {
          setFlipped([]);
          setMismatched([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (levelData && matched.length === cards.length && cards.length > 0) {
      setShowConfetti(true);

      axios
        .post(
          `http://localhost:3000/api/v1/level/${level}/submit`,
          { answer: "all pairs matched" },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.success) {
            completeLevel(level);
            updateScore(10);
            setTimeout(() => setShowCompleteScreen(true), 3000);
          }
        })
        .catch((err) => console.error("Submission failed", err));
    }
  }, [matched]);

  // Card animation variants
  const getCardColor = (index) => {
    const colors = ["#c084fc", "#ec4899", "#a78bfa", "#d946ef"];
    return colors[index % colors.length];
  };

  if (showCompleteScreen) return <LevelCompleteScreen />;

  if (!levelData)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1a0e2a] flex items-center justify-center">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#ec4899]">
          Loading Level...
        </div>
      </div>
    );

  return (
    <div className=" min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1a0e2a] text-white flex flex-col justify-between items-center p-4 overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
          colors={[
            "#c084fc",
            "#ec4899",
            "#a78bfa",
            "#d946ef",
            "#4ade80",
            "#facc15",
          ]}
        />
      )}

      <Particles />

      <div className="z-10 w-full max-w-6xl flex flex-col items-center">
        <div>
              <h1 className="text-3xl w-full text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#ec4899] text-center">
            {levelData.question} the cards
          </h1>
        </div><br/><br/>
       
          

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 w-200"
        >
          {cards.map((card, index) => {
            const isFlipped = flipped.some((f) => f.uuid === card.uuid);
            const isMatched = matched.includes(card.uuid);
            const isMismatched = mismatched.includes(card.uuid);

            return (
              <div
                key={card.uuid}
                onClick={() => handleCardClick(card.uuid, card.image)}
                className={`
     relative cursor-pointer h-20 w-20 md:h-30 md:w-30 rounded-xl transition-all duration-300
  transform ${isMatched ? "scale-95" : "hover:scale-105"} 
    ${isMismatched ? "animate-shake" : ""}
  `}
                style={{
                  perspective: "1000px",
                }}
              >
                <div
                  className={`
                       w-full h-full relative rounded-xl transition-all duration-500
                           ${isFlipped || isMatched ? "rotate-y-180" : ""}
                    ${
                      isMatched
                        ? "border-2 border-[#4ade80]"
                        : "border border-[#c084fc]/30"
                    }
                            ${isMismatched ? "border-2 border-[#f87171]" : ""}
  `}
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      isFlipped || isMatched
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                  }}
                >
                  {/* Card Back */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br rounded-xl flex items-center justify-center backface-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${getCardColor(
                        index
                      )}, ${getCardColor(index + 1)})`,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <img
                      src={`http://localhost:3000/uploads/${card.image}`}
                      alt="card"
                      className="w-full h-full object-cover rounded-xl p-0.5"
                    />
                  </div>

                  {/* Card Front */}
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden"
                    style={{
                      background: `linear-gradient(135deg, #1a0e2a, #0D0D0D)`,
                      backfaceVisibility: "hidden",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {matched.length === cards.length && (
          <div className="mt-8 p-4 bg-gradient-to-r from-[#c084fc] to-[#ec4899] rounded-xl animate-pulse">
            <p className="text-xl md:text-2xl font-bold text-center text-white">
              Level Complete! Awesome job!
            </p>
          </div>
        )}
      </div>

      <br />
      <br />
    </div>
  );
}
