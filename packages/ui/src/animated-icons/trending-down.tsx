"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const SVG_VARIANTS: Variants = {
    normal: { x: 0, y: 0, translateX: 0, translateY: 0 },
    animate: {
        x: 0,
        y: 0,
        translateX: [0, 2, 0],
        translateY: [0, 2, 0],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase
        }
    }
};
const PATH_VARIANTS: Variants = {
    normal: {
        opacity: 1,
        pathLength: 1,
        pathOffset: 0,
        transition: {
            duration: iconDuration,
            opacity: { duration: iconDuration, ease: iconEase },
            ease: iconEase
        }
    },
    animate: {
        opacity: [0, 1],
        pathLength: [0, 1],
        pathOffset: [1, 0],
        transition: {
            duration: iconDuration,
            opacity: { duration: iconDuration, ease: iconEase },
            ease: iconEase
        }
    }
};
const ARROW_VARIANTS: Variants = {
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
        pathOffset: [0.5, 0],
        transition: {
            delay: (iconDuration * 0.75),
            duration: iconDuration,
            opacity: { duration: iconDuration, delay: (iconDuration * 0.75), ease: iconEase },
            ease: iconEase
        }
    }
};
export function TrendingDownMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} variants={SVG_VARIANTS} initial="normal" transition={iconTransition}>
        <motion.polyline animate={controls} points="22 17 13.5 8.5 8.5 13.5 2 7" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        <motion.polyline animate={controls} points="16 17 22 17 22 11" variants={ARROW_VARIANTS} initial="normal" transition={iconTransition}/>
      </motion.g>);
}
