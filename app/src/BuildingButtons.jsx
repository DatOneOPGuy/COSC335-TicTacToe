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
  checkFactory,
  checkTheater
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
  theater: {
    name: 'Theater',
    resources: ['brick', 'glass', 'brick', 'stone'],
    pattern: 'custom',
    check: checkTheater,
  },
  factory: {
    name: 'Factory',
    resources: ['brick', 'stone', 'brick', 'stone', 'wood'],
    pattern: 'custom',
    check: checkFactory,
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

    const selectedResources = selectedCells.map(index => grid[index]);
    if (selectedResources.length !== building.resources.length) return false;

    const requiredResources = [...building.resources].sort();
    const actualResources = [...selectedResources].sort();

    if (!requiredResources.every((resource, index) => resource === actualResources[index])) {
      return false;
    }

    return building.check(selectedCells, grid);
  };

  const handleBuildingClick = (buildingType) => {
    if (canBuildBuilding(buildingType)) {
      setSelectedBuilding(buildingType);
    }
  };

  const buildingEntries = Object.entries(buildingTypes);
  const topNineBuildings = buildingEntries.slice(0, 9);
  const bottomTwoBuildings = buildingEntries.slice(9);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-2">
        {topNineBuildings.map(([type, building]) => {
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

      {/* Two Buttons Below */}
      <div className="flex gap-4">
        {bottomTwoBuildings.map(([type, building]) => {
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
    </div>
  );
}