import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UnprocessedFilesModal from "./UnprocessedFilesModal";

describe("UnprocessedFilesModal", () => {
  it("uses the shared dialog style: cancel on the left, the action on the right", () => {
    render(<UnprocessedFilesModal isOpen onClose={vi.fn()} count={2} onSendWithout={vi.fn()} />);
    expect(screen.getByRole("heading")).toHaveClass("text-base", "font-semibold", "text-base-content");
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass("btn-ghost");
    const send = screen.getByRole("button", { name: "Send without these files" });
    expect(send).toHaveClass("btn-accent");
    expect(send.parentElement).toHaveClass("justify-end");
  });

  it("closes and sends without the files", () => {
    const onClose = vi.fn();
    const onSendWithout = vi.fn();
    render(<UnprocessedFilesModal isOpen onClose={onClose} count={1} onSendWithout={onSendWithout} />);
    fireEvent.click(screen.getByRole("button", { name: "Send without this file" }));
    expect(onClose).toHaveBeenCalled();
    expect(onSendWithout).toHaveBeenCalled();
  });

  it("only offers cancel when nothing would be left to send", () => {
    render(<UnprocessedFilesModal isOpen onClose={vi.fn()} count={1} />);
    expect(screen.queryByRole("button", { name: /Send without/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
