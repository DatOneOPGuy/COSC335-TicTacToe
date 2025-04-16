import create from 'zustand';

const resourceTypes = ['wheat', 'wood', 'brick', 'glass', 'stone'];

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
  selectedTileIndex: null, // NEW

  shuffleDeck: () => {
    const deck = shuffleArray([...resourceTypes, ...resourceTypes]);
    set({ deck, selectedResource: deck[0] });
  },

  setSelectedResource: (resource) => set({ selectedResource: resource }),

  placeResource: (index) => {
    const state = get();
    if (state.grid[index]) return;
    const newGrid = [...state.grid];
    newGrid[index] = state.selectedResource;

    const deck = [...state.deck];
    const usedResource = state.selectedResource;
    deck.splice(deck.indexOf(usedResource), 1);
    deck.push(usedResource);

    set({
      grid: newGrid,
      deck,
      selectedResource: deck[0],
      selectedTileIndex: null, // Deselect after placement
    });
  },

  selectTile: (index) =>
    set((state) => ({
      selectedTileIndex: state.selectedTileIndex === index ? null : index,
    })),

  resetGrid: () => {
    set({
      grid: Array(16).fill(null),
      selectedTileIndex: null,
    });
    get().shuffleDeck();
  },
}));