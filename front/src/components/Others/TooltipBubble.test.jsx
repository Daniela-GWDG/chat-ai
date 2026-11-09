import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TooltipBubble from "./TooltipBubble";

const rect = { top: 10, left: 20, width: 30, height: 40 };

describe("TooltipBubble", () => {
  it("renders an open daisyUI tooltip pinned to the trigger box", () => {
    render(<TooltipBubble rect={rect}>Hint</TooltipBubble>);
    const bubble = screen.getByText("Hint");
    expect(bubble).toHaveClass("tooltip-content");
    const tooltip = bubble.parentElement;
    expect(tooltip).toHaveClass("tooltip", "tooltip-open", "tooltip-top");
    expect(tooltip).toHaveStyle({
      position: "fixed",
      top: "10px",
      left: "20px",
      width: "30px",
      height: "40px",
    });
    expect(tooltip.parentElement).toBe(document.body);
  });

  it.each(["top", "bottom", "left", "right"])("supports placement %s", (placement) => {
    render(<TooltipBubble rect={rect} placement={placement}>Hint</TooltipBubble>);
    expect(screen.getByText("Hint").parentElement).toHaveClass(`tooltip-${placement}`);
  });

  it("can align to the trigger's end", () => {
    render(<TooltipBubble rect={rect} placement="bottom" align="end">Hint</TooltipBubble>);
    expect(screen.getByText("Hint").parentElement).toHaveClass("tooltip-bottom", "tooltip-end");
  });

  it("renders nothing until the trigger has been measured", () => {
    render(<TooltipBubble rect={null}>Hint</TooltipBubble>);
    expect(screen.queryByText("Hint")).not.toBeInTheDocument();
  });
});
