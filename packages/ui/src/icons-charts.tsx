"use client";

import { ChartColumn, ChartBar, ChartBarIncreasing, ChartColumnIncreasing, ChartLine, ChartArea, ChartPie, ChartScatter, ChartCandlestick, ChartSpline, ChartNetwork, ChartNoAxesColumn, ChartColumnStacked, TrendingUp, TrendingDown, ChartGantt } from "lucide-react";
import { createKitIcon } from "./create-kit-icon.js";
import { ChartBarIncreasingMotion } from "./animated-icons/chart-bar-increasing.js";
import { ChartColumnIncreasingMotion } from "./animated-icons/chart-column-increasing.js";
import { ChartLineMotion } from "./animated-icons/chart-line.js";
import { ChartPieMotion } from "./animated-icons/chart-pie.js";
import { ChartScatterMotion } from "./animated-icons/chart-scatter.js";
import { ChartSplineMotion } from "./animated-icons/chart-spline.js";
import { TrendingUpMotion } from "./animated-icons/trending-up.js";
import { TrendingDownMotion } from "./animated-icons/trending-down.js";

export const ChartColumnIcon = /* @__PURE__ */ createKitIcon(ChartColumn, "ChartColumnIcon", "columns");
export const ChartBarIcon = /* @__PURE__ */ createKitIcon(ChartBar, "ChartBarIcon", "rows");
export const ChartBarIncreasingIcon = /* @__PURE__ */ createKitIcon(ChartBarIncreasing, "ChartBarIncreasingIcon", ChartBarIncreasingMotion);
export const ChartColumnIncreasingIcon = /* @__PURE__ */ createKitIcon(ChartColumnIncreasing, "ChartColumnIncreasingIcon", ChartColumnIncreasingMotion);
export const ChartLineIcon = /* @__PURE__ */ createKitIcon(ChartLine, "ChartLineIcon", ChartLineMotion);
export const ChartAreaIcon = /* @__PURE__ */ createKitIcon(ChartArea, "ChartAreaIcon", "detail");
export const ChartPieIcon = /* @__PURE__ */ createKitIcon(ChartPie, "ChartPieIcon", ChartPieMotion);
export const ChartScatterIcon = /* @__PURE__ */ createKitIcon(ChartScatter, "ChartScatterIcon", ChartScatterMotion);
export const ChartCandlestickIcon = /* @__PURE__ */ createKitIcon(ChartCandlestick, "ChartCandlestickIcon", "columns");
export const ChartSplineIcon = /* @__PURE__ */ createKitIcon(ChartSpline, "ChartSplineIcon", ChartSplineMotion);
export const ChartNetworkIcon = /* @__PURE__ */ createKitIcon(ChartNetwork, "ChartNetworkIcon", "dots");
export const ChartNoAxesColumnIcon = /* @__PURE__ */ createKitIcon(ChartNoAxesColumn, "ChartNoAxesColumnIcon", "columns");
export const ChartColumnStackedIcon = /* @__PURE__ */ createKitIcon(ChartColumnStacked, "ChartColumnStackedIcon", "columns");
export const TrendingUpIcon = /* @__PURE__ */ createKitIcon(TrendingUp, "TrendingUpIcon", TrendingUpMotion);
export const TrendingDownIcon = /* @__PURE__ */ createKitIcon(TrendingDown, "TrendingDownIcon", TrendingDownMotion);
export const ChartGanttIcon = /* @__PURE__ */ createKitIcon(ChartGantt, "ChartGanttIcon", "rows");
