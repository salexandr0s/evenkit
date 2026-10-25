"use client";

import { forwardRef, useRef, useState, type ComponentPropsWithoutRef, type ForwardedRef, type ReactNode } from "react";
import { Button } from "./button.js";
import { classes } from "./classes.js";
import { Spinner } from "./feedback.js";
import { FileTextIcon, RotateCcwIcon } from "./icons.js";

export interface ImageProps extends Omit<ComponentPropsWithoutRef<"img">, "src" | "alt" | "children"> {
  src: string;
  alt: string;
  /** Content ratio; the frame keeps this space during loading and errors. */
  aspectRatio?: number;
  fit?: "cover" | "contain";
  fallback?: ReactNode;
  retryLabel?: string;
  /** Set false for decorative previews whose parent already provides recovery. */
  retryable?: boolean;
  onRetry?: () => void;
}

function ImageFrame({ src, alt, aspectRatio = 4 / 3, fit = "cover", fallback = "Image unavailable", retryLabel = "Retry image", retryable = true, onRetry, className, style, onLoad, onError, loading = "lazy", forwardedRef, ...props }: ImageProps & { forwardedRef: ForwardedRef<HTMLImageElement> }) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [source, setSource] = useState(src);
  const frame = useRef<HTMLDivElement>(null);
  const retry = useRef<HTMLButtonElement>(null);
  // Reset before painting a replacement source while retaining the frame and
  // its focus target when a host replaces a failed URL during retry.
  if (source !== src) { setSource(src); setState("loading"); setAttempt(0); }
  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) throw new RangeError("aspectRatio must be positive.");
  return <div ref={frame} tabIndex={-1} className={classes("pk-image", className)} style={{ aspectRatio, ...style }} data-state={state} data-fit={fit} aria-busy={state === "loading" || undefined}>
    <img {...props} key={`${src}:${attempt}`} ref={node => {
      // A cached image can finish before hydration attaches load listeners.
      if (node?.complete && node.currentSrc) setState(node.naturalWidth > 0 ? "loaded" : "error");
      if (typeof forwardedRef === "function") return forwardedRef(node);
      if (forwardedRef) forwardedRef.current = node;
    }} src={src} alt={alt} loading={loading} className="pk-image-content" onLoad={event => { if (retry.current === event.currentTarget.ownerDocument.activeElement) frame.current?.focus(); setState("loaded"); onLoad?.(event); }} onError={event => { setState("error"); onError?.(event); }} />
    {state === "loading" ? <span className="pk-image-loading" aria-hidden="true"><Spinner size="sm" /></span> : null}
    {state === "error" || (attempt > 0 && state === "loading") ? <div className="pk-image-fallback">
      <span role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={!alt || undefined}><FileTextIcon aria-hidden="true" /><span>{fallback}</span></span>
      {retryable ? <Button ref={retry} size="xs" variant="outline" aria-label={retryLabel} aria-disabled={state === "loading" || undefined} onClick={() => { if (state === "loading") return; frame.current?.focus(); setState("loading"); setAttempt(value => value + 1); onRetry?.(); }} startIcon={<RotateCcwIcon size="sm" />}>{retryLabel}</Button> : null}
    </div> : null}
  </div>;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(props, ref) {
  return <ImageFrame {...props} forwardedRef={ref} />;
});

export interface ThumbnailProps extends Omit<ImageProps, "aspectRatio"> { size?: "sm" | "md" | "lg" }
export const Thumbnail = forwardRef<HTMLImageElement, ThumbnailProps>(function Thumbnail({ size = "md", className, retryable = false, fallback = null, ...props }, ref) {
  return <Image {...props} ref={ref} aspectRatio={1} retryable={retryable} fallback={fallback} className={classes("pk-thumbnail", `pk-thumbnail-${size}`, className)} />;
});
