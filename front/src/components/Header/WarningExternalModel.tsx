import { Trans } from "react-i18next";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Security, WarningAltFilled } from "@carbon/icons-react";
import { isAgentEnabled } from "../../apis/agentEndpoints";
import { activeMcpServers, hasRemoteMcpServerValue, remoteMcpEnabled } from "../../agent/mcp";
import TooltipBubble from "../Others/TooltipBubble";

/**
 * What may send data outside GWDG: "model" for an external model, "tools" for a
 * switched-on tool that does (web search via the gateway, or MCP with at least
 * one server entered — switching MCP on alone sends nothing), or null.
 */
export function dataRisk(localState) {
  const settings = localState?.settings || {};
  const modelName = settings?.model?.name;
  if (typeof modelName === "string" && modelName.toLowerCase().includes("external")) return "model";

  // The agent does not use the gateway web search; it calls MCP servers itself (agent/mcp.ts)
  const toolsEnabled = !!settings.enable_tools && !isAgentEnabled();
  const tools = settings.tools || {};
  const webSearch =
    toolsEnabled && (settings.enable_web_search || !!tools.web_search || !!tools.fetch_url);
  const localMcp = activeMcpServers(settings).length > 0;
  const remoteMcp = remoteMcpEnabled(settings) && hasRemoteMcpServerValue(settings.mcp_servers);
  return webSearch || localMcp || remoteMcp ? "tools" : null;
}

const isSafeSettings = (localState) => dataRisk(localState) === null;

/** The warning text for a risk; the MPG variant only adds a rule for external models. */
function warningKey(risk, userData) {
  if (risk === "tools") return "alert.data_security_warning_tools";
  return userData?.org === "MPG" ? "alert.data_security_warning_mpg" : "alert.data_security_warning";
}

export function DataSafetyText({ localState, userData }) {
  const risk = dataRisk(localState);
  if (!risk) return null;
  return (
    <div className="bg-warning/10 border border-warning/30 rounded-md text-warning">
      <div className="flex items-center gap-2 p-2 text-sm text-warning select-none">
        <WarningAltFilled size={28} className="shrink-0 text-warning" />
        <Trans i18nKey={warningKey(risk, userData)} />
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

  // The warning opens by itself when data may leave GWDG; a click anywhere
  // else dismisses it (as a click on the button does).
  useEffect(() => {
    if (!(showTextBox && !isSafe)) return undefined;
    const onPointerDown = (event) => {
      if (buttonRef.current?.contains(event.target)) return;
      setShowTextBox(false);
      setSuppressHoverTooltip(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showTextBox, isSafe]);

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
    : warningKey(dataRisk(localState), userData);

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
