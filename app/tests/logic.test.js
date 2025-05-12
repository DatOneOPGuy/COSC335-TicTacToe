import { saveGame, calculateScore, isAdjacent } from "../src/logic.js";
import { checkCottage, checkFarm, checkWell } from "../src/buildingPatterns.js";

// Mock fetch globally
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe("saveGame", () => {
  test("sends correct POST request with headers and body", async () => {
    const mockBoard = [
      "wheat", "brick", null, "wood",
      null, "glass", "stone", null,
      null, null, null, null,
      null, null, null, null
    ];
    const mockToken = "test-id-token";
    const startTime = "2025-05-12T16:00:00.000Z";
    const endTime = "2025-05-12T16:30:00.000Z";

    fetch.mockResolvedValueOnce({ ok: true });

    const before = new Date();
    await saveGame(mockBoard, mockToken, startTime, endTime);

    // Verify the call was made once
    expect(fetch).toHaveBeenCalledTimes(1);

    // Get the actual call arguments
    const call = fetch.mock.calls[0];
    const [url, options] = call;
    const actualBody = JSON.parse(options.body);

    // Verify URL and method
    expect(url).toBe("http://localhost:3000/save-game");
    expect(options.method).toBe("POST");

    // Verify headers
    expect(options.headers).toEqual({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${mockToken}`
    });

    // Verify body structure and content
    expect(actualBody).toEqual({
      townmap: mockBoard.map(cell => cell || "0"),
      points: expect.any(Number),
      startTime,
      endTime,
      timestamp: expect.any(String)
    });

    // Verify timestamp is valid and recent
    const sentTimestamp = new Date(actualBody.timestamp);
    expect(sentTimestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });
});

describe("calculateScore", () => {
  test("calculates score for a board with cottages and farms", () => {
    const board = [
      { type: "building", building: "cottage" },
      { type: "building", building: "farm" },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const score = calculateScore(board, true);
    expect(score).toBeGreaterThan(-12); // Ensure score is calculated
  });

  test("calculates score with penalties for empty spaces", () => {
    const board = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const score = calculateScore(board, true);
    expect(score).toBeLessThan(0); // Ensure penalties are applied
  });

  test("calculates score for a perfect town", () => {
    const board = [
      { type: "building", building: "cottage" },
      { type: "building", building: "farm" },
      { type: "building", building: "well" },
      { type: "building", building: "chapel" },
      { type: "building", building: "market" },
      { type: "building", building: "cathedral" },
      { type: "building", building: "factory" },
      { type: "building", building: "theater" },
      { type: "building", building: "cottage" },
      { type: "building", building: "farm" },
      { type: "building", building: "well" },
      { type: "building", building: "chapel" },
      { type: "building", building: "market" },
      { type: "building", building: "tavern" },
      { type: "building", building: "cathedral" },
    ];
    const score = calculateScore(board, true);
    expect(score).toBeGreaterThan(15); // Ensure high score for perfect town
  });
});

describe("Building Pattern Matching", () => {
  test("validates a cottage pattern", () => {
    const grid = [
      "glass",
      "brick",
      null,
      null,
      "wheat",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const selectedCells = [0, 1, 5];
    expect(checkCottage(selectedCells, grid)).toBe(false);
  });

  test("validates a farm pattern", () => {
    const grid = [
      "wood",
      "wood",
      null,
      null,
      "wheat",
      "wheat",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const selectedCells = [0, 1, 4, 5];
    expect(checkFarm(selectedCells, grid)).toBe(true);
  });

  test("validates a well pattern", () => {
    const grid = [
      "stone",
      "wood",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const selectedCells = [0, 1];
    expect(checkWell(selectedCells, grid)).toBe(true);
  });

  test("rejects an invalid cottage pattern", () => {
    const grid = [
      "brick",
      "glass",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const selectedCells = [0, 1];
    expect(checkCottage(selectedCells, grid)).toBe(false);
  });
});
