"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: { d: "M5 12h14" },
    animate: {
        d: ["M5 12h14", "M5 12h9", "M5 12h14"],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
const SECONDARY_PATH_VARIANTS: Variants = {
    normal: { d: "m12 5 7 7-7 7", translateX: 0 },
    animate: {
        d: "m12 5 7 7-7 7",
        translateX: [0, -3, 0],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
export function ArrowRightMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M5 12h14" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="m12 5 7 7-7 7" variants={SECONDARY_PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
