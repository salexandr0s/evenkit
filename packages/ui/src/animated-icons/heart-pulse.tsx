"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const HEART_DRAW_VARIANTS: Variants = {
    normal: { pathLength: 1, opacity: 1 },
    animate: { pathLength: [0, 1], opacity: [0, 1], transition: { ...iconTransition, delay: iconDuration } }
};
const HEART_PULSE_VARIANTS: Variants = {
    normal: { scale: 1 },
    animate: { scale: [1, 1.08, 1], transition: { ...iconTransition, delay: iconDuration * 2, duration: iconDuration * 2 } }
};
const LINE_VARIANTS: Variants = {
    normal: { pathLength: 1, pathOffset: 0, opacity: 1 },
    animate: { pathLength: [0, 1], pathOffset: [1, 0], opacity: [0, 1] }
};
export function HeartPulseMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.g animate={controls} style={{ originX: "12px", originY: "12px" }} variants={HEART_PULSE_VARIANTS} initial="normal" transition={iconTransition}>
            <motion.path animate={controls} d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" variants={HEART_DRAW_VARIANTS} initial="normal" transition={iconTransition}/>
          </motion.g>
          <motion.path animate={controls} d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" variants={LINE_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
