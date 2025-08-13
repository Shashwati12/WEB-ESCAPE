
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import useGameStore from "../../state/gameStore";
import useAttempt from "../../hooks/useAttempt";
import LevelCompleteScreen from "../../components/LevelCompleteScreen";

const ShadowShapeLevel = () => {
  const { id } = useParams();
  const level = parseInt(id, 10);

  const [levelData, setLevelData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
   const [showCompleteScreen, setShowCompleteScreen] = useState(false);

  const { completeLevel, updateScore, setCurrentLevel } = useGameStore();
  const { attemptsLeft, isLocked, retrying, handleUseAttempt, handleRetry } = useAttempt(level);

  useEffect(() => {
    setCurrentLevel(level);
    axios
      .get(`http://localhost:3000/api/v1/level/${level}`, { withCredentials: true })
      .then(res => setLevelData(res.data))
      .catch(err => {
        console.error("Failed to fetch level data", err);
        setFeedback("⚠️ Failed to load puzzle.");
      });
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
  
  if (!levelData || !levelData.data?.image)
    return <div className="text-white mt-10 text-center">Loading or invalid data...</div>;

  const puzzle = levelData.data;

  // Theme colors
  const themeColors = [
    "rgba(236,84,153,0.3)",
    "rgba(192,132,252,0.3)",
    "rgba(236,72,153,0.2)",
    "rgba(167,139,250,0.2)"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0D0D0D] to-[#1a0e2a] text-white flex flex-col items-center justify-center p-4">

      {/* Geometric Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, width: Math.random()*3 + 1, height: Math.random()*3 + 1, opacity: Math.random()*0.7 + 0.1 }}
          />
        ))}
        <motion.div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-[#c084fc]/20 to-[#ec4899]/20 blur-3xl" animate={{ x:[0,20,-20,0], y:[0,-20,10,0] }} transition={{ duration:20, repeat:Infinity, repeatType:"reverse" }} />
        <motion.div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-[#a78bfa]/20 to-[#d946ef]/20 blur-3xl" animate={{ x:[0,-30,15,0], y:[0,20,-10,0] }} transition={{ duration:25, repeat:Infinity, repeatType:"reverse" }} />
        {[...Array(15)].map((_, i) => {
          const type = Math.floor(Math.random()*5);
          const size = Math.random()*40 + 20;
          const color = themeColors[Math.floor(Math.random()*themeColors.length)];
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{ width: size, height: size, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, background: color, clipPath: ["circle(50%)","polygon(50% 0%,0% 100%,100% 100%)","polygon(0% 0%,100% 0%,100% 100%,0% 100%)","polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%)","polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)"][type] }}
              animate={{ x:[0, type%2?-50:50,0], y:[0, type%2?30:-30,0], rotate:[0,Math.random()*360,0] }}
              transition={{ duration:10+Math.random()*10, repeat:Infinity, ease:"easeInOut", delay:Math.random()*3 }}
            />
          );
        })}
      </div>

      {/* Question Outside */}
       <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#c084fc] to-[#ec4899] text-transparent bg-clip-text">🌌 Shadow Shape Puzzle</h1>
      <motion.p className="relative z-10 text-[#e0c3fc] text-xl mb-4" initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.8 }}>
        {levelData.question}
      </motion.p>

      {/* Box with Image, Input, Submit */}
      <div className="relative z-10 w-full max-w-md bg-[#1a0e2a]/60 backdrop-blur-xl border-2 border-[#c084fc]/40 rounded-2xl p-6 flex flex-col items-center gap-6">
        <motion.img
          src={`http://localhost:3000/${puzzle.image}`}
          alt="shadow"
          className="w-48 h-48 object-contain rounded-xl border-2 border-[#ec4899]/50 shadow-md"
          initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.3 }}
        />
        {attemptsLeft != null && <div className="text-[#e0c3fc]">{isLocked ? "❌ No attempts left" : `🧠 Attempts Left: ${attemptsLeft}`}</div>}
        {!finished && (
          <>
            <input
              type="text"
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              disabled={isLocked || isSubmitting}
              className="w-full px-4 py-3 bg-[#0D0D0D]/80 border-2 border-[#c084fc]/50 rounded-xl text-center placeholder-[#c084fc] focus:outline-none focus:ring-2 focus:ring-[#ec4899]/40 disabled:opacity-50"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !userAnswer.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#c084fc] to-[#ec4899] rounded-xl font-bold disabled:opacity-50"
            >{isSubmitting ? "Submitting..." : "Submit Answer"}</button>
          </>
        )}
        <AnimatePresence>
          {feedback && (
            <motion.div
              className={`w-full text-center px-4 py-2 rounded-xl font-medium ${feedback.startsWith("✅") ? "bg-[#4ade80]/20 text-[#4ade80]" : "bg-[#f87171]/20 text-[#f87171]"}`}
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }}
            >{feedback}</motion.div>
          )}
        </AnimatePresence>
        {finished && (
          <motion.div className="text-center" initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:"spring", stiffness:300 }}>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#c084fc] to-[#ec4899] bg-clip-text text-transparent">Shadow Solved! 🎉</div>
            <p className="text-[#e0c3fc] mt-2">The cosmic mysteries reveal themselves to you</p>
          </motion.div>
        )}
        {isLocked && (
          <button onClick={handleRetry} disabled={retrying} className="w-full px-6 py-3 bg-gradient-to-r from-[#eab308] to-[#fb923c] rounded-xl font-bold disabled:opacity-50">
            {retrying ? "Retrying..." : "Retry Level (-5 Score)"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ShadowShapeLevel;

