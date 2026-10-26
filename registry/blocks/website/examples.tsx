"use client";

import { useId, type ReactNode } from "react";
import { ArrowRightIcon, FileTextIcon, ButtonLink, Container, Heading, Image, LeafIcon, NavbarBrand, PencilIcon, Prose, Stack } from "@evenkit/ui";
import { WebsiteFooter, WebsiteHeader } from "./site-shell";
import { Hero } from "./hero";
import { AlternatingSections, FeatureSection } from "./feature-sections";
import { CallToAction } from "./call-to-action";
import { FaqSection } from "./faq-section";
import { ContactForm, type ContactFormValues } from "./contact-form";
import { NewsletterForm, type NewsletterFormValues } from "./newsletter-form";
import { ArticleCode, ArticleLayout } from "./article-layout";
import type { WebsiteSubmitHandler } from "./form-types";
import "./examples.css";

export interface ExampleOptions {
  headingAs?: "h1" | "h2" | "h3";
  longContent?: boolean;
  dir?: "ltr" | "rtl";
}
export interface ExampleHandlers {
  onContact: WebsiteSubmitHandler<ContactFormValues>;
  onNewsletter: WebsiteSubmitHandler<NewsletterFormValues>;
}
function useExampleId() { return `field-notes-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`; }
const fictionalNotice = "Paper Observatory is a fictional studio used in these examples.";
// Original vector artwork. Fixed neutral ink/paper colors are part of this asset.
const specimenDrawing = `<defs>
  <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#e4e4e7" stroke-width=".5"/></pattern>
  <path id="leaf" d="M0 0C-35-3-78-27-105-75C-58-83-13-53 0 0Z"/>
  <g id="branch" fill="#d4d4d8" stroke="#52525b" stroke-width="1.5">
    <path d="M0 0Q-8-160 18-328" fill="none" stroke-width="2.5"/>
    <use href="#leaf" transform="translate(1 -67) rotate(-8) scale(1.08)"/><use href="#leaf" transform="translate(0 -107) scale(-.98 .98)"/>
    <use href="#leaf" transform="translate(1 -140) rotate(2) scale(.9)"/><use href="#leaf" transform="translate(3 -176) scale(-.8 .8)"/>
    <use href="#leaf" transform="translate(7 -205) rotate(12) scale(.68)"/><use href="#leaf" transform="translate(10 -238) scale(-.56 .56)"/>
    <use href="#leaf" transform="translate(14 -264) rotate(18) scale(.42)"/>
    <path d="M0-67L-100-137M0-107L92-177M1-140L-90-210M3-176L78-231M7-205L-46-260M10-238L63-278M14-264L-14-308" fill="none"/>
  </g>
</defs>
<rect width="720" height="540" fill="#fafafa"/>
<rect x="32" y="32" width="656" height="476" fill="url(#grid)"/>
<circle cx="360" cy="264" r="174" fill="#f4f4f5" stroke="#e4e4e7"/>
<g fill="none" stroke="#a1a1aa" stroke-width="1"><path d="M32 56V32H56M664 32H688V56M32 484V508H56M664 508H688V484"/><path d="M62 452H162m-100-4v8m25-8v8m25-8v8m25-8v8m25-8v8"/></g>
<use href="#branch" transform="translate(350 442) rotate(-16)"/>
<use href="#branch" transform="translate(357 441) rotate(32) scale(.74)"/>
<g fill="none" stroke="#71717a" stroke-width="1"><path d="M248 197H132V148M446 304H588V358"/><circle cx="248" cy="197" r="4" fill="#fafafa"/><circle cx="446" cy="304" r="4" fill="#fafafa"/></g>
<g fill="#52525b" font-family="monospace" font-size="16"><text x="62" y="88">PAPER OBSERVATORY</text><text x="62" y="116" font-size="12">IMAGINED BOTANICAL STUDY</text><text x="112" y="140">A</text><text x="580" y="382">B</text></g>`;
const specimenSource = (detail: boolean) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${detail ? "180 140 360 270" : "0 0 720 540"}">${specimenDrawing}</svg>`)}`;

