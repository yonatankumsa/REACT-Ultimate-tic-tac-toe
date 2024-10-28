export default function Header({ resetBoard }) {
  return (
    <h1 className="header">
      <span className="headerText">Ultimate Tic-Tac-Toe</span>
      <button className="resetButton" onClick={resetBoard}>
        Reset game
      </button>
    </h1>
  );
}
