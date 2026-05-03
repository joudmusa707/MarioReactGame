const Score = ({ score }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        color: "white",
        fontSize: "24px",
        fontFamily: "sans-serif",
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
      }}
    >
      SCORE: {score}
    </div>
  );
};
export default Score;
