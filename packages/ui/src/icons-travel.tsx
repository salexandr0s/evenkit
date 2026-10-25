"use client";

import { MapPin, Map, Navigation, Compass, Plane, TrainFront, Bus, Car, Bike, Ship, Hotel, Luggage } from "lucide-react";
import { createKitIcon } from "./create-kit-icon.js";
import { MapPinMotion } from "./animated-icons/map-pin.js";
import { CompassMotion } from "./animated-icons/compass.js";
import { PlaneMotion } from "./animated-icons/airplane.js";
import { CarMotion } from "./animated-icons/car.js";
import { ShipMotion } from "./animated-icons/ship.js";

export const MapPinIcon = /* @__PURE__ */ createKitIcon(MapPin, "MapPinIcon", MapPinMotion);
export const MapIcon = /* @__PURE__ */ createKitIcon(Map, "MapIcon", "pulse");
export const NavigationIcon = /* @__PURE__ */ createKitIcon(Navigation, "NavigationIcon", "turn");
export const CompassIcon = /* @__PURE__ */ createKitIcon(Compass, "CompassIcon", CompassMotion);
export const PlaneIcon = /* @__PURE__ */ createKitIcon(Plane, "PlaneIcon", PlaneMotion);
export const TrainFrontIcon = /* @__PURE__ */ createKitIcon(TrainFront, "TrainFrontIcon", "columns");
export const BusIcon = /* @__PURE__ */ createKitIcon(Bus, "BusIcon", "rows");
export const CarIcon = /* @__PURE__ */ createKitIcon(Car, "CarIcon", CarMotion);
export const BikeIcon = /* @__PURE__ */ createKitIcon(Bike, "BikeIcon", "rows");
export const ShipIcon = /* @__PURE__ */ createKitIcon(Ship, "ShipIcon", ShipMotion);
export const HotelIcon = /* @__PURE__ */ createKitIcon(Hotel, "HotelIcon", "dots");
export const LuggageIcon = /* @__PURE__ */ createKitIcon(Luggage, "LuggageIcon", "turn");
