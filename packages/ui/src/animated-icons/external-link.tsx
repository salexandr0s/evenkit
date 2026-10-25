"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const ARROW_VARIANTS: Variants = {
    normal: {
        scale: 1,
        translateX: 0,
        translateY: 0
    },
    animate: {
        scale: [1, 0.92, 1],
        translateX: [0, 2, 0],
        translateY: [0, -2, 0],
        originX: 1,
        originY: 0,
        transition: {
            duration: iconDuration * 2,
            ease: iconEase
        }
    }
};
export function ExternalLinkMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <motion.g animate={controls} variants={ARROW_VARIANTS} initial="normal" transition={iconTransition}>
          <path d="M15 3h6v6"/>
          <path d="M10 14 21 3"/>
        </motion.g>
      </g>);
}
