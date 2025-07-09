import { useParams, Navigate } from "react-router-dom";

import FindObjectGame from "../rooms/easy/FindObjectGame";
import MatchQuestGame from "../rooms/easy/MatchOuest";
import ShadowGameLevel from "../rooms/easy/ShadowShape";
import PatternBreakerLevel from "../rooms/medium/PatternBreaker";
import GuessLiarGame from "../rooms/medium/GuessTheLiar";
import MazeEscapeLevel from "../rooms/medium/MazeEscape";
import OutputPredictorLevel from "../rooms/medium/OutputPredictor";
import WordleGame from "../rooms/hard/WordleClone";
import FlappyBirdLevel from "../rooms/hard/FlappyBird";
import GameMenu from "./GameMenu";
import PacmanMazeGame from "../rooms/hard/FinalEscape";
import Timer from "./Timer";
import Score from "./Score";
export default function LevelRouter() {
  const { id } = useParams();
  const level = parseInt(id, 10);
  const maxLevel= 10;
 
  const withMenu = (Component) => (
    <div className="relative w-full h-screen">
    
      <div className="fixed top-4 right-[72px] z-[9998] flex items-center space-x-3 pointer-events-none">
        <Score currentLevel={level} />
        <Timer currentLevel={level} maxLevel={maxLevel} />
      </div>

      <div className="fixed top-4 right-4 z-[9999] pointer-events-auto">
        <GameMenu />
      </div>

      {Component}
    </div>


  );

  const levelComponents = {
    1: withMenu(<FindObjectGame />),
    2: withMenu(<MatchQuestGame />),
    3: withMenu(<ShadowGameLevel />),
    4: withMenu(<MazeEscapeLevel />),
    5: withMenu(<PatternBreakerLevel />),
    6: withMenu(<OutputPredictorLevel />),
    7: withMenu(<GuessLiarGame />),
    8: withMenu(<WordleGame />),
    9: withMenu(<FlappyBirdLevel />),
    10: (
      <div className="text-white text-center mt-40 text-3xl">
        🎉 You Escaped All Rooms! <br />
        Final level coming soon!
      </div>,
        withMenu(<PacmanMazeGame />)
    ),
  };

  // If invalid level ID or NaN, redirect to home
  if (!levelComponents[level]) {
    return <Navigate to="/" replace />;
  }

  return levelComponents[level];
}
