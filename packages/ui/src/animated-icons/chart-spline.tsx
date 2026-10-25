"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const VARIANTS: Variants = {
    normal: {
        pathLength: 1,
        opacity: 1
    },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: {
            delay: (iconDuration * 0.375),
            duration: iconDuration,
            opacity: { delay: (iconDuration * 0.25), duration: iconDuration, ease: iconEase },
            ease: iconEase
        }
    }
};
export function ChartSplineMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M3 3v16a2 2 0 0 0 2 2h16"/>
          <motion.path animate={controls} d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" variants={VARIANTS} initial="normal" transition={iconTransition}/>
        </g>);
}
