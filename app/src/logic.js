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


export async function saveGame(townmap, points, idToken) {
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
      timestamp: new Date().toISOString(),
      uid: idToken, // Assuming idToken is the user ID
    }),
  });
}

