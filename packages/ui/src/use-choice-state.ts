import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

type ChoiceValue = string | boolean;

/** Keep Radix's synchronous reset callbacks behind the native cancellable reset boundary. */
export function useChoiceState<T extends ChoiceValue>(value: T | null | undefined, defaultValue: T | undefined, emptyValue: T, onChange: ((value: T) => void) | undefined, region: RefObject<HTMLElement | null>, formId: string | undefined, kind: "select" | "checkbox" | "radio") {
  const [local, setLocal] = useState(defaultValue ?? emptyValue);
  const current = value === null ? emptyValue : value ?? local;
  const initial = useRef(current);
  const latest = useRef({ value, current, onChange });
  const resetEvent = useRef<Event | null>(null);
  const version = useRef(0);
  const [resetRevision, setResetRevision] = useState(0);
  const reconciled = useRef(0);

  useLayoutEffect(() => {
    if (latest.current.current !== current) version.current += 1;
    latest.current = { value, current, onChange };
  });

  function nativeControls() {
    const element = region.current;
    if (kind === "select") {
      const select = element?.nextElementSibling;
      return select instanceof HTMLSelectElement && select.getAttribute("aria-hidden") === "true" ? [select] : [];
    }
    return Array.from(element?.querySelectorAll<HTMLInputElement>('input[aria-hidden="true"]') ?? []);
  }

  function change(next: T) {
    // eventPhase returns to NONE when dispatch ends; later changes in this turn stay usable.
    if (resetEvent.current?.eventPhase) return;
    if (next === latest.current.current) return;
    version.current += 1;
    if (latest.current.value === undefined) setLocal(next);
    latest.current.onChange?.(next);
  }

  useEffect(() => {
    const form = nativeControls()[0]?.form;
    if (!form) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const reset = (event: Event) => {
      resetEvent.current = event;
      const before = version.current;
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (event.defaultPrevented) return;
        if (version.current === before) change(initial.current);
        // A controlled host may ignore the callback. Repair native serialization after its render.
        setResetRevision(revision => revision + 1);
      }, 0);
      timers.add(timer);
    };
    form.addEventListener("reset", reset, true);
    return () => { form.removeEventListener("reset", reset, true); timers.forEach(clearTimeout); };
  }, [region, formId]);

  useLayoutEffect(() => {
    if (reconciled.current === resetRevision) return;
    reconciled.current = resetRevision;
    for (const control of nativeControls()) {
      if (control instanceof HTMLSelectElement) {
        if (control.value !== current) control.value = String(current);
      }
      else {
        const checked = kind === "radio" ? control.value === current : current === true;
        const mixed = kind === "checkbox" && current === "indeterminate";
        if (control.checked !== checked) control.checked = checked;
        if (control.indeterminate !== mixed) control.indeterminate = mixed;
      }
    }
  }, [current, resetRevision]);

  return [current, change] as const;
}
