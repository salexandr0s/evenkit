import type { CatalogEntry } from "./catalog-types.js";
import { datesEntries } from "./dates-entries.js";
import { valueFieldsEntries } from "./value-fields-entries.js";
import { remoteTableEntries } from "./remote-table-entries.js";
import { accountRecordEntries } from "./account-record-entries.js";
import { uploadsEntries } from "./uploads-entries.js";
import { commandWizardEntries } from "./command-wizard-entries.js";

import { teamAdminEntries } from "./team-admin-entries.js";

export const roadmapEntries: readonly CatalogEntry[] = [
  ...datesEntries,
  ...valueFieldsEntries,
  ...remoteTableEntries,
  ...accountRecordEntries,
  ...uploadsEntries,
  ...commandWizardEntries,
  ...teamAdminEntries,
];
