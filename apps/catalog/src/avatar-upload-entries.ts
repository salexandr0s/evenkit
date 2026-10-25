import type { CatalogEntry } from "./catalog-types.js";

export const avatarUploadEntries: readonly CatalogEntry[] = [{
  id: "avatar-upload", name: "Avatar and logo upload", group: "Compositions", inventoryIds: ["J05"],
  description: "Choose, preview, replace or remove an image, with undo, cancellation and save recovery.",
  tags: ["avatar", "logo", "image", "upload", "settings", "preview", "remove", "save", "J05"],
  source: "Editable kit source block · FileInput, Image and settings controls",
  sourceUrl: "https://github.com/salexandr0s/evenkit",
  usage: `"use client";

import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { AvatarUpload, type AvatarUploadProps } from "./avatar-upload";

// Copy registry/blocks/avatar-upload.tsx beside this module.
// Pass your application's saved image and persistence callback.
export function WorkspaceLogo({ ownerId, value, revision, onSave, onSaved }: Pick<
  AvatarUploadProps, "ownerId" | "value" | "revision" | "onSave" | "onSaved"
>) {
  return <AvatarUpload ownerId={ownerId} name="Meridian workspace" kind="logo"
    value={value} {...(revision === undefined ? {} : { revision })}
    onSave={onSave} {...(onSaved ? { onSaved } : {})} />;
}

// onSave receives { kind: "replace", file } or { kind: "remove" } plus
// { ownerId, previous, signal }. Return the saved AvatarValue, or null
// after removal. Use stable asset IDs and honor signal before host updates.
// Validate file content and authorization on your server. The picker accepts
// PNG, JPEG, WebP, GIF and AVIF; MIME metadata alone is not validation.
// Update revision after authoritative changes to invalidate pending work.
// Supply previewState: "expired" or "unavailable" when a URL cannot be used.
// The block owns only its temporary selection URLs; your app owns saved URLs.
`,
}];
