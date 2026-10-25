"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: { d: "m12 19-7-7 7-7", translateX: 0 },
    animate: {
        d: "m12 19-7-7 7-7",
        translateX: [0, 3, 0],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
const SECOND_PATH_VARIANTS: Variants = {
    normal: { d: "M19 12H5" },
    animate: {
        d: ["M19 12H5", "M19 12H10", "M19 12H5"],
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    }
};
export function ArrowLeftMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="m12 19-7-7 7-7" variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M19 12H5" variants={SECOND_PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
