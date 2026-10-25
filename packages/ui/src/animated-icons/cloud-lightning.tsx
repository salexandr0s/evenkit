"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

export function CloudLightningMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
        <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/>
        <motion.path animate={controls} d="m13 12-3 5h4l-3 5" variants={{
            normal: { opacity: 1 },
            animate: {
                opacity: [1, 0.4, 1],
                transition: {
                    duration: iconDuration * 3,
                    ease: iconEase
                }
            }
        }} initial="normal" transition={iconTransition}/>
      </g>);
}
