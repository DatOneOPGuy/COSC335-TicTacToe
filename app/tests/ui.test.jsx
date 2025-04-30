import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from '../src/app.jsx';

describe("Tiny Towns App DOM", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders a 4x4 grid (16 tiles)", () => {
    const gridButtons = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("w-16")
    );
    expect(gridButtons.length).toBe(16);
  });

  test("renders top 3 resource selection buttons", () => {
    const resourceButtons = screen.getAllByRole("button").filter(btn =>
      btn.textContent.trim().length > 0 && btn.className.includes("capitalize")
    );
    expect(resourceButtons.length).toBe(3);
  });

  test("clicking a grid tile colors it (places resource)", () => {
    const gridButtons = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("w-16")
    );

    const initialClass = gridButtons[0].className;
    fireEvent.click(gridButtons[0]);

    expect(gridButtons[0].className).not.toBe(initialClass);
  });

  test("clicking a tile with a resource selects it (adds border)", () => {
    const gridButtons = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("w-16")
    );
  
    // Step 1: Place a resource
    fireEvent.click(gridButtons[0]);
  
    // Step 2: Select the tile (only if it has a resource)
    fireEvent.click(gridButtons[0]);
  
    // Step 3: Expect border highlight (indicating selection)
    expect(gridButtons[0].className).toMatch(/border-blue-400/);
  });
  

  test("reset button clears the board", () => {
    const allButtons = screen.getAllByRole("button");
    const gridButtons = allButtons.filter(btn => btn.className.includes("w-16"));
    const resetButton = allButtons.find(btn => btn.textContent.toLowerCase().includes("reset"));

    fireEvent.click(gridButtons[0]); // Place resource
    fireEvent.click(resetButton);    // Reset grid

    expect(gridButtons[0].className).toMatch(/bg-gray-800/); // Back to empty
  });
});
