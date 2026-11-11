import { useRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OverlayScrollbar, { getThumbGeometry } from "./OverlayScrollbar";

describe("getThumbGeometry", () => {
  it("returns nothing when the content fits", () => {
    expect(getThumbGeometry({ scrollTop: 0, scrollHeight: 300, clientHeight: 300 })).toBeNull();
  });

  it("sizes the thumb by the visible share", () => {
    expect(getThumbGeometry({ scrollTop: 0, scrollHeight: 1000, clientHeight: 500 })).toEqual({
      height: 250,
      top: 0,
    });
  });

  it("reaches the bottom at the end of the content", () => {
    expect(getThumbGeometry({ scrollTop: 500, scrollHeight: 1000, clientHeight: 500 }).top).toBe(250);
  });

  it("keeps a minimum thumb height for long content", () => {
    expect(getThumbGeometry({ scrollTop: 0, scrollHeight: 100000, clientHeight: 500 }).height).toBe(24);
  });
});

function Harness({ scrollHeight }) {
  const ref = useRef(null);
  return (
    <div>
      <div
        ref={(node) => {
          ref.current = node;
          if (!node) return;
          Object.defineProperty(node, "scrollHeight", { value: scrollHeight, configurable: true });
          Object.defineProperty(node, "clientHeight", { value: 500, configurable: true });
        }}
      />
      <OverlayScrollbar targetRef={ref} />
    </div>
  );
}

describe("OverlayScrollbar", () => {
  it("shows a thumb only when there is something to scroll", () => {
    const { container, rerender } = render(<Harness scrollHeight={1000} />);
    expect(container.firstChild.lastChild.style.display).toBe("block");
    rerender(<Harness scrollHeight={300} />);
  });

  it("stays hidden when the content fits", () => {
    const { container } = render(<Harness scrollHeight={300} />);
    expect(container.firstChild.lastChild.style.display).toBe("none");
  });

  it("keeps the track clear of the edges with an inset", () => {
    const top = getThumbGeometry({ scrollTop: 0, scrollHeight: 1000, clientHeight: 500 }, 12);
    const bottom = getThumbGeometry({ scrollTop: 500, scrollHeight: 1000, clientHeight: 500 }, 12);
    expect(top.top).toBe(12);
    expect(bottom.top + bottom.height).toBe(500 - 12);
  });
});
