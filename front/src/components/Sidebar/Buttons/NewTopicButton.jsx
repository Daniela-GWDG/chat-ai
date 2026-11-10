import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Folder } from "@carbon/icons-react";
import { SIDEBAR_GHOST_BUTTON } from "../../Others/IconButtons";

export default function NewTopicButton({ onCreateTopic }) {
  const { t } = useTranslation();
  const buttonRef = useRef(null);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={() => {
        const rect = buttonRef.current?.getBoundingClientRect();
        onCreateTopic({ x: rect?.right ?? 0, y: rect?.top ?? 0 });
      }}
      data-guide="create-topic"
      className={SIDEBAR_GHOST_BUTTON}
    >
      <Folder size={20} className="-ml-[5px]" />
      {t("folders.create_button")}
    </button>
  );
}
