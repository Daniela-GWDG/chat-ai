import { Trans, useTranslation } from "react-i18next";
import { useAttachments } from "../../hooks/useAttachments";
import MiniAudioButton from "./MiniAudioButton";
import { useEffect, useState } from "react";
import { pdfThumbnail } from "../../utils/pdfThumbnail";
import { useModal } from "../../modals/ModalContext";
import {
  useFileMeta,
  useFileBase64,
  loadFile,
} from "../../db";
import {
  WarningAltFilled,
  Close,
  Download,
  Video,
  DocumentBlank,
  DocumentPdf,
  DocumentWordProcessor,
  Image as ImageIcon,
  Music,
  DataTable,
  Csv,
  Document,
  Code,
} from "@carbon/icons-react";
import { getFileType } from "../../utils/attachments";
import { useToast } from "../../hooks/useToast";
import { isAgentEnabled } from "../../apis/agentEndpoints";
import { PromptIconButton } from "../Others/IconButtons";
import { usePrepareStatus } from "../../agent/prepare";

const TYPE_ICONS = {
  pdf: DocumentPdf,
  docx: DocumentWordProcessor,
  image: ImageIcon,
  video: Video,
  audio: Music,
  excel: DataTable,
  csv: Csv,
  markdown: Document,
  text: Document,
  code: Code,
};

// Visible on hover and keyboard focus; always on touch screens, which have no hover.
const HOVER_ONLY =
  "opacity-0 group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100";

