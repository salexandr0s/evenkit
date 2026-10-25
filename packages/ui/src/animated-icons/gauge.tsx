"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const DEFAULT_TRANSITION: Transition = {
    duration: iconDuration,
    ease: iconEase
};
export function GaugeMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="m12 14 4-4" transition={DEFAULT_TRANSITION} variants={{
            animate: { translateX: 0.5, translateY: 3, rotate: 72 },
            normal: {
                translateX: 0,
                rotate: 0,
                translateY: 0
            }
        }} initial="normal"/>
          <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
        </g>);
}
