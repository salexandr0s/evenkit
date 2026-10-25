"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const ICON_VARIANTS: Variants = {
    normal: {
        scale: 1,
        rotate: 0
    },
    animate: {
        scale: 1.05,
        rotate: [0, -7, 7, 0],
        transition: {
            rotate: {
                duration: iconDuration * 2,
                ease: iconEase
            },
            scale: {
                duration: iconDuration,
                ease: iconEase
            }
        }
    }
};
export function MessageSquareMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} variants={ICON_VARIANTS} initial="normal" transition={iconTransition}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </motion.g>);
}
