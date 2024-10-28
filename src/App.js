import { useState } from "react";
import SmallBoard from "./smallboard.js";
import Rules from "./rules.js";

export default function App() {
  return (
    <div id="container">
      <Header />
      <BigBoard />
      <Rules />
    </div>
  );
}

function Header() {
  return <h1>Ultimate Tic-Tac-Toe</h1>;
}

function BigBoard() {
  const [currentGame, setCurrentGame] = useState(Array(9).fill(true));
  const [xIsNext, setXIsNext] = useState(true);
  const [boardsWon, setBoardsWon] = useState(Array(9).fill(null));

  let status = xIsNext
    ? "X to play in any highlighted square"
    : "O to play in a highlighted square";

  function changeCurrentGame(newGames) {
    setCurrentGame(newGames);
  }

  function changeBoardsWon(newGames) {
    setBoardsWon(newGames);
  }

  function calculateWinnerBig() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        boardsWon[a] &&
        boardsWon[a] === boardsWon[b] &&
        boardsWon[a] === boardsWon[c]
      ) {
        return [a, b, c];
      }
    }
    if (!boardsWon.includes(null)) {
      return "draw";
    }

    return false;
  }

  const overallWinner = calculateWinnerBig();
  if (overallWinner) {
    if (overallWinner === "draw") {
      status = "No more legal moves. The game is a draw.";
    } else {
      status = "Congratulations, " + boardsWon[overallWinner[0]] + " wins!";
    }
  }

  let rows = [];
  for (let i = 0; i < 3; i++) {
    let boardArray = [];
    for (let j = 0; j < 3; j++) {
      let k = i * 3 + j;
      let children = [
        <SmallBoard
          xIsNext={xIsNext}
          setXIsNext={setXIsNext}
          currentGame={currentGame}
          setCurrentGame={changeCurrentGame}
          boardsWon={boardsWon}
          setBoardsWon={changeBoardsWon}
          thisBoard={k}
          overallWinner={overallWinner}
        />
      ];
      if (boardsWon[k]) {
        children.push(<div className="bigScore">{boardsWon[k]}</div>);
      }
      boardArray.push(<td key={k}>{children}</td>);
    }
    rows.push(<tr>{boardArray}</tr>);
  }

  return (
    <>
      <div className="status">{status}</div>
      <table>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
}
