import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FloatingIconButton from "./FloatingIconButton";

describe("FloatingIconButton", () => {
  it("renders the shared look and forwards button props", () => {
    const onClick = vi.fn();
    render(
      <FloatingIconButton aria-label="Up" data-guide="up" onClick={onClick}>
        x
      </FloatingIconButton>,
    );
    const button = screen.getByRole("button", { name: "Up" });
    expect(button).toHaveClass("h-10", "w-10", "rounded-full", "bg-base-100", "text-accent", "shadow-lg");
    expect(button).toHaveClass("hover:bg-accent", "hover:text-accent-content");
    expect(button).toHaveAttribute("data-guide", "up");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("inverts with the error colors when danger is set", () => {
    render(<FloatingIconButton danger aria-label="Close">x</FloatingIconButton>);
    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveClass("hover:bg-error", "hover:text-error-soft");
    expect(button).not.toHaveClass("hover:bg-accent");
  });
});
