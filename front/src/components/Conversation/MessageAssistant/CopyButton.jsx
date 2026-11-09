import { useState, useCallback, useEffect } from "react";

import { Checkmark, Copy } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import Tooltip from "../../Others/Tooltip";
import { stripThinking } from "../../../utils/thinking";

export default function CopyButton({
  message,
  text,
  title,
  cooldown_ms = 700,
}) {
  const { t } = useTranslation();
  // State to manage copy status
  const [copied, setCopied] = useState(false);

  // Copy function
  const handleCopy = useCallback(async () => {
    try {
      const textToCopy =
        text ?? stripThinking(message?.content?.[0]?.text ?? "");
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, [message, text]);

  // Reset "copied" status after cooldown
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), cooldown_ms);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Tooltip text={title ?? t("common.copy_message")} className="inline-flex">
    <button onClick={handleCopy} aria-label={title ?? t("common.copy_message")} className="inline-grid h-[18px] w-[18px] cursor-pointer">
        {/* Copy: always instant */}
        <Copy
          size={18}
          className={`row-start-1 col-start-1 text-accent transition-opacity ${copied ? 'opacity-0 duration-0' : 'opacity-100 duration-0'}`}
          aria-hidden={copied}
        />
        {/* Checkmark: instant enter, timed leave; stacked above Copy */}
        <Checkmark
          size={18}
          className={`row-start-1 col-start-1 text-success transition-opacity ease-in-out ${copied ? 'opacity-100 duration-0 z-10' : 'opacity-0'}`}
          style={!copied ? { transitionDuration: `${cooldown_ms}ms` } : undefined}
          aria-hidden={!copied}
        />
      
    </button>
    </Tooltip>
  );
}
