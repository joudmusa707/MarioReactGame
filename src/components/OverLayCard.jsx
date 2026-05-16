import "../style/OverLayCard.css";

function OverLayCard({ gameState, score, onRestart, onNextLevel }) {
  const isWin = gameState === "win";

  return (
    <div className="overlay-card">
      {/* Dynamic template literal to handle the conditional color class */}
      <h1 className={`overlay-title ${isWin ? "win-text" : "lose-text"}`}>
        {isWin ? "LEVEL COMPLETE" : "GAME OVER"}
      </h1>

      <p className="overlay-score">Score: {score}</p>

      <div className="overlay-actions">
        <button onClick={onRestart} className="btn btn-restart">
          Restart
        </button>

        {isWin && (
          <button onClick={onNextLevel} className="btn btn-next">
            Next Level
          </button>
        )}
      </div>
    </div>
  );
}

export default OverLayCard;
