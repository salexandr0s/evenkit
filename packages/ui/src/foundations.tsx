"use client";

import { forwardRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { classes } from "./classes.js";
import type { BadgeTone } from "./feedback.js";
import { CheckIcon, XIcon } from "./icons.js";

type DivProps = ComponentPropsWithoutRef<"div">;
function hasContent(value: ReactNode): boolean {
  return value !== null && value !== undefined && value !== false && value !== "";
}
function divPart(baseClass: string) {
  return forwardRef<HTMLDivElement, DivProps>(function Part({ className, ...props }, ref) {
    return <div {...props} ref={ref} className={classes(baseClass, className)} />;
  });
}

export const Prose = divPart("pk-prose");
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export interface HeadingProps extends ComponentPropsWithoutRef<"h2"> { as?: HeadingTag; size?: "1" | "2" | "3" | "4" }
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading({ as: Tag = "h2", size = "3", className, ...props }, ref) {
  return <Tag {...props} ref={ref} className={classes("pk-heading", className)} data-size={size} />;
});

export interface ContainerProps extends DivProps { width?: "content" | "reading" | "form" | "full" }
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container({ width = "content", className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-container", className)} data-width={width} />;
});

export type LayoutGap = "0" | "1" | "2" | "3" | "4" | "6" | "8";
export interface StackProps extends DivProps { gap?: LayoutGap }
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack({ gap = "4", className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-layout pk-stack", className)} data-gap={gap} />;
});
export interface InlineProps extends StackProps { align?: "start" | "center" | "end" | "stretch"; justify?: "start" | "center" | "end" | "between"; wrap?: boolean }
export const Inline = forwardRef<HTMLDivElement, InlineProps>(function Inline({ gap = "3", align = "center", justify = "start", wrap = true, className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-layout pk-inline", className)} data-gap={gap} data-align={align} data-justify={justify} data-wrap={wrap} />;
});
export interface GridProps extends StackProps {
  /** Maximum columns; narrower containers and viewports reduce the count. */
  columns?: 1 | 2 | 3 | 4;
}
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid({ gap = "4", columns = 2, className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-layout pk-grid", className)} data-gap={gap} data-columns={columns} />;
});

export interface SeparatorProps extends Omit<DivProps, "children"> { orientation?: "horizontal" | "vertical"; decorative?: boolean }
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator({ orientation = "horizontal", decorative = true, className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-separator", className)} data-orientation={orientation} role={decorative ? "presentation" : "separator"} aria-orientation={decorative ? undefined : orientation} />;
});

export interface CardProps extends DivProps { variant?: "default" | "elevated" | "outline" | "ghost" }
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ variant = "default", className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-card", className)} data-variant={variant} />;
});
export const CardHeader = divPart("pk-card-header");
export const CardBody = divPart("pk-card-body");
export const CardFooter = divPart("pk-card-footer");
export const CardMedia = divPart("pk-card-media");

export interface PageHeaderProps extends Omit<DivProps, "title"> {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  headingAs?: HeadingTag;
}
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader({ title, description, breadcrumbs, metadata, actions, headingAs = "h1", className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-page-header", className)}>
    {hasContent(breadcrumbs) ? <div className="pk-page-header-breadcrumbs">{breadcrumbs}</div> : null}
    <div className="pk-page-header-main"><div className="pk-page-header-content">
      <Heading as={headingAs} size="2">{title}</Heading>
      {hasContent(description) ? <div className="pk-page-header-description">{description}</div> : null}
      {hasContent(metadata) ? <div className="pk-page-header-metadata">{metadata}</div> : null}
    </div>{hasContent(actions) ? <div className="pk-page-header-actions">{actions}</div> : null}</div>
  </div>;
});
export const SectionHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function SectionHeader({ headingAs = "h2", className, ...props }, ref) {
  return <PageHeader {...props} ref={ref} headingAs={headingAs} className={classes("pk-section-header", className)} />;
});

export interface ActionGroupProps extends Omit<DivProps, "role"> { label: string }
export const ActionGroup = forwardRef<HTMLDivElement, ActionGroupProps>(function ActionGroup({ label, className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-action-group", className)} role="group" aria-label={label} />;
});
export const VisuallyHidden = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<"span">>(function VisuallyHidden({ className, ...props }, ref) {
  return <span {...props} ref={ref} className={classes("pk-visually-hidden", className)} />;
});
export const SkipLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(function SkipLink({ className, onClick, ...props }, ref) {
  return <a {...props} ref={ref} className={classes("pk-skip-link", className)} onClick={event => {
    onClick?.(event);
    const targetName = event.currentTarget.target.toLowerCase();
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (targetName && targetName !== "_self") || event.currentTarget.hasAttribute("download") || !props.href?.startsWith("#")) return;
    const target = document.getElementById(props.href.slice(1));
    target?.focus();
  }} />;
});
export const LiveStatus = forwardRef<HTMLDivElement, DivProps>(function LiveStatus({ role = "status", "aria-live": live = "polite", "aria-atomic": atomic = true, ...props }, ref) {
  return <div {...props} ref={ref} role={role} aria-live={live} aria-atomic={atomic} />;
});

