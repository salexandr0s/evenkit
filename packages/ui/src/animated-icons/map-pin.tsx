"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const SVG_VARIANTS: Variants = {
    normal: {
        y: 0
    },
    animate: {
        y: [0, -5, -3],
        transition: {
            duration: iconDuration * 2,
            times: [0, 0.6, 1],
            ease: iconEase
        }
    }
};
const CIRCLE_VARIANTS: Variants = {
    normal: {
        opacity: 1,
        pathLength: 1,
        pathOffset: 0
    },
    animate: {
        opacity: [0, 1],
        pathLength: [0, 1],
        pathOffset: [0.5, 0],
        transition: {
            delay: (iconDuration * 0.75),
            duration: iconDuration * 2,
            opacity: { duration: iconDuration, delay: (iconDuration * 0.75), ease: iconEase },
            ease: iconEase
        }
    }
};
export function MapPinMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} variants={SVG_VARIANTS} initial="normal" transition={iconTransition}>
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
          <motion.circle animate={controls} cx="12" cy="10" r="3" variants={CIRCLE_VARIANTS} initial="normal" transition={iconTransition}/>
        </motion.g>);
}
