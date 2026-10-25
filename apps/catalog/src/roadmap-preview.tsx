import { lazy } from "react";
import { datesEntries } from "./dates-entries.js";
import { valueFieldsEntries } from "./value-fields-entries.js";
import { remoteTableEntries } from "./remote-table-entries.js";
import { accountRecordEntries } from "./account-record-entries.js";
import { uploadsEntries } from "./uploads-entries.js";
import { commandWizardEntries } from "./command-wizard-entries.js";
import { persistentFeedbackEntries } from "./persistent-feedback-entries.js";

const DatesPreview = lazy(() => import("./dates-preview.js").then(module => ({ default: module.DatesPreview })));
const ValueFieldsPreview = lazy(() => import("./value-fields-preview.js").then(module => ({ default: module.ValueFieldsPreview })));
const RemoteTablePreview = lazy(() => import("./remote-table-preview.js").then(module => ({ default: module.RemoteTablePreview })));
const AccountRecordPreview = lazy(() => import("./account-record-preview.js").then(module => ({ default: module.AccountRecordPreview })));
const UploadsPreview = lazy(() => import("./uploads-preview.js").then(module => ({ default: module.UploadsPreview })));
const CommandWizardPreview = lazy(() => import("./command-wizard-preview.js").then(module => ({ default: module.CommandWizardPreview })));
const NotificationCenterPreview = lazy(() => import("./notification-center-preview.js").then(module => ({ default: module.NotificationCenterPreview })));
const NotificationPreferencesPreview = lazy(() => import("./notification-preferences-preview.js").then(module => ({ default: module.NotificationPreferencesPreview })));
const PersistentFeedbackPreview = lazy(() => import("./persistent-feedback-preview.js").then(module => ({ default: module.PersistentFeedbackPreview })));

export function RoadmapPreview({ id }: { id: string }) {
  if (id === "notification-center") return <NotificationCenterPreview />;
  if (id === "notification-preferences") return <NotificationPreferencesPreview />;
  if (persistentFeedbackEntries.some(entry => entry.id === id)) return <PersistentFeedbackPreview key={id} id={id} />;
  if (datesEntries.some(entry => entry.id === id)) return <DatesPreview id={id} />;
  if (valueFieldsEntries.some(entry => entry.id === id)) return <ValueFieldsPreview id={id} />;
  if (remoteTableEntries.some(entry => entry.id === id)) return <RemoteTablePreview id={id} />;
  if (accountRecordEntries.some(entry => entry.id === id)) return <AccountRecordPreview id={id} />;
  if (uploadsEntries.some(entry => entry.id === id)) return <UploadsPreview id={id} />;
  if (commandWizardEntries.some(entry => entry.id === id)) return <CommandWizardPreview id={id} />;
  return null;
}
