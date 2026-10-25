"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const DEFAULT_TRANSITION: Transition = {
    duration: iconDuration,
    ease: iconEase
};
export function ChevronsUpDownMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <motion.path animate={controls} d="m7 15 5 5 5-5" transition={DEFAULT_TRANSITION} variants={{
            normal: { translateY: "0%" },
            animate: { translateY: "2px" }
        }} initial="normal"/>
        <motion.path animate={controls} d="m7 9 5-5 5 5" transition={DEFAULT_TRANSITION} variants={{
            normal: { translateY: "0%" },
            animate: { translateY: "-2px" }
        }} initial="normal"/>
      </g>);
}
