import type { ReactNode } from "react";
import "@project-kit/tokens/css";
import "@project-kit/ui/css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-kit-theme="grove" data-kit-mode="light"><body>{children}</body></html>;
}
