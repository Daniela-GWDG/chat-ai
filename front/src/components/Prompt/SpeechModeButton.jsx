import { VoiceMode } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";

import Tooltip from "../Others/Tooltip";
import { PromptIconButton } from "../Others/IconButtons";

export default function SpeechModeButton({ onClick, disabled = false }) {
  const { t } = useTranslation();
  return (
    <Tooltip text={t("conversation.speech_mode_button")}>
      <PromptIconButton
        type="button"
        data-guide="speech-mode"
        onClick={onClick}
        disabled={disabled}
        aria-label={t("conversation.speech_mode_button")}
      >
        <VoiceMode size={18} className="text-accent" />
      </PromptIconButton>
    </Tooltip>
  );
}
