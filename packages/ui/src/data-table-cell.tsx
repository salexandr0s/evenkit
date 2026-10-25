import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { DataTableCellOverflow } from "./data-table.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

interface DataTableCellProps {
  value: string | number;
  overflow: DataTableCellOverflow;
}

export function DataTableCell({ value, overflow }: DataTableCellProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const focusFrame = useRef<number | undefined>(undefined);
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);
  const text = String(value);

  const cancelFocusOpen = useCallback(() => {
    if (focusFrame.current !== undefined) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = undefined;
  }, []);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (overflow !== "truncate" || !element) {
      setTruncated(false);
      setOpen(false);
      return;
    }
    function measure() {
      if (!element) return;
      const next = element.scrollWidth > element.clientWidth;
      setTruncated(next);
      if (!next) setOpen(false);
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => { observer.disconnect(); cancelFocusOpen(); };
  }, [text, overflow, cancelFocusOpen]);

  if (overflow === "wrap") return <div className="pk-data-table-cell" data-overflow="wrap">{text}</div>;

  return (
    <Tooltip open={truncated && open} onOpenChange={(next) => setOpen(next && truncated)}>
      <TooltipTrigger
        asChild
        onFocus={(event) => {
          event.preventDefault();
          cancelFocusOpen();
          const trigger = event.currentTarget;
          // Native focus can scroll both the page and the table. Opening after
          // that scroll avoids Radix immediately dismissing the new tooltip.
          focusFrame.current = requestAnimationFrame(() => {
            focusFrame.current = requestAnimationFrame(() => {
              focusFrame.current = undefined;
              const element = textRef.current;
              if (document.activeElement === trigger && element && element.scrollWidth > element.clientWidth) setOpen(true);
            });
          });
        }}
        onBlur={cancelFocusOpen}
        onClick={cancelFocusOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") { cancelFocusOpen(); setOpen(false); }
        }}
      >
        <div className="pk-data-table-cell" data-overflow="truncate" data-truncated={truncated || undefined} tabIndex={truncated ? 0 : undefined}>
          <span ref={textRef} className="pk-data-table-cell-text">{text}</span>
        </div>
      </TooltipTrigger>
      {truncated ? <TooltipContent>{text}</TooltipContent> : null}
    </Tooltip>
  );
}
