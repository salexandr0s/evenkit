import { useId, useState } from "react";
import { BookmarkIcon, Button, CircleHelpIcon, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@project-kit/ui";
import "./tooltip-preview.css";

export function TooltipPreview() {
  const hintId = useId();
  const [bookmarked, setBookmarked] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <TooltipProvider>
      <div className="tooltip-workbench">
        <section className="tooltip-example" aria-label="Tooltip interaction example">
          <div><h3>Labels for icon actions</h3><p>Hover or focus the button to see its hint. Escape dismisses the tooltip; activating the button bookmarks this preview.</p></div>
          <div className="tooltip-example-action">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" shape="icon" aria-label="Bookmark project" aria-describedby={hintId} aria-pressed={bookmarked} onClick={() => {
                  setBookmarked(!bookmarked);
                  setNotice(bookmarked ? "Bookmark removed from this preview." : "Project bookmarked in this preview.");
                }}><BookmarkIcon /></Button>
              </TooltipTrigger>
              <TooltipContent>Keep this project in your bookmarks.</TooltipContent>
            </Tooltip>
            <span id={hintId}>Changes stay in this preview.</span>
          </div>
          <p role="status" className="tooltip-preview-notice">{notice}</p>
        </section>
        <section className="tooltip-example" aria-label="Long tooltip example">
          <div><h3>Hints that wrap</h3><p>Private projects are visible only to invited people. The tooltip adds detail without hiding the basic rule.</p></div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline" startIcon={<CircleHelpIcon />}>Sharing help</Button></TooltipTrigger>
              <TooltipContent side="right">Only invited people can open a private project. Changing its visibility does not change the permissions of existing members. Review those permissions before inviting someone new.</TooltipContent>
            </Tooltip>
          </div>
        </section>
        <section className="tooltip-example" aria-label="Tooltip placement examples">
          <div><h3>Placement</h3><p>Choose a preferred side. Tooltips move when needed to fit the available space.</p></div>
          <div className="tooltip-placement-actions">
            {(["top", "right", "bottom", "left"] as const).map(side => (
              <Tooltip key={side}>
                <TooltipTrigger asChild><Button variant="outline" aria-label={`Tooltip on ${side}`}>{side}</Button></TooltipTrigger>
                <TooltipContent side={side}>Preferred side: {side}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
