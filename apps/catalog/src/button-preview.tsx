import { useEffect, useRef, useState } from "react";
import { ActionMessage, ArrowRightIcon, Button, ButtonLink, CheckIcon, MailIcon, PlusIcon, SearchIcon, Tooltip, TooltipContent, TooltipTrigger, type ButtonSize } from "@evenkit/ui";
import "./button-preview.css";

const buttonSizes: readonly { size: ButtonSize; label: string }[] = [
  { size: "xs", label: "Extra small" },
  { size: "sm", label: "Small" },
  { size: "md", label: "Medium" },
  { size: "lg", label: "Large" },
];

export function ButtonPreview() {
  const [clicks, setClicks] = useState(0);
  const [action, setAction] = useState("");
  const [projects, setProjects] = useState(0);
  const [notifications, setNotifications] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saves, setSaves] = useState(0);
  const saveTimer = useRef<number | undefined>(undefined);
  const inFlight = useRef(false);

  useEffect(() => () => {
    window.clearTimeout(saveTimer.current);
    inFlight.current = false;
  }, []);

  function save() {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    saveTimer.current = window.setTimeout(() => {
      inFlight.current = false;
      setSaving(false);
      setSaves((value) => value + 1);
    }, 1200);
  }

  return (
    <div className="button-workbench">
      <section className="button-section" aria-label="Button variants">
        <div className="button-section-heading"><h3>Choose an action's emphasis</h3><p>Use a primary button for the main action. Give supporting actions less weight.</p></div>
        <div className="button-variants">
          <div><span>Primary</span><Button onClick={() => setClicks((value) => value + 1)}>Primary action</Button></div>
          <div><span>Secondary</span><Button variant="secondary" onClick={() => setAction("Secondary action activated in this preview.")}>Secondary</Button></div>
          <div><span>Outline</span><Button variant="outline" onClick={() => setAction("Outline action activated in this preview.")}>Outline</Button></div>
          <div><span>Ghost</span><Button variant="ghost" onClick={() => setAction("Ghost action activated in this preview.")}>Ghost</Button></div>
          <div><span>Destructive</span><Button variant="destructive" onClick={() => setAction("Destructive action previewed. No data was deleted.")}>Destructive</Button></div>
          <div><span>Link</span><ButtonLink variant="link" href="#fields">View fields</ButtonLink></div>
        </div>
        <p className="button-caption" role="status">{clicks ? `Primary action activated ${clicks} ${clicks === 1 ? "time" : "times"}.` : "Try the primary action. This example stays in your browser."}</p>
      </section>

      <section className="button-section button-save-example" aria-label="Saving example">
        <div className="button-save-copy"><h3>Save without a second submission</h3><p>The label keeps its space while the spinner appears. Try saving with the keyboard.</p></div>
        <div className="button-save-control">
          <Button startIcon={<CheckIcon />} loading={saving} onClick={save}>Save changes</Button>
          <p className="button-caption" role="status">{saving ? "Saving changes in this preview…" : saves > 0 ? `Preview saved ${saves} ${saves === 1 ? "time" : "times"}.` : "Changes are saved in this preview only."}</p>
        </div>
      </section>

      <section className="button-section" aria-label="Button sizes and shapes">
        <div className="button-section-heading"><h3>Size and shape</h3><p>Text actions grow with their labels. Icon actions stay square and use a name on the button.</p></div>
        <div className="button-size-grid">
          {buttonSizes.map(({ size, label }) => (
            <div key={size}>
              <span>{label}</span>
              <div className="button-size-samples">
                <Button size={size} variant="outline" onClick={() => setAction(`${label} button activated in this preview.`)}>{label}</Button>
                <Tooltip><TooltipTrigger asChild><Button size={size} shape="icon" variant={size === "xs" ? "ghost" : "outline"} aria-label={`${label} icon action`} onClick={() => setAction(`${label} icon action activated in this preview.`)}><PlusIcon size={size === "xs" ? "sm" : size} /></Button></TooltipTrigger><TooltipContent>{label} icon action</TooltipContent></Tooltip>
              </div>
              <code>size="{size}"</code>
            </div>
          ))}
        </div>
      </section>

      <section className="button-section" aria-label="Buttons with icons">
        <div className="button-section-heading"><h3>Icons with a purpose</h3><p>Leading and trailing icons support the text. Navigation uses a link.</p></div>
        <div className="button-icon-actions">
          <div><Button startIcon={<PlusIcon />} onClick={() => setProjects((value) => value + 1)}>Create project</Button><p className="button-caption" role="status">{projects === 0 ? "Add a project to this local example." : `${projects} preview ${projects === 1 ? "project" : "projects"} created.`}</p></div>
          <div><ButtonLink variant="outline" href="#tokens" endIcon={<ArrowRightIcon />}>Explore tokens</ButtonLink><p className="button-caption">Open the token reference.</p></div>
          <div><Tooltip><TooltipTrigger asChild><ButtonLink variant="ghost" href="#icons" shape="icon" fullWidth aria-label="Browse icons"><SearchIcon /></ButtonLink></TooltipTrigger><TooltipContent>Browse icons</TooltipContent></Tooltip><p className="button-caption">Browse the icon library.</p></div>
        </div>
        <div className="button-toggle-row">
          <Tooltip><TooltipTrigger asChild><Button shape="icon" variant="outline" aria-label="Email notifications" aria-pressed={notifications} onClick={() => setNotifications((value) => !value)}><MailIcon /></Button></TooltipTrigger><TooltipContent>Email notifications</TooltipContent></Tooltip>
          <div><strong>Email notifications</strong><p className="button-caption" role="status">Email notifications are {notifications ? "on" : "off"}.</p></div>
        </div>
      </section>

      <section className="button-section button-width-example" aria-label="Full width button">
        <div className="button-section-heading"><h3>Room for longer labels</h3><p>Use the available width and let text wrap without shrinking its icon.</p></div>
        <Button fullWidth endIcon={<ArrowRightIcon />} onClick={() => setAction("Workspace selected in this preview.")}>Continue with this workspace and invite the rest of your team</Button>
      </section>

      <section className="button-section" aria-label="Disabled and busy buttons">
        <div className="button-section-heading"><h3>Disabled and busy</h3><p>A loading button prevents repeat activation. A background task can mark a control busy while leaving it available.</p></div>
        <div className="catalog-demo-actions">
          <Button disabled>Disabled action</Button>
          <Button loading>Loading state</Button>
          <Button variant="outline" aria-busy="true" onClick={() => setAction("The control stays available during the background update example.")}>Background update</Button>
        </div>
      </section>
      {action && <ActionMessage tone="info">{action}</ActionMessage>}
    </div>
  );
}
