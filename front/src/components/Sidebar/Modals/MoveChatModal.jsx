import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Add } from "@carbon/icons-react";
import BaseModal from "../../../modals/BaseModal";
import { assignConversationToFolder, createFolder } from "../../../db";
import { selectDarkMode } from "../../../Redux/reducers/interfaceSettingsSlice";
import { TOPIC_COLORS, topicColor, topicHex } from "../topicColors";
import { DEFAULT_TOPIC_ICON, isTopicIconId, topicIcon } from "../topicIcons";
import TopicFields from "./TopicFields";

const UNSORTED_FOLDER = "__unsorted__";
const NEW_TOPIC = "__new__";

const RADIO_CLASS =
  "radio text-accent border-base-content/50 hover:border-base-content/80 checked:border-accent radio-sm";

/**
 * Moves a chat to the plain chat list or into a topic, in the sidebar's order:
 * "Chats" on its own, then the topics under a heading. The last option creates
 * a new topic in place (name, colour, icon) and moves the chat there in one step.
 */
export default function MoveChatModal({
  isOpen,
  onClose,
  conversationId,
  conversationTitle,
  currentFolderId = null,
  folders = [],
  localState,
  setLocalState,
}) {
  const { t } = useTranslation();
  const isDark = useSelector(selectDarkMode);
  const currentTarget = currentFolderId ?? UNSORTED_FOLDER;
  const [selectedFolder, setSelectedFolder] = useState(currentTarget);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [newName, setNewName] = useState("");
  const [newColorId, setNewColorId] = useState(TOPIC_COLORS[0].id);
  const [newIconId, setNewIconId] = useState(DEFAULT_TOPIC_ICON.id);
  const newNameRef = useRef(null);

  const creating = selectedFolder === NEW_TOPIC;

  useEffect(() => {
    setSelectedFolder(currentFolderId ?? UNSORTED_FOLDER);
    setError("");
    setNewName("");
  }, [currentFolderId, isOpen]);

  useEffect(() => {
    if (creating) requestAnimationFrame(() => newNameRef.current?.focus());
  }, [creating]);

  const folderOptions = useMemo(
    () =>
      [...(folders || [])].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    [folders],
  );

  // The open chat is saved through its local state (like renaming); writing the
  // row directly as well would bump lastModified and the next save would report
  // a conflict with "another tab".
  const moveTo = async (folderId) => {
    if (localState?.id === conversationId && typeof setLocalState === "function") {
      setLocalState((prev) => ({ ...prev, folderId, flush: true }));
      return;
    }
    await assignConversationToFolder(conversationId, folderId);
  };

  const handleMove = async () => {
    if (busy) return;
    setError("");
    if (creating && !newName.trim()) {
      setError(t("folders.error_required"));
      newNameRef.current?.focus();
      return;
    }
    setBusy(true);
    try {
      let target = selectedFolder === UNSORTED_FOLDER ? null : selectedFolder;
      if (creating) {
        target = await createFolder(newName.trim(), { icon: newIconId, color: newColorId });
      }
      await moveTo(target);
      onClose();
    } catch (err) {
      setError(err?.message ?? t("folders.error_generic"));
    } finally {
      setBusy(false);
    }
  };

  const canMove =
    !!conversationId &&
    !busy &&
    (creating ? newName.trim().length > 0 : selectedFolder !== currentTarget);

  const rowClass = "flex cursor-pointer items-center gap-3 py-1.5";
  const radio = (value) => (
    <input
      type="radio"
      name="move-target"
      className={RADIO_CLASS}
      checked={selectedFolder === value}
      onChange={() => {
        setSelectedFolder(value);
        setError("");
      }}
    />
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleKey="folders.move_title"
      titleClassName="text-base font-semibold"
      titleColorClassName="text-base-content"
      maxWidth="max-w-md"
      contentClassName="p-0"
    >
      <div className="flex flex-col gap-4 rounded-b-box border-t border-base-300 p-5 text-sm text-base-content">
        <p>
          <Trans i18nKey="folders.move_description" values={{ title: conversationTitle || "" }} />
        </p>

        <div role="radiogroup" aria-label={t("folders.move_title")} className="flex flex-col gap-3">
          {/* The plain chat list, on its own like in the sidebar */}
          <label className={rowClass}>
            {radio(UNSORTED_FOLDER)}
            <span>
              <Trans i18nKey="folders.title" /> (<Trans i18nKey="folders.move_target_chats_hint" />)
            </span>
          </label>

          <div role="separator" className="border-t border-base-300" />

          {/* Topics under their heading */}
          <div className="flex flex-col">
            <p className="mb-1 text-xs font-medium text-base-content/70">
              <Trans i18nKey="folders.topics_section" />
            </p>
            <div className="flex max-h-56 flex-col overflow-y-auto">
              {folderOptions.map((folder) => {
                const emoji = folder.icon && !isTopicIconId(folder.icon) ? folder.icon : null;
                const Icon = emoji ? null : topicIcon(folder);
                const hex = topicHex(topicColor(folder), isDark);
                return (
                  <label key={folder.id} className={rowClass}>
                    {radio(folder.id)}
                    {emoji ? (
                      <span aria-hidden="true" className="w-4 shrink-0 text-center leading-none">
                        {emoji}
                      </span>
                    ) : (
                      <Icon size={16} aria-hidden="true" className="shrink-0" style={{ color: hex }} />
                    )}
                    <span className="truncate">{folder.name}</span>
                  </label>
                );
              })}
            </div>

            {/* A new topic is set apart from the existing ones */}
            <div role="separator" className="my-2 border-t border-base-300" />
            <label className={rowClass}>
              {radio(NEW_TOPIC)}
              <Add size={16} aria-hidden="true" className="shrink-0 text-base-content/70" />
              <span>
                <Trans i18nKey="folders.move_new_topic" />
              </span>
            </label>

            {/* Progressive disclosure: the new topic's fields appear in place */}
            {creating && (
              <div className="ml-7 mt-2 flex flex-col gap-4" data-testid="new-topic-fields">
                <TopicFields
                  name={newName}
                  onNameChange={(value) => {
                    setNewName(value);
                    setError("");
                  }}
                  colorId={newColorId}
                  onColorChange={setNewColorId}
                  iconId={newIconId}
                  onIconChange={setNewIconId}
                  isDark={isDark}
                  inputRef={newNameRef}
                  onEnter={handleMove}
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-xs text-error" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            <Trans i18nKey="common.cancel" />
          </button>
          <button type="button" className="btn btn-accent" onClick={handleMove} disabled={!canMove}>
            <Trans i18nKey="folders.move_action" />
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
