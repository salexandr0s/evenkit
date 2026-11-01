import type { ReactNode } from "react";
import {
  AccessibilityIcon, ActivityIcon, ArrowLeftRightIcon, ArrowUpDownIcon, BellIcon,
  BoldIcon, Building2Icon, CalculatorIcon, CalendarDaysIcon, CameraIcon,
  ChartColumnIcon, ChartLineIcon, ChartNoAxesCombinedIcon, ChevronDownIcon, ChevronRightIcon,
  ChevronsUpDownIcon, CircleAlertIcon, CircleCheckIcon, CircleDotIcon, CircleHelpIcon,
  ClockIcon, CloudCheckIcon, Columns3Icon, CompassIcon, ContactRoundIcon,
  CopyIcon, DatabaseIcon, DownloadIcon, FilePenLineIcon, FileTextIcon,
  FilterIcon, FilterXIcon, FolderIcon, GaugeIcon, GroupIcon,
  HeadingIcon, InboxIcon, InfoIcon, KeyRoundIcon, KeyboardIcon,
  LayoutDashboardIcon, LayoutGridIcon, ListChecksIcon, ListCollapseIcon, ListFilterIcon,
  ListIcon, ListTreeIcon, ListXIcon, LockIcon, MaximizeIcon,
  MenuIcon, MessageSquareIcon, MessageSquareTextIcon, PanelLeftIcon, PanelRightIcon,
  PanelTopDashedIcon, PanelTopIcon, PanelsTopLeftIcon, PencilIcon, RectangleHorizontalIcon,
  RotateCcwIcon, SaveIcon, SearchIcon, SeparatorHorizontalIcon, SettingsIcon,
  ShapesIcon, ShieldIcon, SlidersHorizontalIcon, SquareCheckIcon, SquareIcon,
  SunIcon, Table2Icon, TagsIcon, ToggleRightIcon, TriangleAlertIcon,
  TypeIcon, UploadIcon, UserIcon, UserPlusIcon, UsersIcon,
  WifiIcon,
} from "@evenkit/ui";

export const navigationIcons: Record<string, ReactNode> = {
  login: <KeyRoundIcon />, signup: <UserPlusIcon />, "password-reset": <RotateCcwIcon />, "new-password": <LockIcon />,
  themes: <SunIcon />, tokens: <LayoutDashboardIcon />, icons: <ShapesIcon />,
  buttons: <SquareIcon />, fields: <PencilIcon />, select: <ChevronDownIcon />,
  dialog: <MaximizeIcon />, tooltips: <CircleHelpIcon />, "admin-shell": <PanelLeftIcon />,
  "data-table": <Table2Icon />, chat: <MessageSquareIcon />, status: <CircleCheckIcon />,
  loading: <RotateCcwIcon />, empty: <InboxIcon />,
  typography: <TypeIcon />, "layout-widths": <RectangleHorizontalIcon />,
  "layout-groups": <LayoutGridIcon />, separator: <SeparatorHorizontalIcon />,
  card: <PanelTopIcon />, "page-header": <HeadingIcon />, toolbar: <SlidersHorizontalIcon />,
  accessibility: <AccessibilityIcon />, avatar: <UserIcon />, tags: <TagsIcon />,
  "data-list": <ListTreeIcon />, "list-item": <ListIcon />, kbd: <KeyboardIcon />,
  checkbox: <SquareCheckIcon />, "radio-group": <CircleDotIcon />, switch: <ToggleRightIcon />,
  "toggle-group": <BoldIcon />, "segmented-control": <Columns3Icon />, "button-group": <GroupIcon />,
  "copy-action": <CopyIcon />, progress: <GaugeIcon />, fieldset: <ListChecksIcon />,
  "form-summary": <ListXIcon />, "search-field": <SearchIcon />, "password-field": <KeyRoundIcon />,
  combobox: <ListFilterIcon />, "form-actions": <SaveIcon />, "save-status": <CloudCheckIcon />,
  tabs: <PanelsTopLeftIcon />, accordion: <ListCollapseIcon />, collapsible: <ChevronsUpDownIcon />,
  breadcrumbs: <ChevronRightIcon />, navbar: <PanelTopDashedIcon />, pagination: <ArrowLeftRightIcon />,
  "dropdown-menu": <MenuIcon />, popover: <MessageSquareTextIcon />, "alert-dialog": <TriangleAlertIcon />,
  sheet: <PanelRightIcon />, toast: <BellIcon />, "account-menu": <ContactRoundIcon />,
  "semantic-table": <Table2Icon />, filters: <FilterIcon />, "applied-filters": <FilterXIcon />,
  "file-input": <UploadIcon />, "file-row": <FileTextIcon />, "list-page": <ListIcon />,
  "edit-page": <FilePenLineIcon />, "error-pages": <CircleAlertIcon />,
  calendar: <CalendarDaysIcon />, "date-picker": <CalendarDaysIcon />, "date-range": <CalendarDaysIcon />,
  "time-field": <ClockIcon />, formatting: <TypeIcon />, "multi-select": <ListChecksIcon />,
  "token-input": <TagsIcon />, "number-field": <CalculatorIcon />, "number-recipes": <CalculatorIcon />,
  "remote-data-table": <DatabaseIcon />, "sort-control": <ArrowUpDownIcon />, "bulk-actions": <ListChecksIcon />,
  "column-settings": <Columns3Icon />, "activity-timeline": <ActivityIcon />, "record-detail": <FileTextIcon />,
  "workspace-switcher": <Building2Icon />, "settings-layout": <SettingsIcon />,
  "profile-settings": <UserIcon />, "appearance-preferences": <SunIcon />, "upload-queue": <UploadIcon />,
  image: <CameraIcon />, "command-palette": <SearchIcon />, "step-indicator": <ListChecksIcon />,
  "onboarding-wizard": <PanelsTopLeftIcon />,
  "avatar-upload": <UserIcon />, "file-preview": <CameraIcon />, "document-library": <FolderIcon />,
  "website-shell": <PanelTopIcon />, "website-heroes": <HeadingIcon />,
  "website-features": <LayoutGridIcon />, "website-cta": <SquareIcon />,
  "website-faq": <CircleHelpIcon />, "website-forms": <ContactRoundIcon />,
  "website-article": <FileTextIcon />,
  "rich-chat": <MessageSquareTextIcon />,
  "team-members": <UsersIcon />, "invitation-acceptance": <UserPlusIcon />,
  "role-capability-editor": <ShieldIcon />, "audit-viewer": <ActivityIcon />,
  "notification-center": <BellIcon />, "notification-preferences": <SettingsIcon />,
  "persistent-banner": <InfoIcon />, "connection-status": <WifiIcon />, "presence-unread": <CircleDotIcon />,
  statistic: <GaugeIcon />, "chart-frame": <ChartNoAxesCombinedIcon />,
  "line-chart": <ChartLineIcon />, "bar-chart": <ChartColumnIcon />,
  "reporting-controls": <DownloadIcon />, dashboard: <LayoutDashboardIcon />,
};

