import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRevealTopic } from "./useRevealTopic";
import reducer, { expandTopics } from "../Redux/reducers/interfaceSettingsSlice";
import { PINNED_TOPIC_ID, TOPICS_SECTION_ID } from "../components/Sidebar/TopicList";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  folders: [{ id: "t1" }, { id: "t2", pinned: true }],
}));

vi.mock("react-redux", async (importOriginal) => ({
  ...(await importOriginal()),
  useDispatch: () => mocks.dispatch,
}));
vi.mock("../db", () => ({ useFolderList: () => mocks.folders }));

describe("useRevealTopic", () => {
  beforeEach(() => mocks.dispatch.mockClear());

  it("expands a topic and the Themen section", () => {
    const { result } = renderHook(() => useRevealTopic());
    result.current("t1");
    expect(mocks.dispatch).toHaveBeenCalledWith(expandTopics(["t1", TOPICS_SECTION_ID]));
  });

  it("expands a pinned topic and the pinned section", () => {
    const { result } = renderHook(() => useRevealTopic());
    result.current("t2");
    expect(mocks.dispatch).toHaveBeenCalledWith(expandTopics(["t2", PINNED_TOPIC_ID]));
  });

  it("ignores chats without a topic", () => {
    const { result } = renderHook(() => useRevealTopic());
    result.current(null);
    expect(mocks.dispatch).not.toHaveBeenCalled();
  });
});

describe("expandTopics", () => {
  it("removes only the given ids from the collapsed list", () => {
    const state = reducer(undefined, { type: "init" });
    const next = reducer(
      { ...state, collapsed_topics: ["t1", "t2", TOPICS_SECTION_ID] },
      expandTopics(["t1", TOPICS_SECTION_ID]),
    );
    expect(next.collapsed_topics).toEqual(["t2"]);
  });
});
