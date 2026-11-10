import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChatAiLogo from "../ChatAiLogo";

describe("ChatAiLogo", () => {
  it("renders one variant per color mode with the given size", () => {
    render(<ChatAiLogo className="h-7 w-auto" />);
    const [light, dark] = screen.getAllByAltText("Chat AI Logo");
    expect(light).toHaveClass("dark:hidden", "h-7");
    expect(dark).toHaveClass("hidden", "dark:block", "h-7");
  });
});
