import React from 'react';
import { useTownStore } from './store.js';
import {
  checkWell,
  checkCottage,
  checkFarm,
  checkCathedral,
  checkTavern,
  checkMarket,
  checkChapel,
  checkTradingPost,
} from './buildingPatterns.js';
import { BuildingPattern } from './BuildingPatterns.jsx';

const buildingTypes = {
  well: {
    name: 'Well',
    resources: ['stone', 'wood'],
    pattern: 'adjacent',
    check: checkWell,
  },
  cottage: {
    name: 'Cottage',
    resources: ['brick', 'glass', 'wheat'],
    pattern: 'L',
    check: checkCottage,
  },
  farm: {
    name: 'Farm',
    resources: ['wood', 'wood', 'wheat', 'wheat'],
    pattern: 'square',
    check: checkFarm,
  },
  cathedral: {
    name: 'Cathedral',
    resources: ['stone', 'glass', 'wheat'],
    pattern: 'L',
    check: checkCathedral,
  },
  tavern: {
    name: 'Tavern',
    resources: ['brick', 'brick', 'glass'],
    pattern: 'line',
    check: checkTavern,
  },
  market: {
    name: 'Market',
    resources: ['stone', 'stone', 'glass', 'wood'],
    pattern: 'T',
    check: checkMarket,
  },
  chapel: {
    name: 'Chapel',
    resources: ['stone', 'stone', 'glass', 'glass'],
    pattern: 'square',
    check: checkChapel,
  },
  trading_post: {
    name: 'Trading Post',
    resources: ['stone', 'stone', 'wood', 'wood', 'brick'],
    pattern: 'complex',
    check: checkTradingPost,
  },
};

export function BuildingButtons() {
  const grid = useTownStore((s) => s.grid);
  const selectedCells = useTownStore((s) => s.selectedCells);
  const selectedBuilding = useTownStore((s) => s.selectedBuilding);
  const setSelectedBuilding = useTownStore((s) => s.setSelectedBuilding);

  const canBuildBuilding = (buildingType) => {
    const building = buildingTypes[buildingType];
    if (!building) return false;

    // Get resources from selected cells
    const selectedResources = selectedCells.map(index => grid[index]);
    
    // Check if we have the right number of resources
    if (selectedResources.length !== building.resources.length) return false;

    // Check if we have the right resources
    const requiredResources = [...building.resources].sort();
    const actualResources = [...selectedResources].sort();
    
    if (!requiredResources.every((resource, index) => resource === actualResources[index])) {
      return false;
    }

    // Check the pattern
    return building.check(selectedCells, grid);
  };

  const handleBuildingClick = (buildingType) => {
    if (canBuildBuilding(buildingType)) {
      setSelectedBuilding(buildingType);
    }
  };

  return (
    <div className="left-4 top-4 grid grid-cols-2 gap-2 w-fit">
      {Object.entries(buildingTypes).map(([type, building]) => {
        const canBuild = canBuildBuilding(type);
        const isSelected = selectedBuilding === type;

        return (
          <button
            key={type}
            onClick={() => handleBuildingClick(type)}
            disabled={!canBuild}
            className={`p-1 rounded-md flex flex-col items-center gap-1 min-w-[80px] text-sm ${
              canBuild
                ? isSelected
                  ? 'bg-amber-800 text-white'
                  : 'bg-amber-700 text-white hover:bg-amber-600'
                : 'bg-amber-900 text-white cursor-not-allowed'
            }`}
          >
            <BuildingPattern buildingType={type} />
          </button>
        );
      })}
    </div>
  );
}  