export interface CatalogSection {
  id: string;
  label: string;
  icon: ReactNode;
  entryIds: readonly string[];
}

export const catalogSections: readonly CatalogSection[] = [
  {
    id: "foundations", label: "Foundations", icon: <ShapesIcon />,
    entryIds: ["themes", "tokens", "icons", "typography", "accessibility", "kbd", "formatting"],
  },
  {
    id: "layout", label: "Layout", icon: <LayoutGridIcon />,
    entryIds: ["layout-widths", "layout-groups", "separator", "card", "page-header", "toolbar"],
  },
  {
    id: "actions", label: "Actions & selection", icon: <SquareCheckIcon />,
    entryIds: ["buttons", "button-group", "copy-action", "checkbox", "radio-group", "switch", "toggle-group", "segmented-control"],
  },
  {
    id: "forms", label: "Forms & input", icon: <PencilIcon />,
    entryIds: ["fields", "select", "fieldset", "search-field", "password-field", "combobox", "multi-select", "token-input", "form-summary", "form-actions", "save-status"],
  },
  {
    id: "dates", label: "Dates & numbers", icon: <CalendarDaysIcon />,
    entryIds: ["calendar", "date-picker", "date-range", "time-field", "number-field", "number-recipes"],
  },
  {
    id: "navigation", label: "Navigation", icon: <CompassIcon />,
    entryIds: ["admin-shell", "navbar", "tabs", "breadcrumbs", "pagination", "accordion", "collapsible", "command-palette", "workspace-switcher", "step-indicator"],
  },
  {
    id: "overlays", label: "Overlays", icon: <PanelsTopLeftIcon />,
    entryIds: ["dialog", "tooltips", "dropdown-menu", "popover", "alert-dialog", "sheet"],
  },
  {
    id: "data", label: "Data & records", icon: <Table2Icon />,
    entryIds: ["data-table", "remote-data-table", "semantic-table", "data-list", "list-item", "filters", "applied-filters", "sort-control", "bulk-actions", "column-settings", "list-page", "edit-page", "record-detail", "activity-timeline"],
  },
  {
    id: "files", label: "Files & media", icon: <FolderIcon />,
    entryIds: ["file-input", "file-row", "upload-queue", "image", "file-preview", "avatar-upload", "document-library"],
  },
  {
    id: "feedback", label: "Feedback & chat", icon: <BellIcon />,
    entryIds: ["status", "tags", "loading", "empty", "progress", "toast", "persistent-banner", "connection-status", "presence-unread", "notification-center", "notification-preferences", "chat", "rich-chat"],
  },
  {
    id: "account", label: "Account & access", icon: <UsersIcon />,
    entryIds: ["avatar", "account-menu", "settings-layout", "profile-settings", "appearance-preferences", "team-members", "invitation-acceptance", "role-capability-editor", "audit-viewer", "login", "signup", "password-reset", "new-password", "onboarding-wizard", "error-pages"],
  },
  {
    id: "reporting", label: "Charts & reporting", icon: <ChartNoAxesCombinedIcon />,
    entryIds: ["statistic", "chart-frame", "line-chart", "bar-chart", "reporting-controls", "dashboard"],
  },
  {
    id: "website", label: "Website blocks", icon: <PanelTopIcon />,
    entryIds: ["website-shell", "website-heroes", "website-features", "website-cta", "website-faq", "website-forms", "website-article"],
  },
];

export function sectionForEntry(id: string) {
  return catalogSections.find(section => section.entryIds.includes(id));
}
