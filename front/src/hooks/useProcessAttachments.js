import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadFile, saveFile } from "../db";
import { processFile } from "../apis/processFile";
import { getFileType } from "../utils/attachments";
import { canConvertDocumentLocally, convertDocumentLocally } from "../utils/browserDocumentConversion";
import { isAgentEnabled } from "../apis/agentEndpoints";
import { useToast } from "./useToast";

/** Documents that must be converted by hand before sending; the agent converts them itself. */
export const needsProcessing = (file) =>
  !isAgentEnabled() && !!file && ["pdf", "docx"].includes(getFileType(file));

/**
 * Converts prompt attachments to Markdown, in the browser or on the server, and
 * swaps each converted file into the prompt in place. `processing` holds the
 * file ids that are being converted right now.
 */
export function useProcessAttachments(localState, setLocalState) {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useToast();
  const [processing, setProcessing] = useState(() => new Set());

  const mark = (fileId, on) =>
    setProcessing((prev) => {
      const next = new Set(prev);
      if (on) next.add(fileId);
      else next.delete(fileId);
      return next;
    });

  const processOne = async (fileId, useBrowser, conversationId) => {
    mark(fileId, true);
    try {
      const rawFile = await loadFile(fileId);
      const fileType = getFileType(rawFile);
      const response =
        useBrowser && canConvertDocumentLocally(fileType)
          ? await convertDocumentLocally(rawFile, fileType)
          : await processFile(rawFile);
      if (!response?.content) return false;
      const processed = new File([response.content], `${rawFile.name}.md`, { type: "text/markdown" });
      const processedId = saveFile(conversationId, processed);
      setLocalState((prev) => {
        const messages = [...prev.messages];
        const last = messages[messages.length - 1];
        messages[messages.length - 1] = {
          ...last,
          content: last.content.map((item) =>
            item?.fileId === fileId ? { type: "file", fileId: processedId } : item,
          ),
        };
        return { ...prev, messages };
      });
      return true;
    } catch (error) {
      console.error("Processing failed:", error);
      return false;
    } finally {
      mark(fileId, false);
    }
  };

  /** Converts the given files one after another and reports once. */
  const processAll = useCallback(
    async (fileIds, useBrowser) => {
      let failed = 0;
      for (const fileId of fileIds) {
        if (!(await processOne(fileId, useBrowser, localState.id))) failed += 1;
      }
      if (failed > 0) notifyError(t("conversation.attachment.process_failed", { count: failed }));
      else notifySuccess(t("conversation.attachment.process_done", { count: fileIds.length }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localState, setLocalState],
  );

  return { processing, processAll };
}
