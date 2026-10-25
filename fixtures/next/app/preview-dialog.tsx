"use client";

import { Button, Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, type DialogSize } from "@project-kit/ui";

export function PreviewDialog() {
  const size: DialogSize = "lg";
  return <Dialog>
    <DialogTrigger asChild><Button>Open package dialog</Button></DialogTrigger>
    <DialogContent size={size} scroll="body">
      <DialogHeader>
        <DialogTitle>Package dialog</DialogTitle>
        <DialogDescription>This dialog uses the installed package exports.</DialogDescription>
      </DialogHeader>
      <DialogBody><p>Content scrolls while actions remain available.</p></DialogBody>
      <DialogFooter><DialogClose asChild><Button>Close preview</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>;
}
