"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const LINE_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: (index: number) => ({
    pathLength: [1, 0, 1], opacity: [1, 0.4, 1],
    transition: { ...iconTransition, delay: index * iconDuration / 4 },
  }),
};
export function ReceiptTextMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"/>
          <g>
            <motion.path custom={0} d="M8 8H14" variants={LINE_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
            <motion.path custom={1} d="M8 12H16" variants={LINE_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
            <motion.path custom={2} d="M8 16H13" variants={LINE_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
          </g>
        </g>);
}
