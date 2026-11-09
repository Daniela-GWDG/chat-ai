import { Trans } from "react-i18next";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Security, WarningAltFilled } from "@carbon/icons-react";
import { isAgentEnabled } from "../../apis/agentEndpoints";
import TooltipBubble from "../Others/TooltipBubble";

function isSafeSettings(localState) {
  const modelName = localState?.settings?.model?.name;
  const isExternalModel =
    typeof modelName === "string" &&
    modelName.toLowerCase().includes("external");

  // The agent does not use the gateway web search; it calls MCP servers itself (agent/mcp.ts)
  const toolsEnabled = !!localState?.settings?.enable_tools && !isAgentEnabled();
  const tools = localState?.settings?.tools || {};

  // Web search should only trigger warnings when the toolset is active
  const webSearchEnabled =
    toolsEnabled &&
    (localState?.settings?.enable_web_search ||
      !!tools.web_search ||
      !!tools.fetch_url);

  const mcpEnabled = !!(tools.mcp || tools.mcp_remote);

  return !(isExternalModel || webSearchEnabled || mcpEnabled);
}

export function DataSafetyText({ localState, userData }) {
  const isSafe = isSafeSettings(localState);
  if(isSafe) return null;
  return (
    <div className="bg-warning/10 border border-warning/30 rounded-md text-warning">
      <div className="flex items-center gap-2 p-2 text-sm text-warning select-none">
        <WarningAltFilled size={28} className="shrink-0 text-warning" />
        <Trans
        i18nKey={
            userData?.org === "MPG"
            ? "alert.data_security_warning_mpg"
            : "alert.data_security_warning"
        }
        />
      </div>
    </div>
  );
}

/** Everything the two states differ by — colours, icon and message. */
const TONES = {
  safe: {
    Icon: Security,
    button:
      `bg-success/10 hover:bg-success/20 border-success/30 text-success`,
  },
  warning: {
    Icon: WarningAltFilled,
    button:
      `bg-warning/10 hover:bg-warning/20 border-warning/30 text-warning`,
  },
};

export default function WarningExternalModel({
  localState,
  userData,
  // Smaller trigger, so the button fits a toolbar row of 24px icons.
  compact = false,
}) {
  // Add safety check for model
  const isSafe = isSafeSettings(localState);

  useEffect(() => {
    setShowTextBox(true);
    setSuppressHoverTooltip(false);
  }, [isSafe]);

  const [showTextBox, setShowTextBox] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [suppressHoverTooltip, setSuppressHoverTooltip] = useState(false);
  const isPopoverVisible = (showTextBox && !isSafe) || (isHovering && !suppressHoverTooltip);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [buttonRect, setButtonRect] = useState(null);

  // Keep the bubble pinned to its button.
  const measure = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { top, left, width, height } = rect;
    setButtonRect({ top, left, width, height });
  }, []);

  useLayoutEffect(() => {
    if (!isPopoverVisible) return;
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [isPopoverVisible, measure]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (suppressHoverTooltip) {
      setSuppressHoverTooltip(false);
    }
  };

  const handleToggleButton = () => {
    // Dismissing an open warning must also hide it while the pointer is still here.
    setSuppressHoverTooltip(showTextBox && !isSafe);
    setShowTextBox((prev) => !prev);
  };

  const tone = isSafe ? TONES.safe : TONES.warning;
  const ToneIcon = tone.Icon;
  const messageKey = isSafe
    ? "alert.data_security_notice"
    : userData?.org === "MPG"
      ? "alert.data_security_warning_mpg"
      : "alert.data_security_warning";

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        ref={buttonRef}
        onClick={handleToggleButton}
        onFocus={() => setSuppressHoverTooltip(false)}
        className={`flex items-center justify-center gap-2 relative border
                    rounded-full text-sm font-medium transition-colors cursor-pointer
                    ${compact ? "h-8 w-8 p-1.5" : "h-10 w-10 px-2 py-1"}
                    ${tone.button}`}
      >
        <ToneIcon size={compact ? 18 : 24} />
      </button>

      {isPopoverVisible && (
        // The mobile header sits at the top edge near the right side, so its
        // bubble opens downwards and aligns to the button's right edge.
        <TooltipBubble
          rect={buttonRect}
          placement={compact ? "top" : "bottom"}
          align={compact ? undefined : "end"}
        >
          <Trans i18nKey={messageKey} />
        </TooltipBubble>
      )}
    </div>
  );
}
