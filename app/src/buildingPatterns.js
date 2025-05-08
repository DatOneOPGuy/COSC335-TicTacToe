// Helper functions
const getRow = (index) => Math.floor(index / 4);
const getCol = (index) => index % 4;
const difference = (a, b) => Math.abs(a - b);
const areSetsEqual = (a, b) => a.size === b.size && [...a].every(x => b.has(x));

// Building pattern checks
export function checkWell(selectedCells, grid) {
  if (selectedCells.length !== 2) return false;

  let stoneLocation = null;
  let woodLocation = null;
  let hasStone = false;
  let hasWood = false;

  for (const index of selectedCells) {
    const resource = grid[index];
    if (resource === 'stone') {
      stoneLocation = { row: getRow(index), col: getCol(index) };
      hasStone = true;
    } else if (resource === 'wood') {
      woodLocation = { row: getRow(index), col: getCol(index) };
      hasWood = true;
    }
  }

  if (!(hasStone && hasWood)) return false;

  if (stoneLocation.row === woodLocation.row) {
    return difference(stoneLocation.col, woodLocation.col) === 1;
  } else if (stoneLocation.col === woodLocation.col) {
    return difference(stoneLocation.row, woodLocation.row) === 1;
  }
  return false;
}

export function checkCottage(selectedCells, grid) {
  if (selectedCells.length !== 3) return false;

  let brickLocation = null;
  let glassLocation = null;
  let wheatLocation = null;
  let hasBrick = false;
  let hasGlass = false;
  let hasWheat = false;

  for (const index of selectedCells) {
    const resource = grid[index];
    if (resource === 'brick') {
      brickLocation = { row: getRow(index), col: getCol(index) };
      hasBrick = true;
    } else if (resource === 'glass') {
      glassLocation = { row: getRow(index), col: getCol(index) };
      hasGlass = true;
    } else if (resource === 'wheat') {
      wheatLocation = { row: getRow(index), col: getCol(index) };
      hasWheat = true;
    }
  }

  if (!(hasBrick && hasGlass && hasWheat)) return false;

  // Check L pattern
  if (brickLocation.row === glassLocation.row) {
    if (difference(brickLocation.col, glassLocation.col) === 1) {
      return wheatLocation.col === glassLocation.col && 
             difference(wheatLocation.row, glassLocation.row) === 1;
    }
  } else if (brickLocation.col === glassLocation.col) {
    if (difference(brickLocation.row, glassLocation.row) === 1) {
      return wheatLocation.row === glassLocation.row && 
             difference(wheatLocation.col, glassLocation.col) === 1;
    }
  }
  return false;
}

export function checkFarm(selectedCells, grid) {
  if (selectedCells.length !== 4) return false;

  let woodLocations = [];
  let wheatLocations = [];
  let woodCount = 0;
  let wheatCount = 0;

  for (const index of selectedCells) {
    const resource = grid[index];
    if (resource === 'wood') {
      woodLocations.push({ row: getRow(index), col: getCol(index) });
      woodCount++;
    } else if (resource === 'wheat') {
      wheatLocations.push({ row: getRow(index), col: getCol(index) });
      wheatCount++;
    }
  }

  if (woodCount !== 2 || wheatCount !== 2) return false;

  const [wood1, wood2] = woodLocations;
  const [wheat1, wheat2] = wheatLocations;

  // Check horizontal pattern
  if (wood1.row === wood2.row && difference(wood1.col, wood2.col) === 1 &&
      wheat1.row === wheat2.row && difference(wheat1.col, wheat2.col) === 1) {
    if (difference(wood1.row, wheat1.row) === 1) {
      return areSetsEqual(
        new Set([wood1.col, wood2.col]),
        new Set([wheat1.col, wheat2.col])
      );
    }
  }
  // Check vertical pattern
  else if (wood1.col === wood2.col && difference(wood1.row, wood2.row) === 1 &&
           wheat1.col === wheat2.col && difference(wheat1.row, wheat2.row) === 1) {
    if (difference(wood1.col, wheat1.col) === 1) {
      return areSetsEqual(
        new Set([wood1.row, wood2.row]),
        new Set([wheat1.row, wheat2.row])
      );
    }
  }
  return false;
}

