"use client";

import { AuditViewer, type AuditViewerProps } from "@evenkit/ui";

/** Supply a scoped loader and an export callback; this page never changes audit records. */
export function AuditPage(props: AuditViewerProps) {
  return <AuditViewer {...props} />;
}
