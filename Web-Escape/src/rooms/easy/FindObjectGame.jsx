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



// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { cn } from "../../lib/utils";
// // Color palette constants
// const COLORS = {
//   backgroundDark: ["#0D0D0D", "#1a0e2a"],
//   purples: ["#c084fc", "#ec4899", "#a78bfa", "#d946ef"],
//   status: { success: "#4ade80", error: "#f87171", warning: "#facc15" },
//   buttons: ["#22c55e", "#2dd4bf", "#eab308", "#fb923c"],
//   particles: ["#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]
// };

// export default function BackgroundBeamsWithCollision({ children, className }) {
//   const containerRef = useRef(null);
//   const parentRef = useRef(null);

//   const beams = Array.from({ length: 7 }, (_, i) => ({
//     initialX: 100 * i + 50,
//     translateX: 100 * i + 50,
//     duration: 5 + i,
//     repeatDelay: 2 + (i % 3),
//     delay: i,
//     height: 100 + (i % 3) * 80
//   }));

//   return (
//     <div
//       ref={parentRef}
//       className={cn(
//         "h-full w-full fixed inset-0 z-0",
//         "bg-gradient-to-b from-black to-[#1a0e2a]",
//         "relative flex items-center justify-center overflow-hidden",
//         className
//       )}
//     >
//       {/* Floating particles */}
//       {[...Array(30)].map((_, i) => (
//         <motion.div
//           key={`particle-${i}`}
//           className="absolute rounded-full"
//           style={{
//             width: 2 + Math.random() * 4,
//             height: 2 + Math.random() * 4,
//             backgroundColor:
//               COLORS.particles[Math.floor(Math.random() * COLORS.particles.length)],
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             opacity: 0.6
//           }}
//           animate={{
//             y: [0, Math.random() * 20 - 10],
//             x: [0, Math.random() * 20 - 10]
//           }}
//           transition={{
//             duration: 4 + Math.random() * 3,
//             repeat: Infinity,
//             repeatType: "reverse"
//           }}
//         />
//       ))}

//       {/* Beams */}
//       {beams.map((opts, idx) => (
//         <CollisionMechanism
//           key={idx}
//           beamOptions={opts}
//           containerRef={containerRef}
//           parentRef={parentRef}
//         />
//       ))}

//       {/* Your content */}
//       {children}

//       {/* Bottom Collision Container */}
//       <div
//         ref={containerRef}
//         className="absolute bottom-0 w-full inset-x-0 pointer-events-none"
//         style={{
//           height: 8,
//           background: COLORS.backgroundDark[1],
//           boxShadow: `0 0 20px ${COLORS.purples[2]} inset`
//         }}
//       />
//     </div>
//   );
// }

// function CollisionMechanism({ containerRef, parentRef, beamOptions }) {
//   const beamRef = useRef(null);
//   const [collision, setCollision] = useState({ detected: false, coordinates: null });
//   const [beamKey, setBeamKey] = useState(0);
//   const [cycleDetected, setCycleDetected] = useState(false);

//   useEffect(() => {
//     const id = setInterval(() => {
//       if (!cycleDetected && beamRef.current && containerRef.current && parentRef.current) {
//         const b = beamRef.current.getBoundingClientRect();
//         const c = containerRef.current.getBoundingClientRect();
//         const p = parentRef.current.getBoundingClientRect();
//         if (b.bottom >= c.top) {
//           setCollision({
//             detected: true,
//             coordinates: {
//               x: b.left - p.left + b.width / 2,
//               y: b.bottom - p.top
//             }
//           });
//           setCycleDetected(true);
//         }
//       }
//     }, 50);
//     return () => clearInterval(id);
//   }, [cycleDetected]);

//   useEffect(() => {
//     if (collision.detected) {
//       const t1 = setTimeout(() => {
//         setCollision({ detected: false, coordinates: null });
//         setCycleDetected(false);
//       }, 2000);
//       const t2 = setTimeout(() => setBeamKey((k) => k + 1), 2000);
//       return () => {
//         clearTimeout(t1);
//         clearTimeout(t2);
//       };
//     }
//   }, [collision]);

//   return (
//     <>
//       <motion.div
//         key={beamKey}
//         ref={beamRef}
//         initial={{ x: beamOptions.initialX, y: -200 }}
//         animate={{ x: beamOptions.translateX, y: 1800 }}
//         transition={{
//           duration: beamOptions.duration,
//           repeat: Infinity,
//           ease: "linear",
//           delay: beamOptions.delay,
//           repeatDelay: beamOptions.repeatDelay
//         }}
//         className="absolute w-[2px] rounded-full"
//         style={{
//           height: beamOptions.height,
//           background: `linear-gradient(to top, ${COLORS.purples[0]}, ${COLORS.purples[2]}, transparent)`
//         }}
//       />

//       {collision.detected && (
//         <Explosion
//           key={`${collision.coordinates.x}-${collision.coordinates.y}`}
//           style={{
//             left: collision.coordinates.x,
//             top: collision.coordinates.y,
//             transform: "translate(-50%, -50%)"
//           }}
//         />
//       )}
//     </>
//   );
// }

// function Explosion(props) {
//   const particles = Array.from({ length: 20 }, (_, i) => ({
//     id: i,
//     dx: Math.random() * 120 - 60,
//     dy: Math.random() * -80 - 40,
//     size: Math.random() * 4 + 2,
//     color: COLORS.purples[Math.floor(Math.random() * COLORS.purples.length)]
//   }));

//   return (
//     <div {...props} className="absolute z-50">
//       <motion.div
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: [0, 3, 4], opacity: [0, 1, 0] }}
//         exit={{ scale: 4, opacity: 0 }}
//         transition={{ duration: 0.8, times: [0, 0.5, 1] }}
//         className="absolute inset-0 m-auto rounded-full"
//         style={{
//           width: 40,
//           height: 40,
//           background: `radial-gradient(circle, ${COLORS.purples[1]}, transparent)`,
//           filter: "blur(12px)"
//         }}
//       />
//       {particles.map((p) => (
//         <motion.span
//           key={p.id}
//           initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
//           animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.2 }}
//           transition={{ duration: 0.8 + Math.random() * 0.7, ease: "easeOut" }}
//           className="absolute rounded-full"
//           style={{
//             width: p.size,
//             height: p.size,
//             background: p.color
//           }}
//         />
//       ))}
//     </div>
//   );
// }
