import { saveGame } from "../src/logic.js";

// Mock fetch globally
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe('saveGame', () => {
  test('sends correct POST request with headers and body', async () => {
    const mockBoard = [
      "wheat", "brick", null, "wood",
      null, "glass", "stone", null,
      null, null, null, null,
      null, null, null, null
    ];
    const mockWinner = null; // or a building card name later
    const mockToken = "test-id-token";

    fetch.mockResolvedValueOnce({ ok: true });

    const before = new Date();

    await saveGame(mockBoard, mockWinner, mockToken);

    const call = fetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    const sentTimestamp = new Date(body.timestamp);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/save-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify({
        board: mockBoard,
        winner: mockWinner,
        timestamp: body.timestamp,
      }),
    });

    expect(sentTimestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });
});
