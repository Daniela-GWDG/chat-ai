import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Tools } from "@carbon/icons-react";
import Tooltip from "../Others/Tooltip";
import { isAgentEnabled } from "../../apis/agentEndpoints";
import { PromptIconButton } from "../Others/IconButtons";
import ToolsPanel from "./ToolsPanel";
import { useFolderAccessPrompt } from "../../hooks/useFolderAccessPrompt";
import FlyoutArrow from "../Others/FlyoutArrow";
import { PROMPT_FLYOUT_ANCHOR, PROMPT_FLYOUT_CLASS } from "../Others/promptFlyout";

const FLYOUT_WIDTH = 512; // w-[32rem]
const VIEWPORT_PADDING = PROMPT_FLYOUT_ANCHOR.padding;

/** A dialog (help, web search disclaimer, …) is open on top of the page. */
const dialogOpen = () => !!document.querySelector('[role="dialog"]');

/**
 * One tools button for the prompt box. Its flyout holds the GWDG tools
 * (VITE_MODULE_TOOLS) and the agent's browser & local tools (VITE_MODULE_AGENT);
 * a section is left out when its module is off, the button when both are.
 *
 * Unlike the other prompt flyouts this one is not a Headless UI Popover: that
 * closes on any outside click, including opening a dialog from inside it, and
 * loses where the user was. Here outside clicks and Escape are ignored while a
 * dialog is open, so the flyout stays put on the same level.
 */
export default function ToolsButton({ localState, setLocalState }) {
  const { t } = useTranslation();
  const toolsModule = import.meta.env.VITE_MODULE_TOOLS === "true";
  const agent = isAgentEnabled();
  // The agent's folder-access dialog must be registered even while the flyout is closed.
  useFolderAccessPrompt();
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const close = useCallback(() => setOpen(false), []);

  // Above the button, centred on it, kept inside the viewport.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(FLYOUT_WIDTH, window.innerWidth * 0.9);
      const centred = rect.left + rect.width / 2 - width / 2;
      const left = Math.max(VIEWPORT_PADDING, Math.min(centred, window.innerWidth - VIEWPORT_PADDING - width));
      setPosition({ left, bottom: window.innerHeight - rect.top + PROMPT_FLYOUT_ANCHOR.gap });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (dialogOpen()) return;
      if (panelRef.current?.contains(event.target) || buttonRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape" || dialogOpen()) return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    // pointerdown, not mousedown: Headless UI buttons (model selector, chat
    // settings) cancel the mousedown, so opening them would leave this open.
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // The agent always has tools to choose from
  if (!toolsModule && !agent) return null;

  return (
    <div className="relative flex">
      <Tooltip text={t("settings.tools_menu")}>
        <PromptIconButton
          ref={buttonRef}
          data-guide="tools"
          aria-label={t("settings.tools_menu")}
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen((value) => !value)}
        >
          <Tools size={18} className="cursor-pointer text-accent" />
        </PromptIconButton>
      </Tooltip>

      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            className={`fixed ${PROMPT_FLYOUT_CLASS}`}
            style={{ left: position.left, bottom: position.bottom }}
            data-guide="tools-flyout"
          >
            <FlyoutArrow side="bottom" targetRef={buttonRef} />
            <ToolsPanel
              localState={localState}
              setLocalState={setLocalState}
              close={close}
              showGwdg={toolsModule || agent}
              showLocal={agent}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
