const Lives = ({ lives }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        display: "flex",
        gap: "10px",
      }}
    >
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: "30px",
            filter: i >= lives ? "grayscale(100%) opacity(0.3)" : "none",
            transition: "0.3s",
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
};
export default Lives;
