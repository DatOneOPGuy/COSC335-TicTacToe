import React from 'react';
import { useTownStore } from './store.js';

const resourceStyles = {
  wheat: 'bg-yellow-400',
  wood: 'bg-amber-800',
  brick: 'bg-red-600',
  glass: 'bg-blue-400',
  stone: 'bg-gray-400',
};

export function ResourceDeck() {
  const deck = useTownStore((s) => s.deck);
  const selected = useTownStore((s) => s.selectedResource);
  const setSelected = useTownStore((s) => s.setSelectedResource);

  const topThree = deck.slice(0, 3);

  return (
    <div className="flex justify-center gap-4 mb-6">
      {topThree.map((res, idx) => (
        <button
          key={idx}
          onClick={() => setSelected(res)}
          className={`flex items-center gap-2 px-3 py-2 border-2 rounded-md text-sm capitalize ${
            selected === res ? 'border-blue-500' : 'border-transparent'
          }`}
        >
          <div className={`w-5 h-5 rounded ${resourceStyles[res]}`}></div>
          {res}
        </button>
      ))}
    </div>
  );
}
