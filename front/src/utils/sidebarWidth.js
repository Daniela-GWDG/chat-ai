export const SIDEBAR_DEFAULT_WIDTH = 264;
export const SIDEBAR_MIN_WIDTH = 264;
export const SIDEBAR_MAX_WIDTH = 480;

export function clampSidebarWidth(width) {
  return Math.round(
    Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width)),
  );
}

/** Returns a valid width for numeric input, or null when the value is unusable. */
export function parseSidebarWidth(value) {
  const isNumeric =
    typeof value === "number" ||
    (typeof value === "string" && value.trim() !== "");
  const width = isNumeric ? Number(value) : NaN;
  return Number.isFinite(width) ? clampSidebarWidth(width) : null;
}
