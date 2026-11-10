import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CloseIconButton, NavIconButton, PromptIconButton, SortIconButton } from "./IconButtons";

describe("IconButtons", () => {
  it.each([
    ["Nav", NavIconButton, ["h-10", "w-10", "text-accent", "hover:bg-accent/10"]],
    ["Close", CloseIconButton, ["h-10", "w-10", "hover:bg-base-200"]],
    ["Sort", SortIconButton, ["h-8", "w-8", "text-base-content/70", "hover:bg-base-200"]],
    ["Prompt", PromptIconButton, ["h-8", "w-8", "text-accent", "hover:bg-accent/10"]],
  ])("%s has a round hover state and its own size", (_name, Component, classes) => {
    render(<Component aria-label="Action" />);
    expect(screen.getByRole("button", { name: "Action" })).toHaveClass(
      "rounded-full",
      ...classes,
    );
  });

  it("forwards props and keeps extra classes", () => {
    const onClick = vi.fn();
    render(
      <NavIconButton aria-label="Action" data-guide="x" className="extra" onClick={onClick} />,
    );
    const button = screen.getByRole("button", { name: "Action" });
    expect(button).toHaveClass("extra", "rounded-full");
    expect(button).toHaveAttribute("data-guide", "x");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
