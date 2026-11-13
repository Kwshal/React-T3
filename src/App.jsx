import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  return (
    <p className="square" onClick={onSquareClick}>
      {value}
    </p>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const player = xIsNext ? 'X' : 'O'
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = player;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Player '" + player + "' wins";
  } else if (!squares.includes(null)) {
      status = 'Draw !';
  }
  else {
    status = 'Current player: ' + player;
  }

  return (
    <>
      <div className={`status ${winner? 'win':''}`}>{status}</div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((col) => {
              const displayValue = winner && winner.includes(row * 3 + col) ? (
                <span className="winning-square">{squares[row * 3 + col]}</span>
              ) : (
                squares[row * 3 + col]
              );
              return (
                <Square
                  key={col}
                  value={displayValue}
                  onSquareClick={() => handleClick(row * 3 + col)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    let description;
    if (move > 0) {
      description = move;
    } else return;
    
    return (
      <li key={move}>
        <button className='move-btn' onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <h2>(Moves)</h2>
        <ol className='moves-list'>{moves}</ol>
        <h4>Tip: Click the # buttons to go back in time.</h4>
        <button className='restart-btn' onClick={() => window.location.reload()}>Restart</button>
      </div>
    </div>
  );
}

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
