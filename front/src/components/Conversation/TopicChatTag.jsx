import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useFolderList } from "../../db";
import { selectDarkMode } from "../../Redux/reducers/interfaceSettingsSlice";
import { topicColor, topicHex } from "../Sidebar/topicColors";
import { isTopicIconId, topicIcon } from "../Sidebar/topicIcons";

/**
 * Shows which topic an open chat belongs to: the topic's icon in its colour and
 * its name, as a daisyUI badge linking to the topic page. Renders nothing for
 * chats without a topic (or whose topic is gone).
 */
export default function TopicChatTag({ folderId, className = "" }) {
  const { t } = useTranslation();
  const isDark = useSelector(selectDarkMode);
  const folders = useFolderList() ?? [];
  const topic = folderId ? folders.find((folder) => folder.id === folderId) : null;
  if (!topic) return null;

  const emoji = topic.icon && !isTopicIconId(topic.icon) ? topic.icon : null;
  const Icon = emoji ? null : topicIcon(topic);
  const hex = topicHex(topicColor(topic), isDark);

  return (
    <Link
      to={`/topic/${topic.id}`}
      // Approved override: white (base-100) background for contrast, border in
      // the topic colour like the icon.
      className={`badge max-w-60 gap-1.5 bg-base-100 text-base-content ${className}`}
      style={{ borderColor: hex }}
      title={t("topic_view.open_topic", { name: topic.name })}
      data-testid="topic-chat-tag"
    >
      {emoji ? (
        <span aria-hidden="true" className="leading-none">
          {emoji}
        </span>
      ) : (
        <Icon size={14} aria-hidden="true" className="shrink-0" style={{ color: hex }} />
      )}
      <span className="truncate">{topic.name}</span>
    </Link>
  );
}
