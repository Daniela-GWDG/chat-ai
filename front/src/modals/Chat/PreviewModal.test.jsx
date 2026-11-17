import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ file: null, base64: null, needs: false }));
vi.mock("../../db", () => ({
  useFile: () => ({ file: mocks.file, data: new ArrayBuffer(0) }),
  useFileBase64: () => mocks.base64,
  useFileContent: () => "Hallo",
}));
vi.mock("../../hooks/useProcessAttachments", () => ({ needsProcessing: () => mocks.needs }));

import PreviewModal from "./PreviewModal";

const open = (file, base64 = null) => {
  mocks.file = file;
  mocks.base64 = base64;
  render(<PreviewModal isOpen onClose={vi.fn()} fileId="f1" />);
};

describe("PreviewModal", () => {
  it("uses the shared dialog style: file name as title, ghost close and accent download", () => {
    open({ name: "bericht.txt", type: "text/plain" });
    expect(screen.getByRole("heading", { name: "bericht.txt" })).toHaveClass("text-base", "font-semibold", "text-base-content");
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("btn-ghost");
    expect(screen.getByRole("button", { name: "Download file" })).toHaveClass("btn-accent");
  });

  it("shows no processing hint for a PDF the agent converts itself", () => {
    mocks.needs = false;
    open({ name: "a.pdf", type: "application/pdf" }, "data:application/pdf;base64,AA");
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("points to the note above the attachments when the PDF must be processed", () => {
    mocks.needs = true;
    open({ name: "a.pdf", type: "application/pdf" }, "data:application/pdf;base64,AA");
    expect(screen.getByRole("note")).toHaveClass("alert-warning");
    expect(screen.getByRole("note")).toHaveTextContent("note above the attachments");
    mocks.needs = false;
  });
});
