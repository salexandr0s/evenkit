import { useState } from "react";
import { Button } from "@project-kit/ui";

export function CodeExample({ code }: { code: string }) {
  const [notice, setNotice] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setNotice("Code copied.");
    } catch {
      setNotice("Copy is unavailable. Select the code to copy it.");
    }
  }

  return (
    <section className="catalog-code" aria-label="Usage example">
      <div className="catalog-code-header">
        <span>Usage</span>
        <Button size="sm" variant="ghost" onClick={() => void copy()}>Copy code</Button>
      </div>
      <pre tabIndex={0}><code>{code}</code></pre>
      <p className="catalog-copy-notice" role="status">{notice}</p>
    </section>
  );
}
