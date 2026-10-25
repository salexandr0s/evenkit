"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
    animate: {
        pathLength: [0, 2],
        opacity: [0, 1],
        pathOffset: [0, 2],
        transition: { duration: iconDuration * 2, ease: iconEase }
    }
};
export function EyeOffMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
          <motion.path animate={controls} d="m2 2 20 20" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
