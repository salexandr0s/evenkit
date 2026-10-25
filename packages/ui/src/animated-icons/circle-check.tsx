"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
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
            duration: iconDuration,
            opacity: { duration: iconDuration, ease: iconEase },
            ease: iconEase
        }
    }
};
export function CircleCheckMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <circle cx="12" cy="12" r="10"/>
          <motion.path animate={controls} d="m9 12 2 2 4-4" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
