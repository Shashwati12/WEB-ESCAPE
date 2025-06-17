
// import { useEffect, useState } from "react";
// import axios from "axios";
// import useGameStore from "../../state/gameStore";

// export default function ShadowGameLevel() {
//   const [levelData, setLevelData] = useState(null);
//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [finished, setFinished] = useState(false);

//   const { currentLevel, completeLevel, updateScore } = useGameStore();

//   useEffect(() => {
//     const fetchLevelData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/v1/level/${3}`, {
//           withCredentials: true,
//         });
//         setLevelData(response.data);
//       } catch (error) {
//         console.error("Error fetching level data:", error);
//       }
//     };

//     fetchLevelData();
//   }, [currentLevel]);


//    useEffect(() => {
//     // Reset correctness on new question
//     setIsCorrect(null);
//     setSelectedOption(null);
//   }, [levelData]);


 
//   const handleOptionClick = async (option) => {
//     setSelectedOption(option);

//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/v1/level/${3}/submit`,
//         {
//           answer: option,
//           index: questionIndex, // Send index so backend knows which correctAnswer to match
//         },
//         { withCredentials: true }
//       );

//       if (response.data.message === "Correct answer") {
//         setIsCorrect(true);

//         // If it's the last question
//         if (questionIndex === levelData.data.length - 1) {
//           setFinished(true);
//           completeLevel(currentLevel);
//           updateScore(10);
//         } else {
//           // Move to next question after a short delay
//           setTimeout(() => {
//             setQuestionIndex((prev) => prev + 1);
//             setSelectedOption(null);
//             setIsCorrect(null);
//           }, 1000);
//         }
//       } else {
//         setIsCorrect(false);
//       }
//     } catch (error) {
//       console.error("Submission failed:", error);
//     }
//   };

//   if (!levelData) return <div className="text-white">Loading...</div>;

//   const currentQuestion = levelData.data[questionIndex];

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
//       <h1 className="text-2xl font-bold mb-4">🕶️ {levelData.question}</h1>

//       {!finished ? (
//         <>
//           <img
//             src={`http://localhost:3000/${currentQuestion.image}`}
//             alt="Shadow Object"
//             className="max-w-xs mb-6 rounded shadow-lg"
//           />

//           <div className="grid grid-cols-2 gap-4">
//             {currentQuestion.options.map((option, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleOptionClick(option)}
//                 className={`px-4 py-2 rounded border transition-all duration-200 ${
//                   selectedOption === option
//                     ? isCorrect === true
//                       ? "bg-green-600 border-green-400"
//                       : isCorrect === false
//                       ? "bg-red-600 border-red-400"
//                       : "bg-yellow-400 text-black"
//                     : "bg-white text-black"
//                 }`}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>

//           {isCorrect && (
//             <p className="mt-4 text-green-400 font-bold text-xl">✅ Correct!</p>
//           )}
//           {isCorrect === false && (
//             <p className="mt-4 text-red-400 font-bold text-xl">❌ Try again!</p>
//           )}
//         </>
//       ) : (
//         <p className="text-3xl font-bold text-green-400">🎉 All objects found!</p>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import useGameStore from "../../state/gameStore";

export default function ShadowGameLevel() {
  const [levelData, setLevelData] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [finished, setFinished] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const { currentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/level/${3}`, {
          withCredentials: true,
        });
        setLevelData(response.data);
      } catch (error) {
        console.error("Error fetching level data:", error);
      }
    };

    fetchLevelData();
  }, [currentLevel]);

  const handleOptionClick = async (option) => {
    if (hasAnswered) return; // Prevent multiple answers
    setSelectedOption(option);
    setHasAnswered(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/level/${3}/submit`,
        {
          answer: option,
          index: questionIndex,
        },
        { withCredentials: true }
      );

      const correct = response.data.message === "Correct answer";
      setIsCorrect(correct);

      if (correct) {
        if (questionIndex === levelData.data.length - 1) {
          setFinished(true);
          completeLevel(currentLevel);
          updateScore(10);
        } else {
          // Delay then go to next question
          setTimeout(() => {
            setQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
            setHasAnswered(false);
          }, 1000);
        }
      } else {
        // Allow retry for wrong answer
        setTimeout(() => {
          setIsCorrect(null);
          setSelectedOption(null);
          setHasAnswered(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setHasAnswered(false);
    }
  };

  if (!levelData) return <div className="text-white">Loading...</div>;

  const currentQuestion = levelData.data[questionIndex];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">🕶️ {levelData.question}</h1>

      {!finished ? (
        <>
          <img
            src={`http://localhost:3000/${currentQuestion.image}`}
            alt="Shadow Object"
            className="max-w-xs mb-6 rounded shadow-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={hasAnswered}
                className={`px-4 py-2 rounded border transition-all duration-200 ${
                  selectedOption === option
                    ? isCorrect === true
                      ? "bg-green-600 border-green-400"
                      : isCorrect === false
                      ? "bg-red-600 border-red-400"
                      : "bg-yellow-400 text-black"
                    : "bg-white text-black"
                } ${hasAnswered ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>

          {isCorrect === true && (
            <p className="mt-4 text-green-400 font-bold text-xl">✅ Correct!</p>
          )}
          {isCorrect === false && (
            <p className="mt-4 text-red-400 font-bold text-xl">❌ Try again!</p>
          )}
        </>
      ) : (
        <p className="text-3xl font-bold text-green-400">🎉 All objects found!</p>
      )}
    </div>
  );
}
