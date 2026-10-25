"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const SVG_VARIANTS: Variants = {
    normal: {
        rotate: 0
    },
    animate: {
        rotate: [0, -10, 10, -5, 5, 0]
    }
};
const SVG_TRANSITION: Transition = {
    duration: iconDuration * 3,
    ease: iconEase
};
export function MoonMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} transition={SVG_TRANSITION} variants={SVG_VARIANTS} initial="normal">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </motion.g>);
}
