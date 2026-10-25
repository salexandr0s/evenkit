import type { CatalogEntry } from "./catalog-types.js";

const styles = '"use client";\n\nimport "@evenkit/tokens/css";\nimport "@evenkit/ui/css";\n';
export const valueFieldsEntries: readonly CatalogEntry[] = [
  {
    id: "multi-select", name: "MultiSelect", group: "Controls", inventoryIds: ["C08"],
    description: "Search and select several values, remove selections, and expand overflow.",
    tags: ["multiple", "select", "search", "people", "filters", "C08"],
    source: "Base UI Combobox · original kit selection composition", sourceUrl: "https://base-ui.com/react/components/combobox",
    usage: `${styles}import { MultiSelect } from "@evenkit/ui";

export function ProjectMembers() {
  return <MultiSelect label="Project members" name="members" required maxVisible={2}
    options={[
      { value: "alex", label: "Alex Morgan", description: "Design" },
      { value: "sam", label: "Sam Rivera", description: "Engineering" },
      { value: "lee", label: "Lee Chen", disabled: true },
    ]} defaultValue={["alex"]} hint="Choose everyone responsible for this project." />;
}
`,
  },
  {
    id: "token-input", name: "Token input", group: "Controls", inventoryIds: ["C09"],
    description: "Create labels with validation, duplicate feedback, paste support, and keyboard removal.",
    tags: ["tags", "tokens", "labels", "multiple", "duplicates", "C09"],
    source: "Original kit token editor · native form controls", sourceUrl: "https://www.w3.org/WAI/tutorials/forms/",
    usage: `${styles}import { TokenInput } from "@evenkit/ui";

export function ProjectLabels() {
  return <TokenInput label="Project labels" name="labels" maxTokens={8}
    defaultValue={["Planning"]} hint="Press Enter or comma to add a label."
    validateToken={token => token.length > 40 ? "Keep labels under 41 characters." : undefined} />;
}
`,
  },
  {
    id: "number-field", name: "Number field", group: "Controls", inventoryIds: ["C05"],
    description: "Enter locale-aware numbers with decimal steps, limits, empty values, and validation.",
    tags: ["number", "decimal", "locale", "step", "quantity", "C05"],
    source: "Original kit number field · Intl number formatting", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",
    usage: `${styles}import { useState } from "react";
import { NumberField } from "@evenkit/ui";

export function QuantityField() {
  const [quantity, setQuantity] = useState<number | null>(2.5);
  return <NumberField label="Quantity" name="quantity" locale="de-AT"
    value={quantity} onValueChange={setQuantity} min={0} max={100} step={0.1}
    maximumFractionDigits={1} hint="Use a comma for decimals." />;
}
`,
  },
  {
    id: "number-recipes", name: "Currency, percentage and units", group: "Controls", inventoryIds: ["C06"],
    description: "Use explicit currency, percentage-point, and measurement values with consistent precision.",
    tags: ["currency", "money", "percentage", "unit", "budget", "measurement", "C06"],
    source: "Original kit NumberField recipes · Intl currency precision", sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat",
    usage: `${styles}import { CurrencyField, PercentageField, UnitField } from "@evenkit/ui";

export function BudgetFields() {
  return <>
    <CurrencyField label="Budget" name="budget" currency="EUR" locale="de-AT" defaultValue={1250.5} min={0} />
    <PercentageField label="Contingency" name="contingency" defaultValue={12.5} min={0} max={100} maximumFractionDigits={2} />
    <UnitField label="Weight" name="weight" unit="kg" defaultValue={2.75} min={0} maximumFractionDigits={2} />
  </>;
}

// Currency uses major units. Percentage uses points: 12.5 means 12.5%.
// Names submit canonical numbers without locale separators or unit symbols.
`,
  },
];
