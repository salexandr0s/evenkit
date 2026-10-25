"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: {
        y: 0,
        opacity: 1
    },
    animate: (custom: number) => ({
        y: -3,
        opacity: [0, 1, 0],
        transition: {
            duration: iconDuration * 3,
            ease: iconEase,
            delay: (iconDuration * 0.5) * custom
        }
    })
};
export function CoffeeMotion({ controls }: AnimatedGlyphProps) {
    return (<g style={{ overflow: "visible" }}>
          <motion.path animate={controls} custom={0.2} d="M10 2v2" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} custom={0.4} d="M14 2v2" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} custom={0} d="M6 2v2" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>
        </g>);
}
