"use client";

import { useId, type ComponentPropsWithoutRef } from "react";
import { classes } from "./classes.js";
import { CopyAction } from "./selection-controls.js";

export interface CodeBlockLabels {
  code: string;
  plainText: string;
  copy: string;
  copying: string;
  copied: string;
  copyFailed: string;
}

const defaultCodeBlockLabels: CodeBlockLabels = {
  code: "Code block", plainText: "Plain text", copy: "Copy code", copying: "Copying…",
  copied: "Copied to clipboard.", copyFailed: "Could not copy. Select the code to copy it.",
};

export interface CodeBlockProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "dangerouslySetInnerHTML"> {
  code: string;
  language?: string;
  labels?: Partial<CodeBlockLabels>;
}

/** Renders code as text. Language labels never load or execute a grammar. */
export function CodeBlock({ code, language, labels: customLabels, className, ...props }: CodeBlockProps) {
  const labels = { ...defaultCodeBlockLabels, ...customLabels };
  const id = useId();
  return <div {...props} className={classes("pk-code-block", className)}>
    <div className="pk-code-block-header">
      <span id={id} className="pk-code-block-language">{language?.trim() || labels.plainText}</span>
      <CopyAction text={code} size="xs" variant="ghost" copyingMessage={labels.copying} copiedMessage={labels.copied} errorMessage={labels.copyFailed}>{labels.copy}</CopyAction>
    </div>
    <pre dir="ltr" tabIndex={0} role="region" aria-label={labels.code} aria-describedby={id}><code>{code}</code></pre>
  </div>;
}
