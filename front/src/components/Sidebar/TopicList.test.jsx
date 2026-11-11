import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TopicList, { PINNED_TOPIC_ID, TOPICS_SECTION_ID, UNSORTED_TOPIC_ID } from "./TopicList";
import { toggleTopic } from "../../Redux/reducers/interfaceSettingsSlice";

const redux = vi.hoisted(() => ({ dispatch: vi.fn(), collapsed: [], pathname: "/" }));

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key) => key }) }));
vi.mock("react-redux", async (importOriginal) => ({
  ...(await importOriginal()),
  useDispatch: () => redux.dispatch,
  useSelector: () => redux.collapsed,
}));
vi.mock("react-router", () => ({ useLocation: () => ({ pathname: redux.pathname }) }));
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
  onNewChatInTopic: vi.fn(),
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
    redux.dispatch.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "sort" }));
    expect(props.onOpenTopic).not.toHaveBeenCalled();
    expect(redux.dispatch).not.toHaveBeenCalled();
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

  it("folds the Chats section when its row is clicked", () => {
    const props = makeProps();
    render(<TopicList {...props} />);
    redux.dispatch.mockClear();
    const row = screen.getByText("folders.title").parentElement;
    expect(row).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(row);
    expect(redux.dispatch).toHaveBeenCalledWith(toggleTopic(UNSORTED_TOPIC_ID));
    expect(props.onOpenTopic).not.toHaveBeenCalled();
  });

  it("keeps topics above and groups only the Chats section by date", () => {
    const loose = { id: "c1", title: "Loose chat" };
    render(
      <TopicList
        {...makeProps({
          grouping: "date",
          topics: [{ id: "t1", name: "UX Writing" }],
          unsortedConversations: [loose],
          dateGroups: [{ key: "today", conversations: [loose] }],
        })}
      />,
    );
    const topic = screen.getByText("UX Writing");
    const bucket = screen.getByText("folders.dateBuckets.today");
    const chats = screen.getByText("folders.title");
    expect(topic.compareDocumentPosition(chats) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(chats.compareDocumentPosition(bucket) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText("Loose chat")).toBeInTheDocument();

    const bucketRow = bucket.closest('[role="button"]');
    expect(bucketRow).toHaveAttribute("aria-expanded", "true");
    expect(bucketRow.firstElementChild.tagName.toLowerCase()).toBe("svg");
    expect(bucket).toHaveClass("font-medium");
    expect(bucket).not.toHaveClass("uppercase");
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

  describe("pinned section", () => {
    const pinned = { pinnedConversations: [{ id: "c2", title: "Pinned chat" }] };

    beforeEach(() => {
      redux.collapsed = [];
      redux.dispatch.mockClear();
    });

    it("has a header like the Chats section, with a count and no pin icon", () => {
      render(<TopicList {...makeProps(pinned)} />);
      const header = screen.getByRole("button", { name: /folders\.pinned/ });
      expect(header).toHaveAttribute("aria-expanded", "true");
      expect(header).toHaveTextContent("1");
      expect(header).toHaveClass("-mx-2");
      expect(screen.getByText("Pinned chat")).toBeInTheDocument();
    });

    it("lists pinned chats without a line or forced timestamp", () => {
      const renderConversationRow = vi.fn((conv) => <div key={conv.id}>{conv.title}</div>);
      render(<TopicList {...makeProps({ ...pinned, renderConversationRow })} />);
      expect(renderConversationRow).toHaveBeenCalledWith(pinned.pinnedConversations[0]);
      expect(screen.getByText("Pinned chat").parentElement).not.toHaveClass("border-l");
    });

    it("toggles when the header is clicked", () => {
      render(<TopicList {...makeProps(pinned)} />);
      fireEvent.click(screen.getByRole("button", { name: /folders\.pinned/ }));
      expect(redux.dispatch).toHaveBeenCalledWith(toggleTopic(PINNED_TOPIC_ID));
    });

    it("hides its entries when collapsed", () => {
      redux.collapsed = [PINNED_TOPIC_ID];
      render(<TopicList {...makeProps(pinned)} />);
      expect(screen.getByRole("button", { name: /folders\.pinned/ })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(screen.queryByText("Pinned chat")).not.toBeInTheDocument();
    });
  });

  describe("topics section", () => {
    const withTopic = { topics: [{ id: "t1", name: "UX Writing" }] };

    beforeEach(() => {
      redux.collapsed = [];
      redux.dispatch.mockClear();
    });

    it("groups topics under a collapsible header with a count", () => {
      render(<TopicList {...makeProps(withTopic)} />);
      const header = screen.getByRole("button", { name: /folders\.topics_section/ });
      expect(header).toHaveTextContent("1");
      fireEvent.click(header);
      expect(redux.dispatch).toHaveBeenCalledWith(toggleTopic(TOPICS_SECTION_ID));
    });

    it("shows no chat count on a topic row", () => {
      render(
        <TopicList
          {...makeProps({
            ...withTopic,
            conversationsByTopic: new Map([["t1", [{ id: "a", title: "A" }, { id: "b", title: "B" }]]]),
          })}
        />,
      );
      const row = screen.getByText("UX Writing").parentElement;
      expect(row).not.toHaveTextContent("2");
    });

    it("hides the header when there are no topics", () => {
      render(<TopicList {...makeProps()} />);
      expect(screen.queryByText("folders.topics_section")).not.toBeInTheDocument();
    });

    it("hides topics when the section is collapsed", () => {
      redux.collapsed = [TOPICS_SECTION_ID];
      render(<TopicList {...makeProps(withTopic)} />);
      expect(screen.queryByText("UX Writing")).not.toBeInTheDocument();
    });

    it("adds no space below an empty expanded topic", () => {
      render(<TopicList {...makeProps(withTopic)} />);
      const row = screen.getByText("UX Writing").parentElement;
      expect(row.nextElementSibling).toBeNull();
    });

    it("indents topic rows under the section headings", () => {
      render(<TopicList {...makeProps(withTopic)} />);
      const topicRow = screen.getByText("UX Writing").parentElement;
      expect(topicRow).toHaveClass("ml-[18px]", "rounded-lg");
      expect(topicRow).not.toHaveClass("-mx-2");
      expect(screen.getByText("folders.title").parentElement).toHaveClass("-mx-2");
    });

    it("selects a topic by clicking the row without toggling it", () => {
      const props = makeProps(withTopic);
      render(<TopicList {...props} />);
      fireEvent.click(screen.getByText("UX Writing"));
      expect(props.onOpenTopic).toHaveBeenCalledWith("t1");
      expect(redux.dispatch).not.toHaveBeenCalled();
    });

    it("toggles only through the icon control", () => {
      const props = makeProps(withTopic);
      render(<TopicList {...props} />);
      const row = screen.getByText("UX Writing").parentElement;
      fireEvent.click(within(row).getByLabelText("folders.collapse_topic"));
      expect(redux.dispatch).toHaveBeenCalledWith(toggleTopic("t1"));
      expect(props.onOpenTopic).not.toHaveBeenCalled();
    });

    it("starts a new chat in the topic from the inline button", () => {
      const props = makeProps(withTopic);
      render(<TopicList {...props} />);
      fireEvent.click(screen.getByLabelText("folders.new_chat_in_topic"));
      expect(props.onNewChatInTopic).toHaveBeenCalledWith("t1");
      expect(props.onOpenTopic).not.toHaveBeenCalled();
    });

    it("shows the inline actions while the topic is selected", () => {
      redux.pathname = "/topic/t1";
      render(<TopicList {...makeProps(withTopic)} />);
      expect(screen.getByLabelText("folders.new_chat_in_topic")).toHaveClass("opacity-100");
      expect(screen.getByLabelText("folders.topic_options")).toHaveClass("opacity-100");
      redux.pathname = "/";
    });
  });

  it("still accepts dropped chats on the Chats section", () => {
    const props = makeProps({ draggingConversationId: "c9" });
    render(<TopicList {...props} />);
    fireEvent.drop(screen.getByText("folders.title").closest(".group"));
    expect(props.onDropTopic).toHaveBeenCalledWith(UNSORTED_TOPIC_ID);
  });
});
