import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import TopicEditorModal from "./TopicEditorModal";
import { createFolder, renameFolder, setFolderColor, setFolderIcon } from "../../../db";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
  Trans: ({ i18nKey }) => i18nKey,
}));
vi.mock("react-redux", () => ({ useSelector: () => false }));
vi.mock("../../../db", () => ({
  createFolder: vi.fn(() => Promise.resolve()),
  renameFolder: vi.fn(() => Promise.resolve()),
  setFolderColor: vi.fn(() => Promise.resolve()),
  setFolderIcon: vi.fn(() => Promise.resolve()),
}));

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("TopicEditorModal", () => {
  it("renders as a dialog with the settings title style", async () => {
    render(<TopicEditorModal isOpen onClose={vi.fn()} />);
    const title = await screen.findByText("folders.create_title");
    expect(title.className).toContain("text-base-content");
    expect(title.className).toContain("font-semibold");
    expect(screen.getByText("folders.blurb_examples")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("creates the topic with the trimmed name and closes", async () => {
    const onClose = vi.fn();
    render(<TopicEditorModal isOpen onClose={onClose} />);
    const input = await screen.findByPlaceholderText("folders.name_placeholder");
    fireEvent.change(input, { target: { value: "  Reisen " } });
    fireEvent.click(screen.getByRole("button", { name: "common.create" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(createFolder).toHaveBeenCalledWith("Reisen", expect.any(Object));
  });

  it("hands the new topic id to onCreated, e.g. to move a chat into it", async () => {
    createFolder.mockResolvedValueOnce("topic-9");
    const onCreated = vi.fn();
    const onClose = vi.fn();
    render(<TopicEditorModal isOpen onClose={onClose} onCreated={onCreated} />);
    const input = await screen.findByPlaceholderText("folders.name_placeholder");
    fireEvent.change(input, { target: { value: "Reisen" } });
    fireEvent.click(screen.getByRole("button", { name: "common.create" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onCreated).toHaveBeenCalledWith("topic-9");
  });

  it("offers colours and icons directly and saves the choice", async () => {
    const onClose = vi.fn();
    render(<TopicEditorModal isOpen onClose={onClose} />);
    const input = await screen.findByPlaceholderText("folders.name_placeholder");
    fireEvent.click(screen.getByRole("button", { name: "Violet" }));
    fireEvent.change(input, { target: { value: "Reisen" } });
    fireEvent.click(screen.getByRole("button", { name: "common.create" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(createFolder).toHaveBeenLastCalledWith(
      "Reisen",
      expect.objectContaining({ color: "violet" }),
    );
  });

  it("uses a daisyUI input with the icon preview in the chosen colour", async () => {
    render(<TopicEditorModal isOpen onClose={vi.fn()} />);
    const input = await screen.findByPlaceholderText("folders.name_placeholder");
    const field = input.closest("label");
    expect(field).toHaveClass("input");
    fireEvent.click(screen.getByRole("button", { name: "Violet" }));
    expect(field.querySelector("svg")).toHaveStyle({ color: "#7C3AED" });
  });

  it("edits an existing topic in the same dialog", async () => {
    const onClose = vi.fn();
    render(
      <TopicEditorModal
        isOpen
        onClose={onClose}
        mode="rename"
        folderId="t1"
        initialName="UX Writing"
        initialColor="teal"
        initialIcon="pen"
      />,
    );
    expect(await screen.findByText("folders.edit_title")).toBeInTheDocument();
    expect(screen.queryByText("folders.blurb_examples")).not.toBeInTheDocument();
    const input = screen.getByPlaceholderText("folders.name_placeholder");
    expect(input).toHaveValue("UX Writing");
    expect(screen.getByRole("button", { name: "Teal" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(input, { target: { value: "Texte" } });
    fireEvent.click(screen.getByRole("button", { name: "Violet" }));
    fireEvent.click(screen.getByRole("button", { name: "common.save" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(renameFolder).toHaveBeenCalledWith("t1", "Texte");
    expect(setFolderColor).toHaveBeenCalledWith("t1", "violet");
    expect(setFolderIcon).toHaveBeenCalledWith("t1", "pen");
  });

  it("keeps create disabled until a name is entered", async () => {
    render(<TopicEditorModal isOpen onClose={vi.fn()} />);
    await screen.findByPlaceholderText("folders.name_placeholder");
    expect(screen.getByRole("button", { name: "common.create" })).toBeDisabled();
  });
});
