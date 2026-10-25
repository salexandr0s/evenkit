import { describe, expect, it } from "vitest";
import { mediaHref, mediaPreviewKind } from "./media-preview-utils.js";

describe("media preview boundary", () => {
  it("renders only explicitly supported MIME types, independent of a filename", () => {
    expect(mediaPreviewKind("image/png")).toBe("image");
    expect(mediaPreviewKind("TEXT/PLAIN; charset=utf-8")).toBe("text");
    for (const mime of ["text/html", "image/svg+xml", "application/pdf", "application/javascript", "image/unknown", ""]) {
      expect(mediaPreviewKind(mime)).toBe("unsupported");
    }
  });

  it("rejects active-content and ambiguous URL schemes for previews and file actions", () => {
    for (const href of ["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "data:image/svg+xml,<svg/>", "file:///etc/passwd", "//other.example/file", "\\other.example/file", "https:\\other.example/file", " javaScript:alert(1)", "java\nscript:alert(1)", "blob:data:text/html,test", "https://"] ) {
      expect(mediaHref(href)).toBeUndefined();
    }
    for (const href of ["/files/notes.txt", "./preview.png", "../preview.png", "https://files.example/a?signature=123", "http://localhost:8080/image.png", "blob:https://example.com/abc-123"]) {
      expect(mediaHref(href)).toBe(href);
    }
  });
});
