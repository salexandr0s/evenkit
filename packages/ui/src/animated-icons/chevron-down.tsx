"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const DEFAULT_TRANSITION: Transition = {
    times: [0, 0.4, 1],
    duration: iconDuration * 2,
    ease: iconEase
};
export function ChevronDownMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="m6 9 6 6 6-6" transition={DEFAULT_TRANSITION} variants={{
            normal: { y: 0 },
            animate: { y: [0, 2, 0] }
        }} initial="normal"/>
        </g>);
}
