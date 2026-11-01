import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Avatar } from "./foundations.js";

function renderedInitials(name: string) {
  return renderToStaticMarkup(createElement(Avatar, { name })).match(/class="pk-avatar-initials"[^>]*>(.*?)<\/span>/u)?.[1];
}

describe("Avatar initials", () => {
  it("preserves accents in canonically equivalent names", () => {
    expect(renderedInitials("Åsa Östholm")).toBe("ÅÖ");
    expect(renderedInitials("A\u030asa O\u0308stholm")).toBe("ÅÖ");
    expect(renderedInitials("E\u0301lodie Noe\u0308l")).toBe("ÉN");
  });

  it("keeps joined emoji and their modifiers intact", () => {
    expect(renderedInitials("👩🏽‍💻 Team")).toBe("👩🏽‍💻T");
    expect(renderedInitials("  🇦🇹  ")).toBe("🇦🇹");
    expect(renderedInitials("   ")).toBe("?");
  });
});
