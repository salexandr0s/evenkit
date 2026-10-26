"use client";

import { useId, type ReactNode } from "react";
import { FileTextIcon, ButtonLink, Container, Heading, Image, LeafIcon, NavbarBrand, PencilIcon, Prose, Stack } from "@evenkit/ui";
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
const specimenSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><rect width="720" height="480" fill="#f4f4f5"/><g fill="none" stroke="#52525b" stroke-width="2"><rect x="56" y="48" width="608" height="384" rx="8"/><path d="M360 365V140m0 135c-90 0-130-55-130-100 95 0 130 50 130 100Zm0-45c85 0 115-50 115-95-85 0-115 50-115 95Z"/><path d="M90 100h120m-120 20h80m300 240h120m-120 20h80"/></g><g fill="#52525b" font-family="monospace" font-size="14"><text x="90" y="78">FICTIONAL SPECIMEN / A</text><text x="90" y="400">OBSERVE · DRAW · ANNOTATE</text></g></svg>`;
const specimenSource = `data:image/svg+xml,${encodeURIComponent(specimenSvg)}`;

export function SpecimenMedia({ caption = "Original diagram of an imagined plant specimen." }: { caption?: string }) {
  return <figure><Image src={specimenSource} alt="Outline drawing of an imaginary plant with two leaves on a specimen sheet" aspectRatio={3 / 2} /><figcaption>{caption}</figcaption></figure>;
}

export function HeroesExample({ headingAs = "h1", longContent = false, dir = "ltr" }: ExampleOptions) {
  const id = useExampleId();
  const next = headingAs === "h1" ? "h2" : headingAs === "h2" ? "h3" : "h4";
  return <div className="pk-website-demo" dir={dir}>
    <Hero headingAs={headingAs} eyebrow="Paper Observatory · fictional example" title={longContent ? "Ein Notizbuch für Beobachtungen, gemeinsame Zeichenstunden und ausführliche Beschreibungen" : "A place for field notes"}
      description={<p>Draw an imagined specimen, describe its shape, and keep your observations together.</p>}
      actions={<ButtonLink href={`#${id}-media`}>View the specimen sheet</ButtonLink>} />
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
    <FeatureSection headingAs={headingAs} title="Inside the fictional studio" items={items} />
    <FeatureSection headingAs={headingAs} title="Choose a starting point" presentation="list" items={items.slice(0, 2)} />
    <AlternatingSections headingAs={headingAs} title="From a sketch to a page" items={[
      { id: "sketch", title: "Make room for a drawing", description: <p>Keep the outline simple. Leave space beside it for words.</p>, media: <SpecimenMedia /> },
      { id: "annotate", title: "Add the details you noticed", description: <p>A caption can name the subject, describe a texture, or record an unanswered question.</p>, media: <SpecimenMedia caption="The same fictional sheet, ready for annotations." /> },
    ]} />
  </div>;
}

export function CtaExample({ headingAs = "h2", longContent = false }: ExampleOptions) {
  const id = useExampleId();
  return <div className="pk-website-demo">
    <CallToAction headingAs={headingAs} title="Plan a drawing session" description={<p>Describe the subject you would like to explore in this fictional studio.</p>}
      primaryAction={<ButtonLink href={`#${id}`}>{longContent ? "Eine ausführliche Anfrage für eine gemeinsame Zeichenstunde vorbereiten" : "Prepare an inquiry"}</ButtonLink>}
      secondaryAction={<a className="pk-website-link" href={`#${id}`}>Read the session note</a>} />
    <Container width="reading"><p className="pk-website-demo-note" id={id} tabIndex={-1}>Demo destination: a real site would link this action to its inquiry page or booking flow.</p></Container>
  </div>;
}

export function FaqExample({ headingAs = "h2", longContent = false, dir = "ltr" }: ExampleOptions) {
  return <FaqSection headingAs={headingAs} dir={dir} title="Questions about this example" items={[
    { id: "fictional", question: "Is this a real studio?", answer: <p>{fictionalNotice}</p> },
    { id: "materials", question: longContent ? "Welche Materialien und zusätzlichen Informationen können für eine ausführliche gemeinsame Zeichenstunde mitgebracht werden?" : "What should I bring?", answer: <p>For this imagined session, a notebook and a pencil are enough. Replace this answer with your own service details.</p> },
    { id: "inquiry", question: "Does the preview send an inquiry?", answer: <p>The catalog simulates a response locally. Applications supply their own submission handler.</p> },
  ]} />;
}

