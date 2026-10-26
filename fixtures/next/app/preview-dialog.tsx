"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, type DialogSize } from "@evenkit/ui";

export function PreviewDialog() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  const size: DialogSize = "lg";
  return <Dialog>
    <DialogTrigger asChild><Button disabled={!hydrated} data-package-hydrated={hydrated}>Open package dialog</Button></DialogTrigger>
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
