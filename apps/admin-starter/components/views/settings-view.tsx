"use client";

import { useRef, useState } from "react";
import { SettingsLayout } from "@evenkit/ui";
import { AppearanceSettings, ProfileSettings } from "../../blocks/account-settings";
import { useStarter } from "../starter-providers";
import { appearanceStorageKey } from "../../lib/appearance";

const sections = [{ id: "profile", label: "Profile", description: "Name and email" }, { id: "appearance", label: "Appearance", description: "Theme and spacing" }];
const locales = [{ value: "en", label: "English" }, { value: "de", label: "Deutsch" }];

export function SettingsView() {
  const { data, workspaceId, appearance, setAppearance, saveProfile } = useStarter();
  const [active, setActive] = useState("profile");
  const content = useRef<HTMLDivElement>(null);
  return <SettingsLayout items={sections} activeId={active} onNavigate={id => { setActive(id); requestAnimationFrame(() => content.current?.focus()); }}>
    <div ref={content} tabIndex={-1} className="starter-settings-content" aria-label={active === "profile" ? "Profile settings content" : "Appearance settings content"}>
      {active === "profile" ? <ProfileSettings profile={data.profile} onSave={saveProfile} /> : <AppearanceSettings storageKey={appearanceStorageKey(workspaceId)} initialValue={appearance} locales={locales} onValueChange={setAppearance} />}
    </div>
  </SettingsLayout>;
}
