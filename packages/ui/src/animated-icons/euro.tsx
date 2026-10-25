"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const EURO_MAIN_VARIANTS: Variants = {
    normal: {
        opacity: 1,
        pathLength: 1,
        transition: {
            duration: iconDuration,
            opacity: { duration: iconDuration, ease: iconEase },
            ease: iconEase
        }
    },
    animate: {
        opacity: [0, 1],
        pathLength: [0, 1],
        transition: {
            duration: iconDuration * 2,
            opacity: { duration: iconDuration, ease: iconEase },
            ease: iconEase
        }
    }
};
const EURO_SECONDARY_VARIANTS: Variants = {
    normal: {
        opacity: 1,
        pathLength: 1,
        pathOffset: 0,
        transition: {
            delay: (iconDuration * 0.75),
            duration: iconDuration,
            opacity: { duration: iconDuration, delay: (iconDuration * 0.75), ease: iconEase },
            ease: iconEase
        }
    },
    animate: {
        opacity: [0, 1],
        pathLength: [0, 1],
        pathOffset: [1, 0],
        transition: {
            delay: (iconDuration * 1.25),
            duration: iconDuration,
            opacity: { duration: iconDuration, delay: (iconDuration * 1.25), ease: iconEase },
            ease: iconEase
        }
    }
};
export function EuroMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" variants={EURO_MAIN_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M16 10h-12" variants={EURO_SECONDARY_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M13 14h-9" variants={EURO_SECONDARY_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
