export function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function calculateScore(board, isEndOfGame = false) {
  let totalScore = 0;

  const cottages = [];
  const farms = [];
  const wells = [];
  const chapels = [];
  const taverns = [];
  const markets = [];
  const cathedrals = [];
  const emptyOrResourceCells = [];

  // Categorize buildings and resources
  board.forEach((cell, index) => {
    if (!cell || cell.type !== 'building') {
      emptyOrResourceCells.push(index); // Track empty or resource-filled cells
    } else {
      switch (cell.building) {
        case 'cottage':
          cottages.push(index);
          break;
        case 'farm':
          farms.push(index);
          break;
        case 'well':
          wells.push(index);
          break;
        case 'chapel':
          chapels.push(index);
          break;
        case 'tavern':
          taverns.push(index);
          break;
        case 'market':
          markets.push(index);
          break;
        case 'cathedral':
          cathedrals.push(index);
          break;
        default:
          break;
      }
    }
  });

  // Helper functions
  const isAdjacent = (a, b) => {
    const rowA = Math.floor(a / 4);
    const colA = a % 4;
    const rowB = Math.floor(b / 4);
    const colB = b % 4;
    return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
  };

  // Score Cottages (3 VP if fed by a Farm)
  const fedCottages = new Set();
  farms.forEach((farm) => {
    let fedCount = 0;
    cottages.forEach((cottage) => {
      if (fedCount < 4 && !fedCottages.has(cottage)) {
        fedCottages.add(cottage);
        fedCount++;
      }
    });
  });
  totalScore += fedCottages.size * 3;

  // Score Wells (1 VP per adjacent Cottage)
  wells.forEach((well) => {
    const adjacentCottages = cottages.filter((cottage) => isAdjacent(well, cottage));
    totalScore += adjacentCottages.length;
  });

  // Score Chapels (1 VP per fed Cottage in town)
  totalScore += chapels.length * fedCottages.size;

  // Score Taverns (group scoring)
  const tavernScores = [0, 1, 4, 9, 14, 20];
  totalScore += tavernScores[Math.min(taverns.length, 5)];

  // Score Markets (1 VP + 1 VP per other Market in the same row or column)
  markets.forEach((market) => {
    const row = Math.floor(market / 4);
    const col = market % 4;
    const rowMarkets = markets.filter((m) => Math.floor(m / 4) === row).length - 1;
    const colMarkets = markets.filter((m) => m % 4 === col).length - 1;
    totalScore += 1 + rowMarkets + colMarkets;
  });

  // Score Cathedrals (custom logic: 3 VP + 1 VP per adjacent Market or Chapel)
  cathedrals.forEach((cathedral) => {
    const adjacentMarkets = markets.filter((market) => isAdjacent(cathedral, market));
    const adjacentChapels = chapels.filter((chapel) => isAdjacent(cathedral, chapel));
    totalScore += 3 + adjacentMarkets.length + adjacentChapels.length;
  });

  // Subtract points for empty or resource-filled cells only at the end of the game
  if (isEndOfGame) {
    totalScore -= emptyOrResourceCells.length;
  }

  return totalScore;
}

// Save the score to Firebase
export async function saveGameWithScore(board, idToken) {
  const points = calculateScore(board);
  const townmap = board.map((cell) => (cell ? (cell.type === 'building' ? cell.building : cell) : '0'));

  await fetch("http://localhost:3000/save-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      townmap,
      points,
      timestamp: new Date().toISOString(),
    }),
  });

  return points;
}

export async function saveGame(board, idToken, startTime = null, endTime = null) {
  const points = calculateScore(board, true);
  const townmap = board.map((cell) =>
    cell ? (cell.type === 'building' ? cell.building : cell) : '0'
  );

  const response = await fetch('http://localhost:3000/save-game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      townmap,
      points,
      startTime,
      endTime,
      timestamp: new Date().toISOString(),
    }),
  });

  return response; // Return the full response so we can check for new achievements
}

