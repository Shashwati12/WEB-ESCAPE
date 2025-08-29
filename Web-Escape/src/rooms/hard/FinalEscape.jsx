import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useGameStore from '../../state/gameStore';
import useAttempt from '../../hooks/useAttempt';
const TILE_SIZE = 32;
const ENEMY_SPEED = 500;
const GHOST_COLORS = ['red', 'blue', 'orange', 'pink'];
import { useParams } from 'react-router-dom'; 
export default function PacmanMazeGame() {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [enemies, setEnemies] = useState([
    { x: 23, y: 1, color: 'red' },
    { x: 23, y: 13, color: 'blue' },
    { x: 1, y: 13, color: 'orange' },
    { x: 12, y: 7, color: 'pink' }
  ]);
    const { id } = useParams(); 
   const level = parseInt(id, 10); 
  const [dotsLeft, setDotsLeft] = useState(0);
  const [status, setStatus] = useState("loading");
  const [score, setScore] = useState(0);
  const { attemptsLeft, updateAttempts } = useAttempt(level);
  const { currentLevel, completeLevel, updateScore } = useGameStore();
  
   useEffect(() => {
  updateScore(score); // 🔄 Automatically reflect changes
}, [score]);

  const dotSound = useRef(null);
  const winSound = useRef(null);
  const loseSound = useRef(null);

  // ⬇️ Fetch maze defined outside so it's reusable in retry
  const fetchMaze = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/level/10', {
        withCredentials: true
      });
      const levelMaze = res.data.data.maze;
      setMaze(levelMaze);
      let count = 0;
      levelMaze.forEach(row => row.forEach(cell => { if (cell === '.') count++; }));
      setDotsLeft(count);
      setStatus("playing");
    } catch (err) {
      console.error("Failed to fetch level data", err);
    }
  };

  useEffect(() => {
    dotSound.current = new Audio('/sounds/dot.wav');
    winSound.current = new Audio('/sounds/win.mp3');
    loseSound.current = new Audio('/sounds/caught.wav');
  }, []);

  useEffect(() => {
    fetchMaze();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== "playing") return;
      const { x, y } = playerPos;
      let newX = x;
      let newY = y;
      if (e.key === 'ArrowUp') newY--;
      else if (e.key === 'ArrowDown') newY++;
      else if (e.key === 'ArrowLeft') newX--;
      else if (e.key === 'ArrowRight') newX++;

      if (maze[newY]?.[newX] === '#' || !maze[newY] || !maze[newY][newX]) return;

      const newMaze = maze.map(row => [...row]);
      if (newMaze[newY][newX] === '.') {
        newMaze[newY][newX] = ' ';
        setDotsLeft(prev => prev - 1);
        dotSound.current?.play();
      }

      setPlayerPos({ x: newX, y: newY });
      setMaze(newMaze);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, maze, status]);

  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(() => {
      setEnemies(prev => prev.map(({ x, y, color }) => {
        const directions = [
          { x: 0, y: -1 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ];
        const valid = directions.filter(d => maze[y + d.y]?.[x + d.x] !== '#');
        const move = valid[Math.floor(Math.random() * valid.length)] || { x: 0, y: 0 };
        return { x: x + move.x, y: y + move.y, color };
      }));
    }, ENEMY_SPEED);
    return () => clearInterval(interval);
  }, [maze, status]);

  useEffect(() => {
    enemies.forEach(enemy => {
      if (enemy.x === playerPos.x && enemy.y === playerPos.y && status === "playing") {
        setStatus("lost");
        loseSound.current?.play();
        axios.post(`http://localhost:3000/api/v1/level/10/submit`, {
          answer: "caught",
        }, { withCredentials: true });
      }
    });
  }, [enemies, playerPos]);

  useEffect(() => {
    if (dotsLeft === 0 && status === "playing") {
      setStatus("won");
      winSound.current?.play();
      axios.post(`http://localhost:3000/api/v1/level/10/submit`, {
        answer: 'victory',
      }, { withCredentials: true })
        .then(res => {
          if (res.data.success) {
            completeLevel(currentLevel);
            updateScore(10);
          }
        });
    }
  }, [dotsLeft, status]);

  const handleRetry = async () => {
    setPlayerPos({ x: 1, y: 1 });
    setEnemies([
      { x: 23, y: 1, color: 'red' },
      { x: 23, y: 13, color: 'blue' },
      { x: 1, y: 13, color: 'orange' },
      { x: 12, y: 7, color: 'pink' }
    ]);
    await fetchMaze();
  };


    const handleRetryWithAPI = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/game/level/10/retry`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Retry API failed', err);
      alert('⚠️ Retry failed. Try again later.');
      return;
    }

    handleRetry(); // call your original retry logic
  };

  if (status === "loading") return <div className="text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-auto">
      <h1 className="text-2xl font-bold mb-4">🟡 Room 10: Final Escape</h1>
      <div
        className="relative"
        style={{ width: `${TILE_SIZE * maze[0].length}px`, height: `${TILE_SIZE * maze.length}px` }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            const enemy = enemies.find(e => e.x === x && e.y === y);
            return (
              <div
                key={`${x}-${y}`}
                className={`absolute w-8 h-8 flex items-center justify-center text-lg font-bold
                  ${cell === '#' ? 'bg-gray-800' : 'bg-black'}
                  ${cell === '.' ? 'after:content-["•"] after:text-yellow-300' : ''}`}
                style={{ top: y * TILE_SIZE, left: x * TILE_SIZE }}
              >
                {isPlayer && <img src="/sprites/pacman.png" alt="Pacman" className="w-6 h-6" />}
                {enemy && <img src={`/sprites/ghost-${enemy.color}.png`} alt="ghost" className="w-6 h-6" />}
              </div>
            );
          })
        )}
      </div>

      {status === "won" && (
        <div className="text-green-400 mt-6 text-xl font-bold">
          🎉 You cleared the maze!
        </div>
      )}
      {status === "lost" && (
        <div className="flex flex-col items-center mt-6">
          <p className="text-red-500 text-xl font-bold mb-2">💀 You were caught!</p>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500 transition"
            onClick={handleRetryWithAPI}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
