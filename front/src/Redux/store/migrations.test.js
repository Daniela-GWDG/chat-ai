import { describe, expect, it } from "vitest";
import { migrations } from "./migrations";

describe("redux migration 8", () => {
  it("expands date buckets and keeps other collapsed sections", () => {
    const state = {
      interface_settings: {
        collapsed_topics: ["t1", "__by_date__:today", "__by_created__:today", "__topics__"],
      },
    };
    migrations[8](state);
    expect(state.interface_settings.collapsed_topics).toEqual(["t1", "__topics__"]);
  });
});