export type AvatarSize = "sm" | "md" | "lg";
export interface AvatarProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  name: string;
  src?: string;
  size?: AvatarSize;
  decorative?: boolean;
  imageProps?: Omit<ComponentPropsWithoutRef<"img">, "src" | "alt" | "children">;
}
const initialSegments = new Intl.Segmenter(undefined, { granularity: "grapheme" });
function initials(name: string) {
  const parts = name.normalize("NFC").trim().split(/\s+/u).filter(Boolean);
  return [parts[0], parts.length > 1 ? parts[parts.length - 1] : undefined].filter((part): part is string => Boolean(part)).map(part => initialSegments.segment(part)[Symbol.iterator]().next().value?.segment).join("").toLocaleUpperCase() || "?";
}
function AvatarImage({ src, imageProps }: { src: string; imageProps: AvatarProps["imageProps"] }) {
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
  if (state === "failed") return null;
  return <img {...imageProps} src={src} alt="" aria-hidden="true" className={classes("pk-avatar-image", imageProps?.className)} data-loaded={state === "loaded" || undefined} onLoad={event => { setState("loaded"); imageProps?.onLoad?.(event); }} onError={event => { setState("failed"); imageProps?.onError?.(event); }} />;
}
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar({ name, src, size = "md", decorative = false, imageProps, className, role, "aria-label": label, "aria-hidden": hidden, ...props }, ref) {
  return <span {...props} ref={ref} className={classes("pk-avatar", className)} data-size={size} role={decorative ? undefined : role ?? "img"} aria-label={decorative ? undefined : label ?? name} aria-hidden={decorative ? true : hidden}>
    <span className="pk-avatar-initials" aria-hidden="true">{initials(name)}</span>
    {src ? <AvatarImage key={src} src={src} imageProps={imageProps} /> : null}
  </span>;
});
export interface AvatarGroupProps extends Omit<DivProps, "children"> { avatars: readonly AvatarProps[]; label: string; max?: number; size?: AvatarSize }
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup({ avatars, label, max = 4, size = "md", className, ...props }, ref) {
  const limit = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 4;
  const visible = avatars.slice(0, limit);
  const remaining = avatars.slice(limit);
  return <div {...props} ref={ref} role="group" aria-label={label} className={classes("pk-avatar-group", className)}>
    {visible.map((avatar, index) => <Avatar {...avatar} key={`${avatar.name}-${index}`} size={size} />)}
    {remaining.length ? <span className="pk-avatar pk-avatar-overflow" data-size={size} role="img" aria-label={`${remaining.length} more: ${remaining.map(avatar => avatar.name).join(", ")}`}>+{remaining.length}</span> : null}
  </div>;
});

export interface TagProps extends ComponentPropsWithoutRef<"span"> {
  tone?: BadgeTone;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onRemove?: () => void;
  removeLabel?: string;
  disabled?: boolean;
}
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag({ tone = "neutral", selected = false, onSelectedChange, onRemove, removeLabel, disabled = false, children, className, ...props }, ref) {
  const name = removeLabel ?? `Remove ${typeof children === "string" ? children : "tag"}`;
  return <span {...props} ref={ref} className={classes("pk-badge pk-tag", className)} data-tone={tone} data-selected={selected || undefined} data-disabled={disabled || undefined}>
    {onSelectedChange ? <button type="button" className="pk-tag-select" aria-pressed={selected} disabled={disabled} onClick={() => onSelectedChange(!selected)}><span className="pk-tag-check" aria-hidden="true"><CheckIcon size="sm" /></span><span className="pk-tag-text">{children}</span></button> : <span className="pk-tag-label">{children}</span>}
    {onRemove ? <button type="button" className="pk-tag-remove" aria-label={name} disabled={disabled} onClick={onRemove}><XIcon size="sm" /></button> : null}
  </span>;
});
export const TagGroup = forwardRef<HTMLDivElement, DivProps>(function TagGroup({ className, role = "group", ...props }, ref) {
  return <div {...props} ref={ref} role={role} className={classes("pk-tag-group", className)} />;
});

export const DataList = forwardRef<HTMLDListElement, ComponentPropsWithoutRef<"dl">>(function DataList({ className, ...props }, ref) {
  return <dl {...props} ref={ref} className={classes("pk-data-list", className)} />;
});
export interface DataListItemProps extends DivProps { term: ReactNode }
export const DataListItem = forwardRef<HTMLDivElement, DataListItemProps>(function DataListItem({ term, children, className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-data-list-item", className)}><dt>{term}</dt><dd>{children}</dd></div>;
});
export interface ListItemProps extends Omit<DivProps, "title"> { title: ReactNode; description?: ReactNode; media?: ReactNode; metadata?: ReactNode; actions?: ReactNode }
export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(function ListItem({ title, description, media, metadata, actions, className, ...props }, ref) {
  return <div {...props} ref={ref} className={classes("pk-list-item", className)} data-has-media={hasContent(media) || undefined} data-has-actions={hasContent(actions) || undefined}>
    {hasContent(media) ? <div className="pk-list-item-media">{media}</div> : null}
    <div className="pk-list-item-content"><div className="pk-list-item-title">{title}</div>{hasContent(description) ? <div className="pk-list-item-description">{description}</div> : null}{hasContent(metadata) ? <div className="pk-list-item-metadata">{metadata}</div> : null}</div>
    {hasContent(actions) ? <div className="pk-list-item-actions">{actions}</div> : null}
  </div>;
});
export const Kbd = forwardRef<HTMLElement, ComponentPropsWithoutRef<"kbd">>(function Kbd({ className, ...props }, ref) {
  return <kbd {...props} ref={ref} className={classes("pk-kbd", className)} />;
});
