import type { ChartDatum, ChartSeries } from "@evenkit/ui";

export const orderSeries: readonly ChartSeries[] = [
  { id: "current", label: "Current period", color: 1 },
  { id: "previous", label: "Previous period", color: 2 },
];

export const weeklyOrders: readonly ChartDatum[] = [
  { id: "mon", label: "Monday", values: { current: 24, previous: 18 } },
  { id: "tue", label: "Tuesday", values: { current: 31, previous: 23 } },
  { id: "wed", label: "Wednesday", values: { current: null, previous: 29 } },
  { id: "thu", label: "Thursday", values: { current: 0, previous: 25 } },
  { id: "fri", label: "Friday", values: { current: 42, previous: 32 } },
  { id: "sat", label: "Saturday", values: { current: 38, previous: 29 } },
  { id: "sun", label: "Sunday", values: { current: 46, previous: 34 } },
];

export const monthlyOrders: readonly ChartDatum[] = [
  { id: "week1", label: "1–7 October", values: { current: 204, previous: 192 } },
  { id: "week2", label: "8–14 October", values: { current: 218, previous: 205 } },
  { id: "week3", label: "15–21 October", values: { current: 230, previous: 211 } },
  { id: "week4", label: "22–28 October", values: { current: null, previous: 225 } },
  { id: "week5", label: "29–31 October", values: { current: null, previous: 84 } },
];

export const channelSeries: readonly ChartSeries[] = [
  { id: "direct", label: "Direct orders", color: 1 },
  { id: "partner", label: "Partner orders", color: 3 },
  { id: "returns", label: "Returns", color: 5 },
];

export const regionalOrders: readonly ChartDatum[] = [
  { id: "north", label: "Northern region", values: { direct: 42, partner: 28, returns: -8 } },
  { id: "central", label: "Central region and surrounding distribution partners", values: { direct: 56, partner: 37, returns: -12 } },
  { id: "south", label: "Southern region", values: { direct: 0, partner: null, returns: 0 } },
];

export const periodOptions = [
  { value: "week", label: "19–25 October 2026" },
  { value: "month", label: "October 2026" },
];
export const comparisonOptions = [
  { value: "previous", label: "Previous period" },
  { value: "none", label: "No comparison" },
];
export const unitOptions = [
  { value: "orders", label: "Orders" },
  { value: "revenue", label: "Revenue (EUR)" },
];

// A prepared fixture, supplied by this demo host. The kit does not generate exports.
export const sampleExport = "data:text/csv;charset=utf-8,day%2Corders%0AMonday%2C24%0ATuesday%2C31%0A";
