import { createContext, useContext, useEffect, useState } from "react";
import { useFileBase64, useFiles } from "../../../db";
import { useModal } from "../../../modals/ModalContext";

/** File ids attached to the message being rendered. */
export const MessageFilesContext = createContext([]);

const fileNameOf = (src) => {
  const name = src.split(/[?#]/)[0].split("/").pop();
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

/**
 * Generated images are referenced by a workspace path the browser cannot load.
 * Shows the matching attachment instead, or only the alt text if there is none.
 */
export default function AttachedImage({ src, alt }) {
  const fileIds = useContext(MessageFilesContext);
  const { loadFileMeta } = useFiles();
  const { openModal } = useModal();
  const [match, setMatch] = useState(undefined);
  const fileIdsKey = fileIds.join(",");

  useEffect(() => {
    let cancelled = false;
    const name = fileNameOf(src ?? "");
    Promise.all(fileIds.map((id) => loadFileMeta(id))).then((metas) => {
      if (cancelled) return;
      const index = metas.findIndex(
        (meta) => meta?.name === name && meta?.type?.startsWith("image/"),
      );
      setMatch(index >= 0 ? { fileId: fileIds[index], file: metas[index] } : null);
    });
    return () => {
      cancelled = true;
    };
    // fileIds is compared by value through fileIdsKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fileIdsKey, loadFileMeta]);

  const base64 = useFileBase64(match?.fileId ?? null);

  if (match === undefined) return null;
  if (match === null) return <span className="text-base-content/70">{alt || ""}</span>;
  if (!base64) return null;

  return (
    <button
      type="button"
      className="block w-full max-w-lg cursor-pointer"
      onClick={() => openModal("preview", { previewFile: match.file, fileId: match.fileId })}
    >
      <img src={base64} alt={alt} className="w-full rounded-box" />
    </button>
  );
}
