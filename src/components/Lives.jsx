import "../style/Lives.css";
const Lives = ({ lives }) => {
  return (
    <div className="lives-parent-container">
      {[...Array(3)].map((_, i) => (
        <span key={i} className={`heart ${i < lives ? "full" : "empty"}`}>
          ❤️
        </span>
      ))}
    </div>
  );
};
export default Lives;
