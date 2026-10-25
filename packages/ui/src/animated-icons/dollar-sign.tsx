"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const DOLLAR_MAIN_VARIANTS: Variants = {
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
const DOLLAR_SECONDARY_VARIANTS: Variants = {
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
export function DollarSignMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" variants={DOLLAR_MAIN_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M12 22 L12 2" variants={DOLLAR_SECONDARY_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
