"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const CHECK_VARIANTS: Variants = {
    normal: {
        pathLength: 1,
        opacity: 1,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: {
            pathLength: { duration: iconDuration, ease: iconEase },
            opacity: { duration: iconDuration, ease: iconEase }
        }
    }
};
export function UserCheckMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <motion.path animate={controls} d="M16 11L18 13L22 9" style={{ transformOrigin: "center" }} variants={CHECK_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