export function checkCathedral(selectedCells, grid) {
  if (selectedCells.length !== 3) return false;

  let stoneLocation = null;
  let glassLocation = null;
  let wheatLocation = null;
  let hasStone = false;
  let hasGlass = false;
  let hasWheat = false;

  for (const index of selectedCells) {
    const resource = grid[index];
    if (resource === 'stone') {
      stoneLocation = { row: getRow(index), col: getCol(index) };
      hasStone = true;
    } else if (resource === 'glass') {
      glassLocation = { row: getRow(index), col: getCol(index) };
      hasGlass = true;
    } else if (resource === 'wheat') {
      wheatLocation = { row: getRow(index), col: getCol(index) };
      hasWheat = true;
    }
  }

  if (!(hasStone && hasGlass && hasWheat)) return false;

  // Check L pattern
  if (stoneLocation.row === glassLocation.row) {
    if (difference(stoneLocation.col, glassLocation.col) === 1) {
      return wheatLocation.col === glassLocation.col && 
             difference(wheatLocation.row, glassLocation.row) === 1;
    }
  } else if (stoneLocation.col === glassLocation.col) {
    if (difference(stoneLocation.row, glassLocation.row) === 1) {
      return wheatLocation.row === glassLocation.row && 
             difference(wheatLocation.col, glassLocation.col) === 1;
    }
  }
  return false;
}

export function checkTavern(selectedCells, grid) {
  if (selectedCells.length !== 3) return false;

  let brickLocations = [];
  let glassLocation = null;
  let brickCount = 0;
  let hasGlass = false;

  for (const index of selectedCells) {
    const resource = grid[index];
    if (resource === 'brick') {
      brickLocations.push({ row: getRow(index), col: getCol(index) });
      brickCount++;
    } else if (resource === 'glass') {
      glassLocation = { row: getRow(index), col: getCol(index) };
      hasGlass = true;
    }
  }

  if (brickCount !== 2 || !hasGlass) return false;

  const [brick1, brick2] = brickLocations;

  // Check horizontal pattern
  if (brick1.row === brick2.row && brick1.row === glassLocation.row) {
    if (difference(brick1.col, brick2.col) === 1) {
      return difference(brick1.col, glassLocation.col) === 1 || 
             difference(brick2.col, glassLocation.col) === 1;
    }
  }
  // Check vertical pattern
  else if (brick1.col === brick2.col && brick1.col === glassLocation.col) {
    if (difference(brick1.row, brick2.row) === 1) {
      return difference(brick1.row, glassLocation.row) === 1 || 
             difference(brick2.row, glassLocation.row) === 1;
    }
  }
  return false;
}

export function checkMarket(selectedCells, grid) {
  if (selectedCells.length !== 4) return false;

  let stoneLocations = [];
  let glassLocation = null;
  let woodLocation = null;
  let stoneCount = 0;
  let hasGlass = false;
  let hasWood = false;

  for (const index of selectedCells) {
    const resource = grid[index];
    if (resource === 'stone') {
      stoneLocations.push({ row: getRow(index), col: getCol(index) });
      stoneCount++;
    } else if (resource === 'glass') {
      glassLocation = { row: getRow(index), col: getCol(index) };
      hasGlass = true;
    } else if (resource === 'wood') {
      woodLocation = { row: getRow(index), col: getCol(index) };
      hasWood = true;
    }
  }

  if (stoneCount !== 2 || !hasGlass || !hasWood) return false;

  const [stone1, stone2] = stoneLocations;

  // Check T pattern
  if (glassLocation.row === stone1.row && glassLocation.row === stone2.row && 
      glassLocation.col === woodLocation.col) {
    return difference(glassLocation.col, stone1.col) === 1 && 
           difference(glassLocation.col, stone2.col) === 1 && 
           difference(glassLocation.row, woodLocation.row) === 1;
  } else if (glassLocation.col === stone1.col && glassLocation.col === stone2.col && 
             glassLocation.row === woodLocation.row) {
    return difference(glassLocation.row, stone1.row) === 1 && 
           difference(glassLocation.row, stone2.row) === 1 && 
           difference(glassLocation.col, woodLocation.col) === 1;
  }
  return false;
}

