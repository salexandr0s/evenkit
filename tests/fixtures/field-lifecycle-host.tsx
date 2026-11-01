import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, DatePicker, DateRangePicker, MultiSelect, TokenInput } from "@evenkit/ui";
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
  </main>;
}

const root = document.getElementById("root");
if (!root) throw new Error("The field lifecycle host root is missing.");
createRoot(root).render(<FieldLifecycleHost />);
