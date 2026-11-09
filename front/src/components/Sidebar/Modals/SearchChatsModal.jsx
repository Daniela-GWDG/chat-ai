import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Chat, Close, Search } from "@carbon/icons-react";

import BaseModal from "../../../modals/BaseModal";
import { listRecentConversations, searchConversations } from "../../../db";
import { formatCompactDate } from "../../../utils/conversationDates";

const SEARCH_DEBOUNCE_MS = 150;

function Highlighted({ text, query }) {
  const needle = query.toLowerCase();
  if (!needle) return text;

  const lower = text.toLowerCase();
  const parts = [];
  let position = 0;
  let found = lower.indexOf(needle);
  while (found >= 0) {
    parts.push(text.slice(position, found));
    position = found + needle.length;
    parts.push(
      <span key={found} className="font-medium text-base-content">
        {text.slice(found, position)}
      </span>,
    );
    found = lower.indexOf(needle, position);
  }
  parts.push(text.slice(position));
  return parts;
}

export default function SearchChatsModal({ isOpen, onClose, onSelect }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState([]);
  const [results, setResults] = useState([]);
  const trimmedQuery = query.trim();

  useEffect(() => {
    let cancelled = false;
    listRecentConversations()
      .catch(() => [])
      .then((conversations) => {
        if (!cancelled) setRecent(conversations);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!trimmedQuery) {
      setResults([]);
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      searchConversations(trimmedQuery)
        .catch(() => [])
        .then((conversations) => {
          if (!cancelled) setResults(conversations);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery]);

  const formatDate = (timestamp) =>
    timestamp && new Date(timestamp).toDateString() === new Date().toDateString()
      ? t("folders.dateBuckets.today")
      : formatCompactDate(timestamp, i18n.language);

  const handleSelect = (conversation) => {
    onClose();
    onSelect(conversation.conversationId, conversation.messageId);
  };

  const rows = trimmedQuery ? results : recent;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      titleKey="folders.search_label"
      titleClassName="text-base font-semibold"
      titleColorClassName="text-base-content"
      maxWidth="max-w-3xl"
      contentClassName="min-h-0 p-0"
    >
      <div className="flex h-[min(72dvh,650px)] min-h-0 flex-col overflow-hidden rounded-b-box border-t border-base-300">
        <div className="shrink-0 border-b border-base-300 p-3">
          <label className="input w-full">
            <Search size={16} className="shrink-0 text-base-content/50" aria-hidden="true" />
            <input
              type="text"
              data-guide="search-input"
              data-autofocus
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("folders.search_placeholder")}
            />
            {query && (
              <button
                type="button"
                className="cursor-pointer text-base-content/50 hover:text-base-content"
                aria-label={t("folders.clear_search")}
                onClick={() => setQuery("")}
              >
                <Close size={16} />
              </button>
            )}
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {!trimmedQuery && recent.length > 0 && (
            <h3 className="px-3 pt-1 pb-2 text-xs font-medium text-base-content/70">
              {t("folders.search_recent")}
            </h3>
          )}

          {trimmedQuery && results.length === 0 && (
            <p className="py-8 text-center text-sm text-base-content/70">
              {t("folders.search_no_results", { query: trimmedQuery })}
            </p>
          )}

          <ul className="flex flex-col gap-0.5">
            {rows.map((conversation) => (
              <li key={conversation.conversationId}>
                <button
                  type="button"
                  onClick={() => handleSelect(conversation)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-base-200"
                >
                  <Chat size={18} className="shrink-0 text-accent" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-base-content">
                      <Highlighted
                        text={
                          conversation.title ||
                          t("conversation.untitled", { defaultValue: "Untitled Chat" })
                        }
                        query={trimmedQuery}
                      />
                    </span>
                    {conversation.snippet && (
                      <span className="mt-0.5 block truncate text-xs text-base-content/70">
                        <Highlighted text={conversation.snippet} query={trimmedQuery} />
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-base-content/70">
                    {formatDate(conversation.lastModified)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseModal>
  );
}
