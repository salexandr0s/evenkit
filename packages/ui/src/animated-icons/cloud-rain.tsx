"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const RAIN_CHILD_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (index: number) => ({
    opacity: [1, 0.25, 1],
    transition: { ...iconTransition, duration: iconDuration * 2, delay: index * iconDuration / 4 },
  }),
};
export function CloudRainMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
          <g>
            <motion.path custom={0} d="M16 14v6" variants={RAIN_CHILD_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
            <motion.path custom={1} d="M8 14v6" variants={RAIN_CHILD_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
            <motion.path custom={2} d="M12 16v6" variants={RAIN_CHILD_VARIANTS} animate={controls} initial="normal" transition={iconTransition}/>
          </g>
        </g>);
}