export function checkChapel(selectedCells, grid) {
  if (selectedCells.length !== 4) return false;

  let stoneLocations = [];
  let glassLocations = [];
  let stoneCount = 0;
  let glassCount = 0;

  for (const index of selectedCells) {
    const resource = grid[index];
    if (resource === 'stone') {
      stoneLocations.push({ row: getRow(index), col: getCol(index) });
      stoneCount++;
    } else if (resource === 'glass') {
      glassLocations.push({ row: getRow(index), col: getCol(index) });
      glassCount++;
    }
  }

  if (stoneCount !== 2 || glassCount !== 2) return false;

  const [stone1, stone2] = stoneLocations;
  const [glass1, glass2] = glassLocations;

  // Check all possible patterns
  for (const glass of glassLocations) {
    for (const stone of stoneLocations) {
      // Check horizontal pattern
      if (glass.row === stone1.row && glass.row === stone2.row) {
        if (difference(glass.col, stone1.col) === 1 && 
            difference(glass.col, stone2.col) === 1) {
          const otherGlass = glassLocations.find(g => g !== glass);
          if ((stone1.col === otherGlass.col && difference(stone1.row, otherGlass.row) === 1) ||
              (stone2.col === otherGlass.col && difference(stone2.row, otherGlass.row) === 1)) {
            return true;
          }
        }
      }
      // Check vertical pattern
      else if (glass.col === stone1.col && glass.col === stone2.col) {
        if (difference(glass.row, stone1.row) === 1 && 
            difference(glass.row, stone2.row) === 1) {
          const otherGlass = glassLocations.find(g => g !== glass);
          if ((stone1.row === otherGlass.row && difference(stone1.col, otherGlass.col) === 1) ||
              (stone2.row === otherGlass.row && difference(stone2.col, otherGlass.col) === 1)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export function checkTradingPost(selectedCells, grid) {
  if (selectedCells.length !== 5) return false;

  let stoneLocations = [];
  let woodLocations = [];
  let brickLocation = null;
  let stoneCount = 0;
  let woodCount = 0;
  let hasBrick = false;

  for (const index of selectedCells) {
    const resource = grid[index];
    if (resource === 'stone') {
      stoneLocations.push({ row: getRow(index), col: getCol(index) });
      stoneCount++;
    } else if (resource === 'wood') {
      woodLocations.push({ row: getRow(index), col: getCol(index) });
      woodCount++;
    } else if (resource === 'brick') {
      brickLocation = { row: getRow(index), col: getCol(index) };
      hasBrick = true;
    }
  }

  if (stoneCount !== 2 || woodCount !== 2 || !hasBrick) return false;

  const [stone1, stone2] = stoneLocations;
  const [wood1, wood2] = woodLocations;

  // Check vertical pattern
  if (stone1.col === stone2.col && difference(stone1.row, stone2.row) === 1 &&
      wood1.col === wood2.col && difference(wood1.row, wood2.row) === 1) {
    if (difference(stone1.col, wood1.col) === 1) {
      if (areSetsEqual(
        new Set([stone1.row, stone2.row]),
        new Set([wood1.row, wood2.row])
      )) {
        return (wood1.row === brickLocation.row && difference(wood1.col, brickLocation.col) === 1) ||
               (wood2.row === brickLocation.row && difference(wood2.col, brickLocation.col) === 1);
      }
    }
  }
  // Check horizontal pattern
  else if (stone1.row === stone2.row && difference(stone1.col, stone2.col) === 1 &&
           wood1.row === wood2.row && difference(wood1.col, wood2.col) === 1) {
    if (difference(stone1.row, wood1.row) === 1) {
      if (areSetsEqual(
        new Set([stone1.col, stone2.col]),
        new Set([wood1.col, wood2.col])
      )) {
        return (wood1.col === brickLocation.col && difference(wood1.row, brickLocation.row) === 1) ||
               (wood2.col === brickLocation.col && difference(wood2.row, brickLocation.row) === 1);
      }
    }
  }
  return false;
} 


export function checkFactory(selectedCells, grid){
  if (selectedCells.length != 5) return false;

  let woodLocation = null;
  let hasWood = false;
  let brickLocations = [];
  let brickCount = 0;
  let stoneLocations = [];
  let stoneCount = 0;

  for (const index of selectedCells){
    const resource = grid[index];
    if (resource === 'stone') {
      stoneLocations.push({ row: getRow(index), col: getCol(index) });
      stoneCount++;
    } else if (resource === 'wood') {
      woodLocation = { row: getRow(index), col: getCol(index) }
      hasWood = true;
    } else if (resource === 'brick') {
      brickLocations.push({ row: getRow(index), col: getCol(index) });
      brickCount++;
    }
  }

  if (!hasWood || stoneCount != 2 || brickCount != 2) return false;
  let [stone1, stone2] = stoneLocations;
  let [brick1, brick2] = brickLocations;

  if (stone1.col > stone2.col){
    const temp = stone1;
    stone1 = stone2;
    stone2 = temp;
  }
  if (brick1.col > brick2.col){
    const temp = brick1;
    brick1 = brick2;
    brick2 = temp;
  }

  //check horizontal pattern
  if (stone1.row === stone2.row && brick1.row == brick2.row && stone1.row === brick1.row){
    if (brick1.col + 1 === stone1.col && stone1.col + 1 === stone2.col && stone2.col + 1 === brick2.col){
      if ((brick1.col === woodLocation.col && difference(brick1.row, woodLocation.row) === 1) || (brick2.row === woodLocation.row && difference(brick2.col, woodLocation.col) === 1)){
        return true;
      }
    }
  }

  if (stone1.row > stone2.row){
    const temp = stone1;
    stone1 = stone2;
    stone2 = temp;
  }
  if (brick1.row > brick2.row){
    const temp = brick1;
    brick1 = brick2;
    brick2 = temp;
  }
  if (stone1.col === stone2.col && brick1.col === brick2.col && stone1.col === brick1.col){
    if (brick1.row + 1 === stone1.row && stone1.row +1 === stone2.row && stone2.row + 1 === brick2.row){
      if ((brick1.row === woodLocation.row && difference(brick1.col, woodLocation.col) === 1) || (brick2.row === woodLocation.row && difference(brick2.col, woodLocation.col) === 1)){
        return true;
      }
    }
  }
  return false;
}

export function checkTheater(selectedCells, grid){
  if (selectedCells.length != 4) return false;

  let stoneLocation = null;
  let hasStone = false;
  let brickLocations = [];
  let brickCount = 0;
  let glassLocation = null;
  let hasGlass = false;

  for (const index of selectedCells){
    const resource = grid[index];
    if (resource === 'stone') {
      stoneLocation = { row: getRow(index), col: getCol(index) };
      hasStone = true;
    } else if (resource === 'glass') {
      glassLocation = { row: getRow(index), col: getCol(index) }
      hasGlass = true;
    } else if (resource === 'brick') {
      brickLocations.push({ row: getRow(index), col: getCol(index) });
      brickCount++;
    }
  }

  if (!hasStone || !hasGlass || brickCount != 2) return false;
  let [brick1, brick2] = brickLocations;

  if (brick1.col > brick2.col){
    const temp = brick1;
    brick1 = brick2;
    brick2 = temp;
  }

  //check horizontal pattern
  if (brick1.row == brick2.row && brick2.row == glassLocation.row){
    if (brick1.col + 1 == glassLocation.col && glassLocation.col + 1 == brick2.col){
      if (glassLocation.col == stoneLocation.col && difference(glassLocation.row, stoneLocation.row) == 1){
        return true;
      }
    }
  }

  if (brick1.row > brick2.row){
    const temp = brick1;
    brick1 = brick2;
    brick2 = temp;
  }
  if (brick1.col == brick2.col && brick2.col == glassLocation.col){
    if (brick1.row + 1 == glassLocation.row && glassLocation.row + 1 == brick2.row){
      if (glassLocation.row == stoneLocation.row && difference(glassLocation.col, stoneLocation.col) == 1){
        return true;
      }
    }
  }
  return false;
}
