export interface CatalogEntry {
  id: string;
  name: string;
  group: "Foundations" | "Controls" | "Compositions" | "Feedback";
  description: string;
  tags: readonly string[];
  source: string;
  sourceUrl: string;
  usage: string;
  inventoryIds?: readonly string[];
}
