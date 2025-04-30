import React from 'react';

const resourceIcons = {
  wheat: '🌾',
  wood: '🪵',
  brick: '🧱',
  glass: '🔷',
  stone: '⛰️',
};

const buildingPatterns = {
  well: {
    name: 'Well',
    icon: '💧',
    pattern: [
      ['stone', 'wood'],
    ]
  },
  cottage: {
    name: 'Cottage',
    icon: '🏠',
    pattern: [
      ['brick', 'glass'],
      [null, 'wheat']
    ]
  },
  farm: {
    name: 'Farm',
    icon: '🌾',
    pattern: [
      ['wood', 'wood'],
      ['wheat', 'wheat']
    ]
  },
  cathedral: {
    name: 'Cathedral',
    icon: '⛪',
    pattern: [
      ['stone', 'glass'],
      [null, 'wheat']
    ]
  },
  tavern: {
    name: 'Tavern',
    icon: '🍺',
    pattern: [
      ['brick', 'brick', 'glass']
    ]
  },
  market: {
    name: 'Market',
    icon: '🏪',
    pattern: [
      [null, 'wood', null],
      ['stone', 'glass', 'stone']
    ]
  },
  chapel: {
    name: 'Chapel',
    icon: '⛪',
    pattern: [
      ['glass', 'stone'],
      [null, 'glass'],
      [null, 'stone'],
    ]
  },
  trading_post: {
    name: 'Trading Post',
    icon: '🏪',
    pattern: [
      ['stone', 'stone'],
      ['wood', 'wood'],
      [null, 'brick']
    ]
  }
};

export function BuildingPattern({ buildingType }) {
  const pattern = buildingPatterns[buildingType];
  if (!pattern) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xl">{pattern.icon}</div>
      <div className="text-xs font-semibold text-white">{pattern.name}</div>
      <div className="grid gap-0.5" style={{ 
        gridTemplateColumns: `repeat(${pattern.pattern[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${pattern.pattern.length}, 1fr)`
      }}>
        {pattern.pattern.flat().map((resource, index) => (
          <div 
            key={index} 
            className="w-4 h-4 flex items-center justify-center border border-gray-300 rounded text-white"
          >
            {resource ? resourceIcons[resource] : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BuildingIcon({ buildingType }) {
  const pattern = buildingPatterns[buildingType];
  if (!pattern) return null;

  return (
    <div className="text-2xl">
      {pattern.icon}
    </div>
  );
} 