import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PromptTextArea from "../PromptTextArea";

vi.mock("../../../hooks/useToast", () => ({
  useToast: () => ({ notifySuccess: vi.fn(), notifyError: vi.fn() }),
}));
vi.mock("../../../hooks/useSendWithEnter", () => ({
  useSendWithEnter: () => true,
}));
vi.mock("../../../hooks/useAttachments", () => ({
  useAttachments: () => ({ addAttachments: vi.fn(), pasteAttachments: vi.fn() }),
}));
vi.mock("../ClearButton", () => ({ default: () => null }));

const renderTextArea = (prompt) =>
  render(
    <PromptTextArea
      localState={{ messages: [{ content: [{ text: prompt }] }] }}
      setLocalState={vi.fn()}
      handleSend={vi.fn()}
      handleChange={vi.fn()}
      prompt={prompt}
      placeholder="Ask me"
    />,
  );

describe("PromptTextArea", () => {
  beforeAll(() => {
    window.matchMedia ??= () => ({ matches: true });
  });

  it("never scrolls while empty", () => {
    renderTextArea("");
    const textarea = screen.getByPlaceholderText("Ask me");
    expect(textarea).toHaveClass("overflow-y-hidden");
    expect(textarea).not.toHaveClass("overflow-y-auto");
  });

  it("can scroll once it has content", () => {
    renderTextArea("some text");
    const textarea = screen.getByPlaceholderText("Ask me");
    expect(textarea).toHaveClass("overflow-y-auto");
    expect(textarea).not.toHaveClass("overflow-y-hidden");
  });
});
