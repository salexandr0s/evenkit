import { useRef, useState } from "react";
import { themeNames, themes, type ColorMode, type ThemeName } from "@evenkit/tokens";
import {
  ArrowRightIcon, AvatarGroup, Badge, Button, ButtonLink, CheckIcon,
  Checkbox, CodeXmlIcon, CopyAction, LayoutGridIcon, MoonIcon, PlusIcon,
  SelectField, ShapesIcon, SunIcon, TextField, TypeIcon,
} from "@evenkit/ui";
import "./homepage.css";

interface HomepageProps {
  theme: ThemeName;
  mode: ColorMode;
  onThemeChange: (theme: ThemeName) => void;
  onToggleAppearance: () => void;
}

const starterCode = `import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import { Button } from "@evenkit/ui";

export function App() {
  return <Button>Save changes</Button>;
}`;

const collections = [
  {
    number: "01", name: "Foundations", icon: <TypeIcon />,
    description: "Shared colors, type and spacing give every screen a consistent starting point.",
    links: [{ name: "Design tokens", id: "tokens" }, { name: "Typography", id: "typography" }, { name: "Icons", id: "icons" }],
  },
  {
    number: "02", name: "Components", icon: <ShapesIcon />,
    description: "Compose forms and interactions with controls for selection, validation and feedback.",
    links: [{ name: "Buttons", id: "buttons" }, { name: "Fields", id: "fields" }, { name: "Dialogs", id: "dialog" }],
  },
  {
    number: "03", name: "Layouts & workflows", icon: <LayoutGridIcon />,
    description: "Start with a working shell, data table or chat. Connect it to your application state.",
    links: [{ name: "Admin shell", id: "admin-shell" }, { name: "Data table", id: "data-table" }, { name: "AI chat", id: "chat" }],
  },
] as const;

function ProjectSpecimen() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [projectName, setProjectName] = useState("Autumn launch");
  const [visibility, setVisibility] = useState("team");
  const [createdName, setCreatedName] = useState("");
  const [nameError, setNameError] = useState("");
  const [tasks, setTasks] = useState([true, true, false]);
  const complete = tasks.filter(Boolean).length;

  return <div className="home-specimen" aria-label="Interactive component examples">
    <div className="home-specimen-caption"><span><span className="home-live-dot" />Live components</span><span>Try them out</span></div>
    <div className="home-specimen-canvas">
      <div className="home-project-card">
        <div className="home-project-heading"><span className="home-project-icon"><PlusIcon /></span><Badge variant="outline" size="sm">Preview</Badge></div>
        <h2>New project</h2>
        <p>Name the project and choose who can see it.</p>
        <form onSubmit={event => {
          event.preventDefault();
          if (!projectName.trim()) {
            setNameError("Enter a project name.");
            nameRef.current?.focus();
            return;
          }
          setNameError("");
          setCreatedName(projectName.trim());
        }} noValidate>
          <TextField ref={nameRef} label="Project name" name="projectName" required value={projectName}
            error={nameError} onChange={event => { setProjectName(event.target.value); setNameError(""); setCreatedName(""); }} />
          <SelectField label="Visibility" name="visibility" value={visibility} onValueChange={setVisibility}
            options={[{ value: "team", label: "Everyone on the team" }, { value: "private", label: "Only me" }]} />
          <Button type="submit" fullWidth endIcon={<ArrowRightIcon size="sm" />}>Create project</Button>
        </form>
        <p className="home-project-status" role="status">{createdName ? <><CheckIcon size="sm" />{createdName} created in this preview.</> : "A local preview. Your data stays in this page."}</p>
      </div>
      <div className="home-checklist-card">
        <div className="home-checklist-heading"><h3>Launch checklist</h3><span>{complete} of 3</span></div>
        {["Choose a theme", "Build the first screen", "Check keyboard navigation"].map((label, index) => (
          <Checkbox key={label} label={label} checked={tasks[index]} onCheckedChange={checked => setTasks(current => current.map((value, position) => position === index ? checked === true : value))} />
        ))}
        <div className="home-checklist-footer"><AvatarGroup label="Example team" size="sm" avatars={[{ name: "Alex Morgan" }, { name: "Sam Rivera" }, { name: "Jamie Chen" }]} /><Badge tone={complete === 3 ? "success" : "accent"} dot>{complete === 3 ? "Complete" : "In progress"}</Badge></div>
      </div>
    </div>
    <div className="home-specimen-footnote"><CodeXmlIcon size="sm" /><span>Built with the same components you can browse.</span></div>
  </div>;
}

