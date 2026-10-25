"use client";

import { createContext, type ReactNode } from "react";

export type IconAnimation = "hover" | "static";

export interface IconProviderProps {
  animation: IconAnimation;
  children: ReactNode;
}

export const IconAnimationContext = createContext<IconAnimation>("hover");

/** Sets the default for a subtree, including icons rendered through portals. */
export function IconProvider({ animation, children }: IconProviderProps) {
  return <IconAnimationContext value={animation}>{children}</IconAnimationContext>;
}