export function SpecimenMedia({ caption = "An imagined botanical study. Original demo artwork.", detail = false }: { caption?: string; detail?: boolean }) {
  return <figure className="pk-website-specimen"><Image src={specimenSource(detail)} alt={detail ? "Detail of the leaf shapes and fine veins in an imaginary fern drawing" : "Two finely drawn fronds of an imaginary fern on a gridded specimen sheet"} aspectRatio={4 / 3} /><figcaption><span className="pk-website-specimen-label">{detail ? "Detail B" : "Study A"}</span>{caption}</figcaption></figure>;
}

function StudioBrand() {
  return <span className="pk-website-demo-brand"><span className="pk-website-demo-mark" aria-hidden="true"><LeafIcon /></span><span>Paper Observatory</span></span>;
}

export function HeroesExample({ headingAs = "h1", longContent = false, dir = "ltr" }: ExampleOptions) {
  const id = useExampleId();
  const next = headingAs === "h1" ? "h2" : headingAs === "h2" ? "h3" : "h4";
  return <div className="pk-website-demo" dir={dir}>
    <Hero headingAs={headingAs} eyebrow="Paper Observatory · fictional example" title={longContent ? "Ein Notizbuch für Beobachtungen, gemeinsame Zeichenstunden und ausführliche Beschreibungen" : "A place for field notes"}
      description={<p>Draw an imagined specimen, describe its shape, and keep your observations together.</p>}
      actions={<ButtonLink href={`#${id}-media`}>View the specimen sheet <ArrowRightIcon className="pk-website-demo-arrow" /></ButtonLink>} />
    <Hero id={`${id}-media`} tabIndex={-1} headingAs={next} variant="media" eyebrow="Drawing workshop" title="Drawing and observation"
      description={<p>This fictional workshop pairs a drawing prompt with room for notes. Bring your own subject and materials.</p>}
      media={<SpecimenMedia />} />
  </div>;
}

export function FeaturesExample({ headingAs = "h2", longContent = false, dir = "ltr" }: ExampleOptions) {
  const items = [
    { id: "observe", title: longContent ? "Beobachtungen und ungewöhnlich ausführliche Beschreibungen sammeln" : "Observation prompts", description: <p>Start with a shape, a texture, or a question you would like to draw.</p>, icon: <LeafIcon /> },
    { id: "draw", title: "Drawing sessions", description: <p>Use the sample sheet to arrange sketches and annotations.</p>, icon: <PencilIcon /> },
    { id: "notes", title: "A shared notebook", description: <p>Place related drawings together and add a short description.</p>, icon: <FileTextIcon /> },
  ];
  return <div className="pk-website-demo" dir={dir}>
    <FeatureSection headingAs={headingAs} title="Inside the fictional studio" description={<p>A drawing prompt, a blank page, and something to notice.</p>} items={items} />
    <FeatureSection headingAs={headingAs} title="Choose a starting point" presentation="list" items={items.slice(0, 2)} />
    <AlternatingSections headingAs={headingAs} title="From a sketch to a page" items={[
      { id: "sketch", title: "Make room for a drawing", description: <p>Keep the outline simple. Leave space beside it for words.</p>, media: <SpecimenMedia /> },
      { id: "annotate", title: "Add the details you noticed", description: <p>A caption can name the subject, describe a texture, or record an unanswered question.</p>, media: <SpecimenMedia detail caption="A closer look at the imagined leaf structure." /> },
    ]} />
  </div>;
}

export function CtaExample({ headingAs = "h2", longContent = false, dir = "ltr" }: ExampleOptions) {
  const id = useExampleId();
  return <div className="pk-website-demo" dir={dir}>
    <CallToAction headingAs={headingAs} title="Plan a drawing session" description={<p>Describe the subject you would like to explore in this fictional studio.</p>}
      primaryAction={<ButtonLink href={`#${id}`}>{longContent ? "Eine ausführliche Anfrage für eine gemeinsame Zeichenstunde vorbereiten" : "Prepare an inquiry"}<ArrowRightIcon className="pk-website-demo-arrow" /></ButtonLink>}
      secondaryAction={<a className="pk-website-link" href={`#${id}`}>Read the session note</a>} />
    <Container width="reading"><p className="pk-website-demo-note" id={id} tabIndex={-1}>Demo destination: a real site would link this action to its inquiry page or booking flow.</p></Container>
  </div>;
}

