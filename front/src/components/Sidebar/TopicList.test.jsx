import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TopicList, { UNSORTED_TOPIC_ID } from "./TopicList";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("react-redux", () => ({ useDispatch: () => vi.fn(), useSelector: () => [] }));
vi.mock("react-router", () => ({ useLocation: () => ({ pathname: "/" }) }));
vi.mock("../../modals/ModalContext", () => ({ useModal: () => ({ openModal: vi.fn() }) }));

const makeProps = (overrides = {}) => ({
  topics: [],
  pinnedTopics: [],
  pinnedConversations: [],
  conversationsByTopic: new Map(),
  unsortedConversations: [{ id: "c1", title: "Loose chat" }],
  onRenameTopic: vi.fn(),
  onDeleteTopic: vi.fn(),
  onToggleTopicPinned: vi.fn(),
  onOpenTopic: vi.fn(),
  draggingConversationId: null,
  dragOverTopicId: null,
  onDragEnterTopic: vi.fn(),
  onDragLeaveTopic: vi.fn(),
  onDropTopic: vi.fn(),
  renderConversationRow: (conv) => <div key={conv.id}>{conv.title}</div>,
  dateGroups: [],
  creationDateGroups: [],
  isDark: false,
  grouping: "topic",
  ...overrides,
});

describe("TopicList", () => {
  it("shows the chats under a Chats header with the sort actions inline", () => {
    render(
      <TopicList {...makeProps({ sortActions: <button type="button">sort</button> })} />,
    );
    const header = screen.getByText("folders.title").parentElement;
    expect(within(header).getByRole("button", { name: "sort" })).toBeInTheDocument();
    expect(screen.getByText("Loose chat")).toBeInTheDocument();
    expect(screen.queryByText("folders.uncategorized")).not.toBeInTheDocument();
  });

  it("does not open the chat overview when a sort action is clicked", () => {
    const props = makeProps({ sortActions: <button type="button">sort</button> });
    render(<TopicList {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "sort" }));
    expect(props.onOpenTopic).not.toHaveBeenCalled();
  });

  it("keeps the sort actions reachable when grouped by date", () => {
    render(
      <TopicList
        {...makeProps({ grouping: "date", sortActions: <button type="button">sort</button> })}
      />,
    );
    expect(screen.getByRole("button", { name: "sort" })).toBeInTheDocument();
  });

  it("runs rows with a chevron to the sidebar edge without radius", () => {
    render(<TopicList {...makeProps()} />);
    const row = screen.getByText("folders.title").parentElement;
    expect(row).toHaveClass("-mx-2");
    expect(row).not.toHaveClass("rounded-lg");
  });

  it("hides the pinned section when nothing is pinned", () => {
    const { container, rerender } = render(<TopicList {...makeProps()} />);
    expect(container.querySelector('[data-guide="pinned-chats"]')).toBeNull();
    rerender(
      <TopicList
        {...makeProps({ pinnedConversations: [{ id: "c2", title: "Pinned chat" }] })}
      />,
    );
    expect(container.querySelector('[data-guide="pinned-chats"]')).not.toBeNull();
  });

  it("still accepts dropped chats on the Chats section", () => {
    const props = makeProps({ draggingConversationId: "c9" });
    render(<TopicList {...props} />);
    fireEvent.drop(screen.getByText("folders.title").closest(".group"));
    expect(props.onDropTopic).toHaveBeenCalledWith(UNSORTED_TOPIC_ID);
  });
});
