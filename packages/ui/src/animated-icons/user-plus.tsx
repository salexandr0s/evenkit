"use client";

// Adapted from lucide-animated (MIT), commit 4662fff2b60fdcf4751b32013606756caf7c4c26.
import { motion, type Variants } from "motion/react";
import { iconDuration, iconEase, iconTransition, type AnimatedGlyphProps } from "./motion.js";

const PLUS_VARIANTS: Variants = {
    normal: {
        scale: 1,
        rotate: 0,
        opacity: 1,
        transition: {
            duration: iconDuration,
            ease: iconEase
        }
    },
    animate: {
        scale: [0, 1.15, 1],
        rotate: [-90, 0, 0],
        opacity: [0, 1, 1],
        transition: {
            delay: iconDuration,
            duration: iconDuration * 2,
            ease: iconEase,
            times: [0, 0.7, 1]
        }
    }
};
export function UserPlusMotion({ controls }: AnimatedGlyphProps) {
    return (<g>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <motion.g animate={controls} style={{ transformOrigin: "19px 11px" }} variants={PLUS_VARIANTS} initial="normal" transition={iconTransition}>
            <line x1="19" x2="19" y1="8" y2="14"/>
            <line x1="22" x2="16" y1="11" y2="11"/>
          </motion.g>
        </g>);
}
