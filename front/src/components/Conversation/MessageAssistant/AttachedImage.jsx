import { createContext, useContext, useEffect, useState } from "react";
import { useFiles } from "../../../db";
import MediaPreview, { fileNameOf } from "./MediaPreview";

/** File ids attached to the message being rendered. */
export const MessageFilesContext = createContext([]);

/**
 * Generated images are referenced by a workspace path the browser cannot load.
 * Shows the matching attachment instead, or only the alt text if there is none.
 */
export default function AttachedImage({ src, alt }) {
  const fileIds = useContext(MessageFilesContext);
  const { loadFileMeta } = useFiles();
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

  if (match === undefined) return null;
  if (match === null) return <span className="text-base-content/70">{alt || ""}</span>;
  return (
    <span className="my-2 block">
      <MediaPreview fileId={match.fileId} alt={alt} />
    </span>
  );
}
