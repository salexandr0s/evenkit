"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const ARROW_VARIANTS: Variants = {
    normal: { y: 0 },
    animate: {
        y: 2,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
export function DownloadMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <motion.g animate={controls} variants={ARROW_VARIANTS} initial="normal" transition={iconTransition}>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" x2="12" y1="15" y2="3"/>
          </motion.g>
        </g>);
}
