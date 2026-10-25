"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const DEFAULT_TRANSITION: Transition = {
    times: [0, 0.4, 1],
    duration: iconDuration * 2,
    ease: iconEase
};
const PATH_VARIANTS: Variants = {
    normal: { x: 0 },
    animate: { x: [0, -1.5, 0] }
};
export function PanelLeftCloseMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <rect height="18" rx="2" width="18" x="3" y="3"/>
        <path d="M9 3v18"/>
        <motion.path animate={controls} d="m16 15-3-3 3-3" transition={DEFAULT_TRANSITION} variants={PATH_VARIANTS} initial="normal"/>
      </g>);
}
