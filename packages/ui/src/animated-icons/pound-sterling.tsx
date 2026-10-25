"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const POUND_MAIN_VARIANTS: Variants = {
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
const POUND_SECONDARY_VARIANTS: Variants = {
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
export function PoundSterlingMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <motion.path animate={controls} d="M18 7c0-5.333-8-5.333-8 0" variants={POUND_MAIN_VARIANTS} initial="normal" transition={iconTransition}/>
        <motion.path animate={controls} d="M10 7v14" variants={POUND_MAIN_VARIANTS} initial="normal" transition={iconTransition}/>
        <motion.path animate={controls} d="M18 21h-12" variants={POUND_SECONDARY_VARIANTS} initial="normal" transition={iconTransition}/>
        <motion.path animate={controls} d="M16 13h-10" variants={POUND_SECONDARY_VARIANTS} initial="normal" transition={iconTransition}/>
      </g>);
}
