import { VoiceMode } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";

import Tooltip from "../Others/Tooltip";

export default function SpeechModeButton({ onClick, disabled = false }) {
  const { t } = useTranslation();
  return (
    <Tooltip text={t("conversation.speech_mode_button")}>
      <button
        type="button"
        data-guide="speech-mode"
        className="h-[30px] w-[30px] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onClick}
        disabled={disabled}
        aria-label={t("conversation.speech_mode_button")}
      >
        <VoiceMode size={18} className="text-accent" />
      </button>
    </Tooltip>
  );
}
