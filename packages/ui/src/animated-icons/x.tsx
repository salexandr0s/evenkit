"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: {
        opacity: 1,
        pathLength: 1
    },
    animate: {
        opacity: [0, 1],
        pathLength: [0, 1]
    }
};
export function XMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M18 6 6 18" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="m6 6 12 12" transition={{ ...iconTransition, delay: iconDuration / 2 }} variants={PATH_VARIANTS} initial="normal"/>
        </g>);
}
