import type { ComponentType } from "react";
import {
  ActivityIcon, ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, ArrowLeftIcon,
  ArrowRightIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon,
  ChevronRightIcon, CircleAlertIcon, CircleHelpIcon, DownloadIcon, ExternalLinkIcon,
  FileTextIcon, FolderIcon, LayoutDashboardIcon, LockIcon, LogOutIcon, MailIcon,
  MenuIcon, MoonIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, SettingsIcon,
  ShieldIcon, SunIcon, TrashIcon, UsersIcon, XIcon, type IconProps,
} from "@project-kit/ui";

export const iconCategories = [
  { value: "all", label: "All icons" },
  { value: "navigation", label: "Navigation" },
  { value: "actions", label: "Actions" },
  { value: "status", label: "Status & help" },
  { value: "content", label: "Content" },
  { value: "workspace", label: "Workspace" },
  { value: "appearance", label: "Appearance" },
] as const;
export type IconCategory = (typeof iconCategories)[number]["value"];

export interface IconEntry {
  name: string;
  label: string;
  category: Exclude<IconCategory, "all">;
  aliases: readonly string[];
  Icon: ComponentType<IconProps>;
}

// This catalog-only inventory never becomes a registry in the UI package.
export const icons: readonly IconEntry[] = [
  { name: "ActivityIcon", label: "Activity", category: "status", aliases: ["pulse", "health", "monitor"], Icon: ActivityIcon },
  { name: "ArrowDownIcon", label: "Arrow down", category: "navigation", aliases: ["direction", "descending"], Icon: ArrowDownIcon },
  { name: "ArrowUpIcon", label: "Arrow up", category: "navigation", aliases: ["direction", "ascending"], Icon: ArrowUpIcon },
  { name: "ArrowUpDownIcon", label: "Sort", category: "actions", aliases: ["order", "ascending", "descending"], Icon: ArrowUpDownIcon },
  { name: "ArrowLeftIcon", label: "Arrow left", category: "navigation", aliases: ["back", "previous", "direction"], Icon: ArrowLeftIcon },
  { name: "ArrowRightIcon", label: "Arrow right", category: "navigation", aliases: ["next", "forward", "direction"], Icon: ArrowRightIcon },
  { name: "CheckIcon", label: "Check", category: "status", aliases: ["done", "success", "complete", "approved"], Icon: CheckIcon },
  { name: "ChevronDownIcon", label: "Chevron down", category: "navigation", aliases: ["expand", "dropdown", "open"], Icon: ChevronDownIcon },
  { name: "ChevronUpIcon", label: "Chevron up", category: "navigation", aliases: ["collapse", "dropdown"], Icon: ChevronUpIcon },
  { name: "ChevronLeftIcon", label: "Chevron left", category: "navigation", aliases: ["back", "previous", "pagination"], Icon: ChevronLeftIcon },
  { name: "ChevronRightIcon", label: "Chevron right", category: "navigation", aliases: ["next", "forward", "pagination"], Icon: ChevronRightIcon },
  { name: "CircleAlertIcon", label: "Alert", category: "status", aliases: ["error", "warning", "attention", "failure"], Icon: CircleAlertIcon },
  { name: "CircleHelpIcon", label: "Help", category: "status", aliases: ["question", "support", "information"], Icon: CircleHelpIcon },
  { name: "DownloadIcon", label: "Download", category: "actions", aliases: ["save", "export"], Icon: DownloadIcon },
  { name: "ExternalLinkIcon", label: "External link", category: "navigation", aliases: ["open", "new tab", "launch"], Icon: ExternalLinkIcon },
  { name: "FileTextIcon", label: "Document", category: "content", aliases: ["file", "text", "notes", "report"], Icon: FileTextIcon },
  { name: "FolderIcon", label: "Folder", category: "content", aliases: ["directory", "files", "projects"], Icon: FolderIcon },
  { name: "LayoutDashboardIcon", label: "Dashboard", category: "navigation", aliases: ["home", "overview", "layout"], Icon: LayoutDashboardIcon },
  { name: "LockIcon", label: "Lock", category: "workspace", aliases: ["password", "lock", "credentials", "security"], Icon: LockIcon },
  { name: "LogOutIcon", label: "Log out", category: "actions", aliases: ["sign out", "exit", "leave"], Icon: LogOutIcon },
  { name: "MailIcon", label: "Mail", category: "content", aliases: ["email", "message", "envelope", "inbox"], Icon: MailIcon },
  { name: "MenuIcon", label: "Menu", category: "navigation", aliases: ["hamburger", "sidebar", "navigation"], Icon: MenuIcon },
  { name: "MoreHorizontalIcon", label: "More options", category: "actions", aliases: ["ellipsis", "overflow", "dots"], Icon: MoreHorizontalIcon },
  { name: "PlusIcon", label: "Add", category: "actions", aliases: ["plus", "create", "new"], Icon: PlusIcon },
  { name: "SearchIcon", label: "Search", category: "actions", aliases: ["find", "lookup", "magnify"], Icon: SearchIcon },
  { name: "SettingsIcon", label: "Settings", category: "workspace", aliases: ["preferences", "gear", "configuration"], Icon: SettingsIcon },
  { name: "ShieldIcon", label: "Shield", category: "workspace", aliases: ["security", "privacy", "protection", "permissions"], Icon: ShieldIcon },
  { name: "TrashIcon", label: "Delete", category: "actions", aliases: ["trash", "remove", "discard", "bin"], Icon: TrashIcon },
  { name: "UsersIcon", label: "People", category: "workspace", aliases: ["users", "team", "members", "group"], Icon: UsersIcon },
  { name: "XIcon", label: "Close", category: "actions", aliases: ["cancel", "dismiss", "clear"], Icon: XIcon },
  { name: "SunIcon", label: "Light mode", category: "appearance", aliases: ["sun", "day", "theme"], Icon: SunIcon },
  { name: "MoonIcon", label: "Dark mode", category: "appearance", aliases: ["moon", "night", "theme"], Icon: MoonIcon },
];
