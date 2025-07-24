

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useGameStore from "../../state/gameStore";
import LevelCompleteScreen from "../../components/LevelCompleteScreen";
import useAttempt from "../../hooks/useAttempt";
import Particles from "../../components/particle";
import { motion, AnimatePresence } from "framer-motion";

export default function PatternBreakerLevel() {
  const { id } = useParams();
  const level = parseInt(id, 10);

  const [levelData, setLevelData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
 
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);
  const { currentLevel, setCurrentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  const {
    attemptsLeft,
    isLocked,
    retrying,
    handleUseAttempt,
    handleRetry,
  } = useAttempt(level);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/level/${level}`,
          { withCredentials: true }
        );
        setLevelData(response.data);
      } catch (error) {
        console.error("Error fetching pattern breaker data:", error);
        setFeedback("⚠️ Failed to load the question.");
      }
    };

    fetchLevelData();
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
        setFinished(true);
        setShowCelebration(true);
        completeLevel(level);
        updateScore(10);
        setTimeout(() => setShowCompleteScreen(true), 1500);
      } else {
        setFeedback("❌ Incorrect! Try again.");
        await handleUseAttempt();
        // Shake animation effect
        if (inputRef.current) {
          inputRef.current.classList.add("animate-shake");
          setTimeout(() => {
            if (inputRef.current) inputRef.current.classList.remove("animate-shake");
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setFeedback("⚠️ Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

 

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (showCompleteScreen) return <LevelCompleteScreen />;

  if (!levelData) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1a0e2a] to-[#0D0D0D]">
      <div className="w-16 h-16 border-4 border-t-purple-600 border-r-pink-600 border-l-transparent border-b-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1a0e2a] to-[#0D0D0D] text-white overflow-hidden font-sans">
    
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={300}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      
      {showCelebration && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Particles
            particleColors={["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]}
            particleCount={500}
            particleSpread={360}
            speed={0.5}
            particleBaseSize={200}
            moveParticlesOnHover={false}
            alphaParticles={true}
            disableRotation={true}
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
       
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 drop-shadow-lg">
            🧩 Pattern Breaker
          </h1>
          <p className="text-lg text-purple-300">Level {level}</p>
        </motion.div>

        {/* Question Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.01]"
        >
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-300">Pattern Puzzle</h2>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: attemptsLeft > i ? [1, 1.2, 1] : 1,
                        opacity: attemptsLeft > i ? 1 : 0.3
                      }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-yellow-300">x{attemptsLeft}</span>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-black/30 rounded-lg border border-purple-500/30"
            >
              <p className="text-xl font-orbitron text-purple-300 text-center whitespace-pre-wrap tracking-wide leading-relaxed">
                {levelData.question}
              </p>
            </motion.div>
          </div>

        
         
          {/* Input + Submit */}
          {!finished && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4"
            >
              <div className={`relative w-full md:w-auto ${isFocused ? 'ring-4 ring-purple-500/50' : ''} rounded-xl transition-all duration-300`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter your solution..."
                  disabled={isSubmitting || isLocked}
                  className="px-4 py-3 rounded-xl text-black w-full text-center bg-white/95 border border-white/30 focus:outline-none focus:ring-0 disabled:opacity-50"
                />
                {isFocused && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-6 left-0 right-0 text-center text-xs text-purple-300"
                  >
                    Press Enter to submit
                  </motion.div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting || isLocked}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : "Submit"}
              </motion.button>
            </motion.div>
          )}

          {/* Feedback Message */}
          <AnimatePresence>
            {feedback && (
              <motion.p
                key={feedback}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 text-xl text-center font-bold ${
                  feedback.startsWith("✅")
                    ? "text-green-400"
                    : feedback.startsWith("❌")
                    ? "text-red-400"
                    : "text-yellow-300"
                }`}
              >
                {feedback}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Puzzle Solved */}
          {finished && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mt-6 flex flex-col items-center"
            >
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-2xl font-bold text-green-400 text-center">
                Puzzle Solved!
              </p>
              <p className="text-purple-300 mt-2">Loading next level...</p>
            </motion.div>
          )}

          {/* Retry Button */}
          {isLocked && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                disabled={retrying}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-400 text-black font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {retrying ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Retrying...
                  </div>
                ) : "Retry Level (-5 Score)"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-10 left-10 w-8 h-8 rounded-full bg-purple-500/20"
        animate={{ 
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-6 h-6 rounded-full bg-pink-500/30"
        animate={{ 
          y: [0, 15, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-teal-400/20"
        animate={{ 
          scale: [1, 1.5, 1],
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
}
