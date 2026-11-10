import { useTranslation } from "react-i18next";
import { Folder } from "@carbon/icons-react";
import { SIDEBAR_GHOST_BUTTON } from "../../Others/IconButtons";

export default function NewTopicButton({ onCreateTopic }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onCreateTopic}
      data-guide="create-topic"
      className={SIDEBAR_GHOST_BUTTON}
    >
      <Folder size={20} className="-ml-[5px]" />
      {t("folders.create_button")}
    </button>
  );
}
