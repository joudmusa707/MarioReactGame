import { useState } from "react";
import Canvas from "./Canvas";
import Score from "./Score";
import Lives from "./Lives";
import GameOverlay from "./OverLayCard";
import "../style/GameUI.css";
const GameUI = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState("playing");
  const [currentLevel, setCurrentLevel] = useState(0);

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
  const handleNextLevel = () => {
    setCurrentLevel((prev) => {
      if (prev < 5) {
        return prev + 1;
      }

      return prev;
    });

    setScore(0);

    setLives(3);

    setGameState("playing");
  };

  const resetGame = () => {
    setScore(0);

    setLives(3);

    setGameState("playing");
  };

  return (
    <div className="gameUI-parent-container">
      <Score score={score} />
      <Lives lives={lives} />
      <div className="game-container">
        {gameState !== "playing" && (
          <GameOverlay
            gameState={gameState}
            score={score}
            onRestart={resetGame}
            onNextLevel={handleNextLevel}
          />
        )}
        <Canvas
          gameState={gameState}
          currentLevel={currentLevel}
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
