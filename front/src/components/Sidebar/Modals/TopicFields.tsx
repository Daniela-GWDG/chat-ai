import type { ReactNode, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Checkmark } from "@carbon/icons-react";

import { TOPIC_ICONS, topicIconById } from "../topicIcons";
import { TOPIC_COLORS, topicColorById, topicHex } from "../topicColors";

/**
 * Name, colour and icon of a topic. Shared by the topic dialog and the inline
 * "new topic" form of the move dialog, so a topic is set up the same way everywhere.
 */
export default function TopicFields({
  name,
  onNameChange,
  colorId,
  onColorChange,
  iconId,
  onIconChange,
  isDark,
  inputRef,
  onEnter,
  afterName = null,
}: {
  name: string;
  onNameChange: (name: string) => void;
  colorId: string;
  onColorChange: (id: string) => void;
  iconId: string;
  onIconChange: (id: string) => void;
  isDark: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onEnter?: () => void;
  /** Rendered between the name field and the colours (e.g. the topic dialog's examples). */
  afterName?: ReactNode;
}) {
  const { t } = useTranslation();
  const ActiveIcon = topicIconById(iconId).Icon;
  const activeHex = topicHex(topicColorById(colorId), isDark);

  return (
    <>
      <label className="input w-full">
        <ActiveIcon size={16} className="shrink-0" style={{ color: activeHex }} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          data-guide="topic-create-input"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEnter?.();
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder={t("folders.name_placeholder")}
        />
      </label>

      {afterName}

      <div className="flex flex-col gap-2">
        <p className="text-xs text-base-content">{t("folders.choose_color")}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {TOPIC_COLORS.map((color) => {
            const selected = color.id === colorId;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onColorChange(color.id)}
                aria-label={color.label}
                aria-pressed={selected}
                title={color.label}
                className="relative h-7 w-7 shrink-0 rounded-full cursor-pointer transition-transform"
                style={{
                  backgroundColor: topicHex(color, isDark),
                  transform: selected ? "scale(1.1)" : undefined,
                }}
              >
                {selected && <Checkmark size={16} className="absolute inset-0 m-auto text-base-100" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-base-content">{t("folders.choose_icon")}</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1 max-h-40 overflow-y-auto overflow-x-hidden">
          {TOPIC_ICONS.map(({ id, label, Icon }) => {
            const selected = id === iconId;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onIconChange(id)}
                title={label}
                aria-label={label}
                aria-pressed={selected}
                className={`h-9 w-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  selected ? "" : "text-base-content/70 hover:bg-base-200"
                }`}
                style={selected ? { backgroundColor: `${activeHex}22`, color: activeHex } : undefined}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
