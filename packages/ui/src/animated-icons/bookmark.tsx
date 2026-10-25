"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const BOOKMARK_VARIANTS: Variants = {
    normal: { scaleY: 1, scaleX: 1 },
    animate: {
        scaleY: [1, 1.3, 0.9, 1.05, 1],
        scaleX: [1, 0.9, 1.1, 0.95, 1],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase
        }
    }
};
export function BookmarkMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" style={{ originY: 0.5, originX: 0.5 }} variants={BOOKMARK_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
