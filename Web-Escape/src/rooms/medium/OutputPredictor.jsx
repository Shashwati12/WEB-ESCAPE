import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useGameStore from "../../state/gameStore";
import LevelCompleteScreen from "../../components/LevelCompleteScreen";
import useAttempt from "../../hooks/useAttempt";

const styleBlock = `
  @keyframes ghostGlow {
    0%, 100% { text-shadow: 0 0 4px #D0FF00, 0 0 10px #D0FF00; }
    50% { text-shadow: 0 0 8px #D0FF00, 0 0 20px #D0FF00; }
  }
  @keyframes flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity:1; }
    20%, 24%, 55% { opacity:0.4; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .flicker {
    animation: flicker 3s infinite;
  }
  .pulse {
    animation: pulse 2s infinite;
  }
  .float {
    animation: float 3s ease-in-out infinite;
  }
  .flow-bg {
    animation: flow 20s ease infinite;
  }
`;

export default function OutputPredictorLevel() {
  const { id } = useParams();
  const level = parseInt(id, 10);
  const [levelData, setLevelData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);

  const { currentLevel, setCurrentLevel, completeLevel, updateScore } = useGameStore();
  const { attemptsLeft, isLocked, retrying, handleUseAttempt, handleRetry } = useAttempt(level);

  const fogRef = useRef(null);
  const fogEffect = useRef(null);

  useEffect(() => {
   
    const initFog = () => {
      if (!window.THREE) {
        const threeScript = document.createElement("script");
        threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
        threeScript.async = true;
        threeScript.onload = () => {
          const fogScript = document.createElement("script");
          fogScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js";
          fogScript.async = true;
          fogScript.onload = () => {
            fogEffect.current = window.VANTA.FOG({
              el: fogRef.current,
              THREE: window.THREE,
          highlightColor: 0x1A0034,  
midtoneColor:   0x5A189A,  
lowlightColor:  0x4D0011, 
baseColor:      0x070707, 
              speed: 4.0,         // Faster flow
              blurFactor: 0.9,   
              zoom: 0.8,         
              waveHeight: 15,    
              waveSpeed: 1.5,     
            });
          };
          document.body.appendChild(fogScript);
        };
        document.body.appendChild(threeScript);
      } else if (window.VANTA) {
        fogEffect.current = window.VANTA.FOG({
          el: fogRef.current,
          THREE: window.THREE,
          highlightColor: 0x3F0071,
          midtoneColor: 0x9D4EDD,
          lowlightColor: 0xB3001B,
          baseColor: 0x0D0D0D,
          speed: 4.0,
          blurFactor: 0.8,
          zoom: 0.8,
          waveHeight: 15,
          waveSpeed: 1.5,
        });
      }
    };

    initFog();

    return () => {
      if (fogEffect.current) fogEffect.current.destroy();
    };
  }, []);

  // Set current level and fetch question data
  useEffect(() => setCurrentLevel(level), [level, setCurrentLevel]);
  useEffect(() => {
    axios.get(`http://localhost:3000/api/v1/level/${level}`, { withCredentials: true })
      .then(res => setLevelData(res.data))
      .catch(() => setFeedback("⚠️ Failed to load the oracle's vision..."));
  }, [level]);

  const handleSubmit = async () => {
    if (!userAnswer.trim() || isSubmitting || isLocked) return;
    setIsSubmitting(true);
    setFeedback("");
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/level/${level}/submit`,
        { answer: userAnswer },
        { withCredentials: true }
      );
      if (res.data.message === "Correct answer") {
        setFeedback("✅ The prophecy is true!");
        setFinished(true);
        completeLevel(level);
        updateScore(10);
        setTimeout(() => setShowCompleteScreen(true), 1500);
      } else {
        setFeedback("❌ The vision remains clouded...");
        await handleUseAttempt();
      }
    } catch {
      setFeedback("⚠️ The cosmic energies are unstable...");
    }
    setIsSubmitting(false);
  };

  if (showCompleteScreen) return <LevelCompleteScreen />;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#0D0D0D', overflow: 'hidden' }}>
      <style>{styleBlock}</style>
      {/* Fog background */}
      <div ref={fogRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Animated particles overlay */}
      <div className="flow-bg" style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(270deg, #3f00710f, #b3001b0d, #9d4edd0e)',
        backgroundSize: '300% 300%',
        opacity: 0.7,
      }}></div>

      {/* Game UI overlay */}
      <div style={{ position: 'relative', zIndex: 1 }} className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-4xl font-bold mb-8 flex items-center">
          <span className="float mr-3" style={{ 
            color: '#9D4EDD', 
            filter: 'drop-shadow(0 0 6px #3F0071)',
            animation: 'ghostGlow 3s infinite'
          }}>🔮</span>
          <span className="flicker" style={{ 
            color: '#E5E5E5', 
            textShadow: '0 0 8px #9D4EDD',
            background: 'linear-gradient(90deg, #9D4EDD, #B3001B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Predict the output </span>
        </h1>
        
        <div className="relative mb-8 max-w-2xl w-full">
          <div className="absolute inset-0 rounded-xl" style={{
            background: 'linear-gradient(135deg, #3F0071, #B3001B)',
            filter: 'blur(10px)',
            opacity: 0.7,
            zIndex: -1
          }}></div>
          <pre className="relative p-6 rounded-xl font-mono whitespace-pre-wrap text-center" style={{ 
            color: '#E5E5E5', 
            textShadow: '0 0 6px #9D4EDD',
            animation: 'ghostGlow 4s infinite alternate',
            backgroundColor: 'rgba(13, 13, 13, 0.8)',
            border: '1px solid #3F0071',
            boxShadow: '0 0 20px rgba(157, 78, 221, 0.5)'
          }}>
            {levelData?.question || 'Consulting the cosmic patterns...'}
          </pre>
        </div>

        {attemptsLeft != null && (
          <p className="mb-4 flex items-center" style={{ 
            color: '#D0FF00', 
            animation: 'ghostGlow 2s infinite alternate' 
          }}>
            <span className="mr-2">🌀</span> attempts remaining: {attemptsLeft}
          </p>
        )}
        {isLocked && (
          <p className="mb-4 flicker font-semibold flex items-center" style={{ color: '#FF4D6B' }}>
            <span className="mr-2">⛔</span> The oracle needs rest...
          </p>
        )}

        {!finished && (
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <div className="relative w-full">
              <input
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Enter Your Output"
                className="w-full px-4 py-3 text-center rounded-xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(229, 229, 229, 0.1)', 
                  color: '#E5E5E5', 
                  border: '2px solid #3F0071',
                  backdropFilter: 'blur(5px)'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#9D4EDD';
                  e.currentTarget.style.boxShadow = '0 0 15px #9D4EDD';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#3F0071';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                disabled={isSubmitting || isLocked}
              />
              <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
                border: '1px solid #9D4EDD',
                opacity: 0.5,
                animation: 'ghostGlow 3s infinite alternate'
              }}></div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isLocked}
              className="px-8 py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden pulse"
              style={{ 
                backgroundColor: isLocked ? '#4a4a4a' : '#9D4EDD', 
                color: '#E5E5E5',
                minWidth: '200px'
              }}
              onMouseEnter={e => {
                if (!isLocked) {
                  e.currentTarget.style.boxShadow = '0 0 25px #9D4EDD';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="mr-2 animate-spin">🌀</span> Consulting the stars...
                </span>
              ) : isLocked ? (
                "Path Sealed"
              ) : (
                "Reveal Vision"
              )}
              <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
                border: '1px solid #D0FF00',
                opacity: 0.6,
                animation: 'ghostGlow 2s infinite alternate'
              }}></div>
            </button>
          </div>
        )}

        {feedback && (
          <p className={`mt-6 text-lg font-medium ${feedback.startsWith('✅') ? 'pulse' : ''}`} 
            style={{ 
              color: feedback.startsWith('✅') ? '#00FF9D' : 
                     feedback.startsWith('❌') ? '#FF4D6B' : '#D0FF00',
              textShadow: `0 0 10px ${feedback.startsWith('✅') ? '#00FF9D' : 
                          feedback.startsWith('❌') ? '#FF4D6B' : '#D0FF00'}`,
              animation: feedback.startsWith('❌') ? 'none' : ''
            }}>
            {feedback.startsWith('✅') && '✨ '}
            {feedback.startsWith('❌') && '🌫️ '}
            {feedback}
          </p>
        )}
        
        {finished && (
          <div className="mt-8 text-center">
            <p className="text-3xl font-bold mb-2 pulse" style={{ 
              color: '#D0FF00', 
              textShadow: '0 0 15px #D0FF00',
              background: 'linear-gradient(90deg, #9D4EDD, #D0FF00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🌟 Congratulations Correct output ! 🌟
            </p>
            <p className="text-lg" style={{ color: '#9D4EDD' }}>
              The cosmic patterns align in your favor...
            </p>
          </div>
        )}
        
        {isLocked && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="mt-6 px-6 py-3 rounded-xl font-bold transition-all flicker"
            style={{ 
              backgroundColor: '#B3001B', 
              color: '#E5E5E5',
              border: '1px solid #FF4D6B'
            }}
            onMouseEnter={e => {
              if (!retrying) {
                e.currentTarget.style.boxShadow = '0 0 20px #B3001B';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {retrying ? (
              <span className="flex items-center">
                <span className="mr-2 animate-spin">🌀</span> Channeling energy...
              </span>
            ) : (
              "Reopen Path (-5 Cosmic Energy)"
            )}
          </button>
        )}
      </div>
    </div>
  );
}