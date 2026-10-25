"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const DEFAULT_TRANSITION: Transition = {
    duration: iconDuration,
    ease: iconEase
};
export function MinimizeMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M8 3v3a2 2 0 0 1-2 2H3" transition={DEFAULT_TRANSITION} variants={{
            normal: { translateX: "0%", translateY: "0%" },
            animate: { translateX: "2px", translateY: "2px" }
        }} initial="normal"/>
          <motion.path animate={controls} d="M21 8h-3a2 2 0 0 1-2-2V3" transition={DEFAULT_TRANSITION} variants={{
            normal: { translateX: "0%", translateY: "0%" },
            animate: { translateX: "-2px", translateY: "2px" }
        }} initial="normal"/>
          <motion.path animate={controls} d="M3 16h3a2 2 0 0 1 2 2v3" transition={DEFAULT_TRANSITION} variants={{
            normal: { translateX: "0%", translateY: "0%" },
            animate: { translateX: "2px", translateY: "-2px" }
        }} initial="normal"/>
          <motion.path animate={controls} d="M16 21v-3a2 2 0 0 1 2-2h3" transition={DEFAULT_TRANSITION} variants={{
            normal: { translateX: "0%", translateY: "0%" },
            animate: { translateX: "-2px", translateY: "-2px" }
        }} initial="normal"/>
        </g>);
}
