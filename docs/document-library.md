# Document library and media previews

J05, J06 and J07 provide avatar/logo editing, file previews and a document browser.
These are pilot components maintained by the kit maintainer. The catalog and
independent packed Vite/Next fixtures are the example consumers. Applications
own records, permissions, signed URLs, storage, transfers and server validation.

Import `@evenkit/tokens/css` before `@evenkit/ui/css`. Set theme and mode on the
document root so lightbox portals inherit them. The maintained package exports
`FilePreview`, `FileLightbox`, `DocumentLibrary` and `useDocumentLibrary`.
Copy `registry/blocks/avatar-upload.tsx` and
`registry/blocks/document-library.tsx` into your application for editable flows.
Their styles ship in the UI stylesheet. Complete typed examples are available
at catalog routes `/#avatar-upload`, `/#file-preview` and `/#document-library`;
`npm run verify:examples` compiles each copied example with its block source.

## Preview contract

`MediaFile` requires a stable `id`, `name` and `mimeType`. Filenames and signed
URLs are display data, never identity. Its optional `preview` is one of:

| State | Payload | Behavior |
| --- | --- | --- |
| `ready` | `url` for a supported image | Existing `Image` frame, named alternative, load failure and retry |
| `ready` | `text` for `text/plain` | Escaped text in a keyboard-scrollable region |
| `loading` | Optional `message` | Named progress feedback |
| `expired` | Optional `message` | Explanation and application refresh action |
| `unavailable` or omitted | Optional `message` | Useful fallback and any available file actions |

Inline image types are `image/png`, `image/jpeg`, `image/webp`, `image/avif` and
`image/gif`. The only inline document type is `text/plain`; the application
supplies decoded text after its own authorization and size checks. The view
limits rendered text to 100,000 characters and explains truncation. PDFs, SVG,
HTML, office documents, archives, audio and video use the unsupported fallback.
The component never fetches text, interprets markup or embeds uploaded documents
in an iframe or object element. A MIME declaration is not server-side validation.

`openHref` and `downloadHref` are independent application-authorized destinations.
The URL policy permits HTTP(S), relative URLs and HTTP(S) blob URLs; it rejects
script/data schemes, protocol-relative paths, backslashes and control characters.
The application must still validate destinations, response types and access.
Open uses a separate tab with `noopener noreferrer`. Download supplies a filename;
the server controls cross-origin download response headers and disposition.
When neither action is available, the fallback asks the reader to request access.

`onRefresh(file)` asks the application to refresh access. Publish `loading`, then
a fresh `preview`, or an explicit failure state. Guard your asynchronous callback
by file ID, authorization scope and request generation before publishing results.
The view receives current state and starts no independent refresh request.
`FileLightbox` takes `file`, `open` and `onOpenChange`. It reuses the existing
Dialog for keyboard containment and Escape dismissal. Pass `returnFocusRef` for
a stable focus target if the original launcher can disappear.

Dialog and control motion follows the existing reduced-motion rules. Uploaded
animated images retain their own animation; supply a static rendition when your
application needs to suppress that motion.

```tsx
"use client";

import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { useRef, useState } from "react";
import { Button, FileLightbox, type MediaFile } from "@evenkit/ui";

export function DocumentPreview({ file }: { file: MediaFile }) {
  const [open, setOpen] = useState(false);
  const launch = useRef<HTMLButtonElement>(null);
  return <>
    <Button ref={launch} onClick={() => setOpen(true)}>Preview {file.name}</Button>
    <FileLightbox file={file} open={open} onOpenChange={setOpen}
      returnFocusRef={launch} />
  </>;
}
```

## Avatar and logo editing

`AvatarUpload` takes `ownerId`, `name`, `value`, `onSave` and optional `onSaved`,
`revision`, `kind`, `maxBytes`, `disabled` and `onRefreshPreview` props. `kind` is
`avatar` or `logo`. A saved `AvatarValue` has a stable asset `id`, `name`, an
allowed raster `mimeType`, optional `src` and optional
`previewState: "available" | "expired" | "unavailable"`.

