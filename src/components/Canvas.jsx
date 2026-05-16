import { useRef } from "react";
import useGameEngine from "./useGameEngine";
import "../style/Canvas.css";
const Canvas = ({
  gameState,
  currentLevel,
  onCoinCollect,
  onEnemyKill,
  onPlayerDeath,
  onWin,
  onScoreReset,
}) => {
  const canvasRef = useRef(null);

  useGameEngine(canvasRef, {
    gameState,
    currentLevel,
    onCoinCollect,

    onEnemyKill,
    onPlayerDeath,
    onWin,
    onCoinReset: onScoreReset,
  });

  return <canvas ref={canvasRef} className="game-canvas" />;
};
export default Canvas;
