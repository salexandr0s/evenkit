"use client";

import { Button, RotateCcwIcon, Tooltip, TooltipContent, TooltipTrigger } from "@evenkit/ui";

export function RefreshViewButton({ label, loading, onRefresh }: { label: string; loading: boolean; onRefresh: () => void }) {
  return <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" shape="icon" aria-label={label} loading={loading} onClick={onRefresh}><RotateCcwIcon /></Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>;
}
