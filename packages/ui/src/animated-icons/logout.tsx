"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: { x: 0, translateX: 0 },
    animate: {
        x: [0, 2, 0],
        translateX: [0, -3, 0],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
export function LogOutMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <motion.polyline animate={controls} points="16 17 21 12 16 7" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.line animate={controls} variants={PATH_VARIANTS} x1="21" x2="9" y1="12" y2="12" initial="normal" transition={iconTransition}/>
        </g>);
}
