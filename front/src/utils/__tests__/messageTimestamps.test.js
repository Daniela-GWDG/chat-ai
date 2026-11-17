import { describe, expect, it } from "vitest";
import { formatMessageTimestamp, sentAt, timestampLabels, TIMESTAMP_GAP_MS } from "../messageTimestamps";

const at = (y, m, d, h, min) => new Date(y, m - 1, d, h, min).getTime();

describe("message timestamps", () => {
  it("takes the send time from the reply the send created", () => {
    const messages = [
      { role: "user", createdAt: 100 },
      { role: "assistant", createdAt: 500 },
    ];
    expect(sentAt(messages, 0)).toBe(500);
    expect(sentAt([{ role: "user", createdAt: 100 }], 0)).toBe(100);
    expect(sentAt([{ role: "user" }], 0)).toBeNull();
  });

  it("labels the first question and every one after an hour's gap", () => {
    const t0 = at(2026, 11, 10, 15, 6);
    const messages = [
      { role: "user" }, { role: "assistant", createdAt: t0 },
      { role: "user" }, { role: "assistant", createdAt: t0 + 10 * 60000 },
      { role: "user" }, { role: "assistant", createdAt: t0 + 10 * 60000 + TIMESTAMP_GAP_MS },
    ];
    expect([...timestampLabels(messages).keys()]).toEqual([0, 4]);
  });

  it("formats today, yesterday, this week and older dates", () => {
    const now = at(2026, 11, 16, 12, 0);
    expect(formatMessageTimestamp(at(2026, 11, 16, 9, 5), "de", now)).toBe("Heute, 09:05");
    expect(formatMessageTimestamp(at(2026, 11, 15, 15, 6), "de", now)).toBe("Gestern, 15:06");
    expect(formatMessageTimestamp(at(2026, 11, 10, 15, 6), "de", now)).toBe("Dienstag, 15:06");
    expect(formatMessageTimestamp(at(2026, 10, 1, 8, 0), "de", now)).toBe("01.10.2026, 08:00");
  });
});
