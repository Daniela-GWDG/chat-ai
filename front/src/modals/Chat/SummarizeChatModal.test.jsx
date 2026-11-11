import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ completions: vi.fn() }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
  Trans: ({ i18nKey }) => i18nKey,
}));
vi.mock("react-redux", () => ({ useSelector: () => 300000 }));
vi.mock("react-router", () => ({ useNavigate: () => vi.fn() }));
vi.mock("../../db", () => ({ createConversation: vi.fn() }));
vi.mock("../../utils/sendMessage", () => ({
  buildConversationForAPI: vi.fn(async (state) => ({ messages: state.messages, settings: {} })),
}));
vi.mock("../../apis/chatCompletions", () => ({ chatCompletions: mocks.completions }));
vi.mock("../BaseModal", () => ({
  default: ({ children, titleClassName, contentClassName }) => (
    <div data-testid="modal" data-title={titleClassName} data-content={contentClassName}>
      {children}
    </div>
  ),
}));

import SummarizeChatModal from "./SummarizeChatModal";

const localState = {
  id: "c1",
  title: "Chat",
  settings: {},
  messages: [
    { role: "system", content: [{ type: "text", text: "sys" }] },
    { role: "user", content: [{ type: "text", text: "hi" }] },
  ],
};

describe("SummarizeChatModal", () => {
  it("uses the shared dialog style with a daisyUI spinner while summarizing", () => {
    mocks.completions.mockImplementation(async function* () {
      await new Promise(() => {}); // never finishes
    });
    render(<SummarizeChatModal isOpen onClose={vi.fn()} localState={localState} />);
    const modal = screen.getByTestId("modal");
    expect(modal.dataset.title).toBe("text-base font-semibold");
    expect(modal.dataset.content).toBe("p-0");
    expect(modal.firstChild).toHaveClass("border-t", "border-base-300", "p-5");
    expect(modal.querySelector(".loading.loading-spinner")).not.toBeNull();
  });

  it("stays open on failure so the error can be read", async () => {
    mocks.completions.mockImplementation(async function* () {
      throw new Error("Upstream down");
    });
    const onClose = vi.fn();
    render(<SummarizeChatModal isOpen onClose={onClose} localState={localState} />);
    expect(await screen.findByText("Upstream down")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("common.summarize_error");
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "common.close" })).toHaveClass("btn-accent");
  });
});
