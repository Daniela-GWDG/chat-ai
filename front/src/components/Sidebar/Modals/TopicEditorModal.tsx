import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Checkmark } from "@carbon/icons-react";

import BaseModal from "../../../modals/BaseModal";
import { createFolder, renameFolder, setFolderColor, setFolderIcon } from "../../../db";
import { DEFAULT_TOPIC_ICON, TOPIC_ICONS, topicIconById } from "../topicIcons";
import { TOPIC_COLORS, topicColor, topicColorById, topicHex } from "../topicColors";
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
}: {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "rename";
  folderId?: string | null;
  initialName?: string;
  initialColor?: string | null;
  initialIcon?: string | null;
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isOpen]);

  const ActiveIcon = topicIconById(iconId).Icon;
  const activeHex = topicHex(topicColorById(colorId), isDark);

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
    setBusy(true);
    try {
      if (isRename && folderId) {
        await renameFolder(folderId, trimmed);
        await setFolderColor(folderId, colorId);
        await setFolderIcon(folderId, iconId);
      } else {
        await createFolder(trimmed, { icon: iconId, color: colorId });
      }
      onClose();
    } catch {
      setError(t("folders.error_generic"));
    } finally {
      setBusy(false);
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

        <label className="input w-full">
          <ActiveIcon
            size={16}
            className="shrink-0"
            style={{ color: activeHex }}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            data-guide="topic-create-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            disabled={busy}
            autoComplete="off"
            spellCheck={false}
            placeholder={t("folders.name_placeholder")}
          />
        </label>

        {!isRename && (
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
                    disabled={busy}
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
        )}

        <div className="flex flex-col gap-2">
          <p className="text-xs text-base-content">{t("folders.choose_color")}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {TOPIC_COLORS.map((color) => {
              const selected = color.id === colorId;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setColorId(color.id)}
                  aria-label={color.label}
                  aria-pressed={selected}
                  title={color.label}
                  className="relative h-7 w-7 shrink-0 rounded-full cursor-pointer transition-transform"
                  style={{
                    backgroundColor: topicHex(color, isDark),
                    transform: selected ? "scale(1.1)" : undefined,
                  }}
                >
                  {selected && (
                    <Checkmark
                      size={16}
                      className="absolute inset-0 m-auto text-base-100"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-base-content">{t("folders.choose_icon")}</p>
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-1 max-h-40 overflow-y-auto">
            {TOPIC_ICONS.map(({ id, label, Icon }) => {
              const selected = id === iconId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setIconId(id)}
                  title={label}
                  aria-label={label}
                  aria-pressed={selected}
                  className={`h-9 w-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                    selected
                      ? ""
                      : "text-base-content/70 hover:bg-base-200"
                  }`}
                  style={
                    selected
                      ? { backgroundColor: `${activeHex}22`, color: activeHex }
                      : undefined
                  }
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-xs text-error" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="btn btn-ghost"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy || name.trim().length === 0}
            className="btn btn-accent"
          >
            {isRename ? t("common.save") : busy ? t("folders.creating") : t("common.create")}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
