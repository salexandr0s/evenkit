# Rehearsal: reusable component motion

This pass applies Stageshow's continuity and cause-driven feedback guidance to the real library exports. The catalog serves as a consumer for rehearsal. Its task text and framing do not count as component improvements.

## Causes and visible results

- A pending Button crossfades its persistent label and decorative spinner within the same footprint. It retains action contrast and its accessible name. The hidden spinner has no active animation.
- Combobox and Autocomplete use Base UI's starting/ending transition states. The surface retains its identity through exit while its separate Radix dismissal registration follows logical open state. Closed surfaces are inert and reject queued input.
- Accordion and Collapsible animate measured geometry and content opacity. Neighboring content follows their height and spacing. Reversal samples the current pose; closing releases owned focus before making content inert. Initial-open content retains natural geometry.
- Native Progress and Meter fills retarget between values. Segmented and toggle foreground/border feedback follows the selected surface.
- Chat history opens a continuous grid track, with readable fixed-width content revealed after space opens. Hidden controls retain their hidden semantics. The conversation avoids its previous single-frame 260 px shift.
- Image and Thumbnail reveal loaded content over a stable frame. Retry and failure controls keep their visibility and focus. Successful cached/fast arrivals may use the same reveal.

Existing tokens provide 120 ms feedback, 160 ms component motion and 220 ms chat geometry. Reduced motion settles immediately. Text is not scaled with its surface.

## Rehearsed states

Evidence is under `.artifacts/stageshow-components-2026-11-02/` at the repository root.

- `root-motion.json` and `root-{chromium,webkit}.webm`: live Button opacity, loading reversal, stable dimensions, idle cleanup, reduced motion and combobox surface exit.
- `choice-layer-review.json`: Combo/Autocomplete retained DOM, queued activation rejection, same-node reopening, parent dismissal after normal frame processing and preference changes during exit.
- `core/verification.json`: first-open and initial-open disclosures, continuous reversal, sibling geometry, resize/content changes, controlled close/focus, reduced motion and unmount cleanup. Both engines measured zero height/padding discontinuity at retarget points.
- `reviewer/disclosure-contract-results.json` and `reviewer/disclosure-shorthand-results.json`: independent direct/slotted caller attributes, styles, shorthand zeroes, refs, custom IDs and forceMount ownership checks.
- `core/selection-motion.json` and `core/fill-pixels.json`: native fill and selection-color intermediate frames, retargeting and reduced motion.
- `extended/`: chat maximize, restore, rapid reversal, resize and keyboard history; Image load/retry/cached/reduced-motion frames and fixed geometry.

The source, tests and motion probes received independent review. Every concrete new-code finding was corrected and rechecked. The complete 116-entry source ledger is `all-review.json`; reused baseline captures are labeled separately from fresh motion recordings.

## Retained behavior and limits

Menu, popover and toast exit experiments retained closed Radix interaction layers and delayed Escape ownership. Those production edits were restored. Their existing close behavior remains in place.

The pre-goal choice implementation also reproduced a subframe parent Escape-listener restoration gap. Retained-exit registration is checked after normal frame processing; eliminating that existing upstream timing gap is not claimed. Two existing WebKit focus assertions and WebKit SVG variable-size console messages were reproduced on the baseline and recorded without weakening checks.

Physical devices and screen-reader speech were not exercised. The disclosure `forceMount` path preserves the caller's existing lifecycle and visibility ownership. An initially closed slotted-to-forceMount no-node case was reproduced with raw Radix and is not attributed to these changes.
