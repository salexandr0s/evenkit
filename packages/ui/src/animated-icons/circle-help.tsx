"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const VARIANTS: Variants = {
    normal: { rotate: 0 },
    animate: { rotate: [0, -10, 10, -10, 0] }
};
export function CircleHelpMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <circle cx="12" cy="12" r="10"/>
          <motion.g animate={controls} transition={{
            duration: iconDuration * 2,
            ease: iconEase
        }} variants={VARIANTS} initial="normal">
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </motion.g>
        </g>);
}
