import type { CatalogEntry } from "./catalog-types.js";
import usage from "./rich-chat-example-source.js";

export const richChatEntries: readonly CatalogEntry[] = [{
  id: "rich-chat", name: "Rich chat", group: "Compositions", inventoryIds: ["N01", "N02", "N03", "H07"],
  description: "Markdown messages, copyable code, attachment progress and recovery, and accessible source previews.",
  tags: ["chat", "markdown", "code", "copy", "attachment", "upload", "source", "citation", "streaming", "rtl"],
  source: "react-markdown and remark-gfm · existing Evenkit uploads, overlays and copy controls",
  sourceUrl: "https://github.com/remarkjs/react-markdown",
  usage,
}];
