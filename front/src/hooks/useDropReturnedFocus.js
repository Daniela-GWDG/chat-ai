import { useRef } from "react";

/**
 * Dialogs hand focus back to their opener on close, which shows as a focus
 * state after a mouse click. Spread `focusProps` on the opener and call
 * `markOpened(event)` when it opens a dialog; keyboard users keep their focus.
 */
export function useDropReturnedFocus() {
  const dropNextFocus = useRef(false);
  return {
    markOpened: (event) => {
      dropNextFocus.current = event.detail > 0;
    },
    focusProps: {
      onFocus: (event) => {
        if (!dropNextFocus.current) return;
        dropNextFocus.current = false;
        event.currentTarget.blur();
      },
    },
  };
}
