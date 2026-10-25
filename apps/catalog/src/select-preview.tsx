import { useRef, useState, type FormEvent } from "react";
import { ActionMessage, Button, SelectField, type SelectOption, type SelectOptionGroup } from "@evenkit/ui";
import "./select-preview.css";

const visibilityOptions = [
  { value: "private", label: "Private" },
  { value: "team", label: "Team" },
  { value: "public", label: "Public" },
] as const;
const templateOptions: readonly (SelectOption | SelectOptionGroup)[] = [
  { value: "blank", label: "Blank project", description: "Start with an empty project." },
  {
    id: "team", label: "Team templates", options: [
      { value: "product", label: "Product launch", description: "Plan milestones, owners, and launch tasks." },
      { value: "internal", label: "Internal review", description: "Available to workspace administrators.", disabled: true },
    ],
  },
  {
    id: "delivery", label: "Delivery templates", options: [
      { value: "client", label: "Client handover", description: "Package deliverables and approvals for a client." },
    ],
  },
];
const longOptions = [
  { value: "standard", label: "Standard delivery" },
  { value: "extended", label: "Quarterly planning and cross-functional delivery coordination", description: "Coordinate milestones, dependencies, and handovers across every delivery team." },
] as const;

export function SelectPreview() {
  const templateRef = useRef<HTMLButtonElement>(null);
  const [visibility, setVisibility] = useState("private");
  const [formValue, setFormValue] = useState<string>();
  const [template, setTemplate] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [templateValue, setTemplateValue] = useState<string>();
  const [loaded, setLoaded] = useState(false);
  const [preset, setPreset] = useState("");
  const presetOptions: readonly SelectOptionGroup[] = [{
    id: "presets", label: "Workspace presets", options: loaded ? [{ value: "starter", label: "Starter preset" }] : [],
  }];

  function readVisibility(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("visibility");
    setFormValue(typeof value === "string" ? value : "");
  }

  function submitTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    setTemplateValue(undefined);
    if (!template) {
      templateRef.current?.focus();
      return;
    }
    const value = new FormData(event.currentTarget).get("template");
    setTemplateValue(typeof value === "string" ? value : "");
  }

  function resetTemplate() {
    setTemplate("");
    setAttempted(false);
    setTemplateValue(undefined);
    templateRef.current?.focus();
  }

  return (
    <div className="select-workbench">
      <section className="select-section" aria-label="Grouped selection example">
        <div className="select-section-heading"><h3>Give each choice context</h3><p>Groups help people scan related options. Descriptions explain what a selection includes.</p></div>
        <form className="select-preview-form" noValidate onSubmit={submitTemplate}>
          <SelectField
            ref={templateRef}
            id="preview-template"
            name="template"
            label="Project template"
            required
            options={templateOptions}
            value={template}
            onValueChange={(value) => { setTemplate(value); setTemplateValue(undefined); }}
            placeholder="Choose a template"
            hint="Choose a starting point for your team."
            error={attempted && !template ? "Choose a project template." : undefined}
            aria-describedby="template-note"
          />
          <p className="select-caption" id="template-note">This choice affects the local preview only.</p>
          <div className="catalog-demo-actions"><Button type="submit">Use template</Button><Button type="button" variant="outline" onClick={resetTemplate}>Reset template</Button></div>
          {templateValue !== undefined && <ActionMessage tone={templateValue ? "success" : "error"}>{templateValue ? `Template value: ${templateValue}.` : "No template value was included in the preview form."}</ActionMessage>}
        </form>
      </section>

      <section className="select-section" aria-label="Basic selection example">
        <div className="select-section-heading"><h3>A focused list of options</h3><p>Use a flat list when the choices need little explanation.</p></div>
        <form className="select-basic-form" onSubmit={readVisibility}>
          <SelectField id="preview-visibility" name="visibility" label="Project visibility" required value={visibility} options={visibilityOptions} onValueChange={(value) => { setVisibility(value); setFormValue(undefined); }} hint={`Selected in this preview: ${visibility}.`} />
          <SelectField id="preview-region" label="Region" disabled defaultValue="eu" options={[{ value: "eu", label: "Europe" }]} hint="Disabled selection example." />
          <div><Button type="submit">Read selection</Button></div>
          {formValue !== undefined && <ActionMessage tone={formValue ? "info" : "error"}>{formValue ? `Form value: ${formValue}.` : "No selection value was included in this preview form."}</ActionMessage>}
        </form>
      </section>

      <section className="select-section" aria-label="Empty selection example">
        <div className="select-section-heading"><h3>Explain an empty list</h3><p>Open the menu while no presets are available, then load a sample to try selection.</p></div>
        <div className="select-example-stack">
          <SelectField label="Available presets" options={presetOptions} value={preset} onValueChange={setPreset} placeholder="Choose a preset" emptyMessage="No presets are available yet." hint="Sample presets live in this preview." />
          <div className="catalog-demo-actions">
            <Button variant="outline" disabled={loaded} onClick={() => setLoaded(true)}>Load sample presets</Button>
            <Button variant="ghost" disabled={!loaded} onClick={() => { setLoaded(false); setPreset(""); }}>Reset presets</Button>
          </div>
          <p className="select-caption" role="status">{preset ? "Selected preset: starter." : loaded ? "One sample preset is available." : "No sample presets loaded."}</p>
        </div>
      </section>

      <section className="select-section" aria-label="Selection layout examples">
        <div className="select-section-heading"><h3>Allow room for the label</h3><p>Long options wrap, and right-to-left controls keep their text and indicators aligned.</p></div>
        <div className="select-example-grid">
          <SelectField label="Long option labels" controlSize="lg" options={longOptions} defaultValue="standard" hint="A large control with a longer option and description." />
          <SelectField label="Right-to-left selection" dir="rtl" options={visibilityOptions} defaultValue="team" hint="A right-to-left control inside this left-to-right page." />
        </div>
      </section>
    </div>
  );
}
