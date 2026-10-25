"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: {
        translateX: 0,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        translateX: [-6, 0],
        transition: {
            delay: (iconDuration / 4),
            duration: iconDuration,
            ease: iconEase
        }
    }
};
export function UsersMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <motion.path animate={controls} d="M22 21v-2a4 4 0 0 0-3-3.87" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M16 3.13a4 4 0 0 1 0 7.75" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
