"use client";

import { ShoppingCart, ShoppingBag, ShoppingBasket, Store, Tag, Ticket, Gift, Package, PackageCheck, Truck, ScanBarcode, QrCode } from "lucide-react";
import { createKitIcon } from "./create-kit-icon.js";
import { TicketMotion } from "./animated-icons/ticket.js";
import { TruckMotion } from "./animated-icons/truck.js";

export const ShoppingCartIcon = /* @__PURE__ */ createKitIcon(ShoppingCart, "ShoppingCartIcon", "rows");
export const ShoppingBagIcon = /* @__PURE__ */ createKitIcon(ShoppingBag, "ShoppingBagIcon", "turn");
export const ShoppingBasketIcon = /* @__PURE__ */ createKitIcon(ShoppingBasket, "ShoppingBasketIcon", "pulse");
export const StoreIcon = /* @__PURE__ */ createKitIcon(Store, "StoreIcon", "pulse");
export const TagIcon = /* @__PURE__ */ createKitIcon(Tag, "TagIcon", "turn");
export const TicketIcon = /* @__PURE__ */ createKitIcon(Ticket, "TicketIcon", TicketMotion);
export const GiftIcon = /* @__PURE__ */ createKitIcon(Gift, "GiftIcon", "lid");
export const PackageIcon = /* @__PURE__ */ createKitIcon(Package, "PackageIcon", "turn");
export const PackageCheckIcon = /* @__PURE__ */ createKitIcon(PackageCheck, "PackageCheckIcon", "pulse");
export const TruckIcon = /* @__PURE__ */ createKitIcon(Truck, "TruckIcon", TruckMotion);
export const ScanBarcodeIcon = /* @__PURE__ */ createKitIcon(ScanBarcode, "ScanBarcodeIcon", "rows");
export const QrCodeIcon = /* @__PURE__ */ createKitIcon(QrCode, "QrCodeIcon", "dots");
