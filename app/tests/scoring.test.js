import { describe, test, expect } from 'vitest';
import { calculateScore } from '../src/logic.js';

const b = (building) => ({ type: 'building', building });

describe('calculateScore', () => {

  test('scores cottages fed by farms correctly (3 VP each)', () => {
    const board = Array(16).fill(null);
    board[0] = b('farm');
    board[1] = b('cottage');
    board[2] = b('cottage');
    board[3] = b('cottage');
    board[4] = b('cottage');
    board[5] = b('cottage'); // This one shouldn't be fed
    expect(calculateScore(board)).toBe(12); // 4 fed cottages * 3
  });

  test('scores wells by adjacent cottages', () => {
    const board = Array(16).fill(null);
    board[5] = b('well');
    board[1] = b('cottage');
    board[4] = b('cottage');
    board[6] = b('cottage');
    board[9] = b('cottage');
    board[10] = b('cottage'); // Not adjacent
    expect(calculateScore(board)).toBe(4); // 4 adjacent cottages
  });

  test('chapel scores 1 VP per fed cottage', () => {
    const board = Array(16).fill(null);
    board[0] = b('farm');
    board[1] = b('cottage');
    board[2] = b('cottage');
    board[3] = b('chapel');
    expect(calculateScore(board)).toBe(8); // 2 cottages (6 points from farm), 2 from chapel
  });

  test('taverns use group scoring (3 taverns = 9 VP)', () => {
    const board = Array(16).fill(null);
    board[0] = b('tavern');
    board[1] = b('tavern');
    board[2] = b('tavern');
    expect(calculateScore(board)).toBe(9);
  });

  test('markets score by number in same row/col', () => {
    const board = Array(16).fill(null);
    board[0] = b('market');
    board[1] = b('market'); // same row
    board[4] = b('market'); // same col as board[0]
    // board[0] sees 1 in row (1), 1 in col (1) => max 1
    // board[1] sees 1 in row => 1
    // board[4] sees 1 in col => 1
    expect(calculateScore(board)).toBe(3);
  });

  test('theater scores unique buildings in row and col', () => {
    const board = Array(16).fill(null);
    board[0] = b('theater'); // top left
    board[1] = b('well');
    board[2] = b('well');
    board[4] = b('cottage'); // same column
    board[8] = b('factory'); // same column
    expect(calculateScore(board)).toBe(3); // 4 wells should be 4 VP from theater
  });

  test('subtracts empty spaces at end of game if no cathedral', () => {
    const board = Array(16).fill(null);
    board[0] = b('cottage');
    expect(calculateScore(board, true)).toBe(-15); // 15 empty spaces, none from cottage => -15
  });

  test('does not subtract empty spaces if cathedral exists', () => {
    const board = Array(16).fill(null);
    board[0] = b('cottage');
    board[1] = b('cathedral');
    expect(calculateScore(board, true)).toBe(0); // No penalty due to cathedral
  });

  test('clamps score to 0 mid-game even if would be negative', () => {
    const board = Array(16).fill(null);
    board[0] = b('cottage');
    expect(calculateScore(board)).toBe(0); // Not end of game, don't allow negative
  });
});
