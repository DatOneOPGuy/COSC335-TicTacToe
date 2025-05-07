import React, { useEffect, useState } from 'react';
import { TownGrid } from './TownGrid.jsx';
import { ResourceDeck } from './ResourceDeck.jsx';
import { BuildingButtons } from './BuildingButtons.jsx';
import { UserMenu } from './UserMenu.jsx';
import { useTownStore } from './store.js';
import { calculateScore, saveGameWithScore } from './logic.js';

function convertBoardToArray(board) {
  const resourceMap = {
    wood: 'w',
    wheat: 'y',
    brick: 'b',
    glass: 'g',
    stone: 's',
  };

  return board.map(cell => {
    if (cell && cell.type === 'building') {
      return cell.building; // Save the building name as a string
    }
    return cell ? resourceMap[cell] : '0'; // Save resource as a single letter or '0' for empty
  });
}

export function App() {
  const resetGrid = useTownStore((s) => s.resetGrid);
  const shuffleDeck = useTownStore((s) => s.shuffleDeck);
  const board = useTownStore((s) => s.grid);
  const [score, setScore] = useState(0);
  const [starttime, setStarttime] = useState(null); // Initialize as null

  useEffect(() => {
    // Set starttime after initial login or app load
    setStarttime(new Date().toISOString());
    shuffleDeck();
  }, []);

  useEffect(() => {
    // Recalculate the score whenever the board changes
    setScore(calculateScore(board));
  }, [board]);

  const handleResetGame = () => {
    resetGrid();
    setStarttime(new Date().toISOString()); // Update starttime after reset
  };

  const handleSaveGame = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const idToken = await user.getIdToken();
        const points = calculateScore(board);

        await saveGameWithScore(board, idToken, starttime);

        alert("Game saved successfully!");
      } catch (err) {
        console.error("Error saving game:", err);
        alert("Failed to save game.");
      }
    } else {
      alert("No user is signed in.");
    }
  };

  return (
    <div className="p-6 text-center">
      <UserMenu />
      <h1 className="text-2xl font-bold mb-4">Tiny Towns Builder</h1>
      <h2 className="text-xl font-semibold mb-4">Current Score: {score}</h2>
      <div className="flex justify-center items-start gap-8">
        <BuildingButtons />
        <div>
          <ResourceDeck />
          <TownGrid />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleResetGame}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset Game
        </button>
        <button
          onClick={handleSaveGame}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Game
        </button>
      </div>
    </div>
  );
}
