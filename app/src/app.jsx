import React, { useEffect } from 'react';
import { TownGrid } from './TownGrid.jsx';
import { ResourceDeck } from './ResourceDeck.jsx';
import { BuildingButtons } from './BuildingButtons.jsx';
import { UserMenu } from './UserMenu.jsx';
import { useTownStore } from './store.js';
import { saveGame } from './logic.js';

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
      return 'b'; // 'b' for building
    }
    return cell ? resourceMap[cell] : '0';
  });
}

export function App() {
  const resetGrid = useTownStore((s) => s.resetGrid);
  const shuffleDeck = useTownStore((s) => s.shuffleDeck);
  const board = useTownStore((s) => s.grid);
  const selectedTileIndex = useTownStore((s) => s.selectedTileIndex);
  const points = 0; // Placeholder — calculate later

  useEffect(() => {
    shuffleDeck();
  }, []);

  const handleSaveGame = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const idToken = await user.getIdToken();
        const points = 0; // Placeholder
        const townmap = convertBoardToArray(board);
  
        await saveGame(townmap, points, idToken);
  
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
      <div className="flex justify-center items-start gap-8">
        <BuildingButtons />
        <div>
          <ResourceDeck />
          <TownGrid />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={resetGrid}
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
