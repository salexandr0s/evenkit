"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const JAPANESE_YEN_MAIN_VARIANTS: Variants = {
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
const JAPANESE_YEN_SECONDARY_VARIANTS: Variants = {
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
export function JapaneseYenMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3" variants={JAPANESE_YEN_MAIN_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M18 11h-12" variants={JAPANESE_YEN_SECONDARY_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M18 15h-12" variants={JAPANESE_YEN_SECONDARY_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
