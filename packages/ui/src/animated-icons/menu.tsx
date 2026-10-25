"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const LINE_VARIANTS: Variants = {
    normal: {
        rotate: 0,
        y: 0,
        opacity: 1
    },
    animate: (custom: number) => ({
        rotate: [0, custom === 1 ? 12 : custom === 3 ? -12 : 0, 0],
        y: [0, custom === 1 ? 1 : custom === 3 ? -1 : 0, 0],
        opacity: [1, custom === 2 ? 0.5 : 1, 1],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    })
};
export function MenuMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.line animate={controls} custom={1} variants={LINE_VARIANTS} x1="4" x2="20" y1="6" y2="6" initial="normal" transition={iconTransition}/>
          <motion.line animate={controls} custom={2} variants={LINE_VARIANTS} x1="4" x2="20" y1="12" y2="12" initial="normal" transition={iconTransition}/>
          <motion.line animate={controls} custom={3} variants={LINE_VARIANTS} x1="4" x2="20" y1="18" y2="18" initial="normal" transition={iconTransition}/>
        </g>);
}
