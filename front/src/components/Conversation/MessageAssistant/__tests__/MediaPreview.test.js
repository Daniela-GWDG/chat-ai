import { describe, expect, it } from "vitest";
import { fileNameOf, inlineImageNames, isPreviewMedia } from "../MediaPreview";

describe("MediaPreview helpers", () => {
  it("treats images and videos as previewable media", () => {
    expect(isPreviewMedia("image/png")).toBe(true);
    expect(isPreviewMedia("video/mp4")).toBe(true);
    expect(isPreviewMedia("application/pdf")).toBe(false);
    expect(isPreviewMedia(undefined)).toBe(false);
  });

  it("finds the images the text already shows inline", () => {
    const names = inlineImageNames("Here: ![Bild](/generated/mars%20pilami.png) and ![x](<a/b.jpg>)");
    expect([...names]).toEqual(["mars pilami.png", "b.jpg"]);
    expect(inlineImageNames(undefined).size).toBe(0);
  });

  it("takes the file name from a path with query", () => {
    expect(fileNameOf("/a/b/c.png?x=1#y")).toBe("c.png");
  });
});