export function FormsExample({ onContact, onNewsletter, headingAs = "h2", longContent = false, dir = "ltr" }: ExampleOptions & ExampleHandlers) {
  return <div className="pk-website-demo pk-website-demo-forms" dir={dir}>
    <ContactForm heading="Contact the fictional studio" headingAs={headingAs} description="Try an inquiry with a name, email address and message." onSubmit={onContact}
      consent={{ label: longContent ? "Ich habe den Hinweis zu diesem fiktiven Beispiel gelesen und möchte meine Anfrage in dieser Vorschau absenden." : "I have read the fictional inquiry note.", required: true, errorMessage: "Read and accept the fictional inquiry note.", hint: "This checkbox is a sample requirement, not a production consent policy." }} />
    <NewsletterForm heading="Fictional field notes" headingAs={headingAs} description="An example newsletter about drawing and observation." onSubmit={onNewsletter}
      consent={{ label: "I would like to receive the fictional newsletter.", required: true, errorMessage: "Choose whether to receive the fictional newsletter.", hint: "Use your own consent wording and subscription policy in a real application." }} />
  </div>;
}

function DemoFooter({ target, headingAs = "h2" }: { target: string; headingAs?: "h2" | "h3" | "h4" }) {
  return <WebsiteFooter brand={<strong>Paper Observatory</strong>} headingAs={headingAs} description={<p>{fictionalNotice}</p>}
    groups={[{ id: "visit", label: "Explore the example", links: [{ id: "notes", label: "Field notes", href: `#${target}` }, { id: "session", label: "Drawing sessions", href: `#${target}` }] }]}
    contact={<p>Sample contact: hello@paper-observatory.invalid</p>}
    legal={<details><summary>Demo privacy note</summary><p>This fictional example supplies no legal terms or production data policy.</p></details>}
    locale={<span lang="de">Deutsch · Beispielinhalt</span>} note="Fictional content for editing." />;
}

export function ShellExample({ headingAs = "h1", longContent = false, dir = "ltr", embedded = false }: ExampleOptions & { embedded?: boolean }) {
  const id = useExampleId();
  const Main = embedded ? "div" : "main";
  return <div className="pk-website-demo" dir={dir}>
    <WebsiteHeader contentId={id} dir={dir} navLabel="Fictional studio navigation" brand={<NavbarBrand href={`#${id}`}>Paper Observatory</NavbarBrand>}
      items={[{ id: "notes", label: longContent ? "Beobachtungen und ausführliche Feldnotizen" : "Field notes", href: `#${id}` }, { id: "studio", label: "The studio", href: `#${id}` }]} />
    <Main id={id} tabIndex={-1}><Hero headingAs={headingAs} title="Paper Observatory" eyebrow="Fictional studio" description={<p>{fictionalNotice}</p>} /></Main>
    <DemoFooter target={id} headingAs={headingAs === "h1" ? "h2" : headingAs === "h2" ? "h3" : "h4"} />
  </div>;
}

/** Complete editable website. The caller provides real handlers when adopting it. */
export function WebsiteExample({ onContact, onNewsletter, dir = "ltr" }: ExampleHandlers & { dir?: "ltr" | "rtl" }) {
  const id = useExampleId();
  return <div className="pk-website-demo" dir={dir}>
    <WebsiteHeader contentId={`${id}-main`} dir={dir} brand={<NavbarBrand href={`#${id}-main`}>Paper Observatory</NavbarBrand>}
      items={[{ id: "work", label: "The studio", href: `#${id}-work` }, { id: "faq", label: "Questions", href: `#${id}-faq` }]}
      contact={{ label: "Make an inquiry", href: `#${id}-contact` }} />
    <main id={`${id}-main`} tabIndex={-1}>
      <Hero title="A place for field notes" variant="media" eyebrow="Fictional studio example" description={<p>{fictionalNotice}</p>} media={<SpecimenMedia />}
        actions={<ButtonLink href={`#${id}-work`}>Explore the studio</ButtonLink>} />
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
      { id: "specimen", title: "Describe the specimen", content: <><p>A small record can keep a sketch and its caption together. This is sample data for the fictional notebook.</p><ArticleCode label="Notebook example (JSON)">{'{\n  "specimen": "Imaginary two-leaf plant",\n  "note": "A long annotation stays within the code region so that the surrounding article continues to fit a narrow screen."\n}'}</ArticleCode><p>Store the record as plain text and describe each drawing in its caption.</p></> },
    ]} related={<Stack gap="3"><Heading as={headingAs === "h1" ? "h2" : headingAs === "h2" ? "h3" : "h4"} size="4">Continue in your notebook</Heading><Prose><p>Write a caption for a second drawing and compare the shapes.</p></Prose></Stack>} />;
}
