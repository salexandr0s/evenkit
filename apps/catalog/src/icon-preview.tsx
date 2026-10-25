import { useState, type ComponentType } from "react";
import { foundation } from "@project-kit/tokens";
import {
  ActionMessage, ActivityIcon, ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, ArrowLeftIcon,
  ArrowRightIcon, Button, CheckIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon,
  ChevronRightIcon, CircleAlertIcon, CircleHelpIcon, DownloadIcon, EmptyState, ExternalLinkIcon,
  FileTextIcon, FolderIcon, Input, Label, LayoutDashboardIcon, LogOutIcon, MailIcon,
  MenuIcon, MoonIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, SettingsIcon, ShieldIcon,
  SunIcon, TrashIcon, UsersIcon, XIcon, type IconProps
} from "@project-kit/ui";

interface IconEntry { name: string; Icon: ComponentType<IconProps> }

const icons: readonly IconEntry[] = [
  { name: "ActivityIcon", Icon: ActivityIcon }, { name: "ArrowDownIcon", Icon: ArrowDownIcon },
  { name: "ArrowUpIcon", Icon: ArrowUpIcon }, { name: "ArrowUpDownIcon", Icon: ArrowUpDownIcon },
  { name: "ArrowLeftIcon", Icon: ArrowLeftIcon }, { name: "ArrowRightIcon", Icon: ArrowRightIcon },
  { name: "CheckIcon", Icon: CheckIcon }, { name: "ChevronDownIcon", Icon: ChevronDownIcon },
  { name: "ChevronUpIcon", Icon: ChevronUpIcon }, { name: "ChevronLeftIcon", Icon: ChevronLeftIcon },
  { name: "ChevronRightIcon", Icon: ChevronRightIcon }, { name: "CircleAlertIcon", Icon: CircleAlertIcon },
  { name: "CircleHelpIcon", Icon: CircleHelpIcon }, { name: "DownloadIcon", Icon: DownloadIcon },
  { name: "ExternalLinkIcon", Icon: ExternalLinkIcon }, { name: "FileTextIcon", Icon: FileTextIcon },
  { name: "FolderIcon", Icon: FolderIcon }, { name: "LayoutDashboardIcon", Icon: LayoutDashboardIcon },
  { name: "LogOutIcon", Icon: LogOutIcon }, { name: "MailIcon", Icon: MailIcon },
  { name: "MenuIcon", Icon: MenuIcon }, { name: "MoreHorizontalIcon", Icon: MoreHorizontalIcon },
  { name: "PlusIcon", Icon: PlusIcon }, { name: "SearchIcon", Icon: SearchIcon },
  { name: "SettingsIcon", Icon: SettingsIcon }, { name: "ShieldIcon", Icon: ShieldIcon },
  { name: "TrashIcon", Icon: TrashIcon }, { name: "UsersIcon", Icon: UsersIcon },
  { name: "XIcon", Icon: XIcon }, { name: "SunIcon", Icon: SunIcon }, { name: "MoonIcon", Icon: MoonIcon }
];

export function IconPreview() {
  const [query, setQuery] = useState("");
  const [activated, setActivated] = useState(false);
  const visible = icons.filter(({ name }) => name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="catalog-demo-stack">
      <div className="catalog-icon-search catalog-demo-field">
        <Label htmlFor="icon-search">Search icons</Label>
        <Input id="icon-search" type="search" placeholder="For example, folder or arrow" value={query} onChange={(event) => setQuery(event.target.value)} aria-describedby="icon-results" />
        <p className="catalog-caption" id="icon-results" role="status">{visible.length} of {icons.length} icons</p>
      </div>
      {visible.length ? (
        <ul className="catalog-icon-grid" aria-label="Available icons">
          {visible.map(({ name, Icon }) => <li key={name}><Icon /><code>{name}</code></li>)}
        </ul>
      ) : <EmptyState title="No icons match your search" description="Try an icon name such as search or chevron." action={<Button variant="outline" onClick={() => setQuery("")}>Clear icon search</Button>} />}
      <div className="catalog-demo-divider">
        <p className="catalog-state-label">Token sizes</p>
        <div className="catalog-demo-actions catalog-icon-sizes">
          {(["sm", "md", "lg"] as const).map((size) => <div key={size}><FolderIcon size={size} /><code>{size} · {foundation.icon.size[size]}</code></div>)}
        </div>
      </div>
      <div className="catalog-demo-divider catalog-demo-stack">
        <p className="catalog-state-label">Accessible patterns</p>
        <div className="catalog-demo-actions"><SearchIcon label="Search projects" /><span>A standalone icon has its own label.</span></div>
        <div className="catalog-demo-actions"><Button aria-label="Add preview project" onClick={() => setActivated(true)}><PlusIcon /></Button><span>An icon button puts the label on the button.</span></div>
        {activated && <ActionMessage tone="info">Icon button activated in this preview.</ActionMessage>}
      </div>
    </div>
  );
}
