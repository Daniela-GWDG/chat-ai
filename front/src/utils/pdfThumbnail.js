// First-page thumbnails for PDF attachments, rendered in the browser with PDFium.
const cache = new Map(); // fileId -> Promise<string | null>
let libraryPromise = null;

async function getLibrary() {
  if (!libraryPromise) {
    libraryPromise = (async () => {
      const [{ PDFiumLibrary }, wasmModule] = await Promise.all([
        import("@hyzyla/pdfium"),
        import("@hyzyla/pdfium/pdfium.wasm?url"),
      ]);
      const wasmUrl = new URL(wasmModule.default, document.baseURI).href;
      return PDFiumLibrary.init({ wasmUrl });
    })().catch((error) => {
      libraryPromise = null;
      throw error;
    });
  }
  return libraryPromise;
}

async function render(bytes, scale) {
  const library = await getLibrary();
  const pdf = await library.loadDocument(new Uint8Array(bytes));
  try {
    const image = await pdf.getPage(0).render({ scale, render: "bitmap", colorSpace: "RGBA" });
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const pixels = new ImageData(new Uint8ClampedArray(image.data), image.width, image.height);
    canvas.getContext("2d").putImageData(pixels, 0, 0);
    return canvas.toDataURL("image/png");
  } finally {
    pdf.destroy();
  }
}

/**
 * A data URL of the PDF's first page, or null when it cannot be rendered.
 * Cached per file id for the session.
 */
export function pdfThumbnail(fileId, loadBytes, scale = 0.6) {
  if (!cache.has(fileId)) {
    cache.set(
      fileId,
      loadBytes()
        .then((bytes) => (bytes ? render(bytes, scale) : null))
        .catch((error) => {
          console.warn("PDF thumbnail failed:", error);
          return null;
        }),
    );
  }
  return cache.get(fileId);
}
