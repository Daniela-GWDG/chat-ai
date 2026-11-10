import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EditBox from "./EditBox";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../../../hooks/useSendMessage", () => ({ useSendMessage: () => vi.fn() }));

const localState = {
  id: "c1",
  messages: [{ role: "user", content: [{ type: "text", text: "Hallo" }] }],
};

const renderBox = (props) =>
  render(
    <EditBox
      localState={localState}
      setLocalState={vi.fn()}
      message_index={0}
      setEditMode={vi.fn()}
      {...props}
    />,
  );

describe("EditBox", () => {
  it("uses translated daisyUI buttons", () => {
    renderBox();
    expect(screen.getByRole("button", { name: "common.cancel" })).toHaveClass("btn", "btn-ghost");
    expect(screen.getByRole("button", { name: "common.save" })).toHaveClass("btn", "btn-accent");
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("has no clear button", () => {
    renderBox();
    expect(screen.queryByRole("button", { name: "common.clear" })).not.toBeInTheDocument();
  });

  it("uses the prompt send button", () => {
    renderBox();
    expect(screen.getByRole("button", { name: "common.send" })).toHaveClass("text-accent", "h-8");
  });

  it("leaves edit mode on cancel", () => {
    const setEditMode = vi.fn();
    renderBox({ setEditMode });
    fireEvent.click(screen.getByRole("button", { name: "common.cancel" }));
    expect(setEditMode).toHaveBeenCalledWith(false);
  });
});
