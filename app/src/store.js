import create from 'zustand';
import { checkWinner } from './logic.js';

export const gameStore = create((set) => ({
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

      return {
        board,
        currentPlayer: state.currentPlayer === "X" ? "O" : "X",
        winner,
      };
    }),
}));


export const useGameStore = (selector) => gameStore(selector);


