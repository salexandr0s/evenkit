"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const SVG_VARIANTS: Variants = {
    normal: { rotate: 0 },
    animate: { rotate: [0, -10, 10, -10, 0] }
};
export function BellMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} transition={{
            duration: iconDuration * 2,
            ease: iconEase
        }} variants={SVG_VARIANTS} initial="normal">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </motion.g>);
}
