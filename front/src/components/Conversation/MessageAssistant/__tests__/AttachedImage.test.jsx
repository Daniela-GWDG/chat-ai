import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AttachedImage, { MessageFilesContext } from "../AttachedImage";

const mocks = vi.hoisted(() => ({
  openModal: vi.fn(),
  metas: {
    f1: { name: "marsupilami-tintin.png", type: "image/png" },
    f2: { name: "report.pdf", type: "application/pdf" },
  },
}));

vi.mock("../../../../db", () => ({
  useFiles: () => ({ loadFileMeta: mocks.loadFileMeta }),
  loadFileMeta: (id) => mocks.loadFileMeta(id),
  loadFile: async () => new Blob(["x"], { type: "image/png" }),
  useFileMeta: (id) => mocks.metas[id] ?? null,
}));
vi.mock("../../../../hooks/useToast", () => ({ useToast: () => ({ notifyError: vi.fn() }) }));
globalThis.URL.createObjectURL = () => "blob:image";
globalThis.URL.revokeObjectURL = () => {};
vi.mock("../../../../modals/ModalContext", () => ({
  useModal: () => ({ openModal: mocks.openModal }),
}));
mocks.loadFileMeta = async (id) => mocks.metas[id];

const renderImage = (src, fileIds) =>
  render(
    <MessageFilesContext.Provider value={fileIds}>
      <AttachedImage src={src} alt="Marsupilami" />
    </MessageFilesContext.Provider>,
  );

describe("AttachedImage", () => {
  it("shows the attachment matching a workspace path", async () => {
    renderImage("/generated/marsupilami-tintin.png", ["f2", "f1"]);
    const image = await screen.findByRole("img", { name: "Marsupilami" });
    expect(image).toHaveAttribute("src", "blob:image");
  });

  it("shows a bar with the file name, size and a download button", async () => {
    mocks.metas.f1.size = 1536;
    renderImage("/generated/marsupilami-tintin.png", ["f1"]);
    const preview = await screen.findByRole("group", { name: "marsupilami-tintin.png" });
    expect(preview).toHaveClass("rounded-box");
    expect(preview).toHaveTextContent("1.5 KB");
    expect(screen.getByRole("button", { name: "Download file" })).toBeInTheDocument();
  });

  it("opens the preview on click", async () => {
    renderImage("/generated/marsupilami-tintin.png", ["f1"]);
    fireEvent.click(await screen.findByRole("img", { name: "Marsupilami" }));
    expect(mocks.openModal).toHaveBeenCalledWith("preview", {
      previewFile: mocks.metas.f1,
      fileId: "f1",
    });
  });

  it("falls back to the alt text without a match", async () => {
    renderImage("/generated/other.png", ["f1"]);
    expect(await screen.findByText("Marsupilami")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("does not treat non-image files as a match", async () => {
    renderImage("/generated/report.pdf", ["f2"]);
    await waitFor(() => expect(screen.getByText("Marsupilami")).toBeInTheDocument());
  });
});
