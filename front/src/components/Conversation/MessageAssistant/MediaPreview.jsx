import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "@carbon/icons-react";
import { loadFile, loadFileMeta, useFileMeta } from "../../../db";
import { useModal } from "../../../modals/ModalContext";
import { useToast } from "../../../hooks/useToast";
import { formatFileSize } from "../../../utils/formatFileSize";
import { PromptIconButton } from "../../Others/IconButtons";

const MAX_WIDTH = 576; // max-w-xl
const MAX_HEIGHT = 512; // 32rem

export const isPreviewMedia = (type) => !!type && (type.startsWith("image/") || type.startsWith("video/"));

/** Object URL for a stored file; revoked when the file changes or the component unmounts. */
function useFileObjectUrl(fileId) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!fileId) return undefined;
    let cancelled = false;
    let objectUrl = null;
    loadFile(fileId).then((file) => {
      if (cancelled || !file) return;
      objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setUrl(null);
    };
  }, [fileId]);
  return url;
}

/**
 * A generated image or video, shown large in the chat: rounded, with a bar along
 * its bottom edge holding the file name, the size and a download button.
 * Clicking an image opens the full preview.
 */
export default function MediaPreview({ fileId, alt }) {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { notifyError } = useToast();
  const file = useFileMeta(fileId);
  const url = useFileObjectUrl(fileId);
  // The box is exactly as wide as the shown media; the size limits keep its aspect ratio.
  const [width, setWidth] = useState(null);
  const fit = (naturalWidth, naturalHeight) => {
    if (!naturalWidth || !naturalHeight) return;
    setWidth(Math.min(naturalWidth, MAX_WIDTH, (MAX_HEIGHT * naturalWidth) / naturalHeight));
  };
  if (!file || !url) return null;
  const isVideo = file.type?.startsWith("video/");

  const download = async () => {
    try {
      const data = await loadFile(fileId);
      const link = document.createElement("a");
      const href = URL.createObjectURL(data);
      link.href = href;
      link.download = file.name || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(href), 300);
    } catch (error) {
      console.error("Download failed:", error);
      notifyError(t("file_preview.save_failed"));
    }
  };

  return (
    // spans, not figure/div: a markdown image sits inside a <p>.
    <span
      role="group"
      aria-label={file.name}
      className="block max-w-full overflow-hidden rounded-box border border-base-300 bg-base-100"
      style={{ width: width ?? MAX_WIDTH }}
      data-testid="media-preview"
    >
      {isVideo ? (
        <video
          src={url}
          controls
          className="block h-auto w-full"
          onLoadedMetadata={(e) => fit(e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
        >
          {t("file_preview.video_unsupported")}
        </video>
      ) : (
        <button
          type="button"
          className="block w-full cursor-zoom-in"
          onClick={() => openModal("preview", { previewFile: file, fileId })}
        >
          <img
            src={url}
            alt={alt || file.name}
            className="block h-auto w-full"
            onLoad={(e) => fit(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
          />
        </button>
      )}
      <span className="flex items-center gap-2 border-t border-base-300 bg-base-100 py-1 pl-3 pr-1 text-xs">
        <span className="min-w-0 flex-1 truncate font-medium text-base-content" title={file.name}>
          {file.name}
        </span>
        <span className="shrink-0 text-base-content/70">{formatFileSize(file.size)}</span>
        <PromptIconButton
          onClick={download}
          aria-label={t("file_preview.download_aria")}
          title={t("file_preview.download_aria")}
        >
          <Download size={18} />
        </PromptIconButton>
      </span>
    </span>
  );
}

/** Name of the file a markdown image path points at. */
export const fileNameOf = (src) => {
  const name = (src ?? "").split(/[?#]/)[0].split("/").pop();
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

/** File names the message text already shows inline as markdown images. */
export const inlineImageNames = (text) =>
  new Set([...(text ?? "").matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/g)].map((m) => fileNameOf(m[1])));

/** Meta rows for a list of file ids, keyed by id; undefined until loaded. */
export function useFileMetas(fileIds) {
  const [metas, setMetas] = useState(undefined);
  const key = fileIds.join(",");
  useEffect(() => {
    let cancelled = false;
    let timer;
    // A file id can arrive before its meta row is written; poll until all are there.
    const load = () =>
      Promise.all(fileIds.map((id) => loadFileMeta(id))).then((rows) => {
        if (cancelled) return;
        if (rows.some((row) => !row)) {
          timer = setTimeout(load, 200);
          return;
        }
        setMetas(Object.fromEntries(fileIds.map((id, i) => [id, rows[i]])));
      });
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // fileIds is compared by value through key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return metas;
}
