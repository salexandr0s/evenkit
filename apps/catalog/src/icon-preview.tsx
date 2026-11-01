import { useId, useRef, useState } from "react";
import { foundation } from "@evenkit/tokens";
import { ActionMessage, Badge, BellIcon, Button, CheckIcon, CopyIcon, EmptyState, FilterXIcon, IconButton, IconProvider, Label, PlusIcon, SearchField, SearchIcon, Select, Tooltip, TooltipContent, TooltipTrigger, type IconAnimation, type IconSize } from "@evenkit/ui";
import { iconCategories, icons, type IconCategory } from "./icon-data";
import "./icon-preview.css";

const sizes: readonly { value: IconSize; label: string }[] = [
  { value: "sm", label: `Small · ${foundation.icon.size.sm}` },
  { value: "md", label: `Medium · ${foundation.icon.size.md}` },
  { value: "lg", label: `Large · ${foundation.icon.size.lg}` },
];

const animations: readonly { value: IconAnimation; label: string }[] = [
  { value: "hover", label: "Hover animation" },
  { value: "static", label: "Static" },
];

export function IconPreview() {
  const id = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const copyRequest = useRef(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<IconCategory>("all");
  const [size, setSize] = useState<IconSize>("md");
  const [animation, setAnimation] = useState<IconAnimation>("hover");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState<string>();
  const [activated, setActivated] = useState<"text" | "icon">();
  const search = query.trim().toLowerCase();
  const visible = icons.filter((icon) => (
    (category === "all" || icon.category === category)
    && [icon.name, icon.label, ...icon.aliases].join(" ").toLowerCase().includes(search)
  ));
  const filtered = query !== "" || category !== "all";

  function resetFilters() {
    setQuery("");
    setCategory("all");
    searchRef.current?.focus();
  }

  async function copyImport(name: string) {
    const request = ++copyRequest.current;
    setNotice("");
    setCopied(undefined);
    try {
      await navigator.clipboard.writeText(`import { ${name} } from "@evenkit/ui";`);
      if (request === copyRequest.current) {
        setCopied(name);
        setNotice(`Copied the ${name} import.`);
      }
    } catch {
      if (request === copyRequest.current) setNotice(`Copy is unavailable. Select the import below ${name} to copy it.`);
    }
  }

  return (
    <IconProvider animation={animation}>
      <div className="icon-workbench">
        <section aria-label="Icon reference" className="icon-reference">
          <div className="icon-intro">
            <div><h3>Find an icon</h3><p>Hover an icon to see it move. Compare sizes and static versions, then copy a named import.</p></div>
            <Badge tone="accent">{icons.length} icons</Badge>
          </div>
          <section className="icon-motion-comparison" aria-label="Icon animation comparison">
            <div className="icon-motion-example" data-icon-trigger>
              <span className="icon-card-sample"><BellIcon size="lg" animation="hover" /></span>
              <div><h4>Hover animation</h4><code>{'<BellIcon animation="hover" />'}</code></div>
            </div>
            <div className="icon-motion-example" data-icon-trigger>
              <span className="icon-card-sample"><BellIcon size="lg" animation="static" /></span>
              <div><h4>Static</h4><code>{'<BellIcon animation="static" />'}</code></div>
            </div>
            <p>Hover animations play once and reset when you leave. Reduced-motion preferences keep both versions still.</p>
          </section>
          <div className="icon-filters">
            <div className="icon-search-field">
              <SearchField ref={searchRef} id={`${id}-search`} label="Search icons" clearLabel="Clear icon search" placeholder="Try delete, directory, or arrow" value={query} onValueChange={setQuery} aria-describedby={`${id}-results`} />
            </div>
            <div className="icon-category-field">
              <Label htmlFor={`${id}-category`}>Icon category</Label>
              <Select id={`${id}-category`} value={category} options={iconCategories} onValueChange={(value) => {
                const selected = iconCategories.find((item) => item.value === value);
                if (selected) setCategory(selected.value);
              }} />
            </div>
            <div className="icon-size-field">
              <Label htmlFor={`${id}-size`}>Icon size</Label>
              <Select id={`${id}-size`} value={size} options={sizes} onValueChange={(value) => {
                const selected = sizes.find((item) => item.value === value);
                if (selected) setSize(selected.value);
              }} />
            </div>
            <div className="icon-animation-field">
              <Label htmlFor={`${id}-animation`}>Icon animation</Label>
              <Select id={`${id}-animation`} value={animation} options={animations} onValueChange={(value) => {
                const selected = animations.find((item) => item.value === value);
                if (selected) setAnimation(selected.value);
              }} />
            </div>
          </div>
          <div className="icon-results-header">
            <p id={`${id}-results`} role="status">{visible.length} of {icons.length} icons</p>
            <span><code>--pk-icon-size-{size}</code> · {foundation.icon.size[size]}</span>
            {visible.length > 0 && filtered && <IconButton label="Reset icon filters" onClick={resetFilters}><FilterXIcon size="sm" /></IconButton>}
          </div>
          <p className="icon-copy-notice" role="status">{notice}</p>
          {visible.length > 0 ? (
            <ul className="icon-gallery" role="list" aria-label="Available icons">
              {visible.map(({ name, label, category: iconCategory, Icon }) => (
                <li className="icon-card" key={name} data-icon={name} data-icon-trigger>
                  <div className="icon-card-heading">
                    <span className="icon-card-sample"><Icon size={size} /></span>
                    <div><h4>{label}</h4><span>{iconCategories.find((item) => item.value === iconCategory)?.label}</span></div>
                  </div>
                  <code className="icon-export-name">{name}</code>
                  <div className="icon-import">
                    <div className="icon-import-code">
                      <code>{`import { ${name} } from "@evenkit/ui";`}</code>
                      <code>{`<${name} size="${size}" animation="${animation}" />`}</code>
                    </div>
                    <Tooltip><TooltipTrigger asChild><Button size="xs" variant="ghost" shape="icon" aria-label={`Copy import for ${name}`} onClick={() => void copyImport(name)}>{copied === name ? <CheckIcon size="sm" /> : <CopyIcon size="sm" />}</Button></TooltipTrigger><TooltipContent>{copied === name ? "Copied" : `Copy import for ${name}`}</TooltipContent></Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          ) : <EmptyState title="No icons match your search" description="Try a name or an action, or reset the filters to search every category." action={<Button variant="outline" onClick={resetFilters}>Reset icon filters</Button>} />}
        </section>

        <section className="icon-patterns" aria-label="Accessible icon patterns">
          <div className="icon-patterns-heading"><h3>Give meaning to the action</h3><p>Icons next to text can be decorative. A button needs an accessible name; an independent icon needs a label.</p></div>
          <div className="icon-pattern-grid">
            <div className="icon-pattern">
              <h4>With visible text</h4>
              <div className="icon-pattern-example"><Button variant="outline" onClick={() => setActivated("text")}><PlusIcon />Create preview project</Button></div>
              <p>The text names the button. The icon is hidden from assistive technology.</p>
              <code>{'<Button><PlusIcon />Create project</Button>'}</code>
            </div>
            <div className="icon-pattern">
              <h4>Icon button</h4>
              <div className="icon-pattern-example"><Tooltip><TooltipTrigger asChild><Button shape="icon" aria-label="Add preview project" onClick={() => setActivated("icon")}><PlusIcon /></Button></TooltipTrigger><TooltipContent>Add preview project</TooltipContent></Tooltip></div>
              <p>Put the accessible name on the button, leaving its icon decorative.</p>
              <code>{'<Button shape="icon" aria-label="Add project"><PlusIcon /></Button>'}</code>
            </div>
            <div className="icon-pattern">
              <h4>Independent meaning</h4>
              <div className="icon-pattern-example"><SearchIcon label="Search projects" size="lg" /></div>
              <p>A label exposes this icon as an image. It remains noninteractive.</p>
              <code>{'<SearchIcon label="Search projects" />'}</code>
            </div>
          </div>
          {activated && <ActionMessage tone="info">{activated === "icon" ? "Icon button activated in this preview." : "Project action activated in this preview."}</ActionMessage>}
        </section>
      </div>
    </IconProvider>
  );
}
