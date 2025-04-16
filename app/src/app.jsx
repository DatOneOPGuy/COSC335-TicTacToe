import React, { useEffect } from 'react';
import { TownGrid } from './TownGrid.jsx';
import { ResourceDeck } from './ResourceDeck.jsx';
import { useTownStore } from './store.js';

export function App() {
  const resetGrid = useTownStore((s) => s.resetGrid);
  const shuffleDeck = useTownStore((s) => s.shuffleDeck);

  useEffect(() => {
    shuffleDeck();
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Tiny Towns Builder</h1>
      <ResourceDeck />
      <TownGrid />
      <button
        onClick={resetGrid}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Reset Game
      </button>
    </div>
  );
}
