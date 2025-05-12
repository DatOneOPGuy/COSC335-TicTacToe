import create from 'zustand';

const resourceTypes = ['wheat', 'wood', 'brick', 'glass', 'stone'];

const buildingTypes = {
  well: {
    name: 'Well',
    resources: ['stone', 'wood'],
    pattern: 'adjacent',
  },
  cottage: {
    name: 'Cottage',
    resources: ['brick', 'glass', 'wheat'],
    pattern: 'L',
  },
  farm: {
    name: 'Farm',
    resources: ['wood', 'wood', 'wheat', 'wheat'],
    pattern: 'square',
  },
  cathedral: {
    name: 'Cathedral',
    resources: ['stone', 'glass', 'wheat'],
    pattern: 'L',
  },
  tavern: {
    name: 'Tavern',
    resources: ['brick', 'brick', 'glass'],
    pattern: 'line',
  },
  market: {
    name: 'Market',
    resources: ['stone', 'stone', 'glass', 'wood'],
    pattern: 'T',
  },
  chapel: {
    name: 'Chapel',
    resources: ['stone', 'stone', 'glass', 'glass'],
    pattern: 'square',
  },
  trading_post: {
    name: 'Trading Post',
    resources: ['stone', 'stone', 'wood', 'wood', 'brick'],
    pattern: 'complex',
  },
};

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const useTownStore = create((set, get) => ({
  grid: Array(16).fill(null),
  selectedResource: null,
  deck: [],
  selectedTileIndex: null,
  selectedBuilding: null,
  selectedCells: [],
  buildings: {},
  factoryResource: null, // Store the resource in the factory
  selectedFactory: null, // Track the selected factory

  shuffleDeck: () => {
    const deck = shuffleArray([...resourceTypes, ...resourceTypes, ...resourceTypes]);
    set({ deck, selectedResource: null });
  },

  setSelectedResource: (resource) => set({ selectedResource: resource }),

  placeResource: (index) => {
    const state = get();
    if (!state.selectedResource || state.grid[index]) return;

    const newGrid = [...state.grid];
    newGrid[index] = state.selectedResource;

    const deck = [...state.deck];
    const usedResource = state.selectedResource;
    deck.splice(deck.indexOf(usedResource), 1);
    deck.push(usedResource);

    set({
      grid: newGrid,
      deck,
      selectedResource: null,
      selectedTileIndex: null,
    });
  },

  storeResourceInFactory: (index, resource) => {
    const state = get();
    const newGrid = [...state.grid];
    newGrid[index] = { type: 'building', building: 'factory', resource }; // Store the resource in the factory
    set({ grid: newGrid, factoryResource: resource, selectedResource: null });
  },

  retrieveResourceFromFactory: (factoryIndex, targetIndex) => {
    const state = get();
    if (!state.factoryResource) return;

    const newGrid = [...state.grid];
    newGrid[factoryIndex] = { type: 'building', building: 'factory', resource: null }; // Clear the factory
    newGrid[targetIndex] = state.factoryResource; // Place the resource in the target cell

    set({ grid: newGrid, factoryResource: null, selectedFactory: null });
  },

  selectFactory: (index) => set({ selectedFactory: index }),

  clearFactorySelection: () => set({ selectedFactory: null }),

  selectTile: (index) => {
    const state = get();
    if (state.selectedBuilding) {
      // If a building is selected, try to place it
      if (state.grid[index]) {
        const newGrid = [...state.grid];
        newGrid[index] = { type: 'building', building: state.selectedBuilding };
        set({
          grid: newGrid,
          selectedBuilding: null,
          selectedTileIndex: null,
          selectedCells: [], // Clear selected cells after placing building
        });
      }
    } else {
      // Otherwise, just select/deselect the tile
      set((state) => ({
        selectedTileIndex: state.selectedTileIndex === index ? null : index,
      }));
    }
  },

  setSelectedBuilding: (building) => set({ selectedBuilding: building }),

  addSelectedCell: (index) => {
    set((state) => ({
      selectedCells: [...state.selectedCells, index],
    }));
  },

  removeSelectedCell: (index) => {
    set((state) => ({
      selectedCells: state.selectedCells.filter((i) => i !== index),
    }));
  },

  clearSelectedCells: () => set({ selectedCells: [] }),

  setGrid: (newGrid) => set({ grid: newGrid }),

  resetGrid: () => {
    set({
      grid: Array(16).fill(null),
      selectedTileIndex: null,
      selectedBuilding: null,
      selectedCells: [],
    });
    get().shuffleDeck();
  },
}));