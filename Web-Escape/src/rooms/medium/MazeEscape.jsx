import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import useGameStore from "../../state/gameStore";
import LevelCompleteScreen from "../../components/LevelCompleteScreen"; 

const MazeEscapeLevel = () => {
  const { id } = useParams();
  const level = parseInt(id, 10); 

  const [maze, setMaze] = useState([]);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [exit, setExit] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("");
  const [gridSize, setGridSize] = useState(20);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);

  const { setCurrentLevel, completeLevel, updateScore } = useGameStore();

  useEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/level/${level}`, { withCredentials: true })
      .then((res) => {
        setMaze(res.data.data.maze);
        setPlayer(res.data.data.start);
        setExit(res.data.data.exit);
        if (res.data.data.maze?.[0]) {
          setGridSize(res.data.data.maze[0].length);
        }
      })
      .catch((err) => {
        console.error("Failed to load maze", err);
        setMessage("⚠️ Failed to load maze data.");
      });
  }, [level]);

  const movePlayer = async (dx, dy) => {
    const { x, y } = player;
    const newX = x + dx;
    const newY = y + dy;

    if (
      newX < 0 || newY < 0 ||
      newX >= maze[0]?.length || newY >= maze.length
    ) return;

    const currentCell = maze[y][x];
    const nextCell = maze[newY][newX];

    if (!nextCell || !currentCell) return;

    if (
      (dx === 1 && currentCell.right) ||
      (dx === -1 && currentCell.left) ||
      (dy === 1 && currentCell.bottom) ||
      (dy === -1 && currentCell.top)
    ) return;

    setPlayer({ x: newX, y: newY });

    if (newX === exit.x && newY === exit.y) {
      try {
        const res = await axios.post(
          `http://localhost:3000/api/v1/level/${level}/submit`,
          { x: newX, y: newY },
          { withCredentials: true }
        );
        if (res.data.success) {
          setMessage("🎉 You solved the maze!");
          completeLevel(level);
          updateScore(10);
          setTimeout(() => setShowCompleteScreen(true), 1500);
        } else {
          setMessage("🚫 Wrong solution.");
        }
      } catch (err) {
        console.error("Submit error:", err?.message || err);
        setMessage("⚠️ Error submitting answer.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, maze]);

  if (showCompleteScreen) return <LevelCompleteScreen />; 

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-4">🧱 Wall Maze Puzzle</h1>

      {maze.length > 0 ? (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 15px)`,
            gridTemplateRows: `repeat(${gridSize}, 15px)`
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = player.x === x && player.y === y;
              const isExit = exit.x === x && exit.y === y;

              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    width: "15px",
                    height: "15px",
                    boxSizing: "border-box",
                    position: "relative",
                    borderTop: cell.top ? "2px solid black" : "none",
                    borderRight: cell.right ? "2px solid black" : "none",
                    borderBottom: cell.bottom ? "2px solid black" : "none",
                    borderLeft: cell.left ? "2px solid black" : "none"
                  }}
                >
                  {isPlayer && (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#facc15",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                    ></div>
                  )}
                  {isExit && (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#22c55e",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                    ></div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <p>Loading maze...</p>
      )}

      <div className="mt-6 space-y-2">
        <div className="flex justify-center space-x-2">
          <button onClick={() => movePlayer(0, -1)}>⬆️</button>
        </div>
        <div className="flex justify-center space-x-2">
          <button onClick={() => movePlayer(-1, 0)}>⬅️</button>
          <button onClick={() => movePlayer(1, 0)}>➡️</button>
        </div>
        <div className="flex justify-center space-x-2">
          <button onClick={() => movePlayer(0, 1)}>⬇️</button>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-center text-green-700 font-semibold text-md">{message}</p>
      )}
    </div>
  );
};

export default MazeEscapeLevel;
