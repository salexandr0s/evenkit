import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";
import "./starter.css";

export const metadata: Metadata = {
  title: "Evenkit admin starter",
  description: "A working admin example with fictional workspace data.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-kit-theme="neutral" data-kit-mode="light"><body>{children}</body></html>;
}
