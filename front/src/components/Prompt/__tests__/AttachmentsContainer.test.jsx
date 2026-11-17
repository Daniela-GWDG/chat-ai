import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ metas: {}, processAll: vi.fn(), mode: "choice" }));
vi.mock("react-redux", () => ({ useSelector: () => mocks.mode }));
vi.mock("../../Conversation/MessageAssistant/MediaPreview", () => ({ useFileMetas: () => mocks.metas }));
vi.mock("../../../hooks/useProcessAttachments", () => ({
  needsProcessing: (file) => file?.type === "application/pdf",
  useProcessAttachments: () => ({ processing: new Set(), processAll: mocks.processAll }),
}));
vi.mock("../Attachment", () => ({
  default: ({ attachment, index }) => <div data-testid="card">{`${attachment.fileId}@${index}`}</div>,
}));

import AttachmentsContainer, { cardsPerRow } from "../AttachmentsContainer";

const stateWith = (count) => ({
  messages: [
    {
      role: "user",
      content: [{ type: "text", text: "" }, ...Array.from({ length: count }, (_, i) => ({ type: "file", fileId: `f${i}` }))],
    },
  ],
});

describe("AttachmentsContainer", () => {
  it("fits 160px cards with 8px gaps into a row", () => {
    expect(cardsPerRow(160)).toBe(1);
    expect(cardsPerRow(4 * 160 + 3 * 8)).toBe(4);
    expect(cardsPerRow(50)).toBe(1);
  });

  it("offers one action to process every unprocessed document", () => {
    mocks.metas = { f0: { type: "application/pdf" }, f1: { type: "image/png" }, f2: { type: "application/pdf" } };
    render(<AttachmentsContainer localState={stateWith(3)} setLocalState={vi.fn()} />);
    expect(screen.getByRole("note")).toHaveTextContent("2 files must be processed before sending.");
    fireEvent.click(screen.getByRole("button", { name: "Process (server)" }));
    expect(mocks.processAll).toHaveBeenCalledWith(["f0", "f2"], false);
    mocks.metas = {};
  });

  it("shows the count in the label colour and no clear-all link and is set apart by a divider", () => {
    render(<AttachmentsContainer localState={stateWith(2)} setLocalState={vi.fn()} />);
    expect(screen.getByTestId("prompt-attachments")).toHaveClass("border-b", "border-base-300");
    expect(screen.getByText("2 attachments")).toHaveClass("text-base-content");
    expect(screen.queryByText("Clear all")).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("shows two rows per page and pages through the rest", () => {
    // jsdom has no layout: clientWidth is 0, so one card per row and two per page.
    render(<AttachmentsContainer localState={stateWith(5)} setLocalState={vi.fn()} />);
    const pages = screen.getByRole("navigation", { name: "Attachment pages" });
    expect(screen.getByRole("button", { name: "1" })).toHaveClass("btn-circle", "btn-active");
    expect(screen.getAllByTestId("card").map((c) => c.textContent)).toEqual(["f0@0", "f1@1"]);
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(screen.getAllByTestId("card").map((c) => c.textContent)).toEqual(["f4@4"]);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });
});
