import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import birdImg from '../../assets/image.png';
import birdFlapImg from '../../assets/image.png';
import bgImg from '../../assets/Background-Image.png';
import useGameStore from '../../state/gameStore';
import LevelCompleteScreen from '../../components/LevelCompleteScreen'; 
import axios from 'axios';

const FlappyBirdLevel = () => {
  const { id } = useParams(); 
  const level = parseInt(id, 10); 
  const [gameState, setGameState] = useState('Start');
  const [score, setScore] = useState(0);
  const [birdTop, setBirdTop] = useState((40 * window.innerHeight) / 100);
  const [birdDy, setBirdDy] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [frameCount, setFrameCount] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [retrying, setRetrying] = useState(false);  

  const moveSpeed = 2.8;
  const gravity = 0.18;
  const flapStrength = -5.2;
  const maxFallSpeed = 5.5;
  const pipeGap = 32;

  const birdRef = useRef();
  const backgroundRef = useRef();
  const [birdSrc, setBirdSrc] = useState(birdImg);

  const { currentLevel, setCurrentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    setCurrentLevel(level); 
  }, [level]);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        await axios.get(`http://localhost:3000/api/v1/level/${level}`, {
          withCredentials: true,
        });
      } catch (err) {
        console.error('Error fetching level:', err);
      }
    };
    fetchLevelData();
  }, [level]);

  const resetGame = () => {
    setGameState('Start');
    setBirdTop((40 * window.innerHeight) / 100);
    setBirdDy(0);
    setScore(0);
    setPipes([]);
    setFrameCount(0);
    setLevelCompleted(false);
    setShowCompleteScreen(false);
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/game/level/${level}/retry`,
        {},
        { withCredentials: true }
      );
      resetGame();
    } catch (err) {
      console.error('Retry failed', err);
      alert('⚠️ Retry failed. Try again later.');
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (gameState === 'Start') {
          setGameState('Play');
          setBirdTop((40 * window.innerHeight) / 100);
          setBirdDy(0);
          setScore(0);
          setPipes([]);
        } else if (gameState === 'Play') {
          setBirdSrc(birdFlapImg);
          setBirdDy(flapStrength);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space' && gameState === 'Play') {
        setBirdSrc(birdImg);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'Play') return;
    const gameLoop = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(gameLoop);
  }, [birdDy, birdTop, pipes, frameCount, gameState]);

  const updateGame = () => {
    const background = backgroundRef.current.getBoundingClientRect();
    const birdBox = birdRef.current.getBoundingClientRect();
    const cappedBirdDy = Math.min(birdDy + gravity, maxFallSpeed);
    let newBirdTop = birdTop + cappedBirdDy;

    if (newBirdTop <= 0) newBirdTop = 0;
    if (newBirdTop + birdBox.height >= background.bottom) {
      endGame();
      return;
    }

    const birdCenterX = birdBox.left + birdBox.width / 2;
    const birdCenterY = birdBox.top + birdBox.height / 2;
    const birdRadius = Math.min(birdBox.width, birdBox.height) / 2 - 10;

    const newPipes = pipes.map(pipe => {
      const pipeBox = document.getElementById(pipe.id)?.getBoundingClientRect();
      if (!pipeBox) return pipe;

      const closestX = Math.max(pipeBox.left, Math.min(birdCenterX, pipeBox.right));
      const closestY = Math.max(pipeBox.top, Math.min(birdCenterY, pipeBox.bottom));
      const dx = birdCenterX - closestX;
      const dy = birdCenterY - closestY;

      if (dx * dx + dy * dy < birdRadius * birdRadius) {
        endGame();
      } else if (pipeBox.right < birdBox.left && pipe.increase_score === '1') {
        setScore(prev => prev + 1);
        pipe.increase_score = '0';
      }

      pipe.left -= moveSpeed;
      return pipe;
    }).filter(pipe => pipe.left + (window.innerWidth * 0.06) > 0);

    if (frameCount >= 100) {
      const posY = Math.floor(Math.random() * 35) + 10;
      const topPipe = {
        id: `pipe-top-${Date.now()}`,
        top: posY - 70,
        left: window.innerWidth,
        increase_score: '0',
      };
      const bottomPipe = {
        id: `pipe-bottom-${Date.now()}`,
        top: posY + pipeGap,
        left: window.innerWidth,
        increase_score: '1',
      };
      newPipes.push(topPipe, bottomPipe);
      setFrameCount(0);
    } else {
      setFrameCount(prev => prev + 1);
    }

    setBirdTop(newBirdTop);
    setBirdDy(cappedBirdDy);
    setPipes(newPipes);

    if (score >= 20 && !levelCompleted) {
      setLevelCompleted(true);
      completeLevel(level);
      updateScore(15);
      axios.post(`http://localhost:3000/api/v1/level/${level}/submit`, {
        score: score
      }, { withCredentials: true }).catch(console.error);
      setTimeout(() => setShowCompleteScreen(true), 1500); 
    }
  };

  const endGame = () => {
    setGameState('End');
  };

  if (showCompleteScreen) return <LevelCompleteScreen />; 

  return (
    <div
      ref={backgroundRef}
      className="h-screen w-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {gameState !== 'End' && (
        <img
          src={birdSrc}
          ref={birdRef}
          alt="bird"
          className="fixed left-[30vw] z-50"
          style={{
            top: `${birdTop}px`,
            height: '100px',
            width: '130px',
          }}
        />
      )}

      {pipes.map(pipe => (
        <div
          key={pipe.id}
          id={pipe.id}
          className="fixed border-4 border-black"
          style={{
            left: `${pipe.left}px`,
            top: `${pipe.top}vh`,
            height: '70vh',
            width: '6vw',
            background: 'radial-gradient(lightgreen 50%, green)',
          }}
        ></div>
      ))}

      {gameState === 'Start' && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-8 text-center text-black shadow-xl">
            <h1 className="text-5xl font-extrabold mb-4">Flappy Bird</h1>
            <p className="text-xl text-green-800 font-semibold mb-2">
              🎯 Reach Score: <span className="font-bold">20</span>
            </p>
            <p className="text-2xl animate-pulse">
              Press <span className="text-yellow-500 font-bold">Spacebar</span> to Start
            </p>
          </div>
        </div>
      )}

      {gameState === 'End' && !levelCompleted && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-8 text-center text-black shadow-xl">
            <h2 className="text-4xl font-bold mb-4">Game Over</h2>
            <p className="text-2xl mb-6">
              Your Score: <span className="text-green-600 font-bold">{score}</span>
            </p>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition disabled:opacity-50"
            >
              {retrying ? "Retrying..." : "Restart Game"}
            </button>
          </div>
        </div>
      )}

      {levelCompleted && !showCompleteScreen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-black/60 backdrop-blur-md text-green-400 text-4xl font-extrabold p-8 rounded-xl">
            ✅ Level Completed!
          </div>
        </div>
      )}

      {(gameState === 'Play' || gameState === 'End') && (
        <div className="fixed top-2 left-4 z-50 text-white text-6xl font-extrabold drop-shadow-md">
          <span className="text-white/90">Score: </span>
          <span className="text-yellow-400">{score}</span>
        </div>
      )}
    </div>
  );
};

export default FlappyBirdLevel;
