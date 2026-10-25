import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChatMarkdown } from "./chat-markdown.js";
import { CodeBlock } from "./code-block.js";
import { safeChatAttachmentUrl, safeChatUrl } from "./rich-chat-urls.js";

function render(content: string, streaming = false) {
  return renderToStaticMarkup(createElement(ChatMarkdown, { content, streaming }));
}

describe("rich chat content boundary", () => {
  it("allows explicit navigation schemes and relative paths without browser scheme obfuscation", () => {
    for (const url of ["https://example.com/docs", "http://example.com", "mailto:team@example.com", "/docs?q=1#part", "../guide", "#source"]) {
      expect(safeChatUrl(url)).toBe(url);
    }
    for (const url of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "java\nscript:alert(1)", "data:text/html,hi", "vbscript:run", "file:///etc/passwd", "//example.com", "\\\\example.com", "https:/example.com", "https://", "blob:https://example.com/id"]) {
      expect(safeChatUrl(url)).toBeUndefined();
    }
    expect(safeChatAttachmentUrl("blob:https://example.com/id")).toBe("blob:https://example.com/id");
    expect(safeChatAttachmentUrl("blob:null/id")).toBe("blob:null/id");
    expect(safeChatAttachmentUrl("blob:javascript:alert(1)")).toBeUndefined();
    expect(safeChatAttachmentUrl("mailto:team@example.com")).toBeUndefined();
    expect(safeChatAttachmentUrl("data:image/svg+xml,svg")).toBeUndefined();
  });

  it("escapes raw HTML and never turns message images or dangerous links into browser loads", () => {
    const html = render('<script>alert(1)</script>\n\n<img src="/track" onerror="alert(2)">\n\n[bad](javascript:alert%281%29) [encoded](jav&#x61;script:alert%281%29) [safe](https://example.com)\n\n![private image](https://example.com/tracker.png)');
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).not.toMatch(/<(script|img|iframe)\b/);
    expect(html).not.toMatch(/href="(?:javascript|data|vbscript):/i);
    expect(html).toContain('<span>bad</span>');
    expect(html).toContain('<span>encoded</span>');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain("Image omitted: private image");
  });

  it("renders semantic headings, lists, tables and code while containing long content", () => {
    const html = render('# Heading\n\n- First\n- Second\n\n1. One\n2. Two\n\n| Name | Count |\n| --- | ---: |\n| Example | 2 |\n\nInline `value`\n\n```ts\nconst value = "<safe>";\n```');
    for (const tag of ["h1", "ul", "ol", "table", "th", "td", "pre", "code"]) expect(html).toContain(`<${tag}`);
    expect(html).toContain('role="region" aria-label="Message table"');
    expect(html).toContain('role="region" aria-label="Code block"');
    expect(html).toContain("const value = &quot;&lt;safe&gt;&quot;;");
    expect(html).toContain("Copy code");
    expect(html).toContain('class="pk-code-block-language">ts</span>');
  });

  it("keeps unfinished streaming syntax visible without inventing executable markup", () => {
    expect(render("A [partial](https://exa", true).replace(/<[^>]+>/g, "")).toContain("A [partial](https://exa");
    const html = render("```js\nconst x = '<script>';", true);
    expect(html).toContain("const x = &#x27;&lt;script&gt;&#x27;;");
    expect(html).toContain('class="pk-code-block"');
    expect(html).toContain('data-streaming="true"');
    expect(html).not.toContain("<script>");
  });

  it("preserves standalone code whitespace and treats a language label as text", () => {
    const html = renderToStaticMarkup(createElement(CodeBlock, { code: "  <tag>\n\n", language: '<img src="x">' }));
    expect(html).toContain("<code>  &lt;tag&gt;\n\n</code>");
    expect(html).toContain("&lt;img src=&quot;x&quot;&gt;");
    expect(html).not.toContain("<img");
  });

  it("keeps footnote IDs and descriptions unique when messages repeat the same note", () => {
    const content = "Statement[^1].\n\n[^1]: The source.";
    const html = renderToStaticMarkup(createElement(Fragment, null, createElement(ChatMarkdown, { content }), createElement(ChatMarkdown, { content })));
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(match => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    const descriptions = [...html.matchAll(/aria-describedby="([^"]+)"/g)].map(match => match[1]);
    expect(descriptions).toHaveLength(2);
    descriptions.forEach(id => expect(ids).toContain(id));
    for (const match of html.matchAll(/href="#([^"]+)"/g)) expect(ids).toContain(match[1]);
  });
});