export function FaqExample({ headingAs = "h2", longContent = false, dir = "ltr" }: ExampleOptions) {
  return <FaqSection headingAs={headingAs} dir={dir} title="Questions about this example" description={<p>A few notes on the imagined studio, materials, and how this demo works.</p>} items={[
    { id: "fictional", question: "Is this a real studio?", answer: <p>{fictionalNotice}</p> },
    { id: "materials", question: longContent ? "Welche Materialien und zusätzlichen Informationen können für eine ausführliche gemeinsame Zeichenstunde mitgebracht werden?" : "What should I bring?", answer: <p>For this imagined session, a notebook and a pencil are enough. Replace this answer with your own service details.</p> },
    { id: "inquiry", question: "Does the preview send an inquiry?", answer: <p>The catalog simulates a response locally. Applications supply their own submission handler.</p> },
  ]} />;
}

export function FormsExample({ onContact, onNewsletter, headingAs = "h2", longContent = false, dir = "ltr" }: ExampleOptions & ExampleHandlers) {
  return <div className="pk-website-demo pk-website-demo-forms" dir={dir}>
    <ContactForm heading="Contact the fictional studio" headingAs={headingAs} description={<><p>Have a subject in mind? Describe what you would like to draw, or share a question about the sample workshop.</p><p className="pk-website-demo-contact-note"><FileTextIcon aria-hidden="true" /> This is a fictional inquiry. Use sample details to try the form.</p></>} onSubmit={onContact}
      consent={{ label: longContent ? "Ich habe den Hinweis zu diesem fiktiven Beispiel gelesen und möchte meine Anfrage in dieser Vorschau absenden." : "I have read the fictional inquiry note.", required: true, errorMessage: "Read and accept the fictional inquiry note.", hint: "This checkbox is a sample requirement, not a production consent policy." }} />
    <NewsletterForm heading="Fictional field notes" headingAs={headingAs} description="An example newsletter about drawing and observation." onSubmit={onNewsletter}
      consent={{ label: "I would like to receive the fictional newsletter.", required: true, errorMessage: "Choose whether to receive the fictional newsletter.", hint: "Use your own consent wording and subscription policy in a real application." }} />
  </div>;
}

function DemoFooter({ target, headingAs = "h2" }: { target: string; headingAs?: "h2" | "h3" | "h4" }) {
  return <WebsiteFooter brand={<StudioBrand />} headingAs={headingAs} description={<p>A fictional studio for drawing, observation and shared notebooks.</p>}
    groups={[
      { id: "visit", label: "Explore the example", links: [{ id: "notes", label: "Field notes", href: `#${target}` }, { id: "session", label: "Drawing sessions", href: `#${target}` }] },
      { id: "notebook", label: "The notebook", links: [{ id: "specimens", label: "Specimen studies", href: `#${target}` }, { id: "about", label: "About the studio", href: `#${target}` }] },
    ]}
    contact={<p className="pk-website-demo-contact">Sample contact<br />hello@paper-observatory.invalid</p>}
    legal={<details><summary>Demo privacy note</summary><p>This fictional example supplies no legal terms or production data policy.</p></details>}
    locale={<span lang="de">Deutsch · Beispielinhalt</span>} note="Fictional content for editing." />;
}