`onSave(change, { ownerId, previous, signal })` receives either
`{ kind: "replace", file }` or `{ kind: "remove" }`. Resolve with the saved asset
or `null` for removal. Validate the file, owner and prior asset in your application;
honor cancellation and clean up any partial transfer there. Cancellation stops
the UI from accepting a completion; it cannot roll back a server operation.

FileInput performs selection/type/size checks. The block creates an object URL
for a local raster preview and revokes it when the draft is discarded, replaced,
saved or unmounted. A staged removal retains the prior draft for Undo removal.
Application-owned saved URLs are never revoked by the block. Save errors and
cancellation retain the draft; retry uses that same draft. Reset restores the
last saved value. The file picker and undo/cancel controls provide focus recovery.
An owner, revision or authoritative value change remounts the editor, aborts the
old attempt and prevents its late result from updating the new context.

## Document browsing

`DocumentEntry` is a folder (`id`, `name`, `kind: "folder"`) or file
(`MediaFile` plus `kind: "file"` and optional `sizeBytes`). IDs must be nonempty
and unique in each returned page, and remain stable across pages and refreshes.
`DocumentLibraryQuery` extends the existing remote table query with `folderId`
and `kind: "all" | "files" | "folders"`. The application loader applies folder,
search, type filter, sort and pagination, then returns `{ data, total }` with an
exact count for the current query before pagination.

`useDocumentLibrary` composes `useRemoteTable` and `useTableSelection`. Include
workspace/account and authorization changes in `scopeKey`. Folder/type/search
changes clear selection; page and sort changes retain explicit selected IDs.
The hook rejects duplicate IDs and ignores stale responses even when a loader
ignores its abort signal. Memoize the loader with `useCallback`.

The controlled `DocumentLibrary` shares toolbar controls between list and grid.
List uses the existing DataTable in remote mode and FileRow. Grid uses FilePreview,
Checkbox and Pagination. Both show loading, error/retry, empty-folder and empty-
search states. Folder breadcrumbs are application data. The UI never assumes
that navigating a path grants access to its contents.

For a custom composition, `DocumentLibrary` requires `entries`, `total`, `query`,
`onQueryChange`, `path`, `onNavigate`, `view`, `onViewChange`, `selection` and
`onPreview`. Optional `loading`, `error`, `onRetry`, `onRemove`, `actions`,
`rootLabel` and `className` props supply host states and actions. `onPreview`
receives the current file and its launcher button. The list passes `onClearSearch`
to DataTable so its empty-search action returns focus to the external search field.

The editable `DocumentLibraryBlock` composes the browser with the existing
UploadQueue and FileLightbox. It captures the current folder for transfers;
navigation unmounts that folder's queue and aborts pending work. The application
cleans up partial uploads and refreshes its authorized listing after completion.
Removal requires application callbacks; failures preserve selection for retry,
and cancellation rejects late UI completions. Restoration is offered only when
the application supplies a restore callback. Changing scope resets the block.

`DocumentLibraryBlock` requires `scopeKey` and `load`. Its optional `upload` gets
the existing queue's `{ signal, onProgress }` context plus the captured `folderId`.
`onRemove(ids, { signal, folderId })` and `onRestore` both resolve with no value.
They operate on explicit selected IDs, which may span pages. The block retains
only the last successful removal for undo; the application owns trash retention
and partial-operation policy. `onRefreshPreview(file)` updates the application's
records or loader result with fresh preview metadata. The lightbox remains open
while the listing reloads and shows an unavailable state if that ID disappears.

## Source and maintenance

This implementation starts from `codex/component-improvements` commit
`b588b1b1964ba2b26ee8453606f354f2c33eb10d`. The new modules and blocks are original
kit code built from existing FileInput, FileRow, UploadQueue, Image, remote table,
toolbar, dialog and settings APIs. No third-party component source or additional
runtime dependency was introduced. Existing Radix, TanStack and icon license
notices remain in `packages/ui/licenses`. Internal kit source remains unlicensed
for public distribution, as documented in the root README.

The implementation branch is `codex/document-library`. Keep copied blocks under
application ownership; compare later upstream changes before adopting them.
Verification results and integration instructions are recorded in
`docs/document-library-handoff.md`. Browser evidence covers Chromium; Safari,
Firefox and physical mobile keyboards require separate consumer validation.
