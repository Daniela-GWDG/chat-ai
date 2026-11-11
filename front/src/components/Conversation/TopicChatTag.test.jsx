import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("react-redux", () => ({ useSelector: () => false }));
vi.mock("../../db", () => ({
  useFolderList: () => [
    { id: "t1", name: "Reisen", icon: "pen", color: "rose" },
    { id: "t2", name: "Musik", icon: "🎵" },
  ],
}));

import TopicChatTag from "./TopicChatTag";

const renderTag = (folderId) =>
  render(
    <MemoryRouter>
      <TopicChatTag folderId={folderId} />
    </MemoryRouter>,
  );

describe("TopicChatTag", () => {
  it("shows the topic's icon and name as a badge linking to the topic page", () => {
    renderTag("t1");
    const tag = screen.getByTestId("topic-chat-tag");
    expect(tag).toHaveTextContent("Reisen");
    expect(tag).toHaveClass("badge", "bg-base-100", "text-base-content");
    expect(tag.style.borderColor).not.toBe("");
    expect(tag).toHaveAttribute("href", "/topic/t1");
    expect(tag.querySelector("svg")).not.toBeNull();
  });

  it("uses an emoji icon when the topic has one", () => {
    renderTag("t2");
    expect(screen.getByTestId("topic-chat-tag")).toHaveTextContent("🎵Musik");
  });

  it("renders nothing for chats without a (known) topic", () => {
    const { container } = renderTag(null);
    expect(container).toBeEmptyDOMElement();
    renderTag("gone");
    expect(screen.queryByTestId("topic-chat-tag")).toBeNull();
  });
});
