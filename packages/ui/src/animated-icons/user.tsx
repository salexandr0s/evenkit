"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANT: Variants = {
    normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        pathOffset: [1, 0]
    }
};
const CIRCLE_VARIANT: Variants = {
    normal: {
        pathLength: 1,
        pathOffset: 0,
        scale: 1
    },
    animate: {
        pathLength: [0, 1],
        pathOffset: [1, 0],
        scale: [0.5, 1]
    }
};
export function UserMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.circle animate={controls} cx="12" cy="8" r="5" variants={CIRCLE_VARIANT} initial="normal" transition={iconTransition}/>

          <motion.path animate={controls} d="M20 21a8 8 0 0 0-16 0" transition={{
            delay: (iconDuration / 2),
            duration: iconDuration,
            ease: iconEase
        }} variants={PATH_VARIANT} initial="normal"/>
        </g>);
}
