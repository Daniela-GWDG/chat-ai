/**
 * Shared shape of the flyouts that open from the prompt box (model selector,
 * tools, chat settings): same width, the same fixed height (a 32rem list, at
 * most 65dvh, plus the model selector's 129px header) and room below for the
 * FlyoutArrow. Tall enough for the whole tools list without scrolling.
 */
export const PROMPT_FLYOUT_ANCHOR = { to: "top", gap: 14, padding: 8 };

export const PROMPT_FLYOUT_CLASS =
  "z-50 flex h-[calc(min(32rem,65dvh)+129px)] w-[32rem] max-w-[90vw] flex-col !overflow-visible rounded-box border border-base-300 bg-base-100 shadow-lg";
