"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: { translateX: 0, translateY: 0 },
    animate: { translateX: 1.1, translateY: -1.1 }
};
export function ChartPieMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" transition={{
            duration: iconDuration,
            ease: iconEase
        }} variants={PATH_VARIANTS} initial="normal"/>
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
        </g>);
}