export default function Attachment({
  localState,
  setLocalState,
  attachment,
  index,
  inHistory = false,
  inAssistant = false,
  suppressUnsupportedWarning = false,
  // Being converted to Markdown right now (see useProcessAttachments)
  processing = false,
}) {
  const { openModal } = useModal();
  const { t } = useTranslation();

  const { removeAttachment, clearAttachments, readFileAsBase64 } =
    useAttachments();
  const { notifyError } = useToast();
  const file = useFileMeta(attachment.fileId);
  const isImage = file?.type?.startsWith("image/");
  const isAudio = file?.type?.startsWith("audio/");
  const base64 = useFileBase64((isImage || isAudio) ? attachment.fileId : null);
  const isPdf = file?.type === "application/pdf" || /\.pdf$/i.test(file?.name ?? "");
  const [pdfPreview, setPdfPreview] = useState(null);
  useEffect(() => {
    if (!isPdf) return undefined;
    let cancelled = false;
    pdfThumbnail(attachment.fileId, async () => (await loadFile(attachment.fileId))?.arrayBuffer()).then(
      (url) => !cancelled && setPdfPreview(url),
    );
    return () => {
      cancelled = true;
    };
  }, [isPdf, attachment.fileId]);
  const thumbnail = isImage ? base64 : pdfPreview;
  const prepareStatus = usePrepareStatus(attachment.fileId);
  if (!file) return ""; // TODO placeholder file
  const fileType = getFileType(file); // Get readable file type, e.g., "image"
  const model = localState.settings.model;
  // The agent copies every upload into its workspace and converts documents and audio on send
  const agentMode = isAgentEnabled();

  const isAudioSupported = (agentMode || localState.settings.enable_tools || (model?.input?.includes("audio") || false));
  const isVideoSupported = (agentMode || localState.settings.enable_tools || (model?.input?.includes("video") || false));
  const isImageSupported = (agentMode || localState.settings.enable_tools || (model?.input?.includes("image") || false));
  const isFileSupported = !fileType
    ? false
    : fileType === "image"
    ? isImageSupported
    : fileType === "audio"
    ? isAudioSupported
    : fileType === "video"
    ? isVideoSupported
    : true;

  const handleRemove = () => {
    removeAttachment({
      localState,
      setLocalState,
      index,
    });
  };

  const handleDownload = async (event) => {
    event.stopPropagation();
    try {
      const bytes = await loadFile(attachment.fileId);
      const blob = new Blob([bytes], { type: file.type || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 300);
    } catch (error) {
      console.error("Download failed:", error);
      notifyError(t("file_preview.save_failed"));
    }
  };
  // Handle Process File
  // Convert file size from bytes to human-readable format (e.g., KB, MB, GB)
  function formatFileSize(bytes) {
    if (!bytes) return "NaN";
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    // Keep dividing by 1024 until we reach the appropriate unit
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    // Return formatted string with 2 decimal places and unit
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  const getFileBadge = (file) => {
    const fileType = getFileType(file);
    if (fileType === "markdown") return "MD";
    if (fileType === "unknown") return "DOC";
    return fileType.toUpperCase();
  };

  const badge = getFileBadge(file);
  const canProcess = !agentMode && !inHistory && (fileType === "pdf" || fileType === "docx"); // TODO add other supported types

  const TypeIcon = TYPE_ICONS[fileType] ?? DocumentBlank;
  const showProcess = canProcess && !inHistory;
  const statusText = prepareStatus
    ? t(`conversation.attachment.${prepareStatus}`)
    : !inAssistant && !agentMode && !suppressUnsupportedWarning && !isFileSupported
      ? t("conversation.attachment.file_unsupported", { filetype: fileType })
      : null;

  return (
    <div
      key={`${file.name}-${index}`}
      data-guide={inHistory ? undefined : "attachment-card"}
      className="group relative flex w-40 shrink-0 cursor-pointer flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 transition-colors hover:border-base-content/30"
      onClick={() => {
        openModal("preview", { previewFile: file, fileId: attachment.fileId });
      }}
    >
      {/* Preview: the image or the PDF's first page, otherwise the file type */}
      <div className="relative flex h-24 shrink-0 items-center justify-center overflow-hidden bg-base-200">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="h-full w-full object-cover object-top" />
        ) : isAudio ? (
          <span onClick={(e) => e.stopPropagation()}>
            <MiniAudioButton src={base64} />
          </span>
        ) : (
          <TypeIcon size={32} aria-hidden="true" className="text-base-content/40" />
        )}

        {/* Converting: a spinner over the preview */}
        {(processing || prepareStatus) && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-base-100/70"
            role="status"
            aria-label={t(`conversation.attachment.${prepareStatus || "converting"}`)}
          >
            <span className="loading loading-spinner loading-md text-accent" />
          </div>
        )}

      </div>

      {/* Name bar: always two lines (name, then status or size), so every card has the same height */}
      <div className="flex shrink-0 flex-col gap-0.5 border-t border-base-300 px-2 py-1.5 text-xs leading-4">
        <div className="flex min-w-0 items-center gap-1.5 text-base-content">
          <TypeIcon size={16} aria-hidden="true" className="shrink-0 text-base-content/70" />
          <span className="min-w-0 flex-1 truncate">{file.name}</span>
        </div>
        {showProcess || (statusText && !prepareStatus) ? (
          <span className="flex min-w-0 items-center gap-1 text-warning">
            <WarningAltFilled size={12} className="shrink-0" />
            <span className="truncate">
              {showProcess ? t("conversation.attachment.unprocessed_short") : statusText}
            </span>
          </span>
        ) : (
          <span className="truncate text-base-content/70">{statusText || formatFileSize(file.size)}</span>
        )}
      </div>

      {/* Remove (prompt) or download (history), shown on hover */}
      {/* Solid white under the button, so its hover tint does not show the preview through */}
      <span className={`absolute top-1 right-1 rounded-full bg-base-100 shadow-sm ${HOVER_ONLY}`}>
      {!inHistory ? (
        <PromptIconButton
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          aria-label={t("file_preview.remove_aria")}
          title={t("file_preview.remove_aria")}
        >
          <Close size={18} aria-hidden="true" />
        </PromptIconButton>
      ) : (
        <PromptIconButton
          onClick={handleDownload}
          aria-label={t("file_preview.download_aria")}
          title={t("file_preview.download_aria")}
        >
          <Download size={18} aria-hidden="true" />
        </PromptIconButton>
      )}
      </span>
    </div>
  );
}
