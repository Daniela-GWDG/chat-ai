// Time labels between chat messages, like messengers: "Today, 15:06", "Tuesday, 15:06".

/** Show a new label once this much time has passed since the last one. */
export const TIMESTAMP_GAP_MS = 60 * 60 * 1000;

const isTime = (value) => typeof value === "number" && value > 0;

/**
 * When a user message was sent. The prompt row is created while drafting, so the
 * reply that the send created is the better clock; the message's own time is the fallback.
 */
export function sentAt(messages, index) {
  const next = messages[index + 1];
  if (next?.role === "assistant" && isTime(next.createdAt)) return next.createdAt;
  return isTime(messages[index]?.createdAt) ? messages[index].createdAt : null;
}

/** Indices of the user messages that get a label above them, with their time. */
export function timestampLabels(messages) {
  const labels = new Map();
  let last = null;
  messages.forEach((message, index) => {
    if (message?.role !== "user") return;
    const time = sentAt(messages, index);
    if (time === null) return;
    if (last === null || time - last >= TIMESTAMP_GAP_MS) labels.set(index, time);
    last = time;
  });
  return labels;
}

const startOfDay = (time) => {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const capitalize = (text) => text.charAt(0).toLocaleUpperCase() + text.slice(1);

/** "Heute, 15:06", "Gestern, 15:06", "Dienstag, 15:06" (this week) or "12.11.2026, 15:06". */
export function formatMessageTimestamp(time, language, now = Date.now()) {
  const clock = new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit" }).format(time);
  const days = Math.round((startOfDay(now) - startOfDay(time)) / 86400000);
  let day;
  if (days >= 0 && days <= 1) {
    day = capitalize(new Intl.RelativeTimeFormat(language, { numeric: "auto" }).format(-days, "day"));
  } else if (days > 1 && days < 7) {
    day = new Intl.DateTimeFormat(language, { weekday: "long" }).format(time);
  } else {
    day = new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(time);
  }
  return `${day}, ${clock}`;
}
