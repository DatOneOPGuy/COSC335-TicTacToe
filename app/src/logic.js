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

export function calculateScore(board) {
  let totalScore = 0;

  const cottages = [];
  const farms = [];
  const wells = [];
  const chapels = [];
  const taverns = [];
  const markets = [];
  const cathedrals = [];
  const tradingPosts = [];
  const factories = [];
  const theaters = [];
  const emptySpaces = []; 

  // Categorize buildings and resources
  board.forEach((cell, index) => {
    if (!cell || cell.type != 'building') {
      emptySpaces.push(index);
    } else if (cell.type === 'building') {
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
        case 'trading_post':
          tradingPosts.push(index);
          break;
        case 'factory':
          factories.push(index);
          break;
        case 'theater':
          theaters.push(index);
          break;
        default:
          break;
      }
    } else if(cell.type === 'resource'){
      resoureSpaces.push(index);
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
  const tavernScores = [0, 2, 5, 9, 14, 20];
  totalScore += tavernScores[Math.min(taverns.length, 5)];

  // Score Markets (1 VP + 1 VP per other Market in the same row or column)
  markets.forEach((market) => {
    const row = Math.floor(market / 4);
    const col = market % 4;
    const rowMarkets = markets.filter((m) => Math.floor(m / 4) === row).length - 1;
    const colMarkets = markets.filter((m) => m % 4 === col).length - 1;
    totalScore += Math.max(rowMarkets, colMarkets);
  });

  //trading posts, 1 VP for each
  totalScore += tradingPosts.length

  //theaters, 1 VP for each unique building in the row and column
  theaters.forEach((theater) => {
    const theaterRow = Math.floor(theater / 4);
    const theaterCol = theater % 4;
    const uniqueBuildings = new Set();

    board.forEach((cell, index) => {
      if (
        cell &&
        cell.type === 'building' &&
        (Math.floor(index / 4) === theaterRow || index % 4 === theaterCol) &&
        index !== theater
      ) {
        uniqueBuildings.add(cell.building);
      }
    });
    totalScore += uniqueBuildings.size;
  });

  // Score Cathedrals (custom logic: 3 VP + 1 VP per adjacent Market or Chapel)


  // Subtract points for empty spaces if there is no cathedral(-1 VP per empty space)
  if (cathedrals.length == 0){
      totalScore -= emptySpaces.length;
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

export async function saveGame(board, idToken, starttime = null) {
  const points = calculateScore(board);
  const townmap = board.map((cell) => (cell ? (cell.type === 'building' ? cell.building : cell) : '0'));

  console.log("Saving game...");
  console.log("townmap:", townmap);
  console.log("points:", points);
  console.log("idToken:", idToken);

  await fetch("http://localhost:3000/save-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      townmap,
      points,
      starttime,
      timestamp: new Date().toISOString(),
      uid: idToken, // Assuming idToken is the user ID
    }),
  });

  return points;
}

