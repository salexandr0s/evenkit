import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Spinner } from "@evenkit/ui";
import { Homepage } from "./homepage";
import { useCatalogPreferences } from "./use-catalog-preferences";

const Catalog = lazy(() => import("./catalog").then(module => ({ default: module.Catalog })));

export function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const preferences = useCatalogPreferences();
  const isHome = !hash || hash === "#home" || hash.startsWith("#home-");
  const previousHome = useRef(isHome);

  useEffect(() => {
    const change = () => setHash(window.location.hash);
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);

  useEffect(() => {
    document.title = isHome ? "Evenkit · React components, themes and layouts" : "Evenkit · Component catalog";
    if (isHome && hash.startsWith("#home-")) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else if (previousHome.current !== isHome) {
      window.scrollTo(0, 0);
    }
    previousHome.current = isHome;
  }, [hash, isHome]);

  return isHome ? <Homepage {...preferences} /> : (
    <Suspense fallback={<main aria-label="Component catalog"><Spinner label="Loading component catalog" /></main>}>
      <Catalog {...preferences} />
    </Suspense>
  );
}
