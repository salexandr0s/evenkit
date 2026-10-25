import { useState } from "react";
import { Button, CurrencyField, Fieldset, FormActions, MultiSelect, NumberField, PercentageField, SelectField, TokenInput, UnitField, type ComboboxOption } from "@evenkit/ui";
import "./value-fields-preview.css";

const people: readonly ComboboxOption[] = [
  { value: "alex", label: "Alex Morgan", description: "Design lead" },
  { value: "sam", label: "Sam Rivera", description: "Engineering" },
  { value: "lee", label: "Lee Chen", description: "Research" },
  { value: "jules", label: "Jules Bennett", description: "Operations" },
  { value: "mika", label: "Mika Anderson", description: "Customer support" },
  { value: "inactive", label: "Archived account", description: "This person is unavailable.", disabled: true },
];

function MultiSelectExample() {
  const [members, setMembers] = useState<string[]>(["alex", "sam", "lee", "jules"]);
  const [disabled, setDisabled] = useState(false);
  const [submitted, setSubmitted] = useState("");
  return <div className="value-fields-stack">
    <header className="value-fields-header"><h3>Project team</h3><p>Assign people to the release. Search by name and review every selection.</p></header>
    <form className="value-fields-stack" aria-label="Project members form" onReset={() => setMembers(["alex", "sam", "lee", "jules"])} onSubmit={event => {
      event.preventDefault(); setSubmitted(`Members: ${new FormData(event.currentTarget).getAll("members").join(", ") || "none"}.`);
    }}>
      <MultiSelect label="Project members" name="members" required options={people} value={members} onValueChange={setMembers} maxVisible={2}
        hint="Type a name to search. Backspace in an empty field removes the last selection." clearLabel="Clear project members" openLabel="Show project members" />
      <FormActions><Button type="submit">Capture members</Button><Button type="reset" variant="outline">Reset members</Button></FormActions>
      <p className="value-fields-note" role="status">{submitted || "Selections submit as repeated member IDs."}</p>
    </form>
    <section className="value-fields-secondary value-fields-stack" aria-label="Selection states">
      <header className="value-fields-header"><h4>Unavailable and read-only</h4><p>Existing selections remain visible when editing is unavailable.</p></header>
      <form className="value-fields-stack" aria-label="Reviewers form"><Fieldset legend="Team permissions" disabled={disabled}><MultiSelect label="Additional reviewers" name="reviewers" options={people} defaultValue={["lee"]} /></Fieldset><Button type="reset" variant="outline">Reset reviewers</Button></form>
      <Button variant="outline" onClick={() => setDisabled(!disabled)}>{disabled ? "Enable reviewer fieldset" : "Disable reviewer fieldset"}</Button>
      <MultiSelect label="Read-only owners" options={people} value={["alex", "sam"]} readOnly />
      <MultiSelect label="Remote reviewers" options={[]} loading loadingMessage="Looking up reviewers…" />
    </section>
  </div>;
}
function TokenExample() {
  const [submitted, setSubmitted] = useState("");
  const [disabled, setDisabled] = useState(false);
  return <div className="value-fields-stack">
    <header className="value-fields-header"><h3>Organize the release</h3><p>Create labels your team can use to find related work.</p></header>
    <form className="value-fields-stack" aria-label="Project labels form" onSubmit={event => { event.preventDefault(); setSubmitted(`Labels: ${new FormData(event.currentTarget).getAll("labels").join(", ")}.`); }}>
      <TokenInput label="Project labels" name="labels" required defaultValue={["Planning"]} maxTokens={5} maxVisible={2}
        placeholder="Add a label" hint="Press Enter or comma to add. Paste a comma-separated list."
        validateToken={token => token.length > 24 ? "Keep each label under 25 characters." : undefined} />
      <FormActions><Button type="submit">Capture labels</Button><Button type="reset" variant="outline">Reset labels</Button></FormActions>
      <p role="status" className="value-fields-note">{submitted || "Duplicate labels ignore case and keep the existing spelling."}</p>
    </form>
    <section className="value-fields-secondary value-fields-stack">
      <Fieldset legend="Label permissions" disabled={disabled}><TokenInput label="Internal labels" name="internalLabels" defaultValue={["Internal", "Review"]} /></Fieldset>
      <Button variant="outline" onClick={() => setDisabled(!disabled)}>{disabled ? "Enable label fieldset" : "Disable label fieldset"}</Button>
      <TokenInput label="Read-only labels" defaultValue={["Approved", "Release"]} readOnly />
    </section>
  </div>;
}
function NumberExample() {
  const [locale, setLocale] = useState("de-AT");
  const [quantity, setQuantity] = useState<number | null>(12.5);
  const [submitted, setSubmitted] = useState("");
  const [disabled, setDisabled] = useState(false);
  return <div className="value-fields-stack">
    <header className="value-fields-header"><h3>Order quantity</h3><p>Decimal values keep their meaning when the display locale changes.</p></header>
    <SelectField label="Number locale" value={locale} onValueChange={setLocale} options={[{ value: "de-AT", label: "German · Austria" }, { value: "en-US", label: "English · United States" }, { value: "ar-EG", label: "Arabic · Egypt" }]} />
    <form className="value-fields-stack" aria-label="Quantity form" onReset={() => setQuantity(12.5)} onSubmit={event => { event.preventDefault(); setSubmitted(`Quantity: ${new FormData(event.currentTarget).get("quantity")}.`); }}>
      <NumberField label="Quantity" name="quantity" value={quantity} onValueChange={setQuantity} locale={locale} min={0} max={100} step={0.1} maximumFractionDigits={1} required
        hint="Choose a value from 0 to 100 in steps of 0.1. Use the selected locale's decimal separator." />
      <FormActions><Button type="submit">Capture quantity</Button><Button type="reset" variant="outline">Reset quantity</Button></FormActions>
      <p className="value-fields-note" role="status">{submitted || `Stored quantity: ${quantity ?? "empty"}.`}</p>
    </form>
    <section className="value-fields-secondary value-fields-stack">
      <Fieldset legend="Quantity permissions" disabled={disabled}><NumberField label="Reserved quantity" name="reserved" defaultValue={25} min={0} /></Fieldset>
      <Button variant="outline" onClick={() => setDisabled(!disabled)}>{disabled ? "Enable quantity fieldset" : "Disable quantity fieldset"}</Button>
      <NumberField label="Approved quantity" defaultValue={50} readOnly />
    </section>
  </div>;
}
function RecipesExample() {
  const [submitted, setSubmitted] = useState("");
  return <form className="value-fields-stack" aria-label="Budget form" onSubmit={event => {
    event.preventDefault(); const data = new FormData(event.currentTarget); setSubmitted(`Budget: ${data.get("budget")} EUR · Contingency: ${data.get("rate")}% · Weight: ${data.get("weight")} kg.`);
  }}>
    <header className="value-fields-header"><h3>Budget and measurements</h3><p>Units stay visible while the form submits plain numeric values.</p></header>
    <CurrencyField label="Project budget" name="budget" currency="EUR" locale="de-AT" defaultValue={1250.5} min={0} required hint="Enter euros and cents. The currency code stays explicit." />
    <div className="value-fields-grid">
      <PercentageField label="Contingency" name="rate" defaultValue={12.5} min={0} max={100} maximumFractionDigits={2} hint="12.5 means 12.5 percent." />
      <UnitField label="Shipment weight" name="weight" unit="kg" defaultValue={2.75} min={0} maximumFractionDigits={2} hint="Enter the weight in kilograms." />
    </div>
    <FormActions><Button type="submit">Capture budget</Button><Button type="reset" variant="outline">Reset budget</Button></FormActions>
    <p className="value-fields-note" role="status">{submitted || "Currency uses major units; percentages use percentage points."}</p>
    <section className="value-fields-secondary"><CurrencyField label="Yen budget" currency="JPY" locale="ja-JP" defaultValue={5000} min={0} hint="JPY uses zero decimal places by default." /></section>
  </form>;
}
export function ValueFieldsPreview({ id }: { id: string }) {
  if (id === "multi-select") return <MultiSelectExample />;
  if (id === "token-input") return <TokenExample />;
  if (id === "number-field") return <NumberExample />;
  return <RecipesExample />;
}
