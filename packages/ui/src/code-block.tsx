"use client";

import { useId, type ComponentPropsWithoutRef } from "react";
import { classes } from "./classes.js";
import { CopyAction } from "./selection-controls.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip.js";

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
      <span className="pk-code-block-feedback-space" aria-hidden="true">
        <span>{labels.copying}</span><span>{labels.copied}</span><span>{labels.copyFailed}</span>
      </span>
      <TooltipProvider><Tooltip><TooltipTrigger asChild>
        <CopyAction text={code} size="xs" variant="ghost" shape="icon" aria-label={labels.copy}
          copyingMessage={labels.copying} copiedMessage={labels.copied} errorMessage={labels.copyFailed}>{null}</CopyAction>
      </TooltipTrigger><TooltipContent>{labels.copy}</TooltipContent></Tooltip></TooltipProvider>
    </div>
    <pre dir="ltr" tabIndex={0} role="region" aria-label={labels.code} aria-describedby={id}><code>{code}</code></pre>
  </div>;
}
