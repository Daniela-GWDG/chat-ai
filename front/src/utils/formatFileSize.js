/** Human-readable size, e.g. 1.5 MB. */
export function formatFileSize(bytes) {
  if (!bytes) return "";
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${unitIndex === 0 ? size : size.toFixed(1)} ${units[unitIndex]}`;
}
