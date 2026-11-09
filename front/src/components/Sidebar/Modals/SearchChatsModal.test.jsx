import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchChatsModal from "./SearchChatsModal";
import { listRecentConversations, searchConversations } from "../../../db";

vi.mock("../../../db", () => ({
  listRecentConversations: vi.fn(),
  searchConversations: vi.fn(),
}));

const recentChat = {
  conversationId: "recent",
  title: "Recent chat",
  lastModified: 1,
  snippet: "",
  messageId: null,
};
const hit = {
  conversationId: "hit",
  title: "Krankentransport prüfen",
  lastModified: 2,
  snippet: "…die Krankenkasse zahlt…",
  messageId: "message-1",
};

const onClose = vi.fn();
const onSelect = vi.fn();
const setup = () => render(<SearchChatsModal isOpen onClose={onClose} onSelect={onSelect} />);
const typeQuery = (value) =>
  fireEvent.change(screen.getByPlaceholderText(/search chats/i), { target: { value } });

describe("SearchChatsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listRecentConversations.mockResolvedValue([recentChat]);
    searchConversations.mockResolvedValue([hit]);
  });

  it("lists recent chats before anything is typed", async () => {
    setup();
    expect(await screen.findByText("Recent chat")).toBeInTheDocument();
    expect(searchConversations).not.toHaveBeenCalled();
  });

  it("replaces the list with highlighted results while typing", async () => {
    setup();
    await screen.findByText("Recent chat");
    typeQuery("kranken");
    expect(await screen.findByText("transport prüfen", { exact: false })).toBeInTheDocument();
    expect(searchConversations).toHaveBeenCalledWith("kranken");
    expect(screen.queryByText("Recent chat")).not.toBeInTheDocument();
    for (const match of screen.getAllByText("Kranken")) {
      expect(match).toHaveClass("font-medium");
    }
  });

  it("opens the matching message and closes the dialog", async () => {
    setup();
    await screen.findByText("Recent chat");
    typeQuery("kranken");
    fireEvent.click(await screen.findByRole("button", { name: /transport/ }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("hit", "message-1");
  });

  it("reports when nothing matches and returns to the recent list when cleared", async () => {
    searchConversations.mockResolvedValue([]);
    setup();
    await screen.findByText("Recent chat");
    typeQuery("nothing");
    await waitFor(() =>
      expect(screen.getByText(/no matches/i)).toBeInTheDocument(),
    );
    typeQuery("");
    expect(await screen.findByText("Recent chat")).toBeInTheDocument();
  });
});
