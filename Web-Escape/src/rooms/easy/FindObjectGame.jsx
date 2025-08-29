import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGameStore from "../../state/gameStore";
import axios from "axios";
import LevelCompleteScreen from "../../components/LevelCompleteScreen"; 
import useAttempt from "../../hooks/useAttempt";

export default function FindObjectGame() {
  const { id } = useParams();
  const level = parseInt(id, 10); 

  const [levelData, setLevelData] = useState(null);
  const [found, setFound] = useState(false);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);

  const {
    attemptsLeft,
    isLocked,
    retrying,
    handleUseAttempt,
    handleRetry,
  } = useAttempt(level);

  const {
    currentLevel,
    setCurrentLevel,
    completeLevel,
    updateScore,
  } = useGameStore();

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
        console.error("Failed to fetch level data:", error);
      }
    };

    fetchLevelData();
  }, [level]);

  const handleClick = async (e) => {
    if (found || isLocked) return; 

    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/level/${level}/submit`,
        {
          x: clickX.toString(),
          y: clickY.toString(),
        },
        { withCredentials: true }
      );

      if (response.data.message === "Correct answer" && !found) {
        setFound(true);
        completeLevel(level);
        updateScore(10);
        setTimeout(() => setShowCompleteScreen(true), 1500);
      } else if (response.data.message === "Wrong answer") {
        setWrongMessage(true);
        setTimeout(() => setWrongMessage(false), 2000);

        await handleUseAttempt();

      }

      console.log(response.data.message);
    } catch (error) {
      console.error("Failed to submit level answer:", error);
    }
  };

  if (showCompleteScreen) return <LevelCompleteScreen />;

  if (!levelData) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center text-white min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 {levelData.question}</h1>

      {attemptsLeft !== null && (
        <p className="mb-2 text-sm text-yellow-300">
          Attempts Left: {attemptsLeft}
        </p>
      )}

      {isLocked && (
        <div className="text-red-400 font-bold mb-3 text-lg">
          ❌ No attempts left!
        </div>
      )}

      <div className="relative">
        <img
          src={`http://localhost:3000/${levelData.data}`}
          alt={levelData.question}
          onClick={handleClick}
          className={`max-w-full border-4 ${
            found ? "border-green-500" : "border-white"
          } cursor-crosshair`}
        />

        {found && (
          <div className="absolute inset-0 flex items-center justify-center text-green-400 text-3xl font-bold bg-black/50">
            ✅ Object Found!
          </div>
        )}
        {wrongMessage && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-3xl font-bold bg-black/50">
            ❌ Wrong object!
          </div>
        )}
      </div>

      {isLocked && (
        <button
          onClick={handleRetry}
          className="mt-6 px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
          disabled={retrying}
        >
          Retry Level (-5 Score)
        </button>
      )}

    </div>
  );
}


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import useGameStore from "../../state/gameStore";
// import axios from "axios";
// import LevelCompleteScreen from "../../components/LevelCompleteScreen"; 
// import useAttempt from "../../hooks/useAttempt";

// export default function FindObjectGame() {
//   const { id } = useParams();
//   const level = parseInt(id, 10); 

//   const [levelData, setLevelData] = useState(null);
//   const [found, setFound] = useState(false);
//   const [wrongMessage, setWrongMessage] = useState(false);
//   const [showCompleteScreen, setShowCompleteScreen] = useState(false);
//   const [clickAnimation, setClickAnimation] = useState({ show: false, x: 0, y: 0 });

//   const {
//     attemptsLeft,
//     isLocked,
//     retrying,
//     handleUseAttempt,
//     handleRetry,
//   } = useAttempt(level);

//   const {
//     currentLevel,
//     setCurrentLevel,
//     completeLevel,
//     updateScore,
//   } = useGameStore();

//   useEffect(() => {
//     setCurrentLevel(level);
//   }, [level]);

//   useEffect(() => {
//     const fetchLevelData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/v1/level/${level}`,
//           { withCredentials: true }
//         );
//         setLevelData(response.data);
//       } catch (error) {
//         console.error("Failed to fetch level data:", error);
//       }
//     };

//     fetchLevelData();
//   }, [level]);

//   const handleClick = async (e) => {
//     if (found || isLocked) return; 

//     // Show click animation
//     setClickAnimation({
//       show: true,
//       x: e.clientX,
//       y: e.clientY
//     });
//     setTimeout(() => setClickAnimation({ ...clickAnimation, show: false }), 500);

//     const rect = e.target.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const clickY = e.clientY - rect.top;

//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/v1/level/${level}/submit`,
//         {
//           x: clickX.toString(),
//           y: clickY.toString(),
//         },
//         { withCredentials: true }
//       );

