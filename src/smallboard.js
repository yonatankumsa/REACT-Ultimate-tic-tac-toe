import Square from "./square.js";
import { useState } from "react";

export default function SmallBoard({
  xIsNext,
  setXIsNext,
  currentGame,
  setCurrentGame,
  boardsWon,
  setBoardsWon,
  thisBoard,
  overallWinner
}) {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function calculateWinner(squares) {
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
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        let newBoardsWon = boardsWon.slice();
        newBoardsWon[thisBoard] = xIsNext ? "X" : "O";
        setBoardsWon(newBoardsWon);
        return true;
      }
    }

    if (!squares.includes(null)) {
      let newBoardsWon = boardsWon.slice();
      newBoardsWon[thisBoard] = " ";
      setBoardsWon(newBoardsWon);
    }
    return false;
  }

  function handleClick(i) {
    if (
      squares[i] ||
      boardsWon[thisBoard] ||
      !currentGame[thisBoard] ||
      overallWinner
    ) {
      return;
    }
    setXIsNext(!xIsNext);
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    setSquares(nextSquares);
    if ((calculateWinner(nextSquares) && i === thisBoard) || boardsWon[i]) {
      let newCurrentGame = boardsWon.map((board) => {
        return !board;
      });
      newCurrentGame[thisBoard] = false;
      setCurrentGame(newCurrentGame);
    } else {
      let newCurrentGame = Array(9).fill(false);
      newCurrentGame[i] = true;
      setCurrentGame(newCurrentGame);
    }
  }

  let rows = [];
  for (let i = 0; i < 3; i++) {
    let squareArray = [];
    for (let j = 0; j < 3; j++) {
      let k = i * 3 + j;
      let className = "square";
      if (overallWinner) {
        if (overallWinner.includes(thisBoard)) {
          className += " highlighted";
        }
      } else if (currentGame[thisBoard]) {
        className += " highlighted";
      }
      if (boardsWon[thisBoard] === " ") {
        className += " greyed";
      }
      squareArray.push(
        <Square
          className={className}
          value={squares[k]}
          onSquareClick={() => handleClick(k)}
        />
      );
    }
    rows.push(<div className="board-row">{squareArray}</div>);
  }

  return <>{rows}</>;
}
