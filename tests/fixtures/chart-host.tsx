import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BarChart } from "../../packages/ui/src/charts.js";
import type { ChartDatum } from "../../packages/ui/src/chart-types.js";
import "@evenkit/tokens/css";
import "@evenkit/ui/css";

const series = Array.from({ length: 6 }, (_, index) => ({
  id: `series-${index}`,
  label: `Distribution channel ${index + 1} across international partner locations`,
}));
const initial: readonly ChartDatum[] = Array.from({ length: 3 }, (_, index) => ({
  id: `period-${index}`, label: `Period ${index + 1}`,
  values: Object.fromEntries(series.map(item => [item.id, index + 1])),
}));

function ChartHost() {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  return <main>
    <h1>Chart host</h1>
    <button onClick={() => setData(rows => [...rows].reverse())}>Reverse periods</button>
    <button onClick={() => setData(rows => rows.slice(1))}>Remove first period</button>
    <button onClick={() => setLoading(true)}>Load report</button>
    <button onClick={() => setLoading(false)}>Restore report</button>
    <button>Outside control</button>
    <BarChart title="Partner orders" unit="orders" orientation="horizontal" data={data} series={series} loading={loading} />
  </main>;
}
createRoot(document.getElementById("root")!).render(<ChartHost />);