//       if (response.data.message === "Correct answer" && !found) {
//         setFound(true);
//         completeLevel(level);
//         updateScore(10);
//         setTimeout(() => setShowCompleteScreen(true), 1500);
//       } else if (response.data.message === "Wrong answer") {
//         setWrongMessage(true);
//         setTimeout(() => setWrongMessage(false), 2000);
//         await handleUseAttempt();
//       }

//       console.log(response.data.message);
//     } catch (error) {
//       console.error("Failed to submit level answer:", error);
//     }
//   };

//   if (showCompleteScreen) return <LevelCompleteScreen />;

//   if (!levelData) return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1a0e2a] flex items-center justify-center">
//       <div className="animate-pulse text-center">
//         <div className="w-16 h-16 bg-[#a78bfa] rounded-full mx-auto mb-4"></div>
//         <p className="text-[#c084fc] text-lg font-medium">Loading level...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div 
//       className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden"
//       style={{ 
//         background: 'linear-gradient(135deg, #0D0D0D 0%, #1a0e2a 100%)',
//       }}
//     >
//       {/* Geometric background pattern */}
//       <div className="absolute inset-0 overflow-hidden opacity-20">
//         <div className="absolute top-0 left-0 w-64 h-64 border-8 border-[#c084fc] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
//         <div className="absolute bottom-0 right-0 w-48 h-48 border-8 border-[#ec4899] rounded-full transform translate-x-1/4 translate-y-1/4"></div>
//         <div className="absolute top-1/3 right-1/4 w-32 h-32 rotate-45 bg-[#d946ef] opacity-30"></div>
//         <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rotate-12 border-4 border-[#a78bfa]"></div>
//         <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full border-[6px] border-dashed border-[#4ade80] transform -translate-x-1/2 -translate-y-1/2"></div>
//         <div className="absolute top-1/4 left-3/4 w-24 h-24 rotate-45 bg-[#22c55e] opacity-20"></div>
//       </div>

//       <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#ec4899] relative z-10">
//         🔍 {levelData.question}
//       </h1>

//       {attemptsLeft !== null && (
//         <p className="mb-2 text-sm text-[#facc15] font-medium relative z-10">
//           Attempts Left: {attemptsLeft}
//         </p>
//       )}

//       {isLocked && (
//         <div className="text-[#f87171] font-bold mb-3 text-lg animate-pulse relative z-10">
//           ❌ No attempts left!
//         </div>
//       )}

//       <div className="relative z-10">
//         <img
//           src={`http://localhost:3000/${levelData.data}`}
//           alt={levelData.question}
//           onClick={handleClick}
//           className={`max-w-full border-4 rounded-lg transition-all duration-300 ${
//             found 
//               ? "border-[#4ade80] shadow-lg shadow-[#4ade80]/40 animate-pulse-slow" 
//               : "border-white/30 hover:border-[#a78bfa] hover:shadow-lg hover:shadow-[#a78bfa]/30"
//           } cursor-crosshair transform hover:scale-[1.02]`}
//         />

//         {found && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg animate-fadeIn">
//             <div className="text-[#4ade80] text-3xl font-bold animate-bounce">
//               ✅ Object Found!
//             </div>
//           </div>
//         )}
        
//         {wrongMessage && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg animate-fadeIn">
//             <div className="text-[#f87171] text-3xl font-bold animate-shake">
//               ❌ Wrong object!
//             </div>
//           </div>
//         )}
        
//         {clickAnimation.show && (
//           <div 
//             className="absolute w-8 h-8 border-4 border-[#d946ef] rounded-full animate-clickPulse"
//             style={{
//               left: clickAnimation.x - 16,
//               top: clickAnimation.y - 16,
//             }}
//           />
//         )}
//       </div>

//       {isLocked && (
//         <button
//           onClick={handleRetry}
//           className="mt-6 px-6 py-3 bg-gradient-to-r from-[#eab308] to-[#fb923c] text-black font-semibold rounded-lg hover:from-[#facc15] hover:to-[#fdba74] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 shadow-lg shadow-[#eab308]/30 animate-pulse-slow relative z-10"
//           disabled={retrying}
//         >
//           {retrying ? "Retrying..." : "Retry Level (-5 Score)"}
//         </button>
//       )}

//       <style jsx>{`
//         @keyframes pulse-slow {
//           0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
//           70% { box-shadow: 0 0 0 15px rgba(74, 222, 128, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
//         }
//         @keyframes fadeIn {
//           0% { opacity: 0; transform: scale(0.8); }
//           100% { opacity: 1; transform: scale(1); }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }
//         @keyframes clickPulse {
//           0% { transform: scale(0.5); opacity: 1; }
//           100% { transform: scale(2); opacity: 0; }
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 2s infinite;
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
//         .animate-shake {
//           animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
//         }
//         .animate-clickPulse {
//           animation: clickPulse 0.5s ease-out forwards;
//         }
//         .animate-bounce {
//           animation: bounce 1s infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

