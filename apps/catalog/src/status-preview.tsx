import { useEffect, useRef, useState } from "react";
import { ActionMessage, Badge, Button, CheckIcon, CircleAlertIcon, CircleCheckIcon, ClockIcon, MailIcon, TriangleAlertIcon } from "@project-kit/ui";
import "./status-preview.css";

type ExportState = "error" | "retrying" | "success" | "dismissed";

export function StatusPreview() {
  const [exportState, setExportState] = useState<ExportState>("error");
  const retryTimer = useRef<number | undefined>(undefined);
  const retryRef = useRef<HTMLButtonElement>(null);
  const dismissRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(retryTimer.current), []);

  function cancelRetry() {
    window.clearTimeout(retryTimer.current);
    retryTimer.current = undefined;
  }

  function retryExport() {
    if (retryTimer.current !== undefined || exportState !== "error") return;
    if (document.activeElement === retryRef.current) dismissRef.current?.focus();
    setExportState("retrying");
    retryTimer.current = window.setTimeout(() => {
      retryTimer.current = undefined;
      setExportState("success");
    }, 900);
  }

  function dismiss() {
    cancelRetry();
    setExportState("dismissed");
    resetRef.current?.focus();
  }

  function reset() {
    cancelRetry();
    setExportState("error");
  }

  const retrying = exportState === "retrying";
  const ready = exportState === "success";

  return (
    <div className="status-workbench">
      <section className="status-section" aria-label="Badge examples">
        <div className="status-section-heading"><h3>Labels for state and progress</h3><p>Pair a short label with a tone, dot, or decorative icon.</p></div>
        <div className="status-badge-group">
          <span className="status-sample-label">Soft tones</span>
          <div className="status-badge-row"><Badge>Draft</Badge><Badge tone="accent" icon={<ClockIcon />}>In progress</Badge><Badge tone="success" dot>Active</Badge><Badge tone="warning" icon={<TriangleAlertIcon />}>Needs review</Badge><Badge tone="danger" icon={<CircleAlertIcon />}>Failed</Badge></div>
        </div>
        <div className="status-badge-group">
          <span className="status-sample-label">Outline and icons</span>
          <div className="status-badge-row"><Badge variant="outline">Archived</Badge><Badge tone="accent" variant="outline" icon={<ClockIcon />}>Scheduled</Badge><Badge tone="success" variant="outline" icon={<CircleCheckIcon />} dot>Approved</Badge><Badge tone="warning" variant="outline">Pending</Badge><Badge tone="danger" variant="outline" icon={<CircleAlertIcon />}>Blocked</Badge></div>
        </div>
        <div className="status-badge-details">
          <div className="status-badge-group"><span className="status-sample-label">Sizes</span><div className="status-badge-row"><Badge size="sm">Small</Badge><Badge size="md">Medium</Badge></div></div>
          <div className="status-badge-group"><span className="status-sample-label">Counts</span><div className="status-badge-row"><span className="status-badge-count">Open tasks <Badge size="sm" tone="accent">12</Badge></span><span className="status-badge-count">Reviews <Badge size="sm">3</Badge></span></div></div>
          <div className="status-badge-group"><span className="status-sample-label">Inline icon children</span><div className="status-badge-row"><Badge tone="success"><CheckIcon size="sm" />Reviewed</Badge></div></div>
          <div className="status-badge-group"><span className="status-sample-label">Right to left</span><Badge tone="success" icon={<CircleCheckIcon />} dir="rtl" lang="he">אושר</Badge></div>
          <div className="status-badge-group status-long-badge"><span className="status-sample-label">Longer labels</span><Badge tone="warning" icon={<ClockIcon />}>Awaiting approval from the regional operations team</Badge></div>
        </div>
        <div className="status-badge-group status-project-group">
          <span className="status-sample-label">In a project list</span>
          <ul className="status-project-list" aria-label="Example project statuses">
            <li><span>Website refresh</span><Badge tone="warning" icon={<TriangleAlertIcon />}>In review</Badge></li>
            <li><span>Customer portal</span><Badge tone="success" icon={<CircleCheckIcon />}>Ready</Badge></li>
            <li><span>Billing migration</span><Badge tone="accent" icon={<ClockIcon />}>Scheduled</Badge></li>
          </ul>
        </div>
      </section>

      <section className="status-section" aria-label="Message tone examples">
        <div className="status-section-heading"><h3>Short status messages</h3><p>Icons distinguish success, information, warnings, and errors.</p></div>
        <div className="status-message-stack">
          <ActionMessage role="note" tone="success">Your preview is ready to review.</ActionMessage>
          <ActionMessage role="note" tone="info">Changes remain in this preview.</ActionMessage>
          <ActionMessage role="note" tone="warning">Check the project name and recipients before sharing.</ActionMessage>
          <ActionMessage role="note" tone="error">Example failure: your changes could not be saved. Try again.</ActionMessage>
        </div>
      </section>

      <section className="status-section" aria-label="Export recovery example">
        <div className="status-section-heading"><h3>Recover from an error</h3><p>Retry the sample export or dismiss the message. This example stays in your browser.</p></div>
        {exportState === "dismissed" ? <p className="status-dismissed" role="status">Message dismissed.</p> : (
          <ActionMessage
            tone={ready ? "success" : retrying ? "info" : "error"}
            heading={<h4>{ready ? "Export ready" : retrying ? "Retrying export" : "Export did not finish"}</h4>}
            actions={<>
              {!ready && <Button key="retry" ref={retryRef} size="sm" variant="outline" loading={retrying} onClick={retryExport}>Retry export</Button>}
              <Button key="dismiss" ref={dismissRef} size="sm" variant="ghost" onClick={dismiss}>Dismiss message</Button>
            </>}
          >
            {ready ? "The sample export is ready. No file was created or downloaded." : retrying ? "Preparing the fictional project export in this preview…" : "The fictional project export could not be prepared. Retry to preview recovery; no service is contacted."}
          </ActionMessage>
        )}
        <div><Button ref={resetRef} size="sm" variant="outline" onClick={reset}>Reset example</Button></div>
      </section>

      <section className="status-section" aria-label="Static message examples">
        <div className="status-section-heading"><h3>Context without an interruption</h3><p>These static examples use a note role. The recovery example above announces changes.</p></div>
        <div className="status-message-grid">
          <ActionMessage role="note" tone="warning" heading={<h4>Review before sharing</h4>}>
            <p>Check the project name and recipients before sharing the next update.</p>
          </ActionMessage>
          <ActionMessage role="note" tone="info" icon={<MailIcon />} heading={<h4>Notification preview</h4>}>
            <p>A custom icon can describe the message. No email will be sent from this example.</p>
          </ActionMessage>
          <ActionMessage role="note" tone="info" icon={false} heading={<h4>Text without an icon</h4>}>
            <p>Use a quiet note when the surrounding content already explains its purpose.</p>
          </ActionMessage>
          <ActionMessage role="note" tone="warning" dir="rtl" lang="he" heading={<h4>בדקו לפני השיתוף</h4>}>
            <p>ודאו ששם הפרויקט ורשימת הנמענים נכונים לפני שיתוף העדכון עם הצוות.</p>
          </ActionMessage>
        </div>
      </section>
    </div>
  );
}
