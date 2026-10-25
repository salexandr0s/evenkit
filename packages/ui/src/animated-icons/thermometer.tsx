"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: {
        rotate: 0
    },
    animate: {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: {
            duration: iconDuration,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: iconEase
        }
    }
};
export function ThermometerMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" style={{ transformOrigin: "center" }} variants={PATH_VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
