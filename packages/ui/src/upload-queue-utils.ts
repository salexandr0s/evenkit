export type UploadState = "queued" | "uploading" | "complete" | "error" | "cancelled";
export interface UploadResult { href?: string; downloadHref?: string }
export interface UploadItem {
  id: string;
  file: File;
  state: UploadState;
  progress?: number;
  error?: string;
  result?: UploadResult;
}
export interface UploadContext {
  signal: AbortSignal;
  /** Report a percentage from 0 to 100. Omit calls for indeterminate progress. */
  onProgress: (percentage: number) => void;
}
export type UploadTransport = (file: File, context: UploadContext) => Promise<UploadResult | void>;
export interface UploadQueueOptions {
  upload: UploadTransport;
  concurrency?: number;
  maxFiles?: number;
  /** Initial policy: false keeps new files queued until start() is called. */
  autoStart?: boolean;
}
export interface UploadRejection { file: File; reason: "duplicate" | "limit"; message: string }
export interface UploadAddResult { acceptedIds: readonly string[]; rejected: readonly UploadRejection[] }

/** Metadata identity catches repeated selection without reading private file contents. */
export function uploadFileIdentity(file: File): string {
  return JSON.stringify([file.name, file.size, file.type, file.lastModified]);
}

function positiveInteger(value: number, label: string) {
  if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${label} must be a positive integer.`);
  return value;
}

/** Internal store keeps cancellation synchronous even before React commits a render. */
export class UploadQueueStore {
  private items: readonly UploadItem[] = [];
  private listeners = new Set<() => void>();
  private attempts = new Map<string, AbortController>();
  private sequence = 0;
  private mounted = false;
  private started: boolean;
  private upload: UploadTransport;
  private concurrency: number;
  private maxFiles: number;

  constructor(options: UploadQueueOptions) {
    this.upload = options.upload;
    this.concurrency = positiveInteger(options.concurrency ?? 2, "concurrency");
    this.maxFiles = positiveInteger(options.maxFiles ?? 10, "maxFiles");
    this.started = options.autoStart ?? true;
  }

  getSnapshot = () => this.items;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  configure(options: UploadQueueOptions) {
    this.upload = options.upload;
    this.concurrency = positiveInteger(options.concurrency ?? 2, "concurrency");
    this.maxFiles = positiveInteger(options.maxFiles ?? 10, "maxFiles");
    this.pump();
  }
  activate = () => { this.mounted = true; this.pump(); };
  deactivate = () => {
    this.mounted = false;
    const running = new Set(this.attempts.keys());
    const attempts = [...this.attempts.values()];
    this.attempts.clear();
    // React's effect replay can reactivate this store. Restart interrupted work
    // as a new attempt; old callbacks can never affect that attempt.
    this.publish(this.items.map(item => running.has(item.id) ? { id: item.id, file: item.file, state: "queued" } : item));
    attempts.forEach(controller => controller.abort());
  };
  addFiles = (files: readonly File[]): UploadAddResult => {
    const next = [...this.items];
    const identities = new Set(next.map(item => uploadFileIdentity(item.file)));
    const acceptedIds: string[] = [];
    const rejected: UploadRejection[] = [];
    for (const file of files) {
      const identity = uploadFileIdentity(file);
      if (identities.has(identity)) {
        rejected.push({ file, reason: "duplicate", message: `${file.name} is already in the queue.` });
      } else if (next.length >= this.maxFiles) {
        rejected.push({ file, reason: "limit", message: `${file.name}: the queue limit has been reached.` });
      } else {
        const id = `upload-${++this.sequence}`;
        next.push({ id, file, state: "queued" });
        identities.add(identity);
        acceptedIds.push(id);
      }
    }
    if (acceptedIds.length) { this.publish(next); this.pump(); }
    return { acceptedIds, rejected };
  };
  start = () => { this.started = true; this.pump(); };
  cancel = (id: string) => {
    const item = this.items.find(item => item.id === id);
    if (!item || (item.state !== "queued" && item.state !== "uploading")) return;
    const controller = this.attempts.get(id);
    this.attempts.delete(id);
    this.replace(id, { id, file: item.file, state: "cancelled" });
    controller?.abort();
    this.pump();
  };
  cancelAll = () => {
    const attempts = [...this.attempts.values()];
    this.attempts.clear();
    this.publish(this.items.map(item => item.state === "queued" || item.state === "uploading" ? { id: item.id, file: item.file, state: "cancelled" } : item));
    attempts.forEach(controller => controller.abort());
  };
  retry = (id: string) => {
    const item = this.items.find(item => item.id === id);
    if (!item || (item.state !== "error" && item.state !== "cancelled")) return;
    this.replace(id, { id, file: item.file, state: "queued" });
    this.pump();
  };
  remove = (id: string) => {
    const controller = this.attempts.get(id);
    this.attempts.delete(id);
    this.publish(this.items.filter(item => item.id !== id));
    controller?.abort();
    this.pump();
  };
  clearCompleted = () => { this.publish(this.items.filter(item => item.state !== "complete")); };

  private publish(items: readonly UploadItem[]) { this.items = items; this.listeners.forEach(listener => listener()); }
  private replace(id: string, next: UploadItem) { this.publish(this.items.map(item => item.id === id ? next : item)); }
  private isCurrent(id: string, controller: AbortController) { return this.mounted && !controller.signal.aborted && this.attempts.get(id) === controller; }
  private pump() {
    if (!this.mounted || !this.started) return;
    while (this.attempts.size < this.concurrency) {
      const item = this.items.find(item => item.state === "queued");
      if (!item) break;
      const controller = new AbortController();
      this.attempts.set(item.id, controller);
      this.replace(item.id, { ...item, state: "uploading" });
      const upload = this.upload;
      void Promise.resolve().then(() => {
        if (!this.isCurrent(item.id, controller)) return;
        return upload(item.file, { signal: controller.signal, onProgress: percentage => {
          if (!this.isCurrent(item.id, controller) || !Number.isFinite(percentage)) return;
          const current = this.items.find(entry => entry.id === item.id);
          if (current) this.replace(item.id, { ...current, progress: Math.max(current.progress ?? 0, Math.min(100, Math.max(0, percentage))) });
        } });
      }).then(result => {
        if (!this.isCurrent(item.id, controller)) return;
        this.attempts.delete(item.id);
        this.replace(item.id, { ...item, state: "complete", progress: 100, ...(result ? { result } : {}) });
        this.pump();
      }, (error: unknown) => {
        if (!this.isCurrent(item.id, controller)) return;
        this.attempts.delete(item.id);
        this.replace(item.id, { ...item, state: "error", error: error instanceof Error && error.message ? error.message : "The file could not be uploaded. Try again." });
        this.pump();
      });
    }
  }
}
