"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const VARIANTS: Variants = {
    normal: {
        y: 0,
        rotate: 0,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        y: [0, -3, 0],
        rotate: [0, -4, 0],
        transition: {
            duration: iconDuration * 2,
            ease: iconEase,
            times: [0, 0.45, 1]
        }
    }
};
export function WalletMotion({ controls }: AnimatedGlyphProps) {
    return (<motion.g animate={controls} style={{ transformOrigin: "12px 12px" }} variants={VARIANTS} initial="normal" transition={iconTransition}>
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
        </motion.g>);
}
