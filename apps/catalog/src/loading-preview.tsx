import { useEffect, useRef, useState } from "react";
import { foundation } from "@evenkit/tokens";
import { Button, FolderIcon, RotateCcwIcon, Skeleton, Spinner } from "@evenkit/ui";
import "./loading-preview.css";

const sizes = [
  { size: "sm", label: "Small", textHeight: foundation.font.size.xs },
  { size: "md", label: "Medium", textHeight: foundation.font.size.sm },
  { size: "lg", label: "Large", textHeight: foundation.font.size.base },
] as const;

export function LoadingPreview() {
  const [loading, setLoading] = useState(false);
  const reloadTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(reloadTimer.current), []);

  function reload() {
    window.clearTimeout(reloadTimer.current);
    setLoading(true);
    reloadTimer.current = window.setTimeout(() => {
      reloadTimer.current = undefined;
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="loading-workbench">
      <section className="loading-section" aria-label="Project loading example">
        <div className="loading-section-heading"><h3>Reload a project</h3><p>The placeholders keep the card's shape while the sample project reloads. Reload again to restart the wait.</p></div>
        <div className="loading-live-example">
          <div><Button variant="outline" aria-busy={loading} startIcon={loading ? <Spinner size="sm" aria-hidden="true" /> : <RotateCcwIcon size="sm" />} onClick={reload}>Reload project</Button></div>
          <p className="loading-live-status" role="status" aria-label="Project loading status" aria-atomic="true">{loading ? "Loading project details…" : "Project details ready."}</p>
          <div className="loading-project-card" role="region" aria-label="Project details" aria-busy={loading} data-loading={loading}>
            <div className="loading-project-content" aria-hidden={loading || undefined}>
              <div className="loading-project-header">
                <span className="loading-project-avatar" aria-hidden="true"><FolderIcon /></span>
                <div className="loading-project-intro"><h4>Spring launch</h4><p>Product workspace</p></div>
              </div>
              <p className="loading-project-description">Coordinate the release notes, project review, and team handover.</p>
              <dl className="loading-project-meta"><div><dt>Owner</dt><dd>Maya Chen</dd></div><div><dt>Open tasks</dt><dd>12 tasks</dd></div></dl>
            </div>
            {loading && <div className="loading-project-placeholder" aria-hidden="true">
              <div className="loading-project-header"><Skeleton variant="avatar" size="md" /><div className="loading-placeholder-intro"><Skeleton variant="text" size="lg" /><Skeleton variant="text" size="sm" /></div></div>
              <div className="loading-placeholder-description"><Skeleton variant="text" /><Skeleton variant="text" /><Skeleton variant="text" /></div>
              <div className="loading-placeholder-meta"><Skeleton variant="block" /><Skeleton variant="block" /></div>
            </div>}
          </div>
          <p className="loading-caption">Fictional project data. No service is contacted.</p>
        </div>
      </section>

      <section className="loading-section" aria-label="Spinner sizes">
        <div className="loading-section-heading"><h3>Small indicators for short waits</h3><p>Use one status message for the operation. These spinner samples are decorative.</p></div>
        <ul className="loading-spinner-samples" role="list">
          {sizes.map(({ size, label }) => <li key={size}><span className="loading-spinner-slot"><Spinner size={size} aria-hidden="true" /></span><span className="loading-sample-description"><span>{label}</span><span>{foundation.icon.size[size]}</span></span></li>)}
        </ul>
        <p className="loading-caption">Motion follows your device's reduced-motion preference.</p>
      </section>

      <section className="loading-section" aria-label="Skeleton shapes">
        <div className="loading-section-heading"><h3>Match the content that will arrive</h3><p>Text, avatar, and block placeholders reserve space without adding another announcement.</p></div>
        <div className="loading-shape-grid">
          <div className="loading-shape-card"><h4>Text</h4><div className="loading-shape-samples">{sizes.map(({ size, label, textHeight }) => <div key={size}><span className="loading-sample-description"><span>{label}</span><span>{textHeight}</span></span><Skeleton variant="text" size={size} /></div>)}</div></div>
          <div className="loading-shape-card"><h4>Avatar</h4><div className="loading-shape-samples">{sizes.map(({ size, label }) => <div key={size}><span className="loading-sample-description"><span>{label}</span><span>{foundation.control.height[size]}</span></span><Skeleton variant="avatar" size={size} /></div>)}</div></div>
          <div className="loading-shape-card"><h4>Block</h4><div className="loading-shape-samples">{sizes.map(({ size, label }) => <div key={size}><span className="loading-sample-description"><span>{label}</span><span>{foundation.control.height[size]} minimum</span></span><Skeleton variant="block" size={size} /></div>)}</div></div>
        </div>
      </section>
    </div>
  );
}
