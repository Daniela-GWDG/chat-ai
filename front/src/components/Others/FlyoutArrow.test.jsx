import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FlyoutArrow from "./FlyoutArrow";

describe("FlyoutArrow", () => {
  it("draws the border on the edge facing the button", () => {
    const { container, rerender } = render(<FlyoutArrow side="top" className="right-4" />);
    expect(container.firstChild).toHaveClass("-top-[5px]", "border-t", "border-l", "right-4", "rotate-45");
    rerender(<FlyoutArrow side="left" />);
    expect(container.firstChild).toHaveClass("-left-[5px]", "border-l", "border-b");
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("follows the target's centre when the flyout is shifted", () => {
    const panel = document.createElement("div");
    panel.getBoundingClientRect = () => ({ left: 8, width: 240, top: 0, height: 100 });
    document.body.appendChild(panel);
    const target = document.createElement("button");
    target.getBoundingClientRect = () => ({ left: 189, width: 32, top: 0, height: 32 });
    const spy = vi.spyOn(HTMLElement.prototype, "offsetParent", "get").mockReturnValue(panel);

    const { container } = render(<FlyoutArrow side="top" targetRef={{ current: target }} />, {
      container: panel,
    });
    // centre 205 - panel left 8 - half arrow 5
    expect(container.querySelector("[data-flyout-arrow]").style.left).toBe("192px");
    spy.mockRestore();
  });
});
