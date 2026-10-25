"use client";

import { Heart, HeartPulse, Stethoscope, Pill, Syringe, Hospital, Cross, Dumbbell, Footprints, Brain } from "lucide-react";
import { createKitIcon } from "./create-kit-icon.js";
import { HeartMotion } from "./animated-icons/heart.js";
import { HeartPulseMotion } from "./animated-icons/heart-pulse.js";
import { StethoscopeMotion } from "./animated-icons/stethoscope.js";
import { BrainMotion } from "./animated-icons/brain.js";

export const HeartIcon = /* @__PURE__ */ createKitIcon(Heart, "HeartIcon", HeartMotion);
export const HeartPulseIcon = /* @__PURE__ */ createKitIcon(HeartPulse, "HeartPulseIcon", HeartPulseMotion);
export const StethoscopeIcon = /* @__PURE__ */ createKitIcon(Stethoscope, "StethoscopeIcon", StethoscopeMotion);
export const PillIcon = /* @__PURE__ */ createKitIcon(Pill, "PillIcon", "turn");
export const SyringeIcon = /* @__PURE__ */ createKitIcon(Syringe, "SyringeIcon", "write");
export const HospitalIcon = /* @__PURE__ */ createKitIcon(Hospital, "HospitalIcon", "pulse");
export const CrossIcon = /* @__PURE__ */ createKitIcon(Cross, "CrossIcon", "pulse");
export const DumbbellIcon = /* @__PURE__ */ createKitIcon(Dumbbell, "DumbbellIcon", "turn");
export const FootprintsIcon = /* @__PURE__ */ createKitIcon(Footprints, "FootprintsIcon", "swap-y");
export const BrainIcon = /* @__PURE__ */ createKitIcon(Brain, "BrainIcon", BrainMotion);
