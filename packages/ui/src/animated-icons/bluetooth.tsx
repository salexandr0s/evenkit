"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, type AnimatedGlyphProps } from "./motion.js";

const PATH_VARIANTS: Variants = {
    normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        pathOffset: [1, 0]
    }
};
export function BluetoothMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <motion.path animate={controls} d="m7 7 10 10-5 5V2l5 5L7 17" transition={{ duration: iconDuration, ease: iconEase }} variants={PATH_VARIANTS} initial="normal"/>
          <motion.path animate={controls} d="M14.5 9.5 17 7l-5-5v4.5" transition={{ duration: iconDuration, ease: iconEase }} variants={PATH_VARIANTS} initial="normal"/>
        </g>);
}
