"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Transition } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const DEFAULT_TRANSITION: Transition = {
    duration: iconDuration,
    ease: iconEase
};
export function CopyMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.rect animate={controls} height="14" rx="2" ry="2" transition={DEFAULT_TRANSITION} variants={{
            normal: { translateY: 0, translateX: 0 },
            animate: { translateY: -3, translateX: -3 }
        }} width="14" x="8" y="8" initial="normal"/>
          <motion.path animate={controls} d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" transition={DEFAULT_TRANSITION} variants={{
            normal: { x: 0, y: 0 },
            animate: { x: 3, y: 3 }
        }} initial="normal"/>
        </g>);
}
