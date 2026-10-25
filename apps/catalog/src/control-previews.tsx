import { useState } from "react";
import { ActionMessage, Badge, Button, EmptyState, Skeleton, Spinner } from "@project-kit/ui";

export function StatusPreview() {
  return (
    <div className="catalog-demo-stack">
      <div>
        <p className="catalog-state-label">Badges</p>
        <div className="catalog-demo-actions">
          <Badge>Draft</Badge><Badge tone="accent">In progress</Badge>
          <Badge tone="success">Active</Badge><Badge tone="warning">Needs review</Badge>
          <Badge tone="danger">Failed</Badge>
        </div>
      </div>
      <div className="catalog-demo-divider catalog-demo-stack">
        <p className="catalog-state-label">Persistent feedback</p>
        <ActionMessage tone="success">Your preview is ready to review.</ActionMessage>
        <ActionMessage tone="info">Changes remain in this preview.</ActionMessage>
        <ActionMessage tone="error">Example failure: your changes could not be saved. Try again.</ActionMessage>
      </div>
    </div>
  );
}

export function LoadingPreview() {
  return (
    <div className="catalog-demo-stack">
      <div className="catalog-demo-actions"><Spinner label="Loading projects" /><span>Loading projects</span></div>
      <div className="catalog-demo-divider">
        <p className="catalog-state-label">Content placeholder</p>
        <div className="catalog-skeleton-card" aria-label="Loading project details" aria-busy="true">
          <Skeleton className="catalog-skeleton-avatar" />
          <div className="catalog-skeleton-lines"><Skeleton /><Skeleton /><Skeleton /></div>
        </div>
      </div>
      <p className="catalog-caption">Motion follows the reduced-motion preference on your device.</p>
    </div>
  );
}

export function EmptyPreview() {
  const [created, setCreated] = useState(false);
  const [recovered, setRecovered] = useState(false);
  return (
    <div className="catalog-demo-stack">
      {created ? <ActionMessage tone="success">A preview project is ready. No project was created outside this catalog.</ActionMessage> : (
        <EmptyState title="No projects yet" description="Create a project to bring your work together." action={<Button onClick={() => setCreated(true)}>Create preview project</Button>} />
      )}
      <div className="catalog-demo-divider">
        {recovered ? <ActionMessage tone="success">The retry preview succeeded. No external service was contacted.</ActionMessage> : (
          <EmptyState title="Projects could not be loaded" description="This is a recoverable error example. Try the action to see the success state." action={<Button variant="outline" onClick={() => setRecovered(true)}>Retry preview</Button>} />
        )}
      </div>
      {(created || recovered) && <Button variant="ghost" onClick={() => { setCreated(false); setRecovered(false); }}>Reset example</Button>}
    </div>
  );
}
