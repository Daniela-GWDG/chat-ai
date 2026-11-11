/** Tooltip text for a sidebar chat row: its summary when there is one, else its title. */
export function conversationTooltip(summary, title) {
  const trimmed = (summary ?? "").trim();
  return trimmed.length > 0 ? trimmed : title;
}
