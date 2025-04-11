import React, { act } from "react";
import { createRoot } from "react-dom/client";


describe("App DOM", () => {
  let container;

  beforeEach(async () => {
    ({ App } = await import("../src/app.js"));
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
      const root = createRoot(container);
      root.render(React.createElement(App));
    });
    console.log(container.innerHTML);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("renders a 3x3 board", () => {
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(10);
  });

  test("clicking a square updates the board", () => {
    const buttons = container.querySelectorAll("button");
    const firstCell = buttons[0];
    firstCell.click();
    expect(firstCell.textContent).toBe("X");
  });

  test("reset button clears the board", () => {
    const buttons = container.querySelectorAll("button");
    buttons[0].click(); 
    const reset = buttons[9];
    reset.click(); 
    expect(buttons[0].textContent).toBe("");
  });
});
