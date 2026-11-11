import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ToolLimit from "../ToolLimit";

describe("ToolLimit", () => {
  it("keeps the same row height with and without the number field", () => {
    const { container, rerender } = render(
      <ToolLimit localState={{ settings: { max_tool_calls: 10 } }} setLocalState={vi.fn()} />,
    );
    expect(container.firstChild).toHaveClass("min-h-8");
    expect(screen.getByRole("spinbutton")).toHaveClass("input", "input-sm");
    expect(screen.getByRole("spinbutton")).toBeEnabled();
    rerender(<ToolLimit localState={{ settings: { max_tool_calls: 0 } }} setLocalState={vi.fn()} />);
    expect(container.firstChild).toHaveClass("min-h-8");
    // Without the limit the field stays, disabled.
    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });
});
