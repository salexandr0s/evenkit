"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const SWAY_VARIANTS: Variants = {
    normal: {
        rotate: 0,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        rotate: [0, 4, -3, 2, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase,
            times: [0, 0.25, 0.5, 0.75, 1]
        }
    }
};
export function BriefcaseBusinessMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} style={{ transformOrigin: "12px 4px" }} variants={SWAY_VARIANTS} initial="normal" transition={iconTransition}>
        <path d="M12 12h.01"/>
        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <path d="M22 13a18.15 18.15 0 0 1-20 0"/>
        <rect height="14" rx="2" width="20" x="2" y="6"/>
      </motion.g>);
}
