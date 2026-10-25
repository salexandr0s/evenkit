"use client";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Download,
  ExternalLink,
  FileText,
  Folder,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Menu,
  Ellipsis,
  Plus,
  Search,
  Settings,
  Shield,
  Trash,
  Users,
  X,
  Sun,
  Moon,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { forwardRef } from "react";
import { classes } from "./classes.js";

export type IconSize = "sm" | "md" | "lg";

export interface IconProps extends Omit<LucideProps, "size" | "width" | "height" | "color" | "stroke" | "strokeWidth" | "absoluteStrokeWidth" | "nonScalingStroke" | "children" | "role" | "aria-hidden" | "aria-label" | "aria-labelledby" | "focusable" | "tabIndex"> {
  size?: IconSize;
  label?: string;
}

function createKitIcon(Glyph: LucideIcon, displayName: string) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function KitIcon(
    { size = "md", label, className, ...props },
    ref,
  ) {
    const accessibleLabel = label?.trim();
    return (
      <Glyph
        {...props}
        ref={ref}
        className={classes("pk-icon", className)}
        data-size={size}
        size={`var(--pk-icon-size-${size})`}
        color="currentColor"
        strokeWidth="var(--pk-icon-stroke-width)"
        absoluteStrokeWidth={false}
        nonScalingStroke={false}
        focusable="false"
        tabIndex={undefined}
        role={accessibleLabel ? "img" : undefined}
        aria-label={accessibleLabel || undefined}
        aria-hidden={accessibleLabel ? undefined : true}
      />
    );
  });
  Icon.displayName = displayName;
  return Icon;
}

export const ActivityIcon = /* @__PURE__ */ createKitIcon(Activity, "ActivityIcon");
export const ArrowDownIcon = /* @__PURE__ */ createKitIcon(ArrowDown, "ArrowDownIcon");
export const ArrowUpIcon = /* @__PURE__ */ createKitIcon(ArrowUp, "ArrowUpIcon");
export const ArrowUpDownIcon = /* @__PURE__ */ createKitIcon(ArrowUpDown, "ArrowUpDownIcon");
export const ArrowLeftIcon = /* @__PURE__ */ createKitIcon(ArrowLeft, "ArrowLeftIcon");
export const ArrowRightIcon = /* @__PURE__ */ createKitIcon(ArrowRight, "ArrowRightIcon");
export const CheckIcon = /* @__PURE__ */ createKitIcon(Check, "CheckIcon");
export const ChevronDownIcon = /* @__PURE__ */ createKitIcon(ChevronDown, "ChevronDownIcon");
export const ChevronUpIcon = /* @__PURE__ */ createKitIcon(ChevronUp, "ChevronUpIcon");
export const ChevronLeftIcon = /* @__PURE__ */ createKitIcon(ChevronLeft, "ChevronLeftIcon");
export const ChevronRightIcon = /* @__PURE__ */ createKitIcon(ChevronRight, "ChevronRightIcon");
export const CircleAlertIcon = /* @__PURE__ */ createKitIcon(CircleAlert, "CircleAlertIcon");
export const CircleHelpIcon = /* @__PURE__ */ createKitIcon(CircleHelp, "CircleHelpIcon");
export const DownloadIcon = /* @__PURE__ */ createKitIcon(Download, "DownloadIcon");
export const ExternalLinkIcon = /* @__PURE__ */ createKitIcon(ExternalLink, "ExternalLinkIcon");
export const FileTextIcon = /* @__PURE__ */ createKitIcon(FileText, "FileTextIcon");
export const FolderIcon = /* @__PURE__ */ createKitIcon(Folder, "FolderIcon");
export const LayoutDashboardIcon = /* @__PURE__ */ createKitIcon(LayoutDashboard, "LayoutDashboardIcon");
export const LockIcon = /* @__PURE__ */ createKitIcon(Lock, "LockIcon");
export const LogOutIcon = /* @__PURE__ */ createKitIcon(LogOut, "LogOutIcon");
export const MailIcon = /* @__PURE__ */ createKitIcon(Mail, "MailIcon");
export const MenuIcon = /* @__PURE__ */ createKitIcon(Menu, "MenuIcon");
export const MoreHorizontalIcon = /* @__PURE__ */ createKitIcon(Ellipsis, "MoreHorizontalIcon");
export const PlusIcon = /* @__PURE__ */ createKitIcon(Plus, "PlusIcon");
export const SearchIcon = /* @__PURE__ */ createKitIcon(Search, "SearchIcon");
export const SettingsIcon = /* @__PURE__ */ createKitIcon(Settings, "SettingsIcon");
export const ShieldIcon = /* @__PURE__ */ createKitIcon(Shield, "ShieldIcon");
export const TrashIcon = /* @__PURE__ */ createKitIcon(Trash, "TrashIcon");
export const UsersIcon = /* @__PURE__ */ createKitIcon(Users, "UsersIcon");
export const XIcon = /* @__PURE__ */ createKitIcon(X, "XIcon");
export const SunIcon = /* @__PURE__ */ createKitIcon(Sun, "SunIcon");
export const MoonIcon = /* @__PURE__ */ createKitIcon(Moon, "MoonIcon");
