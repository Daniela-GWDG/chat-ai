const BASE =
  "flex shrink-0 items-center justify-center rounded-full cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50";

function createIconButton(variantClasses) {
  return function IconButton({ className = "", ...props }) {
    return (
      <button
        type="button"
        className={`${BASE} ${variantClasses} ${className}`}
        {...props}
      />
    );
  };
}

/** Sidebar actions and the theme toggle. Use with size 20 icons. */
/** Extra classes for SortIconButton inside a sidebar row, whose own hover is base-200. */
export const ROW_ACTION_BUTTON = "-my-1.5 [&:hover]:bg-base-300";

/** Sidebar text button: daisyUI ghost with the same grey hover as the sidebar rows. */
export const SIDEBAR_GHOST_BUTTON =
  "btn btn-ghost -ml-1 hover:bg-base-200 hover:border-transparent";

const NAV_ICON_VARIANT = "h-10 w-10 text-accent hover:bg-accent/10";

export const NavIconButton = createIconButton(NAV_ICON_VARIANT);

/** NavIconButton's classes, for buttons rendered by another component (e.g. a Headless UI trigger). */
export const NAV_ICON_BUTTON_CLASS = `${BASE} ${NAV_ICON_VARIANT}`;

/** A dialog's close button: Nav size, colored by the dialog title. */
export const CloseIconButton = createIconButton("h-10 w-10 hover:bg-base-200");

/** The sorting and organizing row above the chat list. Use with size 18 icons. */
export const SortIconButton = createIconButton(
  "h-8 w-8 text-base-content/70 hover:bg-base-200 hover:text-base-content",
);

/** The toolbar inside the prompt box. Use with size 18 icons. */
export const PromptIconButton = createIconButton("h-8 w-8 text-accent hover:bg-accent/10");
