"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const LINE_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: (index: number) => ({
    pathLength: [0, 1], opacity: [0, 1],
    transition: { ...iconTransition, delay: index * iconDuration / 4 },
  }),
};
export function ChartColumnIncreasingMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <motion.path animate={controls} custom={1} d="M13 17V9" variants={LINE_VARIANTS} initial="normal" transition={iconTransition}/>
        <motion.path animate={controls} custom={2} d="M18 17V5" variants={LINE_VARIANTS} initial="normal" transition={iconTransition}/>
        <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
        <motion.path animate={controls} custom={0} d="M8 17v-3" variants={LINE_VARIANTS} initial="normal" transition={iconTransition}/>
      </g>);
}
