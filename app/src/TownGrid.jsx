import React from 'react';
import { useTownStore } from './store.js';
import { BuildingIcon } from './BuildingPatterns.jsx';

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
  const selectedCells = useTownStore((s) => s.selectedCells);
  const addSelectedCell = useTownStore((s) => s.addSelectedCell);
  const removeSelectedCell = useTownStore((s) => s.removeSelectedCell);
  const selectedBuilding = useTownStore((s) => s.selectedBuilding);
  const setSelectedBuilding = useTownStore((s) => s.setSelectedBuilding);
  const setGrid = useTownStore((s) => s.setGrid);
  const clearSelectedCells = useTownStore((s) => s.clearSelectedCells);

  const handleClick = (index) => {
    if (selectedBuilding) {
      // If a building is selected, only allow placement on selected resource cells
      if (selectedCells.includes(index) && grid[index]) {
        const newGrid = [...grid];
        // Place the building
        newGrid[index] = { type: 'building', building: selectedBuilding };
        // Clear the selected cells (but keep the building)
        selectedCells.forEach(cellIndex => {
          if (cellIndex !== index) {
            newGrid[cellIndex] = null;
          }
        });
        setGrid(newGrid);
        setSelectedBuilding(null);
        clearSelectedCells();
      }
    } else if (grid[index]) {
      // If the cell has a resource, toggle selection
      if (selectedCells.includes(index)) {
        removeSelectedCell(index);
      } else {
        addSelectedCell(index);
      }
    } else {
      // Place a new resource
      placeResource(index);
    }
  };

  const getCellStyle = (index) => {
    let style = 'w-16 h-16 border-2 rounded transition-colors flex items-center justify-center text-2xl ';
    
    if (grid[index]) {
      if (grid[index].type === 'building') {
        style += 'bg-white text-white ';
      } else {
        style += resourceStyles[grid[index]] + ' ';
      }
    } else {
      style += 'bg-gray-800 ';
    }

    if (selectedCells.includes(index)) {
      style += 'border-blue-400 ';
    } else if (selectedTileIndex === index) {
      style += 'border-blue-400 ';
    } else {
      style += 'border-gray-500 ';
    }

    return style;
  };

  const getCellContent = (index) => {
    if (grid[index]) {
      if (grid[index].type === 'building') {
        return <BuildingIcon buildingType={grid[index].building} />;
      }
    }
    return '';
  };

  return (
    <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
      {grid.map((res, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={getCellStyle(i)}
          disabled={selectedBuilding && !selectedCells.includes(i)}
        >
          {getCellContent(i)}
        </button>
      ))}
    </div>
  );
}
