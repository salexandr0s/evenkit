"use client";

import { Leaf, Sprout, TreePine, Flower2, CloudSun, CloudRain, CloudSnow, CloudLightning, Thermometer, Droplets } from "lucide-react";
import { createKitIcon } from "./create-kit-icon.js";
import { LeafMotion } from "./animated-icons/leaf.js";
import { TreePineMotion } from "./animated-icons/tree-pine.js";
import { CloudSunMotion } from "./animated-icons/cloud-sun.js";
import { CloudRainMotion } from "./animated-icons/cloud-rain.js";
import { CloudSnowMotion } from "./animated-icons/cloud-snow.js";
import { CloudLightningMotion } from "./animated-icons/cloud-lightning.js";
import { ThermometerMotion } from "./animated-icons/thermometer.js";

export const LeafIcon = /* @__PURE__ */ createKitIcon(Leaf, "LeafIcon", LeafMotion);
export const SproutIcon = /* @__PURE__ */ createKitIcon(Sprout, "SproutIcon", "columns");
export const TreePineIcon = /* @__PURE__ */ createKitIcon(TreePine, "TreePineIcon", TreePineMotion);
export const Flower2Icon = /* @__PURE__ */ createKitIcon(Flower2, "Flower2Icon", "turn");
export const CloudSunIcon = /* @__PURE__ */ createKitIcon(CloudSun, "CloudSunIcon", CloudSunMotion);
export const CloudRainIcon = /* @__PURE__ */ createKitIcon(CloudRain, "CloudRainIcon", CloudRainMotion);
export const CloudSnowIcon = /* @__PURE__ */ createKitIcon(CloudSnow, "CloudSnowIcon", CloudSnowMotion);
export const CloudLightningIcon = /* @__PURE__ */ createKitIcon(CloudLightning, "CloudLightningIcon", CloudLightningMotion);
export const ThermometerIcon = /* @__PURE__ */ createKitIcon(Thermometer, "ThermometerIcon", ThermometerMotion);
export const DropletsIcon = /* @__PURE__ */ createKitIcon(Droplets, "DropletsIcon", "columns");
