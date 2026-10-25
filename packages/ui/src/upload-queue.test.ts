import { describe, expect, it } from "vitest";
import { UploadQueueStore, type UploadContext, type UploadResult, type UploadTransport } from "./upload-queue-utils.js";

function controlledTransport() {
  const calls: { file: File; context: UploadContext; resolve: (value?: UploadResult) => void; reject: (error: Error) => void }[] = [];
  const upload: UploadTransport = (file, context) => new Promise((resolve, reject) => { calls.push({ file, context, resolve, reject }); });
  return { upload, calls };
}
function file(name: string, lastModified = 1) { return new File([name], name, { type: "text/plain", lastModified }); }
async function flush() { for (let index = 0; index < 6; index++) await Promise.resolve(); }

describe("upload queue attempts", () => {
  it("limits concurrency and lets failed work release its slot", async () => {
    const { upload, calls } = controlledTransport();
    const queue = new UploadQueueStore({ upload, concurrency: 1 });
    queue.activate();
    queue.addFiles([file("first.txt"), file("second.txt")]);
    await flush();
    expect(calls).toHaveLength(1);
    expect(queue.getSnapshot().map(item => item.state)).toEqual(["uploading", "queued"]);
    calls[0]!.context.onProgress(25);
    calls[0]!.context.onProgress(Number.NaN);
    calls[0]!.context.onProgress(10);
    expect(queue.getSnapshot()[0]!.progress).toBe(25);
    calls[0]!.reject(new Error("Connection lost"));
    await flush();
    expect(calls).toHaveLength(2);
    expect(queue.getSnapshot()[0]!.error).toBe("Connection lost");
    calls[1]!.resolve({ href: "/files/second" });
    await flush();
    expect(queue.getSnapshot()[1]).toMatchObject({ state: "complete", progress: 100, result: { href: "/files/second" } });
    queue.deactivate();
  });

  it("ignores progress and completion from cancelled attempts after retry", async () => {
    const { upload, calls } = controlledTransport();
    const queue = new UploadQueueStore({ upload });
    queue.activate();
    const id = queue.addFiles([file("notes.txt")]).acceptedIds[0]!;
    await flush();
    queue.cancel(id);
    expect(calls[0]!.context.signal.aborted).toBe(true);
    queue.retry(id);
    await flush();
    calls[0]!.context.onProgress(99);
    calls[0]!.resolve({ href: "/stale" });
    await flush();
    expect(queue.getSnapshot()[0]).toEqual({ id, file: calls[0]!.file, state: "uploading" });
    calls[1]!.resolve({ href: "/current" });
    await flush();
    expect(queue.getSnapshot()[0]!.result?.href).toBe("/current");
    queue.deactivate();
  });

  it("deduplicates metadata within a batch while accepting a changed file", () => {
    const queue = new UploadQueueStore({ upload: async () => undefined, maxFiles: 2 });
    const result = queue.addFiles([file("notes.txt"), file("notes.txt"), file("notes.txt", 2), file("extra.txt")]);
    expect(result.acceptedIds).toHaveLength(2);
    expect(result.rejected.map(item => item.reason)).toEqual(["duplicate", "limit"]);
    queue.remove(result.acceptedIds[0]!);
    expect(queue.addFiles([file("notes.txt")]).acceptedIds).toHaveLength(1);
  });

  it("cancels queued work without starting it and aborts removed files", async () => {
    const { upload, calls } = controlledTransport();
    const queue = new UploadQueueStore({ upload, autoStart: false });
    queue.activate();
    const [first, second] = queue.addFiles([file("first.txt"), file("second.txt")]).acceptedIds;
    await flush();
    expect(calls).toHaveLength(0);
    queue.cancel(first!);
    queue.start();
    await flush();
    expect(calls).toHaveLength(1);
    queue.remove(second!);
    expect(calls[0]!.context.signal.aborted).toBe(true);
    calls[0]!.resolve();
    await flush();
    expect(queue.getSnapshot().map(item => item.state)).toEqual(["cancelled"]);
    queue.deactivate();
  });

  it("aborts on teardown and restarts safely after React effect replay", async () => {
    const { upload, calls } = controlledTransport();
    const queue = new UploadQueueStore({ upload });
    queue.activate();
    queue.addFiles([file("notes.txt")]);
    await flush();
    queue.deactivate();
    expect(calls[0]!.context.signal.aborted).toBe(true);
    queue.activate();
    await flush();
    calls[0]!.reject(new Error("Old failure"));
    await flush();
    expect(queue.getSnapshot()[0]!.state).toBe("uploading");
    calls[1]!.resolve();
    await flush();
    expect(queue.getSnapshot()[0]!.state).toBe("complete");
    queue.deactivate();
  });
});
