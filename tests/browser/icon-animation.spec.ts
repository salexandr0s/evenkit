import { expect, test, type Locator } from "@playwright/test";
import * as kit from "@evenkit/ui";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

async function artwork(icon: Locator) {
  return icon.evaluate(svg => [...svg.querySelectorAll("*")].map(element => {
    const style = getComputedStyle(element);
    return [element.getAttribute("d"), element.getAttribute("points"), style.transform, style.opacity, style.strokeDasharray, style.strokeDashoffset];
  }));
}

test("moving artwork remains visible beyond its SVG in standalone icons, compact buttons and badges", async ({ page }) => {
  await page.goto("/#icons");
  await expect(page.locator(".icon-gallery")).toBeVisible();
  const cases = [
    { name: "large search", icon: createElement(kit.SearchIcon, { size: "lg" }) },
    { name: "medium card", icon: createElement(kit.CreditCardIcon) },
    { name: "compact search", icon: createElement(kit.Button, { size: "xs", shape: "icon", "aria-label": "Search sample" }, createElement(kit.SearchIcon, { size: "sm" })) },
    { name: "badge card", icon: createElement(kit.Badge, { icon: createElement(kit.CreditCardIcon, { size: "sm" }) }, "Payment") },
  ];
  const markup = renderToStaticMarkup(createElement("div", null, cases.map(({ name, icon }) => createElement("div", { key: name, "data-motion-case": name }, icon))));
  const results = await page.evaluate(markup => {
    const fixture = document.createElement("div");
    fixture.style.cssText = "position:fixed;left:40px;top:180px;z-index:9999;background:white;padding:24px";
    fixture.innerHTML = markup;
    fixture.firstElementChild?.setAttribute("style", "display:flex;align-items:center;gap:40px");
    document.body.append(fixture);
    try {
      return [...fixture.querySelectorAll<HTMLElement>("[data-motion-case]")].map(container => {
        const svg = container.querySelector("svg")!;
        const search = container.dataset.motionCase!.includes("search");
        const shape = svg.querySelector<SVGGraphicsElement>(search ? "circle" : "rect")!;
        const group = shape.parentElement!;
        const before = [svg, container].map(node => node.getBoundingClientRect().toJSON());
        // Freeze a real hover pose: hit testing proves the overflowing stroke is
        // painted, including ancestor clipping. The sweep below checks live motion.
        group.style.transform = search ? "translateY(-4px)" : "translateX(-4px)";
        const point = new DOMPoint(search ? 11 : 2, search ? 3 : 12).matrixTransform(shape.getScreenCTM()!);
        const bounds = svg.getBoundingClientRect();
        return {
          name: container.dataset.motionCase,
          outsideViewport: point.x < bounds.left || point.y < bounds.top,
          painted: document.elementFromPoint(point.x, point.y) === shape,
          layoutUnchanged: JSON.stringify(before) === JSON.stringify([svg, container].map(node => node.getBoundingClientRect().toJSON())),
        };
      });
    } finally {
      fixture.remove();
    }
  }, markup);
  expect(results).toEqual(cases.map(({ name }) => ({ name, outsideViewport: true, painted: true, layoutUnchanged: true })));
});

