import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "@carbon/icons-react";
import { useSelector } from "react-redux";
import { WarningAltFilled } from "@carbon/icons-react";
import Attachment from "./Attachment";
import { useFileMetas } from "../Conversation/MessageAssistant/MediaPreview";
import { needsProcessing, useProcessAttachments } from "../../hooks/useProcessAttachments";
import { selectDocumentConversionMode } from "../../Redux/reducers/userSettingsReducer";

const CARD_WIDTH = 160; // w-40
const GAP = 8; // gap-2
export const CARD_HEIGHT = 145; // h-24 preview + two-line name bar + borders
export const ROWS = 2;

/** How many cards fit in one row of the given width. */
export const cardsPerRow = (width) => Math.max(1, Math.floor((width + GAP) / (CARD_WIDTH + GAP)));

/**
 * The prompt's attachments, above the text and set apart by a fine divider.
 * At most two rows; more attachments are paged with round daisyUI buttons.
 */
export default function AttachmentsContainer({ localState, setLocalState }) {
  const { t } = useTranslation();
  const attachments = localState.messages[localState.messages.length - 1].content.slice(1);
  const gridRef = useRef(null);
  const [perRow, setPerRow] = useState(4);
  const [page, setPage] = useState(0);
  const metas = useFileMetas(attachments.map((a) => a.fileId).filter(Boolean));
  const conversionMode = useSelector(selectDocumentConversionMode);
  const { processing, processAll } = useProcessAttachments(localState, setLocalState);
  const unprocessed = attachments
    .map((a) => a.fileId)
    .filter((id) => id && needsProcessing(metas?.[id]) && !processing.has(id));
  const busy = processing.size > 0;

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const measure = () => setPerRow(cardsPerRow(grid.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [attachments.length > 0]);

  const perPage = perRow * ROWS;
  const pageCount = Math.max(1, Math.ceil(attachments.length / perPage));

  // A new attachment shows up on the last page; removing one never leaves an empty page.
  const previousCount = useRef(attachments.length);
  useEffect(() => {
    if (attachments.length > previousCount.current) setPage(pageCount - 1);
    else setPage((current) => Math.min(current, pageCount - 1));
    previousCount.current = attachments.length;
  }, [attachments.length, pageCount]);

  if (attachments.length === 0) return null;

  const start = page * perPage;
  const visible = attachments.slice(start, start + perPage);

  return (
    <div className="select-none border-b border-base-300 p-3" data-testid="prompt-attachments">
      <p className="mb-2 text-xs font-semibold text-base-content">
        {t("conversation.prompt.attachments_count", { count: attachments.length })}
      </p>

      {/* One hint and one action for every document that still has to be converted */}
      {(unprocessed.length > 0 || busy) && (
        <div role="note" className="alert alert-warning alert-soft mb-3 py-2 text-sm" data-guide="process-file">
          <WarningAltFilled size={16} aria-hidden="true" />
          <span>
            {busy
              ? t("conversation.attachment.processing_count", { count: processing.size })
              : t("conversation.attachment.must_process_count", { count: unprocessed.length })}
          </span>
          {!busy && (
            <div className="flex gap-2">
              {conversionMode !== "server" && (
                <button type="button" className="btn btn-sm border-base-content/20 bg-base-100 hover:bg-base-200" onClick={() => processAll(unprocessed, true)}>
                  {conversionMode === "choice"
                    ? t("conversation.attachment.process_browser")
                    : t("conversation.attachment.process_all")}
                </button>
              )}
              {conversionMode !== "browser" && (
                <button type="button" className="btn btn-sm border-base-content/20 bg-base-100 hover:bg-base-200" onClick={() => processAll(unprocessed, false)}>
                  {conversionMode === "choice"
                    ? t("conversation.attachment.process_server")
                    : t("conversation.attachment.process_all")}
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {/* With pages, the grid always keeps two rows, so the controls below never move */}
      <div
        ref={gridRef}
        className="flex flex-wrap content-start gap-2"
        style={pageCount > 1 ? { minHeight: ROWS * CARD_HEIGHT + (ROWS - 1) * GAP } : undefined}
      >
        {visible.map((attachment, i) => (
          <Attachment
            key={attachment.fileId ?? start + i}
            localState={localState}
            setLocalState={setLocalState}
            attachment={attachment}
            index={start + i}
            processing={processing.has(attachment.fileId)}
          />
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="mt-2 flex justify-center" aria-label={t("conversation.prompt.attachment_pages")}>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              aria-label={t("conversation.prompt.previous_page")}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`btn btn-sm btn-circle btn-ghost ${i === page ? "btn-active" : ""}`}
                aria-current={i === page ? "page" : undefined}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost"
              disabled={page === pageCount - 1}
              onClick={() => setPage(page + 1)}
              aria-label={t("conversation.prompt.next_page")}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
