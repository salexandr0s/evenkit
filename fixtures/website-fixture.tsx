"use client";

import { WebsiteExample, ArticleExample } from "./blocks/website/examples";

export function WebsiteFixture() {
  return <section aria-label="Packed website blocks">
    <h2>Website block package controls</h2>
    <WebsiteExample
      onContact={async (_values, { signal }) => { signal.throwIfAborted(); }}
      onNewsletter={async (_values, { signal }) => { signal.throwIfAborted(); }}
    />
    <ArticleExample headingAs="h2" />
  </section>;
}
