function OverLayCard({ gameState, score, onRestart, onNextLevel }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        minWidth: "300px",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          color: gameState === "win" ? "#4CAF50" : "#f44336",
          marginBottom: "20px",
        }}
      >
        {gameState === "win" ? "LEVEL COMPLETE" : "GAME OVER"}
      </h1>

      <p
        style={{
          fontSize: "22px",
          marginBottom: "30px",
        }}
      >
        Score: {score}
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onRestart}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            cursor: "pointer",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Restart
        </button>

        {gameState === "win" && (
          <button
            onClick={onNextLevel}
            style={{
              padding: "12px 24px",
              fontSize: "18px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Next Level
          </button>
        )}
      </div>
    </div>
  );
}

export default OverLayCard;
