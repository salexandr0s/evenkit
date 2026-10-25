"use client";

import { AuditViewer, PageHeader, Stack, type AuditViewerProps } from "@evenkit/ui";

/** Supply a scoped loader and an export callback; this page never changes audit records. */
export function AuditPage(props: AuditViewerProps) {
  return <Stack gap="6">
    <PageHeader title="Audit history" headingAs="h2" description="Search recorded activity and inspect the details of each event." metadata={`Times shown in ${props.timeZone}.`} />
    <AuditViewer {...props} />
  </Stack>;
}
