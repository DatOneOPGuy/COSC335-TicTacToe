import React, { useSyncExternalStore } from 'react';
import create from 'zustand';
import { checkWinner, saveGame } from './logic.js';

const gameStore = create((set) => ({
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
  resetGame: () => set({ board: Array(9).fill(null), currentPlayer: "X", winner: null }),
  makeMove: (index) =>
    set((state) => {
      if (state.board[index] || state.winner) return state;
      const board = [...state.board];
      board[index] = state.currentPlayer;

      const winner = checkWinner(board);
      if (winner) saveGame(board, winner);

      return {
        board,
        currentPlayer: state.currentPlayer === "X" ? "O" : "X",
        winner,
      };
    }),
}));


export function useGameStore(selector) {
  const getSnapshot = React.useCallback(() => selector(gameStore.getState()), [selector]);

  return React.useSyncExternalStore(
    gameStore.subscribe, // Subscribe to the store for updates
    getSnapshot,         // Snapshot function to get the current state
    getSnapshot          // Fallback snapshot function (for SSR or initial render)
  );
}

export { gameStore };

