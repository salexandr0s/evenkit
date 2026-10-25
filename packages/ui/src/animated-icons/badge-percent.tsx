"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: {
        rotate: 0,
        transition: {
            duration: iconDuration * 2,
            ease: iconEase
        }
    },
    animate: {
        rotate: 180,
        transition: {
            delay: (iconDuration * 0.25),
            duration: iconDuration,
            ease: iconEase
        }
    }
};
export function BadgePercentMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <motion.path animate={controls} d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        <path d="m15 9-6 6"/>
        <path d="M9 9h.01"/>
        <path d="M15 15h.01"/>
      </g>);
}
