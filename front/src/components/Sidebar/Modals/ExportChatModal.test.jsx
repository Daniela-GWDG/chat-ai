import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ Trans: ({ i18nKey }) => i18nKey }));
vi.mock("../../../db", () => ({ getConversation: vi.fn() }));
vi.mock("../../../hooks/useToast", () => ({ useToast: () => ({ notifyError: vi.fn(), notifySuccess: vi.fn() }) }));
vi.mock("jspdf", () => ({ jsPDF: vi.fn() }));
vi.mock("../../../utils/sendMessage", () => ({ processContentItems: vi.fn() }));
vi.mock("../../../modals/BaseModal", () => ({
  default: ({ children, titleClassName, contentClassName }) => (
    <div data-testid="modal" data-title={titleClassName} data-content={contentClassName}>
      {children}
    </div>
  ),
}));

import ExportChatModal from "./ExportChatModal";

const conversation = { id: "c1", title: "Chat", messages: [], settings: {} };

describe("ExportChatModal", () => {
  it("uses the shared dialog style with a format radio list and cancel/export buttons", async () => {
    render(<ExportChatModal isOpen onClose={vi.fn()} localState={conversation} conversationId="c1" />);
    const modal = await screen.findByTestId("modal");
    expect(modal.dataset.title).toBe("text-base font-semibold");
    expect(modal.dataset.content).toBe("p-0");
    expect(modal.firstChild).toHaveClass("border-t", "border-base-300", "p-5");

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    // Same grey border (≥3:1 contrast) and hover as the checkboxes; Berry once selected.
    radios.forEach((radio) =>
      expect(radio).toHaveClass("radio", "radio-sm", "text-accent", "border-base-content/50", "hover:border-base-content/80", "checked:border-accent"),
    );
    expect(radios[0]).toBeChecked();

    // Square checkboxes, so they differ from the round radios when unchecked.
    screen.getAllByRole("checkbox").forEach((box) =>
      expect(box).toHaveClass("checkbox", "checkbox-sm", "[--radius-selector:0.25rem]", "text-accent", "border-base-content/50"),
    );
    expect(screen.getByRole("radiogroup")).not.toHaveClass("border");
    // 1px separator like the dialog header line, not the 2px daisyUI divider.
    expect(screen.getByRole("separator")).toHaveClass("border-t", "border-base-300");
    expect(screen.getByRole("button", { name: "common.cancel" })).toHaveClass("btn-ghost");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "export_conversation.export" })).toHaveClass("btn-accent"),
    );
  });
});
