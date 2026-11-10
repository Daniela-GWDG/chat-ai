import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EditButton from "../EditButton";
import ForkButton from "../ForkButton";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));

describe("answer action buttons", () => {
  it.each([
    ["edit", <EditButton key="edit" setEditMode={vi.fn()} />],
    ["fork", <ForkButton key="fork" handleForkConversation={vi.fn()} />],
  ])("shows the %s icon at full strength without hovering", (_name, button) => {
    render(button);
    const control = screen.getByRole("button");
    expect(control).toBeEnabled();
    const icon = control.querySelector("svg");
    expect(icon).not.toHaveClass("opacity-25");
    expect(icon).toHaveClass("text-accent");
  });
});
