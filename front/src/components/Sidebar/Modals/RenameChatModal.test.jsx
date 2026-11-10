import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import RenameChatModal from "./RenameChatModal";
import { updateConversationMeta } from "../../../db";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
  Trans: ({ i18nKey }) => i18nKey,
}));
vi.mock("../../../db", () => ({ updateConversationMeta: vi.fn() }));

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("RenameChatModal", () => {
  it("uses the same header, divider and buttons as the topic dialog", async () => {
    render(
      <RenameChatModal
        isOpen
        onClose={vi.fn()}
        id="c1"
        currentTitle="Mein Chat"
        localState={{ id: "c1" }}
        setLocalState={vi.fn()}
      />,
    );
    const title = await screen.findByText("rename_conversation.title");
    expect(title.className).toContain("text-base-content");
    expect(title.className).toContain("font-semibold");

    const input = screen.getByDisplayValue("Mein Chat");
    expect(input).toHaveClass("input");
    expect(input.closest(".border-t")).toHaveClass("border-base-300");
    expect(screen.getByRole("button", { name: "common.cancel" })).toHaveClass("btn-ghost");
    expect(screen.getByRole("button", { name: "common.rename" })).toHaveClass("btn-accent");
  });

  const renameTo = async (props) => {
    render(<RenameChatModal isOpen id="c1" currentTitle="Alt" {...props} />);
    const input = await screen.findByDisplayValue("Alt");
    fireEvent.change(input, { target: { value: "Neu" } });
    fireEvent.click(screen.getByRole("button", { name: "common.rename" }));
  };

  it("closes after renaming a chat that is not open", async () => {
    const onClose = vi.fn();
    await renameTo({ onClose, localState: { id: "other" }, setLocalState: vi.fn() });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(updateConversationMeta).toHaveBeenCalledWith("c1", { title: "Neu" });
  });

  it("closes after renaming the open chat", async () => {
    const onClose = vi.fn();
    const setLocalState = vi.fn();
    await renameTo({ onClose, localState: { id: "c1" }, setLocalState });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(setLocalState).toHaveBeenCalledTimes(1);
  });
});
