"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const LEAF_VARIANTS: Variants = {
    normal: {
        rotate: 0,
        y: 0,
        x: 0
    },
    animate: {
        rotate: [0, -8, 4, -3, 0],
        y: [0, -4, -2, -1, 0],
        x: [0, 2, -2, 1, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase
        }
    }
};
export function LeafMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} style={{ overflow: "visible" }} variants={LEAF_VARIANTS} initial="normal" transition={iconTransition}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </motion.g>);
}
