"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const DEFAULT_TRANSITION: Transition = {
    times: [0, 0.4, 1],
    duration: iconDuration * 2,
    ease: iconEase
};
export function ChevronRightMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <motion.path animate={controls} d="m9 18 6-6-6-6" transition={DEFAULT_TRANSITION} variants={{
            normal: { x: 0 },
            animate: { x: [0, 2, 0] }
        }} initial="normal"/>
      </g>);
}
