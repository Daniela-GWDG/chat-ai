import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import BaseModal from "../../../modals/BaseModal";
import { createFolder, renameFolder, setFolderColor, setFolderIcon } from "../../../db";
import { DEFAULT_TOPIC_ICON, topicIconById } from "../topicIcons";
import { TOPIC_COLORS, topicColor } from "../topicColors";
import TopicFields from "./TopicFields";
import { selectDarkMode } from "../../../Redux/reducers/interfaceSettingsSlice";

/** Suggested topics. The icon is half the suggestion, so they travel together. */
const SUGGESTIONS: { key: string; icon: string }[] = [
  { key: "homework", icon: "graduation" },
  { key: "writing", icon: "pen" },
  { key: "health", icon: "stethoscope" },
  { key: "research", icon: "microscope" },
];

export default function TopicEditorModal({
  isOpen,
  onClose,
  mode = "create",
  folderId = null,
  initialName = "",
  initialColor = null,
  initialIcon = null,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "rename";
  folderId?: string | null;
  initialName?: string;
  initialColor?: string | null;
  initialIcon?: string | null;
  /** Runs with the new topic's id after it was created (e.g. to move a chat into it). */
  onCreated?: (folderId: string) => void | Promise<void>;
}) {
  const isRename = mode === "rename";
  const { t } = useTranslation();
  const isDark = useSelector(selectDarkMode);

  const [name, setName] = useState(initialName);
  const [iconId, setIconId] = useState(initialIcon || DEFAULT_TOPIC_ICON.id);
  // A topic without a stored colour shows its derived one, as in the sidebar.
  const [colorId, setColorId] = useState<string>(
    initialColor || (folderId ? topicColor({ id: folderId }).id : TOPIC_COLORS[0].id),
  );
  const submitting = useRef(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isOpen]);

  const applySuggestion = (suggestion: (typeof SUGGESTIONS)[number]) => {
    setName(t(`folders.suggestion_${suggestion.key}`));
    setIconId(suggestion.icon);
    setError("");
    inputRef.current?.focus();
  };

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t("folders.error_required"));
      inputRef.current?.focus();
      return;
    }
    if (submitting.current) return;
    submitting.current = true;
    try {
      if (isRename && folderId) {
        await renameFolder(folderId, trimmed);
        await setFolderColor(folderId, colorId);
        await setFolderIcon(folderId, iconId);
      } else {
        const newFolderId = await createFolder(trimmed, { icon: iconId, color: colorId });
        await onCreated?.(newFolderId);
      }
      onClose();
    } catch {
      setError(t("folders.error_generic"));
    } finally {
      submitting.current = false;
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleKey={isRename ? "folders.edit_title" : "folders.create_title"}
      titleClassName="text-base font-semibold"
      titleColorClassName="text-base-content"
      maxWidth="max-w-md"
      contentClassName="p-0"
    >
      <div className="flex flex-col gap-4 rounded-b-box border-t border-base-300 p-5">
        <p className="text-sm text-base-content">{t("folders.create_blurb")}</p>

        <TopicFields
          name={name}
          onNameChange={(value) => {
            setName(value);
            setError("");
          }}
          colorId={colorId}
          onColorChange={setColorId}
          iconId={iconId}
          onIconChange={setIconId}
          isDark={isDark}
          inputRef={inputRef}
          onEnter={submit}
          afterName={
            !isRename && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-base-content">{t("folders.blurb_examples")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((suggestion) => {
                    const Icon = topicIconById(suggestion.icon).Icon;
                    return (
                      <button
                        key={suggestion.key}
                        type="button"
                        onClick={() => applySuggestion(suggestion)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-pointer
       border border-base-300
       text-xs font-medium text-base-content
       hover:bg-base-200
                                   transition-colors disabled:opacity-50"
                      >
                        <Icon size={16} className="shrink-0 text-base-content/70" />
                        <span className="truncate">
                          {t(`folders.suggestion_${suggestion.key}`)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          }
        />

        {error && (
          <p className="text-xs text-error" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={name.trim().length === 0}
            className="btn btn-accent"
          >
            {isRename ? t("common.save") : t("common.create")}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
