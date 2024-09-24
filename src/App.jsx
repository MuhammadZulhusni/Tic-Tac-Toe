import { useState } from "react";

// Square Component: Represents a single square in the game board
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board Component: Represents the game board
function Board({ xIsNext, squares, onPlay }) {
  // Function to handle clicks on the squares
  function handleClick(i) {
    // If the square is already filled or there's a winner, do nothing
    if (squares[i] || calculateWinner(squares)) return;

    // Create a copy of the squares array
    const nextSquares = squares.slice();

    // Set the value of the clicked square based on whose turn it is
    nextSquares[i] = xIsNext ? "X" : "O";

    // Call the function passed from the Game component to update the game state
    onPlay(nextSquares);
  }

  // Determine the status of the game (winner or next player's turn)
  const winner = calculateWinner(squares);
  let status = "";
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Render the game board
  return (
    <>
      <div className="status">{status}</div> {/* Apply background image to this wrapper */}
      <div className="board">
        {/* Render each square, passing its value and click handler */}
        {squares.map((value, index) => (
          <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
        ))}
      </div>
    </>
  );
}

// Game Component: Represents the overall game
export default function Game() {
  // State to keep track of the game's history of moves and the current move number
  const [history, setHistory] = useState([Array(9).fill(null)]); // Initial state is an array of 9 nulls (empty board)
  const [currentMove, setCurrentMove] = useState(0); // Tracks the current move number (starts at 0)

  // Determines if it's X's turn (X goes on even moves, O on odd moves)
  const xIsNext = currentMove % 2 === 0;

  // Get the current board configuration based on the move history
  const currentSquares = history[currentMove];

  // Function to handle jump to a specific move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Function to handle playing a move
  function handlePlay(nextSquares) {
    // Update the game history with the new squares and move to the next step
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Generate list of moves
  const moves = history.map((squares, move) => {
    let description = "";
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Render the game
  return (
    <div className="game">
      <div className="game-board">
        {/* Render the game board, passing current state and event handler */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Function to calculate the winner of the game
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check all possible winning combinations
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    // If all three squares in a winning line have the same value, return the winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // If no winner, return false
  return false;
}
