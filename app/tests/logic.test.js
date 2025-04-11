import { checkWinner } from "../src/logic.js";

describe('checkWinner', () => {
  test('detects a horizontal win for X', () => {
    expect(checkWinner(["X", "X", "X", "", "", "", "", "", ""])).toBe("X");
  });

  test('detects a vertical win for O', () => {
    expect(checkWinner(["O", "", "", "O", "", "", "O", "", ""])).toBe("O");
  });

  test('detects a diagonal win for X', () => {
    expect(checkWinner(["X", "", "", "", "X", "", "", "", "X"])).toBe("X");
  });

  test('returns null for a draw', () => {
    expect(checkWinner(["X", "O", "X", "X", "O", "O", "O", "X", "X"])).toBe(null);
  });
});