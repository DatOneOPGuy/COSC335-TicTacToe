import React, { useEffect } from 'react';
import { useGameStore } from './store.js';
import { saveGame } from './logic.js';


export function App() {
  const { board, winner, makeMove, resetGame } = useGameStore(state => ({
    board: state.board,
    winner: state.winner,
    makeMove: state.makeMove,
    resetGame: state.resetGame
  }));

  useEffect(() => {
    if (winner) {
      const user = firebase.auth().currentUser;
      if (user) {
        user.getIdToken().then((idToken) => {
          console.log("Saving game:", board, winner, idToken);
          saveGame(board, winner, idToken);
        }).catch((err) => {
          console.error("Error getting ID token:", err);
        });
      }
    }
  }, [winner]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    makeMove(index);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 bg-gray-700 text-2xl font-bold"
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && <p className="mt-4 text-xl">{winner} wins!</p>}
      <button
        onClick={resetGame}
        className="mt-4 bg-green-500 px-4 py-2 rounded"
      >
        Restart Game
      </button>
    </div>
  );
}

