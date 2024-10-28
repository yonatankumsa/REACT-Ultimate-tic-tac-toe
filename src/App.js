import { useState } from "react";
import SmallBoard from "./smallboard.js";
import Rules from "./rules.js";
import { calculateWinner, findBoardsWon } from "./calculateWinner.js";
import Header from "./header";
import { minMaxMove } from "./AI/ai.js";
import ButtonsDiv from "./buttonsDiv";

export default function App() {
  const [reset, setReset] = useState(0);

  function resetBoard() {
    setReset(reset + 1);
  }

  return (
    <div id="container">
      <Header resetBoard={resetBoard} />
      <BigBoard key={reset} />
      <Rules />
    </div>
  );
}

function BigBoard() {
  let initalPosition = [];
  for (let i = 0; i < 9; i++) {
    initalPosition.push(Array(9).fill(null));
  }
  const [gamePosition, setGamePosition] = useState(initalPosition);
  const [lastMove, setLastMove] = useState(null);
  const [robot, setRobot] = useState(2);

  let moveCount = 0;
  gamePosition.forEach((board) => {
    board.forEach((square) => {
      if (square) {
        moveCount += 1;
      }
    });
  });

  let xNext = (moveCount + 1) % 2;
  let currentGame = Array(9).fill(true);

  let status = xNext
    ? "X to play in any highlighted square"
    : "O to play in a highlighted square";

  function updateRobot(value) {
    setRobot(value);
  }

  function updateGame(board, position, x = xNext) {
    if (robot && !xNext) return;
    let nextPosition = structuredClone(gamePosition);
    let player = "X";
    if (!x) {
      player = "O";
    }
    nextPosition[board][position] = player;
    setGamePosition(nextPosition);
    setLastMove(position);

    return nextPosition[board];
  }

  const boardsFinished = findBoardsWon(gamePosition);
  let overallWinner = calculateWinner(boardsFinished);

  if (boardsFinished[lastMove] || lastMove === null) {
    currentGame = boardsFinished.map((board) => !board);
  } else {
    currentGame = Array(9).fill(false);
    currentGame[lastMove] = true;
  }

  if (!xNext && robot && !overallWinner) {
    const robotMove = minMaxMove(lastMove + 0, gamePosition, xNext, robot)[1];
    let nextPosition = structuredClone(gamePosition);
    nextPosition[robotMove[0]][robotMove[1]] = "O";
    setGamePosition(nextPosition);
    setLastMove(robotMove[1]);
  }

  if (typeof overallWinner === "object") {
    status = "Congratulations! Player " + overallWinner[0] + " won.";
  } else if (overallWinner === "draw") {
    status = "No more legal moves. The game is a draw";
  }

  let rows = [];
  for (let i = 0; i < 3; i++) {
    let boardArray = [];
    for (let j = 0; j < 3; j++) {
      let k = i * 3 + j;
      let boardState = boardsFinished[k];
      if (typeof overallWinner === "object") {
        if (overallWinner.includes(k)) {
          boardState = "winning line";
        }
      } else if (boardState === null && currentGame[k]) {
        boardState = "current";
      }

      let children = [
        <SmallBoard
          updateGame={updateGame}
          thisBoard={k}
          squares={gamePosition[k]}
          boardState={boardState}
        />
      ];
      if (boardsFinished[k] && boardsFinished[k] !== "draw") {
        children.push(<div className="bigScore">{boardsFinished[k]}</div>);
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
      <ButtonsDiv robot={robot} updateRobot={updateRobot} />
    </>
  );
}
