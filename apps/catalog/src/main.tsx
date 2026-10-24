import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@project-kit/tokens/css";
import "@project-kit/ui/css";
import "./catalog.css";
import { Catalog } from "./catalog";

const root = document.getElementById("root");
if (!root) throw new Error("The catalog root is missing.");

createRoot(root).render(
  <StrictMode>
    <Catalog />
  </StrictMode>
);
