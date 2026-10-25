"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const DOT_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (index: number) => ({
    opacity: [1, 0.15, 1],
    transition: { ...iconTransition, delay: index * iconDuration / 4 },
  }),
};
export function ChartScatterMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <motion.circle custom={0} cx="7.5" cy="7.5" fill="currentColor" r=".5" variants={DOT_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
        <motion.circle custom={1} cx="18.5" cy="5.5" fill="currentColor" r=".5" variants={DOT_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
        <motion.circle custom={2} cx="11.5" cy="11.5" fill="currentColor" r=".5" variants={DOT_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
        <motion.circle custom={3} cx="7.5" cy="16.5" fill="currentColor" r=".5" variants={DOT_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
        <motion.circle custom={4} cx="17.5" cy="14.5" fill="currentColor" r=".5" variants={DOT_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
        <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
      </g>);
}
