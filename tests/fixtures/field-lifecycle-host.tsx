import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Checkbox, DatePicker, DateRangePicker, MultiSelect, RadioGroup, SegmentedControl, SelectField, Switch, TokenInput } from "@evenkit/ui";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

function FieldLifecycleHost() {
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  function schedule(update: () => void) {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => { timer.current = null; update(); }, 500);
  }
  return <main>
    <h1>Field lifecycle host</h1>
    <Button onClick={() => schedule(() => setReadOnly(true))}>Schedule read-only</Button>
    <Button onClick={() => schedule(() => setDisabled(true))}>Schedule disabled</Button>
    <Button onClick={() => { setReadOnly(false); setDisabled(false); }}>Resume editing</Button>
    <form aria-label="Host form">
      <fieldset data-testid="host-fieldset"><legend>Host fields</legend>
        <div data-field="date"><DatePicker label="Host date" name="date" defaultValue="2026-10-26" today="2026-10-25" readOnly={readOnly} disabled={disabled} /></div>
        <div data-field="range"><DateRangePicker label="Host range" startName="start" endName="end" defaultValue={{ start: "2026-10-26", end: "2026-10-29" }} today="2026-10-25" readOnly={readOnly} disabled={disabled} /></div>
        <div data-field="multi"><MultiSelect label="Host members" name="members" defaultValue={["alpha"]} options={[{ value: "alpha", label: "Alpha" }, { value: "beta", label: "Beta" }]} readOnly={readOnly} disabled={disabled} /></div>
        <TokenInput label="Host labels" name="labels" defaultValue={["Planning"]} readOnly={readOnly} disabled={disabled} />
      </fieldset>
    </form>
    <ChoiceResetHost />
  </main>;
}

function ChoiceResetHost() {
  const [value, setValue] = useState("a");
  const [checked, setChecked] = useState(true);
  const [mode, setMode] = useState("accept");
  const [cancel, setCancel] = useState(false);
  const [owner, setOwner] = useState("choice-owner");
  const [defaults, setDefaults] = useState("a");
  const [events, setEvents] = useState<string[]>([]);
  const [changes, setChanges] = useState<string[]>([]);
  const options = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }, { value: "c", label: "Gamma" }];
  const log = (name: string, next: string | boolean) => setEvents(previous => [...previous, `${name}:${next}`]);
  return <section aria-label="Choice reset host" onChange={event => {
    if (event.target instanceof HTMLInputElement) setChanges(previous => [...previous, (event.target as HTMLInputElement).name]);
  }}>
    <form id="choice-owner" onReset={event => { if (cancel) event.preventDefault(); }} />
    <form id="other-owner" onReset={event => { if (cancel) event.preventDefault(); }} />
    <SelectField label="Reset select" name="select" form={owner} options={options} defaultValue={defaults} onValueChange={next => log("select", next)} />
    <Checkbox label="Reset checkbox" name="checkbox" form={owner} defaultChecked onCheckedChange={next => log("checkbox", next)} />
    <RadioGroup label="Reset radio" name="radio" form={owner} options={options} defaultValue={defaults} onValueChange={next => log("radio", next)} />
    <SegmentedControl label="Reset segment" name="segment" form={owner} options={options} defaultValue={defaults} onValueChange={next => log("segment", next)} />
    <Switch label="Reset switch" name="switch" form={owner} defaultChecked onCheckedChange={next => log("switch", next)} />
    <SelectField label="Controlled reset select" name="controlled" form={owner} options={options} value={value} onValueChange={next => { log("controlled", next); if (mode !== "ignore") setValue(mode === "override" ? "c" : next); }} />
    <Checkbox label="Controlled reset checkbox" name="controlled-checkbox" form={owner} checked={checked} onCheckedChange={next => { log("controlled-checkbox", next); if (mode === "accept") setChecked(next === true); }} />
    <Button onClick={() => setMode("accept")}>Accept change callbacks</Button>
    <Button onClick={() => setMode("ignore")}>Ignore reset callback</Button>
    <Button onClick={() => setMode("override")}>Override reset callback</Button>
    <Button onClick={() => setCancel(previous => !previous)}>Toggle reset cancellation</Button>
    <Button onClick={() => { setOwner("other-owner"); setDefaults("c"); }}>Move form ownership and defaults</Button>
    <Button form={owner} type="reset">Reset choices</Button>
    <output data-testid="choice-events">{JSON.stringify(events)}</output>
    <output data-testid="choice-changes">{JSON.stringify(changes)}</output>
  </section>;
}

const root = document.getElementById("root");
if (!root) throw new Error("The field lifecycle host root is missing.");
createRoot(root).render(<FieldLifecycleHost />);
