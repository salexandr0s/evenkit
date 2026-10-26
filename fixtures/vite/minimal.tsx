import { createRoot } from "react-dom/client";
import { Button } from "@evenkit/ui";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

const element = document.getElementById("root");
if (!element) throw new Error("Missing fixture root.");
createRoot(element).render(<Button>Minimal package consumer</Button>);
