import type { ReactNode } from "react";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-kit-theme="grove" data-kit-mode="light"><body>{children}</body></html>;
}
