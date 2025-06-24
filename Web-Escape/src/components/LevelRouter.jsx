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

export default function LevelRouter() {
  const { id } = useParams();
  const level = parseInt(id, 10);

  const levelComponents = {
    1: <FindObjectGame />,
    2: <MatchQuestGame />,
    3: <ShadowGameLevel />,
    4: <MazeEscapeLevel />,
    5: <PatternBreakerLevel/>,
    6: <OutputPredictorLevel/>,
    7: <GuessLiarGame />,
    8: <WordleGame />,
    9: <FlappyBirdLevel />,
    10: (
      <div className="text-white text-center mt-40 text-3xl">
        🎉 You Escaped All Rooms! <br />
        Final level coming soon!
      </div>
    ),
  };

  // If invalid level ID or NaN, redirect to home
  if (!levelComponents[level]) {
    return <Navigate to="/" replace />;
  }

  return levelComponents[level];
}
