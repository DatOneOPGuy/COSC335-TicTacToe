import React from 'react';
import { useTownStore } from './store.js';
import { BuildingIcon } from './BuildingPatterns.jsx';

const resourceStyles = {
  wheat: 'bg-yellow-400',
  wood: 'bg-amber-800',
  brick: 'bg-red-600',
  glass: 'bg-blue-900', // Changed to navy blue
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
    const state = useTownStore.getState();
  
    // Handle factory behavior
    if (state.selectedFactory !== null) {
      if (index !== state.selectedFactory) {
        // Move the resource from the factory to the clicked cell
        state.retrieveResourceFromFactory(state.selectedFactory, index);
      }
      state.clearFactorySelection();
      return;
    }
  
    if (grid[index] && grid[index].type === 'building') {
      if (grid[index].building === 'factory') {
        if (state.selectedResource) {
          // Store the selected resource in the factory
          state.storeResourceInFactory(index, state.selectedResource);
        } else {
          // Select the factory for resource retrieval
          state.selectFactory(index);
        }
        return;
      }
      // Prevent interaction with other buildings
      return;
    }
  
    if (selectedBuilding) {
      if (selectedCells.includes(index) && grid[index]) {
        const newGrid = [...grid];
        newGrid[index] = { type: 'building', building: selectedBuilding };
        selectedCells.forEach((cellIndex) => {
          if (cellIndex !== index) {
            newGrid[cellIndex] = null;
          }
        });
        setGrid(newGrid);
        setSelectedBuilding(null);
        clearSelectedCells();
      }
    } else if (grid[index]) {
      if (selectedCells.includes(index)) {
        removeSelectedCell(index);
      } else {
        addSelectedCell(index);
      }
    } else {
      placeResource(index);
    }
  };

  const getCellStyle = (index) => {
    let style = 'w-16 h-16 border-2 rounded transition-colors flex items-center justify-center text-2xl ';

    if (grid[index]) {
      if (grid[index].type === 'building') {
        if (grid[index].building === 'factory') {
          if (grid[index].resource) {
            style += resourceStyles[grid[index].resource] + ' '; // Use the resource's color
          } else {
            style += 'bg-white text-white ';
          }
        } else {
          style += 'bg-white text-white ';
        }
      } else {
        style += resourceStyles[grid[index]] + ' ';
      }
    } else {
      style += 'bg-gray-800 ';
    }

    if (selectedCells.includes(index)) {
      style += 'border-green-500 ';
    } else if (selectedTileIndex === index) {
      style += 'border-green-500 ';
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
