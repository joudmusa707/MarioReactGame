import { useState } from "react";
import Canvas from "./Canvas";
import Score from "./Score";
import Lives from "./Lives";
import GameOverlay from "./OverLayCard";

const GameUI = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState("playing");

  // Reset function for coins/score
  const handleScoreReset = () => {
    setScore(0);
  };

  const handleCoinCollect = (coins) => {
    setScore((prev) => prev + coins);
  };

  const handleEnemyKill = (points = 50) => {
    setScore((prev) => prev + points);
  };

  const handlePlayerDeath = () => {
    // Reset score immediately when a life is lost

    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState("lose");
        return 0;
      }
      return newLives;
    });
    handleScoreReset();
  };

  const handleWin = () => {
    setGameState("win");
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameState("playing");
  };

  return (
    <div
      style={{
        backgroundColor: "#222",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        overflow: "hidden",
      }}
    >
      <Score score={score} />
      <Lives lives={lives} />
      <div style={{ position: "relative" }}>
        {gameState !== "playing" && (
          <GameOverlay
            gameState={gameState}
            score={score}
            onRestart={resetGame}
          />
        )}
        <Canvas
          gameState={gameState}
          onCoinCollect={handleCoinCollect}
          onEnemyKill={handleEnemyKill}
          onPlayerDeath={handlePlayerDeath}
          onWin={handleWin}
          onScoreReset={handleScoreReset}
        />
      </div>
    </div>
  );
};

export default GameUI;
