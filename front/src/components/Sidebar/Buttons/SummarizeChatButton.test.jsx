import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SummarizeChatButton from "./SummarizeChatButton";

const mocks = vi.hoisted(() => ({ openModal: vi.fn(), getConversation: vi.fn() }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("../../../modals/ModalContext", () => ({ useModal: () => ({ openModal: mocks.openModal }) }));
vi.mock("../../../hooks/useToast", () => ({ useToast: () => ({ notifyError: vi.fn(), notifySuccess: vi.fn() }) }));
vi.mock("../../../db", () => ({ getConversation: mocks.getConversation }));

const open = { id: "open", messages: [] };

const renderMenu = (convId) =>
  render(
    <ul>
      <SummarizeChatButton variant="menu" localState={open} setLocalState={vi.fn()} closeMenu={vi.fn()} convId={convId} />
    </ul>,
  );

describe("SummarizeChatButton in the chat menu", () => {
  it("summarizes the open chat directly", async () => {
    mocks.openModal.mockClear();
    renderMenu("open");
    fireEvent.click(screen.getByRole("button", { name: /common.summarize/ }));
    await waitFor(() => expect(mocks.openModal).toHaveBeenCalled());
    expect(mocks.openModal.mock.calls[0][1].localState).toBe(open);
    expect(mocks.getConversation).not.toHaveBeenCalled();
  });

  it("loads another chat before summarizing it", async () => {
    mocks.openModal.mockClear();
    const other = { id: "other", messages: [{ role: "user" }] };
    mocks.getConversation.mockResolvedValueOnce(other);
    renderMenu("other");
    fireEvent.click(screen.getByRole("button", { name: /common.summarize/ }));
    await waitFor(() => expect(mocks.openModal).toHaveBeenCalled());
    expect(mocks.getConversation).toHaveBeenCalledWith("other");
    expect(mocks.openModal.mock.calls[0][1].localState).toBe(other);
  });
});
