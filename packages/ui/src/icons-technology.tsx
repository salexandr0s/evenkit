"use client";

import { Monitor, Laptop, Smartphone, Tablet, Camera, Video, Headphones, Mic, Wifi, Bluetooth, Database, CodeXml } from "lucide-react";
import { createKitIcon } from "./create-kit-icon.js";
import { MicMotion } from "./animated-icons/mic.js";
import { WifiMotion } from "./animated-icons/wifi.js";
import { BluetoothMotion } from "./animated-icons/bluetooth.js";

export const MonitorIcon = /* @__PURE__ */ createKitIcon(Monitor, "MonitorIcon", "pulse");
export const LaptopIcon = /* @__PURE__ */ createKitIcon(Laptop, "LaptopIcon", "pulse");
export const SmartphoneIcon = /* @__PURE__ */ createKitIcon(Smartphone, "SmartphoneIcon", "turn");
export const TabletIcon = /* @__PURE__ */ createKitIcon(Tablet, "TabletIcon", "turn");
export const CameraIcon = /* @__PURE__ */ createKitIcon(Camera, "CameraIcon", "detail");
export const VideoIcon = /* @__PURE__ */ createKitIcon(Video, "VideoIcon", "pulse");
export const HeadphonesIcon = /* @__PURE__ */ createKitIcon(Headphones, "HeadphonesIcon", "pulse");
export const MicIcon = /* @__PURE__ */ createKitIcon(Mic, "MicIcon", MicMotion);
export const WifiIcon = /* @__PURE__ */ createKitIcon(Wifi, "WifiIcon", WifiMotion);
export const BluetoothIcon = /* @__PURE__ */ createKitIcon(Bluetooth, "BluetoothIcon", BluetoothMotion);
export const DatabaseIcon = /* @__PURE__ */ createKitIcon(Database, "DatabaseIcon", "columns");
export const CodeXmlIcon = /* @__PURE__ */ createKitIcon(CodeXml, "CodeXmlIcon", "swap-x");