export function ShellExample({ headingAs = "h1", longContent = false, dir = "ltr", embedded = false }: ExampleOptions & { embedded?: boolean }) {
  const id = useExampleId();
  const Main = embedded ? "div" : "main";
  return <div className="pk-website-demo" dir={dir}>
    <WebsiteHeader contentId={id} dir={dir} navLabel="Fictional studio navigation" brand={<NavbarBrand href={`#${id}`}><StudioBrand /></NavbarBrand>}
      items={[{ id: "notes", label: longContent ? "Beobachtungen und ausführliche Feldnotizen" : "Field notes", href: `#${id}` }, { id: "studio", label: "The studio", href: `#${id}` }]} />
    <Main id={id} tabIndex={-1}><Hero headingAs={headingAs} title="Paper Observatory" variant="media" eyebrow="Fictional studio" description={<p>A place for drawing prompts, imagined specimens and the notes you make along the way.</p>} media={<SpecimenMedia />} /></Main>
    <DemoFooter target={id} headingAs={headingAs === "h1" ? "h2" : headingAs === "h2" ? "h3" : "h4"} />
  </div>;
}

/** Complete editable website. The caller provides real handlers when adopting it. */
export function WebsiteExample({ onContact, onNewsletter, dir = "ltr" }: ExampleHandlers & { dir?: "ltr" | "rtl" }) {
  const id = useExampleId();
  return <div className="pk-website-demo" dir={dir}>
    <WebsiteHeader contentId={`${id}-main`} dir={dir} brand={<NavbarBrand href={`#${id}-main`}><StudioBrand /></NavbarBrand>}
      items={[{ id: "work", label: "The studio", href: `#${id}-work` }, { id: "faq", label: "Questions", href: `#${id}-faq` }]}
      contact={{ label: "Make an inquiry", href: `#${id}-contact` }} />
    <main id={`${id}-main`} tabIndex={-1}>
      <Hero title="A place for field notes" variant="media" eyebrow="Fictional studio example" description={<p>Draw an imagined specimen, describe its shape, and keep your observations together.</p>} media={<SpecimenMedia />}
        actions={<ButtonLink href={`#${id}-work`}>Explore the studio<ArrowRightIcon className="pk-website-demo-arrow" /></ButtonLink>} />
      <div id={`${id}-work`} tabIndex={-1}><FeaturesExample dir={dir} /></div>
      <CallToAction title="Plan a drawing session" primaryAction={<ButtonLink href={`#${id}-contact`}>Prepare an inquiry</ButtonLink>} />
      <div id={`${id}-faq`} tabIndex={-1}><FaqExample dir={dir} /></div>
      <div id={`${id}-contact`} tabIndex={-1}><FormsExample onContact={onContact} onNewsletter={onNewsletter} dir={dir} /></div>
    </main>
    <DemoFooter target={`${id}-main`} />
  </div>;
}

export function ArticleExample({ headingAs = "h1", longContent = false }: ExampleOptions) {
  const observation: ReactNode = <><p>Choose an imagined plant and draw the outline. Describe what you can see before giving it a name.</p><ul><li>Leave room around the sketch for annotations.</li><li>Record a question to return to later.</li></ul></>;
  return <ArticleLayout headingAs={headingAs} title={longContent ? "Ein Feldnotizbuch für ausführliche Beobachtungen, Zeichnungen und gemeinsame Anmerkungen führen" : "Keeping a field notebook"}
    introduction={<p>A short guide from the fictional Paper Observatory notebook.</p>}
    metadata={<><span>Paper Observatory editorial example</span><time dateTime="2026-10-25">25 October 2026</time><span>Fictional field guide</span></>}
    media={<SpecimenMedia />} sections={[
      { id: "observation", title: "Start with an observation", content: observation },
      { id: "specimen", title: "Describe the specimen", content: <><p>A small record can keep a sketch and its caption together. This is sample data for the fictional notebook.</p><ArticleCode label="Notebook example (JSON)">{'{\n  "specimen": "Imaginary fern",\n  "note": "A long annotation stays within the code region so that the surrounding article continues to fit a narrow screen."\n}'}</ArticleCode><p>Store the record as plain text and describe each drawing in its caption.</p></> },
    ]} related={<Stack gap="3"><Heading as={headingAs === "h1" ? "h2" : headingAs === "h2" ? "h3" : "h4"} size="4">Continue in your notebook</Heading><Prose><p>Write a caption for a second drawing and compare the shapes.</p></Prose></Stack>} />;
}
