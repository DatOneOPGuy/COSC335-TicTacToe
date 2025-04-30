import React from 'react';
import { useTownStore } from './store.js';

const resources = ['wood', 'brick', 'glass'];

export function ResourceSelector() {
  const selected = useTownStore((s) => s.selectedResource);
  const setSelected = useTownStore((s) => s.setSelectedResource);

  return (
    <div className="flex gap-4 justify-center my-4">
      {resources.map((res) => (
        <button
          key={res}
          onClick={() => setSelected(res)}
          className={`px-4 py-2 rounded ${
            selected === res ? 'border-blue-400 text-white' : 'border-gray-300'
          }`}
        >
          {res}
        </button>
      ))}
    </div>
  );
}
