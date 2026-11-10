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
  useFileBase64: (id) => (id ? "data:image/png;base64,AAA" : null),
}));
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
    expect(image).toHaveAttribute("src", "data:image/png;base64,AAA");
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
