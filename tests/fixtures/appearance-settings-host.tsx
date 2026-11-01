import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, type AppearanceValue } from "@evenkit/ui";
import { AppearanceSettings } from "../../registry/blocks/account-settings.js";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

const initial: AppearanceValue = { theme: "neutral", mode: "light", density: "default", locale: "en" };
const locales = [{ value: "en", label: "English" }, { value: "de-AT", label: "Deutsch" }];
function AppearanceHost() {
  const [storageKey, setStorageKey] = useState("appearance-host-a");
  const [options, setOptions] = useState(locales);
  const [value, setValue] = useState<AppearanceValue>(initial);
  const [updates, setUpdates] = useState(0);
  return <>
    <AppearanceSettings storageKey={storageKey} initialValue={initial} locales={options}
      onValueChange={next => { setValue(next); setUpdates(count => count + 1); }} />
    <Button onClick={() => setOptions(current => current.map(option => ({ ...option })))}>Recreate locale options</Button>
    <Button onClick={() => setOptions([{ value: "fr", label: "French" }])}>Replace supported locales</Button>
    <Button onClick={() => setOptions([...locales, { value: "fr", label: "French" }])}>Restore supported locales</Button>
    <Button onClick={() => setStorageKey("appearance-host-b")}>Switch account</Button>
    <output aria-label="Current preferences">{JSON.stringify(value)}</output>
    <output aria-label="Preference updates">{updates}</output>
  </>;
}

const root = document.getElementById("root");
if (!root) throw new Error("The appearance host root is missing.");
createRoot(root).render(<AppearanceHost />);
