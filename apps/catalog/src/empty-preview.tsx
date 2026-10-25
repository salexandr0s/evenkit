import { useId, useRef, useState } from "react";
import { ActionMessage, Badge, Button, CircleAlertIcon, EmptyState, FolderIcon, SearchIcon, TextField } from "@evenkit/ui";
import "./empty-preview.css";

const projects = [
  { name: "Spring launch", description: "Product plans and launch checklist", archived: false },
  { name: "Research library", description: "Interview notes and research summaries", archived: false },
  { name: "Budget report", description: "Archived quarterly budget review", archived: true },
];

type FirstUseState = "empty" | "created" | "template";

export function EmptyPreview() {
  const [firstUseState, setFirstUseState] = useState<FirstUseState>("empty");
  const [query, setQuery] = useState("Budget report");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [troubleshooting, setTroubleshooting] = useState(false);
  const firstUseResetRef = useRef<HTMLButtonElement>(null);
  const failureResetRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const troubleshootingId = useId();
  const matchingProjects = projects.filter((project) =>
    (includeArchived || !project.archived) && project.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function createProject(nextState: Exclude<FirstUseState, "empty">) {
    firstUseResetRef.current?.focus();
    setFirstUseState(nextState);
  }

  function clearSearch() {
    setQuery("");
    searchRef.current?.focus();
  }

  function showArchived() {
    searchRef.current?.focus();
    setIncludeArchived(true);
  }

  function resetSearch() {
    setQuery("Budget report");
    setIncludeArchived(false);
    searchRef.current?.focus();
  }

  function retry() {
    failureResetRef.current?.focus();
    setTroubleshooting(false);
    setRecovered(true);
  }

  return (
    <div className="empty-workbench">
      <section className="empty-section" aria-label="First-use example">
        <div className="empty-section-heading"><h3>Start a workspace</h3><p>Give people a clear first step and a useful alternative.</p></div>
        {firstUseState === "empty" ? (
          <EmptyState
            icon={<FolderIcon />}
            titleAs="h4"
            title="No projects yet"
            description="Create a project for your work, or start with a planning template."
            action={<Button onClick={() => createProject("created")}>Create preview project</Button>}
            secondaryAction={<Button variant="outline" onClick={() => createProject("template")}>Use a template</Button>}
          />
        ) : (
          <ActionMessage tone="success">
            {firstUseState === "created"
              ? "A preview project is ready. No project was created outside this catalog."
              : "The planning template is ready in this preview. No project was created outside this catalog."}
          </ActionMessage>
        )}
        <div><Button ref={firstUseResetRef} size="sm" variant="ghost" onClick={() => setFirstUseState("empty")}>Reset first-use example</Button></div>
      </section>

      <section className="empty-section" aria-label="No-results example">
        <div className="empty-section-heading"><h3>Find a project</h3><p>Let people change the search or expand the results without losing their place.</p></div>
        <div className="empty-search-example">
          <TextField
            ref={searchRef}
            type="search"
            label="Search projects"
            hint={includeArchived ? "Searching active and archived projects." : "Searching active projects only."}
            startAdornment={<SearchIcon />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className="empty-result-count" role="status" aria-label="Project search status" aria-atomic="true">
            {matchingProjects.length} {matchingProjects.length === 1 ? "project" : "projects"} found.
          </p>
          {matchingProjects.length === 0 ? (
            <EmptyState
              icon={<SearchIcon />}
              titleAs="h4"
              title="No matching projects"
              description={includeArchived
                ? "No project names match this search. Clear it to see all projects."
                : "No active project names match this search. Clear it or include archived projects."}
              size="sm"
              align="start"
              action={<Button size="sm" variant="outline" onClick={clearSearch}>Clear search</Button>}
              secondaryAction={!includeArchived ? <Button size="sm" variant="ghost" onClick={showArchived}>Include archived</Button> : undefined}
            />
          ) : (
            <ul className="empty-project-results" role="list" aria-label="Matching projects">
              {matchingProjects.map((project) => (
                <li key={project.name}>
                  <span className="empty-result-icon" aria-hidden="true"><FolderIcon /></span>
                  <div className="empty-result-details"><h4>{project.name}</h4><p>{project.description}</p></div>
                  <Badge size="sm" tone={project.archived ? "neutral" : "success"} variant="outline">{project.archived ? "Archived" : "Active"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div><Button size="sm" variant="ghost" onClick={resetSearch}>Reset search example</Button></div>
      </section>

      <section className="empty-section" aria-label="Recoverable failure example">
        <div className="empty-section-heading"><h3>Recover from a failed request</h3><p>Offer a retry and practical help when content cannot be loaded.</p></div>
        {recovered ? (
          <ActionMessage tone="success">The retry preview succeeded. No external service was contacted.</ActionMessage>
        ) : (
          <div className="empty-failure-example">
            <EmptyState
              icon={<CircleAlertIcon />}
              titleAs="h4"
              title="Projects could not be loaded"
              description="Your projects are still here. Retry the preview or open the troubleshooting steps."
              action={<Button onClick={retry}>Retry preview</Button>}
              secondaryAction={<Button variant="outline" aria-expanded={troubleshooting} aria-controls={troubleshootingId} onClick={() => setTroubleshooting((expanded) => !expanded)}>{troubleshooting ? "Hide troubleshooting" : "Show troubleshooting"}</Button>}
            />
            <div id={troubleshootingId} className="empty-troubleshooting" hidden={!troubleshooting}>
              <h4>Troubleshooting steps</h4>
              <ol><li>Check that you have an internet connection.</li><li>Retry the request once the connection is available.</li><li>If it still fails, contact your workspace administrator.</li></ol>
              <p>This example uses fictional data. The retry succeeds locally.</p>
            </div>
          </div>
        )}
        <div><Button ref={failureResetRef} size="sm" variant="ghost" onClick={() => { setRecovered(false); setTroubleshooting(false); }}>Reset failure example</Button></div>
      </section>

      <section className="empty-section" aria-label="RTL empty-state example">
        <div className="empty-section-heading"><h3>A compact alternative</h3><p>A single secondary action can be enough. This example uses a right-to-left layout.</p></div>
        <div className="empty-rtl-example" dir="rtl">
          <EmptyState
            size="sm"
            align="start"
            titleAs="h4"
            title="No project selected"
            description="Return to the project search to find a project in this workspace."
            secondaryAction={<Button size="sm" variant="outline" onClick={resetSearch}>Search projects again</Button>}
          />
        </div>
      </section>
    </div>
  );
}
