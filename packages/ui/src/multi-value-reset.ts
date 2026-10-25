import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/** Native reset can be cancelled by a later listener; observe it after dispatch finishes. */
export function useValueFieldReset(input: RefObject<HTMLInputElement | null>, formId: string | undefined, reset: () => void) {
  const latest = useRef(reset);
  useLayoutEffect(() => { latest.current = reset; });
  useEffect(() => {
    const form = input.current?.form;
    if (!form) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const handle = (event: Event) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (!event.defaultPrevented) latest.current();
      }, 0);
      timers.add(timer);
    };
    form.addEventListener("reset", handle);
    return () => { form.removeEventListener("reset", handle); timers.forEach(clearTimeout); };
  }, [input, formId]);
}
