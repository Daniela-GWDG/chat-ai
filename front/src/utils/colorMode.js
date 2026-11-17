/**
 * Colour mode of the interface: which colour the controls use. `berry` is the
 * chatai theme's primary/accent (#b4388d); `blue` swaps both to #0178a7 (and a
 * lighter #4fb3dc in dark mode), see `[data-color-mode]` in index.css.
 * Stored as user_settings.color_mode.
 */
export const COLOR_MODES = ["berry", "blue"];
export const DEFAULT_COLOR_MODE = "berry";

/** A valid colour mode, or null for anything else. */
export function parseColorMode(value) {
  return COLOR_MODES.includes(value) ? value : null;
}
