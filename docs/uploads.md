# Uploads and images

`UploadQueue` composes `FileInput`, `FileRow` and `Thumbnail`. `useUploadQueue`
owns an in-memory queue and the lifetime of each attempt. The application supplies
an `UploadTransport` for authorization, transfer and storage. No service or URL
is built into the kit.

```tsx
const queue = useUploadQueue({ upload, concurrency: 2, maxFiles: 8 });
return <UploadQueue queue={queue} label="Attachments" accept="image/*,.pdf"
  maxBytes={5 * 1024 * 1024} hint="Up to 8 files, 5 MB each." />;
```

The transport receives `(file, { signal, onProgress })` and returns a promise.
Resolve with no result or `{ href, downloadHref }`; reject with an `Error` whose
message can be shown to the user. Honor the abort signal. Progress is an optional
percentage from 0 to 100; without it, the progress indicator is indeterminate.
The controller ignores nonfinite values, clamps valid percentages, and prevents
progress from moving backwards during one attempt.

## Queue behavior

Items have stable IDs and `queued`, `uploading`, `complete`, `error` or `cancelled`
states. `cancel`, `cancelAll`, `remove` and unmount abort active attempts. A late
progress event, completion or rejection cannot change a cancelled, removed or
retried item. Retrying starts a new attempt. Concurrency defaults to two, and
queued work starts as soon as a slot is free. `autoStart: false` is an initial
policy that waits for `start()`; once started, later additions also run.

Duplicate identity uses name, size, MIME type and last-modified time, including
duplicates in a single selection. It is a metadata check, not a content hash.
Completed and cancelled files still count toward `maxFiles` until removed.
Changing a file's metadata makes it a distinct item. `addFiles` returns accepted
IDs and explicit duplicate or capacity rejections. `FileInput` checks type and
size before adding files; applications that call `addFiles` directly must apply
their own type/size policy. Changing `maxFiles` does not remove existing files.

The queue's summary announces state changes, while progress remains on each row.
Cancelling and retrying focus the stable row. Removing or clearing rows returns
focus to the picker. `disabled` disables queue controls without stopping work
already in progress. Queue instances should be scoped to a workspace or record;
unmount or cancel them when that context changes.

Image previews create local object URLs only for image files. Each URL is revoked
when its row disappears or the queue unmounts. The preview uses an empty image
alternative because the filename is already beside it. Completed transfer URLs
belong to the host; the kit does not revoke them or infer permissions.

`name` and `form` connect the picker to native form submission. Its selected
files mirror retained queue entries. A native form reset does not erase the
controller; clear or replace the queue explicitly when resetting the workflow.

## Image and Thumbnail

`Image` requires `src` and `alt`. Use an empty `alt` only for decorative images.
The `aspectRatio` reserves content space while loading or showing an error.
`fit="cover"` crops to that frame; `fit="contain"` shows the full image. Width,
height, loading, decoding, source set and other native image props pass through
to the image. `className` and `style` apply to its outer frame; a forwarded ref
points to the image element.

Failed images retain their alternative text through the fallback. Retry
recreates the image request; `onRetry` can refresh an expired host URL. Focus
moves to the retained frame so replacing the retry control does not lose it.
`retryable={false}` removes recovery when the surrounding workflow owns it.
`Thumbnail` uses a square frame with `sm`, `md` and `lg` token sizes, and omits
retry by default. Its default fallback is a decorative file icon.

The catalog supplies local failure, retry, cancellation and real-file preview
examples. The transport controller tests cover stale attempts and teardown;
browser journeys cover the picker, recovery controls, URL cleanup and stable image frames.