export function Homepage({ theme, mode, onThemeChange, onToggleAppearance }: HomepageProps) {
  const appearanceAction = mode === "light" ? "Switch to dark mode" : "Switch to light mode";

  return <div className="home-page">
    <a className="home-skip" href="#home-main">Skip to content</a>
    <header className="home-header home-container">
      <a className="home-brand" href="/" aria-label="Evenkit home"><span className="home-brand-mark" aria-hidden="true" /><span>Evenkit</span></a>
      <nav className="home-navigation" aria-label="Main navigation">
        <a href="#home-components">Components</a><a href="#home-themes">Themes</a><a href="#home-start">Get started</a>
      </nav>
      <div className="home-header-actions">
        <Button variant="ghost" shape="icon" aria-label={appearanceAction} onClick={onToggleAppearance}>{mode === "light" ? <MoonIcon /> : <SunIcon />}</Button>
        <ButtonLink variant="outline" size="sm" href="/#buttons" endIcon={<ArrowRightIcon size="sm" />}>Open catalog</ButtonLink>
      </div>
    </header>

    <main id="home-main" tabIndex={-1}>
      <section className="home-hero home-container" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-eyebrow"><span className="home-live-dot" />THE EVENKIT COMPONENT LIBRARY</p>
          <h1 id="home-title">React components<br /><span>and design tokens.</span></h1>
          <p className="home-hero-description">Design tokens, form controls and layouts for React apps. Try the live examples and copy their usage code.</p>
          <div className="home-hero-actions"><ButtonLink size="lg" href="/#buttons" endIcon={<ArrowRightIcon />}>Browse components</ButtonLink><a className="home-text-link" href="#home-start">Start building <ArrowRightIcon size="sm" /></a></div>
          <p className="home-hero-note">React 19 <span aria-hidden="true">/</span> TypeScript <span aria-hidden="true">/</span> Ordinary CSS</p>
        </div>
        <ProjectSpecimen />
      </section>

      <section className="home-theme-section" id="home-themes" aria-labelledby="home-themes-title">
        <div className="home-container home-theme-layout">
          <div className="home-theme-intro"><h2 id="home-themes-title">Multiple color<br />themes</h2><p>Choose an accent for buttons, focus rings and subtle highlights.</p></div>
          <div className="home-palette-group" role="group" aria-label="Choose a theme">
            {themeNames.map(name => <button key={name} className="home-palette" type="button" aria-label={`Apply ${themes[name].name}`} aria-pressed={theme === name} onClick={() => onThemeChange(name)}>
              <span className="home-palette-swatch" style={{ backgroundColor: themes[name].modes[mode].accent }} aria-hidden="true">{theme === name && <CheckIcon size="sm" style={{ color: themes[name].modes[mode]["on-accent"] }} />}</span>
              <span>{themes[name].name}</span>
            </button>)}
          </div>
          <p className="home-theme-status" role="status">{themes[theme].name}<span>{mode} appearance</span></p>
        </div>
      </section>

      <section className="home-collections home-container" id="home-components" aria-labelledby="home-components-title">
        <div className="home-section-heading"><div><p className="home-eyebrow">EXPLORE THE LIBRARY</p><h2 id="home-components-title">Browse the<br />component library</h2></div><p>90 examples with live previews and usage code.</p></div>
        <div className="home-collection-grid">{collections.map(collection => <article className="home-collection" key={collection.number}>
          <div className="home-collection-top"><span>{collection.number}</span>{collection.icon}</div>
          <h3>{collection.name}</h3><p>{collection.description}</p>
          <ul>{collection.links.map(link => <li key={link.id}><a href={`/#${link.id}`}>{link.name}<ArrowRightIcon size="sm" /></a></li>)}</ul>
        </article>)}</div>
      </section>

      <section className="home-start home-container" id="home-start" aria-labelledby="home-start-title">
        <div className="home-start-copy"><p className="home-eyebrow">BUILD WITH EVENKIT</p><h2 id="home-start-title">Use Evenkit<br />in your project</h2><p>Import the styles, add a component, and connect your own state. Every example in the catalog includes code you can copy.</p><p className="home-pilot-note"><Badge variant="outline" size="sm">Pilot 0.1.0</Badge>The packages are currently unpublished. With repository access, build and pack <code>@evenkit/tokens</code> and <code>@evenkit/ui</code> locally using the README instructions.</p><a className="home-text-link" href="/#buttons">See a complete example <ArrowRightIcon size="sm" /></a></div>
        <div className="home-code-panel"><div className="home-code-header"><span><CodeXmlIcon size="sm" />App.tsx</span><CopyAction text={starterCode} size="sm" variant="ghost">Copy code</CopyAction></div><pre tabIndex={0} aria-label="React starter example"><code>{starterCode}</code></pre><p>Import token styles before component styles.</p></div>
      </section>
    </main>

    <footer className="home-footer home-container"><a className="home-brand" href="/" aria-label="Evenkit home"><span className="home-brand-mark" aria-hidden="true" /><span>Evenkit</span></a><p>Version 0.1.0 · Pilot</p><nav aria-label="Footer navigation"><a href="/#tokens">Tokens</a><a href="/#themes">Themes</a><a href="/#buttons">Catalog <ArrowRightIcon size="sm" /></a></nav></footer>
  </div>;
}
