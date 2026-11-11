import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ assign: vi.fn(), create: vi.fn() }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
  Trans: ({ i18nKey }) => i18nKey,
}));
vi.mock("react-redux", () => ({ useSelector: () => false }));
vi.mock("../../../db", () => ({ assignConversationToFolder: mocks.assign, createFolder: mocks.create }));
vi.mock("../../../modals/BaseModal", () => ({
  default: ({ children, titleKey, titleClassName, contentClassName, maxWidth }) => (
    <div
      data-testid="modal"
      data-titlekey={titleKey}
      data-title={titleClassName}
      data-content={contentClassName}
      data-width={maxWidth}
    >
      {children}
    </div>
  ),
}));

import MoveChatModal from "./MoveChatModal";

const folders = [
  { id: "t2", name: "Zeta", icon: "pen", color: "rose" },
  { id: "t1", name: "Alpha", icon: "🎓" },
];

const renderModal = (props = {}) =>
  render(
    <MoveChatModal isOpen onClose={vi.fn()} conversationId="c1" conversationTitle="Chat" folders={folders} {...props} />,
  );

describe("MoveChatModal", () => {
  beforeEach(() => {
    mocks.assign.mockReset();
    mocks.create.mockReset();
  });

  it("uses the shared dialog style and is titled 'move chat'", () => {
    renderModal();
    const modal = screen.getByTestId("modal");
    expect(modal.dataset.titlekey).toBe("folders.move_title");
    expect(modal.dataset.title).toBe("text-base font-semibold");
    expect(modal.dataset.content).toBe("p-0");
    expect(modal.firstChild).toHaveClass("border-t", "border-base-300", "p-5");
    expect(screen.getByRole("button", { name: "common.cancel" })).toHaveClass("btn-ghost");
  });

  it("offers the plain chat list on its own, then the topics under a heading", () => {
    renderModal();
    const labels = screen.getAllByRole("radio").map((radio) => radio.closest("label").textContent);
    expect(labels[0]).toBe("folders.title (folders.move_target_chats_hint)");
    expect(labels.slice(1)).toEqual(["🎓Alpha", "Zeta", "folders.move_new_topic"]);
    // one divider below "Chats", one above "New topic"
    expect(screen.getAllByRole("separator")).toHaveLength(2);
    expect(screen.getByText("folders.topics_section")).toBeInTheDocument();
    // "Chats" has no icon; topics do
    expect(screen.getAllByRole("radio")[0].closest("label").querySelector("svg")).toBeNull();
  });

  it("disables moving to where the chat already is", () => {
    renderModal({ currentFolderId: "t1" });
    const move = screen.getByRole("button", { name: "folders.move_action" });
    expect(move).toBeDisabled();
    fireEvent.click(screen.getAllByRole("radio")[0]);
    expect(move).not.toBeDisabled();
  });

  it("moves the chat out of its topic into the chat list", async () => {
    const onClose = vi.fn();
    renderModal({ currentFolderId: "t1", onClose });
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button", { name: "folders.move_action" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(mocks.assign).toHaveBeenCalledWith("c1", null);
  });

  it("creates a new topic in place and moves the chat into it in one step", async () => {
    mocks.create.mockResolvedValue("new-topic");
    const onClose = vi.fn();
    renderModal({ onClose });
    expect(screen.queryByTestId("new-topic-fields")).toBeNull();
    fireEvent.click(screen.getAllByRole("radio").at(-1));
    expect(screen.getByTestId("new-topic-fields")).toBeInTheDocument();
    const move = screen.getByRole("button", { name: "folders.move_action" });
    expect(move).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText("folders.name_placeholder"), { target: { value: " Reisen " } });
    fireEvent.click(move);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(mocks.create).toHaveBeenCalledWith("Reisen", expect.objectContaining({ icon: expect.any(String), color: expect.any(String) }));
    expect(mocks.assign).toHaveBeenCalledWith("c1", "new-topic");
  });

  it("moves the open chat through its local state instead of a direct write", async () => {
    const setLocalState = vi.fn();
    const onClose = vi.fn();
    renderModal({ currentFolderId: "t1", localState: { id: "c1", folderId: "t1" }, setLocalState, onClose });
    fireEvent.click(screen.getAllByRole("radio")[0]);
    fireEvent.click(screen.getByRole("button", { name: "folders.move_action" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(mocks.assign).not.toHaveBeenCalled();
    expect(setLocalState.mock.calls[0][0]({ id: "c1", folderId: "t1" })).toEqual({
      id: "c1",
      folderId: null,
      flush: true,
    });
  });
});
