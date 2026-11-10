import type { FolderRow } from "../../db/dbTypes";

/**
 * Topic colours.
 *
 * A topic's colour is the only chromatic signal in an otherwise near-achromatic
 * sidebar, so the eight hues are spaced far enough apart to stay distinct at an
 * 8px dot, and kept clear of the accent blue so a colour tag never reads as
 * "selected".
 *
 * A topic without an explicit colour gets one derived from its id, so topics
 * created before this field existed still look intentional and keep the same
 * colour on every render and every device — no backfill required.
 */
export type TopicColorId =
  | "rose"
  | "orange"
  | "amber"
  | "emerald"
  | "teal"
  | "cyan"
  | "violet"
  | "fuchsia";

export const TOPIC_COLORS: { id: TopicColorId; label: string; hex: string; darkHex: string }[] = [
  { id: "rose", label: "Rose", hex: "#E11D48", darkHex: "#FB7185" },
  { id: "orange", label: "Orange", hex: "#EA580C", darkHex: "#FB923C" },
  { id: "amber", label: "Amber", hex: "#D97706", darkHex: "#FBBF24" },
  { id: "emerald", label: "Emerald", hex: "#059669", darkHex: "#34D399" },
  { id: "teal", label: "Teal", hex: "#0D9488", darkHex: "#2DD4BF" },
  { id: "cyan", label: "Cyan", hex: "#0891B2", darkHex: "#22D3EE" },
  { id: "violet", label: "Violet", hex: "#7C3AED", darkHex: "#A78BFA" },
  { id: "fuchsia", label: "Fuchsia", hex: "#C026D3", darkHex: "#E879F9" },
];

const BY_ID = new Map(TOPIC_COLORS.map((c) => [c.id, c]));

/** Resolve a colour by id, falling back to the first swatch. */
export function topicColorById(id?: string | null) {
  return (id && BY_ID.get(id as TopicColorId)) || TOPIC_COLORS[0];
}

/** The swatch colour for the active theme; the saturated hues are too dark on dark. */
export function topicHex(color: { hex: string; darkHex: string }, isDark: boolean) {
  return isDark ? color.darkHex : color.hex;
}

/** Stable, order-independent index so a topic keeps its colour forever. */
function hashToIndex(seed: string, buckets: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % buckets;
}

export function topicColor(topic: Pick<FolderRow, "id" | "color">) {
  const explicit = topic?.color
    ? BY_ID.get(topic.color as TopicColorId)
    : undefined;
  if (explicit) return explicit;
  return TOPIC_COLORS[hashToIndex(topic?.id ?? "", TOPIC_COLORS.length)];
}

/** `#RRGGBB` -> `rgba(r, g, b, a)`, for tints that must sit on either theme. */
export function withAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Background wash for a topic row while it is a drop target. */
export function topicTint(hex: string, isDark: boolean) {
  return withAlpha(hex, isDark ? 0.22 : 0.14);
}
