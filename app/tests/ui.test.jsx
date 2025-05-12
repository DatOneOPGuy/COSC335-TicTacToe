import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "../src/app.jsx";
import "@testing-library/jest-dom";

// Mock fetch globally
global.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({})
}));

beforeEach(async () => {
  fetch.mockClear();
  render(<App />);
  // Wait once for initial render
  await waitFor(() => {
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  }, { timeout: 1000 });
});

describe("Tiny Towns App UI", () => {
  test("places a resource on the grid", async () => {
    const gridButtons = screen.getAllByRole("button").filter((btn) =>
      btn.className.includes("w-16")
    );
    const resourceButtons = screen.getAllByRole("button").filter((btn) =>
      btn.textContent.trim().length > 0 && btn.className.includes("capitalize")
    );
    
    // Select a resource
    fireEvent.click(resourceButtons[0]);
    
    // Place the resource on the grid
    fireEvent.click(gridButtons[0]);
    
    await waitFor(() => {
      expect(gridButtons[0].className).toContain(resourceButtons[0].textContent.toLowerCase());
    }, { timeout: 1000 });
  });

  test("builds a building on the grid", async () => {
    const gridButtons = screen.getAllByRole("button").filter((btn) =>
      btn.className.includes("w-16")
    );
    const resourceButtons = screen.getAllByRole("button").filter((btn) =>
      btn.textContent.trim().length > 0 && btn.className.includes("capitalize")
    );

    // Place resources for a well (simpler building to test)
    fireEvent.click(resourceButtons.find(btn => btn.textContent.includes("stone")));
    fireEvent.click(gridButtons[0]);
    fireEvent.click(resourceButtons.find(btn => btn.textContent.includes("wood")));
    fireEvent.click(gridButtons[1]);

    // Select cells and build
    fireEvent.click(gridButtons[0]);
    fireEvent.click(gridButtons[1]);
    
    const wellButton = screen.getByText("Well", { exact: false });
    fireEvent.click(wellButton);

    await waitFor(() => {
      expect(gridButtons[0]).toHaveClass("bg-white");
    }, { timeout: 1000 });
  });

  test("resets the grid", async () => {
    await waitFor(() => {
      const resetButton = screen.getByRole("button", { name: /reset/i });
      fireEvent.click(resetButton);
      
      const gridButtons = screen.getAllByRole("button").filter((btn) =>
        btn.className.includes("w-16")
      );
      expect(gridButtons[0]).toHaveClass("bg-gray-800");
    });
  });

  test("displays achievements in the profile view", async () => {
    await waitFor(() => {
      const profileButton = screen.getByRole("button", { name: /profile/i });
      fireEvent.click(profileButton);
      
      expect(screen.getByText(/earned achievements/i)).toBeInTheDocument();
    });
  });
});
