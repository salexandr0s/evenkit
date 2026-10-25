import type { CatalogEntry } from "./catalog-types.js";
import { datesEntries } from "./dates-entries.js";
import { valueFieldsEntries } from "./value-fields-entries.js";
import { remoteTableEntries } from "./remote-table-entries.js";
import { accountRecordEntries } from "./account-record-entries.js";
import { uploadsEntries } from "./uploads-entries.js";
import { commandWizardEntries } from "./command-wizard-entries.js";
import { mediaPreviewEntries } from "./media-preview-entries.js";
import { avatarUploadEntries } from "./avatar-upload-entries.js";
import { documentLibraryEntries } from "./document-library-entries.js";

import { teamAdminEntries } from "./team-admin-entries.js";

export const roadmapEntries: readonly CatalogEntry[] = [
  ...datesEntries,
  ...valueFieldsEntries,
  ...remoteTableEntries,
  ...accountRecordEntries,
  ...uploadsEntries,
  ...commandWizardEntries,
  ...mediaPreviewEntries,
  ...avatarUploadEntries,
  ...documentLibraryEntries,
  ...teamAdminEntries,
];
