import { beforeEach, describe, expect, it } from "vitest";
import {
  assignConversationToFolder,
  createConversation,
  createFolder,
  db,
  ensureFolder,
  getConversation,
  getConversationMeta,
  loadFile,
  setConversationPinned,
  saveFileReady,
  listRecentConversations,
  searchConversations,
  searchMessages,
  updateConversation,
} from "../index";

const settings = {
  model: { id: "test-model", name: "Test Model" },
  temperature: 0.5,
  top_p: 0.5,
  tools: {},
};

const clearDB = () =>
  db.transaction(
    "rw",
    [db.conversations, db.messages, db.content_items, db.files_meta, db.files_data, db.folders],
    async () => {
      await Promise.all([
        db.conversations.clear(),
        db.messages.clear(),
        db.content_items.clear(),
        db.files_meta.clear(),
        db.files_data.clear(),
        db.folders.clear(),
      ]);
    },
  );

describe("conversation persistence", () => {
  beforeEach(async () => {
    await clearDB();
  });

  it("creates and hydrates a conversation", async () => {
    await createConversation({
      id: "chat-1",
      title: "Hello",
      settings,
      messages: [
        {
          idx: 0,
          role: "user",
          content: [{ type: "text", text: "hello world" }],
        },
      ],
    });

    const conversation = await getConversation("chat-1");
    expect(conversation.title).toBe("Hello");
    expect(conversation.messages[0].content[0].text).toBe("hello world");
  });

  it("rejects stale writes and accepts current lastModified", async () => {
    await createConversation({
      id: "chat-1",
      title: "Old",
      settings,
      messages: [],
    });
    const meta = await getConversationMeta("chat-1");

    const stale = await updateConversation("chat-1", {
      title: "Stale",
      settings,
      messages: [],
      lastModified: meta.lastModified - 1,
    });
    expect(stale).toBe(-1);

    const current = await updateConversation("chat-1", {
      title: "New",
      settings,
      messages: [],
      lastModified: meta.lastModified,
    });
    expect(current).not.toBe(-1);
    expect((await getConversationMeta("chat-1")).title).toBe("New");
  });

  it("searches message contents", async () => {
    await createConversation({
      id: "chat-1",
      title: "Search",
      settings,
      messages: [
        {
          idx: 0,
          role: "user",
          content: [{ type: "text", text: "needle in a haystack" }],
        },
      ],
    });

    const results = await searchMessages("needle");
    expect(results.some((match) => match.conversationId === "chat-1")).toBe(true);
  });

  describe("chat search", () => {
    const text = (value) => [{ type: "text", text: value }];
    const addChat = (id, title, value) =>
      createConversation({
        id,
        title,
        settings,
        messages: value ? [{ idx: 0, role: "user", content: text(value) }] : [],
      });

    it("matches word parts in titles and messages, titles first", async () => {
      await addChat("message-hit", "Connected Consumables", "In Krankenhäusern laufen viele Prozesse");
      await addChat("title-hit", "Krankentransport prüfen");
      await addChat("miss", "Reisen", "Nichts davon");

      const results = await searchConversations("KRANKEN");
      expect(results.map((result) => result.conversationId)).toEqual([
        "title-hit",
        "message-hit",
      ]);
      expect(results[0]).toMatchObject({ snippet: "", messageId: null });
      expect(results[1].snippet).toContain("Krankenhäusern");
      expect(results[1].messageId).toBeTruthy();
    });

    it("returns one result per chat and short context around the match", async () => {
      await createConversation({
        id: "chat-1",
        title: "Long",
        settings,
        messages: [
          { idx: 0, role: "user", content: text(`${"a ".repeat(100)}needle one`) },
          { idx: 1, role: "assistant", content: text("needle two") },
        ],
      });

      const results = await searchConversations("needle");
      expect(results).toHaveLength(1);
      expect(results[0].snippet.indexOf("needle")).toBeLessThan(30);
    });

    it("ignores blank queries and the Meta chat", async () => {
      await createConversation({
        id: "meta-chat",
        title: "needle",
        isMetaChat: true,
        settings,
        messages: [],
      });
      expect(await searchConversations("   ")).toEqual([]);
      expect(await searchConversations("needle")).toEqual([]);
      expect(await listRecentConversations()).toEqual([]);
    });

    it("lists the most recent chats up to the limit", async () => {
      await addChat("older", "Older");
      await addChat("newer", "Newer");
      await db.conversations.update("older", { lastOpenedAt: 1 });
      await db.conversations.update("newer", { lastOpenedAt: 2 });

      const results = await listRecentConversations(1);
      expect(results.map((result) => result.conversationId)).toEqual(["newer"]);
    });
  });

  it("creates topics once and assigns conversations", async () => {
    await createConversation({ id: "chat-1", title: "Chat", settings, messages: [] });
    const folderId = await createFolder("Work");
    const sameId = await ensureFolder("Work");

    expect(sameId).toBe(folderId);
    await assignConversationToFolder("chat-1", folderId);
    expect((await getConversationMeta("chat-1")).folderId).toBe(folderId);
  });

  it("keeps a chat in its topic when it is pinned and unpinned", async () => {
    await createConversation({ id: "chat-p", title: "Chat", settings, messages: [] });
    const folderId = await createFolder("Work");
    await assignConversationToFolder("chat-p", folderId);

    await setConversationPinned("chat-p", true);
    await setConversationPinned("chat-p", false);
    const row = await db.conversations.get("chat-p");
    expect(row.pinned).toBe(false);
    expect(row.folderId).toBe(folderId);
  });

  it("stores and loads file bytes", async () => {
    await createConversation({ id: "chat-1", title: "Files", settings, messages: [] });
    const bytes = new Uint8Array([137, 80, 78, 71]);
    const fileId = await saveFileReady(
      "chat-1",
      new File([bytes], "image.png", { type: "image/png" }),
    );

    const file = await loadFile(fileId);
    expect(file.name).toBe("image.png");
    expect(file.type).toBe("image/png");
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(bytes);
  });
});
