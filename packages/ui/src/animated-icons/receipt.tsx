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
export function ReceiptMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} initial="normal" transition={iconTransition}>
          <motion.path animate={controls} d="M12 17V7" variants={DOLLAR_SECONDARY_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" variants={DOLLAR_MAIN_VARIANTS} initial="normal" transition={iconTransition}/>
          <path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"/>
        </motion.g>);
}
