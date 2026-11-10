import { describe, expect, it } from "vitest";
import { keepViewportPosition } from "./keepViewportPosition";

const setup = () => {
  const scroller = document.createElement("div");
  scroller.style.overflowY = "auto";
  Object.defineProperty(scroller, "scrollHeight", { value: 2000 });
  Object.defineProperty(scroller, "clientHeight", { value: 500 });
  scroller.scrollTop = 300;
  const element = document.createElement("div");
  scroller.appendChild(element);
  document.body.appendChild(scroller);
  return { scroller, element };
};

const placeAt = (element, top) => {
  element.getBoundingClientRect = () => ({ top });
};

describe("keepViewportPosition", () => {
  it("scrolls down by the amount the element moved down", () => {
    const { scroller, element } = setup();
    placeAt(element, 450);
    keepViewportPosition(element, 400);
    expect(scroller.scrollTop).toBe(350);
  });

  it("scrolls up when the content above shrank", () => {
    const { scroller, element } = setup();
    placeAt(element, 340);
    keepViewportPosition(element, 400);
    expect(scroller.scrollTop).toBe(240);
  });

  it("leaves the scroll position alone when nothing moved", () => {
    const { scroller, element } = setup();
    placeAt(element, 400);
    keepViewportPosition(element, 400);
    expect(scroller.scrollTop).toBe(300);
  });

  it("does nothing without an element", () => {
    expect(() => keepViewportPosition(null, 0)).not.toThrow();
  });
});
