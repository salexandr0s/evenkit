"use client";

import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@project-kit/ui";

export function PreviewDialog() {
  return <Dialog>
    <DialogTrigger asChild><Button>Open package dialog</Button></DialogTrigger>
    <DialogContent>
      <DialogTitle>Package dialog</DialogTitle>
      <DialogDescription>This dialog uses the installed package exports.</DialogDescription>
      <DialogClose asChild><Button>Close preview</Button></DialogClose>
    </DialogContent>
  </Dialog>;
}
