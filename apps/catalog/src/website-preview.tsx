import { useRef, useState, type MouseEvent } from "react";
import { Checkbox, Inline } from "@evenkit/ui";
import { ArticleExample, CtaExample, FaqExample, FeaturesExample, FormsExample, HeroesExample, ShellExample } from "../../../registry/blocks/website/examples";
import "./website-preview.css";

/** The catalog owns hash routing; local demo links scroll without selecting another entry. */
function followPreviewAnchor(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href^='#']") : null;
  if (!anchor || (anchor.target && anchor.target !== "_self")) return;
  const target = document.getElementById(anchor.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: "nearest" });
}

export function WebsitePreview({ id }: { id: string }) {
  const [rtl, setRtl] = useState(false);
  const [longContent, setLongContent] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const failure = useRef(false);
  async function simulateSubmission(_values: unknown, { signal }: { signal: AbortSignal }) {
    const fail = failure.current;
    failure.current = false;
    setFailNext(false);
    await new Promise<void>((resolve, reject) => {
      if (signal.aborted) { reject(new DOMException("Cancelled", "AbortError")); return; }
      const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 650);
      function abort() { window.clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); }
      signal.addEventListener("abort", abort, { once: true });
    });
    if (fail) throw new Error("Simulated failure");
  }
  const options = { headingAs: "h3" as const, longContent, dir: rtl ? "rtl" as const : "ltr" as const };
  return <div className="website-preview">
    <Inline className="website-preview-options" gap="4">
      <Checkbox label="Preview RTL" checked={rtl} onCheckedChange={value => setRtl(value === true)} />
      <Checkbox label="Long localized content" checked={longContent} onCheckedChange={value => setLongContent(value === true)} />
      {id === "website-forms" ? <Checkbox label="Fail the next submission" checked={failNext} onCheckedChange={value => { failure.current = value === true; setFailNext(value === true); }} /> : null}
    </Inline>
    <p className="website-preview-note">Fictional content. Submissions are simulated in this preview.</p>
    <div className="website-preview-stage" dir={options.dir} onClick={followPreviewAnchor}>
      {id === "website-shell" ? <ShellExample {...options} embedded /> : null}
      {id === "website-heroes" ? <HeroesExample {...options} /> : null}
      {id === "website-features" ? <FeaturesExample {...options} /> : null}
      {id === "website-cta" ? <CtaExample {...options} /> : null}
      {id === "website-faq" ? <FaqExample {...options} /> : null}
      {id === "website-forms" ? <FormsExample {...options} onContact={simulateSubmission} onNewsletter={simulateSubmission} /> : null}
      {id === "website-article" ? <ArticleExample {...options} /> : null}
    </div>
  </div>;
}
