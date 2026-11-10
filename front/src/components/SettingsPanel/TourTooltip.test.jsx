import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TourTooltip from "./TourTooltip";

const makeProps = (overrides = {}) => ({
  backProps: { title: "Back", onClick: vi.fn() },
  closeProps: { "aria-label": "Close", onClick: vi.fn() },
  primaryProps: { title: "Next", onClick: vi.fn() },
  skipProps: { title: "Skip", onClick: vi.fn() },
  tooltipProps: { role: "alertdialog" },
  step: { content: "Step text" },
  index: 1,
  size: 6,
  isLastStep: false,
  ...overrides,
});

describe("TourTooltip", () => {
  it("renders the step like a dialog with daisyUI buttons", () => {
    render(<TourTooltip {...makeProps()} />);
    expect(screen.getByRole("alertdialog")).toHaveClass("rounded-box");
    expect(screen.getByText("2 / 6")).toBeInTheDocument();
    expect(screen.getByText("Step text")).toHaveClass("text-sm");
    expect(screen.getByRole("button", { name: "Next" })).toHaveClass("btn", "btn-accent");
    expect(screen.getByRole("button", { name: "Back" })).toHaveClass("btn");
    expect(screen.getByRole("button", { name: "Skip" })).toHaveClass("btn", "btn-ghost");
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("h-10", "w-10", "rounded-full");
  });

  it("forwards the Joyride handlers", () => {
    const props = makeProps();
    render(<TourTooltip {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(props.primaryProps.onClick).toHaveBeenCalledTimes(1);
    expect(props.closeProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("hides back on the first step and skip on the last", () => {
    const { rerender } = render(<TourTooltip {...makeProps({ index: 0 })} />);
    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
    rerender(<TourTooltip {...makeProps({ index: 5, isLastStep: true })} />);
    expect(screen.queryByRole("button", { name: "Skip" })).not.toBeInTheDocument();
  });
});