test("every catalog icon stays still at rest, animates its artwork, and resets on leave", async ({ page }) => {
  await page.goto("/#icons");
  await expect(page.locator(".icon-card")).toHaveCount(Object.keys(kit).filter(name => name.endsWith("Icon")).length);
  const result = await page.locator(".icon-gallery").evaluate(async gallery => {
    const cards = [...gallery.querySelectorAll<HTMLElement>(".icon-card")];
    const icons = cards.map(card => card.querySelector<SVGSVGElement>(".icon-card-sample svg")!);
    const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const snapshot = (svg: SVGSVGElement) => JSON.stringify([...svg.querySelectorAll("*")].map(element => {
      const style = getComputedStyle(element);
      const matrix = new DOMMatrix(style.transform === "none" ? undefined : style.transform);
      const geometry = ["d", "points", "x", "x1", "x2", "y", "y1", "y2", "cx", "cy", "r", "width", "height"].map(name => element.getAttribute(name));
      return [geometry, [...matrix.toFloat64Array()].map(value => Number(value.toFixed(4))), style.opacity, style.strokeDasharray, style.strokeDashoffset];
    }));
    await frame();
    await frame();
    const before = icons.map(snapshot);
    for (let i = 0; i < 8; i++) await frame();
    const movingAtRest = cards.filter((_, index) => snapshot(icons[index]!) !== before[index]).map(card => card.dataset.icon);
    cards.forEach(card => card.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse" })));
    const changed = new Set<number>();
    for (let i = 0; i < 50; i++) {
      await frame();
      icons.forEach((icon, index) => { if (snapshot(icon) !== before[index]) changed.add(index); });
    }
    cards.forEach(card => card.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse" })));
    await frame();
    await frame();
    return {
      movingAtRest,
      neverAnimated: cards.filter((_, index) => !changed.has(index)).map(card => card.dataset.icon),
      failedToReset: cards.filter((_, index) => snapshot(icons[index]!) !== before[index]).map(card => card.dataset.icon),
      remainingAnimations: icons.flatMap(icon => icon.getAnimations({ subtree: true })).filter(animation => animation.playState === "running").length,
    };
  });
  expect(result).toEqual({ movingAtRest: [], neverAnimated: [], failedToReset: [], remainingAnimations: 0 });
});

test("hover follows controls and respects static overrides, disabled states, touch and reduced motion", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/#icons");
  const examples = page.getByRole("region", { name: "Icon animation comparison" });
  const animated = examples.locator('[data-icon-animation="hover"]');
  const still = examples.locator('[data-icon-animation="static"]');
  const before = await artwork(animated);
  // Record changes before hovering; polling can miss an entire short animation.
  const movement = await animated.evaluateHandle(svg => {
    const before = svg.innerHTML;
    const result = { changed: false, observer: new MutationObserver(() => {
      if (svg.innerHTML !== before) result.changed = true;
    }) };
    result.observer.observe(svg, { subtree: true, attributes: true, attributeFilter: ["style", "d"] });
    return result;
  });
  await examples.locator(".icon-motion-example").first().hover();
  await expect(animated).toHaveAttribute("data-icon-hovered", "true");
  await expect.poll(() => movement.evaluate(result => result.changed)).toBe(true);
  await movement.evaluate(result => result.observer.disconnect());
  await movement.dispose();
  await examples.locator(".icon-motion-example").last().hover();
  await expect(animated).not.toHaveAttribute("data-icon-hovered");
  await expect.poll(() => artwork(animated)).toEqual(before);
  expect(await artwork(still)).toEqual(before);

  await page.getByRole("combobox", { name: "Icon animation", exact: true }).click();
  await page.getByRole("option", { name: "Static", exact: true }).click();
  const galleryIcon = page.locator('.icon-card[data-icon="ActivityIcon"] .icon-card-sample svg');
  await expect(galleryIcon).toHaveAttribute("data-icon-animation", "static");
  await galleryIcon.hover();
  await expect(galleryIcon).not.toHaveAttribute("data-icon-hovered");
  // Explicit props override a provider default in both directions.
  await examples.locator(".icon-motion-example").first().hover();
  await expect(animated).toHaveAttribute("data-icon-hovered", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(animated).not.toHaveAttribute("data-icon-hovered");
  await expect.poll(() => artwork(animated)).toEqual(before);
  await still.hover();
  await animated.hover();
  await expect(animated).not.toHaveAttribute("data-icon-hovered");
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.getByRole("combobox", { name: "Icon animation", exact: true }).click();
  await page.getByRole("option", { name: "Hover animation", exact: true }).click();
  const button = page.getByRole("button", { name: "Create preview project", exact: true });
  const icon = button.locator("svg");
  await button.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await button.focus();
  await expect(icon).not.toHaveAttribute("data-icon-hovered");
  // Hover the text/padding, outside the icon itself.
  await button.hover({ position: { x: 110, y: 15 } });
  await expect(icon).toHaveAttribute("data-icon-hovered", "true");
  await button.evaluate(element => element.setAttribute("disabled", ""));
  await expect(icon).not.toHaveAttribute("data-icon-hovered");
  await page.mouse.move(0, 0);
  await button.evaluate(element => element.removeAttribute("disabled"));
  await button.dispatchEvent("pointerenter", { pointerType: "touch" });
  await expect(icon).not.toHaveAttribute("data-icon-hovered");
  await button.hover();
  await expect(icon).toHaveAttribute("data-icon-hovered", "true");
  await button.evaluate(element => element.setAttribute("aria-busy", "true"));
  await expect(icon).not.toHaveAttribute("data-icon-hovered");
  await expect(icon).toHaveAttribute("aria-hidden", "true");
  // Route changes can remove an icon while its parent remains hovered.
  await examples.locator(".icon-motion-example").first().hover();
  await expect(animated).toHaveAttribute("data-icon-hovered", "true");
  await page.evaluate(() => { location.hash = "#buttons"; });
  await expect(examples).toHaveCount(0);
  expect(errors).toEqual([]);
});
