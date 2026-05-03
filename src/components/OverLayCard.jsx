function OverLayCard({ gameState, score, onRestart }) {
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
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          color: gameState === "win" ? "#4CAF50" : "#f44336",
          margin: "0 0 20px 0",
        }}
      >
        {gameState === "win" ? "YOU WIN" : "GAME OVER"}
      </h1>
      <p style={{ fontSize: "20px", marginBottom: "30px" }}>Score: {score}</p>
      <button
        onClick={onRestart}
        style={{
          padding: "12px 30px",
          fontSize: "18px",
          cursor: "pointer",
          backgroundColor: "#333",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Restart
      </button>
    </div>
  );
}
export default OverLayCard;
