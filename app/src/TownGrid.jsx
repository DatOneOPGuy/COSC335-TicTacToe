import React from 'react';
import { useTownStore } from './store.js';

const resourceStyles = {
  wheat: 'bg-yellow-400',
  wood: 'bg-amber-800',
  brick: 'bg-red-600',
  glass: 'bg-blue-400',
  stone: 'bg-gray-400',
};

export function TownGrid() {
  const grid = useTownStore((s) => s.grid);
  const placeResource = useTownStore((s) => s.placeResource);
  const selectedTileIndex = useTownStore((s) => s.selectedTileIndex);
  const selectTile = useTownStore((s) => s.selectTile);

  const handleClick = (index) => {
    if (grid[index]) {
      selectTile(index); // Select or deselect existing tile
    } else {
      placeResource(index); // Place new resource
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
      {grid.map((res, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`w-16 h-16 border-2 rounded transition-colors ${
            res ? resourceStyles[res] : 'bg-gray-800'
          } ${selectedTileIndex === i ? 'border-blue-400' : 'border-gray-500'}`}
        />
      ))}
    </div>
  );
}
