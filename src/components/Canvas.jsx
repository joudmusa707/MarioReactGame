import { useRef } from "react";
import useGameEngine from "./useGameEngine";
const Canvas = ({
  gameState,
  onCoinCollect,
  onEnemyKill,
  onPlayerDeath,
  onWin,
  onScoreReset,
}) => {
  const canvasRef = useRef(null);

  useGameEngine(canvasRef, {
    gameState,
    onCoinCollect,
    onEnemyKill,
    onPlayerDeath,
    onWin,
    onCoinReset: onScoreReset,
  });

  return (
    <canvas
      ref={canvasRef}
      style={{ boxShadow: "0 0 20px rgba(0,0,0,0.5)", background: "#fff" }}
    />
  );
};
export default Canvas;
