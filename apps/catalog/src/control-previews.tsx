import { useState } from "react";
import { ActionMessage, Button, EmptyState, Skeleton, Spinner } from "@project-kit/ui";

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
