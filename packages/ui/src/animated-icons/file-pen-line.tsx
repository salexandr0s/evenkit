"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PEN_VARIANTS: Variants = {
    normal: {
        rotate: 0,
        x: 0,
        y: 0
    },
    animate: {
        rotate: [-0.3, 0.2, -0.4],
        x: [0, -0.5, 1, 0],
        y: [0, 1, -0.5, 0],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase
        }
    }
};
export function FilePenLineMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/>
          <motion.path animate={controls} d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" variants={PEN_VARIANTS} initial="normal" transition={iconTransition}/>
          <motion.path animate={controls} d="M8 18h1" transition={{ duration: iconDuration * 2, ease: iconEase }} variants={{
            normal: { d: "M8 18h1" },
            animate: { d: "M8 18h5" }
        }} initial="normal"/>
        </g>);
}
